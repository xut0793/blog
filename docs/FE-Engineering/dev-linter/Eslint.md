# ESLint

[[toc]]

> 文章主要内容参考链接 [深入理解 ESLint](https://zhuanlan.zhihu.com/p/75531199)

## Lint 工具简史

> 在计算机科学中，lint 是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成 bug）的语句。它是一种静态程序分析工具，最早适用于 C 语言，在 UNIX 平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。 -- by wikipedia

在 JavaScript 20 多年的发展历程中，也出现过许许多多的 lint 工具，下面就来介绍下主流的三款 lint 工具。

- JSLint：最早的用于 JS 的 Lint 工具，由 Douglas Crockford 开发，规则完全不可配置
- JSHint：继承自 JSLint，让规则可配置。
- ESLint：目前最普遍的 Lint 工具，除了规则可配置外，还可以自定义规则，提供了完整的插件机制。

### JSLint

JSLint 可以说是最早出现的 JavaScript 的 lint 工具，由 Douglas Crockford (《JavaScript 语言精粹》作者) 开发。从《JavaScript 语言精粹》的笔风就能看出，Douglas 是个眼里容不得瑕疵的人，所以 JSLint 也继承了这个特色，JSLint 的所有规则都是由 Douglas 自己定义的，可以说这是一个极具 Douglas 个人风格的 lint 工具，如果你要使用它，就必须接受它所有规则。值得称赞的是，JSLint 依然在更新，而且也提供了 node 版本：node-jslint。

### JSHint

由于 JSLint 让很多人无法忍受它的规则，感觉受到了压迫，所以 Anton Kovalyov (现在在 Medium 工作) 基于 JSLint 开发了 JSHint。JSHint 在 JSLint 的基础上提供了丰富的配置项，给了开发者极大的自由，JSHint 一开始就保持着开源软件的风格，由社区进行驱动，发展十分迅速。早起 jQuery 也是使用 JSHint 进行代码检查的，不过现在已经转移到 ESLint 了。

### ESLint

ESLint 由 Nicholas C. Zakas (《JavaScript 高级程序设计》作者) 于 2013 年 6 月创建，它的出现因为 Zakas 想使用 JSHint 添加一条自定义的规则，但是发现 JSHint 不支持，于是乎自己开发了一个。

ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，即将将人可读的源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。

但是，那个时候 ESLint 并没有大火，因为需要将源代码转成 AST，运行速度上输给了 JSHint ，并且 JSHint 当时已经有完善的生态（编辑器的支持）。真正让 ESLint 大火是因为 ES6 的出现。

ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让 ESLint 成为最快支持 ES6 语法的 lint 工具。

## Lint 工具的意义

Lint 工具对工程师来说到底是代码质量的保证还是一种束缚？

> 代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。<br>JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。

因为 JavaScript 这门神奇的语言，在带给我们灵活性的同时，也埋下了一些坑。比如 == 涉及到的弱类型转换，着实让人很苦恼，还有 this 的指向，也是一个让人迷惑的东西。而 Lint 工具就很好的解决了这个问题，干脆禁止你使用 == ，这种做法虽然限制了语言的灵活性，但是带来的收益也是可观的。

还有就是作为一门动态语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行才发现，这给我们调试工作增加了一些负担，而 Lint 工具相当于为语言增加了编译过程，在代码运行前进行静态分析找到出错的地方。

所以 Lint 工具的意义：

1. 避免低级 bug，找出可能发生的语法错误。比如：使用未声明变量、修改 const 变量……
2. 提示删除多余的代码。比如：声明而未使用的变量、重复的 case ……
3. 确保代码遵循最佳实践，如参考 airbnb style、javascript standard 等实践指南
4. 统一团队的代码风格。比如：加不加分号？使用 tab 还是空格等

## ESLint 安装

```sh
# npm
npm i -D eslint

# Or yarn
yarn --dev eslint
```

## ESLint 命令行

> [ESLint cmd](http://eslint.cn/docs/user-guide/command-line-interface)

基本语法：

```sh
eslint [options] [file|dir|glob]*
```

具体 options 选项可参照官网命令行链接。最常用的一个命令`--fix`，用于对可以自动修复的规则进行自动处理。

```sh
eslint --fix
```

## ESLint 配置

有两种主要的方式来配置 ESLint：

- Configuration Comments ：使用 JavaScript 注释把配置信息直接嵌入到一个代码源文件中。
- Configuration Files ： 使用遵循 [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) 配置文件格式，可以配置一个独立的 .eslintrc.\* 文件，或者直接在 package.json 文件里的 eslintConfig 字段指定配置，ESLint 会查找和自动读取它们。

### 配置文件 `.eslintrc.*`

一般在前端项目工程中，常见的配置文件，及优先级（按从上到下顺序）为：

- .eslintrc.js
- .eslintrc.yaml
- .eslintrc.yml
- .eslintrc.json
- .eslintrc
- package.json

ESLint 规则是有层叠覆盖的，层叠配置使用离要检测的文件最近的 .eslintrc 文件作为最高优先级，然后才是父目录里的配置文件。默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。但有时为了将 ESLint 限制到一个特定的目录下，可以在配置文件中设置 `"root": true`。ESLint 一旦发现配置文件中有 `"root": true`，它就会停止在父级目录中寻找。

主要包括以下配置项：

> 更具体配置项及说明见官网[Configuring ESLint](http://eslint.cn/docs/user-guide/configuring)

- parse / parseOptions: 解析器默认采用 espima, 其它还有：babel-eslint 等。
- Environments: 指定脚本的运行环境。因为每种环境都有一组特定的预定义全局变量，需要在配置文件中指出，让规则排除。
- Globals: 其时同环境目的一样，提前指出脚本在执行期间访问的额外的全局变量，避免规则校验。
- Rules: 启用的规则及其各自的错误级别。
- plugins：插件名称以 eslint-plugin- 为前缀，但配置时可省略
- extends： ESLint 所有规则默认关闭，避免在 Rules 中逐条配置，可以直接使用扩展中的规则。官方默认的规则扩展为 `eslint:recommended`，即在规则中标记 √ 的规则。

#### 解析器和解析选择

```js
{
  // 解析器类型
  // espima(默认), babel-eslint, @typescript-eslint/parse
  "parse": "esprima",
  // 解析器配置参数
  "parseOptions": {
    // 代码类型：script(默认), 在 webpack 工程中常配置为 module
    "sourceType": "module",
    // es 版本号，默认为 5，也可以是用年份，比如 2015 (同 6)
    "ecamVersion": 6,
    // es 特性配置
    "ecmaFeatures": {
        "globalReturn": true, // 允许在全局作用域下使用 return 语句
        "impliedStrict": true, // 启用全局 strict mode
        "jsx": true // 启用 JSX
    },
  }
}
```

#### 全局变量和环境

ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。

```js
{
  "globals": {
    // 声明 jQuery 对象为全局变量为只读
    "$": 'readonly' // 由于历史原因，布尔值 false 和字符串值 "readable" 等价于 "readonly"。类似地，布尔值 true 和字符串值 "writeable" 等价于 "writable"。但是，不建议使用旧值。
  }
}
```

在 globals 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 env ，ESLint 对指定的环境默认预设了对应的全局变量（类似于 babel 的 presets 设置）。

```js
{
  "env": {
    "browser": true,
    "node": true
  }
}
```

如果想在一个特定的插件中使用一种环境，确保提前在 plugins 数组里指定了插件名，然后在 env 配置中插件名后跟一个 / ，紧随着环境名

```js
{
  "plugins": ["example"],
  "env": {
    "example/custom": true
  }
}
```

#### 插件

ESLint 默认只对标准 JS 语法的 JS 文件起作用，如果需要对 React 的 JSX 或者 Vue 的单文件组件同样有效，需要安装对应的插件并配置。

ESLint 的插件统一 `eslint-plugin-` 为前缀，但在配置文件的 plugins 选项中可以省略前缀。

```js
npm install --save-dev eslint-plugin-vue eslint-plugin-react
{
  "plugins": [
    "react", // eslint-plugin-react
    "vue",   // eslint-plugin-vue
  ]
}
```

#### 扩展

ESLint 声明了大量规则，但是默认都是关闭的。如果需要开启某条规则需要在 Rules 选项中配置。但如此一条一条增加必然不现实，所以我们直接使用已经定义好规则的外部扩展。方默认的规则扩展为 `eslint:recommended`，即在规则中标记 √ 的规则。

扩展就是直接使用别人已经写好的 lint 规则，方便快捷。extends 值可以直接是一个字符串，或数组形式。

```js
{
  "extends": "eslint:recommended",
  // 字符串数组：每个配置继承它前面的配置
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard",
  ]
}
```

如果是数组形式，每个配置继承它前面的配置，越后面的扩展规则会覆盖前端的。

> 区别于 stylelint 中数组中的每一项都优先于下一项

扩展一般支持三种类型：

```js
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard",
  ]
}
```

- eslint 开头的是 ESLint 官方的扩展，一共有两个：eslint:recommended 、eslint:all。
- plugin 开头的是插件的扩展规则，也可以直接在 plugins 属性中进行设置。
- 最后一种扩展来自 npm 包，官方规定 npm 包的扩展必须以 eslint-config- 开头，使用时可以省略这个头，上面案例中 eslint-config-standard 可以直接简写成 standard。

如果你觉得自己的配置十分满意，也可以将自己的 lint 配置发布到 npm 包，只要将包名命名为 eslint-config-xxx 即可，然后正常下载配置使用。

还有一种形式，可以将某个插件的配置从 plugins 和 extends 合并一起，不用分两处设置，这种方式即可以加载插件，又可以加载扩展。

```js
{
  "extends": [
    "plugin:react/recommended",
  ]
}
```

上面配置代表：插件名(pluginName) 为 react，也就是之前安装 eslint-plugin-react 包，配置名(configName)为 recommended。那么这个配置名又是从哪里来的呢？

可以看到 eslint-plugin-react 的源码：

```js
module.exports = {
  // 自定义的 rule
  rules: allRules,
  // 可用的扩展
  configs: {
    // plugin:react/recommended
    recomended: {
      plugins: [ 'react' ]
      rules: {...}
    },
    // plugin:react/all
    all: {
      plugins: [ 'react' ]
      rules: {...}
    }
  }
}
```

配置名是插件配置的 configs 属性定义的，这里的配置其实就是 ESLint 的扩展，通过这种方式即可以加载插件，又可以加载扩展。

#### 规则 Rules

ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：

- "off" 或 0 - 关闭规则
- "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
- "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

如果规则 ID 有额外选项，则与严重程序组成数组形式，且数组第一项必须为严重程序的表示：字符串或数字

```js
{
  "rules": {
    "eqeqeq": "off",
    "curly": 2,
    "quotes": ["error", "double"],
    "semi": [1, "always"],
  }
}
```

如果有安装插件，且在 `plugins` 配置了该插件，有需要在 rules 单独配置某条插件规则时，必须使用 `插件名/规则ID` 的形式:

```js
{
  "plugins": [
      "plugin1"
  ],
  "rules": {
    "plugin1/rule1": "error"
  }
}
```

Linter 本身的规则都可以分为两部分：

- 代码质量规则 (code-quality rules)
  - no-unused-vars
  - no-extra-bind
  - no-implicit-globals
  - prefer-promise-reject-errors
  - ...
- 代码风格规则 (code-formatting rules)
  - max-len
  - no-mixed-spaces-and-tabs
  - keyword-spacing
  - comma-style
  - ...

### 排除文件 `.eslintignor`

你可以通过在项目根目录创建一个 .eslintignore 文件告诉 ESLint 去忽略特定的文件和目录。.eslintignore 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测，忽略模式依照 .gitignore 规范。

```sh
# eslintignor
# ESLint总是忽略 /node_modules/* 和 /bower_components/* 中的文件，所以 node_modules 也可不写。
/node_modules/
/dist/
/build/
```

引申：

- [.gitignore 文件的配置使用](https://zhuanlan.zhihu.com/p/52885189)
- [Glob Patterns 匹配模式](https://zhuanlan.zhihu.com/p/53888457)

### Comments 注释配置

特殊的注释配置语句有两类：

- 生效的规则
  - eslint
- 排除的注释
  - eslint-disable / eslint-enable
  - eslint-disable-next-line
  - eslint-disable-line

语句可以单独使用，也可以语句后面接具体的规则 ID

生效语句：

```js
/* eslint eqeqeq: "off", curly: "error" */
/* eslint quotes: ["error", "double"], curly: 2 */
/* eslint "plugin1/rule1": "error" */
```

排除语句：

```js
// 在整个文件范围内禁止规则出现警告，将 /* eslint-disable */ 块注释放在文件顶部：
/* eslint-disable */

// 如果是对某代码块禁用规则，则需要 eslint-disable 和 eslint-enable 配合，相当于关闭和开启
/* eslint-disable */
alert("foo");
/* eslint-enable */

// 也可以对某一行代码禁用规则，有两种方式
/* eslint-disable-next-line */
alert("foo");

alert("foo"); /* eslint-disable-line */
```

语句后面都可以指定具体忽略一个或多个规则

```js
/* eslint-disable no-alert, no-console */
alert("foo");
console.log("bar");
/* eslint-enable no-alert, no-console */

alert("foo"); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert("foo");
```

## ESLint 与 Prettier 集成

[Prettier](/FE-Engineering/Lint/Prettier.html#与-linter-工具集成)

ESLint 的规则主要有两部分：代码质量和代码风格相关的规则，而 Prettier 规则都侧重于代码风格的统一。所以两者集成有两步：

1. 在 linter 中禁用所有可能与 Prettier 格式化代码的方式冲突的规则，让 Prettier 接管这些职责。 这一步由 `eslint-config-prettier` 完成
1. 让 Linters 执行时首先能够调用 Prettier 执行格式化 code-formatting 类规则，然后再使用 ESLint 检查 Code-quality 类规则。这一步由 `eslint-plugin-pretter`完成。

```js
// 安装 eslint-config-prettier 禁用掉 Linter 格式式部分的规则
yarn add --dev eslint-config-prettier

// 在 .eslintrc增加配置项
{
  "extends": ["prettier"] // 确保 Prettier 是 extends 配置项的最后一个
}
```

```js
// 安装插件
yarn add --dev eslint-plugin-prettier

// 在 .eslintrc 增加配置项
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

或者一步到位：

```js
// 还是要安装上面两个包：
yarn add --dev eslint-config-prettier eslint-plugin-prettier

// 在 .eslintrc 配置中一步到位
{
  "extends": ["plugin:prettier/recommended"]
}
```

## 总结

一个 VUE 项目的 `.eslintrc.js` 配置：

```js
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    "ecmaFeatures": {
      "globalReturn": false,
      "impliedStrict": true,
      "jsx": true,
    },
  },
  env: {
    "browser": true,
    "node": true,
    "es6": true,
  },
  extends: [
    'plugin:vue/essential',
    'aribnb',
    'plugin:prettier/recommended',
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier],
  // add your custom rules here
  rules: {
    // allow async-await
    'no-console': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
```

```sh
# .eslintignor
/build/
/public/
/dist/
src/assets/
```

## 自己编写插件

ESLint 官方为了方便开发者，提供了 yeoman 和 generator-eslint 来构建插件的脚手架代码。

[【AST 篇】教你如何动手写 Eslint 插件](https://juejin.im/post/5d91be23f265da5ba532a07e)
[深入理解 ESLint](https://juejin.im/post/5d3d3a685188257206519148#heading-24)

## 参考链接

- [ESLint 中文官网](http://eslint.cn/)
- [深入理解 ESLint](https://zhuanlan.zhihu.com/p/75531199)
- [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
