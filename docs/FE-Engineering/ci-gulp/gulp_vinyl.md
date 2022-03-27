# Gulp 虚拟文件格式 Vinyl

 `Gulp`是基于 `Node Stream`的构建工具，这句话的意思是 `Gulp`本身使用了 `Node Stream`。

上一章简单介绍了 `Stream`的概念。虽然 `Node`中可以通过`require('stream')`直接引用`Stream`，但实际项目开发中很少会需求这样直接使用底层的`Stream`。大部分情况下，我们用的都是 `Stream Consumers 流的消费者`，也就是具有`Stream`特性的各种子类。

比如`Node`中就有许多核心模块用到了`Stream`，它们就是`Stream Consumers`：

- 客户端的HTTP： 请求服务器会产生可写流，接收服务器响应产生可读流
- 服务器的HTTP： 接受客户的请求是可读流，响应客户端是可写流
- 文件操作fs： 创建可写流`fs.createWriteStream()`，创建可读流`fs.createReadStream()`
- node的输入输出： 输入为可读流`process.stdin`，输出为可写流`process.stdout `或 `process.stderr`
- 还有其它 `crypto`、`zlib`、`TCP socket`、`child_process`子进程操作等

所以`Gulp`使用的`Stream`也不是原生的`Node Stream`，实际上 `gulp.src / gulp.dest`以及插件操作的流应该叫做`Vinyl File Object Stream`，也算是一种`Stream Consumers`。透过 `gulp`的源码发现，内部依赖的其实都是同一种流模式`vinyl-fs`。

> `Stream Consumers` >> `Stream`继承于`Node`事件对象`EventEmitter`。即 `Stream`是 `EventEmitter`的实例。

```js
// gulp 依赖的最主要的两个核心模块
var Undertaker = require('undertaker');
var vfs = require('vinyl-fs'); // 当前 gulp4.0 所使用的 vinyl-fs 版本是 v2.0.0

util.inherits(Gulp, Undertaker); // undertaker 实现了 task / series / parallel
Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
```

`vinyl-fs `其实是在` vinyl `模块的基础上做了进一步的封装，所以需要先了解 `vinyl`。

## `Vinyl`

`Vinyl`虚拟文件格式，可以把它看做是一个文件描述对象，通过它可以轻松构建单个文件的**元数据描述对象**`metadata object`。

```js
// 在 gulp/Vinyl 源码中可以看到 Vinyl 被定义为一个构造函数 File，定义了一些描述文件的属性和原型方法
function File(file) {// 读取的本地文件 file
	this.stat = file.stat || null
  this.contents = file.contents || null
  this.cwd = file.cwd || process.cwd();
  this.base = file.base;
  this._isVinyl = true;
  this._symlink = null;
  // 省略...
}
File.prototype.isBuffer = fn
File.prototype.isStream = fn
File.prototype.isNull = fn
// 省略...
```

通过`Vinyl`生成的实例对象，可以通过调用对象的属性和方法获取到该文件所对应的数据内容*（Buffer类型）*、路径、文件名等。

```js
// 官网示例
const Vinyl = require('vinyl');

const file = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer('var x = 123')
});

file.relative === 'file.js';
file.contents.toString() === 'var x = 123'
file.dirname === '/test';
file.basename === 'file.js';
file.stem === 'file';
file.extname = '.js';
file.path === '/specs/file.js';
```

**`Vinyl`的意义**

`Gulp`为什么不直接使用 `Node Stream`呢？

```js
gulp.task('css', function() {
  gulp.src('./styles/**/*.css')
  		.pipe(gulp.dest('./stylesheets'))
})
```

看上面这段代码，虽然这段代码没有用到任何插件，只用到最基本的`gulp.src / gulp.dest`。这段代码是有效果的，就是将一个目录下的全部样式文件都复制到另一个目录，这其中最重要的一点，那就是原目录下所有的文件树，包含子目录、文件名等信息都原封不动的保留复制了另一个目录下。

但普通的 `Node Stream`只传输 `String`或`Buffer`类型，也就是只关注上述文件的内容部分。但`Gulp`不只用到了文件的内容，而且还用到了这个文件的相关无信息，比如路径。因为 `Gulp`的`Stream`是对象风格的，也就是`Vinyl File Object Steam`，这就是为什么 `Gulp`类型的`Stream Consumers`拥有`contents / path / base`这些属性了。

