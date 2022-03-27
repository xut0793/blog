# 前端接口 mock 数据

[[toc]]

## Wath: 什么是接口 Mock 数据

> 接口 Mock 数据，说白话就是使用“假”数据模拟接口请求的返回数据。

Mock 指是前端在完成静态页面搭建后，此时需要联调后端接口时，后端接口尚未开发完成，还无法联调时，前端可以先按照事先与后端约束好的数据结构（API 接口文档）来模拟接口数据完成功能开发，实现真正意义上的前后端分离。

## Why：为什么需要接口 Mock 数据

现在 Web 开发普遍都切换到了前后端分离的开发模式，我们经常会遇到如下的尴尬场景：

前端同学自己参照ui设计图，完成对应的静态页面（没有数据交互），需要等待后端同学完成接口服务，再进行二次开发，完成前端端接口联调，导致前端开发进度严重依赖于后端开发进度。

实现接口 mock 在此时就发挥出了巨大价值：

- 团队可以并行工作，不会出现一个团队等待另一个团队的情况
  - 有了Mock，前后端人员只需要定义好接口文档就可以开始并行工作，互不影响，只在最后的联调阶段往来密切；
  - 后端与后端之间如果有接口耦合，也同样能被Mock解决；
  - 测试过程中如果遇到依赖接口没有准备好，同样可以借助Mock；
- 隔离系统
  - 假如我们需要调用一个post请求，为了获得某个响应，来看当前系统是否能正确处理返回的“响应”，但是这个post请求会造成数据库中数据的污染，那么就可以充分利用Mock，构造一个虚拟的post请求，我们给他指定返回就好了。
- 演示 DEMO
  - 假如我们需要创建一个演示程序，并且做了简单的UI，那么在完全没有开发后端服务的情况下，也可以进行演示。
  - 假如你已经做好了一个系统，并且需要给客户进行演示，但是里面有些真实数据并不想让用户看到，那么同样，你可以用Mock接口把这些敏感信息接口全部替换。
- 测试覆盖率
  - 假如有一个接口，有100个不同类型的返回，我们需要测试它在不同返回下，系统是否能够正常响应，但是有些返回在正常情况下基本不会发生，难道你要千方百计地给系统做各种手脚让他返回以便测试吗？比如，我们需要测试在当接口发生500错误的时候，app是否崩溃，别告诉我你一定要给服务端代码做些手脚让他返回500 。而使用mock，这一切就都好办了，想要什么返回就模拟什么返回，再也不用担心测试覆盖率了。


## How：如何实现接口 Mock 数据

前端 Mock 主要包括以下几种实现方式：

### 1. 硬编码

硬编码即在前端代码中直接写死数据，通过注释切换 Mock 请求与真实请求。
```js
function getUser(id) {
  return { username: 'mock username', id: 100 }; // 本地调试时使用模拟数据
  // return axios.get('/user', { params: { id } }); // 部署时使用真实请求
}
```

- 优热：这种Mock方法操作比较简单，易于操作。
- 劣势：
  - 但缺点也很明显，就是 Mock 更改了代码逻辑，和代码耦合性太强，对业务代码侵入性太大。
  - 并且不能模拟真实的网络请求的过程，局限性强，覆盖面窄。


### 2. 前端拦截 mock.js

前端拦截即在请求真正发送前进行拦截，返回模拟数据。典型的解决方案是使用 Mock.js，通过在业务代码前挂载该JS文件，就可以无痛拦截Ajax请求。

### 3. 后端拦截，开发 Mock Server

最合适的方案无外乎搭建独立的 Mock-Server。

几种主要的思路方案：
- 利用 webpack-dev-server 已经启动的 express 服务，通过它 before 钩子函数，注册实现 mock 功能的中间件。然后建立模拟路由的配置文件，在中间件中拦截请求路由到模拟路由的映射。（weapck-api-mocker）
- 独立启动本地 mock 服务，通过 webpack-dev-server 的 proxy 功能将请求代理转发到本地 mock 服务。至于创建服务器程序可以使用 express 或 koa，甚至极简的 json-server。（MockWebpackPlugin）

