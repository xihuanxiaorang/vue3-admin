// https://juejin.cn/post/7250513276236267557?searchId=20250611121032438979A642015A52BFEF
export function useContextMenu(wrapperRef: MaybeRefOrGetter<HTMLElement | null>) {
  const visible = ref(false)
  const mouseX = ref(0)
  const mouseY = ref(0)

  const contextmenuHandler = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    visible.value = true
  }

  const closeHandler = () => {
    visible.value = false
  }

  useEventListener(wrapperRef, 'contextmenu', contextmenuHandler)
  useEventListener(window, 'click', closeHandler, true)
  useEventListener(window, 'contextmenu', closeHandler, true)

  return { mouseX, mouseY, visible }
}
