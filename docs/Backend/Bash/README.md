# bash

[bash教程](https://wangdoc.com/bash/) --- 网道文档，阮一峰大神维护的很多开源教程
[Shell编程基础](https://wiki.ubuntu.org.cn/Shell%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80)----更为简洁一点

## 操作系统Unix、Linus、Linux、Windows、Mac OS、Ubuntu

Unix[ˈyo͞oniks]:
Linux[ˈlinəks]: Linux 本身只是一个内核程序，它为程序员定义了操作系统的基本元素，但最终用户无法直接操作它也无法使用它。Linux 本身从来就没有定义它该是什么图形系统，与用户该是什么操作，甚至也从来没有定义它该有什么命令行。王垠曾经说过：Linux 可以是这样，Linux 可以是那样，Linux 可以是任何样子。Linux 是一个相对自由的世界，所以围绕 Linux 内核你可以搭建出各种各样的上层系统。这样搭建起来的系统，称为「发行版」。

- Android 是目前当下用户最多的 Linux 发行版，Ubuntu 是基于 Linux 开发的图形化界面系统的发行版，类似 Windows 的图形化操作界面。 
- Shell 作为壳，是相对 Linux 作为内核来说的，shell 提供了用户操作 Linux 内核的命令行界面工具，运行在 shell 上的 Linux 命令解释程序也有多种，bash是其中一种且作为Linux发行版的默认解释器。 
- git-bash 是运行在 windows 系统上模拟 shell 功能的命令行终端。

Linux和Mac OS的区别：都是基于类Unix的，不过Mac OS X属于Unix的直接衍生产品

- Linux 和 macOS 都是起源于 UNIX
- Linux 是宏内核，macOS 的内核 Darwin 是混合内核
- Linux 起源于 Linus，Darwin 是基于 Mach 和 BSD 修改而来
- Linux 只是 类UNIX，而 macOS 是通过了 Single UNIX Specification 的正统 UNIX

Windows 和 Linux的区别
linux主要应用于企业服务器操作系统 全球大部分的企业服务器都是linux系统（大约占97%） 全球领先跑的最快的服务器也是linux操作系统，可以说在企业服务器方面windows不堪一击；如果办公娱乐的话，当然是windows的老大了，linux在桌面系统上也花费了不少努力，比如Ubuntu Fedora 他们的桌面系统要比windows做的华丽很多，就是不能广泛应用；

Windows：普通用户基本都是纯图形界面下操作使用，依靠鼠标和键盘完成一切操作，用户上手容易，入门简单；Linux：兼具图形界面操作（需要使用带有桌面环境的发行版）和完全的命令行操作，可以只用键盘完成一切操作

参考链接：
- [操作系统Unix、Windows、Mac OS、Linux的故事 科普篇](https://blog.csdn.net/zhanghow/article/details/53542397)----详细讲解了各个操作系统的发展历程
- [Linux 和 macOS 的具体差异有哪些？](https://www.zhihu.com/question/19653283) --- 第二个回答
- [操作系统内核发展时间图谱](https://upload.wikimedia.org/wikipedia/commons/7/77/Unix_history-simple.svg)

## Linux 中的 shell、bash、terminal和kernel之间的关系

- kernel：中文是“操作系统核心”，主要用于管理硬件和提供相关的能力实现，例如存取硬盘、网络功能、CPU资源获取等。通常指的是 Linux 内核，相对的还有 Linux 发行版概念，发行版是指在Linux内核的基础上，集成了软件包管理器、屏幕绘图的底层接口、高级的桌面环境等一系列软件，便于用户使用。
- shell：中文意思是“壳程序”，指的是能对操作系统和应用程序进行操作的接口程序，狭义的壳程序指的是命令行方面的软件，例如bash;广义上也包括图形界面下的程序。shell负责解释用户输入的命令传输到linux内核执行，在历史的长河中，作为解释程序的实现有很多种，bash是其它最广泛使用的一种，也是 Linux 发行版中默认自带的解释程序。可以理解 shell 是各种命令行解释程序的统称。
> Unix shell：一种壳层与命令行界面，是Unix操作系统下传统的用户和计算机的交互界面。普通意义上的shell就是可以接受用户输入命令的程序。它之所以被称作shell是因为它隐藏了操作系统低层的细节。Unix操作系统下的shell既是用户交互的界面，也是控制系统的脚本语言。

> shell命令：可以让shell工具解释的命令，绝大部分是Linux操作命令和部分shell自身命令。shell脚本：一系列shell命令的集合

- terminal: 终端。在早期 Linux 操作系统中开机直接显示的 shell 操作界面，但在各式各样的图形化操作界面的Linux发行版，开机并不是命令行界面了，所以需要一处终端程序开启命令行界面，终端也是一个工具程序。


参考链接：
- [Linux之shell以及bash、dash的详解](https://blog.csdn.net/weixin_39212776/article/details/81079727) ---- 里面两张图比较合适
- [shell、bash、terminal和kernel之间的关系](https://www.cnblogs.com/jiading/p/11826773.html)

## git、git bash和git shell有什么区别？

[git、git bash和git shell有什么区别？](https://www.zhihu.com/question/34582452)

- git 是版本控制工具，最开始设计用于在Unix风格的命令行环境中执行。像 Linux 和 macOS 这样的操作系统都包含内置的 Unix 命令行终端，所以在命令行中用 git 做版本控制就非常方便。然而，Windows 使用 Windows 命令提示符，内置的cmd命令行终端，这是一个非Unix终端环境，所以我们如果需要在windows系统上使用git功能，就需要使用git-bash。
- git bash 是一个适用于 Windows 系统环境的应用程序，它为 git 命令行操作提供了一个仿真层。相当于在windows上通过 git bash 这个程序模拟Unix 命令行终端出来，然后在这个仿真终端里面做git 相关的版本控制功能。
- git shell 是一个通过 SSH 访问 git 服务器的程序，比如说你把一个主机作为 git 服务器，然后通过 git shell 进行 SSH 连接到服务器，并把服务器用作托管 git 存储库。git shell 一般只允许使用服务器操作git功能，其它行为是被限制的。

## #!/bin/bash 和 #!/usr/bin/bash 和 #!/usr/bin/env bash 和 #!/usr/bin/env node 的比较

- 此行称为 shebang（就是 sharp (#) + bang (!) 的意思），会指引操作系统使用接下来指定的程序运行此文件，使用绝对路径。在linux的bash的脚本，需在开头一行指定脚本的解释程序。
- env命令可以在系统的PATH目录中查找预设的系统环境变量，这个命令总是在/usr/bin目录。

> #!/usr/bin/env NAME这个语法的意思是，让 Shell 查找$PATH环境变量里面第一个匹配的NAME。如果你不知道某个命令的具体路径，或者希望兼容其他用户的机器，这样的写法就很有用。<br /> /usr/bin/env bash的意思就是，返回bash可执行文件的位置，前提是bash的路径是在$PATH里面。其他脚本文件也可以使用这个命令。比如 Node.js 脚本的 Shebang 行，可以写成这样 /usr/bin/env node。

如果确定脚本解释程序的路径，可以直接写死完整路径。如 #!/bin/bash 和 #!/usr/bin/bash。但脚本程序在不同的系统中执行，不能保证解释程序都安装在同样的绝对路径中，因为在不同的系统，命令或程序存放的位置可能不同，但是大部分程序都会在 $PATH中设置环境变量，这时为了能在不同的系统上具有更大的通用性，不写死路径，而是从系统安装的环境变量中查的解释程序的路径。这时可以使用 #!/usr/bin/env bash 和 #!/usr/bin/env node

## package.json 中的 bin 字段

- 为什么可以直接 `npm run xxx` 运行 package.json 文件中 script 字段定义的命令？
- package.json 中的 bin 字段作用

`npm run` 会创建一个 shell，执行指定的命令。但执行命令前，`npm run`命令会先自动临时将 `node_modules/.bin` 路径加入环境变量 $PATH 中，所以 scripts 字段里面调用命令时不用加上路径，可以直接运行，这就避免了全局安装NPM模块。
```json
"scripts": {
  "eslint": "./node_modules/.bin/eslint .",
  // 可以简写成
  "eslint": "eslint ."
}
```
而 `node_modules/.bin` 目录是随 `node_modules` 目录自动创建的。当使用 `npm install` 安装一个包时，除了将包代码放在 `node_modules`目录中，还是查找该包的 `package.json` 文件中是否有定义 `bin` 字段，如果有，会使用 `bin` 字段的值在 `node_modules/.bin` 目录会生成两个文件`bash 文件和.cmd 文件`，指向ESLint模块的可执行脚本。

如果本地开发npm 的包，需要在项目中调试使用，可以使用 `npm link` 手动建立软链，这样项目可以使用 `require('xxx')` 引入，进行调试开发。 [具体 npm link](https://javascript.ruanyifeng.com/nodejs/npm.html#toc18)

参考链接：
- [LINUX上的SHEBANG符号(#!)](http://smilejay.com/2012/03/linux_shebang/)
- [bash教程 Shebang行](https://wangdoc.com/bash/script.html#shebang-%E8%A1%8C)