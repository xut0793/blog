# 文件操作 fs

[[toc]]

## 概述

在 NodeJS 中，所有与文件和文件夹（目录）的操作都是通过 fs 核心模块来实现的，包括：

-   文件目录的创建、删除、查询；
-   文件的打开、读取、裁取、写入，追加、拷贝、删除、关闭；

在 fs 模块中，所有的方法都分为**同步**和**异步**两种实现，具有 sync 后缀的方法为同步方法，不具有 sync 后缀的方法为异步方法，建议使用异步方法，不会阻塞主进程代码的执行。

在了解文件操作的 API 之前有一些关于系统和文件的前置知识，我们需要先了解：

-   文件的权限位 mode
-   标识位 flag
-   文件描述符 fd

## 文件权限位 mode

因为 fs 模块需要对文件进行操作，会涉及到操作权限的问题，即你有没有权限操作该目录或文件， 其中 mode 的值通常用八进制表示。

先清楚文件权限是什么，都有哪些权限，权限位 mode 数字怎么定义？

系统对文件权限按用户角色划分为：文件所有者，文件所属组（如家庭组）、其它用户。每种角色都有三种操作权限（对应的数字表示）：读`r`(4)、写`w`(2)、执行`x`(1)、不具备权限(0)

<table>
    <tr>
        <th>权限分配</th>
        <th colspan=3>文件所有者</th>
        <th colspan=3>文件所属组</th>
        <th colspan=3>其它用户</th>
    </tr>
    <tr>
        <td>权限项</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
    </tr>
    <tr>
        <td>字符表示</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
    </tr>
    <tr>
        <td>数字表示</td>
        <td>4</td>
        <td>2</td>
        <td>1</td>
        <td>4</td>
        <td>2</td>
        <td>1</td>
        <td>4</td>
        <td>2</td>
        <td>1</td>
    </tr>
</table>

Window 系统下文件的权限默认是可读、可写、不可执行，所以权限位数字表示为 `0o666`。

但在 node 中`fs.access`API 中 mode 参数使用 node 已定义的常量来表示，其它都选择默认，如`fs.open`中

```js
F_OK //表明文件对调用进程可见。 这对于判断文件是否存在很有用，但对 rwx 权限没有任何说明。 如果未指定模式，则默认值为该值。
R_OK //表明调用进程可以读取文件。
W_OK // 表明调用进程可以写入文件。
X_OK // 表明调用进程可以执行文件。 在 Windows 上无效（表现得像 fs.constants.F_OK）。
```

<table>
    <tr>
        <th>Window</th>
        <th colspan=3>文件所有者</th>
        <th colspan=3>文件所属组</th>
        <th colspan=3>其它用户</th>
    </tr>
    <tr>
        <td>权限项</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
        <td>读</td>
        <td>写</td>
        <td>执行</td>
    </tr>
    <tr>
        <td>字符表示</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
        <td>r</td>
        <td>w</td>
        <td>x</td>
    </tr>
    <tr>
        <td>数字表示</td>
        <td>4</td>
        <td>2</td>
        <td>0</td>
        <td>4</td>
        <td>2</td>
        <td>0</td>
        <td>4</td>
        <td>2</td>
        <td>0</td>
    </tr>
     <tr>
        <td>mode</td>
        <td colspan=3>6</td>
        <td colspan=3>6</td>
        <td colspan=3>6</td>
    </tr>
</table>

## 文件标识位 flag

当你对文件有权限操作时，具体对应执行哪些操作动作：读取、写入、还是即读又写呢？这些动作需要用符号标识：

-   r：读取
-   w：写入
-   s：同步
-   +：增加相反操作
-   x：排他方式

具体组合后的意义如下：常用的就`r+` `w+`
符号 | 含义
:-|-
r | 读取文件，如果文件不存在则抛出异常。
r+ | 读取并写入文件，如果文件不存在则抛出异常。
rs | 读取并写入文件，指示操作系统绕开本地文件系统缓存。
w | 写入文件，文件不存在会被创建，存在则清空后写入。
wx | 写入文件，排它方式打开。
w+ | 读取并写入文件，文件不存在则创建文件，存在则清空后写入。
wx+ | 和 w+ 类似，排他方式打开。
a | 追加写入，文件不存在则创建文件。
ax | 与 a 类似，排他方式打开。
a+ | 读取并追加写入，不存在则创建。
ax+ | 与 a+ 类似，排他方式打开。

## 文件描述符 fd

文件描述符 fd 即操作的文件的唯一标识符。

操作系统会为每个打开的文件分配一个名为文件描述符的数值标识，文件操作使用这些文件描述符来识别与追踪每个特定的文件。Window 系统使用了一个不同但概念类似的机制来追踪资源。

