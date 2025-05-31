import type Language from '@/enums/Language'
import defaultSettings from '@/settings'
import { LANGUAGE_STORAGE_KEY } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export const useAppStore = defineStore('app', () => {
  const language = useStorage(LANGUAGE_STORAGE_KEY, defaultSettings.language)
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

  return { language, changeLanguage }
})
