import { nextTick, ref, watch } from 'vue'

interface Options {
  /** 关闭后延迟卸载的时间，默认 300ms（匹配 Naive UI Modal 关闭动画） */
  unmountDelay?: number
}

/**
 * 全局异步组件挂载控制器
 *
 * 用于解决 `defineAsyncComponent` 懒加载的 Modal 组件进入动画丢失的问题。
 * 核心思路：把「组件挂载（Mount）」和「Modal 显示（Show）」拆成两个时序。
 *
 * 打开时：store.show = true → mounted = true（触发懒加载）→ nextTick → visible = true
 * 关闭时：store.show = false → visible = false（播放离开动画）→ 延迟 unmountDelay → mounted = false（卸载）
 */
export function useGlobalAsyncComponent(show: Ref<boolean>, options: Options = {}) {
  const mounted = ref(false)
  const visible = ref(false)
  const delay = options.unmountDelay ?? 300

  let unmountTimer: ReturnType<typeof setTimeout> | null = null

  watch(show, async (val) => {
    if (unmountTimer) {
      clearTimeout(unmountTimer)
      unmountTimer = null
    }

    if (val) {
      // 先挂载组件（触发懒加载）
      mounted.value = true
      // 等组件挂载到 DOM 后，再打开 Modal，动画就能正常触发
      await nextTick()
      visible.value = true
    }
    else {
      // 先关闭 Modal（播放离开动画）
      visible.value = false
      // 等动画结束后再卸载组件
      unmountTimer = setTimeout(() => {
        mounted.value = false
      }, delay)
    }
  }, { immediate: true })

  return { mounted, visible }
}
