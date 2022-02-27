# 函数基础概念

[[toc]]

- 函数种类
  - 普通函数
  - 构造器函数 constructor
  - 箭头函数 Arrow Function
  - 生成器函数 Generator
- 函数创建
  - 函数声明
    - 具名函数声明
    - 匿名函数声明
  - 函数表达式
    - 匿名函数表达式
    - 具名函数表达式
  - 函数构造器创建 Function(arg1,arg2,..., funBody)
  - 函数声明 VS 函数表达式
- 函数调用
  - 作为普通函数调用
  - 作为构造器函数调用（使用new 创建对象）=> 如何限制函数只作为构造器函数：1. 严格模式；2. new.target
  - 作为对象方法调用（obj.method）
  - 作为泛型方法调用（借调方法，使用call/apply/bind调用）
  - 作为右值表达式调用（自执行函数IIFE：括号（）、void、+ 、 - 、 ~）
- 函数参数
  - 形参 parameter
  - 实参 argument
  - rest参数 和 spread参数
  - 参数默认值
  - 参数列表和具名参数
  - 隐含参数 this arguments

在ES中函数的概念这所以如此重要，原因之一在于函数是程序执行过程中最主要的模块单元。除了全局js代码是在页面构建的阶段执行的，我们编写的绝大部分代码都是在函数内执行的。

函数的一个主要作用是实现了代码复用，缩写在一处，可以在其它地方多次调用函数执行同样的代码。


## 函数种类

在ES中，函数主要以几类形式出现：

- 普通函数
- 作为对象属性（方法）
- 对象构造器
- 箭头函数
- 生成器函数

```js
// 1. 普通函数
function fn() {}                // 函数声明
let fn = function () {}        // 函数表达式

// 2. 对象方法
let obj = {
  descible: function () {},   // 旧语法
  say() {},                   // ES2015新语法
}

// 3. 构造函数
function Person (name) {
  this.name = name
}

// 4. 箭头函数
let fn = arg => arg * 2

// 5.生成器函数
function* Gen() { yield 1}
```

构造函数的应用在前面[面向对象](/ES/oop-0-index)中已经详细总结了。

生成器函数作为ES6新增语法，根据其作用将在后面[异步编程]()总结。

所以本节主要总结普通函数，对象方法和箭头函数的相关知识。

## 函数创建

在ES中定义函数最常用的方式是函数声明和函数表达，两者极其相似，但又存在细微差别。

### 函数声明

```js
function fn (arg1, arg2) {
  return arg1 * arg2
}

fn(1,2)
```
函数声明代码主要有以下部分：
- 强制要求以`function`关键字开头
- 必须的函数名
- 圆括号，可以没有参数，也可以有参数，参数间以逗号分隔
- 大括号包裹的函数体，即函数执行代码

函数作为对象的特殊之处是函数能被调用，所以它必须具有一种能被引用的方式，唯一的方式就是就是通过函数名字。

像上面声明的函数，函数名就是`fn`，调用函数写成`fn(1,2)`

### 函数表达式

函数是一等对象，函数可以作为值赋值给变量和对象属性，所以函数可以同表达式赋值一样定义：
```js
let fn = function (arg) {
  return arg * 2
}
```
这样，函数作为赋值表达的一部分，叫做函数表达式。

比如以下形式，函数都作为表达式一部分，都属性函数表达式
```js
+function fn() {}
(function () {})() // IIFE
```

#### 具名函数表达式

> (Named function expressions，NFE)

函数表达式还有另外一种形式，我们可以在函数表达式，单独声明函数名称，像这样：
```js
let fn = function myfun(arg) {
  return arg * 2
}

console.log(fn.name)  // myfun
```
像此类函数表达式，我们称为具名函数表达式。

1. 具名函数表达式特点：

**定义的函数名作用域是只能在函数的主体内，即只在函数体内可用，代表函数自身，在函数体外不可用。**

```js
let fn = function myfun(arg) {
  console.log(myfun)
  return arg * 2
}

fn(1)               // 输出函数体字符串形式
console.log(myfun) // ReferenceError: myfun is not defined
```
一道具名函数相关的面试题：
```js
var b = 10
let fn = function b() {
  b = 20
  console.log(b) 
}
fn() // [Function: b]
console.log(b) // 10
```
解释：函数fn是一个具名函数表达式，fn()执行时，函数内部会多出一个系统自动创建表示具名函数名称的变量b，它是只读的，所以即使主动对只读变量赋值`b=20`会被忽略。b仍表示具名函数本身。

2. 具名函数表达式的作用

作用一：具名函数表达式的作用主要为函数递归调用提供便利。

比如求一个数列相加的和，如果用非具名函数表达也能实现预期结果：
```js
let sequenceResult  = function(n) {
  if (n === 0) {
    return n
  } else {
    return n + sequenceResult(n-1)
  }
}

sequenceResult(10) // 55
```
但这样存在一个未知的风险是，`sequenceResult`作为一个变量很容易被赋值为其它值，导致后面的调用报错。

