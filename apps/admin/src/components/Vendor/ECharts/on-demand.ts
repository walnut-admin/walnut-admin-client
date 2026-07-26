import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
])

window.echarts = echarts

export default echarts
