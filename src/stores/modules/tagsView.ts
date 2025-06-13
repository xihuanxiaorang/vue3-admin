export const useTagsViewStore = defineStore('tagsView', () => {
  /**
   * 已访问列表
   */
  const visitedViews = ref<TagView[]>([])
  /**
   * 缓存列表
   */
  const cachedViews = ref<string[]>([])

  /**
   * 添加一个标签到已访问列表中
   * @param view 待添加的标签
   * @description 添加逻辑：
   * 1. 如果已访问列表中已存在相同名称的标签，则跳过
   * 2. 固定的标签会被添加到已访问列表的开头
   * 3. 普通标签则会被添加到已访问列表的末尾
   */
  const addVisitedView = (view: TagView) => {
    if (visitedViews.value.some((v) => v.name === view.name)) return
    if (view.affix) {
      visitedViews.value.unshift(view)
    } else {
      visitedViews.value.push(view)
    }
  }

  /**
   * 添加一个标签到缓存列表中
   * @param view 待添加的标签
   * @description 添加逻辑：
   * 1. 如果标签未开启缓存或缓存列表中已存在相同名称的标签，则跳过
   * 2. 缓存列表中会添加当前标签名称
   */
  const addCachedView = (view: TagView) => {
    if (!view.keepAlive || cachedViews.value.includes(view.name)) return
    cachedViews.value.push(view.name)
  }

  /**
   * 添加一个标签到已访问列表和缓存列表中
   * @param view 待添加的标签
   */
  const addView = (view: TagView) => {
    addVisitedView(view)
    addCachedView(view)
  }

  /**
   * 删除已访问列表中的指定标签
   * @param view 待删除的标签
   * @description 通过路径匹配要删除的标签，执行数组删除操作
   */
  const deleteVisitedView = (view: TagView) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  /**
   * 删除缓存列表中的指定标签
   * @param view 待删除的标签
   * @description 通过名称匹配要删除的标签，执行数组删除操作
   */
  const deleteCachedView = (view: TagView) => {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  /**
   * 删除已访问列表和缓存列表中的指定标签
   * @param view 待删除的标签
   */
  const deleteView = (
    view: TagView,
  ): Promise<{
    visitedViews: TagView[]
    cachedViews: string[]
  }> => {
    return new Promise((resolve) => {
      deleteVisitedView(view)
      deleteCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  /**
   * 删除已访问列表中除指定标签和固定标签之外的其他标签
   * @param view 指定标签
   */
  const deleteOtherVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => v.affix || v.path === view.path)
  }

  /**
   * 删除缓存列表中除指定标签之外的其他标签
   * @param view 指定标签
   */
  const deleteOtherCachedViews = (view: TagView) => {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1)
    } else {
      cachedViews.value = []
    }
  }

  /**
   * 删除已访问列表和缓存列表中除指定标签和固定标签之外的其他标签
   * @param view 指定标签
   */
  const deleteOtherViews = (view: TagView) => {
    deleteOtherVisitedViews(view)
    deleteOtherCachedViews(view)
  }

  /**
   * 删除已访问列表和缓存列表中指定标签之前除固定标签之外的其他标签
   * @param view 指定标签
   */
  const deleteLeftViews = (view: TagView): Promise<{ visitedViews: TagView[] }> => {
    return new Promise((resolve) => {
      const currentIndex = visitedViews.value.findIndex((item) => item.path === view.path)
      if (currentIndex === -1) return
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index >= currentIndex || item.affix) return true
        const cachedIndex = cachedViews.value.indexOf(item.name)
        if (cachedIndex > -1) {
          cachedViews.value.splice(cachedIndex, 1)
        }
        return false
      })
      resolve({
        visitedViews: [...visitedViews.value],
      })
    })
  }

  /**
   * 删除已访问列表和缓存列表中指定标签之后除固定标签之外的其他标签
   * @param view 指定标签
   */
  const deleteRightViews = (view: TagView): Promise<{ visitedViews: TagView[] }> => {
    return new Promise((resolve) => {
      const currentIndex = visitedViews.value.findIndex((item) => item.path === view.path)
      if (currentIndex === -1) return
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index <= currentIndex || item.affix) return true
        const cachedIndex = cachedViews.value.indexOf(item.name)
        if (cachedIndex > -1) {
          cachedViews.value.splice(cachedIndex, 1)
        }
        return false
      })
      resolve({
        visitedViews: [...visitedViews.value],
      })
    })
  }

  /**
   * 删除已访问列表中除固定标签之外的所有标签和缓存列表中的所有标签
   */
  const deleteAllViews = (): Promise<{
    visitedViews: TagView[]
    cachedViews: string[]
  }> => {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((item) => item.affix)
      cachedViews.value = []
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    deleteCachedView,
    deleteView,
    deleteOtherViews,
    deleteLeftViews,
    deleteRightViews,
    deleteAllViews,
  }
})