其中服务器中假数据的生成仍然可以选择 `Mockjs` 或 `Fake.js`

> 生成 json 模式的模拟数据常用的除了 Mock.js，还有 Fake.js。

## Mock.js 基本使用

Mock.js因为两个重要的特性使其流行:

- 数据类型丰富：支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。
- 拦截 Ajax 请求：不需要修改既有代码，就可以拦截 Ajax 请求，返回模拟的响应数据。安全又便捷。

### 安装
```
npm i -D mockjs
```
### API
最主要的 API：`Mock.mock(url?, type?, template | function(options))`

|      参数名       |          参数需求           |                                                            参数描述 | 例子                                            |
| :---------------: | :-------------------------: | ------------------------------------------------------------------: | :---------------------------------------------- |
|        url        | 可选: URL 字符串或 URL 正则 |                                                      拦截请求的地址 | /api/users                                      |
|       type        |            可选             |                                                   拦截Ajax 请求类型 | GET、POST                                       |
|     template      |     可以是对象或字符串      |                                            生成数据的模板或 @占位符 | `{'data|1-10':['mock'] }`、`'@EMAIL'`           |
| function(options) |   函数返回值作为响应数据    | options 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性 | `Mock.mock( url, type, function( options ){} )` |

```js
Mock.mock( template ) // 根据数据模板生成模拟数据。
Mock.mock( url, template ) // 当拦截到匹配 rurl 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。
Mock.mock( url, type, template ) // 当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。
Mock.mock( url, function( options ){} ) // 当拦截到匹配 rurl 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。
Mock.mock( url, type, function( options ){} ) // 当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。
```

### 数据模板 template
其中定义假数据模式的 template 语法 `'name|rule': value`

数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：
```js
'name|rule': value
// 属性名   name
// 生成规则 rule, 可选
// 属性值   value 或者 @占位符
```
其中 生成规则 的含义需要依赖具体属性值的类型才能确定：
```js
生成规则 有 7 种格式：
'name|min-max': value
'name|count': value
'name|min-max.dmin-dmax': value
'name|min-max.dcount': value
'name|count.dmin-dmax': value
'name|count.dcount': value
'name|+step': value
```
或者省略生成规则，在属性值 value 中直接使用 `@占位符` 生成模拟数据

```js
Mock.mock('name|7-10': 'tom') // {"name": "RXhJ%M4RK"}
Mock.mock({'name': @string(7, 10)) // {"name": "RXhJ%M4RK"}
Mock.mock({'name': Mock.Random.string(7, 10)) // @占位符是对应 Mock.Random 函数方法的简写
```
> 具体模板和占位符规则见 [Mock 语法规范](https://github.com/nuysoft/Mock/wiki/Syntax-Specification#%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF%E5%AE%9A%E4%B9%89%E8%A7%84%E8%8C%83-dtd)


### Vue项目的应用

1. 建立 mock 目录
```js
|- src
  |- api
    |- axios.js
    |- __api_test__
      |- user.http
    |- __api_mock__ // 区别于单元测试的模拟数据目录 /tests/__mock__
      |- index.js
      |- user.js
```
2. 定义 mock 模板数据
```js
// user.js
const getUserList = {
  url: '/api/users',
  method: 'get',
  template: {
    code: 200,
    'data|1-10': [
      {
        'id|+1': 1,
        'name': '@cname',
        'age|18-30': 18,
        'gender|1': ['male', 'female'],
      },
    ],
  },
}

export default {
  getUserList,
}
```
3. 注册 mock 数据
```js
// __api_mock__/index.js
import Mock from 'mockjs'
import user from './user.js'

const modelArr = [user]

function initMock(obj) {
  for (const key of Object.keys(obj)) {
    const item = obj[key]
    Mock.mock(item.url, item.method || 'get', item.template)
  }
}

for (const model of modelArr) {
  initMock(model)
}

// main.js
import './api/__api_mock__/index.js'
```
4. 页面内正常使用
```vue
<template>
  <div>
    <div>
      <button @click="onBtnClick">请求模拟数据</button>
    </div>
    <p>返回的数据</p>
    <ul>
      <li style="text-align: left; color: orange" v-for="user in userList" :key="user.id">
        <span v-for="(value, key) in user" :key="key">
          {{ key }}: {{ value }}&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      userList: [],
    }
  },
  methods: {
    async onBtnClick() {
      const res = await this.axios.get('/api/users')
      const userList = res.data || []
      this.userList = userList.data
    },
  },
}
</script>
```
5. 优化

- 5.1 配置独立的 mock 环境

上面配置基本满足本地 Mock 数据的开发啦，但如果开发完成要接口联调时，我们不得不对 `main.js` 文件中对应的代码进行注释。为了更好的实现区分开发和 mock，可以通过配置一个独立的 mock 环境来优化开发过程。

1)、新建`.env`环境文件，增加 `VUE_APP_MOCK` 环境变量
> .env 环境文件是在 @vue/cli4 中支持，之前的脚手架项目可以通过 cross-env 在 run-script 中设置
> mock: cross-env NODE_ENV=mock webpack server
```
# .env.mock
NODE_ENV=development
VUE_APP_MOCK=true
```
2)、 修改 main.js 文件
```
// main.js
- import './api/__api_mock__/index.js'
+ if (process.env.VUE_APP_MOCK) {
+  import('./api/__api_mock__/index.js')
+}
```
3)、增加 mock 运行命令

