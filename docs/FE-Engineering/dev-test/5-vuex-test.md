# 测试 Vuex

## Vuex 相关概念

1. What：Vuex 是什么
   Vuex 是一个状态（state）管理库。如果你百度搜索`state 是什么`，结果会让你感到困惑，人们用这个术语指代了许多概念。

在 Vue 应用程序的语境中，状态 state 是指存储在当前运行的应用程序中的数据。它可以是一个 API 调用的返回值，也可以是用户交互触发的数据，或是应用程序生成的数据等等。

2. Why：为什么需要使用 Vuex，即它解决了什么问题

小明和小红各驻守一个商店，在营业前它们都对某款手机 A 进行了库存盘点，发现库存还有三个可供出售。在营业半天后，小明卖出一个手机 A，它认为还有手机 A 还有两个库存量。小红卖出了二个手机 A，它认为手机 A 还有一个库存量。当一位顾客向小明购买手机 A 时，小明自认为还有库存，收了款后承认向顾客邮寄，却发现该款手机 A 已经没有库存了，不得不向顾客退款道歉。

造成这个问题的原因，就在于小明和小红各自维护着手机 A 的销售状态 state，但并没有同步手机 A 的销量数据。

在 Vue 应用程序中，当多个组件依赖于同一份数据时，如果各自管理自己的数据状态，也可能碰到这种数据不同步的问题，所以需要一个用于存储组件数据状态的中心源，即 Vuex Store（状态仓库），它实现了当某个组件对某个数据状态 state 做出改变后，内部会将当前更新后的数据状态 state 同步更新到其它使用了该数据的组件中，使他们拿到的数据状态是最新的。

而 Vuex store 就是保存数据状态 state，以及定义了能与 state 进行交互方法的容器。

3. How：如何操作 store

Vue store 的一个最大特征，是约定了数据状态变更遵循单向数据流操作，使得可以完全追踪到 state 改变的来自哪里，即谁触发了数据状态变更。

单身数据流操作：

- state 的变量只能由 mutation 触发
- 组件中对静态变更可以直接提交一个 commit，指定触发某个 mutate，来改变状态 state
- 组件中如果需要根据异步请求结果来变量数据状态时，可以 dispatch 发送一个动作 action，然后待动作完成后提交一个 commit，指定触发某一个 mutate 来改变状态 state
- 组件中对于直接使用的状态数据可以直接通过 `$store.state` 直接来使用
- 组件中对于需要加工处理数据状态后再使用，则可以定义一个 getter 获取一个转换后的数据状态 state。

```
                                   异步API
                                    ^ +
                                    | |
                                    | |
             动态变更            +--+-v----+
       dispatch(action,payload)  |         |   commit(mutate,payload)
         +-----------------------> Actions +----------------------+
         |                       |         |                      |
         |                       +---------+                      |
         |                                                        |
         |                                                        |
         |                                                        |
+--------+------+               静态变更                    +-----v-----+
|               |          commit(mutate,payload)           |           |
| Vue Component +-------------------------------------------> Mutations |
|               |                                           |           |
+------^------^-+                                           +-----+-----+
       |      |                                                   |
       |      |                                                   |
       |      |                  +--------+                       |
       |      | $store.state     |        |      mutate(state)    |
       |      +------------------+ State  <-----------------------+
       |                         |        |
 $store.getters                  +---+----+
       |                             |
       |  +---------+                |
       |  |         |                |
       +--+ Getters <----------------+
          |         |  getter(state,getters)
          +---------+

```

所以从组件角度来看，会与 Vuex 发生交互主要是：

- commit 一个 mutation
- dispatch 一个 action
- 通过 \$store.state 或 getters 访问 state

所以对于 Vuex store 的测试，都是使用当前 state 来断言组件行为是否正常，即将 state 的变更作为测试的输出来断言。

4. vuex.store 的基本结构及注册使用。

```js
// 1. 建立初始 store 的配置文件，它导出一个对象，对象包括基本的 state / getter / mutation / action 属性
const storeConfig = {
  state: {
    count: 0,
  },
  getters: {
    doubleCount(state, getters) {
      return state.count * 2
    },
  },
  mutations: {
    ADD(state, payload) {
      state.count = payload
    },
  },
  actions: {
    fetchCount(context, payload) {
      // context 相当于一个 store 实例对象，包含了 commit 方法
      return axios
        .get(payload.url)
        .then((res) => {
          context.commit('ADD', res.count)
        })
        .catch((err) => {
          throw Error('API Error occurred')
        })
    },
  },
}

// 2. 利用配置文件，初始化一个 store
const store = new Vuex.Store(storeConfig)

// 3. 将当前 store 注册到当前 vue 应用程序中
new Vue({
  store,
})
```

