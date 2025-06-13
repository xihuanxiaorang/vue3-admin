<template>
  <div class="tags-view-container">
    <el-scrollbar ref="scrollbarRef" class="srollbar-container" @wheel="handleScroll">
      <ContextMenu
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.fullPath"
        :menu-list="getContextMenuList(tag)"
        class="ml-5px mt-4px inline-block first-of-type:ml-15px last-of-type:mr-15px"
        @select="(item) => console.log(item, tag)"
      >
        <RouterLink
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
        <template #icon="{ menu }">
          <SvgIcon v-if="menu.icon" :icon-name="menu.icon"></SvgIcon>
        </template>
      </ContextMenu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useTagsViewStore } from '@/stores'
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
  affixTags.forEach((tag) => tagsViewStore.addView(tag))
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
        keepAlive: route.meta.keepAlive,
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
  tagsViewStore.addView({
    name: route.name as string,
    title: route.meta.title,
    path: route.path,
    fullPath: route.fullPath,
    icon: route.meta.icon,
    affix: route.meta.affix,
    keepAlive: route.meta.keepAlive,
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
  return tag.affix ?? false
}

/**
 * 关闭选中标签
 * @param tag 当前选中的标签
 */
const closeSelectedTag = async (tag: TagView) => {
  const { visitedViews } = await tagsViewStore.deleteView(tag)
  if (isActive(tag)) {
    toLastView(visitedViews, tag)
  }
}

/**
 * 跳转到最后一个标签
 * @param visitedViews 已访问的标签列表
 * @param view 标签
 */
const toLastView = (visitedViews: TagView[], view?: TagView) => {
  const lastView = visitedViews.slice(-1)[0]
  if (lastView && lastView.fullPath) {
    router.push(lastView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view?.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

/**
 * 获取标签右键菜单项
 * @param tag 标签
 */
const getContextMenuList = (tag: TagView): ContextMenuItem[] => {
  return [
    { label: '刷新', icon: 'refresh', onClick: () => refreshSelectedTag(tag) },
    { label: '关闭', icon: 'close', hidden: isAffix(tag), onClick: () => closeSelectedTag(tag) },
    { label: '关闭其他', icon: 'close-other', onClick: () => closeOtherTags(tag) },
    {
      label: '关闭左侧',
      icon: 'close-left',
      hidden: isFirstView(tag),
      onClick: () => closeLeftTags(tag),
    },
    {
      label: '关闭右侧',
      icon: 'close-right',
      hidden: isLastView(tag),
      onClick: () => closeRightTags(tag),
    },
    { label: '关闭所有', icon: 'close-all', onClick: () => closeAllTags(tag) },
  ]
}

/**
 * 刷新选中的标签
 * @param tag 当前选中的标签
 */
const refreshSelectedTag = (tag: TagView) => {
  tagsViewStore.deleteCachedView(tag)
  nextTick(() => {
    router.replace({ path: '/redirect' + tag.fullPath })
  })
}

/**
 * 关闭其他标签
 * @param tag 当前选中的标签
 */
const closeOtherTags = async (tag: TagView) => {
  await router.push(tag)
  tagsViewStore.deleteOtherViews(tag)
  scrollToActiveTag()
}

/**
 * 判断是否为第一个标签（首页或者第一个非首页标签）
 * @param tag 当前选中的标签
 */
const isFirstView = (tag: TagView) => {
  return tag.name === 'Dashboard' || tag.fullPath === tagsViewStore.visitedViews[1]?.fullPath
}

/**
 * 关闭左侧标签
 * @param tag 当前选中的标签
 */
const closeLeftTags = async (tag: TagView) => {
  const { visitedViews } = await tagsViewStore.deleteLeftViews(tag)
  if (!visitedViews.find((item) => item.path === route.path)) {
    toLastView(visitedViews, tag)
  }
}

/**
 * 判断是否为最后一个标签
 * @param tag 当前选中的标签
 */
const isLastView = (tag: TagView) => {
  return tag.fullPath === tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
}

/**
 * 关闭右侧标签
 * @param tag 当前选中的标签
 */
const closeRightTags = async (tag: TagView) => {
  const { visitedViews } = await tagsViewStore.deleteRightViews(tag)
  // 检查当前路由是否仍在剩余标签中：若不在，则跳转至最后一个标签
  if (!visitedViews.find((item) => item.path === route.path)) {
    toLastView(visitedViews)
  }
}

/**
 * 关闭所有标签
 */
const closeAllTags = async (tag: TagView) => {
  const { visitedViews } = await tagsViewStore.deleteAllViews()
  toLastView(visitedViews, tag)
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  @apply w-full border border-[var(--el-border-color-light)] border-solid shadow-[0_1px_1px_var(--el-box-shadow-light)];

  .srollbar-container {
    @apply whitespace-nowrap;
  }

  .tag-item {
    @apply inline-flex items-center h-26px px-8px text-12px leading-26px border border-[var(--el-border-color)] border-solid text-[var(--el-text-color-primary)];

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
