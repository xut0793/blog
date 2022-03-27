# vue 应用测试

测试是有关输入和输出的，在测试中，提供输入，接收输出，并断言输出是否正确的过程。P40

## 测试中挂载组件渲染的方式

- mount
- shallowMount

> 在服务端渲染中 @vue/server-test-utils 提供了 render 和 renderToString 方法。

## 测试组件渲染的输出 `test html attribute class`

```vue
<template>
  <div id="foo" class="primary active" style="color: orange">
    <span>Hello Vue</span>
    <span>Hello Test</span>
  </div>
</template>
<script>
export default {
  name: 'Foo',
}
</script>
```

1. 测试渲染的内容 `text()`

```js
test('render text', () => {
  const wrapper = mount(Foo)
  const textContent = wrapper.text()
  console.log(textContent) // Hello Vue Hello Test
  expect(textContent).toContain('Hello Vue')
  expect(textContent).toBe('Hello Vue Hello Test')
})
```

> wrapper.text() 相当于 Element.textContent，即返回所有子节点的文本内容
> toBe 与 toContain 区别： toBe 使用 object.is() 匹配。严格相等; toContain 相当于 String.prototype.includes 方法，包含即可。

2. 测试渲染的 DOM 节点的字符串形式 `html()`

```js
test('render DOM node as string', () => {
  const wrapper = mount(Foo)
  const htmlString = wrapper.html()
  expect(htmlString).toBe(
    '<div id="foo" class="primary active" style="color: orange"><span>Hello Vue</span><span>Hello Test</span></div>'
  )
})
```

3. 测试渲染的 DOM 属性 `attributes()`

```js
test('DOM node attribute', () => {
  const wrapper = mount(Foo)
  expect(wrapper.attributes().id === 'foo').toBe(true) // 不推荐，如果测试未通过时，只会得到预期是 true,实际false这类提示
  expect(wrapper.attributes().id).toBe('foo') // wrapper.attributes() 返回一个对象，属性名为key，属性值为 value
  expect(wrapper.attributes('id')).toBe('foo') // 如果传入了对应的属性，则返回该属性的值
})
```

> 避免 Boolean 断言，一个好的单元测试要有一个富有表达力的断言，这样当断言失败时，会得到一个更有用的信息。

4. 测试 Class

```js
test('DOM node classes', () => {
  const wrapper = mount(Foo)
  expect(wrapper.classes()).toContain('active')
  expect(wrapper.classes('primary')).toBe(true)
})
```

5. 测试 style

```js
test('DOM node style', () => {
  const wrapper = mount(Foo)
  const ele = wrapper.element // 返回组件根节点的 DOM 元素
  expect(ele.style.color).toBe('orange')
})
```

何时测试组件渲染的输出

- 永远不要为静态内容和静态 css 类编写单元测试
- 组件单元测试原则一：仅测试动态生成的输出，以及仅测试组件契约部分的输出。
- 单元测试的金发姑娘原则：不要太多，不要太少，而是要刚刚好
- 每增加一个测试就在增加测试与源代码的依赖耦合。紧密的耦合会让代码重构变得困难，因为修改一处代码可以就会破坏数十个测试代码。

所以应该尽量避免上面测试用例，上面仅仅只为讲解测试 API 使用的演示子例。实际业务中应如下所示，仅对动态绑定的内容进行单元测试。

```vue
<template>
  <div
    id="foo"
    :class="['primary', active ? 'active' : null]"
    :style="{ color: active ? 'orange' : null }"
  >
    <span>{{ message }}</span>
  </div>
</template>
<script>
export default {
  name: 'Foo',
  data() {
    return {
      active: false,
      message: 'Hello Vue Test',
    }
  },
  created() {
    this.active = true
  },
}
</script>
```

仅对上述动态绑定内容进行单元测试

```js
import { mount } from '@vue/test-utils'
import Foo from 'path/to/Foo.vue'

describe('Foo.vue', () => {
  test('render text', () => {
    const wrapper = mount(Foo)
    expect(wrapper.html()).toContain('Hello Vue')
  })

  test('DOM node classes', () => {
    const wrapper = mount(Foo)
    expect(wrapper.classes()).toContain('active')
  })

  test('DOM node style', () => {
    const wrapper = mount(Foo)
    expect(wrapper.element.style.color).toBe('orange')
  })
})
```

## 测试组件契约的输入 `props() / setProps()`

```vue
<template>
  <div>{{ mssage }}</div>
</template>
<script>
export default {
  name: 'Foo',
  props: {
    mssage: String,
  },
}
</script>
```

```js
test('received prop', () => {
  const wrapper = mount(Foo, {
    propsData: {
      // 提供一个挂载选项的 propsData 属性，模拟组件的 prop 输入。
      message: 'Hello Vue', // propsData 实际上是一个 Vue API，不是 Vue Test Utils 实现的挂载选项。如同其它 data method 属性一样，内部会被 Vue.extends 处理
    },
  })
  expect(wrapper.props().message).toBe('Hello Vue') // wrapper.props() 返回组件接收的所有 prop 组成的对象
  expect(wrapper.props('message')).toBe('Hello Vue')
})
```

