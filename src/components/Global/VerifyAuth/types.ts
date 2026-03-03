/**
 * Secondary Authentication Types
 * Unified secondary authentication for sensitive operations
 */

import type { IModels } from '@/api/models'

/**
 * Supported authentication method types
 */
export type VerifyAuthMethodType = 'sms' | 'email' | 'totp' | 'webauthn'

/**
 * Flow mode - determines which flow to use
 * 'verify' - User already has bound method, just verify
 * 'bind' - User needs to bind method first (input identifier then verify)
 */
export type VerifyAuthFlowMode = 'verify' | 'bind'

/**
 * Current step in the authentication flow
 */
export type VerifyAuthStep = 'select' | 'input' | 'verify'

/**
 * Authentication method configuration
 */
export interface VerifyAuthMethod {
  /** Unique key for the method */
  type: VerifyAuthMethodType
  /** Display name (i18n key resolved) */
  name: string
  /** Description (i18n key resolved) */
  description: string
  /** Icon name for the method */
  icon: string
  /** Whether this method is available/enabled for the user */
  enabled: boolean
  /** Masked identifier (e.g., phone number or email) */
  maskedValue?: string
  /** Whether user has bound this method */
  bound: boolean
}

/**
 * TODO need to optimise this type
 * Options for opening the secondary auth modal
 */
export interface VerifyAuthOptions {
  /** Modal title (i18n key) - defaults to 'app.security.tab2' */
  title?: string
  /** Modal description (i18n key) - defaults to 'mfa.verify.title2' */
  description?: string
  /** Flow mode - 'verify' for existing methods, 'bind' for first-time binding */
  mode?: VerifyAuthFlowMode
  /** Pre-selected method type - skips selection step */
  preSelectedMethod?: VerifyAuthMethodType
  /** Allowed authentication methods - defaults to all available */
  allowedMethods?: VerifyAuthMethodType[]
  /** Whether to show "trust this device" checkbox - defaults to true */
  showTrusted?: boolean
  /** Purpose for the API calls ('login' | 'security') - defaults to 'security' */
  purpose?: IModels.ISystemUserIdentityPurpose
  /** Whether to show "set as security" option (for bind mode) - defaults to false */
  showSetAsSecurity?: boolean
}

/**
 * Result of the secondary authentication
 */
export interface VerifyAuthResult {
  /** Whether the verification was successful */
  verified: boolean
  /** The method used for verification */
  method?: VerifyAuthMethodType
  /** Whether the user chose to trust this device */
  trusted: boolean
  /** Whether user chose to set as security method (for bind mode) */
  setAsSecurity?: boolean
  /** Error message if verification failed */
  error?: string
}

/**
 * Props for the VerifyAuth component
 */
export interface VerifyAuthProps {
  /** Control modal visibility */
  show: boolean
  /** Options for configuring the modal */
  options?: VerifyAuthOptions
}

/**
 * Events emitted by the VerifyAuth component
 */
export interface VerifyAuthEmits {
  /** Update show state */
  (e: 'update:show', value: boolean): void
  /** Verification successful */
  (e: 'verified', result: VerifyAuthResult): void
  /** Binding successful (only for bind mode) */
  (e: 'bound', result: VerifyAuthResult): void
  /** Verification cancelled/closed */
  (e: 'cancelled'): void
}

/**
 * Form data for phone input (bind mode)
 */
export interface PhoneFormData {
  identifier: string | null
  setAsSecurity: boolean
}

/**
 * Form data for email input (bind mode)
 */
export interface EmailFormData {
  identifier: string | null
  setAsSecurity: boolean
}

/**
 * Form data for verification code
 */
export interface VerifyFormData {
  verifyCode: string[]
}
