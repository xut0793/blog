# 原始值和包装对象

[[toc]]

在JS中有一句话：一切皆对象。即使在JS中值的类型被分为原始值和对象，但我们实际在代码中，原始值仍然可以像对象一样调用属性。

```js
1234.54656.toFixed(2) // 1234.55
'abc'.toUpperCase() // ABC
```
这是为什么呢？

## 原始值 Primitive

先认识下原始值，属于基本类型的值都是原始值，所以基本类型也叫原始值类型。

```js
null            // Null
undefined       // Undefined
true  false     // Boolean
'a' '12'        // String
123             // Number
12n             // BigInt
Symbol()        // Symbol
```

从技术上来说，原始值不会有自己的属性，之所以能像对象一样调用属性，这背后的原因就是“包装对象”的存在，这些属性都是从包装对象的原型上借调的。

## 包装对象

### 创建包装对象

在JS中创建一个对象最传统的方法就是通过构造函数生成对象，也是JS早期创建对象的主要方式之一。
> 现代JS创建对象的方式除了new + Function方式，还提供了Object.create()、new + Class的方式。

所以在JS早期，除了Null/Undefined类型外，原始值类型都有对应的构造函数：`Boolean()` `Number()` `String()`。

这三个构造函数有两个作用：

- 作为构造函数，生成包装对象，对上述三个构造函数使用`new`产生出来的实例对象就叫做原始值的包装对象。
- 作为单纯的函数，将值转换为相应的原始值。（在下一节类型转换中讲解）

```js
let wrapBooleanTrue = new Boolean(true)
let wrapBooleanFalse = new Boolean(false)
let wrapNumber = new Number(123)
let wrapString = new String('abc')

console.log(typeof true) // boolean
console.log(typeof wrapBooleanTrue) // object
console.log(typeof wrapNumber) // object
console.log(typeof wrapString) // object
```
当然，除了调用原始值类型对应的构造函数生成包装对象外，也可以直接使用对象类型的构造函数`Object()`。

```js
new Boolean(true) instanceof Boolean // true
Object(true) instanceof Boolean // true
new Object(true) instanceof Boolean // true

new Boolean(123) instanceof Number  // true
Object(123) instanceof Number  // true
new Object(123) instanceof Number  // true

new String('abc') instanceof String  // true
Object('abc') instanceof String  // true
new Object('abc') instanceof String  // true
```
随便在控制台上输入代码生成一个包装对象，将返回值展开都可以看到返回的包装对象有一个`[[PrimitiveValue]]` 内部属性指向原始值。

![primitive.png](./images/primitive.png)

在现代JS中，新增原始值类型`BigInt / Symbol`已经没有通过`new + Function`方式来创建包装对象了，这两个类型的函数`BigInt() / Symbol()`没有实现`[[Constructor]]`功能，所以不能通过new调用。仅作为普通函数调用返回对应的原始值。但仍可以通过`Object()`或`new Object()`生成对应的包装对象

> 函数也是一种对象，如果一个函数包含`[[Constructor]]`内部属性，即该函数可以使用new操作符。如果包含`[[Call]]`内部属性，则可能正常调用。一般自定义的普通函数都具备这两个内部属性。但在语言内部有些函数可以拥有不同的内部属性，以达到在语言内部实现特殊功能。

```js
let i = BigInt(123) // 123n
typeof i //  'bigint'
let j = new BigInt(123) // TypeError: BigInt is not a constructor
let wrapperBigInt = Object(12n)
typeof wrapperBigInt // object


// Symbol同理
let s = Symbol()
typeof s // symbol
let s = new Symbol() // TypeError: Symbol is not a constructor
let wrapperSymbol = new Object(s)
typeof wrapperSymbol // object
```

### 原始值从包装对象的原型对象上借调方法

在ES中，为了实现方法或属性的共享，都会将共享的属性和方法添加到对象的原型对象上。

只有对象才能绑定原型对象的引用，所以原始值实现了包装对象，但这个包装对象基本不特有可以直接调用的属性或方法（内部属性只供语言内部使用，程序开发者无法调用），对原始值的操作都会从各自的包装对象的原型对象上借调方法。
> 这涉及对象、构造函数、原型、原型链相关知识，具体可查看面向对象章节

```js
console.log(Boolean.prototype) // 布尔值基本没有自定义方法， toString() valueOf()是从Object.prototype上继承的，不过进行了改写
console.log(Number.prototype) // toFixed() toExponential() toPrecision() toLocaleString()
console.log(String.prototype) // charAt() indexOf() replace() slice()等等
```

开头提到的例子：

```js
1234.54656.toFixed(2) // 1234.55
'abc'.toUpperCase() // ABC
```
具体调用过程是怎么样的呢？

在非严格模式下，原始值会在执行过程中调用对应的类型的构造函数生成包装对象，然后调用包装对象继承的方法，调用结束后拆包装恢复原始值。

相当于运行了下面的伪代码：

```js
// 'abc'.toUpperCase()
let wrapperString = new String('abc')
let result = wrapperString.toUpperCase() // 从String.prototype上借调toUpperCase()方法
wrapperString = null
```
上面的伪代码过程同样适用于布尔值和数值。

下面代码可以验证下是从原型对象上借调方法：
```js
// 在构造函数原型上自定义一个方法，打印了当前调用对象this
String.prototype.testMethod = function() {
  console.log(typeOf this)
  console.log(this instanceof String)
}

'abc'.testMethod() // object true
```
> `use strict` 严格模式下有所有不同，但结果相同。

## 包装对象与普通对象有什么不同

包装对象也是一种对象，但包装对象与普通对象的不同之处有两点：
1. 每个原始值的包装对象都有一个`[[PrimitiveValue]]`的内部属性，属性的值是对应的原始值。
2. 系统自动包装对象与普通对象的生命周期不同。

第一点：`[[PrimitiveValue]]`的内部属性

![primitive.png](./images/primitive.png)

第二点：包装对象与普通对象的主要区别在于对象的生命周期

使用new主动创建的引用类型实例在执行离开当前执行上下文之前一直保存在内存中。但系统自动创建的包装对象则只存在于一行代码的执行瞬间，然后立即被销毁。
> 参考《JavaScript高级程序设计》P119

```js
let wrapperString = new String('abc') // 包装对象wrapperString一直都可以使用，除非手动置空 wrapperString = null
'abc'.toUpperCase() // 隐式创建包装对象，调用完toLocalString()方法立即被销毁
```

日常实际编码中并不需要我们自己主动去创建包装对象，只需要像对象一样调用其拥有的属性和方法即可。但需要明白背后发生了什么。

