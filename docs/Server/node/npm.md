# NPM

[[toc]]

## npm 是什么

npm 全称是 Node Package Manager，译为 Node 包管理器。

包管理器又称软件包管理系统，它是在电脑中自动安装、配制、卸载和升级软件包的工具组合，在各种系统软件和应用软件的安装管理中均有广泛应用。对于我们业务开发也很受益，相同的东西不必重复去造轮子。每个工具或者开发语言都有相应的包管理器，好比 Ubuntu 的 apt-get、Centos 的 yum、Java 的 Maven 仓库等等。Node.js 中目前最出名的包管理器为 NPM 也是生态最好的。

试想没有一个中心化的包管理系统，我们开发一个项目需要安装项目依赖是什么样的场景：

1. 去 jQuery 官网下载 jQuery
1. 去 BootStrap 官网下载 BootStrap
1. 去 Underscore 官网下载 Underscore
1. ……

项目初始化时可能要花很大部分时间去挑选合适的依赖，下载后还要解决各个依赖的间的冲突，想想都受不了。所以一个解决方案就是用一个工具把这些代码集中到一起来管理！

## npm 包括什么

在程序员使用层面，我们更熟悉的是 npm 命令行，但实际上 npm 包括的远不止这些，或者说 npm 更大的价值在于：一个中心化的代码包注册中心和仓库

- npm 注册中心 (registry)：是一个巨大的数据库，保存了每个包（package）的信息
- npm 仓库 （https://www.npmjs.com/)：提供了代码包的检索和下载
- npm 命令行工具 (CLI)：命令行或终端运行，开发者更多关注的是 npm CLI 命令行工具的使用

