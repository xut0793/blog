# pnpm

## what： pnpm 是什么

> pnpm: Fast, disk space efficient package manager

一个快速的，节省磁盘空间的包管理工具。

## why： 为什么采用 pnpm ，它解决了什么问题

要回答为什么采用 pnpm ，就需要先理解 npm 存在的问题，yarn 解决了什么问题以及存在的问题，pnpm 解决了什么问题。

### npm install / yarn install 基本原理

执行 npm/yarn install 之后，依赖包是如何到达 node_modules 目录的？
> [npm install的实现原理？](https://www.zhihu.com/question/66629910)

1. 执行工程自身 preinstall: 当前 npm 工程如果定义了 preinstall 钩子此时会被执行。
2. 确定项目顶层依赖模块：也就是 dependencies 和 devDependencies 属性中直接指定的模块（假设此时没有添加 npm install 参数）。工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。
3. 获取模块，这是一个递归的过程，分为以下几步：
   1. 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 package.json 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件(npm-shrinkwrap.json 或 package-lock.json)中有该模块信息直接拿即可，如果没有则从仓库获取。如 packaeg.json 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。
   2. 获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
   3. 查找该模块的依赖，如果有依赖则回到第1步递归获取，如果没有则停止。
4. 模块扁平化(dedupe)
   1. 上一步获取到的是一棵完整的嵌套结构的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm@3.x 以前会严格按照嵌套依赖树的结构进行安装，因此会造成模块冗余。
   2. 从 npm@3.x 开始默认加入了一个扁平化(dedupe) 过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃。（这一步会产生幽灵依赖）
   3. 这里需要对重复模块进行一个定义，它指的是模块名相同且 semver 兼容。每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。
      1. 比如 node-modules 下 foo 模块依赖 lodash@^1.0.0，bar 模块依赖 lodash@^1.1.0，则 ^1.1.0 为兼容版本，那么 lodash@^1.1.0 会提升到 Node_modules 的第一层，与 foo 模块和 bar 模块同级。
      2. 当 foo 依赖 lodash@^2.0.0，bar 依赖 lodash@^1.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里，具体把哪一个版本提取到顶层，由于 npm 在遍历所有节点时，内部会对模块执行一次排序，字典序在前面的npm包的底层依赖会被优先提出来放在项层，然后进行重复模块兼容性比对，所以 bar 模块的依赖 lodash@^1.1.0 会先提升到顶层。当遍历到 foo 模块的依赖 lodash@^2.0.0 不兼容，仍留在 foo 模块依赖中。
      3. 如果此时 zoo 模块也依赖了 lodash@^2.0.0，由于与已经提取到顶层的 lodash@^1.1.0 不兼容，也会被留在 zoo 模块的依赖中。此时就会存在 foo 模块和 zoo 模块重复安装了依赖。
5. 安装模块，这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。
6. 执行工程自身生命周期，当前工程如果定义了钩子此时会被执行（按照 preinstall、install、postinstall、prepublish、prepare 的顺序）。
7. 生成或更新版本描述文件 package.json，npm install 过程完成。

### npm@1.x / npm@2.x 采用嵌套依赖树结构存在的问题
1. 依赖层级太深，导致文件路径过长。对于基于Unix的操作系统来说只不过是一个小烦恼，但对于Windows来说却是个破坏性的东西，因为有很多程序无法处理超过260个字符的文件路径名。
2. 大量依赖包被重复安装，使得整个项目文件体积过大，占用磁盘空间
3. 基于语义化版本(semver)规则解析依赖包版本，没有锁定版本，会产生多次安装或团队不同成员安装的依赖包版本不一致问题，存在潜在的难以调试的错误。比如 `lodash: "^4.17.4"`，其中`^` 字符告诉 npm 安装主版本等于4的任一个版本即可，所以不同时间或不同团队成员执行 npm install 时，可能安装的是 `lodash@4.25.5` ，这样的话，即使不同的开发人员使用了相同的 package.json 文件，在他们自己的机器上也可能会安装同一个库的不同种版本，这样就会存在潜在的难以调试的错误和“在我的电脑上…”的情形。

> 虽然可以通过npm config set save-exact true命令关闭在版本号前面使用 `^` 的默认行为，但这个配置只会作用于项目的顶级依赖包版本。由于每个依赖的库都有自己的 package.json文件，而在它们自己的依赖关系前面可能会有^符号，所以无法通过 package.json 文件为嵌套的依赖包版本的一致性提供保证。
> 为了解决这个问题，npm 提供了 shrinkwrap 命令。此命令将生成一个npm-shrinkwrap.json 文件，为所有库和所有嵌套依赖的库记录确切的版本。但是，即使存在 npm-shrinkwrap.json 这个文件，npm 也只会锁定库的版本，而不是库的内容。即便 npm 现在也能阻止用户多次重复发布库的同一版本，但是 npm 管理员仍然具有强制更新某些库内容但不更新库版本号的权力。

### npm@3.x / yarn 采用扁平化依赖树结构存在的问题

扁平化依赖树结构，虽然解决了嵌套结构导致依赖包层级太深，文件路径过长的问题，但也引出了新的问题：
1. 扁平化算法复杂，导致依赖安装速度慢，npm 必须首先遍历所有的项目依赖关系，然后再决定如何生成扁平的 node_modules 目录中依赖文件，所以构建一个完整依赖关系树是一个耗时的操作，也是拖慢安装速度的主要原因。虽然 npm 提供了本地缓存的能力有助于减少安装时间。
2. 幽灵依赖(Phantom dependencies) 的存在，导致可以非法使用没有在 package.json 中声明的依赖包。
3. 重复依赖包安装依然存在，当存在同一依赖包的不同版本存在时，扁平依赖只会提升某一种版本，其它版本仍嵌套存在于各自被依赖项目的 node_modules 目录中，重复安装依赖包的问题解决的并不彻底。

### yarn

Yarn 发布于2016年10月，Yarn 一开始的主要目标是解决 npm 由于语义版本控制而导致的 npm 安装依赖包版本的不确定性问题。虽然 npm 旧版本提供了 npm shrinkwrap 来实现可预测的依赖关系树，但它并不是默认选项，而是需要开发人员主动启用这个选项。而Yarn 采取了不同的做法。每次 yarn install 都会生成一个类似于 npm-shrinkwrap.json 的 yarn.lock 文件，而且它是默认创建的。除了常规信息之外，yarn.lock 文件还包含要安装的内容的校验和，以确保使用的库的版本相同。

> npm@5.x 引入了 package-lock.json 文件来锁定依赖包版本和保存包之间的依赖关系。

yarn 还提供了一些改进功能：
1. 通过并行下载提高了依赖包下载和安装的速度
2. yarn.lock 文件同时也保存了包之间的依赖关系，不用每次计算各个包之间的版本依赖，安装速度更快。
3. yarn 提供了离线模式，同 npm 一样，yarn 使用了本地缓存，但与 npm 不同的是，yarn 允许无需连网也能安装本地缓存的依赖项。

### 总结 npm / yarn 存在的问题
1. npm@1.x/@2.x 嵌套依赖树结构产生的依赖层级太深问题，通过 npm@3.x / yarn 采用扁平化依赖树结构解决了。
2. 基于语义化版本解析确定依赖包版本，但没有锁定确切版本的问题，通过 npm@5.x 提供的 package-lock.json 和 yarn 提供的 yarn.lock 文件解决了。
3. 重复依赖包被安装，占用磁盘空间问题，虽然扁平化结构提升了部分依赖，但解决并不彻底。
4. 扁平化依赖算法复杂，导致安装速度慢，虽然本地缓存可以缓解，但仍然耗时。
5. 扁平化依赖树结构产生幽灵依赖 (Phantom dependencies) 问题，可以非法使用没有在 package.json 中声明的依赖包。

### pmpm 优势

pnpm 相对于传统的 npm / yarn 突出优势是：更快、更节省磁盘空间。

- 更快：在绝多大数场景下，依赖包安装的速度都是明显优于 npm/yarn，速度会比 npm/yarn 快 2-3 倍。
- 更节省磁盘空间：pnpm 将依赖包集中保存在硬盘某个位置的 `.pnpm-store` 文件夹中，然后在项目中使用依赖包基于硬链接来节省硬盘空间。
  - pnpm 不会重复安装同一个包。用 npm/yarn 的时候，如果 100 个项目都依赖 lodash，那么 lodash 很可能就被安装了 100 次，磁盘中就有 100 个地方写入了这部分代码。但在使用 pnpm 只会安装一次，会在全局的缓存目录 `.pnpm-store` 中写入，后面项目中使用时都会直接使用硬连接(hardlink)。
  - 即使一个包的不同版本，pnpm 也会极大程度地复用之前版本的代码。比如 lodash 有 100 个文件，更新版本之后多了一个文件，那么磁盘当中并不会重新写入 101 个文件，而是保留原来的 100 个文件的 hardlink，仅仅写入那 一个新增的文件。
- 解决了 npm / yarn 扁平化依赖结构产生的“幽灵依赖”和“重复依赖”的问题：pnpm 在项目中使用时，在 `node_moudles` 中创建了一个 `.pnpm` 目录，采用扁平化依赖的结构，其中依赖包实际上是 `.pnpm-store` 中缓存文件的硬链接，然后在 `node_modules` 中只存在与 `package.json` 声明对应的依赖，通过软链接方式与 `.pnpm` 中的依赖包关联。

> node_modules中依赖包与 package.json 声明依赖包一致，并通过软链接(softlink)直接指向 node_modules/.pnpm 目录内的依赖包
> .pnpm 目录采用 “模块名@版本号“形式的文件夹扁平化存储(解决依赖重复安装)，并通过硬链接(handlink)指定全局缓存目录 .pnpm-store 目录中文件内存地址。

## deep: pmpm 原理

> [pnpm原理](https://juejin.cn/post/6916101419703468045) --- 理解文件、硬链接和软链接

想要理解pnpm是怎么做的，需要一些操作系统的知识: 文件、硬链接、软链接

### 文件的本质(inode)

在操作系统中，文件实际上是一个指针，只不过它指向的不是内存地址，而是一个外部存储地址（这里的外部存储可以是硬盘、U盘、甚至是网络）。
每一个文件都有一个唯一的 inode，它包含文件的元信息，在访问文件时，对应的元信息会被 copy 到内存去实现文件的访问，然后指向外部存储的数据内容。可以通过 stat 命令去查看某个文件的元信息。`stat README.md`
```
           +-------------+
           | 文件abc.txt |
           | inode       |
           +-----+-------+
                 |
                 |
                 |
+-------+--------v---------+--------+
|       |                  |        |
| 磙盘  |    具体的数据     |        |
|       |                  |        |
+-------+------------------+--------+
```
当我们删除文件时，删除的实际上是指针，因此，无论删除多么大的文件，速度都非常快。像我们的U盘、硬盘里的文件虽然说看起来已经删除了，但是其实数据是可以恢复的，因为数据还是存在的，只要删除文件后，储存原文件数据磁盘空间没有存储其它文件就可以恢复。
```
           +-------------+
           | 文件abc.txt |
           | inode       |
           +-----+-------+
                 
                 
                 
+-------+------------------+--------+
|       |                  |        |
| 磙盘  |    具体的数据     |        |
|       |                  |        |
+-------+------------------+--------+
```

文件拷贝，比如你复制一个文件，是将该文件指针指向的磁盘空间数据进行复制，再申请了一块磁盘空间保存同样的数据，然后产生一个新文件指向新的磁盘空间。
```
            +---------------+                    +---------------+
            |  原 abc.txt   |                    |  新 abc.txt   |
            |  inode        |                    |  inode        |
            +------+--------+                    +-------+-------+
                   |                                     |
                   |                                     |
                   |                                     |
+---------+--------v---------+-----------------+---------v----------+--------+
|         |                  |                 |                    |        |
|   磙盘  |   具体的数据      |                 |   具体数据          |        |
|         |                  |                 |                    |        |
+---------+----------+-------+-----------------+--------^-----------+--------+
                     |                                  |
                     |                                  |
                     +----------------------------------+
                                     复制
```


### 硬链接(hard link)

硬链接的概念来自于 Unix 操作系统，它是指将一个文件A指针复制到另一个文件B指针中，文件B就是文件A的硬链接。通过硬链接，不会像文件拷贝那样产生额外的磁盘占用，并且，两个文件都能找到相同的磁盘内容，并且修改任一个硬链接打开的内容也会影响其它硬链接打开的内容，因为它们指向同一段磁盘空间的数据。硬链接的数量没有限制，可以为同一个文件产生多个硬链接。
> 这里有点 javascript 中对象的地址引用。 let objA = {a: '12'}, let objB = objA，栈中存在的 objA 和 objB 都指向堆内存中的同一个对象地址，对象实际数据也只在堆内存占用一份。

微软从 windows Vista 操作系统开始，，支持了创建硬链接的操作，在cmd中使用下面的命令可以创建硬链接。
```sh
mklink /h newFilename targeFilename
```
```
                   产生硬链接
   +-----------+              +-----------+
   |  文件A    |              |  文件B    |
   |  inode    |              |  inode    |
   +------+----+              +----+------+
          |                        |
          +--------+       +-------+
                   |       |
+---------+--------v-------v-------+-------------+
|         |                        |             |
|   磙盘  |       具体的数据        |             |
|         |                        |             |
+---------+------------------------+-------------+

```
注意：
- 由于文件夹（目录）不存在文件内容，所以文件夹（目录）不能创建硬链接
- 在 windows 操作系统中，通常不要跨越盘符创建硬链接

### 软链接(soft link)

软链接 (soft link)，也称为符号链接 (symbol link)。如果为某个文件或文件夹A创建符号连接B，则B指向A，A指定磁盘数据。

微软从 windows Vista 操作系统开始，支持了创建软链接的操作，在cmd中使用下面的命令可以创建符号链接：
```sh
# /d表示创建的是目录(文件夹)的符号链接，不写则是文件的符号链接
mklink /d newFilename targeFilename
```
```
                    产生软链接
   +-----------+                   +-----------+
   |  文件A    |     指向          |  文件B    |
   |  inode    +<------------------+  inode    |
   +------+----+                   +-----------+
          |
          +--------+
                   |
+---------+--------v---------------+-------------+
|         |                        |             |
|   磙盘  |       具体的数据        |             |
|         |                        |             |
+---------+------------------------+-------------+

```

### 硬链接与软链接的区别

硬链接仅能链接文件，而符号链接可以链接目录。
硬链接在链接完成后仅和文件内容关联，和之前链接的文件没有任何关系。而符号链接始终和之前链接的文件关联，和文件内容不直接相关。

### window 系统中的快捷方式

快捷方式类似于符号链接，是 windows 系统早期就支持的链接方式。它不仅仅是一个指向其他文件或目录的指针，其中还包含了各种信息：如权限、兼容性启动方式等其他各种属性。
快捷方式是 windows 系统独有的，在跨平台的应用中一般不会使用。

### link 的实现

比如 `npm link / yarn link / pnpm link` 实现

### pnpm 安装依赖的处理

假设我们的工程为 proj，直接依赖a，a中依赖b，则 pnpm add a 安装时会做下面的处理：
1. 通过package.json查询依赖关系，得到最终要安装的包：a和b
2. 在.pnpm-store 中查看a和b是否已经有缓存，如果没有，下载到缓存中，如果有，则直接进入下一步
3. 在proj中创建 node_modules 目录，并对目录进行结构初始化，创建 .pnpm 目录和以包名@版本创建依赖a/b的目录。
4. 从.pnpm-store 缓存的对应包中使用硬链接(hard link) 放置文件到相应依赖包的目录中
5. 使用软链接(soft link)，将每个包的直接依赖放置到自己的目录中，比如在a中建立b的软链接
6. 在项目工程的直接依赖 a 依赖软链接(soft link)放置在node_modules目录中


## how: pnpm 基本使用

npm / yarn / pnpm 基本命令汇总

操作 |  npm  |  yarn  |  pnpm 
--|--|--|--
初始化项目  |  npm init  |  yarn init  |  pnpm init
**管理依赖** | |
安装项目所有依赖 |  npm install  |  yarn install  |  pnpm install
安装依赖包       |  npm install pkg  |  yarn add pkg  |  pnpm add pkg
更新依赖包       |  npm update/upgrade/up  |  yarn up  |  pnpm update/up
删除依赖包       |  npm uninstall/remove/rm/r | yarn remove | pnpm remove/uninstall/rm
引用本地依赖     |  npm link                  | yarn link   | pnpm link
取消本她引用     |  npm unlink/un             | yarn unlink | pnpm unlink
**查看依赖** | |
查看项目依赖包树 |  npm list/ls --depth=number   | yarn list --depth=number | pnpm list/ls --depth=number
查看依赖包信息   |  npm info                     | yarn info                | 
查看依赖远程注册表信息 | npm view / npm view pkg version  / npm view pkg versions | |
**运行脚本** | |
run-script | npm run | yarn run | pnpm run<br />(默认不执行pre/post钩子，有需要可以在配置中开启 enable-pre-post-scripts:true)
执行shell命令 | npm exec |  | pnpm exec
start         | npm start / npm run start | yarn run start | pnpm start / pnpm run start
test          | npm test / npm run test | yarn run test | pnpm test / pnpm run test
**版本发布** | |
升级版本号 | npm version [newversion / major / minor / patch / premajor / preminor / prepatch / prerelease] | yarn version [同 npm version] |
发布包     | npm publish | yarn publish | pnpm publish
取消发布   | npm unpublish pkg[@version] [--force] | |
**其它杂项** | |
使用 create-* 启动CLI来创建一个项目<br /> 如 create-react-app | npm init react-app my-app  | yarn create react-app my-app | pnpm create react-app my-app
 | | | | pnpm store path: 查看包存储路径
**支持monorepo** | npm@7.x 以上支持<br /> --workspack / -s <br /> --workspaces / -ws | yarn@1.x 以上支持<br>yarn plugin import workspace-tools | pnpm@6.x 以上支持
1 初始化项目 | npm init | yarn init | pnpm init
2 配置       | package.json 文件<br /> `{  "private": true,  "workspaces": [  "packages/**" ] ` | package.json 文件<br /> `{  "private": true,  "workspaces": [  "packages/**" ] ` | pnpm-workspace.yaml 文件<br /> `packages: 'packages/**'`
3 添加 package | npm init --workspack/-w pkg-name [args] |  | pnpm init -w pkg-name [arg]
4 查看 package |  | yarn workspaces info | pnpm ls --depth=-1 -r
5 在根目录添加包 | npm install | | pnpm add pkg --workspace-root / -W 
6 在所有子应用中都添加指定包 | npm install pkg -ws |  | pnpm -r add pkg
7 在指定子应用中添加包 | npm install pkg -w package-name   | yarn workapce package-name add pkg | pnpm add pkg --filter=package-name
8 删除包 | 把上面 add 改成 remove | 把上面 add 改成 remove | 把上面 add 改成 remove
10 运行run-script命令 | npm run script-name -w package-name <br> npm run script-name -ws | yarn workspace package-name run | pnpm -r run script-name <br> pnpm run script-name --filter package-name
11 运行shell命令 | npm exec -c 'rm -rf node_modules' -w=package-name <br> npm exec -c 'rm -rf node_modules -ws | yarn workspace package-name exec 'rm -rf node_modules' | pnpm -r exec -- rm -rf node_modules <br> pnpm exec --filter=package-name -- rm -rf node_modules

> npm workspace 中每次 npm install 会在根 node_modules 中创建所有子应用的符号链接，所以各个子应用可以像引用第三方依赖一样引用对方。
> npm workspace 只会在根目录存在 node_modules，子应用是不会创建 node_modules 目录的。不管是执行在所有子应用中添加依赖(npm install pkg -ws)还是指定子应用添加依赖(npm install pkg -w package-name)，实际上依赖包都安装在根目录的 node_modules 中，但依赖信息会依据命令的区别更新在相应的根目录或子应用的 package.json 中。

> 在 monorepo 中使用 npm 关键两个参数 npm -ws / npm -w
> 在 monorepo 中使用 yarn 关键参数  yarn workspace
> 在 monorepo 中使用 pnpm 关键两个参数 --recursive(-r) / --filter


## 参考链接

- [pnpm原理](https://juejin.cn/post/6916101419703468045) --- 理解文件、硬链接和软链接
- [实践：pnpm 解决了我的哪些痛点？](https://juejin.cn/post/7036319707590295565) --- 理解了幽灵依赖和重复依赖，以及 pnpm 的依赖管理策略
- [剖析 npm、yarn 与 pnpm 依赖管理逻辑](https://mp.weixin.qq.com/s/3k4u-jw_iKsBeYyHJoSKMA)