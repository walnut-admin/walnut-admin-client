# AI 组件代码审查

> 2026-06-04

本文档按**纯 AI 设计**和**业务设计**两大章节组织，分别审查通用 AI 对话框架层和无人机业务定制层。

---

# 第一章：纯 AI 设计

> 审查范围：AI 对话壳层框架 — store（对话、流式）、core/chat/header/message/ui 组件、types（IAIMessage/IAIConversation）、config（常量/面板）、utils（缓存/格式化/高亮）、prompts（系统提示词构建）

## 摘要

| 类别 | 数量 | 说明 |
|------|------|------|
| 严重 | 1 | DeepSeek API Key 硬编码 |
| 高 | 3 | 存储校验、i18n、userSelect 泄漏 |
| 中 | 1 | 暗色模式适配 |
| 低 | 1 | Props 规范偏离 |

## 严重

### A1 — DeepSeek API Key 硬编码在源码中

**文件**: [deepseek.ts](../../../api/ai/deepseek.ts#L18)

```typescript
const DEEPSEEK_API_KEY = 'sk-4a2881e3177b49578348fb95c4129b7d'
```

API Key 明文硬编码已提交到 Git 仓库。任何有仓库访问权限的人都可以使用该 Key 调用 DeepSeek API，存在资费被盗用和信息安全风险。

**建议**: 移至 `.env`（`VITE_DEEPSEEK_API_KEY`），`deepseek.ts` 改为 `import.meta.env.VITE_DEEPSEEK_API_KEY`。如正式环境由后端代理，前端不应持有此 Key。

> 备注：上一版 REVIEW.md（2026-05-26）已标记，至今未修复。

---

## 高

### A2 — localStorage 加载解析缺少运行时校验

**文件**: [useConversationStore.ts#L20-L28](src/components/AI/store/useConversationStore.ts#L20-L28)

```typescript
return data.flatMap((item) => {
  const c = item as Record<string, unknown>
  if (!Array.isArray(c.messages))
    return []
  const messages = (c.messages as Array<Record<string, unknown>>).map(m => ({
    ...m,
    timestamp: new Date(m.timestamp as string),
  })) as IAIMessage[]
  return [{ ...c, messages }] as unknown as IAIConversation[]
})
```

对 `localStorage` 读取的 JSON 大量使用 `as` 强制类型断言，无字段级别校验。若存储数据被意外损坏、手动修改、或旧版本格式残留，会导致运行时类型不一致（如 `timestamp` 为 `undefined` → `new Date(undefined)` → `Invalid Date`）。

**建议**: 增加字段守卫：
- `messages` 为数组且每个元素有 `id`（string）、`role`（'user' | 'assistant'）、`content`（string）
- `timestamp` 为合法 ISO 字符串或时间戳
- 非法条目过滤丢弃，不静默通过

---

### A3 — 所有面向用户字符串硬编码中文，无 i18n 层

**影响范围**: 全部 37 个 SFC 组件 + `useSpeechRecognition.ts` + `quickCommands.ts`，约 50+ 处硬编码中文字符串。

**AI 壳层主要分布**：

| 文件 | 硬编码字符串示例 |
|------|--------------|
| ChatInput.vue | "输入您的问题...", "发送", "停止", "深度思考" |
| MessageToolbox.vue | "复制", "删除", "确定要删除此消息吗？" |
| ThinkingSection.vue | "深度思考", "已深度思考", "思考过程" |
| InterruptedSection.vue | "输出已中断" |
| WelcomeMessage.vue | "你好，我是 ZhenFly AI 助手" |
| HeaderLeft.vue | "在线", "ZhenFly AI" |
| HeaderActions.vue | "新对话", "固定侧边栏", "切换面板模式" |
| HistoryPopover.vue | "搜索对话...", "确认删除此对话？" |
| useSpeechRecognition.ts | "语音输入出错", "浏览器不支持语音输入" |

**建议**: 引入 `vue-i18n` 或封装 `t(key, fallback)` 工具函数作为过渡方案。业务层的 i18n 处理见第二章 B2 附注。

---

### A4 — `useFloatingDock` 组件卸载时 `body.style.userSelect` 泄漏

**文件**: [useFloatingDock.ts#L33](src/components/AI/store/useFloatingDock.ts#L33)、[useFloatingDock.ts#L54](src/components/AI/store/useFloatingDock.ts#L54)、[useFloatingDock.ts#L62](src/components/AI/store/useFloatingDock.ts#L62)

```typescript
function onPointerDown(e: PointerEvent) {
  document.body.style.userSelect = 'none' // 设置全局样式
}
function onPointerUp(_e: PointerEvent) {
  document.body.style.userSelect = '' // 仅在 pointerup 恢复
}
function onPointerCancel() {
  document.body.style.userSelect = '' // 仅在 pointercancel 恢复
}
```

若 `FloatingTrigger` 在拖拽过程中被卸载（如面板模式切换为 `content-aside`），`pointerup` 和 `pointercancel` 都不会触发，`body.style.userSelect` 保持 `'none'`，整个页面文字选择永久禁用。

**建议**: 在 `onPointerDown` 中注册 `onBeforeUnmount` 清理钩子，或在 `.trigger-root` 上使用 CSS `user-select: none` 替代操作 `document.body`。

---

## 中

### A5 — FloatingTrigger 硬编码颜色不支持暗色模式

**文件**: [FloatingTrigger.vue#L79-L82](src/components/AI/components/core/FloatingTrigger.vue#L79-L82)

```scss
.pill {
  background: white !important;      // 暗色模式下显示白色背景
  border: 2px solid #36b4e7;         // 硬编码颜色
}
```

`.pill` 使用硬编码颜色，未用 `--zd-*` CSS 变量。光晕（`.glow`）已正确使用 `--zd-color-primary`，但 pill 容器本身在暗色主题下出现突兀白色背景。

**建议**: `background: var(--zd-bg-overlay) !important`，`border-color: var(--zd-color-primary)`。

---

## 低

### A6 — Thinking.vue 和 TextShimmer.vue 使用独立 interface 定义 Props

**文件**:
- [Thinking.vue#L11-L14](src/components/AI/components/ui/Thinking.vue#L11-L14) — `interface Props { text?: string; size?: number }`
- [TextShimmer.vue#L13-L18](src/components/AI/components/ui/TextShimmer.vue#L13-L18) — `interface Props { as?: string; duration?: number; spread?: number; delay?: number }`

业务组件规范要求 `defineProps<{ ... }>()` 使用内联 TS 类型。这两个 AI UI 组件将 Props 提取为独立的 `interface`，形式上偏离规范。功能无影响，属代码风格一致性。

**建议**: 将类型内联到 `defineProps<{ text?: string; size?: number }>()`。

---

## AI 壳层架构亮点

以下方面设计优良，值得保持：

1. **Teleport 单例 ChatPanel** — 一个 ChatPanel 实例通过 Teleport 在浮动/侧边栏容器间切换，避免状态同步
2. **View Transition API 集成** — `content-aside ↔ 浮动` 切换时使用 `document.startViewTransition`，过渡流畅
3. **流式 JSON 提取** — `extractJSON` 括号平衡算法在流式传输中实时提取业务指令，设计精巧
4. **LRU 缓存** — 自实现轻量 LRU，用于虚拟列表高度缓存和格式化缓存
5. **系统提示词缓存与指纹** — 通过设备列表指纹按需失效缓存
6. **AbortController 管理** — 对话删除时正确中断流式请求
7. **localStorage 配额降级** — 配额溢出时自动清理最旧对话

---

# 第二章：业务设计

> 审查范围：业务定制层 — components/business/、composables/business/、config/business/、utils/parser/business.ts、types/business.d.ts、prompts/business/

## 摘要

| 类别 | 数量 | 说明 |
|------|------|------|
| 高 | 2 | 解析器类型断言、composable 反模式 |
| 中 | 3 | 错误处理兜底、倒计时可见性、注册完整性 |
| 低 | 2 | 设计文档合规、TODO 遗留 |

## 高

### B1 — 业务 JSON 解析器的类型断言无校验

**文件**: [parser/business.ts#L13](src/components/AI/utils/parser/business.ts#L13)、[parser/business.ts#L53](src/components/AI/utils/parser/business.ts#L53)

```typescript
// Line 13: 数组元素未逐项校验
jobs: parsed.data as IAIJobRow[],

// Line 53: action 字符串未校验是否为合法枚举值
action: parsed.action as IAIMapActionData['action'],
```

`parseBusinessContent` 接收 AI 输出的 JSON，虽有 `typeof parsed.droneSn === 'string'` 等守卫，但：
- `parsed.data as IAIJobRow[]` — 数组内的每个元素未逐项检查是否具备 `name`、`dock`、`status` 等字段
- `parsed.action as IAIMapActionData['action']` — 未检查 action 是否在 6 种合法枚举值内

若 AI 输出格式偏差，下游 `switch-case` 将落入 default 分支静默失败。

**建议**:
- `jobs` 分支：对数组元素逐个校验必要字段存在且类型正确
- `map-action` 分支：校验 `action` 值在合法枚举列表内，不在则返回 null

---

### B2 — 业务 composable 直接导入 store（反模式 4）

**文件**:
- [useTakeoffActions.ts#L6](src/components/AI/composables/business/useTakeoffActions.ts#L6)
- [useMapAction.ts#L8](src/components/AI/composables/business/useMapAction.ts#L8)
- [useNavigateAction.ts#L5](src/components/AI/composables/business/useNavigateAction.ts#L5)
- [useTaskActions.ts#L2](src/components/AI/composables/business/useTaskActions.ts#L2)

```typescript
// 四个业务 composable 均内部直接导入 useConversationStore
const { messages, patchLastAssistantMessage } = useConversationStore()
```

这是 [composables.md](src/components/AI/docs/composables.md) 中列出的**反模式 4**："组合式函数内部悄悄导入全局单例"。后果：
- 单元测试无法 mock store
- 与 store 实现强耦合
- 违背"副作用走 composable"的架构原则

**建议**: 将 `messages` 和 `patchLastAssistantMessage` 作为参数注入：
```typescript
export const useTakeoffActions = createGlobalState((store: {
  messages: Ref<IAIMessage[]>
  patchLastAssistantMessage: (updates: Partial<IAIMessage>) => void
}) => { ... })
```
短期无法重构则在 composables.md 中标注为"已知限制"。

> 附注：业务 composable 中的用户提示文案（如"起飞指令已发送"、"任务已下发"）同样需要 i18n 处理，与第一章 A3 统一规划。

---

## 中

### B3 — BusinessResponseRenderer 的 default case 静默返回空对象

**文件**: [business/index.vue#L40](src/components/AI/components/business/index.vue#L40)

```typescript
default: return {}  // 无任何日志
```

当 `businessContent.type` 为 `locate-airport`（不在 `BUSINESS_COMPONENT_MAP` 中，switch 中无显式分支）或其他未知类型时，`businessProps` 返回 `{}`，`businessComponent` 为 `null`，组件不渲染且无日志。注册遗漏时排查困难。

**建议**: 增加 `console.warn`：
```typescript
default: {
  console.warn(`[BusinessRenderer] 未知的业务类型: "${(bc as any).type}"`)
  return {}
}
```

---

### B4 — `getBusinessSummary` 穷举检查在运行时无防护

**文件**: [parser/business.ts#L110-L111](src/components/AI/utils/parser/business.ts#L110-L111)

```typescript
default: {
  const _exhaustive: never = bc
  return _exhaustive   // 编译时报错，运行时直接返回 bc 对象
}
```

编译时 `never` 穷举检查是正确的设计模式，确保新增变体时同步添加 case。但运行时如果意外走到这里，`return _exhaustive` 返回原始 `bc` 对象（非 string），下游消费 `getBusinessSummary` 的代码会收到非预期值。

**建议**: 增加 `console.error` 并返回安全回退字符串：
```typescript
default: {
  console.error(`[getBusinessSummary] 未处理的业务类型:`, bc)
  return '未知操作'
}
```

---

### B5 — NavigateBanner 倒计时在虚拟列表不可见时仍触发

**文件**: [NavigateBanner.vue#L29-L35](src/components/AI/components/business/simple/NavigateBanner.vue#L29-L35)

```typescript
onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) { doNavigate() }
  }, 1000)
})
```

虚拟列表将不可见项保持 DOM 中（`absolute` + `translateY`），`onMounted` 正常触发。用户滚动查看历史消息时，如果历史消息中有 NavigateBanner 被挂载，3 秒倒计时会启动并到期自动 `router.push()`，**无论组件是否在视口内可见**。

**建议**: 增加 `useConversationStore.isLatestMessage()` 判断，仅在最新消息时启用自动倒计时；或使用 `IntersectionObserver` 守卫可见性。

---

## 低

### B6 — BusinessRenderer 使用动态注册方案而非设计文档要求的 v-if 链

**文件**: [business/index.vue#L21-L42](src/components/AI/components/business/index.vue#L21-L42)

[design-design.md](src/components/AI/docs/business-design.md) 要求按 `businessContent.type` 用 `v-if`/`v-else-if` 链分发。实际使用 `computed` + `BUSINESS_COMPONENT_MAP` + `v-bind` 动态组件方案，更灵活但 `default: return {}` 和未注册类型会静默失败。

**建议**: 二选一：
1. **更新设计文档**，承认动态注册方案是最终选择，要求所有类型必须在注册表中有条目
2. **改回 v-if 链**，每个类型显式处理

---

### B7 — TODO.md 剩余 4 项未完成

**文件**: [TODO.md](src/components/AI/docs/TODO.md)

未完成项：
- `[ ] style的完全移除优化`
- `[ ] ai输出时float dock 图标变化或者状态显示`
- `[ ] i18n`（对应第一章 A3）
- `[ ] 输出语音播放`

---

## 业务类型注册完整性

| type | types/ | parser/ | prompts/ | registry.ts | componentRegistry |
|------|:---:|:---:|:---:|:---:|:---:|
| jobs | ✓ | ✓ | — | ✓ | ✓ |
| task-preview | ✓ | ✓ | ✓ | ✓ | ✓ |
| task-progress | ✓ | — | — | ✓ | ✓ |
| takeoff-preview | ✓ | ✓ | ✓ | ✓ | ✓ |
| takeoff-progress | ✓ | — | — | ✓ | ✓ |
| navigate | ✓ | ✓ | ✓ | ✓ | ✓ |
| map-action | ✓ | ✓ | ✓ | ✓ | ✓ |
| flyable-zone-check | ✓ | ✓ | ✓ | **缺失** | **缺失** |
| locate-airport | ✓ | ✓ | ✓ | **缺失** | **缺失** |
| report | ✓ | ✓ | ✓ | ✓ | ✓ |

`flyable-zone-check` 和 `locate-airport` 在注册表中的缺失是**有意为之** — 两者被 `useMapAction` 的 watch 拦截，在毫秒级内通过 `patchLastAssistantMessage` 清除 `businessContent`。但出于虚拟列表高度预估完整性，建议在 `BUSINESS_TYPE_META` 中补充条目。

---

## 业务组件规范检查

基于 [design-design.md](src/components/AI/docs/business-design.md) 10 条规则：

| # | 规则 | 合规状况 |
|---|------|-----------|
| 1 | `defineOptions({ name: 'PascalCase' })` | **全部通过** — 所有业务组件均有 name |
| 2 | 内联 `defineProps<{ ... }>()` | **全部通过** — 业务组件均使用内联类型 |
| 3 | Props 只接收自己的数据对象（不接收完整 IAIMessage） | **全部通过** — BusinessRenderer 解包传入 |
| 4 | 业务 composable 在 `<script setup>` 顶层调用 | **全部通过** |
| 5 | 不直接操作 store | **偏离** — 四个业务 composable 内部导入 store（见 B2） |
| 6 | 不直接调用 API | **全部通过** — API 调用经 composable |
| 7 | 定时器在 `onBeforeUnmount` 清理 | **全部通过** |
| 8 | 卡片宽度 350px/320px | **全部通过** |
| 9 | scoped SCSS + UnoCSS + `--zd-*` | **全部通过** |
| 10 | Element Plus 优先 | **全部通过** |

---

# 修复优先顺序

1. **A1 (严重)** — DeepSeek API Key 移至环境变量
2. **A4 (高)** — useFloatingDock userSelect 泄漏修复
3. **A2 (高)** — localStorage 类型校验加固
4. **B1 (高)** — 业务解析器类型校验加固
5. **A5 (中)** — FloatingTrigger 暗色模式适配
6. **B3 + B4 (中)** — 业务错误处理兜底
7. **B5 (中)** — NavigateBanner 倒计时可见性检查
8. **A3 (高)** — i18n 引入（跨 AI 壳 + 业务层）
9. **B2 (高)** — 业务 composable 解耦
10. **A6 + B6 (低)** — 设计文档合规
11. **B7 (低)** — TODO 项清理
