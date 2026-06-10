# AI Composables 设计规范

## 核心理念

**共享状态通过 composable 单例访问，不通过参数传递，不通过 provide/inject 中转。**

调用方需要什么状态，自己 `useXxx()` 拿。不要在组件 A 里拿到状态、再通过参数传给组件 B 的组合式函数。

## 三类模式

### 1. 全局持久状态 — `createGlobalState + useStorage`

适用场景：用户偏好、设置项，需要跨组件共享 + 持久化到 localStorage。

```ts
// ✅ 正确：createGlobalState 保证所有调用者拿到同一个 ref
export const useAIPreferences = createGlobalState(() =>
  useStorage<AIPreferences>(STORAGE_KEY, defaults)
)

// 任何组件/组合式函数直接调用即可，无需 provide/inject，无需传参
const aiPrefs = useAIPreferences()
aiPrefs.value.panelMode = 'large-panel'
```

```ts
// ❌ 错误：不要把全局状态通过参数层层传递
function useChatSend(options: {
  deepThinkingEnabled: Ref<boolean> // 调用方还得传 computed(() => aiPrefs.value.deepThinking)
})

// ✅ 正确：组合式函数自己拿状态
function useChatSend() {
  const aiPrefs = useAIPreferences()
  // 用到时直接读 aiPrefs.value.deepThinking
}
```

### 2. 全局非持久状态 — 模块级 reactive/ref 单例

适用场景：全局 UI 状态（面板展开/收起）、会话数据缓存，跨组件共享但**不需要**持久化。

```ts
// ✅ 模块级单例，不导出工厂函数，直接导出状态
const conversations = reactive<Record<string, Conversation>>({})
const currentId = ref('')

export function useConversationStore() {
  return { conversations, currentId, ... }
}
```

> `useConversationStore`、`usePanelState`、`useStreamManager` 目前都是这个模式。

### 3. 实例局部状态 — 普通 composable（不共享）

适用场景：每个调用方需要**独立**的状态实例，如 virtualizer、report viewer 对话框。

```ts
// ✅ 每次调用创建独立状态
export function useChatVirtualList(messages, measuredHeights) {
  const virtualizer = useVirtualizer(...)  // 每个消息列表独立的虚列化实例
  return { virtualizer, ... }
}
```

## 反模式清单

### ❌ 反模式 1：provide/inject 传递全局状态

```ts
// Bad：在根组件 provide，子组件 inject
const prefs = useAIPreferences()
provide('aiPrefs', prefs)

// Bad：子组件 inject 后再 computed get/set 拆分
const aiPrefs = inject('aiPrefs')!
const panelMode = computed({
  get: () => aiPrefs.value.panelMode,
  set: (v) => { aiPrefs.value = { ...aiPrefs.value, panelMode: v } },
})
```

**直接用 `useAIPreferences()` 替代整个 provide/inject 链和所有 computed get/set。**

### ❌ 反模式 2：将全局状态通过 composable 参数层层传递

```ts
// Bad：ChatPanel 通过 computed 把 deepThinking 传给 useChatSend
const { handleSend } = useChatSend({
  deepThinkingEnabled: computed(() => aiPrefs.value.deepThinking),
  ...
})
```

**让 useChatSend 内部自己调用 `useAIPreferences()` 获取。**

### ❌ 反模式 3：多个单例模式混用

`useAIPreferences` 用 `createGlobalState`，`useConversationStore` 用模块级变量，`usePanelState` 也是模块级变量 — 三种写法，做的事一样。

**统一用 `createGlobalState` 包裹**（VueUse 提供，零成本）：

```ts
// 统一写法
export const useConversationStore = createGlobalState(() => {
  const conversations = reactive<Record<string, Conversation>>({})
  const currentId = ref('')
  return { conversations, currentId, ... }
})
```

### ❌ 反模式 4：组合式函数内部偷偷 import 全局单例

```ts
// Bad：useTaskActions 不接收任何状态参数，内部直接调用 useConversationStore()
export function useTaskActions() {
  const store = useConversationStore() // 隐式依赖，不可测试
}
```

**明确接收依赖**（通过参数），或者确认它就是全局单例消费方（如果它本身就是全局单例模式的一部分，那也可以接受）。

### ❌ 反模式 5：过多的位置参数

```ts
// Bad：7 个位置参数，调用方极易写错顺序
export function useConversationHistory(
  conversations: Ref<Conversation[]>,
  currentId: Ref<string>,
  deleteConversation: (id: string) => void,
  switchConversation: (id: string) => void,
  renameConversation: (id: string, title: string) => void,
  scrollToBottom: () => void,
  togglePanel: () => void,
)
```

**用 options 对象**（超过 3 个参数时）。

## 当前状态概览

| 文件 | 模式 | 问题 |
|------|------|------|
| `useAIPreferences.ts` | ✅ `createGlobalState` | 已改造完成 |
| `useConversationStore.ts` | 模块级 reactive（接近正确） | 可统一为 `createGlobalState` |
| `usePanelState.ts` | 模块级 ref（接近正确） | 可统一为 `createGlobalState` |
| `useStreamManager.ts` | 模块级 Map（接近正确） | 永不清理废弃流状态；接受 store 对象可简化 |
| `useAI.ts` | 纯 facade（没问题） | 薄封装，有存在价值 |
| `useChatSend.ts` | ✅ 已改造完成 | 不再传 `deepThinkingEnabled` |
| `useFloatingDock.ts` | ✅ 已改造完成 | 直接收 `Ref<AIPreferences>` |
| `useChatVirtualList.ts` | 实例局部（正确） | — |
| `useInputHistory.ts` | 接收 refs（OK） | 它需要调用方的 inputText，合理 |
| `useStickyUserMessage.ts` | 接收 refs（OK） | — |
| `useSpeechRecognition.ts` | 接收 options（OK） | `isLoading: () => boolean` 应统一为 `Ref<boolean>` |
| `useConversationHistory.ts` | 7 个位置参数 | **需要改造为 options 对象** |
| `useReportAction.ts` | 实例局部（正确） | — |
| `useNavigateAction.ts` | 隐式依赖 store | 可接收依赖 or 确认全局消费方 |
| `useTaskActions.ts` | 隐式依赖 store | 同上 |
| `useTakeoffActions.ts` | 隐式依赖 store | 同上 |

## 重构优先级建议

1. **统一单例写法**：`useConversationStore`、`usePanelState`、`useStreamManager` 统一改 `createGlobalState`
2. **清理隐式依赖**：business composables 明确接收依赖
3. **参数规范化**：`useConversationHistory` 改为 options 对象，`useSpeechRecognition` 统一 ref 类型
4. **useChatSend 瘦身**：system prompt / quick commands / provider 选择拆分到独立模块
