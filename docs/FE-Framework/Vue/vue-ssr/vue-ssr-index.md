# Vue SSR 服务端渲染

## SSR 概述
什么是SSR，它解决什么问题，优缺点、相关概念

## Vue SSR 的实现

一步一步深入 Vue SSR
- 起个 express 服务，直出 HTML
- express 服务利用模板带数据返回HTML
- 使用 Vue-server-render 生成模板渲染，返回 HTML
- 实现路由
- 实现数据
- 异步组件和热更新 bundle
- 缓存

## vue-server-render 源码解析

1. webpack 编译阶段
   1. 入口 entry-client.js 生成用于客户端浏览器渲染的 js 文件和一份用于template组装的json 文件：vue-ssr-server-bundle.json
   2. 服务端打包入口 entry-server.js，生成客户端渲染的 json 文件：vue-ssr-server-bundle.json
2. 初始化 renderer 阶段：
   1. 使用 vue-server-renderer 的 API 会在node启动时初始化一个renderer 单例对象
3. 渲染阶段：
   1. 初始化完成，当用户发起请求时，renderer.renderToString 或者 renderer.renderToStream 函数将完成 vue组件到 html 片段的字符串的过程。
4. HTML 内容输出阶段：
   1. 渲染阶段我们已经拿到了vue组件渲染结果，它是一个html字符串，在浏览器中展示页面我们还需要css、js 等依赖资源的引入标签 和 通过 store 同步我们在服务端的渲染数据，这些最终组装成一个完整的 html 报文输出到浏览器中。
5. 客户端激活阶段
   1. 当客户端发起了请求，服务端返回 HTML，用户就已经可以看到页面渲染结果了，不用等待js加载和执行。但此时页面还不能交互，需要激活客户页面，即 hydirating 过程。


## Vue SSR 的框架 Nuxt.js
- 入门
- 实践