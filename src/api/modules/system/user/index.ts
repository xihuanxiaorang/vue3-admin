import { get } from '@/utils/request'
import type { UserInfo } from './types'

const USER_BASE_URL = '/system/user'

/**
 * 获取当前登录用户信息
 * @returns {Promise<UserInfo>} 当前登录用户信息
 */
export const getUserInfo = (): Promise<UserInfo> => {
  return get<UserInfo>(`${USER_BASE_URL}/me`)
}
