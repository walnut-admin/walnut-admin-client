function getDebugInfo(name: string, attribution: any) {
  if (!attribution)
    return { debug_target: '(not set)' }

  switch (name) {
    case 'LCP':
      return {
        debug_url: attribution.url,
        debug_time_to_first_byte: attribution.timeToFirstByte,
        debug_resource_load_delay: attribution.resourceLoadDelay,
        debug_resource_load_time: attribution.resourceLoadTime,
        debug_element_render_delay: attribution.elementRenderDelay,
        debug_target: attribution.element || '(not set)',
      }
    case 'INP':
      return {
        debug_event: attribution.interactionType,
        debug_time: Math.round(attribution.interactionTime),
        debug_load_state: attribution.loadState,
        debug_target: attribution.interactionTarget || '(not set)',
        debug_interaction_delay: Math.round(attribution.inputDelay),
        debug_processing_duration: Math.round(attribution.processingDuration),
        debug_presentation_delay: Math.round(attribution.presentationDelay),
      }
    case 'CLS':
      return {
        debug_time: attribution.largestShiftTime,
        debug_load_state: attribution.loadState,
        debug_target: attribution.largestShiftTarget || '(not set)',
      }
    default:
      return { debug_target: '(not set)' }
  }
}

function sendToGoogleAnalytics({ name, delta, value, id, attribution }: any) {
  window.gtag('event', name, {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
    ...getDebugInfo(name, attribution),
  })
}

export async function setupGoogleAnalytics() {
  if (!import.meta.env.VITE_GA_ID)
    return

  const WV_URL = 'https://cdn.jsdmirror.com/npm/web-vitals@5.1.0/dist/web-vitals.attribution.iife.js'
  useScriptTag(
    WV_URL,
    () => {
      const { onCLS, onINP, onLCP } = window.webVitals
      onCLS(sendToGoogleAnalytics)
      onINP(sendToGoogleAnalytics)
      onLCP(sendToGoogleAnalytics)
    },
    { async: true },
  )
}
