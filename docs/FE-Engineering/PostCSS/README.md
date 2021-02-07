# PostCSS

[[toc]]

**WWHD**方法论：
- wath: 是什么
- why: 解决什么问题
- how: 怎么使用
- deep: 深入理解

## What: Postcss 是什么

> Postcss 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。

简单说，`Postcss` 是一个用来转换 CSS 代码的工具。

如果你熟悉 `Babel`，知道它能将 JS 语法转译成 AST，供插件处理。那么同样的 `Postcss` 能将 CSS 语法转译成 AST，供其插件处理。

`Postcss`作为一个 css 转换工具，基于 Node 环境，使用 ES 语言开发，核心功能代码很小，只包括: 
- `Parser`: css 解析器
- `AST API`：供插件操作 css AST 操作的 API
- `Stringifier`: 将 css AST 转回普通 CSS 的拼接器
- `sourcemap` 生成器: 记录前后的字符对应关系

## Why: 解决什么问题

要谈到CSS的不足：没有变量(新的规范已经支持了)，不支持嵌套，编程能力较弱，代码复用性差。这些不足导致写出来的 CSS 维护性极差，同时包含大量重复性的代码；

为了弥补这些不足之处，CSS 预编译器应运而生。主流的 CSS 预编译器：Sass、Less、Stylus，这些预处理器提供了很多实用的功能：变量、混入、函数、嵌套等。

> Sass：2007年诞生，最早也是最成熟的CSS预处理器，拥有ruby社区的支持和compass这一最强大的css框架，目前受LESS影响，已经进化到了全面兼容CSS的SCSS。
>Less：2009年出现，受SASS的影响较大，但又使用CSS的语法，让大部分开发者和设计师更容易上手，在ruby社区之外支持者远超过SASS，其缺点是比起SASS来，可编程功能不够，不过优点是简单和兼容CSS，反过来也影响了SASS演变到了SCSS的时代，著名的Twitter Bootstrap就是采用LESS做底层语言的。
>Stylus：2010年产生，主要用来给Node项目进行CSS预处理支持，在此社区之内有一定支持者，在广泛的意义上人气还完全不如SASS和LESS。

但使用这些预处理器通常会有以下问题：
- 使用 Sass 需求安装 Ruby 和 compass 以提供支持，使用 Scss 也需求安装 node-sass 依赖，而不能基于项目已有的 Node 环境流畅应用。
- 简单项目中往往只使用了预处理器的极少数功能，但却需要安装完整的预处理器。
- 预处理器编译样式速度慢。

另外，因为 CSS 语言规范与浏览器实现之间存在的差异和各浏览器兼容性问题，预处理器无法处理，需要另外的工具解决。

Postcss 是一个基于 node 构建的工具，预处理器的问题在 Postcss 上可以很好的解决，并且只用 Postcss 一个工具即可以实现预处理器的功能，也能解决浏览器兼容性问题，并且能提前使用浏览器暂未实现的 CSS 语法。
```js
// 对同一段涉及嵌套规则、变量和计算的代码的测试数据
// 数据来源：https://www.w3cplus.com/PostCSS/postcss-deep-dive-what-you-need-to-know.html
PostCSS: 36 ms
Rework: 77 ms (2.1 times slower) 
libsass: 136 ms (3.8 times slower) 
Less: 160 ms (4.4 times slower) 
Stylus: 167 ms (4.6 times slower) 
Stylecow: 208 ms (5.7 times slower) 
Ruby Sass: 1084 ms (30.1 times slower)
```
## How: 如何使用

