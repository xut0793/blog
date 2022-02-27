
# 《JavaScript 语言精粹》 蝴蝶书

![js_01.jpg](./images/js_02.jpg)
2012年9月 第2版

这是一本社区内比较有名的书籍，是 JSON 和 JsLint的作者 Douglas Crockford （道格拉斯.克罗克福德)所著。书中总结了 JavaScript 语言的“精华、鸡肋、糟粕”，即“好、中、坏”的部分。 

[[toc]]

## 毒瘤

### 1. 全局变量
  
许多语言都有全局变量，例如 Java 中的 public static 成员属性就是全局变量。 **JavaScript 的问题不在于它使用全局变量，而在于依赖全局变量。** JavaScript 没有像 Java 语言的链接器，JS 将所有编译单元都载入一个公共全局对象中。这样一来，一个全局变量可以被程序的任何部分在任意时间修改，这样就使得程序中的变量变得难以管理和复杂，降低了程序的可靠性。

在 JavaScript 中有三种定义全局变量的方式：
- 在全局作用域内声明一个变量，即成为全局变量
- 直接给全局对象添加一个属性，在浏览器中，即给全局对象 window 添加属性
- 隐式全局变量，即直接使用一个未经声明的变量
```js
var a = 123
window.b = 456
c = 789
```

### 2. 作用域

书中对作用域的批判主要在于 JS 中引用了 C 语言大括号的语法，却没有实现 C 语言块级作用域的限制，导致变量提升的问题。但是这点在最新的 ES6 语法中随着 let const 声明方式的加入，也实现了块级作用域的限制。所以这点在现代 ES 语法中已经不成立了。

### 3. 自动插入分号

作者的观点应该是提醒我们不要依赖 JS 中自动插入分号的机制，而更应该规范自身书写的代码，通过规范的代码去避开自动分号机制可能制造出来的问题。

### 4. 保留字

JS中保留字不能用来命名变量和参数，并且当使用保留字作为对象属性时必须使用引号括起来，不能用点引用。

我倒觉得这点倒不是什么问题，遵守在代码中不使用保留字就好了。

### 5. Unicode

Unicode字符编码中，在第0平面（基本平面）的字符，都是用两个字节即16位表示一个字符，在辅助平面中，就要使用3或4个字节来表示一个字符。但在 JS 会将超过2个字节的编码视为两个不同的字符，此时对 String 类型相关的方法都会受到影响。比如`string.length`就会不准确。
```js
let str = 'A';
console.log(str === "\u0041");
console.log(str.length); // 1

let str = '🐄'
console.log(str.length) // 2
console.log(str === '\ud83d\udc04') // true
console.log(str === '\u{1F404}') // true  \u{1F404}是ES6语法对辅助平面内字符实体的表示。
```

这主要是因为历史时间先后的问题，在JS创建之初，Unicode字符集还只限于基本平台内，还没扩展到辅助平面的字符。目前在这点问题上，最新的 ES6 很多语法已经改善了这个问题。

