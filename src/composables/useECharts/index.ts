import echarts from './lib'

export function useECharts(
  elRef: MaybeRefOrGetter<HTMLElement | null>,
  option: MaybeRefOrGetter<ECOption> = {},
) {
  const chart = shallowRef<echarts.ECharts | null>()
  const isDark = useDark()

  const init = (): boolean => {
    const container = toValue(elRef)
    if (!container) {
      console.error('图表容器不存在')
      chart.value = null
      return false
    }
    try {
      chart.value?.dispose()
      chart.value = echarts.init(container, isDark.value ? 'dark' : 'light')
      return true
    } catch (err) {
      console.error('图表初始化失败:', err)
      chart.value = null
      return false
    }
  }

  const render = () => {
    const instance = chart.value
    if (!instance) {
      console.warn('图表尚未初始化')
      return
    }

    try {
      instance.clear()
      instance.setOption(toValue(option))
    } catch (err) {
      console.error('图表渲染失败:', err)
    }
  }

  const resize = useDebounceFn(
    () => {
      chart.value?.resize({ animation: { duration: 300 } })
    },
    300,
    { maxWait: 800 },
  )

  useEventListener(window, 'resize', resize)

  onMounted(() => {
    if (init()) {
      render()
    }
  })

  onUnmounted(() => {
    chart.value?.dispose()
    chart.value = null
  })

  watch(
    () => toValue(option),
    () => {
      render()
    },
    { deep: true },
  )

  watch(isDark, () => {
    if (init()) {
      render()
    }
  })
}