为了便于测试 store 各个部分，可以对各个部分创建独立的文件模块导出默认对象。然后在一个文件中统一合并成配置对象。

```js
import getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'

const state = {}

export default {
  state,
  getters,
  mutations,
  actions,
}
```

对整个 Vuex 的测试可以有以下几种测试：

- 为 Vuex store 的 getter / mutation / action 分别编写单元测试
- 为一个 Vuex stroe 实例编写单元测试
- 为连接 Vuex 的组件编写单元测试
  - localVue 注册 store 实例
  - mock 模拟 \$store

## 单独测试 store 的每个部分

store 中所有部分都是 javascript 函数，所以测试相对较为简单。

1. getter

任何 getter 函数都是纯函数，因为 state 的变更约定只能由 mutation 触发，所以 getter 函数处理不会改变其输入 state，基本就是一个纯函数的测试，断言其输入是否有预期的输出即可。

```js
import getters from 'src/store/getters.js'

describe('getters', () => {
  test('input a nubme, output a double value', () => {
    const ipt = 2
    const state = {
      count: 2,
    }
    expect(getters.doubleCount(state, ipt)).toBe(ipt * 2)
  })
})
```

1. mutation

一个 mutation 函数的作用就是更改 state，所以 mutation 函数的测试始终是断言 state 对象有没有被正确更改。

```js
import mutations from 'src/store/mutations.js'

describe('mutations', () => {
  test('ADD a number to the state.count', () => {
    const num = 10 // 创建一个要作为 payload 参数的值
    const state = {
      // 模拟一个假的 state 对象
      count: 0,
    }
    mutations.ADD(state, num)

    expect(state.count).toBe(num)
  })
})
```

2. action

通常 action 函数里会异步进行 API 接口调用，但我们测试时可不想发送一个真实请求来耽误测试时长。

所以一个 action 函数的测试难点在于需要使用 **模拟代码** 来模拟函数内用于请求的对象。

```js
import actions from 'src/store/actions.js'
import axios from 'axios'

decrible('actions', async () => {
  test('fetchCount', () => {
    const url = 'api.test.com'
    const mockRes = {count: 10}
    const context = {
      commit: jest.fn()
    }
    jest.mock('axios', {
      get: jest.fn()
    })
    axios.get.mockResolvedValue(mockRes)
    await actions.fetchCount(context, {url}) // 注意 fetchCount 函数的实现需要返回 promise 对象

    expect(axios.get).toHaveBeenCalledWith(url) // 断言 fetch 方法以正确参数被调用
    expect(axios.get).toHaveReturnedWith(mockRes) // 且返回正确值
    expect(context.commit).toHaveBeenCalledWith('ADD', mockRes.count) // 断言 commit 被调用，且传入正确的参数
  })

  test('fetchCount Error', () => {
    const url = 'api.test.com'
    const errorMsg = 'API Error occurred'
    jest.mock('axios', {
      get: jest.fn()
    })
    axios.get.mockRejectedValue(new Error(errorMsg))
    await expect(actions.fetchCount(context, {url})).toThrow(errorMsg)
  })
})
```

## 测试 store 实例

测试 vuex 另一种方法是测试一个 store 实例。

测试断言：将 mutation 和 action 作为 store 的输入，state 和 getter 的结果作为输出。

> 单元测试的基本原则是如何提供输入和断言输出。

先用一个简单的计数器示例来测试

```js
// storeConfig.js
export default {
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
  },
}
```

```js
import Vuex from 'vuex'
import storeConfig from 'src/store/index.js'

describe('store', () => {
  const store = new Vuex.Store(storeConfig) // 2. 创建一个 store 实例

  test('increment updates state.count by 1', () => {
    expect(store.state.count).toBe(0) // 断言初始值 state.count
    store.commit('increment') // 提交一个 increment 的 commit
    expect(store.state.count).toBe(1)
  })

  test('decrement updates state.count by 1', () => {
    expect(store.state.count).toBe(1)
    store.commit('decrement')
    expect(store.state.count).toBe(0)
  })
})
```

上面测试用例测试通过，但是存在两个隐藏问题：

- 一个 store 中的 state 对象是对 storeConfig 配置中对象定义的 state 对象的引用。

store 对 state 的任何更改都会改变配置文件 storeConfig 中的 state 的值，这样就导致你编写其它测试用例时，state.count 不再是初始值。这就是**测试泄露**。

比如上面第二个测试用例 `decrement` 中，断言 state.count 的初始值正是上一个测试用例更改过的值。

解决办法：尝试克隆 storeConfig 配置对象，用克隆对象去初始化 store 即可。

