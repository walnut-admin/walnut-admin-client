import type { WHomeChartCardProps } from './components/types'
import { getRandomInt } from 'easy-fns-ts'
import echarts from '@/components/Vendor/ECharts/on-demand'

function onGetOption1(): EChartsOption {
  return {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      outerBounds: {
        bottom: '12%',
        top: '0%',
        left: '0%',
        right: '0%',
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
      {
        name: 'Line 2',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)',
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [120, 282, 111, 234, 220, 340, 310],
      },
      {
        name: 'Line 3',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)',
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [320, 132, 201, 334, 190, 130, 220],
      },
      {
        name: 'Line 4',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)',
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 402, 231, 134, 190, 230, 120],
      },
      {
        name: 'Line 5',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)',
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 302, 181, 234, 210, 290, 150],
      },
    ],
  }
}

function onGetOption2(): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  }
}

export function useChartCard() {
  const loading = ref(false)

  const cards = ref<WHomeChartCardProps[]>([
    {
      option: onGetOption1(),
      loading: loading.value,
      title: 'Line Chart',
      headerExtra: {
        text: 'Stacked',
        tagProps: {
          type: 'success',
        },
      },
    },
    {
      option: onGetOption2(),
      loading: loading.value,
      title: 'Pie Chart',
      headerExtra: {
        text: 'Doughnut',
        tagProps: {
          type: 'info',
        },
      },
    },
  ])

  const onCallApi = (): Promise<any> => {
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        resolve({
          option1: Array.from({ length: 5 }, () =>
            Array.from({ length: 7 }, () => getRandomInt(0, 300))),
          option2: Array.from({ length: 5 }, () => getRandomInt(300, 1000)),
        })
        clearTimeout(id)
      }, 500)
    })
  }

  useIntervalFn(
    async () => {
      loading.value = true
      const res = await onCallApi()

      // @ts-expect-error any index
      cards.value[0].option!.series![0].data = res.option1[0]
      // @ts-expect-error any index
      cards.value[0].option!.series![1].data = res.option1[1]
      // @ts-expect-error any index
      cards.value[0].option!.series![2].data = res.option1[2]
      // @ts-expect-error any index
      cards.value[0].option!.series![3].data = res.option1[3]
      // @ts-expect-error any index
      cards.value[0].option!.series![4].data = res.option1[4]
      // @ts-expect-error any index
      cards.value[1].option!.series![0].data = [
        { value: res.option2[0], name: 'Search Engine' },
        { value: res.option2[1], name: 'Direct' },
        { value: res.option2[2], name: 'Email' },
        { value: res.option2[3], name: 'Union Ads' },
        { value: res.option2[4], name: 'Video Ads' },
      ]

      loading.value = false
    },
    10000,
    { immediate: true, immediateCallback: true },
  )

  return { cards, loading }
}
