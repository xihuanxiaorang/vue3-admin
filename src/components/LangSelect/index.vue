<script lang="ts" setup>
import Language from '@/enums/Language'
import { useAppStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { iconSize = 25 } = defineProps<{ iconSize?: number }>()

const appStore = useAppStore()

const { locale, t } = useI18n()

const langOptions = [
  { label: '中文', value: Language.ZH_CN },
  { label: 'English', value: Language.EN_US },
]

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  appStore.changeLanguage(lang as Language)
  ElMessage.success(t('message.switchLanguageSuccess'))
}
</script>

<template>
  <el-dropdown
    trigger="click"
    class="cursor-pointer text-black dark:text-white"
    @command="handleLanguageChange"
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
          :disabled="opt.value === appStore.language"
        >
          {{ opt.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