## `Vinyl-fs`

Vinyl 虽然可以很方便地来描述一个文件、设置或获取文件的内容，但还没能便捷地与`Node`的文件系统`fs`进行接入。

我们希望可以使用通配符的形式来简单地匹配到想要的文件，把它们转为可以处理的 Streams，做一番加工后，再把这些 Streams 转换为处理完的文件。

`Vinyl-fs` 就是实现这种需求的一个 `Vinyl` 适配器。

```js
var vfs = require('vinyl-fs');

vfs.src(['./js/**/*.js', '!./js/vendor/*.js'])
  .pipe(fs.dest('./output'));
```

`Vinyl-fs` 的 `.src` 接口可以匹配一个通配符，将匹配到的文件转为 `Vinyl File Object Stream`，而 `.dest` 接口又能消费这个 `Stream`，并生成对应文件。

即 `Gulp.src`读取文件时，将生成一个 `Vinyl`对象来表示文件，包括文件路径、内容和其它文件无数据。这个 `Vinyl`对象可以使用 gulp 插件进行操作，还可以使用 `Glup.dest`将这个文件对象持久化到文件系统，即本地硬盘里。

`vfs.src`接口所传入的 “通配符”是有个专门术语的，叫做 `Glob`

> 所谓的 GLOB 模式是指 shell 所使用的**简化了的正则表达式**：
> ⑴ 星号（*）匹配零个或多个任意字符；
> ⑵ [abc]匹配任何一个列在方括号中的字符（这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）；
> ⑶ 问号（?）只匹配一个任意字符；
> ⑷ 如果在方括号中使用短划线分隔两个字符，表示所有在这两个字符范围内的都可以匹配（比如 [0-9] 表示匹配所有 0 到 9 的数字）。

在 `vinyl-fs` 中，是使用 [glob-stream](https://github.com/gulpjs/glob-stream/tree/v5.0.0) *<v5.0.0>*通过算法*（[minimatch](https://github.com/isaacs/minimatch)）*来解析 GLOB 的，它会拿符合上述 GLOB 模式规范的 pattern 参数去匹配相应的文件。

> `glob-stream` 又是借助了 [node-glob](https://github.com/isaacs/node-glob) 来匹配文件列表的。

`glob-stream`匹配到文件后所创建的流中，写入的数据形式如下：

```js
stream.write({
  cwd: opt.cwd,
  base: basePath,
  path: path.normalize(filename)
});
```

可以看到这个结构正是创建 `Vinyl`实例所需要传入的`file`配置参数。

## Stream 转换

为了让`Gulp`可以更多地复用`Node`生态体系的`Stream`，出现了许多 `Stream`转换插件。

**vinyl-source-stream**

可以把普通的 `Node Stream`转换为 `Vinyl File Object Stream`。这样就相当于可以把普通的`node stream`连接到`Glup`体系内。

```js
const fs = require('fs')
const source = require('vinyl-source-steam')
const gulp = require('gulp')

const nodeStream = fs.createReadStream('./test.txt')
nodeStream.pipe(source('test.txt'))
					.pipe(gulp.dest('./dest'))
```

上述代码中的 stream 管道，作为起始的并不是`gulp.src`，而是普通的 `node stream`。但是经过`vinyl-source-stream`的转换后，就可以用`gulp.dest`进行输出。

我们知道 `vinyl`至少要有`contents`和`path`属性，而这里通过 `fs.createReadStream` 获取到的只是 `contents`，因为还要指定一个 `filename`作为`path`，即`source([filename])`。

`vinyl-source-stream`中的`stream`指的是生成的`Vinyl File Object Stream`实例对象中的 `contents`类型是`stream`。类似的还有`vinyl-source-buffer`，它的作用相同，只是生成的`contents`类型是`Buffer`。

## 参考链接

- [gulp源码解析（二）—— vinyl-fs](https://www.cnblogs.com/vajoy/p/6357476.html)
- [探究Gulp的Stream](https://segmentfault.com/a/1190000003770541)
- [Vinyl 实例具体属性和方法](https://www.gulpjs.com.cn/docs/api/vinyl/#%E9%80%89%E9%A1%B9)