`@vue/cli 4.x` 会通过 `--model mock` 匹配到 `.env.mock` 文件
```json
"scripts": {
  "serve": "vue-cli-service serve",
  "mock": "vue-cli-service serve --mode mock",
}
```
- 5.2 配置开关当前 mock 接口
即使在 mock 环境中，如果只是需要模拟部分接口，让其它接口仍然通过真实的网络请求返回。此时我们可以在模拟的模板文件中增加一个配置项 `enabled`。

```js
// user.js
const getUserList = {
  enabled: true, // true or false
  url: '/api/users',
  method: 'get',
  template: {
    code: 200,
    'data|1-10': [
      {
        'id|+1': 1,
        'name': '@cname',
        'age|18-30': 18,
        'gender|1': ['male', 'female'],
      },
    ],
  },
}

export default {
  getUserList,
}
```
修改 mock 注册逻辑
```
// api/__api_mock__/index.js
import Mock from 'mockjs'
import user from './user.js'

const modelArr = [user]

function initMock(obj) {
  for (const key of Object.keys(obj)) {
    const item = obj[key]
+    if (!item.enabled) continue
    Mock.mock(item.url, item.method || 'get', item.template)
  }
}

for (const model of modelArr) {
  initMock(model)
}
```
#### 总结

- 优势：这种 Mock.js 方式相较于硬编码，虽然实现了Mock与代码的部分解耦。
- 劣势：
  - 仍然无法完全和业务代码解耦，因为必须引入 Mock.js 运行时，并且进行 Mock 配置。
  - 虽然提供了大量的Mock API，但是也仍然无法发出真实的网络请求，模拟真实度不够。
  - mock.js 的实现是因为它对XHR对象进行了改写，有些情况下兼容性并不好，比如IE8等低版本浏览器，还有较新的Fetch API也拦截不到。




## Mock Server

最合适的方案无外乎搭建独立的 Mock-Server。

几种主要的思路方案：
- 利用 webpack-dev-server 已经启动的 express 服务，通过它 before 钩子函数，注册实现 mock 功能的中间件。然后建立模拟路由的配置文件，在中间件中拦截请求路由到模拟路由的映射。（weapck-api-mocker）
- 独立启动本地 mock 服务，通过 webpack-dev-server 的 proxy 功能将请求代理转发到本地 mock 服务。至于创建服务器程序可以使用 express 或 koa，甚至极简的 json-server。（MockWebpackPlugin）

json 假数据的生成仍然可以选择 `Mockjs` 或 `Fake.js`

### 1 webpack-dev-server 的 before 钩子函数中注册 Mock 中间件

