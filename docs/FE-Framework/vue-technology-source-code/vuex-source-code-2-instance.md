
# vuex源码2：instance 实例化

[[toc]]

```js
const store = new Vuex.Store({
  state:{},
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})
```
`new Vuex.Store` 调用，看下 Store　类的构造函数的实现：

主要完成三件事：
1. 序列化 options，以 modules 建立嵌套树： `this._modules = new ModuleCollection(options)`
1. 把各嵌套中的 getters / mutations / actions 统一提取保存到实例属性 _wrappedGetters / _mutations / _actions，并建立 state 值的获取： `installModule(this, state, [], this._modules.root)`
1. 建立 getter 和 state 的依赖关系： `resetStoreVM(this, state)`

```js
class Store {
  constructor (options = {}) {

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modulesNamespaceMap = Object.create(null);
    this._makeLocalGettersCache = Object.create(null);
    this._watcherVM = new Vue();
    this._modules = new ModuleCollection(options); 
    // 1. 序列化 options ，形成一颗含有 _children 的嵌套树：this._modules = {root: {runtime:false, state, _rawModule, _children: {moduleA: {...}}}}

    const state = this._modules.root.state;

    // 2. 完成根模块和子模块的初始化，即处理 state / getters / mutations / actions
    installModule(this, state, [], this._modules.root);

    // 3. storeVm = new Vue 生成一个 vue 实例，建立 getter 和 state 的依赖关系
    resetStoreVM(this, state);

    // 省略其它代码...
  }
}
```

## 序列化 options

看下其中序列化 options 的代码：`this._modules = new ModuleCollection(options)`

例子：

```js
// new Vuex.Store(options)
options = {
  state,
  getters,
  mutations,
  actions,
  modules: {
    moduleA: {
        state: () => ({ ... }),
        mutations: { ... },
        actions: { ... },
        getters: { ... },
        modules: {
          moduleA1: {}
        }
      },
      moduleB: {
        state: () => ({ ... }),
        mutations: { ... },
        actions: { ... }
      }
  }
}
```
经过 `this._modules = new ModuleCollection(options)` 源码逻辑：
```js
class ModuleCollection {
  constructor (rawRootModule) {
    // 注册根模块，path = [], 运行时创建模块 runtime = false
    this.register([], rawRootModule, false);
  }

  register (path, rawModule, runtime = true) {
    {
      // 校验 new Store({state, getters, mutations, actions})中传入的 getters / mutations 对象的每个属性值必须是函数， actions 每个属性值必须是函数或者对象形式中含有 handler 函数。
      assertRawModule(path, rawModule);
    }

    const newModule = new Module(rawModule, runtime);

    if (path.length === 0) {// path = []，是根模块
      this.root = newModule;
    } else {
      /**
       * 通过将嵌套模块的 key 按先后顺序存入数组中，除最后一项，前面的都为父模块路径
       * path = [moduleA] 或者 [moduleA, moduleA1]
       * 然后从 this.root 开始向下get 到父模块，向其 _children 添加当前模块
       * 最终构成一颗嵌套的模块树
       */
      const parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule); 
      // addChild (key, module) { this._children[key] = module; }
    }

    // 递归调用处理子模块
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime);
      });
    }
  }

  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key) // Module.prototype.getChild = function (key) {return this._children[key]}
    }, this.root)
  }

  getNamespace (path) {
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }
}
```

单个模块的序列化，关键代码 `const newModule = new Module(rawModule, runtime)`

```js
class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime;
    // Store some children item
    this._children = Object.create(null);
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule;
    const rawState = rawModule.state;

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
  }
}
```
举例：单个模块经过 new Module 的生成的新模块对象

```js
// 例子：
moduleB: {
  state: () => {name: 'B'},
  mutations: {
    SET_NAME(state, payload) {
      state.name = payload
    }
  },
  actions: { 
    updateName({commit}, payload) {
      commit('SET_NAME', payload)
    }  
  }
}

// Module 类处理
const newModuleB = new Module(moduleB, false)

// 结果
const newModuleB = {
  runtime: false,
  state: {name: 'B'},
  _children: {},
  _rawModule: {
    state: () => {name: 'B'},
    mutations: {
      SET_NAME(state, payload) {
        state.name = payload
      }
    },
    actions: { 
      updateName({commit}, payload) {
        commit('SET_NAME', payload)
      }  
    }
  }
}
```
所以，如果是嵌套的模块，经过 `ModuleCollection` 及 `Module` 处理序列化后例子：

