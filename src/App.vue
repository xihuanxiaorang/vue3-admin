<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import enUS from 'element-plus/es/locale/lang/en'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import { useAppStore } from './stores'
import Language from './enums/Language'

const { language } = storeToRefs(useAppStore())
const locale = computed(() => (language.value === Language.ZH_CN ? zhCN : enUS))
</script>
