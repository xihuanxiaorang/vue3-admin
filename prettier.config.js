export default {
  // 每行最大字符数，超过将自动换行
  printWidth: 100,
  // 一个缩进级别所用的空格数
  tabWidth: 2,
  // 是否使用制表符（tab）缩进，false 表示使用空格
  useTabs: false,
  // 是否在语句末尾添加分号
  semi: false,
  // 否使用单引号替代双引号
  singleQuote: true,
  //对象属性名是否加引号：as-needed（仅在需要时）丨consistent（统一全部加）丨preserve（保留输入）
  quoteProps: 'as-needed',
  //多行对象或数组的末尾是否添加逗号：none（不添加）丨es5（ES5支持的地方加）丨all（全部加）
  trailingComma: 'all',
  // 对象大括号内是否保留空格，例如：{ foo：bar }
  bracketSpacing: true,
  //箭头函数参数是否总是带括号（如：（x）=x）
  arrowParens: 'always',
  //指定换行符：Lf（\n）丨crLf（\r\n）丨cr（\r）丨auto（自动检测)
  endOfLine: 'auto',
}
