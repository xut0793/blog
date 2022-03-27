# 编码规范

JavaScript 是一个动态的弱类型语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行时才发现，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试，这给我们代码调试工作增加了负担。而遵循良好的编码规范，同时配合 ESLint + Prettier 这样的工具，可以让程序员在编码的过程中发现问题而不是在执行的过程中。

> 代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

良好的编码规范，主要目的是用来解决两个问题：

- 代码质量：这方面主要体现在规避语言特性的不恰当使用产生的潜在问题 (problematic patterns)
- 代码风格：这方面主要体现在团队协作中代码风格的一致性，可以在项目维护和交接上更有效率 (doesn’t adhere to certain style guidelines)

## 规范

JS 语言的编码规范没有官方标准，但是大公司中一般都有其自己沉淀的一套代码规范。目前在社区较为流行的几种 JavaScript 规范：

- [Airbnb JavaScript Style Guide 中文版](https://lin-123.github.io/javascript/)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [JavaScript Standard Style Guide](https://github.com/standard/standard)
- [Idiomatic JavaScript Style Guide](https://github.com/rwaldron/idiomatic.js)
- [jQuery JavaScript Style Guide](https://contribute.jquery.org/style-guide/js/)

其中 [Airbnb JavaScript Style Guide 中文版](https://lin-123.github.io/javascript/) 值得参考，需要仔细看看。

另外，还有国内大公司前端团队的一些内部规范：

[京东凹凸前端规范-JS](https://guide.aotu.io/docs/js/language.html)

这些规范里定义的规则，可以按照上面需要解决的两个问题，划分为：

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

## 工具

> 与其费尽心思地告诉别人要遵守某种规则，以规避某种痛苦，倒不如从工具层面就消灭这种痛苦

工具链：

1. [EditorConfig](./EditorConfig/)
1. [ESLint](./ESLint/)
1. [Prettier](./Prettier/)
1. [Stylelint](./Stylelint/)
1. [Husky](./Husky/)
1. [lint-staged](./lint-staged/)

关于各个工具的具体介绍和总结，可以点击查看详情。

### EditorConfig

1. .editorconfig

EditorConfig 旨在帮助开发人员在不同的编辑器或 IDE 之间保持一致的编码风格。

VS Code 编辑器需要安装插件：EditorConfig for Visual Studio Code

### ESLint

JavaScript 作为一门动态语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行才发现，这给我们调试工作增加了一些负担，而 Lint 工具相当于为语言增加了编译过程，在代码运行前进行静态分析找到出错的地方。

所以 Lint 工具的意义：

1. 避免低级 bug，找出可能发生的语法错误。比如：使用未声明变量、修改 const 变量……
2. 提示删除多余的代码。比如：声明而未使用的变量、重复的 case ……
3. 确保代码遵循最佳实践，如参考 airbnb style、javascript standard 等实践指南
4. 统一团队的代码风格。比如：加不加分号？使用 tab 还是空格等，这部分主要可以由 Prettier 完成，后面讲。

配置文件：

1. .eslintrc.js
1. .eslintignore

### Prettier

Prettier 是一个强制性的代码格式化程序。采用 Prettier 的最大原因是停止所有有关样式的持续辩论（要不要有分号，缩进用空格还是制表符等），而统一遵循 Prettier 提供的默认规则格式化代码。

Prettier 的设计初衷和原则，也是它的意义所在：

- 停止浪费时间来讨论代码风格
- 纯粹写代码，不要花时间在格式化上
- 配置最小化，让它更容易实施，而且格式化速度非常快
- 基本支持前端生态链上的大部分语言风格

配置文件：

1. .prettierrc.js
1. .prettierignore

### Stylelint

Stylelint 是一个强大的现代 CSS 检测器，可以让你在样式表中遵循一致的约定和避免错误。用法和规则基本与 ESLint 一样。

- 有超过 150 条规则，包括语言特性方面的规则，也有最佳实践的规则，以及统一代码风格的规则。
- 支持最新的 CSS 语法，如 media、calc()等函数、自定义属性等
- 支持 CSS 预处理器语法，如 SCSS / LESS 等。
- 支持自定义规则、扩展规则、插件

配置文件：

1. .stylelintrc.js
1. .stylelintignore

### Husky

> Husky can prevent bad git commit, git push and more 🐶 woof!

Husky 能够帮你阻挡住不好的代码提交和推送。使用 Husky 简化了对 git hooks 的操作，不用繁琐的自己去配置 git hook 各阶段勾子的脚本文件了，只要提供对应的 npm script 操作就好。

### lint-staged

lint-staged 从名字可以看区，只校验 lint 提交到暂存区 staged 的代码。即每次只对当前修改后进行 git add 加入到 stage 区的文件进行扫描校验，避免对项目中进行全项目扫描所会增加了检查复杂度和时长，我们只需要检查我们要提交的代码就可以了。


## 参考链接

- [深入理解 ESLint](https://zhuanlan.zhihu.com/p/75531199) ---讲解了：lint 工具简史（JSLint/JSHint/ESLint)、Lint 工具的意义、ESLint 的使用。结尾的参考资料也值得看看[ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
- [Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012) ---讲解了：为什么用 Prettier、什么是 Prettier、使用 Prettier
- [搞懂 ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/80574300) ---讲解了两个工具不同的关注点：ESLint 主要解决的是代码质量问题、Prettier 规范代码风格问题。
- [editorconfig github](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties) --- 英文
- [使用.editorconfig 规范编辑器编码规范](https://blog.sesine.com/2018/12/14/editorconfig/) --- 中文
- [Husky github](https://github.com/typicode/husky)
- [使用 husky 和 lint-staged 来构建你的前端工作流](https://www.jianshu.com/p/1d0951a7ee2c)
- [前端代码规范最佳实践](https://mp.weixin.qq.com/s/p97k6hjKvU0uC8ocYLhQvA)
- [eslint+husky+prettier+lint-staged 提升前端应用质量](https://juejin.im/post/5c67fcaae51d457fcb4078c9)
- [前端工程化之——代码规范五部曲](https://blog.csdn.net/dudufine/arhttps://efe.baidu.com/tags/Lint/ticle/details/106323543)
- [前端代码风格检查套件 FECS](https://efe.baidu.com/tags/Lint/)--比较了 HTML / css / js 各种 lint 工具