```js
// 例子 new Vuex.Store(options)
options = {
  namespaced: true,
  state: {rootTest: true},
  getters,
  mutations,
  actions,
  modlules: {
    moduleA: {
      namespaced: true,
      state: {name: 'A'},
      modules: {
        moduleA1: {
          namespaced: true,
          state: {name: 'A1'},
          getters: {
            getName(state, getters, rootState, rootGetters) {
              return rootState.name + state.name
            }
          }
        }
      }
    }
    moduleB: {
      namespaced: true,
      state: () => {name: 'B'},
      mutations: {
        SET_NAME(state, payload) {
          state.name = payload
        }
      },
      actions: { 
        updateName({commit}, payload) {
          commit('SET_NAME', payload)
        }  
      }
    }
  }
}

// 经过
this._modules = new ModuleCollection(options)
const newModule = new Module(rawModule, runtime)

// 结果
this._modules = {
  root: {
    runtime: false,
    state: {rootTest: true},
    getters,
    mutations,
    actions,
    _rawModule: {state, getters, mutations, actions, modules}
    _children: {
      moduleA: {
        runtime: false,
        state: {name: 'A'},
        _rawModule: {state: {name: 'A', modules: {moduleA1:{...}}}}
        _children: {
          moduleA1: {
            runtime: false,
            state: {name: 'A1'},
            _children: {},
            _rawModule:{state: {name:'A1'}}
          }
        }
      },
      moduleB: {
        runtime: false,
        state: {name: 'B'},
        _rawModule: {state, mutations, actions},
        _children: {}
      }
    }
  }
}
```
所以 options　序列化主要以　modules 为嵌套基础，转为 _children 字段建立嵌套树形结构，单层对象包含属性： `{ runtime, state, _rawModule, _children }`

## 初始化 state / getters / mutations / actions

完成了 options 的序列化后，就是处理嵌套树中的 state / getters / mutations / actions 属性。

