/// <reference types="vite/client" />

// 声明 vite-plugin-svg-icons 提供的虚拟模块：用于自动注册 SVG 图标
declare module 'virtual:svg-icons-register' {
  // eslint-disable-next-line
  const component: any
  export default component
}

// 声明图标名称数组模块：返回所有已注册的图标名称，适用于图标选择器、预览等功能
declare module 'virtual:svg-icons-names' {
  // eslint-disable-next-line
  const iconsNames: string[]
  export default iconsNames
}

interface ViteTypeOptions {
  // 启用严格模式，禁止访问未声明的环境变量
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_PORT: number
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
