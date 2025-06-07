import type ComponentSize from '@/enums/ComponentSize'
import type Language from '@/enums/Language'
import SidebarStatus from '@/enums/SidebarStatus'
import defaultSettings from '@/settings'
import {
  LANGUAGE_STORAGE_KEY,
  SIDEBAR_STATUS_STORAGE_KEY,
  SIZE_STORAGE_KEY,
} from '@/utils/constants'

export const useAppStore = defineStore('app', () => {
  /**
   * 语言
   */
  const language = useStorage<Language>(LANGUAGE_STORAGE_KEY, defaultSettings.language)
  /**
   * 侧边栏状态
   */
  const sidebarStatus = useStorage<SidebarStatus>(
    SIDEBAR_STATUS_STORAGE_KEY,
    SidebarStatus.EXPANDED,
  )
  /**
   * 侧边栏是否折叠
   */
  const isSidebarCollapsed = computed(() => sidebarStatus.value === SidebarStatus.COLLAPSED)
  /**
   * 布局大小
   */
  const size = useStorage<ComponentSize>(SIZE_STORAGE_KEY, defaultSettings.size)

  /**
   * 切换语言
   * @param lang  语言
   */
  const changeLanguage = (lang: Language) => {
    language.value = lang
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

  /**
   * 改变布局大小
   * @param val  布局大小
   */
  const changeSize = (val: ComponentSize) => {
    size.value = val
  }

  return {
    language,
    changeLanguage,
    sidebarStatus,
    isSidebarCollapsed,
    toggleSidebarStatus,
    size,
    changeSize,
  }
})
