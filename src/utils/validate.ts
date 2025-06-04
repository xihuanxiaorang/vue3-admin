/**
 * 检查路径是否为外部链接
 * @param path 要检查的路径
 * @returns 如果是外部链接，则为 true，否则为 false
 */
export const isExternal = (path: string) => {
  return /^https?:|http?:|mailto:|tel:/.test(path)
}
