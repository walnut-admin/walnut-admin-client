import type { BuiltinComponents, UnknownComponents } from '@fingerprintjs/fingerprintjs'
import { useAppStorage } from '@/utils/persistent/Storage'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { pick } from 'lodash-es'

// TODO different browser in same device has different fingerprint
// actually i want the same fingerprint
// but i can not target which component caused different fingerprint -.-
const excludeComponents: (keyof BuiltinComponents)[] = [
  'applePay',
  'architecture',
  'audio',
  'audioBaseLatency',
  'canvas',
  'colorDepth',
  'colorGamut',
  'contrast',
  'cookiesEnabled',
  'cpuClass',
  'deviceMemory',
  'domBlockers',
  'fontPreferences',
  'fonts',
  'forcedColors',
  'hardwareConcurrency',
  'hdr',
  'indexedDB',
  'invertedColors',
  'languages',
  'localStorage',
  'math',
  'monochrome',
  'openDatabase',
  'osCpu',
  'pdfViewerEnabled',
  'platform',
  'plugins',
  'privateClickMeasurement',
  'reducedMotion',
  'reducedTransparency',
  'screenFrame',
  'screenResolution',
  'sessionStorage',
  'timezone',
  'touchSupport',
  'vendor',
  'vendorFlavors',
  'webGlBasics',
  'webGlExtensions',
]

// Initialize an agent at application startup.
export const fpId = useAppStorage<string>(AppConstPersistKey.FP_ID, '', { usePresetKey: false, expire: Number.POSITIVE_INFINITY })

export async function setupFingerprint() {
  if (fpId.value)
    return

  const fpPromise = FingerprintJS.load({})

  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()

  // you can add your custom components here
  const components: UnknownComponents = pick(result.components, excludeComponents)

  const visiterId = FingerprintJS.hashComponents(components)

  fpId.value = visiterId
}