```js
import cloneDeep from 'lodash-es'
describe('store', () => {
  const clonedStoreConfig = cloneDeep(storeConfig)
  Vue.use(Vuex) // 1. 在 Vue 上注册 Vuex
  const store = new Vuex.Store(clonedStoreConfig) // 2. 创建一个 store 实例

  // 省略
})
```

```js
import cloneDeep from 'lodash-es'
import storeConfig from 'src/store/index.js'

describe('store', () => {
  test('increment updates state.count by 1', () => {
    const clonedStoreConfig = cloneDeep(storeConfig)
    const store = new Vuex.Store(clonedStoreConfig)
    expect(store.state.count).toBe(0)
    store.commit('increment')
    expect(store.state.count).toBe(1)
  })

  test('decrement updates state.count by 1', () => {
    const clonedStoreConfig = cloneDeep(storeConfig)
    const store = new Vuex.Store(clonedStoreConfig)
    expect(store.state.count).toBe(0) // 断言初始值 0
    store.commit('decrement')
    expect(store.state.count).toBe(-1)
  })
})
```

现在来看一个完整 Vuex 测试例子：
基本功能：actions 中定义一个请求列表数据的异步请求，将返回数据 commit 一个 mutation 存到 state.list 数组对象中。

```js
// src/api/user.js
import axios from 'axios'
export const getUserList = (url) => axios.get(url)

// 在 tests/__mocks__ 文件中建立同名的 user.js 模拟文件
// tests/__mocks__/user.js
export const getUserList = (url) => jest.fn()

// /src/store/index.js
import { getUserList } from 'src/api/user.js'
export default {
  state: {
    userList: [], // [{id, name}]
  },
  getters: {
    getUserNames(state) {
      return state.userList.map((user) => user.name)
    },
  },
  mutations: {
    SET_USERLIST(state, { userList }) {
      state.userList = userList
    },
  },
  actions: {
    async httpGetUserList({ commit }, { url }) {
      try {
        const res = await getUserList(url)
        commit('SET_USERLIST', res.data || [])
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

// 测试文件 tests/vuex.spec.js

import Vuex from 'vuex'
import { cloneDeep } from 'lodash-es'

import storeConfig from 'src/store/index.js'
import { getUserList } from 'src/api/user.js'

jest.mock('src/api/user.js')

let store

beforEach(() => {
  // 创建 store 实例
  const clonedStoreConfig = cloneDeep(storeConfig)
  store = new Veux.Store(clonedStoreConfig)
})

describe('Vuex store', () => {
  test('getter getUserNames', () => {
    const state = [{ name: 'tom' }, { name: 'jane' }]
    expect(store.getters.getUserNames()).toEqual(['tom', 'jane'])
  })

  test('mutation SET_USERLIST', () => {
    // 准备模拟数据
    const mockData = [{}, {}]

    // commit mutation 触发作为输入
    store.commit('SET_USERLIST', mockData)

    // 断言 state 的输出正确
    expect(store.state.userList).toEqual(mockData)
  })

  test('dispatch httpGetUserList', async () => {
    expect.assertions(2) // 断言异步测试中将会成功两个断言
    // 准备模拟数据
    const url = 'api/users'
    const mockResData = [
      { id: 1, name: 'lilei' },
      { id: 2, name: 'hanmeimei' },
    ]
    getUserList.mockResolvedValue(mockResData)

    // dispatch action 触发作为输入
    await store.dispatch('httpGetUserList', url)

    // 断言 1. getUserList 是否被正确的入参调用；2. state.userList 是否是正确的数据
    expect(getUserList).toHaveBeenCalledWith(url)
    expect(store.state.userList).toEqual(mockResData)
  })
})
```

## 在组件内测试 vuex

为了能在组件内部使用 vuex store，我们通常会在 main.js 中全局注册 store。

```js
import Vue from 'vue'
import Vuex from 'vuex'
import storeConfig from 'src/store/index.js'

// 注册 vuex，即全局混入 beforeCreate 钩子中执行 vuexInit 函数，在组件 this 对象上挂载 $store
Vue.use(Vuex)

// 实例化 store
const store = new Vuex.Store(storeConfig)
new Vue({
  store,
})
```

一个简单的组件计数测试：

```vue
<template>
  <div>
    <button id="plus" @click="increase">Plus</button>
    <span>{{ count }}</span>
    <button id="minus" @click="decrease">Minus</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  computed: {
    count() {
      return this.$store.getters.getCount
    },
  },
  methods: {
    increase() {
      this.$store.commit('increase')
    },
    decrease() {
      this.$store.commit('decrease')
    },
  },
}
</script>
```

```js
// storeConfig
export default {
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
  },
}
```

