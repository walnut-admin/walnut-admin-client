import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreUserScrollInside = defineStore(StoreKeys.USER_SCROLL, {
  state: (): IUserStoreScroll => ({
    scrollEntries: useAppStorageSync(AppConstPersistKey.SCROLL, []),
  }),

  getters: {
    getScrollMap(state) {
      return Object.fromEntries(state.scrollEntries!)
    },
  },

  actions: {
    setScrollPosition(name: string, top: number, left: number) {
      const index = this.scrollEntries!.findIndex(i => i[0] === name)
      if (index === -1)
        this.scrollEntries!.push([name, { top, left }])
      else
        this.scrollEntries![index] = [name, { top, left }]
    },

    getScrollPosition(name: string) {
      if (this.getScrollMap[name])
        return this.getScrollMap[name]

      return { top: 0, left: 0 }
    },
  },
})

const useAppStoreUserScrollOutside = () => useAppStoreUserScrollInside(store)

export function useAppStoreUserScroll() {
  if (getCurrentInstance())
    return useAppStoreUserScrollInside()
  return useAppStoreUserScrollOutside()
}
