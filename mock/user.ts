import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
  {
    url: '/api/system/user/list',
    method: 'get',
    response: ({ query }: { query: Partial<Record<'page' | 'pageSize', number>> }) => {
      const page = Number(query.page || 1)
      const pageSize = Number(query.pageSize || 10)
      const total = 100
      const list = Mock.mock({
        [`items|${pageSize}`]: [
          {
            id: '@id',
            name: '@cname',
            age: '@integer(18, 30)',
            avatar: '@image("50*50", "#4A7BF7", "User")',
            address: '@county(true)',
          },
        ],
      }).items

      return {
        code: '00000',
        message: '一切ok',
        data: {
          page,
          pageSize,
          total,
          list,
        },
      }
    },
  },
] as MockMethod[]
