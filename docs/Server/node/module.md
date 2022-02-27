# module 模块

[[toc]]

## 模块概述
模块主要是为了解决代码逻辑的封装和变量的隔离。主要发展先后经历过：

- IFFE，自执行函数
- 全局命名空间，如jQuery的$全局变量
- eval(string)
- new Function(string)
- Commonjs (CMD)
- AMD / UMD
- ES module

## node模块类型
Node.js使用基于模块系统的文件。每个文件就是可以是一个模块。
- 内置模块
    node也将一些基础功能通过模块暴露给外部引用。这些就是内置模块。如http、path等。
- 文件模块
    自定义的逻辑或都业务代码
- 第三方模块（包）
    npm下载引入的第三方模块（包）

## node模块封装器
在使用require()导入，在执行模块代码之前，Node.js 会使用一个如下的函数封装器将其封装：
```js
(function(module, exports, require,  __filename, __dirname) {
// 模块的代码实际上在这里
});
```
一段`require()`实现的伪代码，它与require实现非常类似：
```js
function require(path) {
    const module = { exports: {} };
    const __filename = path
    const __dirname = '/'

    (funciton(module, exports, require, __filename, __dirname){
        // 模块代码在这
    })(module, module.exports, require, __filename, __dirname);

    // 最终需要返回module.exports
    return module.exports;
}
```
通过这样做，Node.js 实现了以下几点：

它保持了顶层的变量（用 var、 const 或 let 定义）作用在模块范围内（函数作用域内），而不是全局对象。

可以看到这里，封装函数会提供五个参数传入，所以这些看似全局的但实际上是模块提供的特定变量，其中exports不过是module.exports的别名，初始化时两都指向同一个地址。

## 模块的导出 module.exports 和 exports

module对象持有当前模块的信息
```
// module对象
module.id          // 模块的标识符，通常是完全解析后的文件名
module.filename    // 模块的完全解析后的文件名
module.path        // 模块的完全解析后的目录
module.paths      // node_module文件夹的搜索路径，是一个数组。
module.children   // 被该模块引用的模块对象。
module.parent     // 最先引用该模块的模块。
module.exports    // 导出模块，将期望导出的对象赋值给它
```
**module.expots 与 exports**
从上面模块封装机制可以看到，exports只是module.exports的一个别名，在初始化的时候形成了弱绑定关系（指向同一个对象的地址引用而已）。如果任意一方被重新赋值，这种绑定关系就会被解除。
require()最终返回的是module.exports的值。

看一下简单的示例来理解这层关系：
```js
var a = {name: 1};
var b = a;

console.log(a); // {name:1}
console.log(b); // {name:1}

b.name = 2;
console.log(a); // {name:2}
console.log(b); // {name:2}

var b = {name: 3};  // 此时重新赋值，ab的绑定关系已被切断
console.log(a); // {name:2}
console.log(b); // {name:3}
```
## 模块的引入 require

```js
// 引入本地模块：
const myLocalModule = require('./path/myLocalModule');

// 原生模块：
const jsonData = require('http');

// 引入 node_modules 目录下安装的第三方包
const _ = require('lodash');
```

## 模块路径查找规则



按模块类型执行不同的规则

通过require(moudule_id)传入的模块标识符moudule_id来判断是路径还是名称，如果是路径形式则按文件模块规则查找，如果是名称则按核心模块和第三方模块规则查找。

- 以 '/' 为开头的是绝对路径，以'./' 或 '../' 开头为当前文件为准的相对路径
- 如果没有以'/' './' '../'开头，直接以字符串作为标识符则为核心模块或第三方模块。

### 文件模块路径查找
路径结尾区分是文件名还是目录
第一步：从文件模块缓存中查找
文件名：
1. 按最后文件名在当前目录下查找，如果没有则尝试带上默认或设置的文件名扩展名查找，如.js .json等。

如果没有则报错：`MODULE_NOT_FOUND`

