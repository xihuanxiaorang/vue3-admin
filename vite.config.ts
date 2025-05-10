import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      // 自动导入 VueRouter 相关函数，如：useRouter 等
      // 自动导入 Pinia 相关函数，如：createPinia，defineStore，storeToRefs 等
      // 参考自： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      imports: ['vue', 'vue-router', 'pinia'],
      // 自定义解析器
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
      ],
      // 指定哪些目录下的文件需要被扫描，并自动导入这些文件中导出的函数、变量等
      dirs: ['src/composables/**'],
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      // 指定自定义组件位置
      dirs: ['src/**/components'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入变量，无需在每个文件中单独引入
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
})
