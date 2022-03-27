# 测试 Vue-Router

由于路由通常会把多个组件牵扯到一起操作，所以一般对其功能的测试都会等到端到端的集成测试阶段进行，不过，对组件中使用到的部分路由功能做一些单元测试还是大有裨益的。

组件与路由的交互主要存在：

- `$route` 对象包含了当前匹配路由的信息，对它的主要测试项在于动态路由参数、路由的查询参数是否符合预期。
- `$router` 对象包含了控制路由跳转的方法，对它的主要测试在于模拟它的跳转方法，断言其方法是否调用。至于真实的路由跳转可以放在集成测试中实现。
- `RouterLink` 组件主要在于测试其 `to` 属性值是否正确。

## 使用 router 实例测试

```vue
<!-- App.vue -->
<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
}
</script>

<!-- About.vue -->
<template>
  <div>用户ID：{{ userId }}</div>
</template>
<script>
export default {
  name: 'About',
  computed: {
    userId() {
      return this.$route.params.id
    },
  },
}
</script>
```

创建路由

```js
// routes.js
import About from 'src/components/About.vue'
export default [
  {
    path: '/user/:id', // 动态路由
    component: About,
  },
]
```

在真实项目代码中，会在 `main.js` 中注册路由

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'

Vue.use(VueRouter)

const router = new VueRouter({ routes })
new Vue({
  el: '#app',
  router,
})
```

同前面 `vuex` 所廛的**测试泄露**问题一样，在测试文件，为了避免 `Vue.use(VueRouter)`污染测试用例共享的全局唯一 Vue 基础构造函数，我们应该使用`@vue/test-utils`测试套件提供的 `createLocalVue` 函数创建本地的 Vue 副本来注册全局依赖。

所以为了测试 `About` 组件渲染时是否得到了预期的动态参数，编写如下单元测试

```js
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import App from 'src/App.vue'
import About from 'src/components/About.vue'
import routes from '@/routes.js'

describe('About.vue', () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)

  it('renders About via routing', async () => {
    expect.assertions(2)
    const router = new VueRouter({ routes })
    const wrapper = mount(App, {
      localVue,
      router,
    })

    router.push('/user/1')
    await wrapper.vm.$nextTick() // 等待异步渲染完成

    const About = wrapper.find(About)
    expect(About.exists()).toBe(true)
    expect(About.text()).toContain('1')
  })
})
```

这里有两个注意点：

- 用了 `mount` 而非 `shallowMount`。如果用了 `shallowMount`，则 `<router-view>` 就会被忽略，不管当前路由是什么，渲染的其实都是一个无用的 stubted 后的组件`routerveiw-stub`。
- 使用异步测试 `await wrapper.vm.$nextTick()`，需要异步等待应用渲染后再断言

正因为需要注意上面两个注意的方面，会导致测试用例依赖过于复杂。像上面这样使用 `mount` 渲染整个 APP 组件时，正赶上渲染树很大，包含了许多组件，一层层的组件又有自己的子组件。这些个子组件都要触发各种生命周期钩子、发起 API 请求什么的之类的场景。所以这种测试范围都属于集成测试，在 e2e 测试框架内完成。

所以上面这种将整个 router 实例作为单元测试的方式并不可能采用。更多的是使用测试套件提供的 `mocks` 挂载选项来模拟全局的 `$route / $router` 属性来测试。

## mock 路由对象 route 测试

对于 `About` 组件的测试断言是：输入一个能解析到动态路由参数的对象，输出是在组件内视图渲染出预期的动态参数。

将上面例子改用下面的测试代码:

```js
import About from 'src/components/About.vue'
describe('About.vue', () => {
  test('render id param', () => {
    const mockRoute = {
      $route: {
        params: {
          id: 123,
        },
      },
    }
    const wrapper = shallowMount(About, {
      mocks: MockRoute,
    })

    expect(wrapper.text()).toContain('123')
  })
})
```

可以看到测试代码比使用 router 实例时简洁了许多。

## mock 路由器对象 router 测试

`$router` 对象包含了控制路由跳转的方法，对它的主要测试在于模拟它的跳转方法，断言其方法是否调用。至于真实的路由跳转功能可以放在集成测试中实现。

跟上面 `$route` 测试一样，没有必要创建一个真实的路由器实例来测试 `$router.push` 之类的方法，同样可以使用 `mocks` 来模拟方法，并断言模拟方法的执行和入参。

改造一下 `About` 组件，增加一个能跳转首页的按钮。

```vue
<!-- About.vue -->
<template>
  <div>
    <span>用户ID：{{ userId }}</span>
    <button @click="goHome">首页</button>
  </div>
