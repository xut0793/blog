# 表达式和操作符

[[toc]]


## 表达式

表达式是包含着值和运算的代码片段，通过表达式可以计算并生成一个新值。

下面示例都是表达式的形式，通过计算并返回一个值。

```js
2                                   // 2
2 + 2 * 2                           // 6
(2 + 2) * 2                         // 8
9 > 5                               // true
'a' === 'a'                         // true
'123' == 123                        // true
true == 1                           // true
true == 2                           // true
true === !false                     // false
'123' + 4                           // 1234
'hello'.length                      // 5
'Hello'.replace('e','u')            // Hullo
[1,2,3].join('+')                   // 1+2+3
(function(x){return x * 3}(2))      // 8
void function(x){return x * 2}(2)   // undefined
```

## 运算符

表达式的定义是包含值和运算的代码版段，其中运算的代码中有一个重要的概念是运算符。即运算符决定了如何计算返回一个新值。

根据运算规则，大致可以将运算符分为以下几类：

- 赋值运算符
  - 等号：`=`
  - 解构赋值
  - 展开运算符 spread (...)
- 算术运算符
  - 加减乘除余幂： `- * / % **`
  - 加号运算符：`+`
- 位运算符：`>> << & | ^`
- 复合的运算符
  - 数值的复合算术运算符：`*= /=  %=  -= +=`
  - 位运算的算命运算符：`<<= >>= &= ^= |=`
  - 字符拼接复合运算：`+=`
- 比较运算符：`> < == != === !== >= <=`
- 逻辑运算符：`&& || !`
- 条件运算符：`? :`
- 逗号运算符：`,`
- 括号运算符：`( )`
- 类型检测运算符：typeof / instanceof
- 对象属性相关操作符：点号. / 中括号[] / in / delete
- 构造函数相或类相关的操作符：new / new.target / super / this / class
- 其它：void / function* 和 yield  / async 和 await

## 赋值运算

赋值表达式有多种形式：
- 使用等号`=`赋值，是最基本和常见的形式
- 复合赋值，与其它运算结合运算后赋值
- 解构赋值，ES6 新语法
- 扩展运算符，ES6新语法

1. 基本的等号赋值
```js
x = value;  // 为一个已经声明过的变量赋值
var x = value; // 声明变量的同时直接赋值
x = y = z = value; // 链式赋值，同时等于同个值的多个变量赋值
```

2. 复合赋值运算：与其它运算符一起运算并赋值
```js
x *= value; // x = x * value;
x /= value; // x = x / value;
x %= value; // x = x % value;
x -= value; // x = x - value;
x += value; // x = x + value;
```

3. 解构赋值, 可以将属性/值从对象/数组中取出,赋值给其他变量。
```js
// 对象解构
let {a,b,c} = {a:1,b:2,c:3}
console.log(a) // 1
console.log(b) // 2
// 如果不想属性同名，可以重命名
let {a:foo, b:bar} = {a:1,b:2}
console.log(foo) // 1
console.log(bar) // 2

// 数组解构
let [a,b,c] = [1,2,3]
console.log(a) // 1
console.log(b) // 2
```
4. 扩展运算符赋值 spread: 

将数组表达式或者string在语法层面展开；还可以在构造字面量对象时, 将对象表达式按key-value的方式展开。

经常用在函数调用时传入参数，构造新数组，构造新对象的时候。 

```js
// 构造新数组，区别于等号构造，相当于实现了数组拷贝，类似调用arr.slice()
let a = [1,2,3]
let b = a
let c = [...a]
console.log(b) // [1,2,3]
console.log(b === a) // true，变量ab指向同一个数组
console.log(c) // [1,2,3]
console.log(c === a) // false,不同的数组

// 实际情形更常用于数组合并，产生一个新数组
let a = [1,2]
let b = [3,4]
let c = [...a, ...b]
console.log(c) // [1,2,3,4]，类似 a.concat(b)
```
```js
// 使用字面量形式构造新对象
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 }; // 克隆后的对象: { foo: "bar", x: 42 }
var mergedObj = { ...obj1, ...obj2 }; // 合并后的对象: { foo: "baz", x: 42, y: 13 }
```

```js
// 函数调用时值参
function myFunction(x, y, z) { }
var args_arr = [0, 1, 2];
myFunction(...args_arr);

var args_obj = {x:1,y:2:z:3:m:4}
myFunction(...args_obj) // 多余的将会忽略
```

