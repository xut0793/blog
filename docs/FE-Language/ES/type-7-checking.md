# 类型检测

[[toc]]

在前面[数据类型](/ES/type-0-index)开篇中我们讲了ES最新规范定义了原始值类型和对象类型，其中原始值类型有7种，对象类型也有很多衍生对象。

- 原始值类型（基本类型）
  1. Null
  1. Undefined
  1. Boolean
  1. String
  1. Number
  1. Bigint
  1. Symbol
- 对象类型（引用类型）
  1. Object
  1. Function
  1. Array
  1. RegExp
  1. Date
  1. Error
  1. JSON
  1. Math
- ES next 新增的对象类型
  1. Set
  1. WeakSet 
  1. Map
  1. WeakMap
  1. Pormise
  1. ArrayBuffer
  1. DataView
  1. TypedArray(这是一个统称，类型化数组包括如Int16Array等)
  1. Intl
- 宿主对象实现的对象类型
  1. window
  1. DOM对象（doucment / HTMLElement等）
  1. BOM对象（location / history 等）


结论先行，要对数据进行类型检测，总结起来主要有以下四种方法：

1. typeof
1. instanceof
1. constructor
1. Object.prototype.toString()

另外，ES next 针对某些特定类型数据实现了单独的判断方法：
- isNaN() 和 Number.isNaN()
- isArray()

接下来，我们再详细讲解下以下几中类型检测方法和原理

## typeof

我们先看下`typeof`对常见数据类型进行检测的结果：

```js
// 原始值类型
typeof null          // object
typeof undefined    // undefined
typeof true         // boolean
typeof 'abc'        // string
typeof 123          // number
typeof 123n         // bigint
typeof Symbol()     // symbol

// 对象类型
typeof {}                   // object
let fn = function (){}     
typeof fn                   // function
typeof []                   // object
typeof /\d+/g               // object
let date = new Date         
typeof date                 // object
let s = new Set()           
typeof s                    // object
let p = Promise.resolve()
typeof p                    // object
typeof document             // 浏览器环境下object，node环境下undefined
```

从结果来看，`typeof`检测类型有两个结果：

- 对原始值类型检测除`null`外，都是准确的，返回小写的字符串类型名称。
- 对对象类型检测除函数`Function`对象类型外，都直接返回字符串`object`。

**所以`typeof`适合用于检测基本类型范围内数据。并且需要单独处理`Null`类型（通过严格相等判断 `data === null`）。**

### typeof检测原理

在前面[数据类型](/ES/type-0-index)开篇中已经讲过，在第一代Javacript引擎中值表示为32位的二进制序列，同时把最低的3位作为类型标识，此时值的类型包括对象、整数、浮点数和布尔值。
> 上述引自《深入理解Javascript》P94 

> 最新的类型bigInt/Symbol是否仍遵循此规则，暂未查阅到相关资料

数据类型标识规则为：
- 000 - 对象，数据是对象类型
- 001 - 整型，数据是31位带符号整数（语言内部使用，比如数组索引值、位操作符时）
- 010 - 双精度类型，数据是双精度数字
- 100 - 字符串，数据是字符串
- 110 - 布尔类型，数据是布尔值

所以 typeof运算符就是通过检测值的类型标识位来判断数据类型。

但是，null和undefined的二进制存储序列是比较特殊的：

**特殊的null**

> 而js最初为了实现null值，直接采用了机器语言的NULL指针，该字符所有位都是0，所以`typeof null === 'object'`  --《深入理解Javascript》P94

> JavaScript 之父本人也在多个场合表示过，typeof 的设计是有缺陷的，只是现在已经错过了修正它的时机，因为修正会破坏现有的代码。《重学前端第1讲》

**undefined类型**

undefined值在计算机内存中表示的是一个特殊的二进制序列，十进制表示为 −2^30 整数。

> 引自 https://segmentfault.com/a/1190000011830411


## instanceof

同样，我们用`instanceof`来对常见的类型进行检测：

