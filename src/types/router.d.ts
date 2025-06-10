import 'vue-router'

declare module 'vue-router' {
  // 扩展 RouteMeta 接口，用于在路由中添加自定义的 meta 字段
  // 参考：https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
  interface RouteMeta {
    /**
     * 菜单标题，用于侧边栏、面包屑等显示
     * @example '首页'
     */
    title?: string
    /**
     * 菜单图标
     * @example 'dashboard'
     */
    icon?: string
    /**
     * 是否在侧边栏中隐藏
     * @example true 隐藏
     * @example false 显示
     * @default false
     */
    hidden?: boolean
    /**
     * 当有且仅有一个子菜单时，是否始终显示该菜单（作为目录存在）
     * @example true 始终显示
     * @example false 不始终显示
     * @default false
     */
    alwaysShow?: boolean
    /**
     * 是否在面包屑导航中隐藏
     * @example true 隐藏
     * @example false 显示
     * @default false
     */
    breadcrumb?: boolean
    /**
     * 是否固定在标签栏导航中
     * @example true 固定
     * @example false 不固定
     * @default false
     */
    affix?: boolean
  }
}
