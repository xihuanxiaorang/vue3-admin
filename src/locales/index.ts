import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import Language from '@/enums/Language'

// 导入本地语言包
import zhCN from './zh-cn.json'
import enUS from './en-us.json'
import { LANGUAGE_STORAGE_KEY } from '@/utils/constants'
import defaultSettings from '@/settings'

// 自动推导语言包结构用于类型推断
type MessageSchema = typeof zhCN

// 创建 vue-i18n 实例（启用类型安全）
const i18n = createI18n<[MessageSchema], Language.ZH_CN | Language.EN_US>({
  // 设置为 false 表示使用 Composition API 模式
  legacy: false,
  // 当前语言
  locale: useStorage(LANGUAGE_STORAGE_KEY, defaultSettings.language).value,
  // 语言加载失败时的兜底方案
  fallbackLocale: Language.ZH_CN,
  // 语言包资源
  messages: {
    [Language.ZH_CN]: zhCN,
    [Language.EN_US]: enUS,
  },
})

/**
 * 注册 I18n 插件
 * @param app Vue实例
 */
export function setupI18n(app: App) {
  app.use(i18n)
}
