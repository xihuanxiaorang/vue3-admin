interface LoadingOptions {
  /**
   * 延迟显示的时间（ms），默认 200ms
   */
  delay?: number
  /**
   * 触发显示时的回调（如启动动画或加载遮罩）
   */
  onOpen?: () => void
  /**
   * 触发隐藏时的回调（如关闭动画或移除遮罩）
   */
  onClose?: () => void
}

/**
 * 全局 loading 状态管理 Hook
 * - 支持延迟显示（防止短操作闪烁）
 * - 支持多请求叠加控制
 * @param delay 延迟显示的时间（默认 200ms）
 * @param onOpen 触发显示时的回调（如启动动画或加载遮罩）
 * @param onClose 触发隐藏时的回调（如关闭动画或移除遮罩）
 */
export const useLoading = ({
  delay = 200,
  onOpen = () => {},
  onClose = () => {},
}: LoadingOptions = {}) => {
  /**
   * 延迟触发的定时器引用
   */
  const delayTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  /**
   * 活跃中的 loading 请求数量（支持并发叠加）
   */
  const activeCount = ref(0)

  /**
   * 当前是否处于 loading 状态
   */
  const isLoading = computed(() => {
    return activeCount.value > 0
  })

  /**
   * 清除延迟定时器（避免重复触发）
   */
  const clearDelayTimer = () => {
    if (delayTimer.value) {
      clearTimeout(delayTimer.value)
      delayTimer.value = null
    }
  }

  /**
   * 显示 loading（触发外部 onOpen 回调）
   */
  const openLoading = () => {
    onOpen()
  }

  /**
   * 隐藏 loading（触发外部 onClose 回调）
   */
  const closeLoading = () => {
    clearDelayTimer()
    onClose()
  }

  /**
   * 设置 loading 状态
   * @param visible {true} 表示显示，{false} 表示隐藏
   */
  const setLoading = (visible: boolean) => {
    // 更新计数器并限制最小值为 0
    activeCount.value += visible ? 1 : -1
    activeCount.value = Math.max(0, activeCount.value)

    if (visible && activeCount.value === 1) {
      // 清理可能存在的旧定时器（防抖处理）
      clearDelayTimer()
      // 延迟显示 loading（200ms 后触发，避免短期操作闪烁）
      delayTimer.value = setTimeout(() => {
        // 双重验证当前仍需显示 loading（防止状态过期）
        if (activeCount.value > 0) {
          openLoading()
        }
        delayTimer.value = null
      }, delay)
    }

    if (!visible && activeCount.value === 0) {
      closeLoading()
    }
  }

  /**
   * 显示 loading
   */
  const show = () => {
    setLoading(true)
  }

  /**
   * 隐藏 loading
   */
  const hide = () => {
    setLoading(false)
  }

  return { isLoading, setLoading, show, hide }
}
