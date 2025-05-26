import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ACCESS_TOKEN } from './constants'
import ResultCode from '@/enums/ResultCode'

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
 * 错误处理映射表
 */
const ERROR_HANDLERS: {
  /**
   * 业务错误处理器集合
   * @key string - 业务错误码（对应 ResultCode 枚举值）
   * @value () => void - 对应的错误处理函数
   * @property default - 未匹配错误码时的默认处理器
   */
  business: Record<string, () => void> & { default: () => void }
  /**
   * HTTP 错误消息映射
   * @key number - HTTP 状态码（如 400、500）
   * @value string - 对应的友好错误提示
   * @property default - 未匹配状态码时的默认提示
   */
  http: Record<number, string> & { default: string }
} = {
  business: {
    [ResultCode.TOKEN_INVALID]: () => handleTokenExpired(),
    default: () => ElMessage.error('未知业务错误'),
  },
  http: {
    400: '请求参数错误',
    401: '会话已过期，请重新登录',
    403: '权限不足，请联系管理员',
    404: '资源不存在，请联系管理员',
    500: '服务器内部错误，请联系管理员',
    default: '未知错误，请联系管理员',
  },
}

/**
 * 会话过期处理函数
 *
 * 当检测到会话过期时，弹出确认对话框提示用户重新登录。
 * 用户确认后将强制刷新当前页面（通常用于重新初始化登录状态），
 * 取消操作则不执行任何动作。
 */
const handleTokenExpired = () => {
  ElMessageBox.confirm('会话已过期，是否重新登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => location.reload())
}

/*******************************Http 请求封装*********************************/
class Http {
  /**
   * Axios 实例对象，封装所有请求的基础配置
   */
  private readonly axiosInstance: AxiosInstance
  /**
   * 全局 loading 控制器，用于统一管理请求 loading 状态
   */
  private readonly loadingControl = useGlobalLoading()

  constructor() {
    this.axiosInstance = axios.create({
      /**
       * API 基础路径（从环境变量获取）
       * @default import.meta.env.VITE_APP_BASE_API
       */
      baseURL: import.meta.env.VITE_APP_BASE_API,
      /**
       * 请求超时时间（单位：毫秒）
       * @default Number(import.meta.env.VITE_APP_API_TIMEOUT)
       */
      timeout: Number(import.meta.env.VITE_APP_API_TIMEOUT),
      /**
       * 默认请求头配置
       * @property Content-Type - 默认使用 JSON 格式
       */
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      /**
       * 自定义扩展配置：是否显示全局 loading
       * @default true - 可通过请求配置覆盖
       */
      showLoading: true,
    })
    // 设置请求和响应拦截器
    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        if (config.showLoading) {
          this.loadingControl.show()
        }

        return config
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error)
      },
    )

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<Result>) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error),
    )
  }

  /**
   * 处理成功响应（状态码 2xx）
   * @param response - 原始响应对象
   * @returns 业务数据 或 二进制响应对象
   * @throws 当业务码非成功时抛出错误
   */
  private handleSuccessResponse(response: AxiosResponse<Result>) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const config = response.config
    if (config.showLoading) {
      this.loadingControl.hide()
    }

    if (this.isBinaryResponse(response)) {
      return response
    }

    const { code, message, data } = response.data
    if (code === ResultCode.SUCCESS) {
      return data
    }

    this.handleBusinessError(code)
    return Promise.reject(new Error(message || '请求失败'))
  }

  /**
   * 处理失败响应（状态码非 2xx 或网络错误、取消请求等）
   * @param error - 错误对象
   * @returns 始终返回 rejected 状态的 Promise
   */
  private handleErrorResponse(error: any) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const config = error.config as AxiosRequestConfig
    if (config?.showLoading) {
      this.loadingControl.hide()
    }

    if (axios.isCancel(error)) {
      return Promise.reject(new Error('请求被取消'))
    }

    if (!error.response) {
      if (!navigator.onLine) {
        ElMessage.error('网络已断开，请检查您的网络连接')
        return Promise.reject(new Error('网络断开'))
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
        return Promise.reject(new Error('请求超时'))
      }

      ElMessage.error('网络异常，请检查您的连接')
      return Promise.reject(new Error('网络异常'))
    }

    this.handleHttpError(error.response?.status)
    return Promise.reject(error)
  }

  /**
   * 判断是否为二进制类型的响应（如文件下载）
   *
   * 用于跳过业务状态码解析，直接返回响应体。
   * 通常 responseType 为 'blob' 或 'arraybuffer' 时，
   * 表示服务端返回的是文件流（如导出 Excel、下载 PDF 等）。
   *
   * @param response - Axios 响应对象
   * @returns 是否为二进制响应类型
   */
  private isBinaryResponse(response: AxiosResponse) {
    return response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer'
  }

  /**
   * 处理业务错误码
   * @param code - 后端定义的错误码
   */
  private handleBusinessError(code: string) {
    const handler = ERROR_HANDLERS.business[code] || ERROR_HANDLERS.business.default
    handler()
  }

  /**
   * 处理 HTTP 状态码错误
   * @param status - HTTP 状态码（如 401、500 等）
   */
  private handleHttpError(status: number) {
    const message = ERROR_HANDLERS.http[status] ?? ERROR_HANDLERS.http.default
    ElMessage.error(message)
  }

  /**
   * 发起通用请求
   * @template T - 响应数据类型
   * @param config - Axios 请求配置
   * @returns Promise<T> - 返回处理后的业务数据 Promise
   *
   * @example
   * request<{ list: [] }>({ url: '/api/list' })
   */
  request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    return this.axiosInstance.request(config)
  }

  /**
   * GET 请求快捷方法
   * @template T - 响应数据类型
   * @param url - 请求地址
   * @param params - 查询参数（拼接到 URL）
   * @param config - 额外请求配置（可选）
   */
  get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => {
    return this.request<T>({
      ...config,
      url,
      method: 'GET',
      params,
    })
  }
  /**
   * POST 请求方法
   * @param url 请求地址
   * @param data 请求参数
   * @param config 请求配置
   * @returns Promise<T>
   */
  post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    })
  }
  /**
   * PUT 请求方法
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置项
   * @returns Promise<T>
   */
  put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data,
    })
  }
  /**
   * DELETE 请求方法
   * @param url 请求地址
   * @param config 配置项
   * @returns Promise<T>
   */
  delete = <T = any>(url: string, config?: AxiosRequestConfig) => {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url,
    })
  }
}

/**
 * 导出 HTTP 实例及相关方法
 * @property del - delete 方法的别名（避免与关键字冲突）
 */
const http = new Http()
export const { request, get, post, put, delete: del } = http
export default http
