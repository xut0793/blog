# 项目集成单元测试(JEST + vue-test-utils)

两种方案：

- 使用脚手架自动生成 Jest 环境
  - 全新项目：使用 `@vue/cli 3.x` 以上的脚手架，手动选项配置：Jest
  - 现有项目集成： 下载 `@vue/cli-plugin-unit-jest` 插件，使用 `vue add @vue/cli-plugin-unit-jest` 集成。
- 手动配置 Jest 环境

> 使用脚手架生成的测试环境，Jest.config.js 配置同 webpack.config.js 一样都是 js 代码在运行中生成的。

## 1. 安装依赖

- `Jest` 是一个由 Facebook 开发的测试运行器 (test runner) 。（测试运行器就是运行测试代码的程序）
- `@vue/test-utils` 是 Vue.js 官方的单元测试实用工具库。包含了一系列辅助方法来实现组件挂载、与组件的交互，以及断言组件输出，让 Vue 测试组件更容易。
- `bable-jest` 告诉 Jest 如何处理 ES next 代码，相当于在 webpack 配置中的 bable-loader。尽管最新版本的 Node 已经支持绝大多数的 ES next 特性，但如果你可能仍然在你的测试中使用 ES modules 语法和 stage-x 的等当前 Node 版本不支持的特性，则需要使用 `bable-jest` 插件来处理 `*.js` 的 javascript 文件。
- `vue-jest` 告诉 Jest 如何处理 `*.vue` 的单文件组件 SFC，相当于在 webpack 配置中的 vue-loader。Jest 默认只能单纯对 JavaScript 代码编写测试，而不能针对 Vue 编写测试
- `jest-serializer-vue` 美化 vue 组件测试快照的序列化器，原始生成的组件快照文件是一串字符串，该插件可能美化字符串的输出，便于查看
- `jest-transform-stub` 模拟处理 css、图片、字体的预处理器。通常这些静态资源文件在测试中无足轻重，因此我们可以安全地 mock 他们，我们可以手动指定一个 mock 文件`<rootDir>/__mocks__/fileMock.js`, 只让其返回一个任意字符串 `module.exports = 'test-file-stub';`。但 `jest-transform-stub` 插件可以代替我们完成这些事。

**注意事项：**

1. 从 webapck@2.x 开始原生支持 ES 模块。使用 `bable-preset-env` 预设时，默认的配置选项 `modules: 'auto'`会依赖环境自行决定是否将 ESM 转为 CommonJS 模块语法。但因为 Jest 是直接运行在 Node 环境中的，Node 默认以 CommonJS 模块规范执行。所以在 Jest 中需要让 babel 将 ESM 语法转为 CommonJS 语法。但为了此项设置不影响 webpack 其它的编译，仅在测试时应用，可以把这个操作配置到一个独立的 babel 环境中，即设置一个独立的 `env.test` 选项。`bable-jest`插件执行时会默认读取 babel 配置文件 `.babelrc` 中的 `env.test` 配置来编译待测试的 js 文件。

```js
// babel.config.js
module.export = {
  {
  "presets": [
    ["env", { "modules": false }], // 设置为false将保留ES模块
  ],
  "env": {
    "test": {
      "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]], // 依赖当前 node 版本自行决定
    }
  }
}
}
```

2. babel-jest 不支持 babel@7 的解决方案

jest 运行在 node 环境，但 node 版本不支持 es next 某些语法，所以 `*.js` 文件需要使用 babel-jest 插件进行转换，但是 babel-jest 不支持 babel@7 版本，所以 jest 运行会报错：`Cannot find module 'babel-core' at Object.<anonymous> (node_modules/vue-jest/lib/compilers/babel-compiler.js:1:15)`，

解决方案：安装 `babel-core@^7.0.0-bridge.0` 插件，可以认为 `babel-core@^7.0.0-bridge.0` 插件是将 babel@6 衔接到 babel@7 的一个桥梁。

```
npm install --dev-save babel-core@^7.0.0-bridge.0
```

3. jest 相关全局变量被 linter 标识为错误

配置 eslint 适用环境来识别 jest 相关的全局变量

```js
env: {
  jest: true,
}

// 或者限定文件范围覆盖全局配置
overrides: [
  {
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/**/*.spec.{j,t}s?(x)'],
    env: {
      jest: true,
    },
  },
],
```

## 2. 配置文件 `jest.config.js`

- 使用 `jest init` 生成
- 手动在根目录创建 `jest-config.js`

> 具体配置项见 [jest.config.js](./1-jest.md)
**问题**

`Vue Test Utils: [Vue warn]: Unknown custom element: <d-xxx> - did you register the component correctly?`

