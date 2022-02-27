# Null / Undefined / Boolean 类型

[[toc]]


ES语言规范中定义了两个表示“无”的值：undefined 和 null，这是为什么呢？

## null 和 undefined 的历史

> 引自《深入理解JavaScript》P72-75

在Brendan Eich创建JS语言时，受限于当时网景和SUN公司的合作及网景公司领导层要求这门新语言要尽量类似于JAVA语言。所以JS中采用了JAVA语言中将变量分为原始值和对象的处理方式，同时也使用了JAVA中表示非对象的null值。但在实现时遵循了C语言的先例，直接采用了机器语言的NULL指针，该null值所表示的二进制序列都是0。所以导致了两个结果：
- typeof null === 'object'，参见[类型检测](/ES/type-7-checking)
- Nubmer(null) === 0，即null值在强制转为数字时会变成0。

在JS第一个版本中是没有异常处理机制的，所以在遇到未初始化的变量，或者缺失参数导致的异常时都需要一个值来表示。本来是可以直接用已实现的null值来表示。但Brendan Eich却觉得这种情况下用null值来表示并不合适，主要有两点原因：
1. null值在JAVA中被当成一个对象，但Eich认为在未初始化的变量或者缺少参数的异常场景中，表示“无”的这个值不应该具有指向性，因为这种场景下不仅仅是一个对象，也可能是其它类型的值。所以用一个在JAVA中被当作对象的null值来表示并不合适。
1. 另外，这个场景下如果用null值来表示，在数据隐式转换时会被当做0看待，这会导致有很多异常情况被隐藏，不容易发现错误。

所以，Eich 又设计了undefined值，作为适合上述场景使用的表示“无”的原始值，它在强制转换为数值时为NaN。

```js
Number(null)           // 0
5 + null === 5        // true

Number(undefined)    // NaN
5 + undefined       // NaN
```

虽然null和undefined都是表示“无”，都是原始类型，但日常使用上还是有一些细微的差别。我们可以这么理解它们：

- undefined 虽然单词语义表示未定义，但实现场景上理解为：变量已经声明了但没有被初始化赋值
- null 表示无，理解为变量声明并明确表示无，即赋值为null。

## null 和 undefined 常见的场景

- null 场景：
  - 是原始链最未端的一个元素，表示已经没有对象了。`Object.getPrototypeOf(Object.prototype) // null`
  - 或者主动设置某个变量为null，表示不需要了，便于系统垃圾回收。 `obj = null`
- undefined 被创建出来就是为了应付以下场景的：
  - 变量声明后未被赋值
  - 函数调用缺失的参数
  - 函数未显性指明return的返回值
  - 访问对象不存在的属性

  ## null 和 undefined 检测

  对null 和 undefined的检测通常使用严格相等来判断
  ```js
  val === null || val === undefined
  ```
  或者利用null/undefined都是假值falsy的特性，直接用于判断语句
  ```js
  val ? someByTrue : someByFalse
  ```

  ## unll 和 undefined 不同点

  - null在ES中是一个关键字，在代码中可以直接使用值null
  - undefined 却是全局对象的一个属性。在ES5以前，undefined作为全局对象属性可以被重新赋值。但在ES5之后，作为全局对象的undefined属性已经变为只读了。但因为undefined不是一个关键字，所以仍然可以函数作用域内作为变量名被重新赋值。
  ```js
  console.log(undefined)   // undefined
  undefined = '123'
  console.log(undefined)   // undefined

  function fn () {
    var undefined = '123'
    console.log(undefined)
  }
  fn()                    // 123
  ```

  所以在实际代码中并不会主动把变量命名成undefined 或者赋值为undefined。如果真要赋值一个变量为空值会使用null。

  鉴于undefined不是关键字，可以用途变量名被重新赋值会导致的不确定性，实际中常使用 `void`运算符替代undefined，因为`void`运算符执行右侧表达值后始终返回undefined。

  ```js
  // 在一个函数作用域内，如果要检测undefined值
  function fn () {
    
    // 因为undefined不是关键字，在函数作用域内可以作为变量名重新被赋值，所以此时if语句的表达式判断并不可靠
    let undefined = true
    if (val === undefined) {}

    // 此时我们可以利用void运算总是返回undefined来改写上面if条件，使判断完全可靠
    if (val === void(0)) {}
  }
  ```

## Boolean 布尔值

> 以19世纪英国数学家乔治布尔（George Boole）命名。在1847年出版了《逻辑的数学分析》，由于其在符号逻辑运算中的特殊贡献，很多计算机语言中将逻辑运算称为布尔运算，将其结果称为布尔值。

布尔值在JS中也叫真假值，它的值只有true 或 false 。

判断为假值(falsy)主要为以下几个值:
- null
- undefined
- false
- 0  NaN
- ''

除此之外的值判断为真值(truthy)。

对象也都是真值，即使空数组或空对象。

特别注意的是使用Boolean构造函数生成一个假值的包装对象，在if判断中也是真值，因为它是一个对象。
```js
Boolean([])  // true
Boolean({})  // true

let myFalse_1 = new Boolean(false) // myFalse_1是一个真值
let myFalse_2 = Boolean(false) // myFalse_2是一个假值
```

[关于boolean类型在内存中的二进制序列表示的讨论](https://www.jianshu.com/p/2f663dc820d0)
[Boolean 在V8源码中的实现](https://zhuanlan.zhihu.com/p/115392447)