为方便用户，NodeJS 抽象了不同操作系统间的差异，为所有打开的文件分配了数值的文件描述符。

在 NodeJS 中，每操作一个文件，文件描述符是递增的，文件描述符一般从 3 开始，因为前面有 0、1、2 三个比较特殊的描述符，分别代表 process.stdin（标准输入）、process.stdout（标准输出）和 process.stderr（错误输出）。

使用`open`打开一个文件就会产生对应的`fd`

```js
fs.open(path[, flags[, mode]], callback)
// flags 默认值: 'r'
// mode <integer> 默认值: 0o666（可读写）
```

示例：

```js
// 异步写法
const fs = require('fs')
fs.open(__dirname + '/fs_open.txt', 'r+', (err, fd) => {
	if (err) {
		return console.error(err)
	}
	console.log(`文件打开成功，文件描述符fd：${fd}`)
})
// 文件打开成功，文件描述符fd：3
```

```js
// 同步写法
const fs = require('fs')
try {
	let fd = fs.openSync(__dirname + '/fs_open.txt', 'r+')
	console.log(`文件打开成功，文件描述符fd：${fd}`)
} catch (err) {
	return console.error(err)
}
```

## 文件系统操作 API

fs 的 API 主要分为四大部分：

-   文件信息的查询和访问权限： `fs.stats` `fs.access`
-   文件的操作：打开、读取、裁取、写入，追加、拷贝、删除、关闭；
-   文件目录的操作：创建、删除、查询；
-   fs 操作的 Promise API

### 文件信息的查询 `fs.stats`

语法：

```js
fs.stat(path[, options], callback)
```

示例：

```js
fs.stat(__dirname + '/fs_open.txt', (err, stats) => {
	if (err) {
		return console.error(err)
	}
	console.log(stats.isFile())
	console.log(stats)
})
```

输出：

```js
true
Stats {
    dev: 3023868257, // 包含该文件的设备的数字标识符。
    mode: 33206, // 描述文件类型和模式的位字段。
    nlink: 1, // 文件存在的硬链接数。
    uid: 0, // 拥有该文件（POSIX）的用户的数字型用户标识符。
    gid: 0, // 拥有该文件（POSIX）的群组的数字型群组标识符。
    rdev: 0, // 果文件被视为特殊文件，则此值为数字型设备标识符
    ino: 2251799813686733, // 文件系统特定的文件索引节点编号。
    size: 87, // 文件的大小（以字节为单位）
    blksize: undefined, // 用于 I/O 操作的文件系统块的大小。
    blocks: undefined, // 为此文件分配的块数。

    atimeMs: 1572192123716.3237, // 表明上次访问此文件的时间戳,毫秒毫秒数
    mtimeMs: 1572192123716.3237, // 表明上次修改此文件的时间戳，毫秒数。
    ctimeMs: 1572192123716.3237, // 表明上次更改文件状态的时间戳，毫秒数。
    birthtimeMs: 1572192081341.962, // 表明此文件的创建时间的时间戳，毫秒数。
    atime: 2019-10-27T16:02:03.716Z, // 表明上次访问此文件的时间戳。
    mtime: 2019-10-27T16:02:03.716Z, // 表明上次修改此文件的时间戳。
    ctime: 2019-10-27T16:02:03.716Z, // 表明上次更改文件状态的时间戳。
    birthtime: 2019-10-27T16:01:21.342Z // 表示此文件的创建时间的时间戳。
}
```

平常有用的信息基本就文件大小 size 和时间相关。返回的实例 stats 也有一些常用方法：

```js
stats.isDirectory() // 布尔值，是否是目录
stats.isFile() // 布尔值，是否是文件
// 其它的见官网
```

但是要检查文件是否存在，但随后并不对其进行操作，则建议使用 fs.access()。

```js
// 检查当前目录中是否存在该文件。
fs.access(file, fs.constants.F_OK, err => {
	console.log(`${file} ${err ? '不存在' : '存在'}`)
})
```

### 文件访问权限查询 `fs.access`

测试用户对 path 指定的文件或目录的权限。如果可访问性检查失败，则错误参数将是 Error 对象。

```js
fs.access(path[, mode], callback)
```

其中 mode 使用 node 已定义的`fs.constants`中的常量来表示：

```js
F_OK //表明文件对调用进程可见。 这对于判断文件是否存在很有用，但对 rwx 权限没有任何说明。 如果未指定模式，则默认值为该值。
R_OK //表明调用进程可以读取文件。
W_OK // 表明调用进程可以写入文件。
X_OK // 表明调用进程可以执行文件。 在 Windows 上无效（表现得像 fs.constants.F_OK）。
```