```js
// file: jest.config.js
module.exports = {
  // ...
  setupFiles: ['./tests/setup.js'], // <- add this
}

// file: ./tests/setup.js
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
```

- 参考链接：[Vue Test Utils: Vue warn: Unknown custom element: `<d-xxx>` - did you register the component correctly?](https://github.com/vuejs/vue-test-utils/issues/1459)
- 疑问：setupFiles 作用？ setupFiles、setupFilesAfterEnv、globalSetup 区别？

## 3. 建立测试目录

默认情况下，Jest 将会递归的找到整个工程里所有 .spec.js 或 .test.js 扩展名的文件。

有两种方式：

- 集中处理：在项目根目录下建立 `tests` 目录，并且建立 `tests/unit` 和 `test/e2e` 目录。并将测试覆盖率报告的目录也设置到 `test/unit/coverage`，将 mock 文件放置其中

```
|-tests
  |-unit
    |-__mock__ 模拟数据目录
    |-coverage 覆盖率目录
    |-specs 编写测试用例的目录
      |-HelloWorld.spec.js
      |-__snapshots__
        |-HelloWorld.spec.js.snap
  |-e2e
```

- 就近处理：Jest 推荐你在被测试代码的所在目录下创建一个 `__tests__` 目录

```
|-components
  |-HelloWorld
    |-index.vue
    |-__tests__
      |-HelloWorld.spec.js
      |-__snapshots__
        |-HelloWorld.spec.js.snap
    |-__mock__
|-tests
  |-unit
    |-coverage 覆盖率目录
```

> Jest 会为快照测试在临近测试文件的地方自动创建一个 `__snapshots__` 目录。

## 4. vscode 插件

在 vscode 中开发，要获得更好的 Jest 编码体验，可以安装两个 vscode 插件：

- `Jest Snippets` Jest 相关的片段，便于代码智能提示
- `Jest`: 每次对代码的改动都需要手动执行 jest 启动命令，没有类似 hot-reload 的功能很难受。可能你有一百种方式可以解决这个需求，比如开启 `jest --watch` 模式。但是我现在想告诉你一个最简单且体验最好的一种方式，在 vscode 编辑器安装一个名为 jest 的插件。它会根据 git 修改记录自动执行应该执行的测试文件，并在控制台实时给出测试结果。

> 如果 vscode-jest 安装后不起作用，可能是因为 vscode-jest 暂时并不知道我们的 jest 配置文件在哪里。有三种方式解决：
>
> 1. 将 jest 配置写在 package.json 中的 jest 字段
> 2. 将 jest 配置文件提到项目根目录，并且更名为 jest.config.js
> 3. 修改 vscode 配置文件 setting.json，将 jest.pathToConfig 指向我们刚才编写的配置文件 `"jest.pathToConfig: "./test/unit/jest.config.js"`

## 5. 调试测试代码

### 5.1 vscode + run-script 手动添加断点并运行调试

- 在项目根路径上建立 `.vscode/launch.json` 文件，并输入：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      // 需要提前设置断点，stopOnEntry 对此无效
      "name": "jest by npm run debug",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "test"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

- 在需要测试的源码文件位置添加 `debugger` 代码，或者添加断点
- 在 vscode 按 f5，或点击调试图标

### 5.2 vscode + bin 文件直接运行调试，会自动在首行代码停止

- 在项目根路径上建立 `.vscode/launch.json` 文件，并输入：

> 也可以在 configurations 追加一个调试模式

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "jest bin",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
      "args": ["--no-cache"],
      "stopOnEntry": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

- 点击调试按钮即可。如果是追加配置，记得在调试窗口选择对应的配置名称。

此时因为添加 `stopOnEntry: true` 的原因，会在 `path/bin/jest.js`文件的首行代码就显示调试状态。所以这种方法比较适用于框架原源调试。

如果要调试业务代码，此时可以在业务文件添加断点，并点击运行到断点处。

### 5.3 node + chrome 调试代码

- 添加调试脚本命令，并运行 `npm run test:debug`

```json
"script": {
  "test:debug": "node --inspect-brk ./node_modules/jest/bin/jest.js --no-cache --runInBand"
}
```

- 使用 chrome 浏览器，输入 `chrome://inspect`
- 单击 Remote Target 下的 inspect，选择 Sources,查找对应调试文件。


## 参考链接
- [Jest 中文文档](https://doc.ebichu.cc/jest/docs/zh-Hans/configuration.html#content)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/)
- [如何进行 Vue 单元测试？从 Jest 开始吧！](https://mp.weixin.qq.com/s/N43gC8c-bjMCUcX1INFVNw)
