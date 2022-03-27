# Gulp

## Gulp 基本概念

完整的 `Gulp` 组成，包含以下几部分：

1. `Gulp CLI`: 它的作用仅仅是检查当前项目是否安装了本地环境的 Gulp，如果安装了，就启动它。
2. `Gulp`：本地 Gulp 有两个作用：一是提供 Gulp Api 调用；二是加载 gulpfile 构建指令和运行定义好的任务。
3. `Gulpfile`: 定义所有要运行的任务，这些任务会通过调用本地 Gulp API 和 Gulp plugin 插件来运行。
4. `Gulp plugin`: 一个插件基本用来完成一件事情。

`Gulp CLI` 根据命令行中输入的参数启动本地 `Gulp` ；本地 `Gulp` 读取 `Gulpfile` ；`Gulpfile` 加载 `Gulp` 插件，并且用 `Gulp API` 定义 task；最后由本地 `Gulp` 来加载这些 task。

> JavaScript 构建工具基本都是这样一个结构：一个包含核心功能及其API的核心模块，一个用户自定义的配置文件，和扩展其功能的插件系统，及实现命令行调用的 CLI 工具。

## 任务 task

`Gulp`构建工作就是执行一系列在 `Gulpfile`文件中定义的任务 `task`，我们可以把任务理解为构建工作的一系列步骤，每个任务可大可小，大的任务可以是多个子任务合并而成，小的任务可以是只有一个步骤。每个步骤的结果可以调用插件完成。

### `Gulp 3.x`

在 `Gulp 3.x`之前的版本中，可以使用 `gulp.task` API 把一个函数注册成一个任务 `task`，

```js
// gulpfile.js
const gulp = require('gulp')
gulp.task('hello', function (done) {
  console.log('Hello Gulp!')
  done()
})

// 命令行中执行 hello 任务
gulp hello
```

如果任务比较多的话，一个一个来执行，效率会很低，所以`gulp`提供了一个默认任务`default`，可以将要执行的所有任务放在一个数组中，这样只需要执行这个默认任务就能执行数组中的所有任务，并且在命令行调用时可以不需要指定任务名，而执行默认任务。

```js
// gulpfile.js
const gulp = require('gulp')
gulp.task('hello', function (done) {
  console.log('Hello Gulp!')
  done()
})

gulp.task('default', ['hello'])

// 命令行中执行
gulp
```

### `Gulp 4.x`

`Gulp 4.x`最大的变化：gulp不再支持同步任务．因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。

`Gulp 4.x`中定义的每一个任务（task）都可以直接是一个异步的 JavaScript 函数，此函数是一个可以接收 callback 作为参数的函数，调用 callback 函数作为任务结束。或者是一个返回 stream、promise、event emitter、child process 或 observable 类型值的函数。

```js
// gulpfile.js
function hello(cb) {
  console.log('Hello Gulp!')
  cb()
}
exports.hello = hello

// 命令行中执行 hello 任务
gulp hello
```

如果使用默认任务的话，可以在 `gulpfile.js`中使用 `module.exports = defalutTask`或者 `exports.default = defaultTaks`

```js
// gulpfile.js
function hello(cb) {
  console.log('Hello Gulp!')
  cb()
}
//exports.hello = hello
exports.default = gulp.series(hello)

// 命令行中执行默认任务
gulp
```

### 兼容

`Gulp 4.x`也是向下兼容的，所以仍然可以使用 `gulp.task` API 定义任务。但是对默认任务定义不再支持原来第二个数组形式的参数传入。可以使用新的API`gulp.series`代替。

```js
// gulpfile.js
const gulp = require('gulp')
gulp.task('hello', function (done) {
  console.log('Hello Gulp!')
  done()
})

// gulp.task('default', ['hello'])
gulp.task('default', gulp.series('hello'))

// 命令行中执行
gulp
```

### 任务的返回值

`Gulp 4.x`中定义的每一个任务（task）都可以直接是一个异步的 JavaScript 函数，此函数是一个可以接收 `callback` 作为参数的函数，调用 callback 函数作为任务结束。或者是一个返回 `stream`、`promise`、`event emitter`、`child process` 或 `observable`类型值的函数。[详细返回类型的例子参阅官网](https://www.gulpjs.com.cn/docs/getting-started/async-completion/)

```js
// 1. callback
function taskCb (cb) {
  console.log('hello gulp callback');
  cb()
}

exports.taskCb = taskCb

// 2. promise
function taskPromise () {
  console.log('Hello gulp promise!');
  return Promise.resolve()
}

exports.taskPromise = taskPromise 

// 3. async await
async function taskAsyncAwait () {
  console.log('Hello gulp async await!');
  await Promise.resolve()
}

exports.taskAsyncAwait = taskAsyncAwait

exports.default = gulp.series(taskCb, taskPromise, taskAsyncAwait)
```



### 任务类型：公开和私有
任务（tasks）可以是 **public（公开）** 或 **private（私有）** 类型的。
- **公开任务（Public tasks）** 从 `gulpfile` 中被导出`export`，可以通过 `gulp` 命令直接调用。
- **私有任务（Private tasks）** 被设计为在内部使用，通常作为 `series()` 或 `parallel()` 组合的组成部分。

一个私有（private）类型的任务（task）在外观和行为上和其他任务（task）是一样的，但是不能够被用户直接调用。如需将一个任务（task）注册为公开（public）类型的，只需从 gulpfile 中导出（export）即可。



### gulp 4.x 极简 API
- `gulp.src`
- `gulp.dest`
- `gulp.series`
- `gulp.parallel`
- `gulp.watch`
- `gulp.lastRun`