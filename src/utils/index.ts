import { isExternal } from './validate'
import path from 'path-browserify'

/**
 * 拼接并解析路由路径（将相对路径转为绝对路径）
 * @param routePath 当前路由路径
 * @param basePath 父级路由路径
 * @returns 解析后的完整路径
 */
export function resolvePath(routePath: string, basePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(basePath)) {
    return basePath
  }
  // 使用 path.resolve 拼接路径，自动处理重复斜杠与相对路径
  // 完整路由路径（/system/user）= 父级路由路径（/system） + 当前路由路径（user）
  return path.resolve(basePath, routePath)
}