```js
// 原始值类型
console.log(null instanceof Object);                // false
console.log(undefined instanceof undefined);        // TypeError: Right-hand side of 'instanceof' is not an object
console.log(true instanceof Boolean)                // false
console.log('abc' instanceof String)                // false
console.log(123 instanceof Number)                  // false
console.log(123n instanceof BigInt)                 // false
console.log(Symbol() instanceof Symbol)             // false

console.log(new Boolean(true) instanceof Boolean);  // true
console.log(new String('abc') instanceof String);   // true
console.log(new Number(123) instanceof Number);     // true
/* 
 *  new BigInt() / new Symbol()  会报错
 *  函数也是对象，可以定义特殊的内部属性来实现特定的功能。BigInt 和 Symbol 函数对象没有实现内部属性[[constructor]]，
 *  所以不能当做构造函数使用new调用来生成包装对象。只能使用函数对象基本的内部属性[[call]]来实现纯函数调用的功能。
*/

// 对象类型
console.log({} instanceof Object)                   // true
console.log([] instanceof Array)                    // true
let fn = function (){}
console.log(fn instanceof Function)                 // true
console.log(fn instanceof Object)                   // true
console.log(/\d+/g instanceof RegExp)               // true
console.log(/\d+/g instanceof Object)               // true
let date = new Date
console.log(date instanceof Date);                  // true
console.log(date instanceof Object);                // true
let s = new Set()
console.log(s instanceof Set);                      // true
console.log(s instanceof Object);                   // true
let p = Promise.resolve(12)
console.log(p instanceof Promise);                  // true
console.log(p instanceof Object);                   // true

// DOM对象
let oDiv = document.createElement('div')
console.log(oDiv instanceof HTMLElement)            // true
console.log(oDiv instanceof Object)                 // true
console.log(document instanceof HTMLDocument)       // true
console.log(document instanceof Object)             // true
```

可以看出，`instanceof`运算符检测结果：
- 对原始值的检测都是返回`false`
- 对对象类型，包括原始值的包装对象检测都是`true`。
- 表达式`leftValue instanceof Object`，只要`leftValue`是对象类型就会返回`true`。

但`instanceof`检测有个弊端：就是需要提前确切地知道对象为哪个类型。

### instanceof 检测原理

看下MDN中的定义：

> instanceof 运算符用于检测右侧构造函数的 prototype 属性是否出现在左侧实例对象的原型链上。

这里涉及到ES面向对象的核心概念：实例对象、构造函数、原型、原型链，具体可查看[面向对象章节]()内容。

因为`Object.prototype`是所有对象的最终原型对象，出现在所有对象的原型链上。所以只要左侧检测值是一个对象类型，那表达式`leftValue instanceof Object`就始终返回`true`。

再看下ES语言规范中，对`instanceof`运算符的定义：

```js
 11.8.6 The instanceof operator 
 The production RelationalExpression: 
        **RelationalExpression instanceof ShiftExpression** is evaluated as follows: 

 1. Evaluate RelationalExpression.      // 计算左侧表达式的值 Result(1)
 2. Call GetValue(Result(1)).           // 调用 GetValue 方法得到 Result(1) 的值，设为 Result(2) 
 3. Evaluate ShiftExpression.           // 计算右侧表达式的值 Result(3)
 4. Call GetValue(Result(3)).           // 同理，这里设为 Result(4) 
 5. If Result(4) is not an object, throw a TypeError exception.                          // 如果右侧结果 Result(4) 不是 object，抛出类型错误的异常
 6. If Result(4) does not have a `[[HasInstance]]` method, throw a TypeError exception.  // 如果右侧结果 Result(4) 对象中没有 `[[HasInstance]]` 方法，抛出异常。
  /* 规范中的所有 `[[...]]` 方法或者属性都是内部的，
    在 JavaScript 中不能直接使用。并且规范中说明，只有 Function 对象，即函数对象实现了 `[[HasInstance]]` 方法。
    所以这里可以简单的理解为：如果 Result(4) 不是 Function 对象，抛出异常 
  */ 
 7. Call the `[[HasInstance]]` method of Result(4) with parameter Result(2).             // 相当于这样调用：`Result(4).[[HasInstance]](Result(2)) `
 8. Return Result(7). 
 ```

 关于 `[[HasInstance]]` 方法定义
 ```js
 15.3.5.3 [[HasInstance]] (V) 
 Assume F is a Function object.                                       // 假设 F 是一个函数类型的对象，可以把 F看作上面的 Result(4)，V 是 Result(2) 
 When the [[HasInstance]] method of F is called with value V, 
     the following steps are taken: 

 1. If V is not an object, return false.                              // 如果 V 不是 object，直接返回 false ，所以原始值类型检测结果都是false
 2. Call the [[Get]] method of F with property name "prototype".      // 用 [[Get]] 方法获取 F 的 prototype 属性，在ES中只有函数对象才有prototype属性
 3. Let O be Result(2).                                               // O = F.[[Get]]("prototype") 构造函数的原型对象
 4. If O is not an object, throw a TypeError exception.               // 如果 O不是object，抛出类型错误
 5. Let V be the value of the [[Prototype]] property of V.            // 让V等于 V.[[Prototype]]，即 V = V.__proto__ 。
  /*
   * 区分对象的内部属性[[Prototype]]和函数对象的prototype属性。但函数对象同时也是对象类型，所以函数对象同时拥有这两个属性。
   * [[Prototype]]是内部属性，外部无法调用，所以部分浏览器厂商实现了__proto__私有属性来获取[[prototype]]值的引用。__proto__不是语言规范的内容.
   * 现代ES语言规范实现同样功能的Object.getPrototypeOf()方法。
  */
 6. If V is null, return false.                                       // 如果 V 是null，则返回false。null是对象原始链的终点。即到原始链终点都没有匹配上，则返回false.                        
 7. If O and V refer to the same object or if they refer to objects joined to each other (section 13.1.2), return true. // 这里是关键，如果 O 和 V 引用的是同一个对象，则返回 true；否则，到 Step 8 返回 Step 5 继续循环
 8. Go to step 5.
```

