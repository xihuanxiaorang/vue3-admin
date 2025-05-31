<script lang="ts" setup>
import Language from '@/enums/Language'
import { useAppStore } from '@/stores/modules/app'

const { iconSize = 25 } = defineProps<{ iconSize?: number }>()

const appStore = useAppStore()

const langOptions = computed(() => {
  return [
    { label: '中文', value: Language.ZH_CN },
    { label: 'English', value: Language.EN_US },
  ].map((opt) => {
    return {
      ...opt,
      disabled: opt.value === appStore.language,
    }
  })
})
</script>

<template>
  <el-dropdown
    trigger="click"
    class="cursor-pointer text-black dark:text-white"
    @command="appStore.changeLanguage"
  >
    <el-icon :size="iconSize">
      <IMdiLanguage />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="opt in langOptions"
          :key="opt.value"
          :command="opt.value"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
