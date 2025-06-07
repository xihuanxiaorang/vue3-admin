<script lang="ts" setup>
import ComponentSize from '@/enums/ComponentSize'
import { useAppStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { iconSize = 25 } = defineProps<{ iconSize?: number }>()

const appStore = useAppStore()

const { t } = useI18n()

const sizeOptions = [
  { label: 'Default', value: ComponentSize.DEFAULT },
  { label: 'Small', value: ComponentSize.SMALL },
  { label: 'Large', value: ComponentSize.LARGE },
]

const handleSizeChange = (size: string) => {
  appStore.changeSize(size as ComponentSize)
  ElMessage.success(t('message.switchSizeSuccess'))
}
</script>

<template>
  <el-dropdown
    trigger="click"
    class="cursor-pointer text-black dark:text-white"
    @command="handleSizeChange"
  >
    <el-icon :size="iconSize">
      <IMdiFormatSize />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="opt in sizeOptions"
          :key="opt.value"
          :command="opt.value"
          :disabled="opt.value === appStore.size"
        >
          {{ opt.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
