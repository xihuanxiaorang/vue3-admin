import type Language from '@/enums/Language'
import SidebarStatus from '@/enums/SidebarStatus'
import defaultSettings from '@/settings'
import { LANGUAGE_STORAGE_KEY } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export const useAppStore = defineStore('app', () => {
  /**
   * 语言
   */
  const language = useStorage(LANGUAGE_STORAGE_KEY, defaultSettings.language)
  /**
   * 侧边栏状态
   */
  const sidebarStatus = useStorage<SidebarStatus>('sidebarStatus', SidebarStatus.EXPANDED)
  /**
   * 侧边栏是否折叠
   */
  const isSidebarCollapsed = computed(() => sidebarStatus.value === SidebarStatus.COLLAPSED)

  const { locale, t } = useI18n()
  /**
   * 切换语言
   * @param lang  语言
   */
  const changeLanguage = (lang: Language) => {
    language.value = lang
    locale.value = lang
    ElMessage.success(t('message.switchLanguageSuccess'))
  }

  /**
   * 切换侧边栏状态
   */
  const toggleSidebarStatus = () => {
    sidebarStatus.value =
      sidebarStatus.value === SidebarStatus.COLLAPSED
        ? SidebarStatus.EXPANDED
        : SidebarStatus.COLLAPSED
  }

  return { language, changeLanguage, sidebarStatus, isSidebarCollapsed, toggleSidebarStatus }
})