> 更多关于字符编码的内容可以跳转至 [字符串编码](/FE-Language/ES/type-3-string.html#ucs-2编码)

### 6. typeof

对 typeof 操作符的问题主要集中在两点：
- 原始值类型检测除null外，都是准确的，返回小写的字符串类型名称，但`typeof null === 'object'`。
- 对象类型检测除函数Function对象类型外，都直接返回字符串 `object`。

所以 typeof 适合用于检测基本类型数据。并且需要单独处理 Null 类型（通过严格相等判断 data === null）。

> 关于[typeof 检测原理](/FE-Language/ES/type-7-checking.html#typeof)

### 7. parseInt()

> 似乎命名为 parseToInt 更好:sweat_smile:
`parseInt`是一个把字符串转换为十进制整数的函数。它主要的问题在于：
- `parseInt('16') 与 parseInt(`16abc`)`结果一样，因为它遇到非数字时就会停止解析
- `parseInt('08`)` 结果是 0 。因为函数遇到字符串的第一字符如果是 0 ，则会基于八进制而不是十进制进行求值。在八进制中，8和8以上都是字符，所以遇到第一个非字符，返回前面的结果。这种问题在用JS解析日期和时间时会出现问题。

所以，对使用 `parseInt / parseFloat`这类函数，最好都指明第二个参数，明确要转换字符串的进制数。
```js
parseInt('09') // 0
parseInt('09', 10) 9 第二参数批量当前参与转换的字符串 '09' 是一个十进制数
```

### 8. +
`+` 运算符可以用于加法运算，也可以用于字符串的拼接，具体会如何执行取决于两边参数的类型。

- 如果两边运算子都是数值类型，则执行加法运算
- 如果有一边运算子是字符类型，则将剩余运算子转为字符串进行拼接。

这个复杂的行为就是 Bug 常见的来源。所以打算用 `+`运算时，确保两边是同类型。

### 9. 浮点数

这是一道经典的面试题：`（0.1 + 0.2） ！== 0.3`。

这是大概分程序的通病，并不是 JS 一家之苦。因为它们都采用二进制浮点数算术标准（IEEE 754），就会有这个问题。

> 关于 JS 中采用双精度浮点数表示 Number 类型值，更多关于 [js中双精度浮点数](/FE-Language/ES/type-2-number.html)

### 10. NaN

同样，`NaN`是 IEEE 754 标准中定义的一个特殊的数量值，它表示不是一个数字，在 JS 中仍属于数值类型。

```js
typeof NaN === 'number'    // true
```
NaN 的主要问题是：
- `typeof NaN`不能准确辨别是一个纯数字，还是 NaN 或者 InFinity。
- `NaN`总是不等于自身，即`NaN === NaN` 返回 false

所以要检测一个值是不是 NaN ，JS专门提供了一个全局方法 `isNaN()`，该方法会先将参数隐性转换为数值类型后再判断。

```js
isNaN(NaN) // true
isNaN('ab') // true
isNaN('1ab') // true 类似于 isNaN(Nuber('1ab'))
isNaN('12') // false
```

判断一个值是否可用做数值，最好采用全局提供的 `isFinite()`方法，它仍然先会将参数隐性转换为数值类型，再排除 `NaN / InFinite`。
```js
isFinite('123') // true
isFinite(NaN) // false
isFinite('1ab') false
isFinite( 1/ 0 ) // false
```
`isFinite()`会将参数做隐性转换，如果要判断一个值是不是一个纯数字的数值类型，可以自定义 `isNumber` 方法。
```js
function isNumber(value) {
  return typeof value === 'number' && isFinite(value)
}
```

### 11. 伪数组

这部分主要在于两个问题：
- 不方便判断一个值是不是一个数组，使用传统方法较为麻烦。但现代 ES 语法中也提供了一个 `Array.isArray()`的静态方法。
- 类似 `arguments / NodeList`这些对象并不是真正的数组对象，只是拥有一个 length 属性而已。此类对象不能直接调用数组方法，但可以借用或将其转化为数组才可使用。

```js
// 传统方法通过构造函数属性判断
if (arr && typeof arr === 'object' && arr.constructor === Array) {
  // arr 是一个数组
}

if (Object.prototype.toString.call(arr) === '[object Array]') {
  // arr 是一个数组
}

// ES6 新方法
if (Array.isArray(arr)) {
  // arr 是一个数组
}
```

```js
// 类数组数组对象借用数组方法
Array.prototype.forEach.call(LikeArray, callback)

// 复用类数组生成数组对象
const arr = Array.from(LikeArray)
```

### 12. 假值 falsy

文中的观点在于 `undefined / NaN `这两个值的使用上与 `null` 完全不一样。 `null`作为关键字，不能使用并赋值，会报错。但`undefined / NaN`却不是关键字，可以在程序中可以重新定义并改变它们的值。

这种情况在 ES5 的规范中已经改善了这种情况，至少在全局作用域中这类值已经无法变更其值了，但在函数作用域中仍然可以。

```js
// 全局作用域
var undefined = 1
var NaN = 2
console.log(undefined) // undefined
console.log(NaN) // NaN

// 函数作用域中可以变量
function a () {
  var undefined = 1
  var NaN = 2
  console.log(undefined) // 1
  console.log(NaN) // 2
}
a()


// null
var null = 1; // 报错 Uncaught SyntaxError: Unexpected token 'null'
function b () {
  var null = 1; // 在此处就会报错
  console.log(null)
}
b()
```

### 13. hasOwnProperty

`hasOwnProperty`方法常用于过滤 `for in`语句中对继承来的属性。但遗憾的是，`hasOwnProperty`作为一个方法，而不是一个运算符，所以在任何对象中，它可能会被重写或被同名变量覆盖掉。

```js
const obj = {
  a: 1,
  b: 2
}

obj.hasOwnProperty = null // 覆写了

for (let key in obj) {
  if (obj.hasOwnProperty(key)) { // 被覆写了，报错， hasOwnProperty不是一个函数
  }
}
```

### 14. Object 原型链

JS 中引用对象属性时，当自身不存在时，会沿着原型链去查找，直到无法找到，返回 undefined。如果找到就返回其值。

文中作者举例说明当对象引用自身属性与原型链上属性冲突时，会产生很多意外的结果。

## 糟粕

### 1. `== / !==`

作者建议永远不要使用宽松相等和宽松不相等运算符 `== / !==`，而应该使用严格相等和严格不相等运算符`=== / !==`。

- 只有值两个运算数：1. 数据类型一致；2. 并且值完全相等，那么严格运算符`===`返回`true`，严格不相等返回`false`
- 而宽松运算符当运算数的数据类型不一致时，会尝试先强制转换值的类型，才比较。强制转换的规则复杂且难以记忆，也是BUG易出的隐患，违反了运算符的传递性。
>传递性是一种编程约定，可以理解为：如果 x===y,y===z,那么x===z

```js
/**
 * 比如在VUE的表单绑定中单选radio组件，v-model的绑定数值常常是字符串形式
 * 
 * <el-radio v-model="formParams.isRun"><el-radio>
 * 
 * 此时在script结构中的语句中判断最好显式使用Number函数进行转换再比较，代码意思更直观
 * 
 * '1' == 1 // true
 * Number('1') === 1 // true
 */

if (Number(formParams.isRun) === 1) {
  // do something
}
 
 /**
 * 另一种情况，如果返回的对应绑定的值又是数值，如果需要v-model绑定回显，又常常要接口请求中转换由 String(1) 转换为字符 ‘1’
 */

formParams = {
  isRun: String(response.data.isRun)
}
```
### 2. `++ / --`

这两个运算符可以用在运算数前面，也可以用在运算后面，语句运算的结果并不相同。这样这鼓励了一种不够谨慎的编程风格，使得代码变得隐晦，大多数的缓冲区溢出错误造成的安全错误，都是由这类不够谨慎的编码导致的。这像上面宽松和严格运算符一样，尽量让代码运算的逻辑更直观和整洁。

```js
let a = 1
let b
let c

// 后自增形式，先执行赋值语句，再自增，即 b = a; a = a + 1
b = a++
console.log(a, b) // 2, 1

// 前自增形式，先执行加 1， 再赋值，邓 b = b + 1; c = b
c = ++b
console.log(b, c) // 2, 2
```

### 3. new

事实上任何函数都可以1. 直接调用；2. new 调用。如果是一个本意用于构造对象的函数当作普通函数调用，那函数体内的`this`会被绑定到全局对象，初始会的成员属性会污染全局变量的属性。

一般都是按照约定，但没有限制，命名创建对象的构造函数首字母以大写字母的形式来命名。

如果一个构造函数必须命名用`new`调用，可以使用`new.target`来判断：
> [MDN new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)
```js
/**
 * new.target属性适用于所有函数中访问的元属性
 * 1. new.target返回一个指向构造方法或函数的引用。
 * 2. 在普通的函数调用中，new.target 的值是undefined。
 * 3. 在 箭头函数（arrow functions）中，new.target 指向最近的外层函数的new.target
 * 
*/
function CreateObject(param) {
  if (!new.target) {
    throw "CreateObject() must be called with new";
  }
  this.param = param
}

CreateObject()  // CreateObject() must be called with new
let obj = new CreateObject('value')
console.log(obj.param) // value
```

所以作者建议更好的策略是根本不去使用 new 。当然在现代ES6中，构造对象更建议使用`class`语法构建。

并且当初 JS 创建 `new + Function`的语法构造对象，也只是迫于当时公司的政法环境，用于模拟 JAVA 语法设施（见 JAVASCRIPT 语言的发展史）

### 4. void

在其它语言中，void 是一种类型，表示没有值。但在 JS 中，void 是一个运算符，它接受任何表达式，但返回结果永远是 `undefined`。这非常困惑，应该避免使用它。

一般在 HTML 的 a 链接元素中使用，避免点击跳转会使用下面的编码

```html
<a href="javascript:void(0)" >some thing</a>
```
也可用于自执行函数（IIFE），因为 void 后面被视为表达式执行了，并且结果始终返回 undefined
```js
void function foo () {
  console.log('run')
}()
```
### 5. continue 语句

作者的观点是 continue 语句性能不好。
- continue 语句：结束本次循环，继续下一轮循环条件判断
- break 语句：中止循环，如果是嵌套循环，中止本层循环，需要一层一层break退出全部循环

```js
/**
 * js中循环和迭代的语句
 * 1. for 语句
 * 2. for of
 * 3. for in  常与 object.hasOwnProperty()配合迭代对象的键
 * 4. while do-while
 */

 const arr = [1,2,3,4,5]
 let len = arr.length

 console.log('====== for break =====');
 for (let i = 1; i <= len; i++) {
   if (i === 3) break;
   console.log(i); // 1 2
 }

 console.log('====== for continue =====');
 for (let i = 1; i <= len; i++) {
  if (i === 3) continue;
  console.log(i); // 1 2 4 5
}

console.log('====== for-of break =====');
for(let i of arr) {
  if (i === 3) break;
   console.log(i); // 1 2
}

console.log('====== for-of continue =====');
for(let i of arr) {
  if (i === 3) continue;
   console.log(i); // 1 2 4 5
}

console.log('====== for-in break =====');
for(let key in arr) {
  if (arr[key] === 3) break;
   console.log(arr[key]); // 1 2
}

console.log('====== for-in continue =====');
for(let key in arr) {
  if (arr[key] === 3) continue;
   console.log(arr[key]); // 1 2 4 5
}

console.log('====== while break =====');
let j = len
while(j--) {
  if (arr[j] === 3) break
  console.log(arr[j]); // 5 4
}

console.log('====== while continue =====');
let k = len
while(k--) {
  if (arr[k] === 3) continue
  console.log(arr[k]); // 5 4 2 1
}
```

### 6. switch 语句

switch 语句的问题在于：除非每次在 case 语句明确中断流程（break / return / throw)，否则  case 条件穿越到下一个case条件，会导致很多隐藏的BUG，并且不容易发现，所以避免使用，或者每个 case 语句明确中断语句。

### 7. with 语句

with 语句严重影响 JS 引擎的速度，并且代码难以理解，避免使用它

### 8. eval 函数

eval 函数会将函数的字符串给 JS 编译器，并且执行其结果。 它的主要问题在于：

- 代码难以理解和阅读
- JS 引擎性能降低，因为它需要运行编译器
- 不安全，因为会将传入的文本进行执行求值
- 像代码检测工具，如 JSLint ESLint 难以检测问题

在实际代码中应尽量避免使用它。但常用于一些工具库的解析，如 webpack

另外，Function 构造器也是 eval 的一种形式，同样应该避免使用。

```js
eval('let a = 1, b = 2; console.log(a + b);')  // 3

// Bad
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(1, 2)); // 3

