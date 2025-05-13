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
    <svg-icon
      v-for="iconName in iconNames"
      :key="iconName"
      :icon-name="iconName"
      text-5xl
      text-purple
    ></svg-icon>
  </div>

  <div class="mb-4">
    <el-input-number v-model="count" :min="1" :max="10" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import iconNames from 'virtual:svg-icons-names'
import { useCounterStore } from '@/stores/counter'

const { count } = storeToRefs(useCounterStore())
const handleChange = (value: number | undefined) => {
  count.value = value
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
</script>
