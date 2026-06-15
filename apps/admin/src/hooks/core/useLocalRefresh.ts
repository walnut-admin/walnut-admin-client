// used for layout local refresh, used with v-if to achieve hijack F5
export const localRefreshFlag = ref(true)

export function toggleLocalRefreshFlag() {
  localRefreshFlag.value = !localRefreshFlag.value
  nextTick(() => {
    localRefreshFlag.value = !localRefreshFlag.value
  })
}
