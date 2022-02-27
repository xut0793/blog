const nav = require('./nav')
const sidebar = require('./sidebar')
module.exports = {
  markdown: {
    toc: { includeLevel: [2, 3] },
  },
  title: "xut0793's blog",
  description:
    '个人知识框架整理，便于查缺漏。前端 HTML CSS ES TS Vue React Node Express Koa',
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
  themeConfig: {
    lastUpdated: '上次更新',
    repo: 'xutao0793/blog',
    nav,
    sidebar,
  },
}
