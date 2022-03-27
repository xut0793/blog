# vuex 基本使用

[[toc]]

```js
import Vuex from 'vuex'
const store = new Vuex.Store(option)
```

## `Vuex`对象
在使用`Vuex`时，看下`Vuex`对象提供了哪些属性和方法。
```js
// vuex源码入口index.js
export default {
  Store,  // 仓库store的构造函数
  install, // 提供vue.use(vuex)使用的插件安装入口
  version: '__VERSION__',
  // store对象属性和方法的辅助函数，后面讲到
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

## option配置选项
```js
const option = {
    state, // Object | Function
    getters, // { [key: string]: Function(state, getters, rootState, rootGetters ) }
    mutations, // { [type: string]: Function(state, paylaod) }
    actions, // { [type: string]: Function(context, payload) } context= {state,rootState, getters, rootGetters, commit, dispatch }
    modules, // {key: {namespaced?, state, mutations, getters?, actions?, modules?}}
    plugins, // Array<Function(store)>
    strict, // Boolean,默认false
    devtools, // Boolean,默认false
}
```

## 实例对象store的属性
```js
const store = new Vuex.Store(...option)
// 只读属性，调用已option中注册的state 和 getters
store.state
store.getters
```

## 实例对象store的方法

**`commit()` | `dispatch()`**
```js
store.commit(type: string, payload?: any, options?: Object) // commit(mutation: Object, options?: Object),即对象形式commit({type:string, payload?:any}, {root:ture})
store.dispatch(type: string, payload?: any, options?: Object) // dispatch(action: Object, options?: Object),即对象形式dispatch({type:string, payload?:any}, {root:ture})
```
```js
// 如果定义了一个action返回的是promise对象，那么dispatch这个action后返回的仍是一个promise对象
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
store.dispatch('actionA').then(() => {
  // ...
})
```

## 注册和卸载plugin的方法
```js
// 订阅mutation的变化。handler 会在每个 mutation 完成后调用。 如果取消订阅，调用返回函数unsubscribe()
const unsubscribe = store.subscribe(handler(mutation,state){})
const unsubscribeAction = store.subscribeAction(handler(action, state){})
const unsubscribeAction = store.subscribeAction({before(action,state){},after(action,state){}})
```
```js
// 定义一个订阅mutation的插件
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}
```
```js
// 在store中注册自定义插件
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

## 动态注册和卸载模块module的方法
```js
// 注册模块
// Array<string> 注册嵌套模块 `nested/myModule`: ['nested', 'myModule']
// Module是一个对象，包含正常{key: {namespaced?, state, mutations, getters?, actions?, modules?}}
// options可以包含 preserveState: true 以允许保留之前的 state。用于服务端渲染
store.registerModule(path: string | Array<string>, module: Module, options?: Object)

// 卸载模块
store.unregisterModule(path: string | Array<string>)
```

## vuex的辅助函数
```js
// 在组件中引入
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// 使用
mapState(namespace?: string, map: Array<string> | Object<string | function>): Object
mapGetters(namespace?: string, map: Array<string> | Object<string>): Object
mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object
mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object
```
示例：
```js
import { mapState } from 'vuex'
export default {
  // ...
  computed: {
    // Array<string>：当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组
    ...mapState(namespace?: string, ['count'])
    // Object<string | function>对象形式
    ...mapState(namespace?: string, {
        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',

        // 函数形式，接收state作为参数
        count: state => state.count,

        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState (state) {
        return state.count + this.localCount
        }
    })
  }
}
```
```js
import { mapGetters } from 'vuex'
export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(namespace?: string,[
      'doneTodosCount',
      'anotherGetter',
      // ...
    ]),
    // 如果你想将一个 getter 属性另取一个名字，使用对象形式，只有key:string,没有function函数形式
    ...mapGetters(namespace?: string,{
        // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
        doneCount: 'doneTodosCount'
    })
  }
}
```

```js
import { mapMutations } from 'vuex'
export default {
  // ...
  methods: {
    ...mapMutations(namespace?: string,[
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations(namespace?: string,{
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

```js
import { mapActions } from 'vuex'
export default {
  // ...
  methods: {
    ...mapActions(namespace?: string,[
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions(namespace?: string,{
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

## vuex项目组织
[Vuex下Store的模块化拆分实践](https://segmentfault.com/a/1190000007667542)

## 参考链接
[vuex源码分析](https://segmentfault.com/a/1190000010203499)
[小火柴的蓝色理想:Vue状态管理vuex](https://www.cnblogs.com/xiaohuochai/p/7554127.html#top)
[前端状态管理与有限状态机](https://www.jianshu.com/p/d64d51c0f88e)