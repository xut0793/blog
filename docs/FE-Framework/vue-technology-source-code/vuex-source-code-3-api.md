# vuex源码3:  API 实现

[[toc]]

经过上一节 store 实例化过程的理解，我们基本能明白我们自定义的嵌套模块的各个 state / getters / mutations / actions 最终存储在 store 实例上的结构。

```js
// 定义的嵌套模块
const store = new Vuex.Store({
  namespaced: true,
  state: {
    name: 'rootTest'
  },
  getters: {
    getRootName(state, getters) {
      return state.name
    }
  },
  mutations: {
    SET_ROOT_NAME(state, payload) {
      state.name = payload.name
    }
  },
  actions: {
    updateRootName({commit}, payload) {
      commit('SET_ROOT_NAME', payload)
    }
  },
  modules: {
    moduleA: {
      namespaced: true,
      state: () => {name: 'A'},
      getters: {
        getFullName(state, getters, rootState, rootGetters) {
          return `${rootState.name}_${state.name}`
        }
      }
      mutations: {
        SET_NAME(state, payload) {
          state.name = payload.name
        }
      },
      actions: { 
        updateName({commit}, payload) {
          commit('SET_NAME', payload)
        }
      }
    }
  }
})
```
最终实例化后的 store 对象
```js
store = {
  // 省略其它属性

  get state() {
    return this._vm._data.$$state
  }
  getters: {
    'getRootName': {
      get () {
        return store._vm['getRootName']
      },
    'getFullName': {
      get () {
        return store._vm['getFullName']
      }
    }
  },
  _wrappedGetters: {
    'getRootName': function wrappedGetter (store) {
      return getRootName(local.state, local.getters)
    },
    'moudleA/getFullName': function wrappedGetter (store) {
      return getFullName(local.state, local.getters, store.state, store.getters)
    }
  },
  _mutations: { 
    'SET_ROOT_NAME': [ 
      // handler 即自定义的函数 SET_ROOT_NAME(state, payload) { state.name = payload }
      function wrappedMutationHandler(payload) { return handler.call(store, local.state, payload)}
    ],
    'moduleA/SET_NAME': [
      function wrappedMutationHandler(payload) { return handler.call(store, local.state, payload)}
    ]
  },
  _actions: {
    'updateRootName': [
      function wrappedActionHandler (payload) {
        let res = handler.call(store, {dispatch, commit, getters, state, rootState, rootGetters}, payload)
        return !isPromise(res) ? Promise.resolve(res) : res
      }
    ],
    'moduleA/updateName': [
      function wrappedActionHandler (payload) {
        let res = handler.call(store, {dispatch, commit, getters, state, rootState, rootGetters}, payload)
        return !isPromise(res) ? Promise.resolve(res) : res
      }
    ]
  }
  _modules: {
    root: {
      runtime: false,
      state: {
        name: 'rootTest',
        moduleA: {
          state: {
            name: 'A'
          }
        }
      },
      _rawModule: {...}, // 原始根模块对象
      _children: {
        moduleA: {
          runtime: false,
          state: {name: 'A'},
          _rawModule: {...}, // 原始 moduleA 模块对象
          _children: {}
        }
      }
    }
  }
}
```
```js
// 内部的 store._vm 实例
store._vm = new Vue ({
  data: {
    $$state: store._moudles.root.state
  },
  computed: {
    // fn = store._wrappedGetter['getRootName'] 函数
    'getRootName': function (fn, store) {
      return function () {
        return fn(store)
      }
    },
    // fn = store._wrappedGetter['moudleA/getFullName']
    'moduleA/getFullName': function (fn, store) {
      return function () {
        return fn(store)
      }
    }
  }
})
```

## 数据获取 

### `this.$store.state`

获取 `this.$store.state` 值，函数调用路径：

`this.$store.state => store._vm._data.$$state => state => store._modules.root.state`

state 处理相关源代码：

