/**
 * Secondary Authentication Business Component
 *
 * Provides unified secondary authentication flow for sensitive operations.
 * Supports SMS, Email, TOTP, and WebAuthn methods.
 *
 * Two modes:
 * - 'verify': User already has bound method, just verify (e.g., sensitive operation confirmation)
 * - 'bind': User needs to bind method first (e.g., first-time phone binding)
 *
 * Architecture:
 * - index.vue: Flow control and state management
 * - components/MethodSelect.vue: Step 1 - Select authentication method (Base:Slot)
 * - components/IdentityInput.vue: Step 2 - Input phone/email (bind mode only)
 * - components/VerifyCode.vue: Step 3 - Input verification code
 *
 * All step components use WForm with useForm hook - consistent with project patterns
 * Child components use defineModel for show prop (two-way binding)
 *
 * @example
 * // Verify mode - for sensitive operations
 * <WCompBusinessVerifyAuth
 *   v-model:show="showAuthModal"
 *   :options="{ mode: 'verify', allowedMethods: ['sms', 'email', 'totp'] }"
 *   @verified="onVerified"
 *   @cancelled="onCancelled"
 * />
 *
 * @example
 * // Bind mode - for first-time binding
 * <WCompBusinessVerifyAuth
 *   v-model:show="showBindModal"
 *   :options="{
 *     mode: 'bind',
 *     preSelectedMethod: 'sms',
 *     showSetAsSecurity: true
 *   }"
 *   @bound="onBound"
 *   @cancelled="onCancelled"
 * />
 */

import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))
