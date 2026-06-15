# AI 面板模式切换与 View Transition 动画架构

## 三种模式

| 模式 | 位置 | 尺寸 | 切换按钮图标 |
|------|------|------|-------------|
| `panel` | 固定定位，右下角浮动 | 380×520 | `i-carbon-maximize` |
| `large-panel` | 固定定位，右下角浮动 | 700×800 | `i-carbon-open-panel-filled-right` |
| `content-aside` | 页面侧边栏，flex 布局 | 可拖拽 (320–800, 默认 420) | `i-carbon-minimize` |

模式存储在 `localStorage` (`ai-preferences`)，通过 `useAIPreferences()` 读写。

轮换顺序：`panel → large-panel → content-aside → panel → ...`

## 核心架构

### 单例 ChatPanel + Teleport

只声明**一份** ChatPanel，通过 `<Teleport>` 动态投送到当前激活的容器：

```
<aside>                              ← content-aside 模式的目标容器
  <div ref="asideTargetRef" />
</aside>

<div class="ai-panel-wrapper">        ← 浮动模式的目标容器
  <FloatingTrigger />                 ← 面板关闭时显示触发器
  <div ref="floatingTargetRef" />     ← 面板打开时 ChatPanel 渲染到这里
</div>

<Teleport :to="teleportTarget">
  <KeepAlive>
    <ChatPanel v-if="panelVisible"    ← 只有一份
      :mode="currentPanelMode"        ← 'content-aside' | 'floating'
      view-transition-name="ai-panel"
    />
  </KeepAlive>
</Teleport>
```

`teleportTarget` 根据当前模式返回 `asideTargetRef` 或 `floatingTargetRef`。

### 为什么单例

- `view-transition-name` 天然唯一，不存在重复问题
- VT 快照捕获同一元素在两个位置间移动，cross-fade 自然正确
- 代码更干净，不再需要两份声明 + 两份 key 管理

### 为什么 Teleport 而不是 v-if 两个位置

ChatPanel 在浮动和侧边栏模式下处于完全不同的 DOM 位置（一个 fixed overlay，一个 flex 子元素）。单靠 CSS 切换定位无法实现，Teleport 是正确方案。

## View Transition 策略

### 何时用 VT

**仅在 `content-aside ↔ panel/large-panel` 切换时**使用 `document.startViewTransition`。

这是跨 DOM 位置的结构性变化，VT 通过拍摄旧/新快照并 cross-fade 来实现平滑过渡。

### 何时不用 VT

- **`panel ↔ large-panel`**：同一 DOM 位置，只是尺寸变化。用 `.panel-inner` 的 CSS `transition: width 0.3s, height 0.3s` 处理。
- **面板打开/关闭**（FloatingTrigger 点击）：用 Vue `<Transition name="slide-right">`。
- **pin 后刷新页面**：用 Vue `<Transition name="aside-slide" appear>`。

### 判断逻辑

```typescript
const involvesAside = currentMode === 'content-aside' || next === 'content-aside'

if (involvesAside && document.startViewTransition) {
  // VT 路径
}
else {
  // 直接切换（CSS transition 处理视觉）
}
```

## VT 动画细节

### 快照分层

VT 创建以下伪元素叠加层（从底到顶）：

1. 真实页面（新状态）
2. `::view-transition-old(root)` — 旧页面全屏截图
3. `::view-transition-new(root)` — 新页面全屏截图
4. `::view-transition-old(ai-panel)` — 旧 ChatPanel 截图
5. `::view-transition-new(ai-panel)` — 新 ChatPanel 截图

### CSS 定义（base.css）

```css
/* ai-panel 元素 cross-fade */
::view-transition-old(ai-panel),
::view-transition-new(ai-panel) {
  animation: 500ms ease both;
}
::view-transition-old(ai-panel) { animation-name: ai-panel-out; }  /* opacity 1 → 0.3 */
::view-transition-new(ai-panel) { animation-name: ai-panel-in; }   /* opacity 0.3 → 1 */

/* root 默认不动画（避免干扰主题切换的 clip-path 动画） */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}
```

### root 快照淡出

因为 `base.css` 中 `::view-transition-old(root)` 设了 `animation: none`，VT 期间整个页面背景是静止的。为了让主内容区宽度变化有过渡感，在 `vt.ready` 中通过 WAAPI 注入 fade-out 动画：

