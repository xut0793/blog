# Symbol 类型

[[toc]]

Symbol类型是ES6新增的一种基本类型值，可以称为“符号类型值”。表示唯一的标识符。

学习Symbol需要理解下面内容：
1. Symbol类型的创建
1. Symbol类型的特征
1. Symbol全局注册表 和 全局Symbol
1. 系统Symbol

## 问题1

假设现在我们引入了一个第三方库，里面有个user对象，现在我们想在我们的代码中对该对象添加一个id属性

```js
let user = {name:'John'}

// 自己定义的id属性
user.id = 'our_id_value'。

// 此时如果同一项目的其它开发人员也有同样的需求，需要定义一个id属性。
user.id = 'their_id_value'
```
此时就会出问题，我们最初定义的id属性会被覆盖，导致调用逻辑可能出错。

这种情况下，如果我们使用ES6提供的Symbol类型来自定义id属性，则不管项目中是否还有同名的属性都不会冲突。因为Symbol类型值是唯一的。

```js
let user = {name:'John'}
let id = Symbol('our custom value')

user[id] = 'our_id_value

// 此时不管其它人是否仍用id名称重新定义了，只要我们本地维护了id = Symbol('our custom value')变量，那调用user[id]就永远是我们自定义的内容。

// 在其它人的脚本文件中定义同名变量
let id = Symbol('their defined value')
user[id] = 'their_id_value
```

这是因为Symbol类型值一旦定义就是唯一的。

```js
let id1 = Symbol()
let id2 = Symbol()

console.log(id1 === id2)  // false
```

## 问题2

在ECMAScript 5中，通常通过字符串表示概念（例如枚举常量）。例如：
```js
var COLOR_RED    = 'RED';
var COLOR_ORANGE = 'ORANGE';
var COLOR_YELLOW = 'YELLOW';
var COLOR_GREEN  = 'GREEN';
var COLOR_BLUE   = 'BLUE';
var COLOR_VIOLET = 'VIOLET';

function getComplement(color) {
    switch (color) {
        case COLOR_RED:
            return COLOR_GREEN;
        case COLOR_ORANGE:
            return COLOR_BLUE;
        case COLOR_YELLOW:
            return COLOR_VIOLET;
        case COLOR_GREEN:
            return COLOR_RED;
        case COLOR_BLUE:
            return COLOR_ORANGE;
        case COLOR_VIOLET:
            return COLOR_YELLOW;
        default:
            throw new Exception('Unknown color: '+color);
    }
}
```
我们通过常量（COLOR_RED等）来引用颜色，而不是对其进行硬编码（'RED'等）。

但是即使我们这样做，仍然会有产生一些意外混淆的情况。例如，某人可能定义了一个情绪常数：

var MOOD_BLUE = 'BLUE';
现在，值BLUE不再是唯一的，MOOD_BLUE可能会被误认为是。如果将它用作的参数调用getComplement()，它将返回'ORANGE'应该引发异常的位置。

现在我们可以使用Symbol来避免这种情况。现在，我们还可以使用ECMAScript 6功能const，该功能使我们可以声明实际的常量（您无法更改绑定到常量的值，但是该值本身可能是可变的）。
```js
const COLOR_RED    = Symbol();
const COLOR_ORANGE = Symbol();
const COLOR_YELLOW = Symbol();
const COLOR_GREEN  = Symbol();
const COLOR_BLUE   = Symbol();
const COLOR_VIOLET = Symbol();
```
因为每个值Symbol都是唯一的，所以现在常量COLOR_BLUE不会被其它定义的值覆盖。可以看到，使用Symbol代替符串，getComplement()函数的代码根本没有改变。

## Symbol 创建

ES6为Symbol类型值提供了Symbol()函数，用来创建该类型值。

```js
// id 是 symbol 类型的值
let id = Symbol();

// Symbol()函数也可以接受一个字符串参数，用于对新值的描述
let id = Symbol('our custom value')
// 可以通过description属性获取创建时的描述信息
console.log(id.description)           // our custom value
console.log(typeof id === 'symbol')  // true
```
id的类型仍属于基本类型，之所以能打点调用`id.description`属性，其实同 `'abc'.toUpperCase()`一样，也是ES内部创建了Symbol类型的包装对象来借调`Symbol.prototype`原型对象上的属性。
> 关于原始值与包装对象的内容可以查看[原始值与包装对象](/ES/type-8-primitive-wrapper)

描述信息可能仅在代码调试时有用，Symbol()创建的值是唯一的，即使拥有相同的描述信息。描述只是一种备注信息，不影响任何东西。
```js
let id1 = Symbol("id");
let id2 = Symbol("id");

alert(id1 == id2); // false
```

## Symbol 特征

### 1. Symbol类型值的唯一性

即使两个完全相同定义的Symbol类型值也是不相等的。
```js
let s1 = Symbol()
let s2 = Symbol()
console.log(s1 === s2) // false

// 拥有相同的描述信息也不改变唯一性的特征
let id1 = Symbol("id");
let id2 = Symbol("id");
console.log(id1 == id2); // false
```

### 2. Symbol类型值可以作为对象的键

在以前，Object的属性键只能是字符串形式，但在最新的ES6语言规范中，因为Symbol类型的出现，以及对象中括号`obj[]`可以实现计算属性时，Symbol类型也可以作为对象的属性键来使用，但区别于字符串类型的键，Symbol类型键只能通过中括号形式`[]`调用。

```js
// 中括号的计算属性
let obj = {}
obj['a' + 'b'] = 'abc'
console.log(obj.ab === 'abc') // true

// 所以使用Symbol类型作为对象唯一的键
let a = Symbol()
let b = Symbol()
obj[a] = 'symbol a'
obj[b] = 'symbol b'
console.log(obj[a])  // symbol a
console.log(obj[b]) // symbol b
```

