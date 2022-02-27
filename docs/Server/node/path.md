# 文件路径 path

[[toc]]

这一节主要为文件系统作的前置知识，node 的内置工作模块 path 提供用于处理文件路径和目录路径的实用方法。

## 路径的组成部分

```
┌─windonws────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
┌──────┬──────────────┬──────┬─────┐
"  /    home/user/dir / file  .txt "
│ root │              │ name │ ext │
├──────┴              ├────────────┤
│          dir        │    base    │
└─POSIX───────────────┴──────┴─────┘
```

## 路径分隔符差异

因为在 POSIX 和 Windows 两个不同的系统中，路径分隔符是不一样的，所以 path 在这两个系统上的使用有些微小差异。

> 可移植操作系统接口（英语：Portable Operating System Interface，缩写为 POSIX，最后的 X 则表明其对 Unix API 的传承。）是 IEEE 为要在各种 UNIX 操作系统上运行的软件定义 API 的一系列互相关联的标准的总称。Linux 系统基本上实现了 POSIX 标准，windows 部分实现了 POSIX 标准。

```js
let sep = path.sep
// 提供平台特定的路径片段分隔符
// Windows 上是 \。 如： C:\temp\foo\
// POSIX 上是 /。 如： /foo/bar/baz/asdf
```

但在 Windows 上，正斜杠（/）和反斜杠（\）都是可被接受的路径片段分隔符。所以这个差异基本可忽略。在 wondows 平台代码中仍可以使用正斜杠`/`来解析路径。

## 引入 path

```js
const path = require('path')
```

## path 的 API

```js
path.isAbsolute(path) // 判断路径是否是绝对路径
path.extname(path) // 获取路径扩展名，ext部分
path.basename(path[, ext]) // 获取口径文件名。如果不带ext参数则为name+ext部分，如果带了ext参数，则只输出name部分
path.dirname(path) // 获取路径目录名，dir部分

path.parse(path) // 将整个路径解析成对象
path.format(pathObject) // 从对象返回路径字符串。 与 path.parse() 相反。
path.normalize(path) // 规范化路径，解析路径中'..' 和 '.' 片段

path.join([...paths]) // 合并给定的几段路径，成规范化的路径
path.resolve([...paths])
// 合并路径成绝对路径，按给定的路径序列从右到左进行处理，直到遇到第一个绝对路径为止。
// 如果都没有绝对路径加上当前目录即__dirname
```

示例：

```js
const path = require('path')
const p = 'C:\\path\\dir\\file.txt'

console.log(path.isAbsolute(p)) // true
console.log(path.extname(p)) // .txt
console.log(path.basename(p)) // file.txt
console.log(path.basename(p, '.txt')) // file
console.log(path.dirname(p)) // C:\path\dir

let pathObject = path.parse(p)
console.log(pathObject)
/**
返回：
    { 
        root: 'C:\\',
        dir: 'C:\\path\\dir',
        base: 'file.txt',
        ext: '.txt',
        name: 'file'
    }
*/
let p1 = path.format(pathObject)
console.log(p1) // C:\path\dir\file.txt
```

```js
path.normalize('C:\\temp\\\\foo\\bar\\..\\')
// 返回: 'C:\\temp\\foo\\'
```

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
// 返回: '/foo/bar/baz/asdf'
// 如果其中有任何路径片段不是字符串，则抛出 TypeError
```

```js
path.resolve('/foo/bar', './baz')
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/')
// 返回: '/tmp/file'
// 从后往前，能解析成绝对路径就停止

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// 还未生成绝对路径，则添加__dirname，如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
