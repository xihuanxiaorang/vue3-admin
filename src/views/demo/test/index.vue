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

  <div class="mb-4 flex items-center">
    <IMdiLocation />
    <IMdiMapMarkerRadius h-48px w-48px text-red />
    <IMdiSettings text-5xl text-cyan />
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

  <div class="mb4">
    <el-input v-model="input" style="width: 240px" placeholder="Please Input" />
  </div>

  <div class="box1 mb-4">
    <span class="text-xl text-red">{{ t('hello') }}</span>
  </div>

  <div class="mb4 flex items-center gap-10">
    <ContextMenu
      :menu-list="[
        { label: '添加' },
        { label: '编辑' },
        { label: '删除' },
        { label: '查看' },
        { label: '复制' },
      ]"
      class="box3"
      @select="(item) => console.log(item)"
    >
      <ContextMenu
        :menu-list="[
          { label: '员工' },
          { label: '部门' },
          { label: '角色' },
          { label: '权限' },
          { label: '菜单' },
        ]"
        class="box4"
        @select="(item) => console.log(item)"
      >
        <ContextMenu
          :menu-list="[
            { label: '菜单1' },
            { label: '菜单2' },
            { label: '菜单3' },
            { label: '菜单4' },
          ]"
          class="box5"
          @select="(item) => console.log(item)"
        >
          <span>Right Click</span>
        </ContextMenu>
      </ContextMenu>
    </ContextMenu>
  </div>

  <div class="box2 mb-4">
    <el-date-picker
      class="mb-5"
      type="datetimerange"
      :start-placeholder="t('common.startDate')"
      :end-placeholder="t('common.endDate')"
      format="YYYY-MM-DD HH:mm:ss"
      date-format="YYYY/MM/DD ddd"
      time-format="A hh:mm:ss"
    />
    <el-pagination
      :default-current-page="1"
      :default-page-size="10"
      :background="true"
      layout="prev, pager, next, jumper"
      :total="1000"
    />
  </div>

  <div class="mb-4 w-1/2 rounded-md bg-[var(--el-bg-color)] p-5">
    <transition
      enter-active-class="animate__animated animate__bounceInLeft"
      leave-active-class="animate__animated animate__bounceOutLeft"
    >
      <h1 v-show="visible" class="text-5xl text-orange-600 font-bold dark:text-blue-300">
        An animated element
      </h1>
    </transition>
    <el-button class="mt-2" type="primary" @click="visible = !visible">{{
      visible ? '隐藏' : '显示'
    }}</el-button>
  </div>

  <div class="grid grid-cols-2 mb-4 h-100 gap-6">
    <div ref="barChart"></div>
    <div ref="pieChart"></div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores'
import iconNames from 'virtual:svg-icons-names'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Test',
})

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

const { t } = useI18n()

const visible = ref(false)

const input = ref('')
</script>

<style lang="scss" scoped>
.box {
  @apply flex items-center justify-center rounded-lg;
}

.box1 {
  @extend .box;
  @apply h-100px w-150px bg-gray-300 dark:bg-gray-700;
}

.box2 {
  @extend .box;
  @apply w-600px flex-col border border-red border-style-dashed p-2;
}

.box3 {
  @extend .box;
  @apply h-300px w-400px bg-[var(--el-color-success-light-5)] dark:bg-[var(--el-color-success-dark-2)];
}

.box4 {
  @extend .box;
  @apply h-200px w-300px bg-[var(--el-color-warning-light-5)] dark:bg-[var(--el-color-warning-dark-2)];
}

.box5 {
  @extend .box;
  @apply h-100px w-200px bg-[var(--el-color-danger-light-5)] dark:bg-[var(--el-color-danger-dark-2)];
}
</style>
