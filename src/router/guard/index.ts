import type { Router } from 'vue-router'
import { createAfterEachGuard } from './afterEach'
import { createBeforeEachGuard } from './beforeEach'
import { createRouteParamEncryptGuard } from './modules/encrypt/params'
import { createRouteQueryEncryptGuard } from './modules/encrypt/querys'
import { createLeaveTipGuard } from './modules/leaveTip'
import { createLoadingbarGuard } from './modules/loadingbar'
import { createLockGuard } from './modules/lock'

// https://router.vuejs.org/guide/advanced/navigation-guards#The-Full-Navigation-Resolution-Flow
// The Full Navigation Resolution Flow
// 1. Navigation triggered.
// 2. Call beforeRouteLeave guards in deactivated components.
// 3. Call global beforeEach guards.
// 4. Call beforeRouteUpdate guards in reused components.
// 5. Call beforeEnter in route configs.
// 6. Resolve async route components.
// 7. Call beforeRouteEnter in activated components.
// 8. Call global beforeResolve guards.
// 9. Navigation is confirmed.
// 10. Call global afterEach hooks.
// 11. DOM updates triggered.
// 12. Call callbacks passed to next in beforeRouteEnter guards with instantiated instances.
export function createRouterGuard(router: Router) {
  createLoadingbarGuard(router)
  createLeaveTipGuard(router)
  createLockGuard(router)
  createBeforeEachGuard(router)
  createAfterEachGuard(router)
  createRouteParamEncryptGuard(router)
  createRouteQueryEncryptGuard(router)
}