### 3. Symbol类型值作为对象属性时是匿名的，不可枚举，相当于“隐藏”的属性。

```js
let obj = {
  name: 'john',
  [Symbol()]: 'symbol_value'
}

JSON.stringify(obj)                 // {"name":"john"}
Object.keys(obj)                    // ["name"]
Object.getOwnPropertyNames(obj)     // ["name"]
for (let key in obj) {
  console.log(key)
}                                   // name
```

只有以下两种方法可以获取对象中的Symbol类型的键
- Object.getOwnPropertySymbols()
- Reflect.ownKeys()

```js
let obj = {
  name: 'john',
  [Symbol()]: 'symbol_value'
}
 
Object.getOwnPropertySymbols(obj)  // [Symbol()]
Reflect.ownKeys(obj)               // ["name", Symbol()]

// 另外，Object.assign 会同时复制字符串和 symbol 属性：
let clone = Object.assign({}, obj)
Reflect.ownKeys(clone)               // ["name", Symbol()]
```

### 4. Symbol()函数不能作为构造函数，使用new调用。

内置函数 Symbol() 是一个不完整的类，当作为函数调用时会返回一个 symbol 值。但是如果试图通过语法 “new Symbol()” 作为构造函数调用时会抛出一个错误。因为Symbol()函数对象在语言内部并没有实现内部属性`[[Constructor]]`。

## Symbol 全局注册表 和 全局 Symbol

正如上面Symbol类型值特征中讲的，Symbol类型值具有唯一性，即使它们拥有相同的名字。

像下面的例子，我们无法跨模块使用obj对象中的Symbol属性值。
```js
// a.js
let id = Symbol()
let obj = {
  module: 'a.js',
  [id]: 'this symbol in a.js'
}
module.exports = { obj }

// b.js
const { obj } = require('./a')

let id = Symbol()
console.log(obj.module) //a.js
console.log(obj[id])   // undefined
```

但有时我们想要名字相同的 Symbol 具有相同的实体。这样可以实现应用程序的不同模块访问的相同名字的 Symbol 值 获得完全相同的属性值。

为了实现这种场景，ES6实现了一个**Symbol的全局注册表**，我们可以在其中创建 Symbol 并访问它们，它可以确保每次访问相同名字的 Symbol 时，返回的都是相同的 Symbol实体。

注册表内的 Symbol 被称为 **全局 Symbol**。

### Symbol.for(key)

Symbol()函数,或者说Symbol类实现了静态方法`Symbol.for(key)`，用于从注册表中读取（不存在则创建）Symbol实体。

执行逻辑是：方法调用后会检查全局注册表，如果有一个描述为 key 的 Symbol，则返回该 Symbol，否则将创建一个新 Symbol（Symbol(key)），并通过给定的 key 将其存储在注册表中。

所以改正上面的例子：

```js
// constant.js
const ID = 'ID'

module.exports = { ID }

// a.js
const { ID } = require('./constant.js')

let id = Symbol.for(ID)
let obj = {
  module: 'a.js',
  [id]: 'this symbol in a.js'
}
module.exports = { obj }

// b.js
const { ID } = require('./constant.js')
const { obj } = require('./a')

let id = Symbol.for(ID)
console.log(obj.module) //a.js
console.log(obj[id])   // this symbol in a.js
```

### Symbol.keyFor(sym)

Symbol()函数实现的另一处静态方法`Symbol.keyFor(sym)`用于在全局注册表中根据全局symbol实体查找key。

```js
// 通过 name 获取 Symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 通过 Symbol 获取 name
console.log( Symbol.keyFor(sym) ); // name
console.log( Symbol.keyFor(sym2) ); // id
```
Symbol.keyFor 内部使用全局 Symbol 注册表来查找 Symbol 的键。所以它不适用于非全局 Symbol。如果 Symbol 不是全局的，它将无法找到它并返回 undefined。

## 系统 Symbol

Symbol 类还具有一些其它的静态属性，被称为**系统 Symbol**。 

它们是在某些内置对象中找到的某些特定方法属性的 symbol。 暴露出这些 symbol 使得开发都可以直接访问这些行为；这样的访问可能是有用的，例如在定义自定义类的时候。

前面章节已经讲解过的有：
1. [Symbol.hasInstance](/ES/type-7-checking.html#instanceof)
1. [Symbol.toStringTag](/ES/type-7-checking.html#object-prototype-tostring-调用原理)
1. [Symbol.toPrimitive](/ES/type-9-conversion.html#对象转原始值的隐式转换)

更多系统Symbol可以查看[MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

## 总结

- Symbol()函数及其创建的 symbol 值可能对设计自定义类库的开发人员有用。
- symbol 值提供了一种自定义类可以创建私有成员的方式，并维护一个仅适用于该类的 symbol 注册表。
- 在类定义中，动态创建的 symbol 值将保存到作用域变量中，该变量只能在类定义中私有地使用。或者使用Symbol注册表创建全局Symbol，便于在其它类中共享。
- JavaScript 使用了许多系统 Symbol，这些 Symbol 可以作为 Symbol.* 访问。我们可以使用它们来改变一些内置行为。
- Symbol 不是 100% 隐藏的。有一个内置方法 Object.getOwnPropertySymbols(obj) 允许我们获取所有的 Symbol。还有一个名为 Reflect.ownKeys(obj) 的方法可以返回一个对象的 所有 键，包括 Symbol。所以它们并不是真正的隐藏。

## 参考链接

[MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
[MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)
[Symbol 类型](https://zh.javascript.info/symbol)