/**
 * 创建 Element Plus 的 loading 适配器
 * @returns { onOpen, onClose } 供 useLoading 使用
 */
export function createElementPlusLoadingAdapter(): {
  onOpen: () => void
  onClose: () => void
} {
  let instance: ReturnType<typeof ElLoading.service> | null = null

  const onOpen = () => {
    if (instance) return
    instance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.5)',
    })
  }

  const onClose = () => {
    instance?.close()
    instance = null
  }

  return { onOpen, onClose }
}
