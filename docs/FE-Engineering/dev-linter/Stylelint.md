# Stylelint

[Stylelint 中文官网](http://stylelint.cn/)

Stylelint 是一个强大的现代 CSS 检测器，可以让你在样式表中遵循一致的约定和避免错误。

- 有超过 150 条规则，包括语言特性方面的规则，也有最佳实践的规则，以及统一代码风格的规则。
- 支持最新的 CSS 语法，如 media、calc()等函数、自定义属性等
- 支持 CSS 预处理器语法，如 SCSS / LESS 等。
- 支持自定义规则、扩展规则、插件

使用方式基本同 ESLint 一样：

[[toc]]

## 安装

```sh
# npm
npm i -D stylelint

# yarm
yarm --dev stylelint
```

## 命令行

语法：

```js
stylelint [options] [file|dir|glob]*
```

安装完成后，可以使用 `stylelint --help` 命令查看可用的 option 选项。

常用的也是 `--fix` 自动修复选项，可以对部分规则自动修复。

## 配置

同 ESLint 一样，有两种配置方式：

- 使用配置文件 Configuration Files
- 使用注释语法 Configuration Comments

### 配置文件

配置文件同样遵循 Cosmiconfig 规则，可以是以下一种：

- stylelintrc.config.js
- .stylelintrc.js
- .stylelintrc.yaml
- .stylelintrc.yml
- .stylelintrc.json
- .stylelintrc
- package.json

主要的配置项包括：

- rules
- extends
- plugins
- defaultSeverity： 全局指定所有规则的默认严重级别，warning / error
- processors: Processors 是 stylelint 的钩子函数，适用于命令行或 NODE API
- ignoreFiles: 字符串或数组，提供一个符合 glob 匹配模式的文件。也可以单独定义 `.stylelintignore` 文件

#### 规则 Rules

stylelint 有上百条规则，可以分为三类：

- Stylistic issues: 用于校对风格的规则 （主要针对空格（比如说冒号附近的空格）、换行、缩进等等）
- Limit language features： 用于判别代码可维护性的规则 （判断在 CSS 选择器中是否有使用某个 ID，或者在某条声明当中是否应用了!important 关键词）
- Possible errors：用于判断代码错误的规则 （检测错误的 HEX 颜色写法或者某条简写属性是否会覆盖其他的声明语句），规则属性是一个对象，键是规则的名称，值是规则配置。每个规则配置符合下列格式之一：
  - 单个值（primary option）
  - 一个有两个值的数组（[primary option,secondary option]）
  - null (关闭规则)

> [Rules 中文解释](https://ask.dcloud.net.cn/article/36067)

单个规则配置的值也可以自定义严格程度、错误消息、忽视范围

```js
{
  "color-hex-case": [ "lower", {
    "message": "Lowercase letters are easier to distinguish from numbers"
  } ],
  "indentation": [ 2, {
    "ignore": ["block"],
    "message": "Please use 2 spaces for indentation. Tabs make The Architect grumpy.",
    "severity": "warning"
  } ]
}
```

#### 扩展 extends

最重要的是，所有规则默认都是关闭的，同 ESLint 一样，你可以选择在 rules 字段中一条一条配置，也可以使用外部已定义好的一组规则作为扩展。官方推荐的扩展插件是 `stylelint-config-standard`

extends 的值可以是一个字符串，也可以是一个数组。当为数组时，数组第一项拥有最高优先级，会覆盖后面的，依次类推。

> 这点不同于 ESLint 中 extends 配置数组时最后一项覆盖前面的。

```js
{
  "extends": "stylelint-config-standard",
  // 数组形式
  "extends": [
    "stylelint-config-standard",
    "./myExtendableConfig"
  ],
}
```

#### 插件 plugins

插件是由社区创建的额外的规则或规则集，一个插件也是一个 npm 包，需要先安装后添加到 plugins 数组中。

一个插件可以提供一个规则或一组规则，一旦你在 "plugins" 中声明了插件，就要在 "rules" 中声明它的规则。

例如：

```js
{
  "plugins": [
    "stylelint-order"
  ],
  "rules": {
    "order/order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "rules",
      "at-rules"
    ],
}
```

> [stylelint-order](https://github.com/hudochenkov/stylelint-order/tree/3cabbecd704672377b553ccf3554e1805d4b42c3) 是一个可以自定义声明，以及属性顺序的插件。<br /> 这里有一个具体属性排序的例子 [stylelint-config-hudochenkov](https://github.com/hudochenkov/stylelint-config-hudochenkov/blob/master/order.js)

### 注释忽略语法

- stylelint-disable / stylelint-enable
- stylelint-disable-line
- stylelint-disable-next-line

上面注释语法后面都可以接具体规则名，逗号分隔

```css
/* 块语法 */
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */

/* 行语法 */
#id {
  /* stylelint-disable-line */
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

## stylelint 与 Prettier 集成

同 Prettier 与 ESLint 集成一样分成两步：

1. 禁用 stylelint 中与 Prettier 代码风格冲突的部分规则，让 Prettier 接管这些职责。

这步需要安装 `stylelint-config-prettier` 包作为 stylelint 的扩展

```js
npm i -D stylelint-config-prettier

{
  "extends": ["standard", "prettier"]
}
```

2. 让 stylelint 执行时能先执行 Prettier 格式，再执行可以导致错误的规则

这步需要安装 `stylelint-pretter`

```js
npm install --save-dev stylelint-prettier

{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  }
}
```

或者一步到位的配置：

```js
{
  "extends": ["stylelint-prettier/recommended"]
}
```

## `stylelint-order`推荐排序规则
常用排序规则：1. Positioning  2. Box Model   3.Visual  4. Typography    5. Animation  6. Misc
```js
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-order'],
  rules: {
    'no-descending-specificity': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'], // 忽略 .vue 中使用的 ::v-deep
      },
    ],
    // 定义声明顺序： $themeColor @extend .class 
    'order/order': ['dollar-variables', 'custom-properties', 'at-rules', 'declarations', 'rules'],
    'order/properties-order': [
      'content',
      // Positioning 位置布局
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'vertical-align',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-wrap',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'grid-template-rows',
      'grid-template-columns',
      'grid-row',
      'grid-row-start',
      'grid-row-end',
      'grid-column',
      'grid-column-start',
      'grid-column-end',
      'grid-auto-rows',
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-gap',
      'grid-row-gap',
      'grid-column-gap',
      'gap',
      'row-gap',
      'column-gap',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'justify-items',
      'justify-self',
      'order',
      'float',
      'clear',
      'object-fit',
      'overflow',
      'overflow-x',
      'overflow-y',
      'overflow-scrolling',
      'clip',

      // Box Model 盒子模型
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-spacing',
      'border-collapse',
      'border-width',
      'border-style',
      'border-color',
      'border-top',
      'border-top-width',
      'border-top-style',
      'border-top-color',
      'border-right',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'border-left',
      'border-left-width',
      'border-left-style',
      'border-left-color',
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-image',
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
      'border-top-image',
      'border-right-image',
      'border-bottom-image',
      'border-left-image',
      'border-corner-image',
      'border-top-left-image',
      'border-top-right-image',
      'border-bottom-right-image',
      'border-bottom-left-image',

      // Visual 视觉效果
      'background',
      'background-color',
      'background-image',
      'background-attachment',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-clip',
      'background-origin',
      'background-size',
      'background-repeat',
      'color',
      'box-decoration-break',
      'box-shadow',
      'outline',
      'outline-width',
      'outline-style',
      'outline-color',
      'outline-offset',
      'table-layout',
      'caption-side',
      'empty-cells',
      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',

      // Typography 字体排版
      'font',
      'font-weight',
      'font-style',
      'font-variant',
      'font-size-adjust',
      'font-stretch',
      'font-size',
      'font-family',
      'src',
      'line-height',
      'letter-spacing',
      'quotes',
      'counter-increment',
      'counter-reset',
      '-ms-writing-mode',
      'text-align',
      'text-align-last',
      'text-decoration',
      'text-emphasis',
      'text-emphasis-position',
      'text-emphasis-style',
      'text-emphasis-color',
      'text-indent',
      'text-justify',
      'text-outline',
      'text-transform',
      'text-wrap',
      'text-overflow',
      'text-overflow-ellipsis',
      'text-overflow-mode',
      'text-shadow',
      'white-space',
      'word-spacing',
      'word-wrap',
      'word-break',
      'overflow-wrap',
      'tab-size',
      'hyphens',
      'interpolation-mode',

      //
      'opacity',
      'visibility',
      'filter',
      'resize',
      'cursor',
      'pointer-events',
      'user-select',

      //
      'unicode-bidi',
      'direction',
      'columns',
      'column-span',
      'column-width',
      'column-count',
      'column-fill',
      'column-gap',
      'column-rule',
      'column-rule-width',
      'column-rule-style',
      'column-rule-color',
      'break-before',
      'break-inside',
      'break-after',
      'page-break-before',
      'page-break-inside',
      'page-break-after',
      'orphans',
      'widows',
      'zoom',
      'max-zoom',
      'min-zoom',
      'user-zoom',
      'orientation',
      'fill',
      'stroke',

      // Animation 过渡/动画
      'transition',
      'transition-delay',
      'transition-timing-function',
      'transition-duration',
      'transition-property',
      'transform',
      'transform-origin',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-play-state',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
    ],
  },
}

```
