# vuex源码4: register 动态注册模块

在 Vuex 初始化阶段我们构造了模块树，初始化了模块上各个部分。但在有一些场景下，我们需要动态去注入一些新的模块，Vuex 提供了模块动态注册功能 `store.registerModule`。

```js
import Vuex from 'vuex'

const store = new Vuex.Store({
  namespaced: true,
  state: {
    name: 'rootTest',
  },
  moudules: {
    moduleA: {
      namespaced: true,
      state: {
        name: 'A'
      }
    }
  }
})


// 注册模块 `myModule`
store.registerModule('myModule', {
  namespaced: true,
  state: {...},
  getters: {...},
  mutations: {...},
  actions: {...},
  modules: {...}
})

// 注册嵌套模块 `moduleA/myModule`
store.registerModule(['moduleA', 'myModule'], {
  namespaced: true,
  state: {...},
  getters: {...},
  mutations: {...},
  actions: {...},
  modules: {...}
})
```

通过源码，看下 `store.registerModule` 函数的实现：

```js
/**
 * 源码实现
 * path 可以是字符串或数组，并且不能为空，即不能动态注册根模块
 * 
 * 实现可以看到，基本就是 Class Store 构造函数 constructor 的实现步骤，具体看 Store 类的实例化章节
 * 1. 首先执行 register 方法扩展我们的模块树，即 this._moudles.root 对象
 * 2. 接着执行 installModule 去安装模块
 * 3. 最后执行 resetStoreVM 重新实例化 store._vm，并销毁旧的 store._vm。
 */
registerModule (path, rawModule, options = {}) {
  if (typeof path === 'string') path = [path];

  assert(Array.isArray(path), `module path must be a string or an Array.`);
  assert(path.length > 0, 'cannot register the root module by using registerModule.');

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  resetStoreVM(this, this.state);
}
```

有动态注册模块的需求就有动态卸载模块的需求，Vuex 提供了模块动态卸载功能，在 store 上提供了一个 `store.unregisterModule` 的 API

```js
unregisterModule (path) {
  if (typeof path === 'string') path = [path];

  {
    assert(Array.isArray(path), `module path must be a string or an Array.`);
  }

  this._modules.unregister(path);
  this._withCommit(() => {
    const parentState = getNestedState(this.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
}

// 根据路径找到嵌套模块，删除 _children 中的子元素
unregister (path) {
  const parent = this.get(path.slice(0, -1))
  const key = path[path.length - 1]
  if (!parent.getChild(key).runtime) return

  parent.removeChild(key)
}

// 因为 store._modules 的结构变化了，所以重新执行 installModule 和 restStoreVm 逻辑，刷新 store 中的相关属性。
function resetStore (store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state, hot)
}
```