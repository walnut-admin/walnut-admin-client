import { analyzer } from 'vite-bundle-analyzer'

export function createVisualizerPlugin(title: string) {
  return analyzer({
    reportTitle: `${title} Bundle Analyzer`,
  })
}