如果模拟外部更新了 prop，则需要断言组件接收到 prop 是否同样更新，可以使用 `setProps`

```js
test('updated prop', async () => {
  const wrapper = mount(Foo, {
    propsData: {
      message: 'Hello Vue',
    },
  })
  expect(wrapper.props('message')).toBe('Hello Vue')
  await wrapper.setProps({ message: 'Hello Vue updated' })
  expect(wrapper.props('message')).toBe('Hello Vue updated')
  expect(wrapper.text()).toContain('updated')
})
```

> setProps 方法返回一个 Promise，确保 Vue 异步渲染更新后被 resolved。类似的方法还有：trigger / setData / setValue / setChecked / setSelected

## 测试组件方法

组件 `method` 的函数，主要关注函数内部代码逻辑，如果是无副作用的纯函数，那就当普通函数一样断言输入输出即可，比如常见的一些转换函数，布尔断言函数等。

```js
test('pure function', () => {
  const Foo = {
    name: 'foo',
    template: `<div></div>`,
    methods: {
      isEvenNumber(n) {
        return n % 2 === 0
      },
    },
  }

  expect(Foo.methods.isEvenNumber(8)).toBe(true)
  expect(Foo.methods.isEvenNumber(9)).toBe(false)
})
```

但是实际业务中，method 函数更多都是具有依赖的函数。

**依赖是指在被测试代码单元控制之外的任何代码**。比如：

- 方法函数中调用了浏览器的 API：如 `setTimeout` `fetch` 等
- 被导入第三模块的方法：如 `import api from 'path/to/api.js'`
- Vue 全局注入的方法或实例属性: 如 `Vue.prototype.$utils.someFn`。

测试有依赖项的方法，则需要一些更复杂的方法去实现测试。为了减少测试代码和业务代码的耦合，在测试中通过**模拟代码**来解决这些复杂的依赖。

**模拟代码是指用你可控制的代码来替换你不可控制的依赖**

`Jest` 测试框架提供了以下 API 来生成模拟代码：

- `jest.fn`：模拟一个函数的实现
- `jest.spyOn`: 模拟复杂对象中某个方法的实现
- `jest.mock`：模拟一个模块对象
- `jest.useFakeTimers`：模拟定时器的实现
  > 关于 jest 模拟方法的讲解请移少 jest 的学习总结。

另外 `@vue/test-utils` 也提供了途径来模拟 Vue 全局注入方法、属性等。它们通过 `mount / shallowMout` 挂载函数的选项对象来实现。

- `options.mocks`: 伪造 Vue 全局注入的属性或方法

### 测试组件内全局公共方法的调用 `mocks`

在 Vue 项目中，我们通常会将全局公用的方法挂载到 `Vue.prototype` 原型对象上。对于该方法的内部逻辑的测试应该在它独立的测试文件中完成，在组件的测试中仅仅是测试该方法是否能调用成功，或调用返回正常的输出即可。

此时，因为不需要实际执行方法内部逻辑，所以我们需要通过模拟代码来测试输出。

```js
test('calls $t.start on load', () => {
  const Foo = {
    template: `<div>mock global method</div>`,
    beforeCreate() {
      this.$t.start()
    },
  }

  const $t = {
    start: jest.fn(),
  }

  const wrapper = shallowMount(Foo, {
    mocks: { $t },
  })
  expect($t.start).toHaveBeenCalledTimes(1)
})
```

`mocks` 挂载选项用处最多的应该就是模拟 `$route / $router / $store` 的全局属性了，我们会在下面的测试 `vue-router / vuex` 代码中看到。

### 测试组件中依赖的导入模块

我们通常会在组件中使用 `axios` 请求数据。

```vue
<template>
  <div>
    <button @click="getList('user')">请求数据</button>
    <ul>
      <li v-for="item in List" :key="item.id">{{ item.value }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'foo',
  data() {
    return {
      list: [],
    }
  },
  methods: {
    getList(val) {
      return axios.get('http://api.example.com/list?q=' + val).then((res) => {
        this.list = res.data
      })
    },
  },
}
</script>
```

`getList` 函数的调用会发起一个 HTTP 请求，但在测试中，我们不会想真正发起一个请求的，因为这会让测试时间更长，且让测试结果变得不确定。所以我们需要**模拟代码**来模拟此处的请求代码。

因为 `axios` 是组件依赖的外部模块，如果要模拟整个模块文件，就要用到 `jest.mock` 函数。

```js
jest.mock('axios', () => ({
  get: jest.fn(),
}))
```

这里我们模拟了整个 `axios` 模块对象，并且模拟实现了用到的 `get` 方法。

