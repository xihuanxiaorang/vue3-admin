import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 是否显示 Loading 遮罩层
     */
    showLoading?: boolean
  }
}
