import type { TreeNodeItem } from 'easy-fns-ts'

import type { RouteRecordMultipleViewsWithChildren, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'
import { findPath, formatTree } from 'easy-fns-ts'
import ParentComponent from '@/layout/default/TheContent'
import IFrameFaker from '@/layout/iframe/faker.vue'
import { App404Route, App500Route } from '../routes/builtin'

/**
 * @description Util Function 2 - Resolve `catalog` type menu with self name
 */
function resolveParentComponent(name: RouteRecordNameGeneric) {
  return () =>
    new Promise((resolve) => {
      resolve({
        ...ParentComponent,
        name,
      })
    })
}

/**
 * @description Util Function 3 - Resolve `menu` type menu which is internal with self name
 */
function resolveIFrameComponent(name: RouteRecordNameGeneric) {
  return () =>
    new Promise((resolve) => {
      resolve({
        ...IFrameFaker,
        name,
      })
    })
}

const allViewModules = import.meta.glob('../../views/**/*.vue')

/**
 * @description Util Function 4 - Resolve `views` dynamically base on `node.component` which equal to `path`
 */
function resolveViewModules(component: string) {
  if (!component)
    return

  const keys = Object.keys(allViewModules)

  // find the file location same index
  const index = keys.findIndex(
    i => i.replace('../../views/', '').replace('.vue', '') === component,
  )

  return allViewModules[keys[index]]
}

/**
 * @description Build Routes Core Function
 */
export function buildRoutes(payload: RouteRecordRaw[]) {
  const data = payload as TreeNodeItem<RouteRecordMultipleViewsWithChildren>[]

  // @ts-expect-error easy-fns-ts
  const routesTree = formatTree(data, (node) => {
    // handle catelog
    if (node.meta?.type === AppConstMenuType.CATALOG) {
      return {
        ...node,
        component: resolveParentComponent(node.name),
      }
    }

    // handle menu
    if (node.meta!.type === AppConstMenuType.MENU) {
      // handle internal menu
      if (node.meta!.ternal === AppConstMenuTernal.INTERNAL) {
        return {
          ...node,
          // need component field
          // or [Vue Router warn]: Record with path "/demo/link/internal/iconify" is either missing a "component(s)" or "children" property.
          component: resolveIFrameComponent(node.name),
        }
      }

      // common view route
      return {
        ...node,
        component: resolveViewModules(node.component as unknown as string),
      }
    }

    return node
  })

  // I have decided to make this into a final solution, not for temporarily anymore
  // see https://github.com/vuejs/vue-router-next/issues/626
  const transformedRouteTree = transformToTwoLevelRouteTree(routesTree)

  // fix router warning
  // remove first cause initial builtin in builtinRoutes
  const { removeRoute, hasRoute } = AppRouter
  if (hasRoute(App404Name)) {
    removeRoute(App404Name)
  }

  // finally push the 404/500
  transformedRouteTree.push(App404Route)
  transformedRouteTree.push(App500Route)

  return transformedRouteTree
}

/**
 * @description flat tree route into two level route
 * @link https://github.com/vuejs/vue-router-next/issues/626
 */
function transformToTwoLevelRouteTree(routes: TreeNodeItem<RouteRecordMultipleViewsWithChildren>[]) {
  const transformedRouteTree: RouteRecordRaw[] = []

  // TODO mapTree
  formatTree(routes, (node) => {
    // findPath, it's an array
    const paths = findPath(
      routes,
      n => n.name === node.name,
    ) as RouteRecordRaw[]

    // only handle menu
    if (node.meta?.type === AppConstMenuType.MENU) {
      if (paths.length > 1) {
        const newNode = paths.reduce(
          (prev, next) =>
            ({
              name: next.name,
              path: prev.path.startsWith('/')
                ? `${prev.path}/${next.path}`
                : `/${prev.path}/${next.path}`,
              meta: next.meta,
              component: next.component,
            } as RouteRecordRaw),
        )

        transformedRouteTree.push(newNode)
      }
      else if (!node.children) {
        // add `/` prefix when no children
        transformedRouteTree.push({ ...node, path: `/${node.path}` })
      }
    }

    return true
  })

  return transformedRouteTree
}
