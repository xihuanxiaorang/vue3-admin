<template>
  <div class="tags-view-container">
    <el-scrollbar ref="scrollbarRef" class="srollbar-container" @wheel="handleScroll">
      <RouterLink
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.fullPath"
        :to="{ path: tag.path, query: tag.query }"
        :class="{ active: isActive(tag) }"
        class="tag-item"
        @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
      >
        <span class="tag-text">{{ tag.title }}</span>
        <span v-if="!isAffix(tag)" class="close-icon" @click.prevent.stop="closeSelectedTag(tag)">
          ×
        </span>
      </RouterLink>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useTagsViewStore, type TagView } from '@/stores'
import { routes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import { resolve } from 'path-browserify'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()
const scrollbarRef = useTemplateRef('scrollbarRef')
const wrapRef = computed(() => scrollbarRef.value?.wrapRef)
const { x } = useScroll(wrapRef, { behavior: 'smooth' })

onMounted(() => {
  initAffixTags()
})

/**
 * 初始化固定标签
 */
const initAffixTags = () => {
  const affixTags = filterAffixTags(routes)
  affixTags.forEach((tag) => tagsViewStore.addVisitedView(tag))
}

/**
 * 过滤出要固定显示的标签
 * @param routes 路由列表
 * @param basePath 基础路径
 */
const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
  return routes.reduce((tags, route) => {
    const tagPath = resolve(basePath, route.path)
    if (route.meta?.title && route.meta?.affix) {
      tags.push({
        name: route.name as string,
        title: route.meta?.title,
        path: tagPath,
        fullPath: tagPath,
        icon: route.meta?.icon,
        affix: true,
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, tagPath)
      if (tempTags.length > 0) {
        tags.push(...tempTags)
      }
    }
    return tags
  }, [] as TagView[])
}

/**
 * 添加标签
 */
const addTag = () => {
  if (!route.meta.title) return
  tagsViewStore.addVisitedView({
    name: route.name as string,
    title: route.meta.title,
    path: route.path,
    fullPath: route.fullPath,
    icon: route.meta.icon,
    affix: route.meta.affix,
    query: route.query,
  })
}

/**
 * 平滑滚动至当前激活的标签，使其尽量居中显示
 */
const scrollToActiveTag = () => {
  // 等待DOM更新后执行滚动计算
  nextTick(() => {
    const wrapEl = wrapRef.value
    if (!wrapEl) return

    // 获取当前激活的标签元素
    const activeTag = wrapEl.querySelector('.tag-item.active') as HTMLElement
    if (!activeTag) return

    // 计算将激活标签置于容器中央所需的理论滚动位置：
    // 标签左侧偏移量 - (容器可视宽度 - 标签自身宽度) / 2
    const centerOffset = activeTag.offsetLeft - (wrapEl.clientWidth - activeTag.offsetWidth) / 2

    // 计算最大有效滚动位置（防止滚动超出内容区域）
    const maxScroll = wrapEl.scrollWidth - wrapEl.clientWidth

    // 触发滚动
    x.value = Math.max(0, Math.min(centerOffset, maxScroll))
  })
}

watch(
  () => route.path,
  () => {
    addTag()
    scrollToActiveTag()
  },
  { immediate: true },
)

/**
 * 处理鼠标滚轮事件，实现水平滚动
 */
const handleScroll = (event: any) => {
  const wrapEl = wrapRef.value
  if (!wrapEl) return
  if (wrapEl.scrollWidth > wrapEl.clientWidth) {
    x.value = wrapEl.scrollLeft - (event.wheelDelta || 0)
  }
}

/**
 * 判断当前标签是否处于激活状态
 * @param tag 标签
 */
const isActive = (tag: TagView) => {
  return tag.path === route.path
}

/**
 * 判断当前标签是否固定显示
 * @param tag 标签
 */
const isAffix = (tag: TagView) => {
  return tag.affix
}

/**
 * 关闭选中标签
 * @param tag 标签
 */
const closeSelectedTag = (tag: TagView) => {
  tagsViewStore.deleteVisitedView(tag)
  if (isActive(tag)) {
    toLastView()
  }
}

/**
 * 跳转到最后一个标签
 */
const toLastView = () => {
  const lastView = tagsViewStore.visitedViews.slice(-1)[0]
  if (lastView && lastView.fullPath) {
    router.push(lastView.fullPath)
  } else {
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  @apply w-full border border-[var(--el-border-color-light)] border-solid shadow-[0_1px_1px_var(--el-box-shadow-light)];

  .srollbar-container {
    @apply whitespace-nowrap;
  }

  .tag-item {
    @apply relative inline-flex items-center h-26px px-8px mt-4px ml-5px text-12px leading-26px border border-[var(--el-border-color)] border-solid text-[var(--el-text-color-primary)] first-of-type:ml-15px last-of-type:mr-15px;

    .tag-text {
      @apply inline-block align-middle;
    }

    .close-icon {
      @apply inline-flex items-center justify-center w-16px h-16px ml-5px text-12px font-bold text-[var(--el-text-color-secondary)] rounded-1/2 transition-all duration-200 ease hover:text-[var(--el-color-white)] hover:bg-[var(--el-text-color-placeholder)];
    }

    &.active {
      @apply bg-[var(--el-color-primary)] text-[var(--el-color-white)] border-[var(--el-color-primary)];

      &::before {
        @apply relative inline-block w-8px h-8px content-[''] mr-2px bg-[var(--el-color-white)] rounded-1/2;
      }

      .close-icon {
        @apply text-[var(--el-color-white)] hover:bg-[rgba(255,255,255,0.3)];
      }
    }
  }
}
</style>
