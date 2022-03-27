# 服务端渲染单元测试

## 什么是服务端渲染

服务端渲染（Server Side Rendering)，是指把应用程序的 HTML 文件先在服务端进行渲染后再返回给客户端。

现在流利的 SPA 应用程序请求服务端返回的都是一个简单的 HTML 骨架，核发页面内容和逻辑都是由请求的 js 文件在客户端渲染生成。大概是这样一个过程：

```
服务端用HTML骨架响应请求 --> 浏览器下载 js 文件 --> 浏览器执行返回的 js 文件 --> Vue 渲染应用程序（出现页面内容并可交互）
```

而服务端的渲染的过程：

```
服务器使用 Vue 生成页面 HTML --> 服务器使用完成渲染的 HTML 页面响应请求（此时即可看到页面，但不可交互) --> 浏览器下载 js 文件 --> 浏览器执行 js 文件 --> Vue 激活 hydrate 页面（页面可交互）
```

## SSR 的优缺点

优点：

- 因为有页面有完整的 HTML 结构，所以改善了搜索引擎的优化 SEO
- 加快了内容的生成时间，使用户更快看到页面

缺点：

- SSR 会使应用程序代码更复杂，因为要在同一个程序中同时编写客户端和服务器端的兼容代码
- SSR 需要服务器，并且会增加服务器负载，因为需要在服务器端进行页面渲染

## SSR 的单元测试

测试最基本的准则是提供输入，断言输出。服务端渲染组件输出的内容几乎都是一个字符串，所以测试 SSR 渲染组件的相对简单：

提供一个输入的组件，然后断言该组件生成的字符串是否包含了正确的 HTML 字符串，或者匹配了已有的快照。

无法使用 `@vue/test-utils` 测试套件去测试服务端渲染的组件，因为该测试套件运行依赖浏览器环境，即内部默认使用类浏览器的 `jsdom` 来渲染。所以需要使用 `@vue/server-test-utils`。它导出了两个挂载组件的方法`renderToString / render`

- `renderToString` 返回一个已经渲染的 HTML 字符串
- `render` 返回一个 Cheerio 包装对象。Cheerio 是 jQuery API 的 Node 实现，基本遵循 jQuery 的方式查找元素。

另外，在进行 SSR 单元测试前，需要设置 Jest 测试文件的运行环境为 node 环境。因为 Jest 默认会在模拟浏览器的 jsdom 环境中运行测试，这使得我们可以在测试文件中直接使用类似 `window / document` 等 web API，但在服务器端测试时，会提示这些变量 undefined，无法使用这些全局变量。

设置 node 环境的方式：

- 在文件顶部添加设置说明：

```js
/**
 * @jest-environment node
 */
```

- 命令中设置运行环境 `jest --env=node`

### renderToString

`renderToString` 返回一个已经渲染的 HTML 字符串，所以可以使用字符串相关的断言器。

```js
import { renderToString } from '@vue/server-test-utils'
import ListItem from 'src/components/ListItem'

test('render to string on server', () => {
  const ListItemStr = renderToString(ListItem, {
    propsData: {
      item: { id: 1, name: 'Tom' },
    },
  })

  expect(ListItemStr).toContain('<li>Tom</li>')
})
```

### render

`render` 返回一个 `Cheerio` 包装对象。

- `Cheerio` 是 `jQuery API` 的 `Node` 实现，基本遵循 `jQuery` 的方式查找元素。
- 但在 `@vue/server-test-utils`测试套件中提供返回的 Cherrio 包装对象，基本与 `DomWrapper` 使用一样的 API。

```js
import { render } from '@vue/server-test-utils'
import ListItem from 'src/components/ListItem'

test('render on server', () => {
  const ListItemWrapper = render(ListItem, {
    propsData: {
      item: { id: 1, name: 'Tom' },
    },
  })

  expect(ListItemWrapper.find('li').text()).toBe('Tom')
})
```
