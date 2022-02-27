# 模块 Module

[[toc]]

TS 中模块语法基本遵循 ES Module 语法。更详细的 ES Module 语法请查看[阮一峰：ECMAScript 6 入门 - Module 的语法](http://es6.ruanyifeng.com/#docs/module)

TS 中的模块导入导出支持声明（变量、函数、类、类型别名、接口）

## ES Module

### 具名导出导入

```js
export =====> import {} from 'filePath'
```

例如：

```js
// test.js
export interface ISomeInterface {/*...*/}
export const someConstVar = 'something'
export class SomeClass implements ISomeInterface {/*...*/}

// 另一种写法
interface ISomeInterface {/*...*/}
const someConstVar = 'something'
class SomeClass implements ISomeInterface {/*...*/}

export {ISomeInterface, someConstVar, SomeClass}
```

对应的导入

```js
import { ISomeInterface, someConstVar, SomeClass } from './test.js'
```

### 默认导出导入

```js
export default some  =======> import some from 'filePath'
```

例如：

```js
export default class SomeClass implements ISomeInterface {
	/*...*/
}
```

对应的导入

```js
import SomeClass from './test.js'
```

### as 关键字用于重命名

在导出时重命名

```js
export { SomeClass as SC }
// 导入时接收以SC
import {SC} from 'filePath
```

在导出时重命名

```js
import { someMethod as anotherMethodName } from 'someModule'
```

## 兼容 CommonJS / AMD

在 CommonJS 和 AMD 模块规范中，都有一个 exports 对象的概念。

例如 CommonJS 规范使用以下语法导出导入

```js
// 导出
exports.some = 'some thing'
exports.sometwo = 'other thing'
// 或默认导出
module.exports = 'some thing'
```

```js
// 导入
const someModule = require('./filePath')
```

TypeScript 也能够兼容 CommonJS 或者 AMD，主要通过以下两个语法实现，即：

-   `export =`定义导出的对象，可以是类、接口、命名空间、函数或者枚举
-   `import moduleName = require('module')` 用于导入一个使用了`export =`的模块

例如上面语句改成 TS 实现

```ts
const some = 'some thing'
export = some

// 导入
import someModule = rquire('./text.ts')
```

### 三斜线指令 和 命名空间

> namespace 是 ts 早期时为了解决模块化而创造的关键字，中文称为命名空间。由于历史遗留原因，在早期还没有 ES6 的时候，ts 提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，ts 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的 namespace，而推荐使用 ES6 的模块化方案了，故我们不再需要学习 namespace 的使用了。namespace 被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。

> 与 namespace 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了。

三斜线指令一般用于引入外部声明文件或命名空间。该指令需要放在文件最顶端，即首行代码。

语法：

```ts
// 表明这个文件使用了 @types/node/index.d.ts声明文件； 所在这个包在编译阶段会与引入的声明文件一起被包含进来。
/// <reference types="node" />
// 引入命名空间somenamespace.ts
/// <reference path="somenamespace.ts" />
```
