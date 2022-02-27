# 语句

[[toc]]

## 声明语句

语句表示一种操作，所以声明语句就是用于声明一个变量，指向一段内存中存储的表达式的值。

主要声明语句包括：
- 变量声明：var / let
- 常量声明：const
- 函数声明：function
- 类声明：class
- 模块导入变量：import
- 模块导出变量：export

### var

### let

### const

### function

`function`用于声明一个变量，表示一个函数。
```js
function example() {}
example()
```
关于函数更详细的内容，查看[函数章节](/ES/Function/)

### class

`class`会声明一个变量，用于构造一个类。

```js
class Person {}
```
关于类的具体内容查看[类章节](/ES/Class/)

### import

`import`语句也会声明一个变量，来接收模块导出的值。
```js
// someModule1.js 默认导出
export default example
// 引入
import example from './someModule1.js'

// someModule2.js 具名导出
export example1
export example2
// 引入
import {example1,example2} from './someModule2.js'

// someModule.js 合并一起
export example1
export example2
export default example
// 引入
import example, {example1, example2} from './someModule.js'
```

详细内容见[模块章节](/ES/ESModule/)


默认情况下，JS的语句执行流程是从上到下顺序执行。但通过使用特殊的语句可以改变语句默认的执行顺序。这些语句称为流程控制语句

## 条件语句

### if

### switch

## 循环语句

### while

### do-while

### for

### for-of

### for-in

## 中断语句

### return

`return`语句通过用于函数中，表明当前函数执行结束，该函数会退出函数调用栈。

最主要的一点，是如果一个函数执行完，没有显式声明调用`return`语句，则默认执行`return undefined;`，即返回一个undefined值。

### throw

`throw`语句用于抛出一个错误，并中断代码执行
```js
throw value; // value通过使用Error()构造函数生成错误实例抛出
```
详细内容见[错误处理Error](/ES/Error/)章节

### debugger

`debugger`语句用于代码调试，会产生一个断点。

```js
debugger;
```

如果执行到此行，程序中断执行，并显示调试界面，如果执行不到，则不会发生任何事情。

## 错误捕获语句 
### try-catch

详细内容见[错误处理Error](/ES/Error/)章节

## 模块导出导入语句

基于模块规范不同，导入导出语句关键字也不同。详细内容见[模块章节](/ES/ESModule/)