> npm 的闪光点在于，它不只是一个脚手架工具而已，它的功能不限于找到代码包然后“咣当”一声下载到本地的 node_modules 文件夹里。事实上，尽管大家如此频繁地使用 npm 的脚手架功能，但那可能是 npm 这套“机甲”最无足轻重的功能。npm 更主要是一个中心化的代码包注册中心和仓库。这个注册中心从一开始就存在，运行在一个 CouchDB 数据库中，绑定的就是如今用的这个域名。“注册中心”就是一个列有大量 JavaScript 代码包及其名称、作者以及版本号的清单。注册中心使得 Node 代码包易于查找，安装起来快速可靠。 ---- [NPM的经济风云（上）](https://mp.weixin.qq.com/s/eUpXSk1pEoZCRKZc6bPgSw)

npm 的安装官方绑定在 node 安装程序中，所以无需特别下载，在 node 安装完成后即可查看 npm 是否安装成功：`npm --version`

## npm 的历史

- [NPM的经济风云（上）](https://mp.weixin.qq.com/s/eUpXSk1pEoZCRKZc6bPgSw)
- [NPM的经济风云（下）](https://mp.weixin.qq.com/s/GSLSqUA6FmkpKVkiL0cm_g)
- [npm 沦为金钱工具背后的故事](https://mp.weixin.qq.com/s/xOy5c3sELTmI-soLMMebLA)


## npm 包版本规范：语义版本控制 Semver

语义化版本控制 Semantic Versioning，简称 Semver。主要规范：`major.minor.patch[.alpha/beta/rc]`
- 主版本号(major/ˈmeɪdʒər/)：当你做了不兼容的 API 修改，
- 次版本号(minor/ˈmaɪnər/)：当你做了向下兼容的功能性新增，可以理解为Feature版本，
- 修订号(patch//pætʃ/)：当你做了向下兼容的问题修正，可以理解为Bug fix版本。
- 先行版本号及版本编译信息作为可选项，可以加到“主版本号.次版本号.修订号”的后面，作为延伸。
  - alpha: 内部版本
  - beta: 公测版本
  - rc: 即Release candiate，正式版本的候选版本

npm 包依赖关系表示：
- 兼容模块新发布的补丁版本：~16.2.0
- 兼容模块新发布的小版本、补丁版本：^16.2.0
- 兼容模块新发布的大版本、小版本、补丁版本：*

升级版本号使用 npm 命令操作：
- 升级补丁版本号：npm version patch
- 升级小版本号：npm version minor
- 升级大版本号：npm version major

[Semver 中文官网](https://semver.org/lang/zh-CN/)
[Semver(语义化版本号)扫盲](https://cloud.tencent.com/developer/article/1651122)

## npm config 配置

npm CLI 提供了三种方式来配置 npm：
- npm config： 通过 npm config ls 可查看 npm 的所有配置中覆盖默认值的新配置，即 .npmrc 文件中自定义的配置； npm config ls -l/-json 可以查看npm 所有默认配置; npm config set variable value 设置变量值；npm config get variable 查看变量值；npm config delete variable 删除变量
- ENV 环境变量：所有以 npm_config_ 开头的变量，通常在脚本文件中获取
- .npmrc 配置文件，这样的 npmrc 文件优先级由高到低包括：
  - 工程内配置文件: /path/to/my/project/.npmrc
  - 用户级配置文件: ~/.npmrc
  - 全局配置文件: $PREFIX/etc/npmrc (即npm config get globalconfig 输出的路径)
  - npm内置配置文件:/path/to/npm/npmrc

## package.json 文件

npm 项目管理依赖包都会创建 package.json 文件和 node_modules 目录，其中 package.json 文件用来描述项目所有相关信息和依赖包信息；node_modules 目录将所有项目依赖包存放在本地。

其中 package.json 文件的各字段含义详解如下：

[前端工程化 - 剖析npm的包管理机制](https://juejin.im/post/6844904022080667661)


## package-lock.json 文件

1. package-lock.json 的作用就是用来保证我们的应用程序依赖之间的关系是一致的，兼容的；适合多人协作开发时保证每个人的依赖版本是一致的。
1. 使用 npm 5.x 之后版本会自动生成 package-lock.json 文件；使用yarn同样也会自动生成package-lock.json文件；但是cnpm不会自动生成，并且也不会读取package-lock.json文件，只根据package.json下载依赖。
1. 在npm 5.x之前，我们可以直接更改package.json中的版本号，再npm install就可以直接更新了，但是5.x之后由于是根据package-lock.json安装依赖，所以我们只能使用npm install xxx@x.x.x去更新依赖，这样package-lock.json也会同步更新。

[你想知道关于package-lock.json的一切，但是太害怕了问了？](https://segmentfault.com/a/1190000017239545)

## npm install 原理

[npm install 原理分析](https://mp.weixin.qq.com/s/aLAeVQRry_8FT-atL2E06A)

## npm init 配置

- npm init 默认行为，逐行进行选择；npm init -y[--yes] / -f[--force] 可以直接使用默认值。
- npm init 自定义默认行为
  - npm config set init-key value：相当于将package.json中的字段默认值设置到.npmrc文件中，再 npm init 时将使用自定义的值。如 `npm config set init-author-name "xt"`
  - .npm-list.js: 相当于完全自定义一个 package.json 的模板文件，以便 npm init 时调用。需要配置在用户根路径下，即 $HOME 路径下，文件通过 export.defaut 返回一个对应package.json的对象。
- `npm init <initializer>`：将init命令转换为相应的npx操作，会把 initializer 自动补全为 create-initializer，相当于 `npx create-initializer`；对于包含域的包会这样转换：`npm init @usr/foo => npx @usr/create-foo`，附带的参数将保留：`npm init vite-app hello-vite 相当于 npx create-vite-app hello-vite`。主要用于一些初始化项目的脚手架命令，所以也可以发现现在主动框架的脚手架命名都带有 create 关键字，一个原因之一就是便于使用 `npm init <initializer>`，因为它会自动添加 create 关键字。

> npm 从5.2版开始，增加了 npx 命令。主要有两个作用：1. 命令行直接调用模块命令: npx mocha --version 相当于 node-modules/.bin/mocha --version；2. 避免全局安装模块：npx create-vite-app hello-vite-app；<br />npx 的原理很简单，就是运行的时候，模块全靠的查找路径：1. 到项目目录下 node_modules/.bin路径查找；2. 如果没有找到，则到环境变量$PATH里面查找；3。如果依然没有找到，则下载这个包，存放到一人临时目录下，使用完成后删除. --参考[npx 使用教程](https://www.ruanyifeng.com/blog/2019/02/npx.html)
```js
// ~/.npm-init.js
const desc = prompt('description?', 'A new package...')
const bar = prompt('bar?', '')
const count = prompt('count?', '42')
const name = prompt('name?', process.cwd().split('/').pop())

module.exports = {
  key: 'value', // 自定义字段
  foo: { // 自定义对象
    bar: bar,
    count: count
  },
  name: name,
  version: prompt('version?', '0.1.0'),
  description: desc,
  main: 'index.js', // 固定值
}
```

最后一点：重复使用 npm init 命令，不会覆盖已输入的字段，每次会智能显示未输入值的字段，作为加法处理添加。

[【 Node.js 进阶】你应该知道的 NPM 知识都在这！](https://mp.weixin.qq.com/s/CrbNmNnu0EiA7RcDgJbPJA) ---npm init 部分

补充： `npm init --scope=name` 可以将该项目作为 name 域下的子包，安装和使用时：`@name/project-name`，类似 @vue/cli

## npm 依赖包管理

- 包的安装、更新、卸载、发布等命令
- npm i / npm ci 区别

## npm run-script

[前端工程构建 npm script]()




