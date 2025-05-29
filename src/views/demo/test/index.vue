<template>
  <div class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button plain>Plain</el-button>
    <el-button type="primary" plain>Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" plain>Info</el-button>
    <el-button type="warning" plain>Warning</el-button>
    <el-button type="danger" plain>Danger</el-button>
  </div>

  <div class="mb-4">
    <el-button :plain="true" @click="open2">Success</el-button>
    <el-button :plain="true" @click="open3">Warning</el-button>
    <el-button :plain="true" @click="open1">Message</el-button>
    <el-button :plain="true" @click="open4">Error</el-button>
  </div>

  <div class="mb-4">
    <IEpAddLocation />
    <IEpMapLocation h-48px w-48px text-red />
    <IEpSetting text-5xl text-cyan />
  </div>

  <div class="mb-4">
    <SvgIcon
      v-for="iconName in iconNames"
      :key="iconName"
      :icon-name="iconName"
      text-5xl
      text-purple
    ></SvgIcon>
  </div>

  <div class="mb-4">
    <el-input-number v-model="count" :min="1" :max="10" @change="handleChange" />
  </div>

  <div class="grid grid-cols-2 mb-4 h-100 gap-6">
    <div ref="barChart"></div>
    <div ref="pieChart"></div>
  </div>
</template>

<script setup lang="ts">
import iconNames from 'virtual:svg-icons-names'
import { useCounterStore } from '@/stores/counter'

const { count } = storeToRefs(useCounterStore())
const handleChange = (value: number | undefined) => {
  count.value = value ?? 1
}

const open1 = () => {
  ElMessage('This is a message.')
}
const open2 = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}
const open3 = () => {
  ElMessage({
    message: 'Warning, this is a warning message.',
    type: 'warning',
  })
}
const open4 = () => {
  ElMessage.error('Oops, this is a error message.')
}

const barChart = useTemplateRef('barChart')
const barChartOption = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    data: ['Evaporation', 'Precipitation', 'Temperature'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Precipitation',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} ml',
      },
    },
    {
      type: 'value',
      name: 'Temperature',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} °C',
      },
    },
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        },
      },
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    },
    {
      name: 'Precipitation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        },
      },
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' °C'
        },
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
    },
  ],
})
useECharts(barChart, barChartOption)

const pieChart = useTemplateRef('pieChart')
const pieChartOption = ref<ECOption>({
  legend: {
    top: 'bottom',
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 150],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' },
      ],
    },
  ],
})
useECharts(pieChart, pieChartOption)
</script>

<style lang="scss" scoped>
.box {
  @apply h-100px w-150px flex items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700;
}
</style>
