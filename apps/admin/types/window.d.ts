import type * as ECharts from 'echarts/core'
import type * as Gtag from 'gtag.js'
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
import type { LoadingBarApiInjection } from 'naive-ui/lib/loading-bar/src/LoadingBarProvider'
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider'
import type { App } from 'vue'
import type {
  CLSMetric,
  FIDMetric,
  INPMetric,
  LCPMetric,
  TTFBMetric,
} from 'web-vitals'

interface WebVitalsAPI {
  onCLS: (handler: (metric: CLSMetric) => void) => void
  onFID: (handler: (metric: FIDMetric) => void) => void
  onINP: (handler: (metric: INPMetric) => void) => void
  onLCP: (handler: (metric: LCPMetric) => void) => void
  onTTFB: (handler: (metric: TTFBMetric) => void) => void
}

declare global {
  declare interface Window {
    // Global vue app instance
    __APP__: App<Element>

    // capjs
    Cap: ICapInst
    CAP_CUSTOM_WASM_URL: string

    // naive relative
    $loadingBar: LoadingBarApiInjection
    $message: MessageApiInjection
    $notification: NotificationApiInjection
    $dialog: DialogApiInjection

    // echarts
    echarts: ECharts

    // google analytics
    dataLayer: Gtag.DataLayer
    gtag: Gtag.Gtag
    webVitals: WebVitalsAPI

    // baidu map
    BMapGL: any
    __onBMapLoaded?: () => void
    BMAP_ANCHOR_TOP_LEFT: number
  }
}
