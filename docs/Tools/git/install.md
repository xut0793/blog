# Git 安装与初始配置

**参考链接**

[Git Pro](https://git-scm.com/book/zh/v1/)<br/>
[Windows 下 Git 安装与初始配置](https://www.cnblogs.com/xinaixia/p/8249913.html)

## 下载安装

直接下载最新版
[官网下载链接](https://git-scm.com/download/win)

1. 点击安装文件，按提示 next 安装
   ![git-init-1](./imgs/git-init-1.png)
1. 选择你需要安装到的路径，比如一般将软件安装到 D 盘某个目录处`D:\DevSoftTools`, next 下一步
   ![git-init-1](./imgs/git-init-2.png)
1. 选择需要安装的组件，这里我一般把 GUI 选项去掉，因为很少用到, next 下一步
   ![git-init-1](./imgs/git-init-3.png)
1. 在开始菜单配置快捷方式, next 下一步
   ![git-init-1](./imgs/git-init-4.png)
1. 选择默认编辑器，这里保持默认，使用 Vim, next 下一步
   ![git-init-1](./imgs/git-init-5.png)
1. 调整环境变量，这里保持默认, next 下一步
   第一个选项为不设置 Path；第二个选项为设置 Path，在 Windows 的命令提示符下也可以使用 git 即 cmd 下面也可以直接调用。
   ![git-init-1](./imgs/git-init-6.png)
1. 选择传输协议，这里保持默认, next 下一步
   第一项使用 SSL 传输协议，第二项使用 HTTPS 传输协议。
   ![git-init-1](./imgs/git-init-7.png)
1. 配置行尾转换，这里保持默认, next 下一步
   ![git-init-1](./imgs/git-init-8.png)
1. git 终端选择，这里保持默认, next 下一步
   使用 MinTTY，Git 的 Windows 客户端，会自带一个叫 MinGW 的 Linux 命令行工具，可以执行简单的 shell 命令
   ![git-init-1](./imgs/git-init-9.png)
1. 配置额外选项，这里保持默认, next 下一步
   ![git-init-1](./imgs/git-init-10.png)
1. 一个新特性的选择, 这里保持默认， Install 安装
   ![git-init-1](./imgs/git-init-11.png)
1. 安装过程，待完成<br/>
   ![git-init-1](./imgs/git-init-12.png)
1. 安装完成，去掉查看特性记录，选择直接打开 Git Bash, Finish 完成
   ![git-init-1](./imgs/git-init-13.png)
1. 在终端输入`git --version`，正确输出版本号即安装成功
   ![git-init-1](./imgs/git-init-14.png)

## 配置用户信息

用户名和邮箱地址的作用，用户名和邮箱地址是本地 Git 客户端的一个变量，不随 git 库而改变。每次 Git 提交时都会引用这两条信息，说明是谁提交了更新。

每次 commit 都会用用户名和邮箱纪录， 为了避免每个仓库提交时提示输入，这里添加`--global`参数全局配置。

```js
　　$ git config --global user.name "yourname"
```

```js
　　$ git config --global user.email "youremail"
```

实际上 git 就是用 name 和 email 做个标识。

如果用了 --global 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。

如果要在某个特定的项目中使用其他名字或者电邮，只要在当前项目路径下，去掉 --global 选项重新配置一下即可，新的设定保存在当前项目的 .git/config 文件里。

**特定项目需要单独的名字和电邮**

切到对应项目路径下，不添加`--global`参数

```js
　　$ git config user.name "yourname"
```

```js
　　$ git config user.email "youremail"
```

**查看所有配置信息**

```bash
git config --list
```

**查看指定配置信息**

```bash
git config user.name
```

```bash
git config user.email
```