```js
import vue from 'vue'
import Vuex from 'vuex'
import { shallowMount } from '@vue/test-utils'
import { cloneDeep } from 'lodash-es'

import storeConfig from 'src/store/index.js'
import Counter from 'src/components/Counter'

describe('Counter.vue', () => {
  Vue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(storeConfig)) // 避免 storeConfig 因为对象引用而污染
  const wrapper = shallowMount(Counter, {
    store,
  })

  test('get state.count init render', () => {
    const span = wrapper.find('span')
    expect(span.text()).toContain('0')
  })
  test('commit a mutation increment when a button is clicked', async () => {
    const btnIncrement = wrapper.find('#plus')
    const btnDecrement = wrapper.find('#minus')
    const span = wrapper.find('span')

    await btnIncrement.trigger('click')
    expect(span.text()).toContain('1')

    await btnDecrement.trigger('click')
    expect(span.text()).toContain('0')
  })
})
```

这里测试用例会通过，并且我们通过深拷贝避免了一个潜在的**测试泄露**。但在上述代码中，隐藏着另一个测试泄露的问题：即直接使用全局唯一的 Vue 基础构造函数来注册 Vuex，会导致其它测试套件使用的 Vue 被污染了。

在 JEST 中，每个测试文件都拥有独立的上下文环境，默认情况下，Vue Test Utils 挂载一个组件时使用全局唯一的 Vue 基础构造函数。

为了保持单元测试的隔离和清洁，对于需要扩展 Vue 基础构造函数的功能的操作都应该使用 Vue 的本地副本。而 `@vue/test-utils` 测试套件提供了一个工厂函数 `createLocalVue` 来创建一个 Vue 基础构造函数的本地副本。

> 原件和复印件：在需要使用身份证的地方，都不会把身份证原件给对方处理，而是影印一份副本文件。同样的，将 Vue 基础构造函数视为原件，localVue 构造函数就是原件的复印件，它提供了原版相同的功能，如果你需要在测试代码中更改 Vue 基础构造函数，就使用本地复印件 LocalVue。

```js
import vue from 'vue'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { cloneDeep } from 'lodash-es'

import storeConfig from 'src/store/index.js'
import Counter from 'src/components/Counter'

describe('Counter.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(storeConfig)) // 避免 storeConfig 因为对象引用而污染
  const wrapper = shallowMount(Counter, {
    localVue, // 作为挂载选项传入
    store,
  })

  // 省略代码
})
```

上面这种通过引入 localVue，并注册 store 的方式，使得测试代码中存在一些冗余的模板代码，虽然我们可以在使用工厂函数或在 jest 的钩子函数中使用，来减少冗余代码。

但如果有更多的组件需要测试 Vuex store 功能，仍然显得较为繁琐。所以一种更好的方法是使用 `@vue/test-utils` 测试套件提供的 `mocks` 挂载选项来模拟引入的全局公共变量。

```js
import { shallowMount } from '@vue/test-utils'
import Counter from 'src/components/Counter'

descible('counter.vue store', () => {
  test('getters getCount', () => {
    const wrapper = shallowMount(Counter, {
      mocks: {
        $store: {
          getters: {
            getCount: 11,
          },
        },
      },
    })

    expect(wrapper.find('span').text()).toContain('11')
  })

  test('commit a mutation when a button is clicked', async () => {
    const mockStore = { commit: jest.fn() }

    const wrapper = shallowMount(Counter, {
      mocks: {
        $store: mockStore,
      },
    })

    await wrapper.find('#plus').trigger('click')
    expect(mockStore.commit).toHaveBeenCalledWith('increment')
  })

  it('dispatches an action when a button is clicked', async () => {
    const mockStore = { dispatch: jest.fn() }
    const wrapper = shallowMount(ComponentWithButtons, {
      mocks: {
        $store: mockStore,
      },
    })

    wrapper.find('.dispatch').trigger('click')
    await wrapper.vm.$nextTick()

    expect(mockStore.dispatch).toHaveBeenCalledWith('httpGetUserList', {
      url: 'api/users',
    })
  })
})
```

# 总结：

对整个 Vuex 的测试可以有以下几种测试：

- 为 Vuex store 的 getter / mutation / action 分别编写单元测试
- 为一个 Vuex stroe 实例编写单元测试
- 为连接 Vuex 的组件编写单元测试
  - localVue 注册 store 实例来测试
  - mocks 挂载选项传入模拟的 \$store

所以更建议的 vuex 测试组合应该是：

- 为一个 Vuex stroe 实例编写单元测试
- 连接了 Vuex 的组件，使用 mocks 挂载选项传入模拟的 \$store 来编写单元测试

另外有两种**测试泄露**的情况要注意：

- storeConfig 对象引用，需要使用深拷贝来复制一份副本使用
- Vue 全局功能的注册需要使用 createLocalVue 函数生成一个本地 Vue 的副本来注册。

这样的目的都是为了保持每个测试文件上下文环境的隔离和清洁。
