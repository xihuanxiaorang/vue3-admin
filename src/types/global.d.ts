declare global {
  /**
   * 统一响应结构体
   */
  interface Result<T = any> {
    /**
     * 响应码
     */
    code: string
    /**
     * 响应消息
     */
    message: string
    /**
     * 响应数据
     */
    data: T
  }

  /**
   * 标签对象
   */
  interface TagView {
    /**
     * 标签名称
     */
    name: string
    /**
     * 标签标题
     */
    title: string
    /**
     * 标签路由路径
     */
    path: string
    /**
     * 标签完整路由路径
     */
    fullPath: string
    /**
     * 标签图标
     */
    icon?: string
    /**
     * 标签是否固定
     */
    affix?: boolean
    /**
     * 是否开启缓存
     */
    keepAlive?: boolean
    /**
     * 路由查询参数
     */
    query?: LocationQuery
  }

  interface ContextMenuItem {
    /**
     * 菜单项名称
     */
    label: string
    /**
     * 菜单项图标
     */
    icon?: string
    /**
     * 菜单项是否隐藏
     */
    hidden?: boolean
    /**
     * 菜单项选择回调
     */
    onClick?: () => void
  }
}
export {}
