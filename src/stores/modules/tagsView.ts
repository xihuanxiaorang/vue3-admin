import type { LocationQuery } from 'vue-router'

/**
 * 标签对象
 */
export interface TagView {
  /**
   * 标签名称
   */
  name: string
  /**
   * 标签标题
   */
  title: string
  /**
   * 标签路由路径
   */
  path: string
  /**
   * 标签完整路由路径
   */
  fullPath: string
  /**
   * 标签图标
   */
  icon?: string
  /**
   * 标签是否固定
   */
  affix?: boolean
  /**
   * 路由查询参数
   */
  query?: LocationQuery
}

export const useTagsViewStore = defineStore('tagsView', () => {
  /**
   * 已访问列表
   */
  const visitedViews = ref<TagView[]>([])

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

  return { visitedViews, addVisitedView, deleteVisitedView }
})
