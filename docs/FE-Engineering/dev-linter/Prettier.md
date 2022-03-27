# Prettier

[[toc]]

## Prettier 是什么

> Prettier is an opinionated code formatter --[官网](https://prettier.io/docs/en/index.html)原文

Prettier 是一个强制性的代码格式化程序。Prettier 会去掉你代码里的所有样式风格，然后用 Prettier 默认提供的统一的固定代码格式重新输出。

## Prettier 的哲学和意义

Prettier is an opinionated code formatter 。 Prettier 是一个 Opinionated 的代码格式化工具。所以要掌握 Prettier 的精髓就是要理解这个单词 `Opinionated`。

`Opinionated`在这里可以译为强制性，你要用我，就要遵守我的规定。停止围绕代码风格的无休止的争论，统一按我规定的执行。

> 关于代码风格的讨论，往往结果就是起于讨论，也止于讨论，虎头蛇尾有始无终。Prettier 也郑重提出：大家不要吵！用这种风格还是那种风格是半斤八两的关系，但是最后用没用上却是 0 和 1 的关系。咱们先提高代码的可读性和可维护性再说，具体什么风格我给你们定。大家都遵循 Prettier 给出的方案就好了，保证一切顺利进行下去。这就是 Prettier 的 opinionated！ ---[Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)

这即是 Prettier 的设计初衷和原则，也是它的意义所在：

- 停止浪费时间来讨论代码风格
- 纯粹写代码，不要花时间在格式化上
- 配置最小化，让它更容易实施，而且格式化速度非常快

## Prettier 的原理

首先保证你的代码符合语言的语法规范，然后 Prettier 先把你的代码转换成一种中间状态 AST 语法树(Abstract Syntax Tree)，最后 Prettier 在这个 AST 的基础上重新按照自己默认制定的风格输出代码。

这里可以用 Prettier [官网](https://prettier.io/playground/) 提供的 Playground 更直观感觉这个转换过程。
![prettier_ast.jpg](./imgs/prettier_ast.jpg)

## Prettier 怎么用

### 安装

使用 NPM：

```sh
npm install --save-dev --save-exact prettier
# or globally
npm install --global prettier
```

使用 yarn：

```sh
yarn add prettier --dev --exact
# or globally
yarn global add prettier
```

### 命令行操作

命令行格式：

```sh
prettier [options] [file/dir/glob ...]
```

关于 options 的配置具体可见[官网 命令行操作](https://prettier.io/docs/en/cli.html)

最常用的就是 `--write`：重写指定的文件，即将指定文件格式化输出

看个示例：

```sh
# 新建一个目录
mkdir learn-prettier && cd learn-prettier

# 初始化项目
npm init

# 安装 Prettier
npm install prettier --save-dev --save-exact

# 在项目下新建一个js文件，然后用编译器打开随便写一些格式不规范的代码，格式可以改的更乱一些，但必须符合JS语法。
touch prettier-demo.js

# 保存后，在项目根目录，打开命令行运行以下命令，就会看到杂乱的代码变成格式化的规整的代码
npx prettier --write prettier-demo.js
```

### 配置文件

但一般很少用命令行去操作格式化代码，在项目中常见的是用配置文件来指定格式化。

配置文件的类型可以有多种方式：

- 在项目的 package.json 文件中配置 "prettier" 字段。
- 在项目根目录下指定 .prettierrc 文件，可以带有可选扩展名：.json / .yaml/ .yml/ .toml，无扩展的文件优先。如 .prettierrc / .prettierrc.json / .prettierrc.yaml 等。
- 在项目根目录指定 .prettierrc.js 或 prettier.config.js 文件导出的对象。

JSON:

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

JS:

```js
// prettier.config.js or .prettierrc.js
module.exports = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
};
```

### 配置项

Prettier 程序的设计遵循 `Opinionated` 原则，所以大部分格式化规则都默认且不可配置的，即强制性。但也提供了少量的配置项可以自定义选择。

> Prettier 反复强调自己是一个 Opinionated code formatter，而且只有 few(很少) options。就已有的配置项，Prettier 官方都明确说了其中很多都不是他们想要的，是迫不得已加上的。

```js
// 主要规则集中在
// 1. tab 和 space
// 2. 引号：单引号或双引号
// 3. 尾随逗号
// 4. 行尾分号
// 5. 未尾空行
// 6. 箭头函数参数的括号
module.exports = {
  //每行最多多少个字符换行默认80
  printWidth: 80,
  // 使用制表符或是空格缩进行, 默认 false。
  useTabs: false,
  //tab缩进大小,默认为2
  tabWidth: 2,
  //语句求尾是否使用分号, 默认true
  semi: true,
  //使用单引号, 默认false(在jsx中配置无效, jsx使用 jsxSingleQuote, 默认都是双引号)
  singleQuote: true,
  // 更改对象属性引号的的时机
  // "as-needed" -仅在需要时在对象属性周围添加引号， 默认值。
  // "consistent" -如果对象中至少有一个属性需要用引号引起来，请用所有属性引起来。
  // "preserve" -尊重对象属性中引号的输入使用。
  quoteProps: "as-needed",
  // 行尾逗号,默认none,可选 none|es5|all
  // "es5" -在ES5中有效的结尾逗号（对象，数组等）,默认值
  // "none" -没有尾随逗号。
  // "all"-尽可能在结尾加上逗号（包括函数参数）。这需要节点8或转换
  trailingComma: "es5",
  // 对象中文字与大括号的空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // 箭头函数参数括号 默认always 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号 （x) => x
  arrowParens: "always",
  //行结尾的风格<auto | lf | crlf | cr>
  endOfLine: "lf",
  // jsx语法中的引号
  jsxSingleQuote: "",
  // JSX标签闭合位置 默认false
  // false: <div
  //          className=""
  //          style={{}}
  //       >
  // true: <div
  //          className=""
  //          style={{}} >
  jsxBracketSameLine: true,
  // HTML空格敏感性
  // "css"-遵守CSS display属性的默认值。
  // "strict" -空白被认为是敏感的。
  // "ignore" -空白被认为是不敏感的。
  htmlWhitespaceSensitivity: "css",
  // Vue文件脚本和样式标签缩进
  // "false" -不要缩进Vue文件中的脚本和样式标签。
  // "true" -在Vue文件中缩进脚本和样式标签。
  vueIndentScriptAndStyle: "false",
  // 是否在文件头部插入一个特殊的@format标记，默认 false
  insertPragma: "false",
  // 是否需要编译指示，默认 false
  /**
   * @prettier
   */
  // 或
  /**
   * @format
   */
  requirePragma: "false",
};
```

### 排除文件

可以在项目根目录下新建一个 `.prettierignore` 文件来设置 Prettier 格式化时需要排队的文件。.prettierignore 使用 [gitignore]() 语法。

```js
// .prettierignore.js
/dist/
/node_modules/
/static/
/public/
```

### 行内注释忽略语法

使用 `// prettier-ignore` 将从格式中排除抽象语法树中的下一个节点。

JS:

```js
setTimeout((i) => console.log(i), 1000);

// prettier-ignore
setTimeout(i => console.log(i), 1000);
```

输出

```js
setTimeout((i) => console.log(i), 1000);

// prettier-ignore
setTimeout(i => console.log(i), 1000);
```

因为 Prettier 规则中的 `arrowParens` 默认值 `always`。关于为什么默认总是对参数加上括号，见[官网 arrowParens ](https://prettier.io/docs/en/options.html#arrow-function-parentheses)

> 乍一看，单个参数时没有括号可能是一个更好的选择，因为较少的视觉干扰。然而，当 Prettier 不添加括号时，比如在 TS 中需要添加类型注释、额外参数或默认值以及进行其他更改就会变得更加困难。所以在编辑真正的代码时，括号的一致使用提供了更好的开发人员体验，这证明选项的默认值是合理的。

```js
// 箭头函数参数括号 可选 avoid| always  默认 always
// avoid 能省略括号的时候就省略 例如 x => x
// always 总是有括号 （x)=>x
arrowParens: 'avoid',
```

HTML:

```html
<!-- prettier-ignore -->
<div         class="x"       >hello world</div            >

<!-- prettier-ignore-attribute -->
<div
  (mousedown)="       onStart    (    )         "
  (mouseup)="         onEnd      (    )         "
></div>

<!-- prettier-ignore-attribute (mouseup) -->
<div
  (mousedown)="onStart()"
  (mouseup)="         onEnd      (    )         "
></div>
```

CSS:

```css
/* prettier-ignore */
.my    ugly rule
{

}
```

## 与 IDE 集成

Prettier 与各种 IDE 集成需要安装对应的插件，这里只介绍 VS Code ，其它 IDE 参照官网安装[Prettier 与 IDE 集成](https://prettier.io/docs/en/editors.html)。

VS Code 需要安装插件 `Prettier - Code formatter`，安装完成后，有两种方式执行 Prettier 格式化：

1. 手动执行：

- Windows 快捷键 Shift+ Alt + F，快速执行格式化
- 或者快捷键 Ctrl + Shift + P 调用命令，输入 Format Document

如果 VS Code 右下角弹窗提示格式化程序冲突，可以点击配置，打开配置的 JSON 文件，设置默认格式化程序选择 Prettier

```json
 "editor.defaultFormatter": "esbenp.prettier-vscode",
```

或者只针对某种语言使用 Prettier 格式化

```json
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
"[css]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

2. 自动执行：按保存 Ctrl + S 后自动格式化

```json
// Set the default
"editor.formatOnSave": false,
// or Enable per-language
"[javascript]": {
    "editor.formatOnSave": true
}
```

## 与 Linter 工具集成

Linter 工具具体的功能和意义见[ESLint](/FE-Engineering/Lint/ESLint.html)总结。总的来说，Linter 本身的规则分为两部分：

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

所以 Prettier 无论与哪种 Linter 工具集成在一起，步骤都大致相似，有两步：

> [Perttier 与 Linter 集成步骤](https://prettier.io/docs/en/integrating-with-linters.html)

1. 在 linter 中禁用所有可能与 Prettier 格式化代码的方式冲突的规则，让 Prettier 接管这些职责。

这个覆盖配置有很多现成的 `Config-prettier` 包，比如 `eslint-config-prettier` 包是禁用 ESLint 中与 Prettier 冲突的规则的配置; `stylelint-config-prettier`包是禁用与 stylelint 中与 Prettier 冲突的规则配置。

```js
// 安装 eslint-config-prettier 禁用掉 Linter 格式式部分的规则
yarn add --dev eslint-config-prettier // eslint
yarn add --dev stylelint-config-prettier // stylelint

// 在 .eslintrc 或 .stylelintrc 增加配置项
{
  "extends": ["prettier"] // 确保 Prettier 是 extends 配置项的最后一个， prettier 是 eslint-config-prettier 或 stylelint-config-prettier 简写形式
}
```

2. 让 Linters 执行时首先能够调用 Prettier 执行格式化 code-formatting 代码风格类规则，然后再使用 ESLint / stylelint 检查 Code-quality 代码质量类规则。

这是由 Linters 的 Plugin 实现，比如 `eslint-plugin-prettier`是一个插件，它运行了使用 Prettier 格式化内容的规则。

```js
// .eslintrc 增加配置项
yarn add --dev eslint-plugin-prettier

{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}

// .stylelintrc 配置项
yarn add --dev stylelint-prettier

{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  }
}
```

3. 或者省略上面两步，直接使用 Prettier 提供的推荐配置一步到位：

```js
// 在 eslint 上使用要安装下面两个包：
yarn add --dev eslint-config-prettier eslint-plugin-prettier
// 在 .eslintrc 配置中一步到位
{
  "extends": ["plugin:prettier/recommended"]
}

// 在 stylelint 上使用要安装下面两个包
yarn add --dev stylelint-config-prettier stylelint-prettier
// 在 .stylelintrc 配置中一步到位
{
  "extends": ["stylelint-prettier/recommended"]
}

```

> 关于 Prettier 与 linter 的区别，参考：[搞懂 ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/80574300) ---讲解了两个工具不同的关注点：ESLint 主要解决的是代码质量问题、Prettier 规范代码风格问题。

## 与 Git 集成

> 引用自[Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)

IDE 整合了 Prettier 如果设置了保存自动格式基本能保证编码后代码是格式化后的。但更进一步，能不能提交代码的时候自动执行格式化？这样的话，我平时写代码根本不需要关心啥格式了，保证入库的代码让 Code Review 的人别骂我就好。

下面咱们就看看怎么样让 Git 在 Commit 前先执行 Prettier。既然要和 Git 整合，首先确保你当前的工程在用 Git。

这里需要安装两个辅助工具：

- husky：简化了对 git hooks 勾子的脚本编写
- lint-staged：限制只对已提交到 GIT 暂存区 staged 的代码进行格式化，而不是整个项目代码，这样格式更快更安全
  > 关于工具的具体总结见 [Husky](/FE-Engineering/Lint/Husky.html) 和 [lint-staged](/FE-Engineering/Lint/lint-staged.html)

1. 安装工具

```sh
npm install husky --save-dev
npm install lint-staged --save-dev
```

2. 在 packjson.json 文件中添加配置项

```json
"devDependencies": {
    "husky": "^3.0.5",
    "lint-staged": "^9.2.5"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,css,json,md}": [
      "prettier --write",
      "git add"
    ],
    "ignore": [
      "/dist/",
      "/node_modules/",
      "/static/",
      "/public/"
    ]
}
```

上面两步，也可以使用下面命令，一步完成：

```sh
# 这一行就可以安装husky和lint-stage，并且配置好husky。
npx mrm lint-staged
```

## 将 Prettier 和 ESLint 都与 Git 集成

1. 需要安装：

```sh
yarn add --dev ESLint Prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged
```

2. 然后在 `.eslintrc` 配置

```js
// 在 .eslintrc 配置中一步到位
{
  "extends": ["plugin:prettier/recommended"]
}
```

3. 最后在 `packjson.json` 中配置

```js
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "linters": {
    "src/**/*.js": [  // 匹配.js文件一下命令
      "eslint --fix", // 执行eslint进行扫描，并进行fix
      "prettier --write", //执行prettier脚本,对代码镜像格式化
      "git add" //上述两项任务完成后对代码重新add。
    ],
    "src/**/*.vue": [
      "eslint --fix",
      "stylelint --fix",
      "prettier --write",
      "git add"
    ],
    "src/**/*.scss": [
      "stylelint --syntax=scss --fix", // 也可以把 stylelint 也集成进来
      "prettier --write",
      "git add"
    ],
    "ignore": [
      "/dist/",
      "/node_modules/",
      "/static/",
      "/public/"
    ]
  }
},
```

## 参考链接

- [Prettier 官网](https://prettier.io/docs/en/index.html) --- 英文不好，用谷歌浏览器自带的网页翻译工具，还算不错
- [Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)
- [搞懂 ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/80574300)
