# 开发环境初始化

## 前言

这两天笔记本电脑频繁蓝屏，自动死机重启，没办法只能拿到售后处理。
重装系统后，电脑的开发环境就得重新配置啦。
所以在这里记录下整个环境安装配置过程中各个工龄软件的安装及注意事项。
免得每次都得耗上一整天，每次安装某个软件工具就得网上查一堆资料来避免各种坑。

前端开发环境基本得配置这些软件工具：

-   nvm: Node Version Manager node 版本管理工具
-   Git
-   vscode
-   powershell 美化

## Node安装

[nvm具体安装详情](/Node/nvm)

1. 下载nvm
下载链接：[nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

    解压安装，安装路径不要有空格，避免版本切换时意外错误
1. 更改下载源
    ```bash
    nvm node_mirror: https://npm.taobao.org/mirrors/node/
    ```

    ```bash
    nvm npm_mirror https://npm.taobao.org/mirrors/npm/
    ```
1. 使用`nvm`安装`node`
    ```bash
    nvm install 版本号[可以多个空格分隔]
    ```
1. 解决全局安装包的共用问题

    - 在确认目录下新建全局模块存放文件夹`node_gloabl` `node_cache`
    - 修改`npm`配置文件
    ```bash
    npm config set prefix "D:\program\nvm\node_global"
    ```

    ```bash
    npm config set cache "D:\program\nvm\node_cache"
    ```
    - 修改系统环境变量
    ```bash
    1. 用户变量 path 中添加 D:\program\nvm\node_global
    2. 系统变量中新增变量 NODE_PATH 变量值为 D:\program\nvm\node_global\node_modules
    ```
    开发所需的node环境配置完毕。

> powershell默认限制脚本运行，所以在powershell中运行全局安装包会报错。此时需要解除限制：以管理员身份运行powershell，输入set-ExecutionPolicy RemoteSigned

> 可能还会遇到nvm 安装node成功，但是附带的npm失败，不可用。此时需要手动安装node，再把文件夹移入nvm目录下，修改为nvm可识别的以node版本号命名。

## Git安装

1. 官网下载安装链接: [Git](https://git-scm.com/)
1. 解压点击安装。

    安装选项时可以不勾选Git-Gui。
1. 安装完成后配置用户信息

    加上--global，这样配置一次，以后git的提交就不用每次都输入用户名和邮箱啦。
    ```bash
    git config --global user.name "your name"
    git config --global user.email "your email"
    ```

## Vscode安装
1. 官网下载链接： [Vscode](https://code.visualstudio.com/)
1. 点击安装
    安装选择时勾选，配置右键菜单项，方便文件或项目打开

    ![vscode](./imgs/vscode.png)
1. 配置插件

    [具体插件清单]()

## Powershell美化
1. 下载[Fluent Terminal](https://github.com/felixse/FluentTerminal/releases)这是一个基于UWP和Web技术的终端模拟器。
1. 使用管理员权限启动PowerShel，安装两个包 `posh-git` `oh-my-posh`
    ```bash
    Install-Module posh-git -Scope CurrentUser
    ```
    ```bash
    Install-Module oh-my-posh -Scope CurrentUser
    ```
1. 下载powershell可用的字体
    ```
    https://github.com/powerline/fonts/raw/master/SourceCodePro/Source Code Pro for Powerline.otf
    ```
    下下载完双击打开，点击安装即可

1. 设置PowerShell启动自加载脚本，命令行输入$profile
    
    会显示一个文件路径。接下来直接去这个文件夹下找这个文件，如果没有的话，直接右键新建txt，写入如下内容后，修改后缀名为ps1
    
    文件内容如下：

    ```bash
    Import-Module DirColors
    Import-Module posh-git
    Import-Module oh-my-posh
    Set-Theme PowerLine
    ```

    最后打开第一步下载安装完成的Fluent Terminal就成功了。