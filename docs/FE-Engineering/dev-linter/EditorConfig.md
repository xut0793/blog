# EditorConfig

![editorconfig.png](./imgs/editorconfig.png)

[[toc]]

EditorConfig 和 Prettier 一样，都是用来格式化代码的。但 EditorConfig 的作用更侧重于帮助开发人员在不同的编辑器或 IDE 之间统一代码风格。依据项目中 .editorconfig 配置文件的规则覆盖到编码器默认的风格来达到代码风格的统一。

要使用 EditorConfig 完成代码风格统一，需要两部分工作：

- .editorConfig 配置文件
- 有部分编译器原生支持读取 .editorconfig 配置文件，但另一部分编译器需要安装相应的插件来识别配置文件。比如 VS Code 需要安装 `EditorConfig for VS Code`，然后在项目任一目录下右键点击`Generate .editorconfig`，可以直接生成 .editorconfig 文件。

## .editorconfig 配置文件

.editorconfig 配置文件中主要由两部分内容组成

- 通配符组成的文件匹配模式
- 指定代码格式的属性值

editorConfig 配置文件需要是 UTF-8 字符集编码的,一行定义一个规则，以回车换行或换行作为一行的分隔符。

### 匹配模式

匹配模式以`[ ]`中括号包裹，中括号内部以通配符模式定义匹配规则，其中斜线(/)被用作为一个路径分隔符

```
*                匹配除/之外的任意字符串
**               匹配任意字符串
?                匹配任意单个字符
[name]           匹配name中的任意一个单一字符
[!name]          匹配不存在name中的任意一个单一字符
{s1,s2,s3}       匹配给定的字符串中的任意一个(用逗号分隔)
{num1..num2}   　匹配num1到num2之间的任意一个整数, 这里的num1和num2可以为正整数也可以为负整数
```

### 属性

所有的属性和值都是忽略大小写的. 解析时它们都是小写的

```
root        　　  　         表示是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
indent_style                设置缩进风格(tab是硬缩进，space为软缩进)
indent_size                 用一个整数定义的列数来设置缩进的宽度，如果indent_style为tab，则此属性默认为tab_width
tab_width                   用一个整数来设置tab缩进的列数。默认是indent_size
end_of_line                 设置换行符，值为lf、cr和crlf
charset                     设置编码，值为latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom
trim_trailing_whitespace    设为true表示会去除换行行首的任意空白字符。
insert_final_newline        设为true表示使文件以一个空白行结尾
```

## 注释

以井号(#)或分号(;)被用作于注释. 注释需要与注释符号写在同一行

## 官网示例

```sh
# top-most EditorConfig file 表示是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
root = true

# Unix-style newlines with a newline ending every file 对于所有的文件  始终在文件末尾插入一个新行
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset  对于所有的js,py文件，设置文件字符集为utf-8
[*.{js,py}]
charset = utf-8

# 4 space indentation 控制py文件类型的缩进大小
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified) 设置某中文件的缩进风格为tab Makefile未指明
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory  设置在lib目录下所有JS的缩进为
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml 设置确切文件 package.json/.travis/.yml的缩进类型
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

## VS Code 使用

1. 安装 `EditorConfig for VS Code` 插件
1. 在项目管理器中，以任何目录下（一般在根目录下）右键，选择最后一项 `Generate .editorconfig`，就会创建配置文件，并预设了一组配置。可以按照需要进行更改。

> 安装 EditorConfig 扩展插件的作用是读取创建的 .editorconfig 文件中定义的规则，并覆盖 user/workspace settings 中的对应配置，从这我们也可以看出 vscode 本身属于不直接支持 editorconfig 的那部分 IDE。

尽量让 .editorconfig 配置的代码格式与 Prettier 或 ESLint 这些代码格式化工具配置相同的值，不然容易造成冲突无效。

```sh
# editorconfig.org
root = true

[*]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

# Markdown 语言中尾随空格是有意义的，比如行尾两个空格相当控行, 2 trailing spaces = linebreak (<br />)，所以我们要特殊指定忽略
# See https://daringfireball.net/projects/markdown/syntax#p
[*.md]
trim_trailing_whitespace = false
```

## 参考链接

- [EditorConfig 官网](https://editorconfig.org/)
- [使用.editorconfig 规范编辑器编码规范](https://blog.sesine.com/2018/12/14/editorconfig/)
