# Vue 源码学习

1. 初始化：Vue 构造函数及 Vue.prototype 原型对象，全局 API
1. 实例化：new Vue => _init() 及实例 API
1. Vue 响应式原理 reactivity
  1. 数据变化侦测 detection chnage
  1. 收集依赖：（对象 / 数组) collect dependency
  1. 派发更新: (对象 / 数组) dispatch update
1. 挂载 $mount(selector)
  - template => VNode: compiler (parse => optimize => codegen)
  - VNode => DOM: render (create vnode => patch)
1. 组件 component
1. 生命周期 lifecycle
1. 事件 events
1. nextTick
1. mergeOptions
1. 指令系统 directives
1. 样式 style

- vue
- vue-router
- vuex
- axios
- vue-cli
- webapck
- vue-loader