webpack-dev-server 内部是通过启动 express 服务来实现，并且 devServer 配置中 before 钩子函数中对外暴露了 app 实现。

```js
// vue.config.js
const path = require('path')
const APIMocker = require('./src/api/mock_before/index')
const noop = () => {}

module.exports = {
  lintOnSave: false,
  devServer: {
    hot: true,
    before: process.env.VUE_APP_MOCK
        // 提供了一个在 devServer 内部所有中间件执行之前的自定义执行函数
      ? function (app) {
          APIMocker(app, path.resolve(__dirname, './src/api/mock_before/config.js'))
        }
      : noop,
  },
}
```
配置模板数据
```js
// ./src/api/mock_before/config.js
module.exports = {
  baseUrl: '/api',
  proxy: {
    '/api/users': {
      url: '/api/users',
      method: 'get',
      template: {
        code: 200,
        'data|1-10': [
          {
            'id|+1': 1,
            name: '@cname',
            'age|18-30': 18,
            'gender|1': ['male', 'female'],
          },
        ],
      },
    },
  },
}
```
现在来实现 APIMocker 函数
```js
// ./api/mock_before/index.js
const fs = require('fs')
const url = require('url')
const Mock = require('mockjs')

function mock(app, _config, _proxy) {
  let config = {}

  if (typeof _config === 'string') {
    const fileExist = fs.existsSync(_config)

    if (!fileExist) {
      console.warn(`cannot matching mock config path: ${_config}`)
      return
    }

    config = require(_config)
  } else if (Object.prototype.toString.call(_config) === '[object Object]') {
    config = _config
  } else {
    console.warn(`cannot resolve mock config: ${_config}`)
    return
  }

  if (Object.prototype.toString.call(_proxy) === '[object Object]') {
    config.proxy = Object.assign({}, config.proxy || {}, _proxy)
  }

  // 将路径挂载在中间件函数的属性上，以便在函数内部获取 const config = arguments.callee.config
  mockMiddleware.config = config
  app.use(config.baseUrl || '/', mockMiddleware)
}

function mockMiddleware(req, res, next) {
  // 只对 XHR 请求进行模拟，避免静态文件也匹配到这里逻辑。
  // 需要保证封装的 axios 实例中添加配置 headers: {'X-Requested-With': 'XMLHttpRequest'}
  // req.xhr = {get() {this.header['x-requested-with'] === 'XMLHttpRequest'}}
  if (!req.xhr) return next()

  const config = arguments.callee.config
  const proxy = config.proxy
  const genUniqueKey = config.genUniqueKey || _genUniqueKey
  const mockPaths = []

  for (let path of Object.keys(proxy)) {
    const uniqueKey = genUniqueKey(path, req)
    mockPaths.push(uniqueKey)
  }

  // app.use('/api', middleware) 时，/api/users 解析出的 req.url = '/users'，不可用; req.originalUrl = '/api/users'
  const pathname = url.parse(req.originalUrl).pathname // 去除url 上的查询参数和哈希
  const uniqueKey = genUniqueKey(pathname, req)

  if (!mockPaths.includes(uniqueKey)) return next()

  const mockResponse = proxy[pathname]
  const mockResData = Mock.mock(mockResponse.template)
  res.status(mockResponse.statusCode || 200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(mockResData))
}

function _genUniqueKey(path, req) {
  const method = req.method || 'get'
  return `${path}__${method.toLowerCase()}`
}

module.exports = mock
```

插件 `webpack-api-mocker` 就是利用这个原理实现的。

### 2 webpack-dev-server 的 proxy 属性实现请求代理到 mock server

webpack-dev-server 提供了另一个重要功能就是接口代理`proxy`，它主要用于：
- 本地跨越请求代理
- 前后端接口联调
- 前端接口 mock

利用它进行接口 mock 需要我们在本地开启一个代理服务，然后利用 `proxy` 属性将配置的代理接口转发到此代理服务上。`proxy` 内部实现依赖于 `http-proxy-middleware` 和 `http-proxy` 包。

