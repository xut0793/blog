
# 工具链整合配置

如何在项目中集成 EditorConfig + ESLint + Prettier + Stylelint + Husky + lint-staged 的整条工具链，并实现自动化的代码校验。

主要为三个层次：

1. IDE 集成: .editorconfig、ESLint、Prettier
2. Git 集成：husky、lint-staged
3. CI 集成：npm run lint

## 1. 统一 IDE 配置 EditorConfig

- VS Code 需要安装插件 `EditorConfig for VS Code`，然后在项目根目录下右键，点击最右的菜单项： `Generate .editorconfig`，直接生成 .editorconfig 文件。

```
# editorconfig.org
root = true

[*]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

# Markdown 语言中尾随空格是有意义的，比如行尾两个空格相当控行, 2 trailing spaces = linebreak (<br />)，所以我们要特殊指定忽略
# See https://daringfireball.net/projects/markdown/syntax#p
[*.md]
trim_trailing_whitespace = false
```

- VS Code 安装 `Prettier-Code formatter` `ESLint` `stylelint` 插件

安装后，调整相关配置，最终配置文件:

```json
"editor.tabSize": 2,
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
```

## 2. 使用 Prettier 作为统一代码风格

- 安装

```
npm install --save-dev --save-exact prettier
```

- 配置文件 .pretterrc.js

视自己需要更改

```js
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

- 忽略文件 .prettierignor

```
/dist/
/node_modules/
/static/
/public/
```

## 3. 使用 ESLint 校验 JS 类代码质量

- 安装：因为需要与 Prettier 集成，所以相关插件也要安装

```js
npm i -D eslint babel-eslint eslint-config-aribnb eslint-config-prettier eslint-plugin-prettier
```

- 配置文件 .eslintrc.js

```js
module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:vue/essential", "aribnb", "plugin:prettier/recommended"],
  // required to lint *.vue files
  plugins: ["vue", "prettier"],
  // add your custom rules here
  rules: {
    // allow async-await
    "no-console": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
```

- 排除文件 .eslintignor

```
# .eslintignor
/node_modules/
/build/
/public/
/dist/
src/assets/
```

## 4. 使用 Stylelint 校验 CSS 类代码

- 安装：因为需要与 Prettier 集成，所以相关插件也要安装

```
npm i -D stylelint stylelint-config-standard stylelint-order stylelint-config-prettier stylelint-plugin-prettier
```

- 配置文件 .stylelintrc.js

```js
module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-prettier/recommended",
  ]
  "plugins": [
    "stylelint-order",
  ],
  "rules": {
    "order/order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "rules",
      "at-rules"
    ],
    "order/properties-order" : [
      "display",
      "position",
      ...
    ]
  }
}
```

- 忽略文件 .stylelintignor

```
# .eslintignor
/node_modules/
/build/
/public/
/dist/
src/assets/
```

## 5. 集成到 Git 流程中

- 安装 Husky 和 lint-staged

```
npm i -D husky lint-staged
```

- 配置

在 package.json 中配置：

```js
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged" // 在代码commit前执行将加入到stage暂存区的文件进行检查，按照下面"lint-staged"中的规则进行检查
    }
  },
  // 对staged的文件进行lint，避免对整个项目进行lint代码庞大且缓慢
  "lint-staged": {
    "linters": {
      "src/**/*.js": [  // 匹配.js文件一下命令
        "eslint --fix", // 执行eslint进行扫描进行fix
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
        "stylelint --syntax=scss --fix",
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
}
```

现在新版本，也可以便 ESLint 一样单独指定配置文件`huskyrc.js` `lintstagedrc.js`。

```js
// huskyrc.js
module.exports = {
  hooks: {
    "pre-commit": "lint-staged",
  },
};
```

```js
// lintstagedrc.js
module.exports = {
  "src/**/*.js": [
    // 匹配.js文件一下命令
    "eslint --fix", // 执行eslint进行扫描进行fix
    "prettier --write", //执行prettier脚本,对代码镜像格式化
    "git add", //上述两项任务完成后对代码重新add。
  ],
  "src/**/*.vue": [
    "eslint --fix",
    "stylelint --fix",
    "prettier --write",
    "git add",
  ],
  "src/**/*.scss": [
    "stylelint --syntax=scss --fix",
    "prettier --write",
    "git add",
  ],
  ignore: ["/dist/", "/node_modules/", "/static/", "/public/"],
};
```

## 参考链接
- [eslint+husky+prettier+lint-staged 提升前端应用质量](https://juejin.im/post/5c67fcaae51d457fcb4078c9)
- [前端工程化之——代码规范五部曲](https://blog.csdn.net/dudufine/arhttps://efe.baidu.com/tags/Lint/ticle/details/106323543)