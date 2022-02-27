# 函数高阶应用

[[toc]]

这一章的重点不是解释 JS 函数语法，而是思考为什么需要函数，以及函数的灵活性。
> 主要内容摘自《JavaScript学习指南》chapter-13 page-176

## 函数：实现代码复用

> 通过封装代码来避免重复有一个专有名词： DRY ( don't repeat yourself )。

函数通常用来封装某个算法，比如下面一个计算年份是否为闰年的算法：四年一闰，百年不闰，四百年再闰

> 闰年(Leap Year)是为了补偿因人为历法规则形成的年度天数与地球实践公转周期的时间差而设立的。补上时间差的年份为闰年。[百度百科](https://zhidao.baidu.com/question/467715860.html)
- 能被整除4且不能整除100，如2004年就是闰年，1900年不是闰年
- 能整除400，如2000年是闰年，1900年不是闰年

```js
const year = new Date().getFullYear()
if (year % 4 ===  0 && year % !== 0) {
  console.log(`${year} is leap year`)
} else if (year % 400 === 0) {
  console.log(`${year} is leap year`)
} else {
  console.log(`${year} is not leap year`)
}
```
试想下，如果这个算法在程序中执行10次，更有甚者，可能被执行100或更多次，如果要求更改 console.log 打印的信息，那就必须找出所有使用该段代码的地方，这简直是个噩梦。

所以在 JS 语言中，可以用函数封装这段代码：

```js
function printLeapYearResult() {
  const year = new Date().getFullYear()
  if (year % 4 ===  0 && year % !== 0) {
    console.log(`${year} is leap year`)
  } else if (year % 400 === 0) {
    console.log(`${year} is leap year`)
  } else {
    console.log(`${year} is not leap year`)
  }
}
```
> 函数的命名：<br> 注意为函数选的名字是： printLeapYearResult，为什么不给它命名为 getLeapYearResult / leapYearResult / leapYear 呢？虽然这些名字简短，但实际上现在这个函数的重点是 console.log 语法打印闰年判断的结果。<br> JS 不管是函数命名还是变量常量命名，都是给人看的（其它人或将来的自己），而语言本身变不判断命名，特别是生产环境中还要压缩混淆代码，所以在命名函数时，需要仔细想想如何做到让他人看到名称时就能明白所表达的意思，这就是代码的自解释，而不需要频繁的通过注释去解释意图。<br>另一方面，命名也不能太过于冗长，如 calculateCurrentLeapYearResultAndPrintToConsole，虽然现代编译器都有快速提示直接回车键入名称，但表意更好，但阅读并不好，所以命名的艺术性就体现在代码上了。

## 函数返回值

上述函数 printLeapYearResult 虽然实现了代码封装和复用，但当需要进一步复杂时，很快就不能满足只是将信息输出到控制台上了。可能需要将结果应用于其它算法的判断或输出时，上述封装就达不到目的了。所以我们需要一个具有结果返回值的函数。

> JS 函数缺省 return 语句，或 return 语句后没有值时，函数执行结果默认返回 undefined

```js
function isCurrentYearLeapYear() {
  const year = new Date().getFullYear()
  if (year % 4 ===  0 && year % !== 0) return true
  else if (year % 400 === 0) return true
  else return false
}

// 使用
if (isCurrentYearLeapYear()) {
  console.log(`Now is leap year`)
} else {
  console.log(`Now is not leap year`)
}
```
> 想想现在给函数起的名称：isCurrentYearLeapYear，给一个返回 boolean 值的函数命名时，将is 作为前缀是很常见的做法。另外该函数还包含 current 单词，重点指明了这个函数是用来判断当前年份的，也就是说在 2016.12.31 和 2017.1.1这两天运行这个函数，它的结果是不一样的。

## 纯函数

纯函数必须做到：对同一组输入，始终返回相同的结果。

纯函数的两大规则：
- 相同的输入返回相同的结果
- 不会产生副作用：调用该函数不会改变程序的其它状态

```js
function isLeapYear(year) {
  if (year % 4 ===  0 && year % !== 0) return true
  else if (year % 400 === 0) return true
  else return false
}
```

## 函数是值

把函数当作参数，传给另一个函数。这里就体现了在 JS 中函数是一等公民的特性之一：函数是值。

一般我们将数值、字符串、甚至数组、对象当作变量很容易理解，认为这些变量只是数据。要理解函数本质上也是对象，就是数组也是对象的一样，就像数组在使用时可以操作数组内元素，对象在使用时可以访问属性或属性赋值，同样函数在使用时的特性是可以进行调用而已。凡事能使用变量的地方都可以使用函数。

- 将函数赋值给一个变量
- 将函数放入数组，作为数组元素
- 将函数作为对象的一个属性值，即对象方法
- 将函数作为参数传入另一外函数中
- 从函数返回值中返回一个函数
- 自执行函数：函数声明即调用

函数的灵活性强大到难以置信。

## 函数别名

- 将函数赋值给一个变量，作为函数别名使用

有时候调用一个函数的路径会非常长，但该函数又会频繁被调用，如果每次全部敲出来会让人筋疲力尽。函数也是一种数据类型，我们可以创建一个名字更短的变量代替它。

```js
const toString = Object.prototype.toString

// 或者为某功能赋予单独的变量
// oneDollar 和 twoDollar 是同一种类型的两个不同的函数实例
const Money = require('math-money')
const oneDollar = Money.Dollar(1)
const twoDollar = Money.Dollar(2)

// 如果某个方法嵌套很深，可以单独提出来
const method = obj.porperty_1.property_2.method
// 或者 ES6 解构赋值语法
const { porperty_1: {porperty_2: { method}}} = obj
method()
```

## 函数入参

- 将函数作为参数传入另一外函数中

将函数传给另一个函数的用法：
- 最常见的是异步编程中的回调函数；
- 数组中常用的方法；
- 功能的注入。

```js
// 回调函数 callback 简称 cb
function handler() {
  // do something...
  console.log('setTimeout')
}
setTimeout(handler, 1000)
```
```js
// 数组方法
function square(x) {
  return x * x
}
[1,2,3].map(square)
```

这里重点关注下这种“功能注入”的函数思想：

假设我们有一个对数字型数组元素的求各函数 sum ：
```js
function sum(arr) {
  return arr.reduce((a, x) => a + x, 0)
}
```
sum 实现了一个最基本功能的简单相加的求和功能，但如果需要一个返回数字平方和的函数呢，尽管我们可以再编写一个 sumOfSquare 的函数。那如果还需要立方和呢？此时我们可以对上述 sum 函数改造下，使其扩展性更强，更加通用，这也是“功能注入”的例子。
```js
function sum(arr, fn) { // 函数作为参数传入
  if (typeof fn !== 'function') {
    fn = x => x  // 如果没有提供函数 fn 或者 提供的 fn 不是一个函数，则使用一个将参数原样返回的“空函数"替代
  }

  return arr.reduce((a, x) => a + fn(x), 0)
}

sum([1,2,3]) // 6
sum([1,2,3], x => x * x) // 平方和 14
sum([1,2,3], x => Math.pow(x, 3)) // 立方和 36
```

## 返回函数

在一个函数中返回另一个函数，很多时间也是为了函数功能的复用。

比如上面的 sum 函数，如果在一段代码中需要多次计算数组的平方和，但是数组入参不相同，但参数处理函数即平方函数相同。

这种需求的实现，如果简单粗暴一点，就是重新创建一个函数，让其调用 sum 函数。
```js
function sumOfSquare(arr) {
  function square (x) {
    return x * x
  }
  return sum(arr, square)
}
```
但如果多次调用 sumOfSquare 函数，你会发现匿名函数 square 是会被多次重复声明的。一种更有效的解决方案是，创建一个返回特定处理的函数

```js
function newSum(fn) {
  return function (arr) {
    return sum(arr, fn)
  }
}
// 用箭头函数会更简洁
function newSum(fn) {
  return arr => sum(arr, fn)
}
```
新函数 newSum 创建了一个自定义处理函数作为唯一参数，并且返回接受数组参数的求和函数。

```js
// 如果在程序中需要多次用到一个平方求和函数对数组进行求和
const sumOfSquare = newSum(x => x * x)
sumOfSquare([1,2,3])
sumOfSquare([4,5,6]) // 这样就实现了多次调用平方和函数，但平方处理函数只声明了一次

// 立方示和
const sumOfCube = newSum(x => Math.pow(x, 3))
sumOfCube([1,2,3])
```

## 函数柯里化

柯里化, 即 Currying 的音译。Currying 为多参函数提供了一个递归降解的实现思路: 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

实现一个柯里化函数常见的思路是：比较多次接受的参数总数与函数定义时的入参数量，当接受参数的数量大于或等于被 Currying 函数的传入参数数量时，就返回计算结果，否则返回一个继续接受参数的函数。

```js
function Currying(fn, ...args) {

  if (args.length >= fn.length) {
    return fn.apply(this, args)
  }

  return function (...rest) {
    return Currying.call(this, fn, ...args, ...rest)
  }
}
```
实际上，函数柯里化是通过创建一个保存着原始函数和初始参数的闭包来实现的。函数柯里化应用场景:

### 参数复用

在很多场景下，我们需要的函数参数很可能有一部分是一样，这个时候再重复写就比较浪费了，我们提前加载好一部分参数，再传入剩下的参数。

```js
// 正常正则验证字符串 reg.test(txt)

// 声明验证的函数
function check(reg, txt) {
    return reg.test(txt)
}

// Currying后
function curryingCheck(reg) {
    return function(txt) {
        return reg.test(txt)
    }
}

const hasNumber = curryingCheck(/\d+/g)
const hasLetter = curryingCheck(/[a-z]+/g)

hasNumber('test1')      // true
hasNumber('testtest')   // false
hasLetter('21212')      // false

// 也可以直接使用上面定义的通用柯里化函数
const hasNumber = Currying(check, /\d+/g)
hasNumber('test1')      // true
```

### 延迟执行

延迟执行实际上也是参数复用的一种，最常见就是先将函数执行上下文绑定，再后续执行函数。原生函数的bind属性实现也是柯里化的实际应用

```js
// 模拟原生的 bind 方法
Function.prototype._bind = function (context, ...args) {
    const _this = this
    return function(...rest) {
        return _this.call(context, ...args, ...rest)
    }
}
```
这种为函数绑定执行上下文的实现，在现代ES6中有更好的实现，即通过箭头函数调用。这样避免了闭包和call或apply执行带来的性能开销。

参考链接：

[大佬，JavaScript 柯里化，了解一下？](https://juejin.im/post/5af13664f265da0ba266efcf)<br>
[js函数柯里化 ](https://github.com/yinguangyao/blog/issues/3)
[函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/) -- 函数式编程入门教程


## 递归

> [JavaScript函数式编程指南] P68

递归是一种旨在通过将问题分解成较小的自相似问题来解决问题本身的技术。

递归函数包含以下两个主要部分：
- 终止条件
- 递归条件： 使用更小的一些输入调用自身

```js
// 数的阶乘
function factorial(n) {
  return n <= 1 ? n : n * factorial(n-1)
}

factorial(4) // 24
```

## 尾递归优化

> [JavaScript函数式编程指南] P175

在平时的代码里，递归是很常见的。了解函数调用栈，就知道递归不恰当使用会带来的调用栈溢出问题，因为js 引擎（包括大部分语言）对于函数调用栈的大小是有限制的。

尾部调用优化 (TCO)，也称为尾部调用消除：当函数的最后一件事情如果是递归的函数调用，那么运行时会认为不必要保持当前的栈帧，这样，递归每次调用就不会像正常嵌套函数调用那样在新帧叠加在旧帧上，而是旧帧弹出，创建新帧，这样就不会导致调用栈溢出的问题了。

尾递归的调用栈图解，见此篇参考文章：[Javascript中的尾递归及其优化](https://zhuanlan.zhihu.com/p/47155064) --- 记得看评论补充

> 因为尾递归优化会破坏函数的调用栈信息，所以 Firefox、Chrome、Node.js 都不支持，其他引擎没有测试，我猜应该也都已经去掉了对尾递归优化的支持。TC39 也正在寻找新的 js 语法来显式指明需要使用尾递归优化。 ---最后一个评论

## 记忆化

记忆化函数主要用于计算密集型的函数，在函数中可以将先前操作的结果记录在某个对象里，当下次遇到相同的输入会命中之前缓存直接返回结果，避免无谓的重复运算。

记忆化(memoization)主要用于加速程序计算的一种优化技术。

比如，我们想要递归计算 Fibonacci 数列（斐波那契数列：前面两项之和等于后一项的值，由 0 和 1 开始）。

```js
function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

for ( var i = 0; i <= 10; i++) {
  console.log(`// ${i}: ${fibonacci(i)}`)
}

// 0: 0
// 1: 1
// 2: 1
// 3: 2
// 4: 3
// 5: 5
// 6: 8
// 7: 13
// 8: 21
// 9: 34
// 10: 55
```

运行上面这段代码，可以正常输出结果。但是 fibonacci 函数被调用了 453 次， 其中 for 循环调用了 11 次，它自身调用了 442 次去计算前面循环中已经被计算过的值。

这个时候，如果让函数具备记忆功能，可以显著减少运算量。

```js
/**
 * 我们使用 IIFE，在函数内声明一个 memo 数组来保存我们计算结果。当函数调用时，首先检查结果是否已经存在，如果存在，就直接返回该结果
*/

const fibonacciMemoy = function () {
  const memoy = [0, 1]

  return function fib (n) {
    let result = memoy[n]
    
    if (typeof result !== 'number') {
      result = fib(n - 1) + fib(n - 2)
      memoy[n] = result
    }

    return result
  }
}()

// 再调用
for ( var i = 0; i <= 10; i++) {
  console.log(`// ${i}: ${fibonacciMemoy(i)}`)
}
```

这一次，fibonacciMemoy 只被调用了 29 次，其中 for 循环调用了 11 次，它自身调用 18 次去取得之前存储的结果。

可以把上面这个记忆函数改成一个更为普遍适用的通用自记忆函数。

```js
function memoizer(memoy, formula) {
  return function recur(n) {
    let result = memoy[n]

    if (typeof result !== 'number') {
      result = formula(recur, n)
      memoy[n] = result
    }
    return recur
  }
}

// 使用 memoizer 定义 fibonacci
const fibonacci = memoizer([0, 1], function(recur, n) {
  return recur(n -1 ) + recur(n - 2)
})

// 使用 memoizer 定义阶乘 factorial 0! 等于 1
const factorial = memoizer([1, 1], function(recur, n) {
  return n * recur(n - 1)
})
```

## 方法链（级联）

如果我们让某些函数返回 this 而不是 undefined ，就可以启用级联。

```js
// 数组的部分方法
[1,2,3].map(x => x * x)
       .filter(x => x % 2 === 0)
       .forEach(x => { console.log(x) })

// Lodash 封装的方法
_.chain(string)
    .filter(isValid)
    .map(s => s.replace(/_/, ' '))
    .uniq()
    .map(_.startCase)
    .sort()
    .value()
```

## 管道

函数的管道化： 一个函数的输出会作为下一个函数的输入。
```js
const trim = str => str.replace(/^\s*|\s*$/g, '')
const normalize = str => str.replace(/\-/g, '')

normalize(trim('  444-33-2   ')) // 444332
```

> 函数方法链和函数管道化的一个关键区别：<br> 方法链通过对象的方法紧密连接，而管道以函数作为组件，将函数的输入和输出连接在一起。<br>在面向对象编程中方法链是常见方式，而函数式编程将管道视为构建程序的唯一方法。