创建一个本地 node HTTP 服务，选择有很多，可以利用 `express / koa` 等专业完整的服务端 web 框架。也可以选择基于 express 开发简单的 `json-server` 部署本地代理服务。

`json-server` 可以直接把一个json文件托管成一个具备全RESTful风格的API,并支持跨域、jsonp、路由订制、数据快照保存等功能的 web 服务器。

> [json-server 详解](https://www.jianshu.com/p/87f9829dc516)

1. 开启 json-server 本地服务

安装
```
npm install -D json-server
```
创建的模板数据
```js
// src/api/mock_proxy/db.js
const Mock = require('mockjs')
const db = Mock.mock({
  'users|30': [
    {
      'id|+1': 1,
      name: '@cname',
      'age|18-30': 18,
      'gender|1': ['male', 'female'],
    },
  ],
})

// 如果使用 Js 文件，则必须导出一个函数
module.exports = () => db
```
配置路由
```json5
// 路由 routes.json
{
  "/api/*": "/$1", // /api/users => /users
  "/users/:id": "/users/:id",
}
```
添加配置文件
```json5
// json-server.json 配置文件
{
  "port": 9999,
  "watch": true,
  "read-only": false,
  "no-cors": false,
  "no-gzip": false,
  "routes": "./src/api/mock_proxy/routes.json"
}
```
添加启动命令
```json
"json-server": "json-server --config=./src/api/mock_proxy/json-server.json ./src/api/mock_proxy/db.js",
```
启动服务
```
npm run json-server
```

2. 配置项目代理
```js
// vue.config.js
module.exports = {
  lintOnSave: false,
  devServer: {
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9999', // json-server 的服务地址
      },
    },
  },
}
```
修改业务代码
```vue
<template>
  <div class="hello">
    <div>
      <button @click="getAllUser">所有用户</button>
      <button @click="getUserByID">id=8的用户</button>
    </div>
    <p>返回的数据</p>
    <ul>
      <li style="text-align: left; color: orange" v-for="user in userList" :key="user.id">
        <span v-for="(value, key) in user" :key="key">
          {{ key }}: {{ value }}&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </li>
    </ul>
    <p>用户ID=8</p>
    {{ user }}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      userList: [],
      user: {},
    }
  },
  methods: {
    async getAllUser() {
      const res = await this.axios.get('/api/users')
      const userList = res.data || []
      this.userList = userList
    },
    async getUserByID() {
      const id = 8
      const res = await this.axios.get(`/api/users/${id}`)
      const user = res.data || {}
      this.user = user
    },
  },
}
</script>
```
此时两个服务都开启，即可正常请求返回数据。

### 优化

上述的插件的问题是在开启模拟时，需要同时启动本地开发服务和模拟服务，这一步可以封装一个 webpack 插件来实现一步启动两个服务。

1. 将 json-server 服务封装成 webpack 插件，随项目一起启动
```js
// MockWebpackPlugin
const jsonServer = require('json-server')

function validateType(target) {
  if (typeof target === 'string') return 'string'
  if (typeof target === 'function') return 'function'
  if (Object.prototype.toString.call(target) === '[object Object]') return 'object'
  return 'invalid'
}

class Server {
  constructor(config) {
    const { host, port, db, routes } = config

    if (!db) {
      throw new Error('config db is required!')
    }

    this.host = host || 'localhost'
    this.port = port || '9999'
    this.db = this.resolve(db)
    this.routes = routes ? this.resolve(routes) : null

    const server = jsonServer.create()
    const router = jsonServer.router(this.db)
    const middlewares = jsonServer.defaults()

    if (this.routes) {
      server.use(jsonServer.rewriter(this.routes))
    }
    server.use(middlewares)
    server.use(router)
    this.server = server
  }
  start(port) {
    port ? (this.port = port) : null
    this.server.listen(this.port, this.host, () => {
      console.log(`JSON Server is running in ${this.host}:${this.port}`)
    })
  }
  resolve(target) {
    switch (validateType(target)) {
      case 'string': {
        try {
          const filePath = require.resolve(target)
          const source = require(filePath)
          return this.resolve(source)
        } catch (error) {
          throw new Error(`cannot be found module from ${target}`)
        }
      }
      case 'function':
        return target()
      case 'object':
        return target
      default:
        throw new Error(`Not a valid configuration property`)
    }
  }
}

module.exports = class MockWebpackPlugin {
  constructor(config) {
    this.server = new Server(config)
  }
  apply(compiler) {
    const server = this.server
    // webpack 插件可以按照它所注册的事件分成不同的类型。每一个事件钩子决定了它该如何应用插件的注册。
    compiler.hooks.emit.tapAsync('MockWebpackPlugin', (compilation, callback) => {
      server.start()
      callback()
    })
  }
}
```
将 json-serve.json 配置项转成插件的配置项
```js
// mockServerConfig.js
const path = require('path')
module.exports = {
  host: 'localhost',
  port: 9999,
  db: path.resolve(__dirname, './db.js'),
  routes: path.resolve(__dirname, './routes.json'),
}

```
修改项目配置
```js
// vue.config.js
const mockServerCofnig = require('./src/api/mock_proxy/mockServerConfig.js')
const MockWebpackPlugin = require('./src/api/mock_proxy/mockWebpackPlugin.js')
const prefix = mockServerCofnig.proxyPrefix || '/api'
const _proxy = mockServerCofnig.proxy || {
  target: `http://${mockServerCofnig.host}:${mockServerCofnig.port}`,
}
module.exports = {
  lintOnSave: false,
  devServer: {
    hot: true,
    // 可以这里配置，也可以使用下面 chainWebpack 配置
    // proxy: {
    //   [prefix]: _proxy,
    // }
  },
  chainWebpack: (config) => {
    config.when(process.env.VUE_APP_MOCK === 'true', config => {
      config.plugin('MockWebpackPlugin').use(MockWebpackPlugin, [mockServerCofnig])
      config.devServer.proxy({
        [prefix]: _proxy,
      })
  });
  },
}
```
这也是网上 [mock-webpack-plugin](https://github.com/MarxJiao/mock-webpack-plugin) 插件的实现原理，它使用 express 启动模拟服务。

像上面在项目配置中，与插件功能实现息息相关的 proxy 还是需要手动配置到 vue.config.js 中，可以进一步把这块操作优化下，创建一个 vue-cli 插件来实现。

编写一个可以修改 webpack 配置文件的 vue-cli-service 插件 vue-cli-plugin-xx ，插件实现很简单，就是一个 js 文件导致一个函数，函数接受两个入参 api 和 options。

> api 是一个对象，基本能操作的属性同 vue.config.js 暴露出来的可配置属性一致。
```js
// ./src/api/mock_proxy/vue-cli-plugin-mock.js
const mockServerCofnig = require('./mockServerConfig.js')
const MockWebpackPlugin = require('./mockWebpackPlugin.js')

