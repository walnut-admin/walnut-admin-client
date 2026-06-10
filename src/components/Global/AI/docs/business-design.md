# AI 业务组件与逻辑规范

## 架构分层

```
系统提示词（prompts/business/system.ts）
  → AI 输出 JSON 业务指令（含 category: 'card' | 'action'）
    → utils/parser/index.ts          （纯 JSON 提取，括号平衡，不含业务逻辑）
      → utils/parser/business.ts     （parseBusinessContent 类型路由 + getBusinessSummary 摘要）
        → useStreamManager            （写入 IAIMessage.businessContent）
          → MessageRenderer            （检测 businessContent 非空 → 路由到 BusinessRenderer）
            → BusinessRenderer         （按 businessContent.category 分支）
              ├─ category === 'card'   → CARD_COMPONENT_MAP[type] 渲染组件
              └─ category === 'action' → ACTION_HANDLER_MAP[type](payload) → 清除 businessContent
```

---

## 双底座类型系统

不再为每种业务写独立的类型和组件。所有业务归于两类底座：

### Card（UI 渲染型）

AI 输出 `{"type":"xxx","category":"card", ...payload}` → 前端渲染对应组件。

**扩展方式：**
1. `types/business.d.ts` 在 `CardPayloadMap` 加一行
2. `config/business/componentRegistry.ts` 在 `CARD_COMPONENT_MAP` 注册组件
3. `prompts/business/system.ts` 加对应的 prompt 段

### Action（逻辑执行型）

AI 输出 `{"type":"xxx","category":"action", ...payload}` → `useActionWatcher` 检测到 → 查 `ACTION_HANDLER_MAP` 执行 → 自动清除 `businessContent`。

**扩展方式：**
1. `types/business.d.ts` 在 `ActionPayloadMap` 加一行
2. `config/business/actionRegistry.ts` 在 `ACTION_HANDLER_MAP` 注册 handler
3. `prompts/business/system.ts` 加对应的 prompt 段

### 类型泛型支持

```typescript
// CardPayloadMap / ActionPayloadMap → UnionFromMap → 判别联合
// CARD_COMPONENT_MAP[K] → Component     （K extends keyof CardPayloadMap）
// ACTION_HANDLER_MAP[K] → (payload: ActionPayloadMap[K]) => void
// 全链路类型联动：改 map → registry 自动提示 + 类型收紧
```

---

## 组件开发约束

### 必须遵守

1. **`defineOptions({ name: 'PascalCase' })`** — 每个组件必须有 name
2. **Props 用纯 TS 类型** — `defineProps<{ ... }>()`，使用 `IAI*` 全局类型，不 import
3. **Card 组件接收 `type` + `payload`** — 由 BusinessRenderer 解包传入
4. **不要直接操作 store** — 所有副作用走 composable
5. **不要直接调用 API** — 走 composable 或 action handler
6. **定时器必须在 `onBeforeUnmount` 中清理**
7. **样式** — scoped style + UnoCSS 工具类 + Naive UI CSS 变量
8. **Naive UI 优先** — 按钮用 `NButton`，弹窗用 `NModal`，输入用 `NInputNumber`，表格用 `NDataTable`，消息用 `useMessage()`

### 底座组件

- `BusinessCard.vue` — 统一卡片外壳，提供 `width`/`icon`/`title` props 和 `header`/`default`/`footer` 三个 slot
- `BusinessPlaceholder.vue` — 未实现类型的占位提示

---

## Parser 层

- `utils/parser/index.ts` — 纯 JSON 工具（`extractJSON`、`isBufferWaitingForJSON`），无业务逻辑
- `utils/parser/business.ts` — 业务路由：`parseBusinessContent` 映射 AI JSON → `IAIBusinessContent`，`getBusinessSummary` 生成人类可读摘要

---

## 新增业务类型步骤

1. **类型** — `types/business.d.ts` 在 `CardPayloadMap` 或 `ActionPayloadMap` 加一行
2. **Parser** — `utils/parser/business.ts` 在 `parseBusinessContent` 的类型数组中追加 key，在 `getBusinessSummary` 追加 case
3. **Prompt** — `prompts/business/system.ts` 追加 prompt 段 + 在 `buildSystemPrompt` 中引用
4. **注册** — Card 类型在 `config/business/componentRegistry.ts` 注册组件；Action 类型在 `config/business/actionRegistry.ts` 注册 handler
5. **高度（可选）** — `config/business/registry.ts` 追加高度估算值
6. **组件（Card 类型）** — `components/business/` 下新建组件

---

## 严禁修改的文件

| 区域 | 原因 |
|------|------|
| `components/core/`、`message/`、`chat/`、`header/`、`ui/` | 通用壳层，不感知业务 |
| `store/useChatSend.ts` | 通过 `getBusinessSummary` 统一处理历史序列化 |
| `store/useStreamManager.ts` | 通过 `parseBusinessContent` → `businessContent` 统一写入 |
| `store/useConversationStore.ts` | 通过 `patchLastAssistantMessage(Partial<IAIMessage>)` 通用接口 |
| `utils/parser/index.ts` | 纯 JSON 工具，不含业务逻辑 |
| `composables/business/index.ts` | `useActionWatcher` — 通用 Action 调度，不区分具体 type |

---

## 目录结构

```
components/business/
├── index.vue                  # BusinessRenderer 调度器（card/action 分支）
├── BusinessCard.vue           # Card 底座
└── BusinessPlaceholder.vue    # 未实现类型占位

composables/business/
└── index.ts                   # useActionWatcher + useCardActions

types/
├── index.d.ts                 # IAIMessage, IAIConversation
└── business.d.ts              # CardPayloadMap + ActionPayloadMap + union 工具类型

utils/parser/
├── index.ts                   # extractJSON, isBufferWaitingForJSON
└── business.ts                # parseBusinessContent, getBusinessSummary

prompts/business/
└── system.ts                  # buildSystemPrompt + 各业务段模板

config/
├── quickCommands.ts           # AI 原生快捷指令
└── business/
    ├── registry.ts            # BUSINESS_TYPE_HEIGHTS（虚拟列表高度）
    ├── componentRegistry.ts   # Card 类型 → 组件映射
    └── actionRegistry.ts      # Action 类型 → handler 映射
```
