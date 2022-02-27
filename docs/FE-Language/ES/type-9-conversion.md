# 类型转换

在数据类型的[第一节](/ES/type-0-index.html#基本类型和引用类型的区别)，我们已经讲了，JS是一门弱类型语言，两种不同类型的数据在运算时会在底层进行数据类型的隐式转换，来使得两个数据可以进行运算。

比如：

```js
8 * false = 0
8 * true = 8
'2' * 2 = 4
'2' + 2 = '22'
[] == false // 返回 true
```

上面的现象一部分原因与运算符规则有关，更大一部分原因是与数据类型的隐式转换有关。
> 运算符决定左右运算子需要的是数值还是字符串，特别是对象转原始值时决定是先调用valueOf还是toString方法，具体见下面对象转原始值的`ToPrimitive()`方法的执行逻辑

隐式转换的目标是因为数据的操作最终是原始值的操作，更多场景下，是数值的操作。所以常见的两种隐式转换是对象类型需要转为原始值，或者非数值原始值需要转为Number类型的原始值。

> 这里将对象转为原始值常称为拆箱操作或拆包装，呼应上面生成包装对象的装箱操作。

所以在JS中数据类型的隐式转换有两个关注点：

- 原始值之间的隐式转换
- 对象转原始值的隐式转换
> 原始值转对象的隐式转换存在于原始值调用对象属性或方法，在[原始值与包装对象](/ES/type-8-primitive-wrapper)有详细分析。

## 原始值之间的隐式转换

上面讲包装对象时提到，除null和nudefined类型外，其它类型都实现了对应的生成函数`Boolean() / String() / Number() / BigInt() / Symbol()`，它们的作用之一就是被当做纯函数使用时，将参转换为相应类型的原始值。
> 其中`Boolean() / String() / Number()`还可以使用new运算符调用生成对应类型的包装对象。具体见[原始值与包装对象](/ES/type-8-primitive-wrapper.html#包装对象)

### Boolean() ：将传入参数转成布尔类型的原始值

- 将undefined / null / false / 0 / NaN / ''这些假值(falsy)返回false
- 除此之外为真值(truthy)，返回true，（包括所有对象）

```js
Boolean(null)                 // false
Boolean(undefined)            // false
Boolean(0)                    // false
Boolean(0n)                   // false
Boolean(12)                   // true
Boolean(12n)                  // true
Boolean(Symbol())             // true
Boolean({})                   // true
Boolean(new Boolean(false))   // true，并不是false, 因为new Boolean(false)生成的是一个包装对象，所以对布尔值不能用这种方式拆包装
```

### Number() 将传入的参数转成数值类型的原始值

- undefined => NaN
- null => 0
- false => 0
- true => 1
- 字符串会被解析，'12' => 12, '1bc' => NaN
- 对象会选调用`toPrimitive`方法转换成原始值（具体见下面对象类型的隐式转换），然后依上面规则转换数值。

```js
Number(undefined)           // NaN
Number('123')               // 123
Number('1bc')               // NaN
Number(new Number(123))     // 123  包装对象转为原始值，再转数值类型
Number('[object object]')   // NaN
Number('')                  // 0
Number({})                  // NaN  {}返回原始值'[object object]',再转为数值类型即为NaN
Number([])                  // 0   []返回原始值 ''，再转为数值类型即为 0

// 重写对象的隐式转换调用的方法
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint == 'number') {
      return 123;
    } else {
      return 'abc'
    }
  }
}
console.log(Number(obj)) // 123
```
> 对Symbol作为key不理解的可以查看[Symbol类型章节](/ES/type-4-symbol)

> 将字符转为数值，除了Number方法，ES还提供了两个全局方法 parseInt() 和parseFloat()，具体查阅MDN

### String() 将传入的参数都以字符串的表示的原始值

```js
String(true)        // 'true'
String(false)       // 'false'
String(123)         // '123'
String(null)        // 'null'
String(undefined)   // 'undefined'
String({})          // '[object object]'

/*
  同样对象类型会先调用`toPrimitive`方法转换成原始值（具体见下面对象类型的隐式转换），然后再依下面原始值规则转换。
*/
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint == 'number') {
      return 123;
    } else {
      return 'abc'
    }
  }
}
console.log(String(obj)) // abc
```

### BigInt() 只接受可以转为Number类型的参数
```js
BigInt(false)          // 0n
BigInt(true)          // 1n
BigInt(12)            // 12n
BigInt('123')         // 123n

BigInt(null)          // TypeError: Cannot convert null to a BigInt
BigInt(undefined)     // TypeError: Cannot convert undefined to a BigInt
BigInt('12a')         // SyntaxError: Cannot convert 12a to a BigInt
BigInt('abc')         // SyntaxError: Cannot convert abc to a BigInt
```

### Symbol() 接受的参数只作为类型值的描述

> 关于Symbol类型的具体介绍请查阅[Symbol类型](/ES/type-4-symbol)



## 对象转原始值的隐式转换

讲对象类型隐式转换，就需要知道所有对象都继承的三个重要的原型对象方法：`valueOf()` `toString()` `Symbol.toPrimitive()`

### toString()


[MDN toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

`toString()`方法返回一个表示该对象原始值的字符串。默认情况下，`toString()` 方法被每个对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object type]"，其中 type 是对象的类型。

> 关于toString()在ES语言规范中的实现原理，可以查看[类型检测](/ES/type-7-checking.html#object-prototype-tostring-调用原理)。主要是internal slot 和 @@toStringTag 作用。
```js
Object.prototype.toString.call(undefined)     // [object Undefined]
Object.prototype.toString.call(null)          // [object Null]
Object.prototype.toString.call(false)         // [object Boolean]
Object.prototype.toString.call(123)           // [object Number]
Object.prototype.toString.call('abc')         // [object String]
Object.prototype.toString.call({})            // [object Object]
Object.prototype.toString.call([])            // [object Array]
toString.call(new Date());                    // [object Date]
toString.call(new String());                  // [object String]
toString.call(Math);                          // [object Math]
```
> 从 JavaScript 1.8.5 开始，toString() 调用 null 返回[object Null]，undefined 返回 [object Undefined]。

以上写法常用于数据类型的判断。但如果像下面这样调用，会与上面不同：

```js
let str = 'abc'
let num = 123
let arr = []
let obj = {}
let date = new Date()
str.toString()          // abc
num.toString()          // 123
arr.toString()          // ''
obj.toString()          // [object Object]
date.toString()         // Sun Dec 29 2019 19:36:09 GMT+0800 (中国标准时间)
```
可以看到对具体类型值直接调用toString()方法都返回了对应原始值的字符串形式。其中对基本类型数据调用toString()，从上面包装对象的知识可以知道实际上是在对应的包装对象上调用toString()方法。
```js
// Object.prototype.toString.call('abc') 相当于
Object.prototype.toString.call(new String('abc'))

// 'abc'.toString() 相当于
new String('abc').toString()
```

另外，直接调用`'abc'.toString()`与使用对象原型调用`Object.prototype.toString.call('abc')`返回值不同，这是因为JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的toString()方法的返回值都不同，但共同点是返回结果的类型都为字符串。

toString()方法总结：
- 直接在对象原型`Object.prototype`上调用，因为方法未被覆盖，会返回类型信息的字符串形式"[object Type]"，常用于数据类型的判断
- 直接在实例对象上（包括包装对象）调用，会返回对应实例对象的原始值的字符串形式。在语言内部常用于类型的隐式转换（下面会具体讲）

### valueOf()

[MDN valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

`valueOf()` 方法默认返回指定对象的本身。默认情况下，valueOf方法也是被每个对象继承。

如果对象没有指向的原始值，即`[[PrimitiveValue]]`内部属性，则valueOf将返回对象本身。
```js
Object.prototype.valueOf.call(undefined)    // 报错：Uncaught TypeError: Cannot convert undefined or null to object
Object.prototype.valueOf.call(null)         // 报错：Uncaught TypeError: Cannot convert undefined or null to object
Object.prototype.valueOf.call(false)        // false的包装对象
Object.prototype.valueOf.call(123)          // 123的包装对象
Object.prototype.valueOf.call('abc')        // abc的包装对象
Object.prototype.valueOf.call({})           // {}对象自身 
Object.prototype.valueOf.call([])           // []对象自身
valueOf.call(new Date());                   // Sun Dec 29 2019 19:36:09 GMT+0800 (中国标准时间)
valueOf.call(new String());                 // ''
valueOf.call(Math);                         // Math对象自身
```
可以看到对基本类型，直接使用对象原型上的valueOf()方法调用，会返回对应的包装对象。如果是对象类型则直接返回自身。

同样，JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的valueOf()方法的返回值和返回值类型均可能不同。

```js
let str = 'abc'
let num = 123
let arr = []
let obj = {}
let date = new Date()
console.log(str.valueOf())    // 'abc'
console.log(num.valueOf())    // 123
console.log(arr.valueOf())    // []
console.log(obj.valueOf())    // {}
console.log(date.valueOf())   // 1577621476519
```
可以看到结果，在没有自定义方法覆盖构造函数原型上的valueOf时，都返回自身，除 `undefined null`。

同toString()方法一样，在对基本类型直接调用valueOf()方法时，也是先将原始值转为包装对象，然后调用对象的valueOf()方法。
```js
// Object.prototype.valueOf.call(123) 相当于
Object.prototype.valueOf.call(new Number(123))

// 123.valueOf() 相当于
new Number(123).valueOf()
```

valueOf()总结：
- 直接在对象原型`Object.prototype`上调用，因为方法未被覆盖，都会返回对象自身，如果是原始值会生成包装对象。
- 直接在实例对象上（包括包装对象）调用，会返回自身。因为内置对象都重写了该函数，所以原始值调用也返回原始值，好像没变，但实际经过包装对象的过程

### Symbol.toPrimitive()

[MDN Symbol.toPrimitive()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

`Symbol.toPrimitive()` 是一个内置的 Symbol 值，作为对象的属性存在的，当一个对象类型转换为对应的原始值时，会调用此函数。理解该函数的实现算法，有助于我们理解类型的隐式转换。

> Symbol有很多其它表示的符号，比如@@toPrimitive，也代表Symbol.toPrimitive。

上面一开始的例子已经讲过，如果是原始值之间的类型转换，对直接调用目标类型的构造函数进行转换，但如果是对象类型转换成原始值，则语言内部会先调用`Symbol.toPrimitive()`，将对象转为原始值，再依原始值规则转换。

```js
Number('123') // 123
Number({}) // NaN
Number([]) // 0
```
`[]`和`{}`都是对象类型，为什么`Number({})`和`Number([])`结果不一样，中间经过什么？我们需要先学习`ToPrimitive()`

语法：

```js
/**
* @params { Object }  input 需要转换的对象
* @params { String } preferredType 代表希望转换后的类型。是可选参数，如果省略，除日期外都会返回Number数值类型,日期返回String类型
*/
ToPrimitive(input [, PreferredType])
```
具体执行逻辑如下：
1. 判断PreferredType参数是number还是string，默认导出number
1. 判断input对象是否重写了Symbol.toPrimitive()方法，如果是就执行`input[Symbol.toPrimitive(PreferredType)]`
1. 如果没有重写，则根据PreferredType参数类型，决定优先调用`input.valueOf()`还是`input.toString()`

具体见下图：
![ToPrimitive](./images/ToPrimitive.png)


## 参数资料
- 《深入理解 JavaScript》P80
- [菜鸟前端的咸鱼之旅-第八天：类型转换-装箱，拆箱](https://zhuanlan.zhihu.com/p/63097499)
- [详解ECMAScript7规范中ToPrimitive抽象操作的知识（示例）](https://www.php.cn/js-tutorial-410318.html)
- [toString方法和valueOf方法以及Symbol.toPrimitive方法的学习](https://segmentfault.com/a/1190000016300245)