const prefix = mockServerCofnig.proxyPrefix || '/api'
const _proxy = mockServerCofnig.proxy || {
  target: `http://${mockServerCofnig.host}:${mockServerCofnig.port}`,
}
module.exports = (api) => {
  api.chainWebpack((webpackConfig) => {
    webpackConfig.plugin('MockWebpackPlugin').use(MockWebpackPlugin, [mockServerCofnig])
    webpackConfig.devServer.proxy({
      [prefix]: _proxy,
    })
  })
}
```
然后在 package.json 增加 vuePlugins 属性，注册 vue-cli-server 插件
```json
"vuePlugins": {
  "service": [
    "./src/api/mock_proxy/vue-cli-plugin-mock.js"
  ]
},
```
重新开启服务，此时本地开发服务和代理服务就都启动了。

2. 实现 mock 配置热重载

不管是基于 webpack-dev-server 的 before 钩子函数，还是 proxy 代理，都存在一个问题：
- 不支持热重载: 每次修改 mock 路由规则，都需要重新启动服务器。

基本思路：
- 将 proxy 规则抽离到单独的配置文件 proxy.config.js 中
- 然后使用 `chokidar` 库监听该配置文件的改动，如果有改动，则深入 webpack-dev-server 源码中利用 `server.setupProxyFeature()` 更新 proxy 规则，并利用 `server.sockWrite(server.sockets, 'content-changed')` 自动刷新浏览器。


### 3 使用第三方 Mock 集成框架直接部署

上面主要讲解了 Mock Server 实现的思路，在个人本地开发可以使用，但如果是项目团队使用，最终要实现一个完善的 Mock Server，并部署到线上持续运行，通常会考虑以下功能：
- 提供模拟数据，这是基本 mock 功能要求
- 提供接口描述，相当于实现了接口文档功能
- 接口测试能力，可以直接在线测试接口请求
- 接口管理：可以按模块创建接口分组、控制团队成员权限等功能
- UI 视图：页面上直接可视化操作
- 支持独立部署
- 支持数据导入或导出，如 swagger json 等

一般公司小团队的项目开发中没有必要从头到尾搭建这样一套功能完善的 mock 系统，所以可以使用开源的第三方 Mock 集成框架直接部署实现。

目前市面上开源的 API 管理框架有：
- postman
- Apizza 与 postman 比较像
- easy mock
- NEI 网易开源
- Yapi 去哪儿网开源，支持独立部署在公司内网
- rap2 阿里开源，在线支持
- Apifox 较新的一个独立应用，集成了接口文档、调试、Mock、自动化测试，支持离线，私有化部署需要付费。[Apifox 使用介绍](https://zhuanlan.zhihu.com/p/141425111)

这里有一篇对上述各种框架的测评文章：
- [接口管理及前端mock数据工具调研](https://github.com/bigbigbo/issue-blog/issues/3)

独立部署教程：
- [YApi 教程](https://yapi.baidu.com/doc/index.html)
- [内网搭建yapi接口管理平台](https://zhuanlan.zhihu.com/p/94297858)
- [RAP2 详细部署、操作指南](https://www.freesion.com/article/74291291096/)

### 4 网络代理软件拦截

强大的 whistle 配合 SwitchyOmega 在请求拦截的同时，可以使用自定义的 Mock 数据进行返回。[利用whistle mock数据](https://segmentfault.com/a/1190000014185370)
- 优势：模拟了真实的网络请求
- 劣热：这种方式操作步骤繁琐，需要在个人本地实现，不方便团队统一配置，Mock 实现成本较高。

`whistle + SwitchyOmega` 的优势不在于 mock 数据，而是其强大的 web 抓包和代理能力。特别适合场景：
- 前后端接品联调：静态文件代理到本地开发环境，接口请求代理仍然请求线上环境，或代理到后端的本地环境
- 解决微前端本地开发环境的代理：基座或其它子应用仍然请求线上环境，但当前开发应用静态资源请求代理到本地开发环境

[whistle 文档](http://wproxy.org/whistle/)

```
# 全局安装
npm i -g whistle

# 启动，默认端口号 8899
w2 start
```
为了让我们在 Chrome 浏览器中所有的请求都被 Whistle 代理转发，需要在 Chrome 浏览器上安装 `SwitchyOmega` 配置代理。

这个 chrome 插件扩展需要下载（科学上网），或者直接从 git 仓库中下载[SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega/releases)

下载完成后在 Chrome 安装好该插件，然后配置需要代理到的目标路径，这里我们让它将所有浏览器请求转发到 `Wistle`服务器，这样就实现抓包功能了。

然后打开 whistle 的配置页面 `localhost:8899`，按页面功能选择 rules 进行代理规则配置，保存即可。

此时如果切换线上代理的环境地址，只需要直接修改路由 Rules 代理配置，然后保存即可生效。

### mock server 总结
- 优势：对业务代码完全不具有侵入性，并且通用性强。
- 劣势：成本高，需要另起一个Mock-Server服务，并对其进行管理。


## Deep: mock.js 源码

mock.js 是如何实现请求拦截的？

mockJS实现拦截，是模拟了XMLHttpRequest对象。重写open、send等方法，方法调用时，只是普通函数的调用，不会发送真正的请求。

[MockJS Ajax拦截原理](https://juejin.cn/post/6904153889163968526)

