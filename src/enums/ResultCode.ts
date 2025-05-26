/**
 * 业务响应码枚举
 * @enum {string} 响应码遵循阿里开发手册中错误码规范
 */
enum ResultCode {
  /**
   * 成功响应码
   * @description 业务处理成功
   */
  SUCCESS = '00000',

  /**
   * 访问令牌无效或过期
   * @description 客户端提供的访问令牌无效 / 已过期 / 格式错误，需要重新登录获取有效的访问令牌
   * @recommendedAction 引导用户到登录页重新认证
   */
  TOKEN_INVALID = 'A0230',
}

export default ResultCode
