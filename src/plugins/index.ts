import { setupRouter } from '@/router'
import { setupPinia } from '@/stores'
import type { App } from 'vue'

/**
 * 注册插件（如：vue-router、pinia 等）
 * @param app Vue实例
 */
export function setupPlugins(app: App) {
  /**
   * 路由(router)
   */
  setupRouter(app)
  /**
   * 状态管理(store)
   */
  setupPinia(app)
}
