import type { Recordable } from 'easy-fns-ts'

export { }

declare module 'vue-router' {
  interface RouteMeta extends AppSystemMenuMeta, Pick<AppSystemMenu, 'type' | 'title' | 'icon'> {
    /**
     * @description this is an option that only works for routes hard-coded in front-end code
     * for those routes that do not need to fetch permissions from backend
     */
    _auth?: boolean

    /**
     * @description used for enhanced params, to temp save resolved params
     */
    _resolvedParams?: Recordable

    /**
     * @description used for enhanced querys, to temp save resolved querys
     */
    _resolvedQuerys?: Recordable
  }
}