目录
1. 如果最后结尾是目录，则在目录中查找package.json文件，如果有则查找package.json文件中的main字段值。
1. 如果package.json文件不存在，或存在package.json但main字段没有或解析出错，则会试图加载目录下的index.js文件。

如果仍没有报告整个模块的缺失:`Error: Cannot find module 'dirname'`

### 核心模块和第三方模块路径查找
如果module_id不是路径，则按以下规则查找
1. 首先按module_id从原生模块中查找（缓存->原生模块加载）
1. 如果不是原生模块，按第三方模块加载

module.paths存放着当前目录往上各node_module文件夹存放的路径，如果在环境变量中设置了NODE_PATH的话，整个路径还包含NODE_PATH中的node_modules路径。

```
1、从module path数组中取出第一个目录作为查找基准。 
2、直接从目录中查找该文件，如果存在，则结束查找。如果不存在，则进行下一条查找。 
3、尝试添加.js、.json、.node后缀后查找，如果存在文件，则结束查找。如果不存在，则进行下一条。

4、尝试将require的参数作为一个包来进行查找，读取目录下的package.json文件，取得main参数指定的文件。 
5、尝试查找该文件，如果存在，则结束查找。如果不存在，则查找index文件。 
6、如果继续失败，则取出module path数组中的下一个目录作为基准查找，循环第1至5个步骤。 
7、依次module path中取值执行1-6步骤，直到最后一个值。
8、如果仍然失败，则抛出异常 
```
- 原生模块优先级大于第三方模：当第三方的模块和内置模块同名时，内置模- 块将覆盖第三方同名模块。因此命名时需要注意不要和内置模块同名。
- 缓存区优先加载：文件模块和原生模块各有一个缓存区，优先从缓存区加载。如果缓存区没有被加载过，则调用加载模块，执行并缓存。

## 模块的缓存
require.cache: 被引入的模块将被缓存在这个对象中。
模块在第一次加载后会被缓存。 这也意味着:
- 每次调用 require('foo') 都解析到同一文件，则返回相同的对象。
- 多次调用 require(foo) 不会导致模块的代码被执行多次

注意一点：模块是基于其解析的文件名进行缓存的，即module.id跟filename是同一个绝对路径。所以引用不同存放位置的同一个模块，当做两个不同的模块缓存和使用。

## 模块的循环引用
当循环调用 require() 时，一个模块可能在未完成执行时被返回。为了防止无限的循环，会返回**临时先返回一个未完成的副本**。

一个官网的例子：
```js
// a.js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');
```
```js
// b.js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');
```
此时a.js和b.js形成循环引用
```js
// main.js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);
```
当 main.js 加载 a.js 时， a.js 又加载 b.js。 此时， b.js 会尝试去加载 a.js。 为了防止无限的循环，会返回一个 a.js 的 exports 对象的 未完成的副本 给 b.js 模块。 然后 b.js 完成加载，并将 exports 对象提供给 a.js 模块。

输出结果，并不会陷入死循环：
```
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true，b.done=true
```

## 模块和包


模块是Node.js应用程序的基本组成部分，文件和模块是一一对应的。换言之，一个Node.js文件就是一个模块，这个文件可能是JavaScript代码、JSON或者编译过的C/C++扩展。

包是在模块基础上更深一步的抽象，Node.js的包类似于C/C++的函数库或者Java/.Net的类库。它将某个独立的功能封装起来，用于发布、更新、依赖管理和版本控制。所以Node.js的包是一个目录，其中包含了一个JSON格式的包说明文件package.json。

Node.js根据CommonJS规范实现了包机制，开发了npm来解决包的发布和获取需求。

严格符合CommonJS规范的包应该具备以下特征：

- package.json必须在包的顶层目录下；
- 二进制文件应该在bin ；
- JavaScript代码应该在lib目录下；
- 文档应该在doc目录下；
- 单元测试应该在test目录下。

**package.json**
package.json是CommonJS规定的用来描述包的文件，Node.js在调用某个包时，会首先检查包中package.json文件的main字段，将其值作为包的入口模块，如果package.json活main字段不存在，会尝试寻找index.js或index.node作为包的入口。