所以`instanceof`检测原理的核心是`[[HasInstance]]`方法。将右侧构造函数原型在左侧对象原型链上匹配。

依据这个原理，我们可以自定义一个instanceof方法。

```js
function myInstanceof(L, R) {
  // 只有函数才有prototype属性
  if (typeof R !== 'function') {
    throw new TypeError(`${R} is not a constructor`)
  }

  // 左侧是原始值类型，直接返回 false
  if (L === null || ['undefined','boolean','string','number','bigint','symbol'].includes(typeof L)) {
    return false
  }

  let O = R.prototype;
  L = Object.getPrototypeOf(L)

  while (true) { 
    if (L === null) return false
    if (O === L) return true
    L = Object.getPrototypeOf(L)
  } 
}
```

另外，最新ES规范通过`Symbol.hasInstance`属性，可以自定义实现`[[HasInstance]]`方法，也就是说可以自定义实现`instanceof`操作符的行为。

> 对 Symbol 类型的具体讲解可以查看[Symbol类型](/ES/type-4-symbol)

```js
console.log('abc' instanceof String)  // false

// 通过自定义实现 'abc' instanceof MyString 返回true
let MyString = {
  [Symbol.hasInstance](instance) {
    return typeof instance === 'string'
  }
}

console.log('abc' instanceof MyString)  // true
/*
符合上方关于instanceof语言规范的定义：
1. 右侧 MyString 是一个对象，并且通过Symbol.hasInstance实现了[[HasInstance]]方法
*/
```

或者用ES6的class语法来写，使得右侧表达是一个构造函数，更接近原生instanceof的功能
```js 
class MyString {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'string'
  }
}
console.log('abc' instanceof MyString)  // true
```

### 总结

1. `instanceof`操作符对原始值都返回false
1. `instanceof`操作符使用需要提前知道数值的类型
1. `instanceof`通过原型链来匹配，但是构造函数的prototype属性是可以被重写的，此时判断就不准确。

```js
function Person() {}
Person.prototype = String.prototype
let p = new Person()

console.log(p instanceof Person) // true
console.log(p instanceof String) // true
```
  

### 参考链接

