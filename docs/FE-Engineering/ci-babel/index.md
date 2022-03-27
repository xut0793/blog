# Babel

[[toc]]

> WWHD方法论：what是什么、why为什么用它解决什么问题、how如何使用、deep深入理解

## What: Babel 是什么？

Babel 是一个 JavaScript 语法转译器，需要通过配置插件实现主要功能。

## Why: 解决什么问题？

对于前端来说，不管是 JS 还是 CSS，语言标准的实现到真正能够在业务代码中使用是需要一段过渡时间的，主要是需要等待各大浏览器厂商将语言标准在浏览器引擎中实现才能真正使用。

但现在有了 Babel，它能将 ES6 或 ES next 等更高版本的 JavaScript 代码转为 ES5 或 ES3 等向后兼容的 JS 代码，从而使应用可以运行在低版本浏览器或其它环境中。

这样，我们就完全可以在工作中更早使用 ES next 的语法编写程序，然后使用 Babel 将代码转为低版本兼容的 js 代码，这样就不用担心应用运行的环境（浏览器或 Node ）是否支持了。

## How: 如何使用？

Babel 严然已经成为 JS 工具链中重要的一环，它遵循了大部分 js 工具库类似的结构，提供了以下工具：

- 核心功能库：@babel/core
- 命令行工具：@babel/cli
- 配置文件： .babelrc / babel.config.json / babel.config.js
- 插件体系： plugins / presets
- 兼容构建工具包： webpack 的 babel-loader、 glup 的 glup-babel、 browserify 的 babelify、rollup 的 rollup-plugin-babel 等。

下面的示例使用 babel-cli 演示。

```sh
# 安装核心工具包
npm install --save-dev @babel/cli @babel/core
```

> Babel7.x 以上版本 npm 包都是放在 babel 域下的，即在安装 npm 包的时候，使用 @babel/xx 这种方式，例如 @babel/cli、@babel/core 等。
> Babel6.x 以下版本安装的包名是 babel-cli，babel-core 等。其实它们本质是一样的，只是官方包文件组织方式改变了。

由于 Babel 是一个可以通过插件实现各种花样功能的通用编译器，因此默认情况只负责转译代码，没有插件时默认什么都不做。你必须明确地告诉 Babel 应该要做什么。所以通过配置文件定义插件 plugins 或预设 presets 来指示 babel 去做什么事件。

### 配置文件

babel 配置文件写法支持以下三种形式：

- 项目范围文件配置：babel.config.json / babel.config.js ，也支持 .cjs / .mjs 扩展名。
- 相对文件配置：.babelrc / .babelrc.json / .babelrc.js，同样支持 .cjs / .mjs 扩展名。
- package.json 文件内定义 "babel” 选项。

> 如果是单结构项目，在项目根目录下使用 babel.config.json 和 .babelrc 基本一样。但对于现在流行的 Monorepos 结构的项目，两者配置会有区别，自行查阅。

> 使用 .js 和 .json 后缀也有细微差别。.js 配置文件非常方便，特别是当导出函数时可以使用 babel 提供的 api 参数，做一些灵活操作。但 JS 配置无法进行静态分析，因此对可缓存性，使 IDE 自动缓存它变得更困难。Babel 希望避免每次编译文件时都重新解析 config 文件，因为那样的话，它还需要重新执行该配置中引用的所有插件和预设函数（在 .js 配置文件导出函数时可以使用 api.cache.forever 表示永久缓存计算出的配置，不再调用该函数）。由于 babel.config.json 和.babelrc.json 都是静态 JSON 文件，因此它允许使用 Babel 的其他工具来缓存结果，这对项目构建性能有利。

在项目根目录建立配置文件 babel.config.json，写入最主要的两个配置项： `presets / plugins`

```json
{
  "presets": [],
  "plugins": []
}
```

### 插件 plugin

Babel 核心功能只负责转译源代码成 AST，具体对 AST 如何处理，实现什么功能，都是通过配置插件来实现的。配置文件中没有插件时，默认什么都不做，代码原样输出。

所以如果需要指示 babel 将 ES6 代码转换成 ES5 ，就需要配置用来转换 ES6 相关语法的插件。

```json
// 处理 ES2015 语法
@babel/plugin-transform-arrow-functions           // 转换 ES6 箭头函数
@babel/plugin-transform-block-scoped-functions   // 转换 ES6 块级作用域
@babel/plugin-transform-block-scoping            // 转换 ES6 块级作用域

// 处理 ES2018 语法
@babel/plugin-proposal-async-generator-functions
@babel/plugin-transform-dotall-regex

// 省略更多插件....
```

