module.exports = {
  root: true,
  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  plugins: [
    'html'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