完全符合规范的package.json文件应该含有以下字段：

- name: 包的名称，必须是唯一的，由小写英文字母、数字和下划线组成，不能包含空格。
- description：包的简要说明。
- version：符合语义化版本识别规范的版本
- keywords：关键字数组，通常用于搜索。
- maintainers：维护者数组，每个元素包含name、email（可选）、web（可选）字段。
- contributors：贡献者数组，格式与maintainers相同。包的作者应该是贡献者数组的第一个元素。
- licenses：许可证数组，每个元素要包含type（许可证的名称）和url（链接到许可证文本的地址）字段。
- repositories：仓库托管地址数组，每个元素要包含type（仓库的类型，如git）、url（仓库的地址）和path（相对于仓库的路径，可选）字段。
- dependencies：包的依赖，一个关联数组，由包名称和版本号组成。

package.json文件可以使用`npm init`来初始化。

总结：

- **模块（module）**是任何可以由Node.js的require()加载的文件或目录（目录中引用index文件)。
- **包（package）**是一个由package.json定义的文件目录。

## 各类型模块方案的调用

-   [commonJs 和 ES Module 规范](http://es6.ruanyifeng.com/#docs/module-loader#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%A0%E8%BD%BD)

```
/******** CommonJs *********/
语法：
导出： module.exports = {}    exports = {}
导入： require()
特点： 一句话总结：值的浅拷贝，运行时加载
      模块内隐含`module`对象，记录该模块相关信息，包括id，name，exports，loaded等
      模块隐式声明一个简写语句：var exports = module.exports
      因为模块导出是一个对象，对象只有运行时生成，所以commonJs模块是动态运行时确定模块内容的。
      因为模块导出是一个对象，所以导出模块是一个值的浅拷贝。
      （用对象的内存模式理解，基本类型是值的完全复制，引用类型是内存地址的引用）
      该规范使用导入模块会缓存模块，只会在第一次完全运行模块内代码，第二次开始都是从缓存内取值。
      导入require时会建一个缓存对象存放模块
使用：是Node的默认规范，基本使用在node环境。
      如果在浏览器环境使用需要使用工具转换，比如Browserify
```
```
/******* ES Module ********/
语法：
导出： 默认导出：export default {}          命名导出：export {}
导入： import anyname from 'path'          import { } from 'path'   名称一一对应，或使用`as`重命名
特点： 一句话总结：值的引用，编译时链接
      ES module默认使用严格模式。
      是在静态编译时确定模块关系的。可以把ES Module理解为只是建立了两个模块间的一种连接关系或者叫值的映射关系。
      当使用默认导出时，相当于导出对象default，此时表现相同于commonjs，对基本类型变量导入，在导出模块内值改变并不会表现在导入的使用模块内。
      引用类型可以实时更新。
      （也是可以用对象内存模式理解，因为基本类型赋值给变量属性时都是值的拷贝，而引用类型是内存地址的引用）
      ES module的映射特征在命名导出时体现最为突出，此时不管是基本类型还是引用类型值，在导入和导出模块，值都是一种映射关系，实时更新。
      当在导出模块内变化，导入模块使用时也是最新的值。
使用：在浏览器中直接使用，需要`script`标签声明`type="module"`后才可以使用`import`引入模块。如`<srcipt type="module"></script>`
      在node环境因为commonJs的历史原因，暂未完成支持，只有部分实验性的方法。
      如采用ES module规范的模块使用`.mjs`后缀命名，可以使用cli命令`node --experimental-modules module_name.mjs`

```
```
/********* AMD ***********/
语法：
导出： define('module_name', ['other_module_depend'], function() {/*return 出相关代码*/})
导入： require(['module_name'], function(module_name) {/*导入成功执行的回调*/})
特点： 通过AMD形式定义的模块加载是非阻塞的，适合在浏览器中使用。
      但采用回调的方法和浏览器异步回调会出现回调地狱问题一样，在实现应用中越来越少，逐步被标准化的ES module形式替代

```