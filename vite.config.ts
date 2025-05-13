import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

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
        // 自动导入图标组件
        IconsResolver(),
      ],
      // 指定哪些目录下的文件需要被扫描，并自动导入这些文件中导出的函数、变量等
      dirs: ['src/composables/**'],
      // 指定生成的类型声明文件路径
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        // 自动注册 Element Plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          // 限定启用指定图标集（可选）
          // 若启用多个图标集，可设置为 ['ep', 'mdi', 'tabler'] 等
          // 不指定时默认启用所有已安装图标集
          enabledCollections: ['ep'],
        }),
      ],
      // 指定自定义组件位置
      dirs: ['src/**/components'],
      // 指定生成的类型声明文件路径
      dts: 'src/types/components.d.ts',
    }),
    Icons({
      // 启用图标集自动安装
      autoInstall: true,
    }),
    createSvgIconsPlugin({
      // 指定图标文件目录
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 定义生成的 symbol ID 格式：默认值为 icon-[dir]-[name]
      // - [prefix] 表示图标前缀
      // - [dir] 表示图标所在子目录名称
      // - [name] 表示图标文件名
      // 最终生成的 ID 形如：icon-user 或 icon-folder-user
      symbolId: 'icon-[dir]-[name]',
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
