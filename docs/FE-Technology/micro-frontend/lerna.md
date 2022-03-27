# Lerna
![lerna](./images/lerna.svg)

## What is Lerna 它是什么

> A tool for managing JavaScript projects with multiple packages.
> Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.
Lerna 是一个管理多个包的 JavaScript 项目 monorepo 工程的工具。
Lerna 是一个用来优化托管在 git\npm 上多项目单一仓库的工作流的一个管理工具,可以让你在一个主项目下管理多个子项目，从而解决多个包互相依赖，并且发布时需要手动维护多个包升级版本号的问题。

## How to use Lerna 如何使用它

### lerna 的两种模式

- Fixed/Locked mode (default) 统一版本号模式，也就是说仓库中各个子项目都统一为根目录的版本。这也是 `lerna init` 项目时默认模式，此时 leran.json 中 `"version": "0.1.5` 为具体的版本号。这种模式下，每次 `lerna publish` 发布时都会在依赖这个 version 进行增加，各个子项目中的 package.json 中的version 自动更改。
- Independent mode 独立版本控制模式，也就是仓库中各个子项目在各自的 package.json 中维护自己的版本。`lerna init --independent / -i`，此时 lerna.json 中 `"version": "independent"`。这种模式下，每次 `lerna publish` 发布时，终端会交互提示让用户输入各个子项目的版本号。

### lerna.json 配置文件的配置项

`lerna init` 后，根目录会生成一个 `lerna.json` 的配置文件，有基本配置项。
```json
{
  "packages": [
    "packages/*"
  ],
  "version": "independent"
}
```
可以补充一些配置项：
```json
{
    "useWorkspaces": true, // 使用 workspaces 配置。此项为 true 的话，将使用 package.json 的 "workspaces"，下面的 "packages" 字段将不生效，当与其它 npm workspace / yarn workspace / pnpm workspace 配置时必须设置
    "version": "0.1.0", // 统一版本号模式时，写具体的版本号。如果为独立模式时，值为"independent"
    "npmClient": "npm", // 包管理器默认 npm，可设置为 yarn 等
    "packages": [ // 包所在目录，可指定多个, useWorkspaces:true 时被忽略
        "packages/*"
    ],
    "command": { // 对 lerna 特定命令的相关配置
        "publish": { // 发布命令 lerna publish
            "ignoreChanges": [ // 指定文件或目录的变更，不触发 publish
                ".gitignore",
                "*.log",
                "*.md"
            ],
            "verifyAccess": false,
            "verifyRegistry": false,
            "message":"chore: publish" // lerna version 自动生成的提交格式为“ publish xxx",并不符合conventional-commit规范，因此需要加以修改，我们通过message参数可以修改自动生成的提交记录
        },
        "bootstrap": { // lerna bootstrap
            "ignore": "npm-*",  // 不受 bootstrap 影响的包
            "npmClientArgs": [ // bootstr 执行参数
                "--no-package-lock"
            ]
        }
    }
}
```

### lerna 的基本工作流

1. `lerna init` / `lerna init -i` 初始化项目，得到项目基本目录和文件
```
└── lerna-pro/
   ├── packages/
   ├── lerna.json
   └── package.json
```
2. 更改配置文件 `lerna.json`，比如 `lerna + yarn workspace` 实践需要更改 `"useWorkspaces": true, "npmClient": "yarn"` 等。
3. `lerna create <package-name> [location]`  创建一个子应用 package。默认放在第一个工作空间中 `packages[0]`
```
# lerna.json 中定义的 packages 字段，如果使用 useWorkspaces: true，则是 package.json 中的定义的 workspaces 字段。
"packages": [
  "packages/*",
  "application/*"
]

# 创建一个包 app-A 默认放在 packages[0]所指位置，即 packages 目录下，此时目录为 ./packages/app-A/
lerna create app-A 

# 使用 location 参数指定在哪个工作空间下创建新项目，此时目录为 ./application/app-B
lerna create app-B application
```
4. `lerna bootstrap` 安装所有项目依赖。默认是 `npm install`，因为我们在配置中设置了 `"npmClient": "yarn"` ，所以相当于 `yarn install`，会把所有项目的依赖安装到根 node_modules。并且因为配置 workspace ，所以也会建立各个子应用之间的 link 关系。相当于 `yarn install + yarn link` 的效果。
5. `lerna add [--dev] [--exact]` 添加依赖，可以是第三方依赖或者当前 packages 中子应用作为依赖添加，默认是生产依赖
```
# 安装依赖 pkg 到每一个 prefix- 开头的项目中，会更新匹配到项目的 package.json 中的 dependencies 字段，但实际包安装在根目录中的 node_modules 中。
lerna add pkg packages/prefix-*

# 只向 app-A 应用安装依赖 pkg
lerna add pkg --scope=app-A

# 在 app-A 安装 pkg 作为开发依赖
lerna add pkg --scope=app-A --dev

# 向 packages 中所有子应用安装 pkg 作为生产依赖
lerna add pkg

# 将本地 app-B 作为 app-A 依赖安装
lerna add app-B --scope=app-A
```
> --scope 参数可以指定 Lerna 命令的运行环境，通过使用该参数，Lerna 将不再是一把梭的在所有仓库中执行命令，而是可以精准地在我们所指定的仓库中执行命令，并且还支持示例中的 glob 语法；
> --concurrency number：参数可以使 Lerna 利用计算机上的多个核心，并发运行，从而提升构建速度；