</template>
<script>
export default {
  name: 'About',
  computed: {
    userId() {
      return this.$route.params.id
    },
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    },
  },
}
</script>
```

结合上一个单元测试代码，对代码重构为：

```js
import About from "src/components/About.vue"
describe('About.vue', () => {

  // 生成模拟数据
  const mockObj = {
    $route: {
      parmas: {
        id: 123,
      },
    },
    $router: {
      push: jest.fn()
    }
  }

  const wrapper = shallowMount(About, {
    mocks: mockObj,
  })

  test('render id param', () => {
    expect(wrapper.text()).toContain('123')
  })
  test('calls $router.push("/home") when button is clicked', async () => {
    const btn = wrapper.find('button')
    await btn.triiger('click')
    expect(mockObj.$router.push).toHaveBeenCalledWith('/home')
  })
)}
```

## 测试 RouterLink 组件

在 `VueRouter` 中进行路由跳转，除了像上面调用`$router.push`的编程式导航外，还提供了`<router-link>`的组件式导航。

比如上述跳转到首页可以写成：

```html
<!-- About.vue -->
<template>
  <div>
    <span>用户ID：{{userId}}</span>
    <!-- <button @click="goHome">首页</button> -->
    <router-link to="/home">首页</router-link>
  </div>
</template>
```

要测试这个组件链接是否有效，常规下会有以下两种操作：

第一种：以创建 `router` 实例，并且使用 `mount` 渲染 `About` 组件，因为 `router-link` 组件最终会被渲染成 `<a href="/home">首页</a>`，所以通过 find 选择器查找 a 标签，断言 a 元素的 href 属性是是否正确。但因为同样的原因，实例测试中会尽量避免使用 mount 挂载组件。
第二种：使用㳀渲染 `shallowMount` 挂载 `About` 组件，如果是普通子组件，我们可以通过 `findComponent(com).props('to').toBe('/home')` 进行断言。但这里的问题是我们没有办法可以获取到 `RouterLink` 组件构造器，所以无法用它作为 `findComponent` 函数的入参来进行断言。

解决办法就是 `@vue/test-utils` 提供了一个 `RouterLinkStub` 对象可以完全模拟 `RouterLink`。

```js
import { shallowMount, RouterLinkStub } from '@vue/test-utils
import About from 'src/components/About.vue'

describe('RouterLink', () => {
  test('renders RouterLink', () => {
    const wrapper = shallowMount(About, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    })
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/home')
  })
})
```

`stubs`挂载选项告诉了`shallowMout`如何模拟内部子组件的渲染。

比如，前面在讲 `mount / shallowMount` 挂载包含子组件的组件时渲染结果区别时，在存在子组件的情况下，`shallowMount`挂载会自动将子组件渲染成存根组件`componentname-stub`。

这一行为相当于：

```js
shallowMount(Component, {
  stubs: {
    childComponent: true, // 默认存根是 `<${component name }-stub>`
  },
})
```

当然你也可以传入一个特定的实现作为存根，即告诉 shallowMount 挂载组件时对某子组件以`stubs`中指定的映射来实现。

```js
import Foo from './Foo.vue'
shallowMount(Component, {
  stubs: {
    childComponent: Foo, // 指定内部子组件 childComponent 以 Foo 组件来模拟。
  },
})
```

所以上述路由导航组件的设置 `RouterLink: RouterLinkStub` 即表明内部的 `RounterLink` 使用模拟的 `RouterLinkStub` 来存根，这样我们对真实 `RouterLink` 的断言可以转嫁到 `RouterLinkStub` 模拟组件上。`RouterLinkStub` 基本提供了 `RouterLink` 属性和方法一致的实现。

## 总结

- 不建议创造真实的 router 实例来进行单元测试，它的功能应该在集成测试中进行。
- 使用 `mocks` 来模拟 `$route / $router` 对象进行断言。
- 通过 `stubs` 选项配置路由导航 `RouterLink` 的模拟组件 `RouterLinkStub` 来进行断言。