```js
// 从根模块开始
const state = this._modules.root.state;
installModule(this, state, [], this._modules.root);
```
所以，再看下 installModule 方法的源码逻辑
```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length;
  // namespace + (module.namespaced ? key + '/' : '')
  // 如果 namespaced = true，则 namespace = 'moduleA/moduleA1/'，否则就是模块名称 'moudleA1'
  const namespace = store._modules.getNamespace(path); 

  // register in namespace map
  // 如果有命名空间，则维护一份路径跟模块的映射关系：store._modulesNamespaceMap = {'moduleA/moduleA1': moduleA1}
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && true) {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`);
    }
    store._modulesNamespaceMap[namespace] = module;
  }

  // 建立 state 的嵌套树
  /**
   * this._moudules = {
   *  root: {
   *    state: {name: rootTest},
   *    _children: {
   *      moduleB: {
   *        state: {name: 'B'}
   *      }
   *    }
   *  }
   * }
   * 
   * 经过下面代码，会形成 state 嵌套树
   * this._moudules = {
   *  root: {
   *    state: {
   *      name: rootTest,
   *      moduleB: {
   *        state: {name: 'B'}
   *      }
   *    },
   *    _children: {
   *      moduleB: {
   *        state: {name: 'B'}
   *      }
   *    }
   *  }
   * }
   */
  if (!isRoot && !hot) {
    // function getNestedState (state, path) { return path.reduce((state, key) => state[key], state)}
    const parentState = getNestedState(rootState, path.slice(0, -1));
    const moduleName = path[path.length - 1];
    store._withCommit(() => {
      {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          );
        }
      }
      Vue.set(parentState, moduleName, module.state);
    });
  }

  /**
   * 以下内部主要是将当前模块的 mutations / actions / getters 里的属性分别注册到 store 实例的 _mutations / _actions / _wrappedGetters
   * 然后区别有没有添加命名空间 namespaced，有没命名空间区别在于 _mutations / _actions / _wrappedGetters 对象中的 key 值不同。
   */

  // 主要针对是定义了 namespace：
  // 如果定义了命名空间 namespace = 'moduleA/moduleA1'，则模块A中的某个方法的寻址就是 _mutations['moduleA/moduleA1/key']
  // 如果没有命名就是 _mutations['key']
  // 所以 makeLocalContext 方法就是为每个模块建立当前模块寻址的上下文空间
  const local = module.context = makeLocalContext(store, namespace, path);

  // 仓库实例上声明 store._mutations[namespacedType] = [(payload) => {mutation.call(store, local.state, payload)}]
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key; // 'moduleA/moudleA1/key'
    registerMutation(store, namespacedType, mutation, local);
  });
  /**
   * store._actions[type] = [(payload) => {return handler.call(store, {
   *  dispatch: local.dispatch,
   *  commit: local.commit,
   *  getters: local.getters,
   *  state: local.state,
   *  rootGetters: store.getters,
   *  rootState: store.state
   * }, payload)}]
   */
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key;
    const handler = action.handler || action;
    registerAction(store, type, handler, local);
  });
  // store._wrappedGetters[namespacedType] = function (store) {return getter(store)}
  /**
   * store._wrappedGetters[namespacedType] = function (store) {
   *  return getter(
   *    local.state,
   *    local.getters,
   *    store.state,
   *    store.getters
   * )}
   * 
   * 即模块中的 getter 函数可以有四个入参
   * moudleA = {
   *  getters: {
   *    getName(state, getters, rootState, rootGetters) {...}
   *  }
   * }
   */
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  // 递归处理嵌套的子模块的 state / getters / mutations / actions
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}
```
最终，经过 installModule 函数的处理，嵌套模块内的 getters mutations actions 都是平铺在 store._warppedGetters / store._mutations / store._actions 对象中。每个 key 对象对应的值都是数组，数组内的元素都是包装函数。

各模块的 state 值形成嵌套的结构。

```js
store = {
  _modules: {
    root: {
      runtime: false,
      state: {
        name: 'rootTest',
        moduleA: {
          state: { name: 'A'},
          moduleA1: {
            state: {name: 'A1'}
          }
        },
        moduleB: {
          state: {name: 'B'}
        }
      },
      _rawModule:,
      _children: {
        moduleA: {
          runtime: false,
          _rawModule:,
          _children: {
            moudleA1: {
              runtime: false,
              _rawModule:,
              _children: {}
            }
          }
        },
        moduleB: {
          runtime: false,
          _rawModule:,
          _children: {}
        }
      }
    }
  },
  _wrappedGetters: {
    'moduleA/moduleA1/getName': [
      (store) => {return getters(local.state, local.getters, store.state, store.getters)}
    ]
  },
  _mutations: {
    'moduleB/SET_NAME': [
      (payload) => {return mutation.call(store, local.state, payload)},
    ]
  },
  _actions: {
    'moduleB/updateName': [
      (payload) => {return handler.call(store, local, payload)}
    ]
  }
}
```

## 建立 state / getters 依赖关系

通过 installModule 函数的作用，嵌套的每个模块的 state / getters / mutations / actions 都被扁平化的存入了 store 实例对应的属性。

store 实例化最后一步，是建立 state 和 getters 之间的依赖关系，通过 `resetStoreVM(this, state)`

```js
/**
 * resetStoreVM 的作用实际上是建立 getters 和 state 的联系，
 * 因为从设计上 getters 的获取就依赖了 state ，并且希望它的依赖能被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
 * 因此这里利用了 Vue 中用 computed 计算属性来实现
 * 
 * resetStoreVM(this, state)
 */
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm;

  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  const wrappedGetters = store._wrappedGetters;
  const computed = {};
  // 遍历已初始化的 _wrappedGetters 所有 getter
  forEachValue(wrappedGetters, (fn, key) => {
    // function partial(fn, arg) { return function () { return fn(arg)}} 将 store 作为闭包变量缓存起来
    // 通过 partial 函数闭包调用传入 wrappedGetters 包装函数定义时的形参 store
    computed[key] = partial(fn, store);
    // 定义 store.getters 对象，为每个属性设置 getter => store._vm[key]
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    });
  });

  const silent = Vue.config.silent;
  Vue.config.silent = true; // 暂时关闭客户端报错
  // 声明一个 vue 实例，上述定义的 computed 和 state 订阅关系。即 state 的闭包 dep.subs 储存着 computed-watcher 。这样 data 的改变会触使 computed 获取新值。
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  });
  Vue.config.silent = silent;

  // 省略代码

  // 动态注册模块时会产生旧实例，所以动态注册模块时执行以下清理逻辑
  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(() => oldVm.$destroy());
  }
}

function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}
```