6. `lerna list` 列出工作空间内的所有子应用。
7. `lerna run < script > [..args]` 运行所有子应用的 package.json 声明的 run-script 命令，也可以通过 `--scope` 参数指定子应用 `lerna run --scope=app-A test`
8. `lerna exec -- < command > [..args]` 对所有子应用执行脚本命令，同样通过 `--scope` 参数指定子应用
```
# 删除所有子应用的 node_modules 目录
lerna exec -- rm -rf ./node_modules

# 通过 `--scope` 参数指定子应用
lerna exec --scope=app-A -- rm -rf ./node_modules
```
9. `lerna clean` 删除所有包的node_modules目录，相当于 `lerna exec -- rm -rf ./node_modules`
10. `lerna changed` 查看下次发布要更新的子应用。子项目需要进行过 `git add , git commit` 操作。 然后内部会运行 `git diff --name-only v版本号`，搜集改动过的包，就是下次要发布的。
```
➜  lerna-repo git:(master) ✗ lerna changed                                     
info cli using local version of lerna
lerna notice cli v3.14.1
lerna info Looking for changed packages since v0.1.4
daybyday #只改过这一个 那下次publish将只上传这一个
lerna success found 1 package ready to publish
```
11. `lerna version` 版本升级。发版前需要更新版本号，现代项目工程基本都是遵循语义化版本规范(semVer: Semantic Versioning)：`Major.minor.patch [-alpha / -beta / -rc]`。这时候如何更新版本号就是个问题？简单的项目可以选择手动处理，但复杂项目会根据 git commit 提交记录来更新：
  - 存在fix提交： 需要更新 patch 版本
  - 存在feat提交： 需要更新 minor 版本
  - 存在BREAKING CHANGE提交： 需要更新 major 大版本
并且也会根据 git commit 来生成 changelog。

  > yarn官方并不打算支持发布流程，只是想做好包管理工具，因此这部分功能可以通过lerna支持 lerna version / lerna publish

  - 由于 lerna 会自动的监测git提交记录里是否包含指定package的文件修改记录，来确定版本更新，这要求设置好合理的ignore规则(`lerna.json 中 publish.ignoreChanges`)。否则会造成频繁的，无意义的某个版本更新，好处是其可以自动的帮助package之间更新版本。
  - 使用 `lerna version --conventional-commits` 参数会自动的根据 conventional commit 规范和 git commit message 记录帮忙确定更新的版本号。
  - `lerna version` 自动会生成的提交格式为“ publish xxx",并不符合conventional-commit规范，可以在 `lerna.json 中的 publish.message` 中修改，我们通过message字段定义自动生成的提交记录格式。
  - `lerna version`完成后会自动生成 `changelog.md`。

12.  `lerna publish` 发布包，包含了 `lerna version` 功能，会经历以下几步：
     1.  运行 `lerna updated` 来决定哪一个包需要被publish
     2.  如果统一版本号模式，将会更新lerna.json 中的 version，如果是独立版本模式，终端会交互提示让用户输入各个子项目的版本号。
     3.  将所有更新过版本号的包，将版本号更新各自的 package.json 文件中的 version 字段
     4.  将所有更新过的包中的依赖进行更新，这里会按拓扑排序进行更新
     5.  为新版本创建一个git commit 或 tag
     6.  将更新过的子应用包 publish 到 npm 上；注意要先用 npm login 登录 npm 源，否则会失败
```
lerna publish 
lerna info current version 0.1.4
#这句意思是查找从v0.1.4到现在改动过的包
lerna info Looking for changed packages since v0.1.4 

? Select a new version (currently 0.1.4) Patch (0.1.5)

Changes:
 - daybyday: 0.1.3 => 0.1.5 #只改动过一个

...

Successfully published:
 - daybyday@0.1.5
lerna success published 1 package
```

目前最常见的 monorepo 项目推荐的实践，是用 lerna 来处理项目构建脚本执行和版本发布的问题，用包管理器处理依赖问题。主要是因为 lerna 和 yarn 等包管理器在功能上有较多的重叠，让其发挥各自专长。比如基于 lerna和 yarn Workspace 的 monorepo 工作流。

```json
# lerna init 后修改 lerna.json 的配置
"useWorkspaces": true,
"npmClient": "yarn",

# 然后根据 yarn workspace 配置要求，更改 package.json
"private": true,
"workspaces": [
  "packages/*"
],
```

如果不想测试时真正向 npm 中心仓库发布包，可以使用 Verdaccio 进行本地发布来模拟真实操作。

```
# 在全局安装 Verdaccio 应用
npm install --global verdaccio

# 启动 verdaccio，即可通过 localhost:4837 访问您的本地代理 npm 仓库
verdaccio

# 项目根目录创建 .npmrc 文件，并在文件中将 npm 仓库地址改写为 verdaccio 的本地代理地址
registry="http://localhost:4873/"
```
这样之后，每当您执行 lerna publish 时，子项目所构建成的 package 将会发布在本地 npm 仓库中，而当您执行 lerna bootstrap 时，Verdaccio 将会放行，让您成功从远程 npm 仓库中拉取相应的代码。


## 参考链接

- [lerna](https://www.lernajs.cn/)
- [基于lerna和yarn workspace的monorepo工作流](https://zhuanlan.zhihu.com/p/71385053)
- [All in one：项目级 monorepo 策略最佳实践](https://zhuanlan.zhihu.com/p/348898271) --- 锁定环境：Volta、统一命令脚本：scripty、npm 包本地发布：Verdaccio