```js
// 与函数调用时使用扩展运算符传入参数相对应
// 在函数声明时可以使用REST运算符接收剩余参数，写法与之类似，但必须在函数声明时使用。可以替代函数调用apply方法
function myFunction(x,...args) {console.log(args)}
var args_arr = [0, 1, 2];
myFunction(...args_arr); // 此时x=0, args = [1,2]
myFunction(4，5，6，7); // 此时x=4, args = [5，6，7]

// 剩余参数语法允许我们将一个不定数量的参数表示为一个数组。但对象会报错
var args_obj = {x:1,y:2:z:3:m:4}
myFunction(...args_obj) // Error
```
> 具体的ES[扩展运算符（Spread）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)和[剩余参数运算符（Rest）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)点击查看MDN

## 算术运算符

算术运算符执行数学上的加、减、乘、除、取余（取模）、次幂计算

算术运算符返回数值类型，特殊的加号运算视情况返回数值或字符串。

算术运算符的执行逻辑：
1. 确保两个运算数都是原始值类型。如果是对象，将对象进行隐性转换成原始值（执行内部的Symbol.ToPrimitive()方法，最终会调用对象的valueOf()或toString()方法。具体查看上节的[对象类型的隐性转换](/ES/DataType.html#对象类型的隐式转换) 
2. 只要有一个运算符是原始值数字Number类型，则都转为数值运算
3. 如果是加号运算符，则优先判断只要有一个是字符串类型，则都转为字符串拼接运算。

在JS语言中，当运算符两边的运算子不是同一种类型或者不是运算符匹配的类型时，会进行类型值的隐性转换。查看上节的[数据类型的隐式转换](/ES/DataType.html#数据类型的隐式转换)

```js
var x = 2
console.log(x + 1) // 3
console.log(x - 1) // 1
console.log(x * 2) // 4
console.log(x / 2) // 1
console.log(x % 2) // 0
console.log(x ** 3) // 8 相当于2的3次方，2 * 2 * 2
```
算术运算符要求两边的运算子为原始值的Number类型，如果不是，会对运算子进行隐性转换
```js
var x = 2
console.log( x + 1) // 3
console.log(x + true) // 3 true=>1
console.log(x + false) // 2 false=>0
console.log(x + '1') // 21
console.log(x + 'a') // '2a'
console.log(x * '2') // 4
console.log(x * 'a') // NaN
console.log(x - [1]) // 1

var obj = {valueOf:function(){return 100}}
console.log(x * obj) // 200
```
上面的例子中可以发现，其中最特殊的是 加号运算符 `+`

### 特殊的加号运算符`+`

在JS中大部分常规的运算符都是将运算子优先转为原始值的数值类型，但加号运算符是优先将运算子转为原始值的字符串类型。

加号运算符`+`：如果其中一个运算子是字符串，则另一个运算子会被转为原始值字符串，然后对它们进行字符串拼接。

```js
console.log('foo' + 3) // foo3
console.log('1' + true) // 1true
```
## 比较运算符

主要为数学中常见的比较运算：大于、小于、大于等于、小于等于、等于、不等于。

比较表达式执行后返回布尔值（true / false）

比较运算符的执行逻辑：

1. 确保两个运算数都是原始值类型。如果是对象，将对象进行隐性转换成原始值（执行内部的Symbol.ToPrimitive()方法，最终会调用对象的valueOf()或toString()方法。具体查看上节的[对象类型的隐性转换](/ES/DataType.html#对象类型的隐式转换) 
2. 如果两个运算符都是字符串类型，则按字符串在内存储存的16位码元进行比较，即字符在Unicode字符集中的码位大小比较。关于字符串存储和Unicode字符集相关内容，具体查看上节的[字符串类型](/ES/DataType.html#string-字符串：遵循ucs-2标准以16位双字节读写)
3. 否则，最终将两个运算符转为原始值的数值类型进行比较。

```js
console.log(7 > 5) // true
console.log( 7 > '5') // true
console.log(7 > true) // true。 true=>1
console.log('a' > 'A') // true  'a'=97, 'A'=65
console.log(1 < [2]) // true
```

### 等号运算符（严格相等和宽松相等）

比较运算符中也有一类特殊的比较运算，就是等于和不等于的比较。分为两种：

- 严格相等`===`和严格不相等`!==`：要求比较的值必须是相同类型，并且值相等。但唯一的特例是`NaN`是自身都不相等的。
- 和宽松相等`==`和宽松不相等`!=`：会先尝试将两个不同类型的值进行隐性转换为相同类型值（优先转为数值类型），然后再进行相等比较。

```js
console.log('1' === 1) // false
console.log('1' == 1) // true
console.log('' == 0) // true

console.log(true === '1') // false
console.log(true == '1') // true
console.log(true == 2) // false

console.log(NaN === NaN) // false
console.log(NaN == NaN) // false

console.log(null === undefined) // false
console.log(null == undefined) // true

console.log({} == 0) // false
console.log({} == '[object Object]') // true
console.log([] == 0) // true
console.log([123] == 123) // true

console.log(new Number(123) === new Number(123)) // false
console.log(new Number(123) == new Number(123)) // false
```

## 逻辑运算符

逻辑运算符包括 &&与  ||或  !非

执行逻辑都是将运算子转为布尔值进行判断。也就是真假值判断。

- && 与：两边都为真值时，才有返回值，有一个为假值则为false
- || 或：有一个为真值时，返回为真的运算数。否则都为假值返回false
- ! 非：真假值取反，然后再执行后续运算

### 真假值

- 假值（falsely）: undefined / null / '' / 0 / NaN
- 真值（truly）：除上述假值外都为真值，包括空数组`[]`、空对象`{}`。，即所有对象类型都是真值。

```js
console.log(Boolean(undefined)) // false
console.log(Boolean(null)) // false
console.log(Boolean('')) // false
console.log(Boolean(0)) // false
console.log(Boolean(NaN)) // false

console.log(Boolean([])) // true
console.log(Boolean({})) // true
console.log(Boolean(New Boolean(false))) // true
```

> 至于JS中为什么判断对象总为真？<br>我们知道对象通过valueOf()和toString()方法实现了对象隐性转换为数值或字符串。在历史也讨论过为什么对象没有实现类似toBoolean()方法。主要原因是因为布尔运算的结果是会保留某个运算数整个表达式。如果重复链式比较，对于原始值类型这样操作实现成本不大，但是对于对象类型，则实现成本很大，所以在EcmaScript 1版本中就规范对象总返回为真来避免这个实现成本。参考《深入浅出JavaScript》P99

### 短路运算

- 与： exp1 && exp2
  1. 如果exp1表达式结果为假，则直接返回false，exp2不会执行
  2. 如果exp1表达式结果为真，则才执行并返回exp2表达式结果

- 或：exp1 || exp2
  1. 如果exp1表达式结果为真，则直接返回exp1并执行返回结果
  1. 如果exp1表达式结果为假，则再判断exp2表达式，若也为假，则返回false。如果exp2为真，则返回exp2表达执行结果。

- 非： !exp
  - 对exp表达式结果转为真假值后取反，返回值必定是布尔值。

```js
let a = (1 < 3) && [1,2,3];
console.log(a) // 1<3为真，直接返回后的数组赋值于a，所以a是一个数组。而不是布尔值的true

let b = undefined || {a:1,b:2}
console.log(b)

let c = !(1 < 3) && [1,2,3] // !(1<3) => !true => false
console.log(c) // false
```
## 条件运算符（三目运算）

语法：

```js
condition ? exp_true : exp_false
```
如果conditon条件表达为真，则执行exp_true表达式，如果为假，则执行exp_false表达式

```js
let arr = [1,2]
var x = (1 < 2 ) ? arr[0] : arr[1]
console.log(x) // 1
```

## 逗号运算符

语法：
```js
exp1, exp2
// 或多个，但只返回最后一个expn
exp1, exp2, ..., expn
```
逗号运算符会对两边的表达式都执行，但只返回最后一个表达式执行结果
```js
var x = 0
function test() {return x}
var y = (x++, test(), 10)
console.log(x) // 1
console.log(y) // 10
```

## 括号运算符

括号运算符将执行括号内的表达式。并且优先级最高。

常用在需要改变运算优先级或IIFF自执行函数情形中。

```js
console.log(1 + 2 * 3) // 7
console.log((1 + 2) * 3) // 9

(function test(x) {
  console.log( x * 100 )
}(20)) // 2000
```

## 类型检测运算符

- typeof 用于判断原始值类型
- instanceof 判断对象是否是构造函数的实例
- Object.prototype.toString.call(obj) 用于判断所有类型

### typeof 判断原始值类型

语法：
```js
typeof value
typeof(value)
```

- typeof 返回参数的具体类型，以字符串形式返回结果。
- typeof 判断特殊的两处：
  - 在原始值类型中，对null返回object，其它都返回对象类型
  - 在对象类型中，对函数返回function，其它都返回object

```js

// Undefined
typeof undefined === 'undefined';

// Null
typeof null === 'object'

// 布尔值
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(1) === 'boolean'; // Boolean() 会基于参数是真值还是虚值进行转换
typeof !!(1) === 'boolean'; // 两次调用 ! (逻辑非) 操作符相当于 Boolean()


// 数值
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof(42) === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管它是 "Not-A-Number" (非数值) 的缩写
typeof Number(1) === 'number'; // Number 会尝试把参数解析成数值

// 字符串
typeof '' === 'string';
typeof 'bla' === 'string';
typeof `template literal` === 'string';
typeof '1' === 'string'; // 注意内容为数字的字符串仍是字符串
typeof (typeof 1) === 'string'; // typeof 总是返回一个字符串
typeof String(1) === 'string'; // String 将任意值转换为字符串，比 toString 更安全

// BigInt
typeof 42n === 'bigint';

// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';

// 对象
typeof {a: 1} === 'object';
typeof [1, 2, 4] === 'object';
typeof new Date() === 'object';
typeof /regex/ === 'object'; // 历史结果请参阅正则表达式部分

// 函数
typeof function() {} === 'function';
typeof class C {} === 'function'
typeof Math.sin === 'function';

// 包装对象也是对象
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';
```

### `typeof null` 结果为'object'的问题

`null` 不是一个对象，尽管 `typeof null` 输出的是 Object，这是一个历史遗留问题。

在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示数据类型的标识符和实际数据值表示的。对象的类型标识符内存位是 0，而JS设计有参照JAVA，引入了 null类型，JS引擎实现是直接使用机器语言的NULL指针来定义，而NULL指针在大多数平台下存储时所有位都是0，即0x00，所以`typeof null`将它错误的判断为 Object 类型。

曾有一个 ECMAScript 的修复提案（通过选择性加入的方式），但被拒绝了。该提案会导致 typeof null === 'null'。

参考：《深入理解JavaScript》P94以及[MDN typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)

**参考链接**

[MDN typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)

### instanceof 判断对象是否是构造函数的实例

instanceof 运算符用于判断对象是否是构造函数的实例，更准确说是用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链

语法：
```js
object instanceof constructor
```
示例
```js
// 定义构造函数
function C(){} 
var o = new C();

// 此时o的原型链：o.__proto__ -> C.prototype -> Object -> Object.prototype
o instanceof C; // true，因为 o是C new出来的实例对象
o instanceof Object; // true，此处Object是构造函数Object(),区别于上面原型中的Object对象
C.prototype instanceof Object // true，同上


// 改变了C默认指向原型对象
C.prototype = {};
var o2 = new C();
o2 instanceof C; // true
o instanceof C; // false，C.prototype 指向了一个空对象,这个空对象不在 o 的原型链上.

D.prototype = new C(); // 继承
var o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true 因为 C.prototype 现在在 o3 的原型链上
```

[MDN instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

### Object.prototype.toString.call(obj) 更准确的判断所有类型

[MDN toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

`obj.toString()`方法返回一个表示该对象原始值的字符串。默认情况下，`toString()` 方法被每个对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object type]"，其中 type 是对象的类型。
```js
Object.prototype.toString.call(undefined)  // "[object Undefined]"
Object.prototype.toString.call(null)  // "[object Null]"
Object.prototype.toString.call(false) // "[object Boolean]"
Object.prototype.toString.call(123) // "[object Number]"
Object.prototype.toString.call('abc') // "[object String]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"
toString.call(new Date()); // [object Date]
toString.call(new String()); // [object String]
toString.call(Math); // [object Math]
```
> 从 JavaScript 1.8.5 开始，toString() 调用 null 返回[object Null]，undefined 返回 [object Undefined]。

以上写法常用于数据类型的判断。但如果像下面这样调用，会与上面不同：

```js
let str = 'abc'
let num = 123
let arr = []
let obj = {}
let date = new Date()
str.toString() // abc
num.toString() // 123
arr.toString() // ''
obj.toString() // [object Object]
date.toString() // Sun Dec 29 2019 19:36:09 GMT+0800 (中国标准时间)
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
- 直接在实例对象上（包括包装对象）调用，会返回对应实例对象的原始值的字符串形式。在语言内部常用于类型的隐式转换，具体见上章节[类型隐式转换](/ES/DataType.html#数据类型的隐式转换)


## 对象操作符

对象相关的操作符有：
- 点.
- 中括号 []
- in
- delete

### 点和中括号：对象属性获取

```js
var obj = {
  name:'tom',
  age: 18
}

console.log(obj.name) // tom
console.log(obj['name']) // tom
```

两都的区别是：

- 点后面接的属性必须是合法的标识符定义
- 中括号里可以是任意类型的值
- 中括号里也可以是能返回值的表达式
> 标识符的定义: 不以数字开头的字母、数字、美元符号、下划线的组合字符串

```js
var obj = {
  name:'tom',
  age: 18,
  '1_ab': 23234
}

function test() {return 'name'}

console.log(obj[test()]) // tom
console.log(obj[true?'name':'age']) // tom
console.log(obj['1_ab']) // 23234
console.log(obj.1_ab) // Error
```

### in : 判断对象是否拥有某个属性或方法，包括原型上的。

如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。

语法：
```js
prop in object
```
示例：
```js
// 自定义对象
var mycar = {make: "Honda", model: "Accord", year: 1998};
"make" in mycar  // 返回true
"model" in mycar // 返回true

// mycar继承自Object的属性
"toString" in mycar; // 返回true

// 内置对象
"PI" in Math          // 返回true

// 数组
var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
0 in trees        // 返回true
3 in trees        // 返回true
6 in trees        // 返回false
"bay" in trees    // 返回false (必须使用索引号,而不是数组元素的值)
"length" in trees // 返回true (length是一个数组属性)
Symbol.iterator in trees // 返回true (数组可迭代，只在ES2015+上有效)
```
[MDN in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)

### delete 删除对象属性

ddelete 操作符会从某个对象上移除指定属性。成功删除的时候回返回 true，否则返回 false。

但是，以下情况需要重点考虑：

- 如果你试图删除的属性不存在，那么delete将不会起任何作用，但仍会返回true
- 如果对象的原型链上有一个与待删除属性同名的属性，那么删除属性之后，对象会使用原型链上的那个属性（也就是说，delete操作只会在自身的属性上起作用）
- 任何使用 var 声明的属性不能从全局作用域或函数的作用域中删除。
这样的话，delete操作不能删除任何在全局作用域中的函数（无论这个函数是来自于函数声明或函数表达式）
- 除了在全局作用域中的函数不能被删除，在对象(object)中的函数是能够用delete操作删除的。
- 任何用let或const声明的属性不能够从它被声明的作用域中删除。
- 不可设置的(Non-configurable)属性不能被移除。这意味着像Math, Array, Object内置对象的属性以及使用Object.defineProperty()方法自定义设置为不可设置的属性不能被删除。

```js
var Employee = {
  age: 28,
  name: 'abc',
  designation: 'developer'
}

console.log(delete Employee.name);   // returns true
console.log(delete Employee.age);    // returns true

// 当试着删除一个不存在的属性时
// 同样会返回true
console.log(delete Employee.salary); // returns true
```
当一个属性被设置为不可设置，delete操作将不会有任何效果，并且会返回false。在严格模式下会抛出语法错误（SyntaxError）。

```js
var Employee = {};
Object.defineProperty(Employee, 'name', {configurable: false});

console.log(delete Employee.name);  // returns false
```
var, let以及const创建的不可设置的属性不能被delete操作删除。
```js
var nameOther = 'XYZ';

// 通过以下方法获取全局属性:
Object.getOwnPropertyDescriptor(window, 'nameOther');  

// 输出: Object {value: "XYZ", 
//                  writable: true, 
//                  enumerable: true,
//                  configurable: false}

// 因为“nameOther”使用var关键词添加，
// 它被设置为不可设置（non-configurable）
delete nameOther;   // return false
```
[MDN delete](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)

## 构造函数或类相关操作符
- new
- new.target
- super
- this
- class

具体见[构造函数章节]()和[类class章节]()

## 其它运算符

其它常见的运算符：

- void: 结果始终返回undefined
- *和 yield： 在生成器函数中使用，配合function *
- async 和 await

具体见[异步编程章节]()

### void

语法：
```js
void expr
```
expr会被执行，但无论其是否有返回值，一律返回undefined。

> 根据JS的作者Brendan Eich所说，他添加这个运算符就是为了方便处理javascript:URL返回的情形。

很少用，但是有以下两种场景：

- 用作IIFE的另一种写法

因为void运算符后面接的表达式会被计算，所以可以用在自执行函数上。
```js
(function text(x) {
  console.log( x * 10 )
}(8))

// 上述写法可以替换为void开头，但也很少用，更常见的还是使用括号运算符
void function text(x) {
  console.log( x * 10 )
}(8)
```

- 用在HTML中的链接元素上，因为返回undefined使得点击不跳转
```html
<a href="javascript:void 0" onclick="alert(111)" ></a>
```

总结：某些场景需要使得返回值是undefined是时候就可以使用void运算符。