Postcss 同其它 js 工具一样，遵循了大部分 js 工具库类似的结构，提供了以下工具：
- 核心功能库：[postcss](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- 命令行工具：[postcss-cli](https://github.com/postcss/postcss-cli)
- 配置文件： postcss.config.js
- 插件体系： plugins
- 兼容构建工具包： webpack 的 postcss-loader、 glup 的 glup-postcss、rollup 的 rollup-plugin-postcss 等。

### postcss-cli 命令行工具

安装：
```sh
npm i -D postcss postcss-cli
```

例子：
```sh
postcss input.css -o output.css                       # 基本使用
postcss src/**/*.css --base src --dir build           # Glob Pattern 匹配文件，并指定输出目录
postcss input.css -u autoprefixer -o output.css       # 使用插件 Piping 
```


具体命令行可用的参数：
> 因为 github 官方仓库 README.md 写的非常清楚，但是英文，所以这里作下中文翻译。具体见官方仓库 [https://github.com/postcss/postcss-cli#usage](https://github.com/postcss/postcss-cli#usage)
```
Usage 用法:
  postcss [input.css] [OPTIONS] [-o|--output output.css] [--watch|-w]
  postcss <input.css> [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input-directory> [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input-glob-pattern> [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input.css> [OPTIONS] --replace 

Basic options 基本选项参数，这些选项参数在存在配置文件 postcss.config.js 时也可以用:
  -o, --output   Output file 指定输出文件，没有会自动创建                                          [string]
  -d, --dir      Output directory 指定输出目录                                                    [string]
  -r, --replace  Replace (overwrite) the input file 输出的内容直接在输入文件中替换                 [boolean]
  -m, --map      Create an external sourcemap 将 soucemap 生成独立的文件
  --no-map       Disable the default inline sourcemaps 禁掉默认生成行内的 sourcemap 功能
  -w, --watch    Watch files for changes and recompile as needed   是否对输入文件开启监听         [boolean]
  --verbose      Be verbose  开启详情转译，默认 false                                             [boolean]
  --env          A shortcut for setting NODE_ENV   指定转译环境变量 NODE_ENV                      [string]

Options for use without a config file 不需求配置文件的选项参数
  -u, --use      List of postcss plugins to use  指定插件，一旦命令行中使用了这个选项参数，postcss 将不会读取配置文件，源码中判断有 options.use，直接 return     [array]
  --parser       Custom postcss parser      手动指定第三方的 CSS 解析器 parser，默认使用 postcss 内部提供的。                            [string]
  --stringifier  Custom postcss stringifier 手动指定第三方的 AST 转成普通 CSS 的拼接器，默认使用 postcss 内部提供的。                    [string]
  --syntax       Custom postcss syntax      手动指定第三方的 CSS 语法转译器，syntax 其时就是一个同时包含 parser 和  stringifier 的对象库 [string]

Options for use with --dir 配合 --dir 参数的两个选项:
  --ext   Override the output file extension; for use with --dir 指定输出文件的扩展名，和 --dir 一起使用       [string]
  --base  Mirror the directory structure relative to this path in the output directory, for use with --dir  输出与输入匹配文件一样的目录结构，与 --dir 一起使用，此时通常使用 Glob Pattern 匹配输入文件   [string]

Advanced options 高级选项参数:
  --include-dotfiles  Enable glob to match files/dirs that begin with "."  开启匹配以 . 开始的文件或目录           [boolean]
  --poll              Use polling for file watching. Can optionally pass polling interval; default 100 ms 当开启 --watch 时，可以指定使用轮询监听文件，可以指定轮询间隔时间，单位毫秒，默认 100ms
  --config            Set a custom directory to look for a config file  指定 postcss 对配置文件 postcss.config.js 的查询的路径  [string]

Options 其它选项:
  --version   Show version number  查看版本号            [boolean]
  -h, --help  Show help            显示帮助信息          [boolean]

If no input files are passed, it reads from stdin. If neither -o, --dir, or --replace is passed, it writes to stdout.
如果没有指定输入文件，会读取 node stdin 命令行输入的内容。如果也没有指定输入文件 -o 或输出路径 -d，或者替换输入文件 -r，则将输出到命令行终端

If there are multiple input files, the --dir or --replace option must be passed.
如果输入多个文件，则输出必须指定为目录 --dir 或替换输入 --replace

Input files may contain globs (e.g. src/**/*.css). If you pass an input directory, it will process all files in the directory and any subdirectories, respecting the glob pattern.
如果使用 globs 模式指定输入输入文件，它将匹配目录中所有文件和其中的子目录文件。
```

### postcss.config.js 配置文件

通过命令行传入插件有限，如果需要配置更多插件完成功能，最好使用配置文件的形式。

在项目根目录下创建 `postcss.config.js` 配置文件，它可以使用 common.js 语法导出一个对象，也可以导出一个函数。

其中插件 plugins 配置是必须的，其它为可选配置。

**并且插件的声明顺序也是非常重要的，有些插件严重依赖前后插件的顺序才能正确执行。**
```js
// 导出对象
module.exports = {
  map: ?Boolean,
  parser: ?String,
  stringifier: ?String,
  syntax: ?String,
  // plugins 可以为数组形式或对象，但对象形式更多用在导出为函数时，因为可以通过函数入参判断判断需不需要
  plugins: [
    plugin(pluginOptions),
    // 更多插件
  ],
}
```

更高级的用法，配置文件也可以导出一个函数，此时函数接爱一个当前 postcss-cli 运行上下文的入参 `ctx`。

```js
module.exports = (ctx) => ({
  map: ?Boolean,
  parser: ?String,
  stringifier: ?String,
  syntax: ?String,
  plugins: {

  }
})
```
这里 `ctx` 对象里可用的属性有：
```js
ctx = {
  env:'development', // 获取当前运行的环境变量 process.env.NODE_ENV，默认 development
  file: {
    dirname: String, // input file 输入文件的目录
    basename: String, // input file 输入文件名
    extname: String, // input file 输入文件的扩展名
  },
  options: { // options 是命令行上传入的参数
    map: Boolean, // 是否开启 sourcemap
    parser: String, // 指定第三方解析器
    stringifier: String, // 指定第三方拼接器
    syntax: String, // 指定第三方语法转译器，包含解析器和拼接器
  }
}
```

假如命令行使用如下：
```sh
NODE_ENV=production postcss input.sss -p sugarss -o output.css -m 
```
则配置文件导出函数的入参 ctx 为：
```js
ctx = {
  env:'production',
  file: {
    dirname: '/some/path',
    basename: 'input.sss',
    extname: '.sss',
  },
  options: { // options 是命令行上传入的参数
    map: true,
    parser: 'sugarss',
    stringifier: undefined,
    syntax: undefined,
  }
}
```
此时，我们在配置文件导出函数中，可以利用 ctx 传入的环境变量，或者其它参数来决定插件的使用或者是否需要开启 sourcemap。
```js
module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
  plugins: { // plugin 选项值使用对象时，如果插件属性值为对象，则启用，如果为 false，则不被启用。
    'postcss-import': { root: ctx.file.dirname },
    cssnano: ctx.env === 'production' ? {} : false,
  },
})
```
### plugin 插件

截止到目前，PostCSS 有 200 多个插件。你可以在 [插件列表](https://github.com/postcss/postcss/blob/main/docs/plugins.md) 或 [搜索目录](http://postcss.parts/) 找到它们。

常用的插件：
- postcss-preset-env 允许你使用未来的 CSS 特性。
- autoprefixer 添加了 vendor 浏览器前缀，处理浏览器兼容问题，它使用 Can I Use 上面的数据。
- postcss-sorting 给CSS 规则的内容以及@规则指定排序。
- postcss-sprites 能生成雪碧图。
- postcss-assets 可以插入图片尺寸和内联文件。
- stylelint 是一个模块化的样式提示器。
- stylefmt 是一个能根据 stylelint 规则自动优化 CSS 格式的工具。
- cssnano 是一个模块化的 CSS 压缩器。

### syntax 语法

postcss 默认提供了默认解析器 `parser` 来转换常规书写的 CSS 语法, 如果我们需要支持类似 scss / less / stylus 这类预处理器的书写语法，可以指定第三方的解析器：
- sugarss 是一个以缩进为基础的语法，类似于 Sass 和 Stylus。
- postcss-jsx 解析源文件里模板或对象字面量中的CSS。
- postcss-scss 允许你使用类 SCSS 语法 (但并没有将 SCSS 编译到 CSS)。
- postcss-sass 允许你使用类 Sass 语法 (但并没有将 Sass 编译到 CSS)。
- postcss-less 允许你使用类 Less 语法 (但并没有将 LESS 编译到 CSS)。
- postcss-less-engine 允许你使用 Less (并且使用真正的 Less.js 把 LESS 编译到 CSS)。
- postcss-js 允许你在 JS 里编写样式，或者转换成 React 的内联样式／Radium／JSS。

同样的，postcss 默认提供了默认拼接器 `stringifier` 来将 AST 拼接成常规的 CSS 语法规格输出。但如果你想转换输出其它格式，可以指定第三方的拼接器：
- midas 将 CSS 字符串转化成高亮的 HTML。

但大多数情况下，会指定第三方的解析器 parser 以实现类似预处理器的功能，但基本不会改变拼接器 stringifier，因为最终还是要输出浏览器可用的 css 文件。

### postcss API

在编写一些工具库或脚手架代码时，可能会直接使用导入的 postcss 对象。我们如何直接使用 postcss API。

```js
const postcss = require('postcss')

// postcss 函数入参接受一个插件数组，返回一个运行器对象
const processor = postcss(plugins) // 如 plugins = [precss, autoprefixer]
// 调用运行对象的 process 函数执行转译工作，接受 CSS 源文件和一个选项配置对象，返回一个 promise 对象
const css = fs.readFileSync('src/app.css')
const promiseResult = processor.process(css, options)
promiseResult.then((result) => {
  fs.writeFile('dest/app.css', result.css)
  if ( result.map ) fs.writeFile('dest/app.css.map', result.map)
})

// 其中 opstions 对象可配置的属性有：
const options = {
  syntax: String, // 一个提供了语法解释器和 stringifier 的对象。
  parser: 'sugarss', // 一个特殊的语法解释器（例如 SCSS）。
  stringifier: 'Midas', // 一个特殊的语法 output 生成器（例如 Midas）。
  map: true, // source map 选项.
  from: 'src/app.css', // input 文件名称, 如果是结合其它运行器，如 webpack / gulp 等，大多数运行器自动设置了该选项，所以配置文件也没有该属性，由运行器自行设置。
  to: 'dest/app.css', //  output 文件名称，同样大多数运行器自动设置了这个，所以配置文件也没有该属性，由运行器自行设置。
}
```

## 实践

- 使用 postcss 结合对应插件，实现一个 less 预处理器的功能
- CSS 代码规范校验、属性排序
- 使用 CSS next 语法



## Deep：深入理解 Postcss

### postcss 简要原理

`.css` 文件的组成：
- 由一条条的样式规则 `rule` 组成；
- 每一条样式规则又包含选择器 `selector` 和一条或多条声明`declaration`组成；
- 声明由属性`property`和属性值`value`定义。

`ruel = selector + declaration (property:value)`

`PostCSS`的执行过程是：
1. 读取 css 文件，由解析器`Parser`进行解析，得到一个完整的 CSS AST（树状的 json 对象）；
2. 接下来，对该 AST 的操作由配置的一系列插件进行，postcss 只提供操作 AST 的方法。
3. 最后，将一系列插件处理后的 AST ，通过 `Stringifier` 转接器重新组成浏览器可识别的普通 css 代码。
4. 期间可生成 source map 表明转换前后的字符对应关系。


```
----------         ----------         ----------         ---------------
| Parser | ----->  | Plugin |  -----> | Plugin |  -----> | Stringifier |
----------         ----------         ----------         ---------------
source css                                                  new css

```
> 如果Sass / Less 等预编译器是重新定义了一种 CSS 模板语言，然后将其转化为普通 css的话，PostCSS则是更纯粹地只对 css 本身进行做转换。

在这个网站 [AST Explorer](https://astexplorer.net/)可以查看一段简单的 CSS 代码转换成 AST 对象的样子。
```css
body {
  color: lightgreen;
}
```
转换器`Parser` 是 `Postcss` 内置的，也可以选择第三方解析器。
```json
// AST 对象, 以下代码删除了一些 sourcemap 相关代码
{
  "type": "root", // 根节点
  "nodes": [
    {
      "type": "rule", // 单条规则 body {color: lightgreen;}
      "selector": "body", // 选择器
      "nodes": [
        {
          "type": "decl", // 单条声明 color:lightgreen
          "prop": "color", // 属性
          "value": "lightgreen" // 属性值
        }
      ],
    }
  ],
}
```

在PostCSS中有几个关键的处理机制：

其中 Tokenizer 和 Parser 是 PostCSS 默认解析器包含两个步骤。
```
Source css → Tokenizer → Parser → AST → Processor(plugins) → Stringifier → new css
```

1. Tokenizer: 将源 css 字符串进行分词

Tokenizer 逐字符读入输入的字符串，建立一个令牌数组。

例如，它将空格符号连接到['space', ' ']令牌，将检测到字符串添加到['word', '.className']令牌。
```css
.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

参考 
- [https://www.jianshu.com/p/9a9048bc8978](https://www.jianshu.com/p/9a9048bc8978)
- [如何编写自定义语法](https://postcss.docschina.org/doc/syntax.html)

### 自定义插件

[PostCSS 插件指南](https://postcss.docschina.org/doc/guidelines/plugin.html#_1-api)

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/.className { color: #FFF; }
```
通过Tokenizer后结果如下：
```js
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```
以word类型为例，参数如下：
```js
[
  // token 的类型，如 word、space、comment { : }
  'word',

  // 匹配到的词名称
  '.className',

  // 代表该词开始位置的 row 以及 column，但像 type为`space`的属性没有该值
  1, 1,

  // 代表该词结束位置的 row 以及 column，
  1, 10
]
```
2. Parser: 读取令牌数组，创建节点实例并生成 AST 对象。

```js
this.root = {
  "type": "root",
  "source": {
    "input": {
      "css": ".className { color: #FFF; }",
      "hasBOM": false,
      "id": "<input css 8>"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
  "raws": {
    "semicolon": false,
    "after": ""
  },
  "nodes": [
    {
      "type": "rule",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": ".className { color: #FFF; }",
          "hasBOM": false,
          "id": "<input css 8>"
        },
        "end": {
          "line": 1,
          "column": 27
        }
      },
      "raws": {
        "before": "",
        "between": " ",
        "semicolon": true,
        "after": " "
      },
      "selector": ".className"
      "nodes": [
        {
          "raws": {
            "before": " ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 1,
              "column": 14
            },
            "input": {
              "css": ".className { color: #FFF; }",
              "hasBOM": false,
              "id": "<input css 8>"
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "prop": "color",
          "value": "#FFF"
        }
      ],
    }
  ],
}
```

3. Processor

经过AST之后，就是一系列插件作用的阶段，PostCSS 提供了大量操作 AST 对象的 API给插件调用。

4. Stringifier

插件处理后，比如加浏览器前缀，会被重新`Stringifier.stringify`为一般 CSS。

## 参考链接
- [postcss 中文 README](https://github.com/postcss/postcss/blob/main/docs/README-cn.md)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-load-config](https://github.com/postcss/postcss-load-config/blob/master/src/index.js)
- [Ast Explorer/](https://astexplorer.net/)