```js
const file = 'package.json'

// 检查当前目录中是否存在该文件。
fs.access(file, fs.constants.F_OK, err => {
	console.log(`${file} ${err ? '不存在' : '存在'}`)
})

// 检查文件是否可读。
fs.access(file, fs.constants.R_OK, err => {
	console.log(`${file} ${err ? '不可读' : '可读'}`)
})

// 检查文件是否可写。
fs.access(file, fs.constants.W_OK, err => {
	console.log(`${file} ${err ? '不可写' : '可写'}`)
})

// 检查当前目录中是否存在该文件，以及该文件是否可写。
fs.access(file, fs.constants.F_OK | fs.constants.W_OK, err => {
	if (err) {
		console.error(`${file} ${err.code === 'ENOENT' ? '不存在' : '只可读'}`)
	} else {
		console.log(`${file} 存在，且它是可写的`)
	}
})
```

但一般如果是文件打开、读取、写入之前检查文件是否存在或是否有对应操作权限，不建议使用 fs.access 去判断，而是应该直接打开、读取或写入文件时去捕获回调的 error，如果文件无法访问则处理引发的错误，此 error 有对应的错误编码。因为异步操作当你调用 access 检查文件时，可能其它进程更改了文件状态，导致 access 返回的信息并不准确。

```js
// 不推荐的写法
fs.access('myfile', err => {
	if (!err) {
		console.error('myfile 已存在')
		return
	}

	fs.open('myfile', 'wx', (err, fd) => {
		if (err) throw err
		// do something;
	})
})

// 推荐不使用access，直接捕获err错误码
fs.open('myfile', 'wx', (err, fd) => {
	if (err) {
		if (err.code === 'EEXIST') {
			// err.code === 'ENOENT' 是不存在
			console.error('myfile 已存在')
			return
		}

		throw err
	}

	// do something
})
```

### 目录的操作

语法：

```js
// 创建目录
fs.mkdir(path[, options], callback)
// 读取目录内容，返回该目录下文件名的数组
fs.readdir(path[, options], callback)
// 删除目录，删除非空目录报错 Error: ENOTEMPTY
fs.rmdir(path[, options], callback)
```

示例：

```js
// 创建
fs.mkdir(__dirname + '/fs', err => {
	if (err) {
		return console.error(err)
	}
	console.log('目录创建成功')
})

// 读取
fs.readdir(__dirname + '/fs', (err, files) => {
	if (err) {
		return console.error(err)
	}
	console.log(files) // [ 'dir.txt', 'fs.txt' ]
})

// 删除，如果目录不为空，则报错Error: ENOTEMPTY
fs.rmdir(__dirname + '/fs', err => {
	if (err) {
		return console.error(err)
	}
	console.log('删除成功')
})
```

### 文件的操作

常见的文件操作包括：

-   打开 open
-   读取 read readFile
-   裁取 truncate
-   写入 write writeFile
-   追加 append
-   拷贝 copy
-   删除 unlink
-   关闭 close
-   重命名 rename
-   观察文件 watch
-   更改文件所有权 chown
-   更改文件权限 chmod

以下方法都有同步方法，即添加`Sync`
部分方法还有针对 fd 的方法，方法名前加`f`,如上面的`fstat` `fchown` `fchmod` `ftruncate`，这类方法需要传入`fd`作为参数。

语法：

```js
// 打开，返回fd唯一的途径
fs.open(path[, flags[, mode]], callback)
// 读取
fs.read(fd, buffer, offset, length, position, callback) // 需要fd，open()返回fd
fs.readFile(path[, options], callback) // 读取文件的全部内容

// 裁取
fs.truncate(path[, len], callback) // 使用路径
fs.ftruncate(fd[, len], callback) // 使用fd

// 写入
fs.write(fd, buffer[, offset[, length[, position]]], callback) // 写入Buffer
fs.write(fd, string[, position[, encoding]], callback) // 写入string
fs.writeFile(file, data[, options], callback) // 写入文件全部内容

// 追加内容
fs.appendFile(path, data[, options], callback)

// 拷贝
fs.copyFile(src, dest[, flags], callback)

// 删除
fs.unlink(path, callback)

// 关闭
fs.close(fd, callback)

// 重命名
fs.rename(oldPath, newPath, callback)

// 观察文件
// 使用 fs.watch() 比 fs.watchFile 和 fs.unwatchFile 更高效。 应尽可能使用 fs.watch 代替 fs.watchFile 和 fs.unwatchFile。
fs.watch(filename[, options][, listener])
fs.watchFile(filename[, options], listener)

// 取消观察
fs.unwatchFile(filename[, listener])

// 更改文件所有权
fs.chown(path, uid, gid, callback)

// 更改文件权限
fs.chmod(path, mode, callback)
```

### 创建文件可读流和可写流

```js
// 创建可读流
fs.createReadStream(path[, options])

// 创建可写流
fs.createWriteStream(path[, options])
```
