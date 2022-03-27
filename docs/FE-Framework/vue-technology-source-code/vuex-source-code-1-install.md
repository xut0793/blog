# vuex源码1：install 注册

[[toc]]

## vuex 的基本使用步骤

```js
// 1. 引入vue 和 vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 2. 在vue中注册vuex插件
Vue.use(Vuex)

// 3. 实例化一个管理状态的仓库store
const store = new Vuex.Store({
    namespace: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {}
})

// 4. 将store 全局注入到vue实例
const app = new Vue({
    el: "#app",
    // 把 store 对象提供给 “store” 选项，这样就可以把 store 的实例注入所有的子组件
    store,
    // 其它代码...
})

// 5. 组件中使用 this.$store
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```
对照上面 5 个步骤，我们理解源码逻辑

## Vuex 导出的接口

`import Vuex from 'vuex'` 导出的 Vuex 对象包含哪些属性呢？

```js
export { 
  version: __VERSION__,
  Store,
  install,
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
  createNamespacedHelpers,
  createLogger,
};
```
## 注册插件

`Vue.use(Vuex)` 注册插件，调用 Vuex.install 方法：

```js
let Vue
function install (_Vue) {
  if (Vue && _Vue === Vue) {
    console.error('[vuex] already installed. Vue.use(Vuex) should be called only once.');
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

function applyMixin (Vue) {
  const version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
   // 省略兼容 vue 1.x 的代码
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   * 向每个组件实例注入 this.$store 调用
   */
  function vuexInit () {
    const options = this.$options;
    if (options.store) { 
      // new Vue(options) 实例化根组件时，才有传入 store 实例
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) { 
      // 其它组件实例化时获取父组件中的引用
      this.$store = options.parent.$store;
    }
  }
}
```