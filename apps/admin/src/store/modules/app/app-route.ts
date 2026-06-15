import type { RouteRecordSingleView } from 'vue-router'
import type { IStoreApp } from '@/store/types'
import { defineStore } from 'pinia'
import { layoutConst } from '@/router/routes/builtin'
import { mainoutConst, mainoutRoutes } from '@/router/routes/mainout'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

const useAppStoreRouteInside = defineStore(StoreKeys.APP_ROUTE, {
  state: (): IStoreApp.Route => ({
    whiteListPath: [
      ...mainoutRoutes.map(item => item.path),
      layoutConst.redirect.path,
      layoutConst.notFound.path,
      layoutConst.serverError.path,
    ],
  }),

  getters: {
    getWhiteListPath(state) {
      return state.whiteListPath
    },
  },

  actions: {
    isPathInWhiteList(path: string) {
      return this.whiteListPath.includes(path)
    },

    addDynamicAuthRoute(route: RouteRecordSingleView) {
      const { addRoute, hasRoute } = useAppRouter()

      if (!hasRoute(route.name as string)) {
        addRoute(mainoutConst.root.name, route)

        if (!this.whiteListPath.includes(route.path)) {
          this.whiteListPath.push(route.path)
        }
      }
    },

    removeDynamicAuthRoute(route: RouteRecordSingleView) {
      const { hasRoute, removeRoute } = useAppRouter()

      if (hasRoute(route.name as string)) {
        removeRoute(route.name as string)
        this.whiteListPath = this.whiteListPath.filter(item => item !== route.path)
      }
    },
  },
})

const useAppStoreRouteOutside = () => useAppStoreRouteInside(store)

export function useAppStoreRoute() {
  if (getCurrentInstance())
    return useAppStoreRouteInside()
  return useAppStoreRouteOutside()
}
