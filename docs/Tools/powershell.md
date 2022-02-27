# Powershell美化
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