// Good
const sum = function (a, b) {
  return a + b;
}
console.log(sum(1, 2)); // 3
```

### 9. function 语句和 function 表达式

这两者主要问题在于 function 函数声明语句有两个问题：
- 存在函数声明提升的问题，导致函数可以先使用后声明。
- 禁止 if 条件语句中使用函数声明方式，因为虽然 JS 允许这样做，但不同的浏览器的 JS 引擎对这样写法在解析处理上各不相同，存在移植和兼容性问题

所以作者建议使用函数表达式的形式定义函数。 但也有很多 JS 规范建议始终使用 函数声明的方式。在这点上，我更倾向于函数定义只用 function 声明，变量用 let , 常量用 const，这样界限清晰明确。

### 10. 缺省块语句

这点在现代 ES6 中已经不存在了。因为使用 let const 声明的变量即存在块级作用域的限定。

### 11. 类型包装对象

主要是指 JS 最初的三种基本类型存在对应的包装对象，所以对这三种类型的操作存在 “包装操作” 和 “拆包装操作”，并且涉及到 Object 对象的 `valueOf / toString / toPrimitive`的转换。存在不必要的复杂性
> 更多内容请点击查看 [原始值与包装对象](/FE-Language/ES/type-8-primitive-wrapper.html#原始值-primitive) 以及 [类型转换](/FE-Language/ES/type-9-conversion.html)

### 12. 位运算符

JS 有着一套与 JAVA 一样的位运算符
```js
&    and 按位与
|    or  按位或
^    xor 按位异或
~    not 按位非
>>   带符号的右移位
>>>  无符号的右移位
<<   左位移
```

但在 JAVA 里，数值分多种类型，有整数和浮点数等，JAVA 里的位运算只处理整数类型。但 JS 中没有整数类型，数值在 JS 中都存储为双精度浮点数。

因此在 JS 中实现位运算，需要先将运算数先转换成整数，然后执行位运算符逻辑，最后再将结果转换成 JS 能表示的双精度浮点数。

在其它大多数语言中位运算符接近于硬件处理，所以非常块，但 JS 语言执行环境一般接触不到硬件层，所以非常慢。所以在 JS 中少用位运算。

另外， 位运算中的`&`，容易被误写成逻辑运算符`&&`（与），容易产生隐藏的 BUG


## 精华

### 1. 函数是一等公民

> 更多内容请点击查看：[函数](/FE-Language/ES/fn-0-index.html)


### 2. 基于原型的动态对象
> 更多内容请点击查看：[对象](/FE-Language/ES/oop-0-index.html)

### 3. 字面量语法
```js
const obj = {
  name: 'tom',
  age: 18
}

const arr = [1,'a', true]

function fn (a, b) {
  return a + b
}

const regexp = /\d+/g
```