```js
let sequenceResult  = function(n) {
  if (n === 0) {
    return n
  } else {
    return n + sequenceResult(n-1)
  }
}

let other = sequenceResult
sequenceResult = 'some value'

other(10) // TypeError: sequenceResult1 is not a function
```

此时如果用具名函数表达式，则不存在这个问题：

```js
let sequenceResult  = function sequenceSum(n) {
  if (n === 0) {
    return n
  } else {
    return n + sequenceSum(n-1)
  }
}

sequenceResult(10) // 55

let other = sequenceResult
sequenceResult = 'some value'
other(10) // 55
```

作用二：具名函数表达式在调试时，可以明确地在调用栈中看到，如果是不加这名称，也就是"匿名函数表达式"在调试时是看不准是呼叫什么的。这使得调试时多了一些便利，所以它会被用在这个情况下。


### 函数声明 VS 函数表达式

函数声明和函数表达式的主要区别，在于函数作用域内，存在声明提升。

即函数声明形式的函数：可以在函数声明前调用，而函数表达式不行。

> 具体关于作用域和声明提升可以查看[函数运行时概念]()

```js
// 函数声明：函数调用在函数声明前
fn(10)
function fn(arg) {return arg * 2}

// 函数表达式不可以在函数定义之前调用
fn(10)  // ReferenceError: fn is not defined
let fn = function (arg) {return arg * 2}
```

### 函数构造器创建函数

函数作为对象类型，ES语言中也像其它对象一样，提供了对应的构造器函数`Function()`

Function 构造函数创建一个新的 Function 对象。[MDN Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)

- 直接调用此构造函数可用**动态创建函数**。
- Function 构造函数只在全局作用域中运行。

语法：

最后一个参数作为函数体代码，之前为定义函数的形参
```js
new Function ([arg1[, arg2[, ...argN]],] functionBody)
```
例子：

```js
const sum = new Function('a', 'b', 'return a + b');

console.log(sum(2, 6)); // 8
```

这种方式基本很少在实践代码中使用。

另外：通过面向对象的知识，我们需要知道：

**每个ES中定义的函数都是一个`Function`构造器的实例对象，从`Function.prototype`上继承属性和方法**

## 函数调用

整理函数调用方式，主要有以下几种：
- 作为函数直接调用，如`fn()`
- 作为对象方法调用，如`obj.fn()`
- 作为构造函数调用，如`new Fn()`
- 作为泛型方法调用，使用`call / apply / bind`将函数绑定到特定的函数上下文，如`fn.call(obj,arg)`

以上不同的函数调用方式，主要区别在于：**函数调用时，创建的函数上下文时，传递给`this`参数的值不同。**

在函数章节的开篇，已经说过，在ES中函数本质上也是一种对象，在数据类型中属于对象类型。在语言实现层面，属性规范类型中的`Reference`类型。
> Reference类型由两部分组成，一个对象和一个属性值。

当 Reference 类型在参与表达式运算时，Reference 类型中的属性值会被用来参与运算。而当类似函数调用、delete对象属性等操作时，则用到是 Reference类型结构中的对象。

所以函数调用时，该函数属于Reference类型结构中的对象会作为this值，传入函数执行上下文中。而调用函数的表达式形式的不同，Reference结构中的对象值也不同，所以可以说：this值是与函数调用时使用的表达式相关。

> this的设计来自JS早年，通过这个的方式，模仿了JAVA的语法设施，实现在JS中没有“类”的基础下可运算时使用


关于函数调用涉及的更具体的概念：函数上下文、this指向、作用域等概念将在下节[函数运行时](/ES/fn-3-runtime)总结。

## 函数参数

函数参数的理解，主要有以下几点：
- 形参（parameter）和 实参（argument）
- rest参数 和 spread 参数
- 列表参数 和 具名参数
- 隐含参数: this 和 arguemnt

### 形参（parameter）和 实参（argument）

- 形参 （parameter）是我们定义函数时所列举的变量
- 实参（argument）是我们调用函数时传递给函数的变量

```js
// 函数定义时列举的parm1 / parm2 称为形参
function fn (parm1, parm2) {
  return parm1 * parm2
}

// 函数调用时传递的 1 / 2 或 arg1 / arg2 称为实参
fn(1,2)
let arg1 = 1, arg2 = 2
fn(arg1, arg2)
```

### rest参数 和 spread 参数

在ES2015(ES6)版本中，加入了一种新语法，即函数的rest参数 和 spread 参数。

两者共同特征是参数加上三个点的省略号（...）前缀。
两者的主要区别同形参和实参区分一样，也是根据函数声明和调用时的情形下：
- rest 参数（也称剩余参数）是定义函数时表示剩余参数列表，**聚合**分散的参数为一个数组形式参数。**即rest参数出现在形参中**。
- spread 参数（也称展开参数）是调用函数时传递给函数的参数列表，**解构**传入的一个数组单个元素参数或对象参数为各个属性参数。**即spread参数出现在实参中**。

> rest参数只能出现在函数最后一个参数。如果试图把省略号放在不是最后一个形参时都会报语法错误。

