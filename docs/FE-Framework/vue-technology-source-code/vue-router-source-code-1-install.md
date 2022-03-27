# VueRouter源码1: install 安装

[[toc]]

## 路由基本使用

```html

<div id="app">
  <h1>Hello App!</h1>
  <router-link to="/info/13?q=keyword">详情页</router-link>
  <hr/>
  <router-view></router-view>
</div>
```
```js
// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'

const Info  = { template:'<div>id:{{this.$route.params.id}}</div>'}

/**
 * VueRouter 使用
 */

// 1. 安装路由插件
Vue.use(VueRouter)

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，或者只是一个组件配置对象。
const routes = [
  {path:'/info/:id', name: 'info', component:Info}
]

// 3. 创建 router 实例
// 以定义的 routes 配置创建路由器实例 router。
const router = new VueRouter({
  routes
})

// 4. 将路由器实例 router 传入 Vue 实例化选项中。从而让整个应用都有路由功能
const app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  router
})
```

## 安装路由插件 Vue.use(VueRouter)

### Vue.use

Vue 提供了 `Vue.use` 的全局 API 来注册这些插件，函数路径: `installGlobalAPI(Vue) => initUse(Vue)`

```js
/**
 * 插件注册 Vue.use(plugin)
 * 
 * Vue.use 接受一个 plugin 参数，并且维护了一个 _installedPlugins 数组，它存储所有注册过的 plugin；
 * 1. 如果缓存插件的数组中已有，则说明该插件已注册过，直接返回
 * 2. 函数中判断 plugin 有没有定义 install 方法，如果有的话则调用该方法，并且该方法执行的第一个参数是 Vue；
 * 3. 如果 plugin 没有定义 install 方法，则自身必须是一个接受 vue 入参的函数。
 * 4. 最后把 plugin 存储到 installedPlugins 中。
 */ 

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    var args = toArray(arguments, 1); // 返回空数组 []
    args.unshift(this); // [Vue]
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}
```

### VueRouter 的 install 函数

1. install.installed 标识自身是否已注册过
2. Vue.mixin 全局混入 beforeCreate 和 destoryed 生命周期钩子函数，会在每个组件实例化时都混入。但只在 new Vue 实例化时进行以下关键步骤：
    1. 设置变量 `this._routerRoot = this`，即应用实例 app，让组件实例化时通过 `this._routerRoot = (this.$parent && this.$parent._routerRoot)` 获取到应用实例 app
    1. `this._router = this.$options.router;` 在根实例即应用实例上保存唯一的路由器实例 router
    1. `this._router.init(this)` 执行路由初始化，内部逻辑包括路由配置解析生成路由记录和注册路由监听事件
    1. `Vue.util.defineReactive(this, '_route', this._router.history.current)` 路由变化能触发视图更新的核心代码，即在根实例上定义一个响应式的变量 _route
3. 在 Vue.prototype 原型对象上定义两个只读的 $router / $route，暴露给全局使用。
4. 注册路由入口 RouterLink 和 路由出口 RouterView 组件。

```js
var _Vue;
function install (Vue) {
  // install.installed 标识自身是否已注册过，已注册过无需重复注册
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) { // 此时是 new Vue 实例化根实例时
        this._routerRoot = this; // 当前组件实例 vm
        this._router = this.$options.router; // new Vue 时传入的 new VueRouter 实例
        this._router.init(this); // 路由初始化
        Vue.util.defineReactive(this, '_route', this._router.history.current);
        /**
         * this._route = {
         *  get () {
         *    var value = this._router.history.current
         *    if (Dep.target) { dep.depend() }
         *    return value
         *  },
         *  set (newVal) {
         *    var value = this._router.history.current
         *    val = newValue
         *     dep.notify()
         *  }
         * }
         */
      } else { // 其它组件实例化时，保存从父组件上获取根实例 app，因为只有根实例上才含有路由信息
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  // 在 Vue.prototype 原型对象上定义两个只读的 $router / $route
  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  // 注册 路由入口 RouterLink 和 路由出口 RouterView 组件
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;


  // helper
  function isDef (v) { return v !== undefined; };
  function registerInstance (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };
}
```

总结： 
1. VueRouter 的 install 函数关键的是路由实例的 init 函数 和 _route 响应式变量函数。
1. 每个组件实例化时执行 beforeCreate 函数，即每个组件都持有 _routerRoot 变量，也就间接能访问到全局的路由信息。