```js
// List.spec.js

// jest.mock 需要放置在测试文件顶部
jest.mock('axios', () => ({
  get: jest.fn(),
}))

import axios from 'axios'
import List from '../src/components/List.vue'

jest('called axios.get', () => {
  List.methods.getLis('user')
  exptect(axios.get).toHaveBeenCalledWith('http://api.example.com/list?q=user')
})
```

上述测试用例确实能通过，也不会发起真实的 HTTP 请求。但是真实 axios 调用返回的是异步的 promise 函数，所以我们需要修改测试用例

```js
jest('called axios.get', async () => {
  expect.assertions(3)
  cosnt res = { data: [1,2,3]}
  axios.get.mockResolvedValue(res)
  // 模拟axios.get 返回一个resolved 状态 promise 对象。是以下代码的语法糖jest.fn().mockImplementation(() => Promise.resolve(value))，也可以直接定义在模拟代码中： get: jest.fn(()=> Promise.resolve({data: [1,2,3]}))
  const wrapper = shallowMount(List)
  const ret = await wrapper.vm.getLis('user')
  expect(ret).toEqual(res)
  expect(wrapper.vm.list).toEqual(res.data)
  exptect(axios.get).toHaveBeenCalledWith('http://api.example.com/list?q=user')
})
```

真实业务场景下，会调用 axios 的多个方法`get / post / patch` 等，所以最好将模拟的 axios 对象放在一个单独的模拟文件中。

此时，jest 已经约定模拟文件的实现统一放在 `__mocks__` 目录下，就像约定的 `__tests__` 文件夹一样会自动处理。

在`node`环境中，node 内部使用 `CommonJS` 模块规范实现了模块解析器，来查找模块文件。在 `webpack` 的项目中，`webpack` 也自己实现了模块解析方法 `__webpack_require__`，所以 `Jest` 也有自己的模块解析器来查找模拟的文件。

所以调用 `jest.mock('axios')` 函数后，当组件内导入了 `import axios from 'axios'`模块， Jset 会自动在 `__mocks__` 文件中查找同名的文件导入测试中。

> 必须是 **mocks** 命名，同 **tests** 目录一样，jest 会利用自已实现的模拟解析器自动查找。同样的，**mocks** 文件夹可以在 tests 目录中，也可以就近在需要模拟的模拟目录下。

```js
// tests/__mocks__/axios.js
module.exports = {
  get: jest.fn(),
  post：jest.fn(() => Promise.resolve({ data: {} })),
  put： jest.fn(() => Promise.resolve({ data: {} })),
}
```

```js
import axios from 'axios'
import List from '../src/components/List.vue'

jest.mock('axios')

jest('called axios.get', async () => {
  expect.assertions(3)
  cosnt res = { data: [1,2,3]}
  axios.get.mockResolvedValue(res)
  // 模拟axios.get 返回一个resolved 状态 promise 对象。是以下代码的语法糖jest.fn().mockImplementation(() => Promise.resolve(value))，也可以直接定义在模拟代码中： get: jest.fn(()=> Promise.resolve({data: [1,2,3]}))
  const wrapper = shallowMount(List)
  const ret = await wrapper.vm.getLis('user')
  expect(ret).toEqual(res)
  exect(wrapper.vm.list).toEqual(res.data)
  exptect(axios.get).toHaveBeenCalledWith('http://api.example.com/list?q=user')
})
```

**注意清除 mock 影响**

如果此时在同一个测试文件中增加以下测试用例，仍然会通过。

```js
it('Axios should not be called here', () => {
  expect(axios.get).toBeCalledWith(
    'https://jsonplaceholder.typicode.com/posts?q=an'
  )
})
```

如果我们不想模拟的 axios 影响其它测试用例，则需要清空被注册的模拟对象，可以在 beforeEach 函数中添加如下代码：

```js
afterEach(() => {
  jest.resetMoules()
  jest.clearAllMocks()
})
```

这样就可以确保每个测试用例在开始的时候有一个清洁无污染的模拟依赖环境。

另外，我们通常不会直接在组件中调用 axios，而是用使用封装的请求 api 调用。

比如在 `/src/api/index.js` 中有一个获取列表数据的请求

```js
// src/api/index.js
import axios from 'axios'
export function getList() {
  return axios.get('/path/list')
}

// List.vue
import { getList } from '../api/index.js'
export default {
  template: `<ul><li v-for="item in List" :key="item.id">{{item.value}}</li></ul>`,
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.list = getList()
  },
}
```

同样可以使用以下代码模拟 api 文件，只需要保证在 `__mocks__` 目录下存在同名的文件即可。

```js
jest.mock('../api/index.js')
```

## 查找组件内元素的方法 `find findAll`

`wrapper.find(selector) / wrapper.findAll(selector)`同原生的 DOM API `element.querySelector / querySelectorAll` 一样，传入正确的 CSS 选择器，会返回 `DOMWrapper`包装对象。

