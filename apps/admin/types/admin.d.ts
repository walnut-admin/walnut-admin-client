import type * as ECharts from 'echarts/core'

declare global {
  type EChartsOption = import('echarts').EChartsOption

  interface ICapInst {
    new({ apiEndpoint: string }, el?: HTMLElement): { solve: () => Promise<{ success: boolean, token: string }> }
  }
}

export {}
