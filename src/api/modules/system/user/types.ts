/**
 * 当前登录用户信息
 */
export type UserInfo = {
  /**
   * 用户ID
   */
  userId: number
  /**
   * 用户名
   */
  username: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 头像URL
   */
  avatar: string
  /**
   * 角色集合
   */
  roles: string[]
  /**
   * 权限集合
   */
  permissions: string[]
}