- CSS 选择器
  - 标签选择器 (div、foo、bar)
  - 类选择器 (.foo、.bar)
  - =特性选择器 ([foo]、[foo="bar"])
  - id 选择器 (#foo、#bar)
  - 伪选择器 (div:first-of-type)
- 组合选择器：
  - 直接从属结合 (div > #bar > .foo)
  - 一般从属结合 (div #bar .foo)
  - 近邻兄弟选择器 (div + .foo)
  - 一般兄弟选择器 (div ~ .foo)

```js
test('find element', () => {
  const wrapper = shallowMount(Foo)
  const divWrapper = wrapper.find('#foo')
  expect(divWrapper.exists()).toBe(true)
  expect(divWrapper.element.id).toBe('foo')
})

test('find all span', () => {
  const wrapper = mount(Foo)
  const spanWrapperArray = wrapper.findAll('span')
  expect(spanWrapperArray).toHaveLength(2)
})
```

## 查找组件内子组件的方法 `findComponent findAllComponents`

`find / findAll` 用来查找 DOM 元素，`findComponent / findAllComponents` 用来查找子组件。

类似选择器，可以传入组件`构建函数、ref、name`来查找。

```js
import { mount } from '@vue/test-utils'

const Bar = {
  name: 'bar',
  template: `<div>Bar</div>`
}

const Foo = {
  name: 'Foo'
  template: `<div>
    <span>Foo</span>
    <Bar ref="bar" />
  </div>`,
  components: { Bar }
}

const warpper = mount(Foo)
const bar = wrapper.findComponent(Bar) // => finds Bar by component instance
expect(bar.exists()).toBe(true)
const barByName = wrapper.findComponent({ name: 'bar' }) // => finds Bar by `name`
expect(barByName.exists()).toBe(true)
const barRef = wrapper.findComponent({ ref: 'bar' }) // => finds Bar by `ref`
expect(barRef.exists()).toBe(true)

const bar = wrapper.findAllComponents(Bar).at(0) // WrapperArray.at(number) 返回数组第几个元素
expect(bar.exists()).toBeTruthy()
const bars = wrapper.findAllComponents(Bar)
expect(bars).toHaveLength(1)
```

## 测试元素原生 Dom 事件

原生 DOM 事件触发可以使用 `find` 查找目标元素后返回的包装对象 `DOMWrapper` 提供的 `trigger` 方法。该方法可以传入一个具体触发的事件类型，触发后返回一个 `Promise`，保证组件异步更新后，被 `resolved`。

```js
const Bar = {
  name: 'bar',
  template: `<button @click="onButtonClick">点击 {{ count }}</button>`,
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    onButtonClick() {
      this.count++
    },
  },
}

test('DOM event', async () => {
  const wrapper = shallowMount(Bar)
  const btnWrapper = wrapper.find('button')
  await btnWrapper.trigger('click')
  expect(wrapper.vm.count).toBe(1)
  expect(wrapper.text()).toContain('1')
})
```

## 测试组件自定义事件

可以在组件挂载时通过 `listeners` 选项传入模拟方法，然后事件触发后，断言方法是否调用，来证实事件触发了。

原理是设置了组件实例的 `vm.$listeners` 对象

> 子组件的 \$listeners 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。

```js
const Foo = {
  template: '<button v-on:click="onClick"></button>',
  methods: {
    onClick(e) {
      console.log('button clicked', e)
    },
  },
}
const onClick = jest.fn()
const wrapper = shallowMount(Foo, {
  listeners: {
    click: onClick,
  },
})

wrapper.trigger('click')
expect(onClick).toHaveBeenCalled()
```

## 测试组件间事件通讯 `v-on / $emit`

从组件契约规则看，Vue 组件自定义事件分为两个部分：父组件监听事件和子组件触发事件

- 对于子组件角度来说, DOM 事件 trigger 触发是输入，然后子组件 emit 事件是输出。
- 对于父组件角度来说，子组件触发 emit 的事件是输入，事件处理器的执行是输出。

1. 测试组件发射自定义事件 `ecmitted()`

```js
const Bar = {
  name: 'bar',
  template: `<button @click="onButtonClick">点击 {{ count }}</button>`,
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    onButtonClick() {
      this.$emit('on-click', ++this.count)
    },
  },
}

test('emitted 1', () => {
  const wrapper = shallowMount(Bar)
  wrapper.vm.$emit('on-click', 1)
  wrapper.vm.$emit('on-click', 2)

  // wrapper.emitted() 返回 {'on-click': [[1], [2]]}
  expect(wrapper.emitted()).toHaveProperty('on-click')
  expect(wrapper.emitted()['on-click']).toHaveLength(2)
  expect(wrapper.emitted()['on-click'][0]).toEqual([1])
  expect(wrapper.emitted()['on-click'][1]).toHaveLength(1) // [2].length
})

// 因为我们绑定了事件，所以也可以利用元素的点击事件触发 emit
test('emitted 2', async () => {
  const wrapper = shallowMount(Bar)
  const btnWrapper = wrapper.find('button')
  await btnWrapper.trigger('click')
  await btnWrapper.trigger('click')

  // wrapper.emitted() 返回 {'on-click': [[1], [2]]}
  expect(wrapper.emitted()).toHaveProperty('on-click')
  expect(wrapper.emitted()['on-click']).toHaveLength(2)
  expect(wrapper.emitted()['on-click'][0]).toEqual([1])
  expect(wrapper.emitted()['on-click'][1]).toHaveLength(1) // [2].length
})
```

2. 测试组件监听自定义事件

```js
const Foo = {
  name: 'foo',
  template: `<div>
    <span>{{ payload }}</span>
    <Bar @on-click="onClick" />
  </div>`,
  components: { Bar },
  data() {
    return {
      payload: '',
    }
  },
  methods: {
    onClick(payload) {
      this.payload = payload
    },
  },
}

test('update payload when Bar click to emit on-click', async () => {
  const wrapper = mount(Foo)
  const btnWrapper = wrapper.find('button')
  await btnWrapper.trigger('click')
  expect(wrapper.find('span').text()).toBe('1')
})

// 在此处 showMount(Foo) 和 mount(Foo) 挂载会有什么区别嘛？
test('update payload by shallowMount', async () => {
  const wrapper = shallowMount(Foo)
  // const btnWrapper = wrapper.find('button') // 因为是浅挂载，Bar 组件是插桩 Bar-Stub，查找其中的DOM元素会报错
  const bar = wrapper.findComponent(Bar) // 但是直接查找 Bar 组件可以获得完整的 VueWrapper 包装对象
  bar.vm.$emit('on-click', 1)
  expect(wrapper.vm.payload).toBe(1)
})
```

## 测试组件间事件通讯 `provide / inject`

父组件可以使用 `provide` 向所有子组件传入共享的数据，子组件通过 `inject` 来访问父组件传入下来的公共属性。

子组件测试中，想要知道父组件通讯 `provide` 传入的数据能否被正常渲染，可以对子组件加载时传入 `provide` 属性来伪装是父组件传入的数据。

```js
test('provide inject', () => {
  const Foo = {
    inject: ['bar'],
    template: '<div>{{this.bar()}}</div>',
  }

  const wrapper = shallowMount(Component, {
    provide: {
      bar() {
        return 'barValue'
      },
    },
  })

  expect(wrapper.text()).toBe('barValue')
})
```

## 测试组件绑定的响应数据 `data / setData`

最开发的例子,当我们简单测试一个组件的渲染输出,可以是这样

```js
test('data', () => {
  const Foo = {
    name: 'foo',
    template: `<div>{{ msg }}</div>`,
    data() {
      return {
        msg: 'Hello Vue',
      }
    },
  }

  const wrapper = shallowMount(Foo)
  expect(wrapper.text()).toContain('Hello Vue')
})
```

如果此时我们要测试 msg 变量是否是 vue 响应式数据,我们希望手动改变 msg 的值,视图渲染也会更新,此时会这么做:

```js
test('data', () => {
  const Foo = {
    name: 'foo',
    template: `<div>{{ msg }}</div>`,
    data() {
      return {
        msg: 'Hello Vue',
      }
    },
  }

  const wrapper = shallowMount(Foo)
  expect(wrapper.text()).toContain('Hello Vue')
  wrapper.vm.msg = 'Hello Vue Test'
  expect(wrapper.text()).toContain('Test')
})
```

但测试结果返回失败.原因是 vue 响应式数据触发视图更新是异步的.

在业务代码中,如果我们更改了响应式数据,想接着查看其响应式结果,通常会在 `Vue.nextTick` 回调函数中执行.同样在测试中,我们也可以使用异步测试,等待 vue 渲染的下一帧 `nextTick` 再断言。

```js
test('data / nextTick', async () => {
  const Foo = {
    name: 'foo',
    template: `<div>{{ msg }}</div>`,
    data() {
      return {
        msg: 'Hello Vue',
      }
    },
  }

  const wrapper = shallowMount(Foo)
  expect(wrapper.text()).toContain('Hello Vue')
  wrapper.vm.msg = 'Hello Vue Test'
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toContain('Test')
})
```

对这种情形，在 `@vue/test-utils` 中提供了一个语法糖 `setData`，可以简化代码为：

```js
test.only('data / setData', async () => {
  const Foo = {
    name: 'foo',
    template: `<div>{{ msg }}</div>`,
    data() {
      return {
        msg: 'Hello Vue',
      }
    },
  }

  const wrapper = shallowMount(Foo)
  expect(wrapper.text()).toContain('Hello Vue')
  await wrapper.setData({ msg: 'Hello Vue Test' })
  expect(wrapper.text()).toContain('Test')
})
```

## 测试表单事件

在表单元素中，通常会使用 `v-model` 绑定响应数据。

```html
<input v-model="inputVal" />
```

但其实这是一个语法糖语法，它是响应式数据绑定和事件绑定的简写

```html
<input v-bind:value="value" v-on:input="$emit('input', $event.target.value)" />
```

在测试这类数据时，我们可能需要：设置 input 元素的 value 值，然后在元素上触发一个变更事件以更新绑定的值。

```js
test('input', async () => {
  const Foo = {
    template: `<input :value="inputValue" @input="onInput"></input>`,
    data() {
      return {
        inputValue: '',
      }
    },
    methods: {
      onInput(e) {
        this.inputValue = e.target.value
      },
    },
  }
  const wrapper = shallowMount(Foo)
  const input = wrapper.find('input')
  input.element.value = 'Hello'
  input.trigger('input')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.inputValue).toBe('Hello')
})
```

同样，`@vue/test-utils` 提供了简单的 API `setValue`

```js
test('input / setValue', async () => {
  const Foo = {
    template: `<input v-model="inputValue"></input>`,
    data() {
      return {
        inputValue: '',
      }
    },
  }
  const wrapper = shallowMount(Foo)
  const input = wrapper.find('input')
  await setValue('Hello')
  expect(wrapper.vm.inputValue).toBe('Hello')
})
```

同样的原理，对于单选框提供了 `setChecked`、多选框组件提供了 `setSelected` 语法：

```js
// input => setValue 相当于
textInput.element.value = value
textInput.trigger('input')

// radio => setChecked
checkboxInput.element.checked = checked
checkboxInput.trigger('change')

// select => setSelected
option.element.selected = true
parentSelect.trigger('change')
```

一个表单组件测试：

```js
describe.only('form', () => {
  const Form = {
    name: 'form',
    template: `<form>
    <label>Name:
      <input type="text" v-model="name" />
    </label>
    <label>Gender: 
      <input type="radio" id="male" value="male" v-model="gender"> Male
      <input type="radio" id="female" value="female" v-model="gender"> Female
    </label>
    <label>Please choose one or more pets:
        <select v-model="pets" name="pets" multiple>
          <optgroup label="4-legged pets">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
          </optgroup>
          <optgroup label="Flying pets">
            <option value="parrot">Parrot</option>
            <option value="macaw">Macaw</option>
            <option value="albatross">Albatross</option>
          </optgroup>
        </select>
      </label>
    </form>`,
    data() {
      return {
        name: '',
        gender: '',
        pets: [],
      }
    },
  }

  const wrapper = shallowMount(Form)
  test('input / setValue', async () => {
    const inputWrapper = wrapper.find('input[type="text"]')
    await inputWrapper.setValue('Tom')
    expect(wrapper.vm.name).toBe('Tom')
  })

  test('radio / setChecked', async () => {
    const maleRadioWraaper = wrapper.find('input#male')
    await maleRadioWraaper.setChecked(true)
    expect(maleRadioWraaper.element.checked).toBeTruthy()
    expect(wrapper.vm.gender).toBe('male')
  })

  test('select / setSelected', async () => {
    const options = wrapper.findAll('option')
    const optionDog = options.at(1)
    const optionMacaw = options.at(5)
    await optionDog.setSelected()
    await optionMacaw.setSelected()
    expect(wrapper.findAll('option:checked')).toHaveLength(2)
    expect(optionMacaw.element.checked).toBeTruthy()
    expect(optionMacaw.element.checked).toBeTruthy()
    expect(wrapper.vm.pets).toEqual(['dog', 'macaw'])
  })
})
```

## 测试组件

### 组件插槽

对于组件插槽的测试是断言插槽的内容是否成功渲染在父组件中。

在 Vue 中有三种类型的插槽：

- 默认插槽
- 具名插槽
- 作用域插槽

一个渲染列表的例子：

```vue
<template>
  <ul class="list-wrapper">
    <slot></slot>
  </ul>
  <template>
    <script>
      export default {
        name: 'List',
      }
    </script></template
  ></template
>
```

通过 `@vue/test-utils` 提供的 `slots` 挂载选项可以为组件注入插槽内容

```js
test('render default slot', () => {
  const wrapper = shallowMount(List, {
    slots: {
      default: '<li class="list-item">list-item</li>',
    },
  })
  expect(wrapper.findAll('.list-item')).toHaveLength(1)
})
```

现在为列表组件增加两个具名的插槽，来自定义列表表头和尾部

```vue
<template>
  <div>
    <slot name="header">This is default List header</slot>
    <ul class="list-wrapper">
      <slot></slot>
    </ul>
    <slot name="footer"></slot>
  </div>
  <template>
    <script>
      export default {
        name: 'List',
      }
    </script></template
  ></template
>
```

Vue 测试套件 `@vue/test-utils` 提供的 `slots` 是一个对象，默认插槽使用 `default` 为健名，所以具名插槽可以使用具体名称为键名。

```js
test('render named slot', () => {
  const wrapper = shallowMount(List, {
    slots: {
      default: '<li class="list-item">list-item</li>',
      header: `<h1 class="list-header">This is Test List header</h1>`,
      footer: `<p class="list-footer">2021-5-18 6:05 am</p>`,
    },
  })
  expect(wrapper.findAll('.list-item')).toHaveLength(1)
  expect(wrapper.find('.list-header').exists()).toBeTruthy()
  expect(wrapper.find('.list-footer').exists()).toBeTruthy()
})

// 因为 header 还提供了插槽默认内容，可以测试其是否渲染
test('render slot default content', () => {
  const wrapper = shallowMount(List, {
    slots: {
      default: '<li class="list-item">list-item</li>',
    },
  })
  expect(wrapper.text()).toContain('This is default List header')
})
```

假设我们列表的具名插槽允许我们自定义 html 结构和样式，比如标题前需要增加一个图标，但是标题内容不再是外部定义，而是使用 `List` 组件传入的 `prop` 数据 `title`。此时可以使用带有作用域的具名插槽。

```vue
<template>
  <div>
    <slot name="header" :data="title">{{ title }}</slot>
    <ul class="list-wrapper">
      <slot><li>default list</li></slot>
    </ul>
    <slot name="footer"></slot>
  </div>
  <template>
    <script>
      export default {
        name: 'List',
        props: {
          title: String,
        },
      }
    </script></template
  ></template
>
```

我们使用时可以自定义一个带 icon 的标题：

```html
<List>
  <div v-slot:header="slotProps">
    <i class="iconfont icon">&#xe7cb;</i>
    <span>{{ slotProps.data }}</span>
  </div>
  <li class="list-item">list-item</li>
</List>
```

对于作用域插槽测试用例，测试套件提供了 `scopedSlots` 挂载选项。

并且对于作用域插槽中数据 slotProps 的提供可以有以下几种方式：

```js
shallowMount(List, {
  scopedSlots: {
    header: '<p>{{props.data}}</p>', // 默认通过 props 对象，等同于 slotProps 对象
    header: function(props) {
      return this.$createElement('p', props.data)
    },
    header: function(props) {
      return <p>{props.data}</p>
    }, // 如果安装了 jsx 对应的语法插件
  },
})
```

测试用例：

```js
test('render scoped slot', () => {
  const wrapper = shallowMount(List, {
    propsData: {
      title: 'This is Test header used scoped'
    }
    slots: {
      default: '<li class="list-item">list-item</li>',
      footer: `<p class="list-footer">2021-5-18 6:05 am</p>`
    },
    scopedSlots: {
      header: `<div>
                <i class="iconfont icon list-header__icon">&#xe7cb;</i>
                <span class="list-header__title">{{ props.data }}</span>
              </div>`
    }
  })
  expect(wrapper.find('list-header__icon').exists()).toBeTruthy()
  expect(wrapper.find('list-header__title').text()).toContain('used scoped')
})
```

### 组件存根

在实际业务中，像 `List` 这类组件插槽往往使用的是组件传入

```html
<List>
  <ListItem></ListItem>
</List>
```

但往往组件`ListItem` 里面又有一些外部依赖，例如会发起接口请求等。但在这里我们测试插槽只想简单断言下`ListItem`组件是不是在 `List` 组件的默认插槽中渲染即可，不想模拟 `ListItem` 内部复杂依赖的测试，这是它进行组件自身测试的内容，但不是在这里。

此时我们可以沿用**模拟代码**来屏蔽掉 `ListItem` 内部依赖的实现。`@vue/test-utils` 测试套件提供了一个 `stubs` 的挂载选项。

> stub 翻译为存根，测试用语中常理解为 桩，就好比在某个位置插桩进行标识这里存在某个东西即可。

```js
import List from 'src/components/List.vue'
import ListItem from 'src/components/ListItem.vue'
test('stubbing ListItem', () => {
  const wrapper = mount(List, {
    slots: {
      default: ListItem,
    }
    stubs: {
      ListItem: true,
    }
  })
})
console.log(wrapper.html()) // <ul><listitem-stub></ul>
expect(wrapper.findComponent(ListItem).exists()).toBeTruthy()
```

向 `stubs` 传入 `[component]: true` 后，会用一个 `stub` 替换了原始的组件。外部的接口也照旧（我们依然可以用 find 选取，因为 find 内部使用的 name 属性仍旧相同）。被 `stubbing` 的组件内部诸如 axios 请求等复杂依赖的内部方法，则不会被执行，它们被 `stubbed out` 了。

**shallowMount 会自动化 stubbing 内部子组件**

不同于使用 mount 挂载，并手动 stub 掉 `ListItem`，我们可以简单的使用 `shallowMount`，它只会渲染顶层组件，默认会自动 stub 掉任何子组件。

```js
import List from 'src/components/List.vue'
import ListItem from 'src/components/ListItem.vue'
test('stubbing ListItem', () => {
  const wrapper = shallowMount(List, {
    slots: {
      defalut: ListItem,
    },
  })
})
console.log(wrapper.html()) // <ul><listitem-stub></ul>
const ListItemWrapper = wrapper.findComponent(ListItem)
expect(ListItemWrapper.exists()).toBeTruthy() // 测试通过
expect(ListItemWrapper.text()).toContain('some thing') // 报错
```

注意：`stubbed` 后的组件就不可以再查找其中元素或触发事件，因为是模拟的，内部元素和方法都被 `stubbed out`了，所以会报错。

上述这种直接传入组件`defalut: ListItem` 作为默认插槽的使用情形是比较受限的。如果当 `ListItem` 组件定义了 prop 来渲染内容时，这种方式就会导致测试报错：`[Vue warn]: Missing required prop: "xxx"`

此时，可以像下面这种方式解决：

```js
import List from 'src/components/List.vue'
import ListItem from 'src/components/ListItem.vue'
test('stubbing ListItem', () => {
  const ListItemWrap = {
    render(h) {
      return h(ListItem, { props: { item: 'something' } })
    },
  }
  const wrapper = shallowMount(List, {
    slots: {
      defalut: ListItemWrap,
    },
  })
})
console.log(wrapper.html()) // <ul><listitem-stub></ul>
const ListItemWrapper = wrapper.findComponent(ListItem)
expect(ListItemWrapper.exists()).toBeTruthy() // 测试通过
```

使用 shallowMount 测试会很有用，建议默认使用 shallowMount 挂载组件。

### 模拟父组件

有时我们会在子组件中调用父组件的某些方法或属性，但在测试时我们没必要把父组件也包裹进来用于测试渲染。这时就可以利用测试套件提供的 `parentComponent` 选项。

```js
test('parent component', () => {
  const wrapper = shallowMount(Component, {
    parentComponent: Foo,
  })
  expect(wrapper.vm.$parent.$options.name).toBe('foo')
})
```

### 函数式组件

若一个组件只用于将父组件传入的数据进行渲染，则推荐使用函数式组件来提升 vue 的性能。

函数式组件的特点：

- 所有动态数据都从父组件传递进来（只有 props）
- 内部没有逻辑交互（无 methods 方法、也没有 mounted 等任何生命周期处理函数）
- 没有状态修改(无 data，即没有响应式数据)
- 也没有实例 (没有 this 上下文)

例如上面的列表渲染组件就很适合作为函数式组件使用。

定义一个函数式的单文件组件，只需要在 `template` 标签添加 `functional` 属性即可。

> 在 2.3.0 之前的版本中，如果一个函数式组件想要接收 prop，则声明 props 选项是必须的。
> 在 2.3.0 或以上的版本中，你可以省略 props 选项，所有组件上的 attribute 都会被自动隐式解析为 prop，并作为模板里默认可解析的 props 对象的属性。

```vue
<template functional>
  <ul>
    <li
      v-for="(item, index) in props.items"
      :key="index"
      @click="props.itemClick(item)"
    >
      {{ item }}
    </li>
  </ul>
</template>
```

实际 Vue 为函数式单文伯组件模板默认提供了上下文 context 对象。如果使用组件对象可以更直观看到 context 的定义：

```js
const List = {
  functional: true,
  render(h, context) {
    const { items, itemClick } = context.props
    const ListItems = items.map((item, index) => {
      return h(
        'li',
        {
          key: index,
          on: {
            click: () => itemClick(item),
          },
        },
        item
      )
    })
    return h('ul', {}, ListItems)
  },
}
```

这个 `context` 对象，提供了以下属性可供使用：

```
context = {
  props：提供所有 prop 的对象
  children：VNode 子节点的数组
  slots：一个函数，返回了包含所有插槽的对象
  scopedSlots：(2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
  data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件，注意不要跟组件声明中的 data 属性搞混。
  parent：对父组件的引用
  listeners：(2.3.0+) 一个包含了所有父组件为当前组件注册的事件监听器的对象。这是 data.on 的一个别名。
  injections：(2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的 property。
}
```

所以对于函数式组件的测试，`@vue/test-utils` 测试套件对函数式组件加载也提供了 `context` 选项。

```js
describe.only('functional component', () => {
  const List = {
    functional: true,
    render(h, context) {
      const { items, itemClick } = context.props
      const ListItems = items.map((item, index) => {
        return h(
          'li',
          {
            key: index,
            on: {
              click: () => itemClick(item),
            },
          },
          item
        )
      })
      return h('ul', {}, ListItems)
    },
  }

  test('render funcaional', () => {
    const wrapper = mount(List, {
      context: {
        props: {
          items: ['a', 'b', 'c'],
          itemClick: jest.fn(),
        },
      },
    })
    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  test('render funcaional event', async () => {
    const mockFn = jest.fn()
    const wrapper = mount(List, {
      context: {
        props: {
          items: ['a', 'b', 'c'],
          itemClick: mockFn,
        },
      },
    })
    await wrapper
      .findAll('li')
      .at(1)
      .trigger('click')
    expect(mockFn).toHaveBeenCalledWith('b')
  })
})
```