```js
class Store {
  constructor(options) {...}
  get state () {
    return this._vm._data.$$state
  }
}

// resetStoreVM
function resetStoreVM (store, state, hot) {

  // 省略代码...

  store._vm = new Vue ({
    data: {
      $$state: store._moudles.root.state
    },
    computed: {...}
  })

  // 省略代码...
}

// 生成各模块 state 的嵌套树
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  
  // 省略代码...

  if (!isRoot && !hot) {
    // function getNestedState (state, path) { return path.reduce((state, key) => state[key], state)}
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }
  
  // 省略代码...
}
```

### `this.$store.getters`

获取 `this.$store.getters['moduleA/getFullName']` 值，函数调用路径：

`this.$store.getters => store.getters => store._vm => computed => store._wrappedGetters => options.getters`

getter 处理相关源代码:

```js
// resetStoreVM
function resetStoreVM (store, state, hot) {
  // 省略代码...

  store.getters = {};

  const computed = {};
  const wrappedGetters = store._wrappedGetters;
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    });
  });

  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  });
}

// installModule
function installModule (store, rootState, path, module, hot) {
  // 省略代码...

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    console.error(`[vuex] duplicate getter key: ${type}`);
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}
```

## 数据存储

### commit

Vuex 对数据存储的存储本质上就是对 state 做修改，并且只允许我们通过 commit 提交 mutaion 的形式去修改 state 如下：

```js
// 1. 在 new Vuex.Store(options) 中的 options 对象中声明 mutation 方法
mutations: {
  SET_NAME(state, payload) {
    state.name = payload.name
  }
},

// 2. 然后在业务代码中提交 commit 修改
this.$store.commit('moduleA/SET_NAME', {name:'tom'})
```
先看下 `new Vuex.Store(options)`中对 `mutations` 的初始化源码：

```js
function installModule (store, rootState, path, module, hot) {
  // ...
  const namespace = store._modules.getNamespace(path)

  // ...
  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })
  // ...
}

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
```
然后看下 `this.$store.commit` 方法源码：

逻辑很简单，通过传入的 type 从 store._mutations[type] 中拿到所有该类型的处理函数遍历执行。

```js
class Store {
  constructor(options = {}) {...},
  
  commit (_type, _payload, _options) {
    // 因为 commit 有函数和对象形式，所以需要通过 unifyObjectStyle 函数兼容处理下
    // 函数：commit('moduleA/SET_NAME', {name:'tom'})
    // 对象：commit({type: 'moudleA/SET_NAME', name: 'tom'})
    const { type, payload, options } = unifyObjectStyle(_type, _payload, _options);

    const mutation = { type, payload };

    const entry = this._mutations[type];
    if (!entry) {
      console.error(`[vuex] unknown mutation type: ${type}`);
      return
    }
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload);
      });
    });

    // 省略代码...
  }
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)

  return { type, payload, options }
}
```

### dispatch

在开发实际项目中，经常会遇到要先去发送一个请求，然后根据请求的结果去修改 state，那么单纯只通过 mutation 是无法完成需求，因此 Vuex 又给我们设计了一个 action 的概念。

action 类似于 mutation，不同在于 action 提交的是 mutation，而不是直接操作 state，内部源码可以通过 Promise 完成异步操作。

```js
// 1. 在 new Vuex.Store(options) 中的 options 对象中声明 actions 方法
actions: { 
  httpGetName({commit}, payload) {
    return fetch(payload.url).then(res => {
      return res.json()
    }).then(resJson => {
      commit('SET_NAME', resJson)
    })
  }
}

// 2. 然后在业务代码中提交 commit 修改
this.$store.dispatch('moduleA/httpGetName', {url:url})
```
同样，先看下 `new Vuex.Store(options)`中对 `actions` 的初始化源码：
```js
function installModule (store, rootState, path, module, hot) {
  // ...
  const namespace = store._modules.getNamespace(path)

  // ...
  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
  // ...
}

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

然后看下 `this.$store.dispatch` 方法源码：

逻辑也很简单，通过传入的 type 从 store._actions[type] 中拿到所有该类型的处理函数遍历执行。

```js
class Store {
  constructor(options = {}) {...},