[MDN instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
[MDN Symbol.hasInstance](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
[JavaScript instanceof 运算符深入剖析](https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/)

## constructor

instanceof运算是通过原型对象来判断。而同理constructor方法是通构造函数来判断。

```js
console.log([].constructor === Array)      // true
console.log({}.constructor === Object)     // true
let fn = function(){}
console.log(fn.constructor === Function)   // true

function F(){}
let o = new F()
console.log(o.constructor === F)            // true
```
这里同样涉及到ES面向对象的知识，在ES中创建对象的其中一种方法就是通过 `new + Function`方式。其中函数对象都有一个prototype属性指向原型对象，而原型对象都有一个constructor属性指回其构造函数。

因为原型对象的consstructor属性可以被其实例对象继承，所以对象.constructor实际上是调用其原型对象上的constructor属性。

```js
o.constructor === F
// 相当于
o.__proto__.constructor === F
// 或者用最新ES语法
Object.getPrototypeOf(o).constructor === F
```

所以constructor的局限性同instanceof一样，只针对对象类型，且必须明确知道对象的构造函数，并不常用。

## Object.prototype.toString()

同样，我们用`Object.prototype.toString`方法对常见的数据类型进行检测：

```js
// 使用方式：使用函数对象的call方法，来借调原生对象原型的toString()方法
Object.prototype.toString.call(undefined)               // "[object Undefined]"
Object.prototype.toString.call(null)                    // "[object Null]"
Object.prototype.toString.call(false)                   // "[object Boolean]"
Object.prototype.toString.call(123)                     // "[object Number]"
Object.prototype.toString.call(123n)                    // "[object BigInt]"
Object.prototype.toString.call(Symbol())                // "[object Symbol]"
Object.prototype.toString.call('abc')                   // "[object String]"

Object.prototype.toString.call(new String());           // [object String]
Object.prototype.toString.call({})                      // "[object Object]"
Object.prototype.toString.call([])                      // "[object Array]"
Object.prototype.toString.call(new Date());             // [object Date]
Object.prototype.toString.call(/\d/g);                  // [object RegExp]
Object.prototype.toString.call(Math);                   // [object Math]
Object.prototype.toString.call(new Set);                // [object Set]
Object.prototype.toString.call(Promise.resolve());      // [object Promise]

Object.prototype.toString.call(window);                 // [object Window]
Object.prototype.toString.call(document);               // [object HTMLDocument]
Object.prototype.toString.call(history);                // [object History]
```

可以看出`Object.prototype.toString`用来检测数据类型，不管是原始值类型还是各种对象类型，都能通过返回值准确识别。
所以这种检测类型的方法最为实用，日常开发中可以对其进行如下封装成工具函数。

```js
/**
 * 检测目标数据类型
 * @params { * } 检测目标值
 * @params { String } 数据类型，可选
 * @example
 * getType("young"); // "string"
 * getType(20190214); // "number"
 * getType(true); // "boolean"
 * getType([], "array"); // true
*/
function getType(target, type) {
    const dataType = Object.prototype.toString.call(target).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    return type ? dataType === type : dataType;
}
```

关于对象类型`toString()`方法的具体讲解，可以查看[数据类型转换](/ES/type-9-conversion.html#tostring)章节


### Object.prototype.toString()调用原理

在ES5语言中规范中，各种内置对象（build-in)都有一个内部属性`[[class]]`来标识对象类型，值为一个类型字符串。
> 本规范的每种内置对象都定义了 `[[Class]]` 内部属性的值。宿主对象的 `[[Class]]` 内部属性的值可以是除了 "Arguments", "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number", "Object", "RegExp", "String" 的任何字符串。`[[Class]]` 内部属性的值用于内部区分对象的种类。本规范中除了通过 Object.prototype.toString ( 见 15.2.4.2) 没有提供任何手段使程序访问此值。

在ECMAScript 5中，`Object.prototype.toString()`被调用时，会进行如下步骤：
```js
1. 如果 this是undefined ，返回 [object Undefined] ；
2. 如果 this是null ， 返回 [object Null] ；
3. 令 O 为以 `this` 作为参数调用 ToObject 的结果;     // 即如果是number、string、boolean类型则转为对应的包装对象。类似调用Object(this)
4. 令 `class` 为 O 的内部属性 `[[Class]]` 的值；
5. 返回三个字符串 "[object" +  `class` + "]" 拼接而成的字符串。
```
在ES6里，由于添加了class语法，之前的 `[[Class]]` 不再使用，取而代之的是一系列的 internal slot (内部插槽)。新语言规范中调用 Object.prototype.toString 时，会进行如下步骤：
```js
1. 如果 this 是 undefined ，返回 '[object Undefined]' ;
2. 如果 this 是 null , 返回 '[object Null]' ；
3. 令 O 为以 this 作为参数调用 ToObject 的结果；
4. 令 isArray 为 IsArray(O) ；
5. ReturnIfAbrupt(isArray) （如果 isArray 不是一个正常值，比如抛出一个错误，中断执行）；
6. 如果 isArray 为 true ， 令 builtinTag 为 'Array' ;
7. else ，如果 O is an exotic String object ， 令 builtinTag 为 'String' ；
8. else ，如果 O 含有 `[[ParameterMap]]` internal slot, ， 令 builtinTag 为 'Arguments' ；
9. else ，如果 O 含有 `[[Call]]` internal method ， 令 builtinTag 为 Function ；
10. else ，如果 O 含有 `[[ErrorData]]` internal slot ， 令 builtinTag 为 Error ；
11. else ，如果 O 含有 `[[BooleanData]]` internal slot ， 令 builtinTag 为 Boolean ；
12. else ，如果 O 含有 `[[NumberData]]` internal slot ， 令 builtinTag 为 Number ；
13. else ，如果 O 含有 `[[DateValue]]` internal slot ， 令 builtinTag 为 Date ；
14. else ，如果 O 含有 `[[RegExpMatcher]]` internal slot ， 令 builtinTag 为 RegExp ；
15. else ， 令 builtinTag 为 Object ；
16. 令 tag 为 Get(O, @@toStringTag) 的返回值 //  @@toStringTag 是Symbol属性的一种写法，相当于 O[Symbol.toStringTag]
17. ReturnIfAbrupt(tag) ，如果 tag 是正常值，继续执行下一步；
18. 如果 Type(tag) 不是一个字符串，让tag 等于 builtinTag ；
19. 返回由三个字符串 "[object" + tag + "]" 拼接而成的一个字符串。
```
以上可以理解为，新规范将旧有的一些内置对象的内部 `[[Class]]`属性替代为`internal slot` (内部插槽)，新增的内置对象使用`Symbol.toStringTag`属性设置类型标签。

> Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把它包含在自己的返回值里。 --MDN

```js
Object.prototype.toString.call(new Map());            // "[object Map]"
Object.prototype.toString.call(function* () {});      // "[object GeneratorFunction]"
Object.prototype.toString.call(Promise.resolve());    // "[object Promise]"
```
所以同样的，通过定义`Symbol.toStringTag`属性，我们自己创建的类也可以自定义类型标签：

```js
// 未自定义前，返回Object类型标签
class ValidatorClass {}
Object.prototype.toString.call(new ValidatorClass()); // "[object Object]"

// 自定义类型标签
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}

Object.prototype.toString.call(new ValidatorClass()); // "[object Validator]"
```

### 参考链接

[MDN Symbol.toStringTag](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)
[谈谈 Object.prototype.toString](https://segmentfault.com/a/1190000009407558)

## isNaN() 和 Number.isNaN()

与 ES 中其他的值不同，NaN不能通过相等操作符（== 和 ===）来判断 ，因为 NaN == NaN 和 NaN === NaN 都会返回 false。 因此，isNaN 就很有必要了。

但是在ES中有两个isNaN函数，一个是作为全局方法挂载在全局对象上`isNaN()`，一个是作为Number构造函数的静态方法`Number.isNaN()`

两者含义并不相同，使用时取决于我们真正的检测目的：

- 如果只是为了单纯为了判断是不是Number类型中的NaN值时，使用`Number.isNaN()`
- 如果是为了验证某个数会不会转化为NaN值或就是NaN本身，则使用全局方法`isNaN()`

### isNaN

isNaN方法是作为全局方法，挂载在全局全对象上，所以可以直接调用。

比如：
```js
isNaN(NaN) // true
isNaN('abc') // true
isNaN({}) // true

isNaN(false)  // false
isNaN(123)  // false
isNaN('') // false
isNaN([]) // false

```

所以全局的 `isNaN`函数实现逻辑是：
- 如果isNaN函数的参数不是Number类型， isNaN函数会首先尝试将这个参数转换为数值，然后才会对转换后的结果是否是NaN进行判断。

类似于下面的实现：
```js
var isNaN = function(value) {
    var n = Number(value);
    return n !== n;
};
```

其实等同于回答了这样一个问题：被测试的值在被强制转换成数值时会不会返回IEEE-754​中所谓的“不是数值（not a number）”。

### Number.isNaN

所以使用全局`isNaN`函数来判断数值类型NaN的值并不靠谱。所以在最新ES2015规范中，实现了Number.isNaN()函数，它是完全只针对Number类型中的NaN。

```js
// 除 NaN 本身外，其余都为 false
Number.isNaN(NaN) // true
Number.isNaN('abc') // false
Number.isNaN({}) // false

Number.isNaN(false) // false
Number.isNaN(123) // false
Number.isNaN('') // false
Number.isNaN([]) // false
```
### 参考链接
[MDN isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)

## Array.isArray()

Array.isArray() 用于确定传递的值是否是一个 Array 类型。当检测Array实例时, Array.isArray 优于 instanceof。

```js
// 下面的函数调用都返回 true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
Array.isArray(new Array('a', 'b', 'c', 'd'))
Array.isArray(Array.prototype); // 鲜为人知的事实：其实 Array.prototype 也是一个数组。

// 下面的函数调用都返回 false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray('Array');
Array.isArray(true);
Array.isArray(false);
Array.isArray(new Uint8Array(32))

let let obj = { __proto__: Array.prototype }
obj instanceof Array  // true
Array.isArray(obj) // false
```

参考链接：[MDN Array.isArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)

## Object.is()