```typescript
vt.ready.then(() => {
  document.documentElement.animate(
    { opacity: [1, 0] },
    {
      duration: 300,
      easing: 'ease',
      pseudoElement: '::view-transition-old(root)',
      fill: 'forwards',
    },
  )
})
```

旧页面快照 300ms 淡出，露出底层已处于新状态的页面，主内容区看起来在"过渡"。

### 完整 VT 时间线

以 `large-panel → content-aside` 为例：

```
0ms       startViewTransition 调用，旧快照冻结
~0ms      vt.ready 触发 → root 旧快照开始 fade out (300ms)
0ms       回调执行：panelMode 切换 → aside v-if 变 true
          vtActive = true → aside Transition 被禁用 → aside 瞬间出现在最终宽度
          主内容区 flex 布局瞬间重算（被旧快照遮盖，不可见）
~16ms     nextTick 完成，新快照拍摄
0-300ms   root 旧快照淡出 → 新页面逐渐显现（aside 在最终宽度）
0-500ms   ai-panel cross-fade（浮动位置 → 侧边栏位置）
500ms     VT 完成，vtActive = false
```

## 非 VT 过渡

### aside 侧边栏（Vue Transition）

```css
/* 应用到 <Transition name="aside-slide"> */
.aside-slide-enter-active,
.aside-slide-leave-active {
  transition: width 0.3s ease, opacity 0.25s ease;
}
.aside-slide-enter-from,
.aside-slide-leave-to {
  width: 0 !important;
  opacity: 0;
}
```

触发场景：
- **pin 后刷新页面**：`appear` 属性触发入场动画，aside 从 0 宽度 + 透明滑入
- **非 VT 路径切换**：不涉及 VT 的 content-aside 开关（当前不存在此路径，仅 VT 路径）

VT 期间通过 `:name="vtActive ? '' : 'aside-slide'"` 禁用，避免 aside 处于 enter-from 态（width:0）时被 VT 快照捕获导致 ChatPanel 不可见。

### `.panel-inner` 尺寸过渡（CSS transition）

```css
.panel-inner {
  transition: width 0.3s ease, height 0.3s ease;
}
.panel-inner.no-transition {
  transition: none !important;  /* VT 期间抑制，由 vtActive 控制 */
}
```

处理 `panel ↔ large-panel` 的尺寸变化。

### 浮动面板开关（Vue Transition）

```css
/* 定义在 transition.css */
.slide-right-enter-active { transition: opacity 0.25s, transform 0.25s; }
.slide-right-enter-from { opacity: 0; transform: translateX(30px); }
.slide-right-leave-to { opacity: 0; transform: translateX(30px); }
```

触发场景：用户点击 FloatingTrigger 打开/关闭浮动面板。VT 期间通过 `:name="vtActive ? '' : 'slide-right'"` 禁用。

## 状态变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `vtActive` | `Ref<boolean>` | VT 进行中标记，provide 给 ChatPanel 抑制 `.panel-inner` CSS transition |
| `panelVisible` | `Ref<boolean>` | 面板是否打开（任何模式） |
| `isContentAsideMode` | `ComputedRef<boolean>` | 当前是否为 content-aside 模式 |
| `isContentAsideOpen` | `ComputedRef<boolean>` | aside 是否应可见（mode + visible） |
| `isFloatingMode` | `ComputedRef<boolean>` | 当前是否为浮动模式 |
| `isFloatingOpen` | `ComputedRef<boolean>` | 浮动面板应可见（mode + visible） |
| `currentPanelMode` | `ComputedRef<'floating' \| 'content-aside'>` | 传给 ChatPanel 的 mode prop |
| `teleportTarget` | `ComputedRef<HTMLElement \| undefined>` | Teleport 目标元素 |

## 文件关联

| 文件 | 职责 |
|------|------|
| `AI/index.vue` | 布局调度、模式切换、VT 逻辑、aside/floating Transition |
| `AI/components/core/ChatPanel.vue` | 面板渲染、接收 `viewTransitionName` prop、`.no-transition` class |
| `styles/base.css` | `::view-transition-*` 全局动画定义 |
| `styles/transition.css` | `slide-right` Vue Transition CSS |
| `AI/composables/useAIPreferences.ts` | `PanelMode` 类型、localStorage 持久化 |