> [babel 官方插件列表](https://babeljs.io/docs/en/plugins/),还可以在 [https://www.npmjs.com/search?q=babel-plugin](https://www.npmjs.com/search?q=babel-plugin) 上搜索社区的功能插件。

Babel 插件的数量非常多，假如只配置插件数组，那我们前端工程要把 ES2015, ES2016, ES2017, ES next 下的所有语法转换插件都写到`plugins`配置项数组里，我们的 Babel 配置文件会非常臃肿。

所以我们会把一批功能的插件集合起来，统一成一个插件包，这就是预设 preset。

### 预设 preset

preset 预设是一组 Babel 插件的集合，用大白话说就是插件包，例如 babel-preset-es2015 就是所有处理 es2015 的二十多个 Babel 插件的集合。这样我们就不用写一大堆插件配置项了,只需要用一个预设代替就可以了。

另外，预设也可以是插件和其它预设的集合。Babel 官方已经对常用的环境做了一些 preset 包，比如 @babel/preset-env。

```sh
npm install --save-dev @babel/preset-env
```

```json
{
  "presets": ["@babel/preset-env"], // 用一个预设包代替一系列 plugins 的配置。
  "plugins": []
}
```

> 插件和预设的开发参考下面深入章节。

### Plugin/Preset 排序

plugins 插件数组和 presets 预设数组是有顺序要求的。如果两个插件或预设都要处理同一个代码片段，那么会根据插件和预设的顺序来执行。规则如下：

- Plugin 会运行在 Preset 之前。
- Plugin 会从第一个开始顺序执行。
- Preset 的顺序则刚好相反(从最后一个逆序执行)。**一定要记得 preset 的顺序是反向的**

> 这主要是为了保证向后兼容，因为大多数用户会在 "stage-0" 之前列出 "es2015" {"presets: ["es2015", "stage-0"]}

### plugin 与 preset 的短名称

插件可以在配置文件里写短名称，如果插件是支持 babel 6.x 前的 npm 包名称的前缀为 插件：`babel-plugin-xxx`，预设：`babel-preset-xxx`，此时可以省略前缀，直接写成 xxx；

如果插件本身带用作用域，如插件 plugin: `@scoped/babel-plugin-xxx`, 短名称可以写成 `@scoped/xxx`；预设 preset: `@scoped/preset-xxx`，同样可以简写成 `@scoped/xxx`。

```json
{
  /** babel 6.x */
  "plugins": ["babel-plugin-transform-arrow-functions"],
  // 等效于
  "plugins": ["transform-arrow-functions"],

  "presets": ["babel-preset-es2015"],
  // 等效于
  "presets": ["es2015"],

  /** babel 7.x */
  "plugins": ["@babel/plugin-transform-arrow-functions"],
  // 等效于
  "plugins": ["@babel/transform-arrow-functions"],

  "presets": ["@babel/preset-env"],
  // 等效于
  "presets": ["@babel/env"]
}
```

但仍然建议全称书写。

### plugin 与 preset 的参数

每个插件是插件数组 plugins 的一成员项，每个预设是预设数组 presets 的一成员项，默认情况下，成员项都是用字符串来表示的，例如 `"presets": ["@babel/preset-env"]`。

如果要给插件或预设设置参数，那么成员项就不能写成字符串了，而要改写成一个数组:

- 数组的第一项是插件或预设的名称字符串
- 第二项是个对象，该对象用来设置第一项代表的插件或预设的参数。

例如给@babel/preset-env 设置参数：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

各个插件和预设可配置的选项，可具体搜索插件或预设仓库。

### plugin 与 preset 相关的 browserslist

Browserslist 叫做目标环境配置表，用于在不同的前端工具之间共享目标浏览器或 Node 环境。

比如 babel 使用了 @babel/preset-env 这个预设，此时 babel 就是读取 browserslist 的配置来确定哪些 ES next 语法需要转换成兼容语法。比如 browserslist 配置的目标浏览器支持箭头函数，那 babel 就不会转译代码中的箭头代码。
另外比如 Autoprefixer、postcss 等就可以根据我们的 browserslist，来自动判断是否要增加 CSS 前缀（例如"-webkit-"）。

截止目前，有以下工具会自动读取项目中的 browserslist 信息：

- Autoprefix
- babel
- postcss-preset-env
- postcss-normalize
- eslint
- stylelint

> 具体可以查看 [browserslist](../initial/browserslist.md)

1. **browserslist 配置文件**

browserslist 配置可以直接写在 package.json 文件的 `browserslist` 属性中

```json
// package.json
{
  "browserslist": ["default"] // browserslist 默认配置
  // 等效于
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "Firefox ESR",
    "not dead"
  ]
}
```

也可以在项目根目录上单独建立配置文件 `.browserslistrc`

```rc
# Browsers that we support
> 0.5%
last 2 versions
Firefox ESR
not dead
```

### runtime

babel 为了实现将 ES next 高阶语法的 js 代码转为 ES5 等向后兼容的 JS 代码，会在每个待转换的源文件头部注入一些额外的**辅助函数**来实现。

比如下面这段简单使用 ES6 Class 语法的代码：

```js
class Person {
  constructor(name) {
    this.name = name
  }
  sayname() {
    return this.name
  }
}
const john = new Person('john')
console.log(john.sayname())
```

使用下面简单的配置

```json
// babel.config.json
{
  "presets": ["@babel/preset-env"],
  "plugins": []
}
```

然后使用 babel-cli 执行：

```sh
npx babel es-class.js -o es.js
```

看到转译后的文件

```js
'use strict'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

var Person = /*#__PURE__*/ (function() {
  function Person(name) {
    _classCallCheck(this, Person)

    this.name = name
  }

  _createClass(Person, [
    {
      key: 'sayname',
      value: function sayname() {
        return this.name
      },
    },
  ])

  return Person
})()

var john = new Person('john')
console.log(john.sayname())
```

可以看到转换后的代码上面增加了好几个函数声明，这就是注入的函数，我们称之为**辅助函数**。

@babel/preset-env 在做语法转换的时候，注入了这些函数声明，以便语法转换后使用。

但在实际项目开发中，源代码可能有几百个或更多的文件，每个文件的头部都注入一些转换高阶语法的辅助函数，会导致文件体积膨胀，并且这些辅助函数大部分是相同的代码，在不同文件中重复注入，这不是我们希望的结果。

常规的思路，必然是把这些相同的辅助函数代码抽出来独立组织，在使用时使用模块导入语句导入即可。

`@babel/runtime` 就是这样 npm 包，`@babel/runtime` 把所有语法转换会用到的辅助函数都集成在了一起。

```sh
# 作为开发依赖安装
npm install --save @babel/runtime
```

在安装包内可以找到我们需求的辅助函数导入

```js
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck')
var _defineProperties = require('@babel/runtime/helpers/defineProperties')
var _createClass = require('@babel/runtime/helpers/createClass')
```

但我们不可能在每个使用高阶语法的文件中，手动导入对应语法转换的辅助函数，这人为操作是基本不现实的，我们需要一个工具自动帮我们引入这些辅助函数。这就是 `@babel/plugin-transform-runtime` 插件的功能，自动替换辅助函数。

```sh
npm install -D @babel/plugin-transform-runtime
```

配置文件的插件选项中增加：

```json
// babel.config.json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

这样就解决了辅助函数注入导致代码冗余膨胀的问题了。

实际上，`@babel/plugin-transform-runtime` 插件主要有三个功能：

1. 自动移除语法转换后内联的辅助函数（inline Babel helpers），使用 @babel/runtime/helpers 里的辅助函数来替代；
2. 当代码里使用了 core-js 的 API，自动引入 @babel/runtime-corejs3/core-js-stable/，以此来替代全局引入的 core-js/stable;
3. 当代码里使用了 Generator/async 函数，自动引入 @babel/runtime/regenerator，以此来替代全局引入的 regenerator-runtime/runtime；

功能 1 上面已经讲了，功能 2 和 3 其实是在做 API 转换，对内置对象进行重命名，以防止污染全局环境。

这就需要了解 `polyfill` 的概念了。

### polyfill

**Babel 默认只转换新的 JavaScript 语法（syntax），而不转换新的 API**

babel 可以通过插件转译新标准引入的语法，比如 ES6 的箭头函数转译成 ES5 的普通函数等；而新标准引入的新的原生对象（Promise、Map、Symbol、Proxy、Iterator）、以及部分原生对象新增的原型方法（Object.assign、Array.prototype.flat 等），这些 babel 是不会转译的。需要用户自行引入 polyfill 来解决。

要实现旧浏览器兼容新的 API，可以使用的 polyfill 库既有 babel 官方提供的 `@babel/polyfill`，也有社区提供的第三方库。

> @babel/polyfill 使用了优秀的 core-js 用作 polyfill，并且定制化的 regenerator 来让 generators（生成器）和 async functions（异步函数）正常工作。因为 @babel/polyfill 主要由以下两个库实现，所以从 babel 7.x 开始，@babel/polyfill 已经废弃，建议直接使用这两个库。

```js
// 实现 @babel/polyfill 等同效果
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

应用程序中直接引入 polyfill 功能的库，虽然实现了新 API 功能的补齐，但这样全局使用，也带了一个问题：**污染了全局变量**。

比如 Promise，我们的 polyfill 是对浏览器的全局对象进行了重新赋值，重写了 Promise 及其原型链功能，即修改了浏览器的 window.Promise。这就是对浏览器全局环境造成了污染。

虽然这对于应用程序或命令行工具来说可能是好事，但如果你打算将的代码发布为供其他人使用的库，或你无法完全控制代码运行的环境，这就会成为问题。

所以我们需求一种方法，即能实现 polyfill 的功能，又不会造成全局环境污染。这就是 `@babel/plugin-transform-runtime` 插件的功能 2 和 3。它不使用 polyfill 的全局库，而是开启 @babel/plugin-transform-runtime 的 API 转换功能，通过内部导入实现对应功能的库来实现。

比如为了低版本浏览器补齐 promise API，如果导入全局的 polyfill 库，像为低版浏览器生成一个全局的 `window.Promise`对象，然后我们业务代码仍然像高版本一样使用 promise API

```js
var obj = Promise.resolve()
```

但如果开启 @babel/plugin-transform-runtime 的 API 转换功能。那么 Babel 转换后的代码将是：

```js
var _interopRequireDefault = require('@babel/runtime-corejs3/helpers/interopRequireDefault')
var _promise = _interopRequireDefault(
  require('@babel/runtime-corejs3/core-js-stable/promise')
)
var obj = _promise['default'].resolve()
```

它没有生成全局的 ``window.Promise`，而是引入了一个实现 promise 全部功能的模块来实现。

要让 `@babel/plugin-transform-runtime` 实现功能 2 和 3，需求在插件配置中传入对应的选项。

```json
{
  "presets": ["@babel/env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

> 在我们不需要开启 core-js 相关 API 转换功能的时候，我们只需要安装@babel/runtime 就可以了。上面我们已经知道，@babel/runtime 里存放的是 Babel 做语法转换的辅助函数。
> 在我们需要开启 core-js 相关 API 转换功能的时候，就需要安装@babel/runtime 的进化版@babel/runtime-corejs3。这个 npm 包里除了包含 Babel 做语法转换的辅助函数，也包含了 core-js 的 API 转换函数。

插件的配置选项主要有以下几个：

```json
{
  "plugins": ["@babel/plugin-transform-runtime"],
  // 等效于下面选项的默认值：
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true, // 语法转换的辅助函数默认开启
        "corejs": false,
        "regenerator": true, // 实现 generators（生成器）和 async functions（异步函数）API 的 polyfill 默认开启
        "useESModules": false,
        "absoluteRuntime": false,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```

`@babel/plugin-transform-runtime`选项的值：

```
"helpers": 设置是否要自动引入辅助函数包，这个当然要引入了，这是@babel/plugin-transform-runtime的核心用途，所以默认开启
"corejs": 用来设置是否做 API 转换以避免污染全局环境, corejs取值是false、2 和 3, 在前端业务项目里，我们一般对corejs取false，即不对Promise这一类的API进行转换。而在开发JS库的时候设置为2或3.corejs取值为2的时候，需要安装并引入core-js@2版本，或者直接安装并引入polyfill也可以。如果corejs取值为3，必须安装并引入core-js@3版本才可以，否则Babel会转换失败
"regenerator": 实现 generators（生成器）和 async functions（异步函数）API 的 polyfill 默认开启
"useESModules": 设置是否使用ES6的模块化用法，取值是布尔值。默认是fasle，在用webpack一类的打包工具的时候，我们可以设置为true，以便做静态分析。
"absoluteRuntime": 用来自定义@babel/plugin-transform-runtime引入@babel/runtime/模块的路径规则，取值是布尔值或字符串。没有特殊需求，我们不需要修改，保持默认false即可。
"version": 用来指定 runtime 包的版本号。根据需求只需要安装一个即可：@babel/runtime及其进化版@babel/runtime-corejs2、@babel/runtime-corejs3的版本号。
```

> 单独安装单独安装 core-js 与 regenerator-runtime 这两个 npm 包，这种方式 core-js 是默认是 3.x.x 版本。而目前已经废弃的 @babel/polyfill 使用的 core-js 已经锁死为 2.x.x 版本了。core-js 的 2.x.x 版本里并没有 stable 文件目录，所以安装@babel/polyfill 后再引入 core-js/stable 会报错。

`@babel/preset-env` 的选项：

> [https://github.com/babel/babel-preset-env](https://github.com/babel/babel-preset-env)

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        /**
          该参数项可以取值为字符串、字符串数组或对象，不设置的时候取默认值空对象{}。参数项的写法与browserslist是一样的。
          如果我们对@babel/preset-env的targets参数项进行了设置，那么就不使用browserslist的配置，而是使用targets的配置。
          如不设置targets，那么就使用browserslist的配置。如果targets不配置，browserslist也没有配置，那么@babel/preset-env就对所有ES6语法转换成ES5的。
          正常情况下，我们推荐使用browserslist的配置而很少单独配置@babel/preset-env的targets。
        */
        "targets": {
          "chrome": "58",
          "ie": "11",
          "browsers": ["last 2 versions", "safari 7"]
        },
        /**
          项取值可以是”usage” 、 “entry” 或 false。如果该项不进行设置，则取默认值false。
          useBuiltIns这个参数项主要和polyfill的行为有关:
          false: 没有配置该参数项或是取值为false的时候，polyfill就是我们上面讲的那样，会全部引入到最终的代码里。
          entry：Babel根据 tagets 或 browserslist 来补齐目标环境缺失的API。
          usage: Babel 除了会考虑目标环境缺失的API模块，同时考虑我们项目代码里实际使用到的ES6特性。只有我们使用到的ES6特性API在目标环境缺失的时候，Babel才会引入对应的core-js@x 的API补齐模块。
        */
        "useBuiltIns": "entry",
        /**
          参数项的取值可以是2或3，没有设置的时候取默认值为2。这个参数项只有useBuiltIns设置为’usage’或’entry’时，才会生效。
          取默认值或2的时候，Babel转码的时候需要安装 core-js@2版本（即core-js2.x.x）或 @babel/runtime-corejs2。因为某些新API只有core-js@3里才有，例如数组的flat方法，我们需要使用core-js@3 或 @babel/runtime-corejs3 的API模块进行补齐，这个时候我们就把该项设置为3。
          @babel/runtime-corejsx 已废弃，官方推荐 core-js@x
        */
        "corejs": 2,
        /**
        用来设置是否把ES6的模块化语法改成其它模块化语法。参数项的取值可以是”amd”、”umd” 、 “systemjs” 、 “commonjs” 、”cjs” 、”auto” 、false。在不设置的时候，取默认值”auto”。
        我们常见的模块化语法有两种：（1）ES6的模块法语法用的是import与export；（2）commonjs模块化语法是require与module.exports。
        在该参数项值是’auto’或不设置的时候，会发现我们转码前的代码里import都被转码成require了。
        如果我们将参数项改成false，那么就不会对ES6模块化进行更改，还是使用import引入模块。
        使用ES6模块化语法有什么好处呢。在使用Webpack一类的打包工具，可以进行静态分析，从而可以做tree shakeing等优化措施。
        在实际业务中使用 esm 写法，由 webpack 进行转换，所以在 babel 这里可以设置成 false。
        */
        "modules": "auto"
      }
    ]
  ]
}
```

## 总结

- babel 配置基本就是 预设`@babel/preset-env` 搭配插件 `@babel/plugin-transform-runtime`
- 但安装了插件 `@babel/plugin-transform-runtime` 就要有选择性的安装 `@babel/runtime及其进化版@babel/runtime-corejs2、@babel/runtime-corejs3`中的一个，并配置插件的选项 corejs 为对应的值。

> [polyfill 和 shim 区别](https://www.zhihu.com/question/22129715)
> shim 是硬垫片，polyfill （直译为填充物） 是软垫片。所谓垫片，是指垫平不同浏览器之间差异的东西。polyfill 可以理解为用在浏览器 API 上的 shim，用来为旧浏览器提供它没有原生支持的较新的功能。shim 指代范围更广，不局限于 web，但 polyfill 通常特指用于兼容旧浏览器 API 的一种 shim 库。

[一文搞清楚前端 polyfill --- 讲解了多种 Polyfill 的使用](https://zhuanlan.zhihu.com/p/71640183)

## Deep: 深入理解 Babel

TODO:

- Babel 转译过程
- 自定义插件和预设

## 参考链接

- [姜瑞涛 Babel 教程](https://www.jiangruitao.com/babel/)
- [Babel 6.26.3 印记中文](https://babel.docschina.org/docs/en/6.26.3/plugins/) --- 对 babel 基础概念讲解更清楚
- [babel-handbook 中文 1. 用户手册](https://github.com/lixiang/babel-handbook-cn/blob/master/user-handbook.md)
- [babel-handbook 中文 2. 插件手册](https://github.com/lixiang/babel-handbook-cn/blob/master/plugin-handbook.md)
