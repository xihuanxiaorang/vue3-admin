import type { App } from 'vue'

// 创建 Pinia 实例
const store = createPinia()

/**
 * 注册 Pinia 插件
 * @param app Vue实例
 */
export function setupPinia(app: App) {
  app.use(store)
}

export * from './modules/counter'
export * from './modules/app'
export * from './modules/tagsView'
