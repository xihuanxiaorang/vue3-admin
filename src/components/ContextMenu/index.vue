<template>
  <div ref="wrapperRef">
    <slot></slot>
    <Teleport to="body">
      <Transition
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
      >
        <div
          v-if="visible"
          ref="contextmenuRef"
          class="context-menu"
          :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
        >
          <ul class="menu-list">
            <template v-for="menu in menuList" :key="menu.label">
              <li v-if="!menu.hidden" class="menu-item" @click="handleSelect(menu)">
                <slot name="icon" :menu="menu"></slot>
                <span>{{ menu.label }}</span>
              </li>
            </template>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { menuList } = defineProps<{
  menuList: ContextMenuItem[]
}>()

const wrapperRef = useTemplateRef('wrapperRef')
const { mouseX, mouseY, visible } = useContextMenu(wrapperRef)

/**
 * 菜单尺寸
 */
const contextmenuRef = useTemplateRef('contextmenuRef')
const { width: menuWidth, height: menuHeight } = useElementSize(contextmenuRef)
/**
 * 视口尺寸
 */
const { width: vw, height: vh } = useWindowSize()
/**
 * 菜单位置
 */
const pos = computed(() => {
  let x = mouseX.value
  let y = mouseY.value
  if (x > vw.value - menuWidth.value) {
    x = x - menuWidth.value
  }
  if (y > vh.value - menuHeight.value) {
    y = vh.value - menuHeight.value
  }
  return { x, y }
})

const emit = defineEmits<{
  (e: 'select', menu: ContextMenuItem): void
}>()

const handleSelect = (menu: ContextMenuItem) => {
  visible.value = false
  menu.onClick?.()
  emit('select', menu)
}

const handleBeforeEnter = (el: any) => {
  el.style.height = 0
}

const handleEnter = (el: any) => {
  el.style.height = 'auto'
  const h = el.clientHeight
  el.style.height = 0
  requestAnimationFrame(() => {
    el.style.height = h + 'px'
    el.style.transition = 'height .3s ease'
  })
}

const handleAfterEnter = (el: any) => {
  el.style.transition = 'none'
}
</script>

<style lang="scss" scoped>
.context-menu {
  @apply fixed z-999 text-12px font-400 text-[var(--el-text-color-primary)] rounded-lg  bg-[var(--el-bg-color)] shadow-[var(--el-box-shadow-light)] overflow-hidden min-w-100px;

  ul {
    @apply list-none m-0 py-5px px-0;

    li {
      @apply flex items-center gap-8px py-7px px-16px m-0 cursor-pointer hover:bg-[var(--el-fill-color-light)] transition-[background-color] duration-300 whitespace-nowrap;
    }
  }
}
</style>