  dispatch (_type, _payload) {
    // 同样处理兼容函数和对象的写法
    const { type,  payload } = unifyObjectStyle(_type, _payload)

    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }

  // 省略代码...
}
```

## 语法糖

我们看 `import Vuex from 'vuex'` 导入时，Vuex 对象的属性包括一些包装过的语法糖接口：`mapState / mapGetters / mapMutations / mapActions`

```js
// import Vuex from 'vuex'
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

### mapState

在业务代码中，如果模块有较深的嵌套时，获取某个状态数据写法上较为烦琐：
```js
// 直接使用
this.$store.state.moduleA.state.moduleA1.state.name
// 定义 computed
computed: {
  nestedName() {return this.$store.state.moduleA.state.moduleA1.state.name}
}
```
此时如果我们在 computed 中使用 mapState，可以这样写：
```js
import {mapState} from 'vuex'
computed: {
  ...mapState({
    nestedName: state => state.moduleA.state.moduleA1.state.name
  })
  // 或者，更简洁写法
  ...mapState('moduleA/moduleA1', {
    nestedName: state => state.name
  })
}
```
- 看上面使用对象解构符，所以 mapState 函数肯定返回的是一个对象结构。
- mapState 函数入参支持单个对象和两个参数形式，所以处理之前需要规划化参数，这个功能由 normalizeNamespace 函数实现

所以我们看下 mapState 的源码实现：

```js
function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

const mapState = normalizeNamespace((namespace, states) => {
  const res = {};
  // 要求 states 是数组或对象
  // function isValidMap(map) {return Array.isArray(map) || isObject(map)}
  if ( !isValidMap(states)) {
    console.error('[vuex] mapState: mapper parameter must be either an Array or an Object');
  }

  // normalizeMap 函数用来处理兼容数组和对象，统一成 key value 格式
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state;
      let getters = this.$store.getters;
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        // installModule 函数中
        // const local = module.context = makeLocalContext(store, namespace, path);
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

// 工具函数
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

// store._modulesNamespaceMap 是在 installModule 函数中实现的缓存对象
// store._modulesNamespaceMap[namespace] = module
function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace];
  if ( !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`);
  }
  return module
}
```

所以逻辑也很简单，声明一个包装函数去解析和处理命名空间 namespace ，然后仍然从 this.$store.state 中取值。

### mapGetters

```js
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    'doneTodosCount',
    'anotherGetter',
    // ...
  ])
}
```
mapGetters 是将 store 中的 getter 映射到局部计算属性，来看一下它的定义：
```js
const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {};
  if ( !isValidMap(getters)) {
    console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(getters).forEach(({ key, val }) => {
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( !(val in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`);
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});
```

### mapMutations

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    // 数组形式
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷，调用时直接传入参数即可
      // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
      'incrementBy'
    ]),
    // 对象形式，可以重命名 mutations 中的方法
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```
可以看到 mapMutations 函数使用了对象解构运算符，所以返回值是一个对象。另外入参支持数组和对象，使用 mormalizeMap 函数处理兼容。

```js
const mapMutations = normalizeNamespace((namespace, mutations) => {
  const res = {};
  if ( !isValidMap(mutations)) {
    console.error('[vuex] mapMutations: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation (...args) { // args 即调用时传入的参数，可以作为 payload
      // Get the commit method from store
      let commit = this.$store.commit;
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

// 工具函数
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

// store._modulesNamespaceMap 是在 installModule 函数中实现的缓存对象
// store._modulesNamespaceMap[namespace] = module
function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace];
  if ( !module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`);
  }
  return module
}
```

### mapActions

mapActions 使用和 mapMutations 基本一样，所以实现方式也基本类似

```js
const mapActions = normalizeNamespace((namespace, actions) => {
  const res = {};
  if ( !isValidMap(actions)) {
    console.error('[vuex] mapActions: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction (...args) {
      // get dispatch function from store
      let dispatch = this.$store.dispatch;
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});
```




