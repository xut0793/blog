# 生成目录树 tree-node-cli

在平常写项目文档的时候，经常需要项目的文档树，类似这样：

```
ts-node-project
├── src
│   └── index.ts
└── package.json
```

那这个是怎么生成的呢？有两种方法：

## window 自带的命令行命令`tree`

**语法：**

```
tree [<Drive>:][<Path>] [/F] [/A]

<Drive >：	指定包含要显示其目录结构的磁盘的驱动器。
<Path >	    指定要显示其目录结构的目录。
/F	        显示每个目录中的文件的名称。
/A	        指定树将使用文本字符而不是图形字符来显示链接子目录的行。
/?	        在命令提示符下显示帮助。
```

> 如果未指定驱动器或路径，树将显示从当前驱动器的当前目录开始的树状结构。

**示例：**
导出当前目录的文件夹/文件的目录树到 tree.txt 文件中。

```bash
tree /F >tree.txt
```

但是这个命令选项太简单了，带来很多问题，比如一般项目中都有`node_modules`文件夹，项目路径嵌套很深，但是用这个命令没办法排除掉对该文件夹的解析。

所以如果是一个目录很深的话，会生成很大的树结构。

所以一般都采用第三方的树生成工具。

## 在 Git Bash 中使用`tree-node-cli`

`tree-node-cli`是基于 node 的一个工具包：

**全局安装：**

```bash
npm install -g tree-node-cli
```

**命令选项：**

电脑上需要安装`Git`工具，然后右键打开`Git Bash`，输入`tree -h`查看所有命令选项：

```bash
$ tree -h
Usage: tree [options]

Options:
  -V, --version             输出版本号
  -h, --help                输出使用方法

  -a, --all-files           所有的文件，包括隐藏的文件，都会被打印出来。
  --dirs-first              在树状结果中优先列出目录.
  -d, --dirs-only           只输出目录结构.
  -I, --exclude [patterns]  排除文件或文件夹。E.g. "node_modules|coverage".
  -L, --max-depth <n>       显示最大的层级深度.
  -r, --reverse             按字母反序排列输出.
  -F, --trailing-slash      为目录结尾添加 /
```

**示例：**

```bash
# 在 GIt Bash中输入
$ tree --dirs-first -L 3 -I "node_modules|.vscode" >tree.md
```

显示当前目录下 3 层文件结构，但排除`node_modules`和`.vscode`文件夹，并且以目录在前的形式输出到 tree.md 文件。

```
ts-node
├── src
│   └── index.ts
├── package.json
├── tree.md
├── tsconfig.json
└── tslint.json
```
