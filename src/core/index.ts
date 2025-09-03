import { getPermissionsAPI } from '@/api/auth'
import { buildRoutes } from '@/router/utils/route'

/**
 * @description App Core Function 1 - Routes & Menus & KeepAliveRouteNameList. Will add permissions handle logic here later.
 * Used in two places
 * 1. sign in operation
 * 2. route guard protection
 * 3. called after refresh token
 */
export async function AppCoreFn1() {
  const appStoreMenu = useAppStoreMenu()
  const appStoreTab = useAppStoreTab()
  const userStorePermission = useAppStoreUserPermission()
  const appStoreKey = useAppStoreKey()

  // init url masking aes key from backend API
  // later will used for `addRoute` patch
  await appStoreKey.initUrlMaskingAesKey()

  const { addRoute, getRoutes, hasRoute } = AppRouter

  const rootRoute
    = getRoutes()[getRoutes().findIndex(i => i.path === AppRootPath)]

  // Here is where we request from back end to get login user permissions.
  const { permissionMenuTree, permissionStrings, permissionRouteTree, keepAliveNames, indexMenuName, affixedTabs, internalIframeList } = await getPermissionsAPI()

  // set menu tree
  appStoreMenu.setMenus(permissionMenuTree)

  // set keep alive route name
  appStoreMenu.setKeepAliveRouteNames(appStoreMenu.createKeepAliveRouteNames(keepAliveNames))

  // set index menu name, use for home page
  appStoreMenu.setIndexMenuName(indexMenuName)

  // set affixed tabs
  appStoreTab.setAffixedTabs(affixedTabs)

  // set iframe list
  appStoreTab.setIframeList(internalIframeList)

  // set permission string array
  userStorePermission.setPermissions(permissionStrings)

  // build routes and add into root route
  const routes = buildRoutes(permissionRouteTree)

  // add to root route
  routes.forEach((route) => {
    if (!hasRoute(route.name as string)) {
      addRoute(AppRootName, route)
    }
  })

  // set root redirect since we do not prepare root page
  rootRoute.redirect = {
    name: appStoreMenu.getIndexMenuName,
  }
}
