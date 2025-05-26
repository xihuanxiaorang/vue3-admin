import js from '@eslint/js' // 官方 JS 推荐规则插件（包含基础语法校验）
import pluginVue from 'eslint-plugin-vue' // Vue 3 支持插件，提供适配 Vue 文件的规则集
import { defineConfig } from 'eslint/config' // 用于类型安全地定义 ESLint 配置（Flat 模式专用）
import globals from 'globals' // 浏览器 & Node 全局变量定义
import tseslint from 'typescript-eslint' // TypeScript ESLint 支持插件，含推荐规则与专用解析器
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended' // Prettier 推荐规则集
import unocss from '@unocss/eslint-config/flat' // UnoCSS 官方 ESLint Flat 模式规则集（包含原子类顺序和 attributify 属性顺序校验等）

export default defineConfig([
  {
    // 通用规则：适用于 JS / TS / Vue 文件
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    // 启用官方 JS 插件
    plugins: { js },
    // 应用 JS 官方推荐规则集
    extends: ['js/recommended'],
  },
  {
    // 指定运行环境：支持浏览器和 Node.js 全局变量
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // 应用 TypeScript 官方推荐配置（包括类型检查相关规则）
  tseslint.configs.recommended,
  // 应用 Vue 官方提供的基础规则（essential，可升级为 strongly-recommended 或 recommended）
  pluginVue.configs['flat/essential'],
  {
    // 为 Vue 文件单独指定 TS 解析器，支持 <script lang="ts"> 正确解析
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    // 定义忽略的文件路径（不参与 ESLint 检查）
    name: 'app/files-to-ignore',
    ignores: [
      // 忽略 node_modules 目录
      '**/node_modules/**',
      // 忽略打包输出目录
      '**/dist/**',
      // 忽略测试文件
      '**/__tests__/**',
      // 忽略样式文件
      '**/*.css',
      // 忽略类型声明文件
      '**/*.d.ts',
    ],
  },
  // 引入 Prettier 推荐配置（关闭 ESLint 格式冲突规则 + 启用 prettier 检查）
  eslintPluginPrettierRecommended,
  // 引入 UnoCSS ESLint 插件（默认启用 order/order-attributify）
  unocss,
  {
    // 自定义规则
    rules: {
      // 变量声明未使用则发出警告（可帮助清理无效代码）
      'no-unused-vars': 'warn',
      // 使用 console.log 等输出语句时发出警告（生产环境应避免）
      'no-console': 'warn',
      // 使用 debugger 时发出警告
      'no-debugger': 'warn',
      // 禁止使用 var，建议使用 let 或 const
      'no-var': 'error',
      // 强制使用 === 和 !==，禁止 == 和 !=（避免类型转换引发 bug）
      eqeqeq: ['error', 'always'],
      // 强制函数要么总是有返回值，要么总是没有返回值，避免出现在某些分支有返回值、而另一些分支没有返回值的情况（提高代码可读性和稳定性）
      'consistent-return': 'warn',
      // 避免多余的分号
      'no-extra-semi': 'warn',
      // 属性顺序建议规范书写（增强一致性）
      'vue/attributes-order': 'warn',
      // 关闭 Vue HTML 缩进规则（交给 Prettier 等工具处理）
      'vue/html-indent': 'off',
      // 关闭 Vue 组件名必须为多词的限制（适用于如 Home.vue、Login.vue 等常见页面组件命名）
      'vue/multi-word-component-names': 'off',
      // 关闭未定义变量检查（TypeScript 会自行处理未声明变量的报错）
      'no-undef': 'off',
      // 关闭 TypeScript any 类型警告
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