> spread实际是一种运算符操作，展开运算符，不仅应用在函数实参中，在日常表达式中也可以操作数组和对象。常作为解构语法中的一部分。

```js
// rest参数出现在函数定义时
function fn(parm1, parm2, ...parm) {
  console.log(Array.isArray(parm))
  console.log('parm', parm)
}

fn(1,2,3,4,5,6)  // true  parm [3,4,5,6]
```

```js
let arr = [1,2]
function fn (parm1, parm2) {
  console.log('arr：', parm1, parm2)
}

fn(...arr) // arr: 1,2 
```
spread作为运算符操作，

```js
let arr1 = [1,2], arr2 = [3,4]
let arr = [...arr1, ...arr2]    // arr = [1,2,3,4]

let obj = {name:'tom', age:12}
let clone = {...obj}
```

### 列表参数 和 具名参数

在函数调用时，我们必须将形参和实参做映射，才能获取对应参数的值。通常有两种方式：
- 列表参数，也可以叫做位置型参数：通过参数位置来映射。传入的第一实例对应第一个形参，第二个实参对应第二个形参，以此类推
- 具名参数，通过参数名称来映射。在函数定义时为形参定义一个名称，在函数调用时，传入实参的名称与形参名称只要一致，而不需要关心参数顺序。

但在JS中并不像Python或是其它语言原生支持具名参数，通常使用对象字面量来模拟具名参数，并经常与ES6新语法中对象解构配合使用。

```js
// python中具名参数的语法
getFullName(firstName='lei', lastName='li')

// js中通过对象模拟
// 在函数声明时通过对象作为形参，在函数体中使用对象解构展开
function getFullName(option) {
  let { firstName, lastName } = option
  return lastName + firstName
}
// 函数调用时传入同属性名的对象
getFullName({firstName:'lei', lastName:'li'})
```

具名参数的优势，也是列表参数的劣势，有两点：
- 就是在函数调用时能够一目了然的知道参数描述的意义。
- 不用考虑参数传递的顺序
```js
// 列表参数调用
selectEntries(3,20,2) // 不根据上下文代码，完全不知道这里的数字代表什么

// 具名参数调用
selectEntries({start:3, end:20, step:2}) // 清晰明了
selectEntries({end:3, start:20, step:2}) // 不用严格顺序，只要形参中定义的名称一样即可
```

最佳实践中，在函数参数大于2个时，通常使用具名参数。在1个或2个参数时，经常使用列表参数。

### 参数默认值

在ES6之前，要为参数设置默认值，经常利用以下一点来实现。
- 当某个形参没有对应的实形时，值为 `undefined`
```js
// if 语句判断
function fn(name, age) {
  if (name === 'undefined') {
    name = 'tom'
  }
  if (age === 'undefined') {
    age = 18
  }
}
// 或者使用？三元运算符
function fn(name,age) {
  name = name === 'undefined' ? 'tom' : name
  age = age === 'undefined' ? 18 : age
}
// 利用逻辑或 || 的短路运算，但是这个无法实现参数本身就是false 或 0 的情况
function fn(name,age) {
  name = name || 'tom';
  age = age || 18;
}
```
在ES6提供的新语法中，可以直接在形参中定义参数默认值。

#### 在列表参数中定义默认值
```js
function fn(name="tom", age=18) {
  console.log(name,age)
  // do something...
}
fn('jerry') // jerry 18
fn(undefined, 20) // tom 20
```
#### 在具名参数中定义默认值

利用对象解构赋值的规则，实现具名参数中定义默认值

```js
// 对象提供默认值的解构赋值
let {a = 10, b = 5} = {a: 3}; // a=3,b=5

// 用于函数参数默认值
function fn({name="tom",age=18}) {
  console.log(name,age)
}
fn({name:'jerry'}) // jerry 18
fn({age:28}) // tom 28
```
### 参数缺失或者超出时处理

ES函数的另一特点就是不限制参数数量。实际上，在函数定义和使用时可以参数的定义，向一个函数传入任意数量的实参。这就会出现以下两种情况：
- 实参数量多于形参数数量
  - 此时，多余参数会被忽略，但是能在函数隐含参数arguments中获取到所有实现实参。
  - 在ES6中，也可以使用rest参数来收集所有多余的参数。
- 实参数量小于形参
  - 此时，缺失的形参都会被赋值 `undefined` 的值。

```js
function logArgs() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(i + ':' + arguments[i])
  }
}
logArgs('h', 'e', 'l', 'l', 'o')
/* 
  1: h
  2: e
  3: l
  4: l
  5: 0
*/

function fn(name,age) {
  console.log(name, age)
}
fn('tom') // tom undefined

function fn({name, age}) {
  console.log(name,age)
}
fn({name:'tom'}) // tom undefined
fn({age:18}) // undefined 18
```

### 隐含参数： this


### 隐含参数： argument

## 函数参数的注意点

### 陷阱1：参数的引用传递

### 陷阱2：函数入参的非预期的可选参数


