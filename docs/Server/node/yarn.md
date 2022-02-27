# yarn

[[toc]]

[yarn 中文官网](https://yarn.bootcss.com/docs/usage/)
## npm 的问题
- npm install的速度缓慢
- 同一个项目，安装的时候各个包的版本无法保持一致性
- 安装的时候，包会在同一时间下载和安装，中途某个时候，一个包抛出了一个错误，但是npm会继续下载和安装包。

## yarn 优点
- 速度快：得益于yarn并行安装和缓存模式。
    npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务，提高了性能。
    如果之前已经安装过一个软件包，用Yarn再次安装时之间从缓存中获取，就不用像npm那样再从网络下载了。
- 安装版本统一
    为了防止拉取到不同的版本，Yarn 有一个锁定文件 (lock file) 记录了被确切安装上的模块的版本号。每次只要新增了一个模块，Yarn 就会创建（或更新）yarn.lock 这个文件。这么做就保证了，每一次拉取同一个项目依赖时，使用的都是一样的模块版本。
- 多注册来源处理
    所有的依赖包，不管他被不同的库间接关联引用多少次，安装这个包时，只会从一个注册来源去装，要么是 npm 要么是 bower, 防止出现混乱不一致。
- 更简洁的输出：npm 的输出信息比较冗长，Yarn 简洁太多。
- 更好的语义化： yarn改变了一些npm命令的名称，比如 yarn add/remove，感觉上比 npm 原本的 install/uninstall 要更清晰。

## npm的未来：npm5.0
有了yarn的压力之后，npm做了一些类似的改进。
1. 默认新增了类似yarn.lock的 package-lock.json；
2. git 依赖支持优化：这个特性在需要安装大量内部项目（例如在没有自建源的内网开发），或需要使用某些依赖的未发布版本时很有用。在这之前可能需要使用指定 commitid 的方式来控制版本。
3. 文件依赖优化：在之前的版本，如果将本地目录作为依赖来安装，将会把文件目录作为副本拷贝到 nodemodules 中。而在 npm5 中，将改为使用创建 symlinks 的方式来实现（使用本地 tarball 包除外），而不再执行文件拷贝。这将会提升安装速度。目前yarn还不支持。

## 命令行

npm | yarn
--:|:--
`npm init`|`yarn init`
`npm install` | `yarn or yarn install`
`npm install --save [package]`|`yarn add [package]`
`npm install --dev --save [package]`|`yarn add [package] --dev`
`npm update [package] --save` |`yarn upgrade [package]`
`npm uninstall [package] --save` | `yarn remove [package]`

- 项目生产依赖 --save (-S) ， 项目开发依赖 --save --dev （-D） --global(-g)
- npm 不加参数默认项目临时依赖，包信息不会添加到package.json文件。
- yarn不添加参数默认为本地开发依赖，相当于npm --save
- 如果script命令是start，运行时可以不加run，直接`npm start`
