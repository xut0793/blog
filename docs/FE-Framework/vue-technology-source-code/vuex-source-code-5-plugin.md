# vuex源码5：plugin 插件实现

[[toc]]

Vuex 除了提供的存取能力，还提供了一种插件能力，让我们可以监控 store 的变化过程来做一些事情。

store 的变化，可以 commit 提交 mutaion 方法直接改变 state，也可以是 dispatch 触发 action 方法间接修改 state 。

所以 vuex 内部实现了插件可以分别订阅 mutation 和 actions 的执行，来实现监听。基本实现逻辑就是一个 发布-订阅 的设计模式。

## 插件注册
Vuex 的 store 接受 plugins 选项，我们在实例化 Store 的时候可以传入插件，它是一个数组，所以可以传入多个插件。

```js
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  plugins: [myPlugin, logger]
})
```

## 插件实现

Vuex 插件就是一个函数，它接收 store 作为唯一参数：

```js
const myPlugin = store => {
  const removeMutationPlugin = store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })

  const removeActionPlugin = store.actionsSubscribe((action, state) => {
    // 每次 action 之后调用
    // action 格式 { type, payload }
  })
}
```
### 插件源码

所以看下 vuex 源码对插件的实现逻辑：

```js
class Store {
  constructor(options = {}) {
    // 省略代码...

    // 存入插件函数
    this._subscribers = []; // 针对 mutaions 执行的插件
    this._actionSubscribers = []; // 针对 actions 执行的插件

    const {
      plugins = [],
      strict = false
    } = options;

    // 遍历执行插件函数
    plugins.forEach(plugin => plugin(this));
  }

  subscribe (fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
  }

  subscribeAction (fn, options) {
    // fn 可以是对象，分别定义 before / after / error，即当前 action 方法执行前、执行后、执行出错时调用插件。
    const subs = typeof fn === 'function' ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options)
  }
}

function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn);
  }

  // 返回一个移除插件的函数
  return () => {
    const i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}
```
看下插件执行时机：
```js
// this._subscribe 在 mutation 方法执行后调用，所以调用时机在 commit 函数中
commit (_type, _payload, _options) {
  const { type, payload, options } = unifyObjectStyle(_type, _payload, _options);

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

  // 针对 mutation 插件执行
  const mutation = { type, payload };
  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(sub => sub(mutation, this.state));
}
```
```js
dispatch (_type, _payload) {
  const { type, payload } = unifyObjectStyle(_type, _payload);

  const entry = this._actions[type];
  if (!entry) {
    console.error(`[vuex] unknown action type: ${type}`);
    return
  }

  const action = { type, payload };
  try {
    this._actionSubscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(sub => sub.before)
      .forEach(sub => sub.before(action, this.state));
  } catch (e) {
    console.warn(`[vuex] error in before action subscribers: `);
    console.error(e);
  }

  const result = entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload);

  return new Promise((resolve, reject) => {
    result.then(res => {
      try {
        this._actionSubscribers
          .filter(sub => sub.after)
          .forEach(sub => sub.after(action, this.state));
      } catch (e) {
        console.warn(`[vuex] error in after action subscribers: `);
        console.error(e);
      }
      resolve(res);
    }, error => {
      try {
        this._actionSubscribers
          .filter(sub => sub.error)
          .forEach(sub => sub.error(action, this.state, error));
      } catch (e) {
        {
          console.warn(`[vuex] error in error action subscribers: `);
          console.error(e);
        }
      }
      reject(error);
    });
  })
}
```

## 内置插件 logger

vuex 导出对象中含有 createLogger 函数，用来注册 logger　插件。
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

### 使用方式：

```js
import { createLogger } from 'vuex'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```
createLogger 函数调用支持传入配置项

```js
const Logger = createLogger({
  collapsed: false, // 自动展开记录的 mutation
  logActions: true, // 记录 action 日志
  logMutations: true, // 记录 mutation 日志
  logger: console, // 自定义 console 实现，默认为 `console`
  filter (mutation, stateBefore, stateAfter) {
    // 若 mutation 需要被记录，就让它返回 true 即可
    // 顺便，`mutation` 是个 { type, payload } 对象
    return mutation.type !== "aBlocklistedMutation"
  },
  actionFilter (action, state) {
    // 和 `filter` 一样，但是是针对 action 的
    // `action` 的格式是 `{ type, payload }`
    return action.type !== "aBlocklistedAction"
  },
  transformer (state) {
    // 在开始记录之前转换状态
    // 例如，只返回指定的子树
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 按照 { type, payload } 格式记录
    // 我们可以按任意方式格式化
    return mutation.type
  },
  actionTransformer (action) {
    // 和 `mutationTransformer` 一样，但是是针对 action 的
    return action.type
  },
})

const store = new Vuex.Store({
  plugins: [Logger]
})
```

### 实现源码

```js
function createLogger ({
  // options 参数提供了一系列默认值
  collapsed = true,
  logMutations = true,
  logActions = true,
  logger = console
  transformer = state => state,
  filter = (mutation, stateBefore, stateAfter) => true,
  mutationTransformer = mut => mut,
  actionFilter = (action, state) => true,
  actionTransformer = act => act,
} = {}) {
  return store => {
    let prevState = deepCopy(store.state);

    if (typeof logger === 'undefined') {
      return
    }

    if (logMutations) {
      store.subscribe((mutation, state) => {
        const nextState = deepCopy(state);

        if (filter(mutation, prevState, nextState)) {
          const formattedTime = getFormattedTime();
          const formattedMutation = mutationTransformer(mutation);
          const message = `mutation ${mutation.type}${formattedTime}`;

          startMessage(logger, message, collapsed);
          logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
          logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
          logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));
          endMessage(logger);
        }

        prevState = nextState;
      });
    }

    if (logActions) {
      store.subscribeAction((action, state) => {
        if (actionFilter(action, state)) {
          const formattedTime = getFormattedTime();
          const formattedAction = actionTransformer(action);
          const message = `action ${action.type}${formattedTime}`;

          startMessage(logger, message, collapsed);
          logger.log('%c action', 'color: #03A9F4; font-weight: bold', formattedAction);
          endMessage(logger);
        }
      });
    }
  }
}

function startMessage (logger, message, collapsed) {
  const startMessage = collapsed
    ? logger.groupCollapsed
    : logger.group;

  // render
  try {
    startMessage.call(logger, message);
  } catch (e) {
    logger.log(message);
  }
}

function endMessage (logger) {
  try {
    logger.groupEnd();
  } catch (e) {
    logger.log('—— log end ——');
  }
}

function getFormattedTime () {
  const time = new Date();
  return ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`
}
```

