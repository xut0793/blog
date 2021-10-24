# 类型声明 type declaration

> - TypeScript是一种带有**类型语法**的JavaScript
> - TypeScript 中的类型系统要求：显式**声明**部分类型，然后在编译时会推导余下类型，并在编译时检查类型
> - 类型指的是一系统值以及可以对值执行的一系列操作。[P26]
> - 类型系统指的是TS所有类型以及所有类型可执行的操作组成的一系列规则。

类型声明，也可以叫类型注解。

类型声明基本语言格式：`value: type`

其中`type`可以声明哪些类型呢？
- 与 JS 对应的基础类型：`boolean` `number` `bigint` `string` `symbol` `undefined` `null`
- 与 JS 对应的引用类型：`object` `array` `function`
- TS 新增的类型： `enum` `tuple` `unknown` `any` `never` `void`
- 字面量类型(type literal)，以及 `unique symbol`


```
                                                             +---------+
                                                             | unknown |
                                                             +----+----+
                                                                  |
                                                                  v
                                                             +----v----+
                                                             |   any   |
                                                             +----+----+
                                                                  |
                                                                  v
     +------------+----------------------+-----------+-------------------------+------------+---------------------+
     |            |                      |           |            |            |            |                     |
     v            v                      v           v            v            v            v                     v
+----+---+   +----+----+            +----+----+  +---+-----+  +---+-----+  +---+-----+  +---+-----+          +----+----+
|  null  |   |  void   |            | boolean |  | string  |  | number  |  | bigint  |  | symbol  |          | object  |
+----+---+   +----+----+            +----+----+  +---+-----+  +---+-----+  +---------+  +----+----+          +----+----+
     |            |                      |           |            |                          |                    |
     |            |                      |           |            |                          |                    +-----------+--------------+
     |            |                      |           |            |                          |                    |           |              |
     |            v                      |           v            v                          v                    v           v              v
     |      +-----+-----+                |       +---+-----+  +---+-----+               +----+----+          +----+----+  +---+-----+  +-----+------+
     |      | undefined |                |       | string  |  | number  |               | unique  |          |  array  |  | function|  | constuctor |
     |      +-----+-----+                |       |  enum   |  |  enum   |               | symbol  |          +----+----+  +---+-----+  +-----+------+
     |            |                      |       +---+-----+  +---+-----+               +----+----+               |           |              |
     |            |                      |           |            |                          |                    v           |              |
     |            |                      |           |            |                          |                +---+-----+     |              |
     |            |                      |           |            |                          |                |  tuple  |     |              |
     |            |                      |           |            |                          |                +---+-----+     |              |
     |            |                      |           |            |                          |                    |           |              |
     v            v                      v           v            v                          v                    v           v              v
     +------------+----------------------+-----------+---------------------------------------+--------------------+-----------+--------------+
                                                                  |
                                                                  v
                                                              +--------+
                                                              |  any   |
                                                              +--------+
                                                                  |
                                                                  v
                                                              +--------+
                                                              | never  |
                                                              +--------+
any 即是 top type 也是 bottom type
unknown 是 top type
never 是 bottom type
```

## 字面量类型 type literal

字面量类型指仅表示一个值的类型。

## boolean

boolean 类型有两个值：`true` `false`。该类型的值可以比较，如常见的逻辑运算和条件运算。
```ts
let b = false           // 不显示注解，让 TS 推导出值类型为 boolean
const c = true          // 不显示注解，让 TS 推导出值类型为具体的字面量类型值 true
let d: boolean = true   // 显示注解，明确告诉 TS 值类型为 boolean
let e: true = true      // 显示注解，明确告诉 TS 值类型为字面量类型 true
let f: true = false     // 赋值类型与声明类型不同，则报错 Error TS2322: Type 'false' is not assignable to type 'true'
```

## number

number 类型的值包括所有数字：整数、浮点数、正数、负数、Infinity、NaN 等。可以进行的操作包括算术运算、条件运算、逻辑运算等。

```ts
let a = 1234            // 不显示注解，让 TS 推导出值类型为 number
const c = 5678          // 不显示注解，让 TS 推导出值类型为具体字面量类型值 5678
let e: number = 100     // 显示注解，明确告诉 TS 值类型为 number
let f: 26.18 = 26.18    // 显示注解，明确告诉 TS 值类型为字面量类型 26.18
let g: 26.18 = 10       // 赋值类型与声明类型不同，则报错 Error TS2322: Type '10' is not assignable to type '26.18'
let d = a < c           // 不显示注解，进行逻辑运算，TS 推导出 d 类型为 boolean

let decimal_literal: number = 20
let binary_literal: number = 0b10100    // 二进制表示 20
let octal_literal: number = 0o24        // 八进制表示 20
let hexadecimal_literal: number = 0x14  // 十六进制表示 20
let oneMillion = 1_000_000              // ES 最新特性，对较长数字，为了方便辨识数字，可以数字分隔符。
let twoMillion: 2_000_000 = 2_000_000   // TS 可以在类型和值的位置上都使用数字分隔符。


let notANumber: number = NaN
let infinityNumber: number = Infinity
```

## bigint

bigint 是 ES 新引入的类型，在数值后面加`n`来表示。在处理较大的整数时，不用再担心传入误差。number 类型表示整数的最大值为 2^53，bigint 能表示的数值比这大的多。
bigint 类型包含所有 BigInt 数，支持的操作同 number，如算术运算、条件运算、逻辑运算等。
```ts
let a = 1234n           // 不显示注解，让 TS 推导出值类型为 bigint
const b = 5678n         // 不显示注解，让 TS 推导出值类型为具体字面量类型值 5678n
let e = 88.5n           // Error TS1353: A bigint literal must be an integer
let f: bigint = 100n    // 显示注解，明确告诉 TS 值类型为 bigint
let g: 100n = 100n      // 显示注解，明确告诉 TS 值类型为字面量类型 100n
let h: bigint = 100     // 赋值类型与声明类型不同，则报错 Error TS2322: Type '100' is not assignable to type 'bigint'

let c = a + b           // 不显示注解，进行算术运算，TS 推导出 d 类型为 bigint
let d = a < 1235        // 不显示注解，进行逻辑运算，TS 推导出 d 类型为 boolean
```

## string

string 包含所有字符串，以及可对字符串进行的操作，如拼接`+ / join`、切片 `slice/split/substring`等方法。
```ts
let a = 'hello'           // 不显示注解，让 TS 推导出值类型为 bigint
const c = 'world'         // 不显示注解，让 TS 推导出值类型为具体字面量类型值 5678n
let d: string = 'zoom'    // 显示注解，明确告诉 TS 值类型为 bigint
let f: 'john' = 'john'    // 显示注解，明确告诉 TS 值类型为字面量类型 100n
let g: 'john' = 'zoe'     // 赋值类型与声明类型不同，则报错 Error TS2322: Type '100' is not assignable to type 'bigint'
let h = a + c             // 不显示注解，进行字符串操作，TS 推导出类型为 string
let i = d.slice(0, 3)     // 不显示注解，进行字符串操作，TS 推导出类型为 string
```

## symbol

symbol 是一个相对较新的语言特性，由最新的 ES2015 引入。其实，symbol 类型不太常用，其中一种场景是经常用于代替对象的字符串键。任何一个独立的 symbol 类型都是不相等的。可以对 symbol 类型执行的操作没有多少。
```ts
let a = Symbol()               // 不显示注解，让 TS 推导出值类型为 symbol          
let b = Symbol('b')            // 不显示注解，让 TS 推导出值类型为 symbol
let c: symbol = Symbol('b')    // 显示注解，明确告诉 TS 值类型为 symbol
let c = a === b                // false 进行比较运算，TS 推导类型为 boolean
let d = a + 'x'                // Error TS2469: The '+' operator cannot be applied to type 'symbol'
```
同上述基本类型一样，symbol 类型也可以声明为字面量类型，但它不是特定的 symbol 的值，而是 `unique symbol` 类型。
```ts
const e = Symbol()                  // 不显示注解，const 定义变量，TS 推导出值类型为 unique symbol
const f: unique symbol = Symbol()   // 显示注解，明确告诉 TS 值类型为 unique symbol
let g: unique symbol = Symbol()     // 显示注解 unique symbol 类型的变量，必须用 const 声明。Error TS1322: A variable whose type is a 'unique symbol' type must be 'const'
let h = e === e                     // true  unique symbol 类型值始终只与自身相等
let i = e === f                     // fakse 任何一个独立的 symbol 类型都是不相等的。Error TS2367: This condition will always return 'false' since the types 'unique symbol' and 'unique symbol' have no overlap.
```

## any

any 类型的值就像常规的 JS 一样，any 包含所有值，以及所有对值的操作，类型检查器完全发挥不了作用。
在 TS 自动推导过程中，如果无法确定类型是什么，默认为 any 类型。

默认情况下， TS  很宽容，在推导出类型为 any 时不会报错。如果想让 TS 遇到隐式 any 类型时报错，需要在`tsconfig.json`中启用 `noImplicitAny: true`，或者直接开启 `strict: true`。此时，如果 TS 推导出值类型为 any 时，将抛出运行时异常，在编辑器中显示为一条红色波浪线，如果需要解决报错，可以显式注解为 any 类型。

我们应该尽量让 TS 的类型检查起作用，所以尽量避免使用 any 类型。

## unknown

unknown 类型值包含任何值，支持的操作包含逻辑运算、条件运算、typeof、instanceof 运算符。

如果你确实无法预知一个值的类型，不要使用 any 类型，应该使用 unknown 类型，它是一个 top type。

any 与 unknown 比较：
- 相同点：都表示任何值
- 不同点：
  - TS 不会把任何值自动推导为 unknown，使用时必须显式注解
  - 对 unknown 类型的值执行其它操作时，TS 会要求你明确值值为某种特定的类型
```ts
let a: unknown = 30  // 显示注解，明确告诉 TS 值类型为 unknown
let b = a === 30     // true 支持逻辑运算
let c = a + 10       // Error TS2571: Object is of type 'unknown'

if (typeof a === 'number') { // 类型细化，TS 将推导 a 类型为 number
  let d = a + 10     // TS 推导 d 为 number
}
```

## null undefined void never

null 类型只有一个值`null`，undefined 类型只有一个值 `undefined`。

JS 在使用时往往不区分二者，但是它们在语义上有细微差别：
- undefined 表示尚未定义，通常表示声明了变量，但是尚未赋值
- null 表示缺少值，如计算一个值的过程中遇到错误时，则变量的值会被定义为 null

另外，TS 中增加了 void 和 never 类型。这两个类型在 TS 中有明确的特殊作用，将进一步划分“不存在”的情况：
- void 表示函数没有显式 return 返回任何值时
- never 表示函数根本不返回值时的情形，比如函数体内部执行抛出异常，或者函数死循环时。

```ts
// 显示 retrqn 返回一个数字或 null 的函数
function a(x: number) {
  return x < 10 ? x : null
}

// 显式 return 返回 undefined
function b() {
  return undefined
}

// 没有显式 return，所以函数返回 void 类型
function c() {
  let a = 2 + 2
}

// 抛出异常，函数返回 never 类型
function d() {
  throw TypeError('always error')
}

// 死循环，函数返回 never 类型
function e() {
  while(true) {
    console.log('do something')
  }
}
```

### never 类型的几个特点：
1. 在一个函数中调用了返回 never 的函数后，之后的代码都会变成 deadcode
```ts
// 抛出异常，函数返回 never 类型
function d() {
  throw TypeError('always error')
}
function test() {
  d();    // 这里的 d 是返回 never 的函数
  console.log(111);  // Error: 编译器报错，此行代码永远不会执行到
}
```
2. never 是所有类型的子类型，可以赋值给任何类型，在任何地方都可以使用 never 类型的值。never 类型的值在值层面基本很少使用，但在类型层面，常用于工具类型的编程中。
```ts
type result = never | T // result 为 T
type result = 1 & 2 // resuslt 为 never
type result = never & T // result 为 never
```
3. 同时因为 never 是一个兜底类型，其它任何类型赋值给 never 类型都会报编译错误，利用这点，在类型检查的全面性检查（穷尽性检查）中可以提高代码的键壮性。
> [TypeScript中的never类型具体有什么用？](https://www.zhihu.com/question/354601204)

```ts
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
  // 在 switch 当中判断 type，TS 会进行类型缩窄 (discriminated union)
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      const exhaustiveCheck: never = val
      break
  }
}

/**
 * 注意在 default 里面我们把被收窄为 never 的 val 赋值给一个显式声明为 never 的变量。如果ALL 类型被穷尽，那么这里应该能够编译通过。
 * 但是假如后来有一天你的同事改了 All 的类型：type All = Foo | Bar | Baz
 * 然而他忘记了在 handleValue 里面加上针对 Baz 的处理逻辑，这个时候在 default 分支里面 val 会被收窄为 Baz，导致无法赋值给 never，产生一个编译错误。
 * 所以通过这个办法，你可以确保 handleValue 总是穷尽 (exhaust) 了所有 All 的可能类型。
 */
```

总结：
- 任何类型都可以赋值给 any 类型，any 类型也可以赋值给其它类型，在 TS 类型系统中，any 类型既是 top type 也是 bottom type。
- unknown 包含任何值，是其它类型的父类型，属于 top type。`unkonw | T` 类型拓宽为 `unknown`，`unknown & T`类型缩窄为 `T`。
- never 类型是其它类型的子类型，这意味着 never 类型可赋值给其它任何类型，但是任何类型都不可以赋值给 never 类型，所以它是 bottom type 兜底类型。所以 unknown 类型与其它类型的联合类型会被拓宽为 unkonwn，即 。 `never | T` 类型拓宽为 `T`，`never & T`类型缩窄为 `never`。
- null 表示缺少值
- undefined 表示尚未赋值
- void 没有显式return 语句的函数返回值类型
- never 永不返回的函数返回值类型

## array

TS 支持两种注解数组类型的类型语法：`T[]`和`Array<T>`，因为 `Array<T>`与JSX语法类似，为避免混淆，建议使用`T[]`，并且更简洁。

数组类型应该保持同质，也就是说保证数组中的每个元素都具有相同的类型。不然，在实际代码中需要做很多额外的工作，才能让 TS 的类型检查是安全的。

```ts
let a = [1,2,3] // TS 推导类型为 number[]
let b = ['a', 'b'] // TS 推导类型为 string[]
let c = [1, 'a'] // TS 推导类型为 (string | number)[]
const d = [2, 'a'] // 与声明基本类型不同，使用 const 声明引用类型时，不会进行类型缩窄，所以TS 推导类型为 (string | number)[]
let e: string[] = [1, 2] // 显式声明类型为 string[]

/**
 * 初始声明数组时使用元素为字符串，TS推导该数组为字符串数组，当尝试非字符串元素操作时将报错
 */
let f = ['red'] // TS 推导类型为 string[]
f.push('blue')
f.push(true) // Error TS2345: Argument of type 'true' is not assignable to parameter of type 'string'

/**
 * 初始化空数组时，TS 不知道数组中元素的类型，所以推导出类型为 any[]
 * 当向数组中添加元素后，TS 开始拼凑数组的类型，当离开数组定义的作用域后，TS 将会确定一个最终的类型，不再扩张。
 */
function initArray() {
  let g = []  // TS 推导类型为 any[]
  g.push(1)   // TS 推导类型为 number[]
  g.push('red') // TS 推导类型为 (string | number)[]
  return g
}
let arr = initArray() // arr 为 (string | number)[]
arr.push(true) // Error TS2345: Argument of type 'true' is not assignable to parameter of type 'string | number'

let h: number[] = [] // 显式声明类型为 number[]
h.push(1)
h.push('red') // Error TS2345: Argument of type 'red' is not assignable to parameter of type 'number'

/**
 * 对于非同质化数组 let c = [1, 'a']
 * 在使用时需要进行额外的判断
 */
c.map((i) => {
  if (typeof i === 'number') {
    return i * 3
  }
  return i.toUpperCase()
})
```

## tuple

tuple 元组是 array 类型的子类型，是定义数组的另一种方式。与数组的区别：
- 元组的长度固定或者说有最小长度，各索引位置上的元素具有固定的已知类型。
- 元组必须显式声明类型。这是因为创建元组的句法与数组相同，都是使用方排号，但是有细微差别。`[T]`，不同于数组的`T[]`。

```ts
let a: [number] = [1]
let b: [string, string, number]: ['a', 'b', 1]
b = ['c', 'e', 'd', 2] // 元组第3个位置元素的类型是number，此时赋值 'd'，报错 Error TS2322: Type 'string' is not assignable to type number
```
元组也支持可选元素，使用 `?` 表示可选。
```ts
let c: [number, number?] = [1, 2]
c = [1] // 不会报错
```
元组也支持剩余元素，即为元组定义最小长度。
```ts
// 字符串列表，至少有一个元素
let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chole']

// 元素类型不同的列表
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b']
```

元组类型能正确定义元素类型不同的列表，还能知晓该列表的长度，这些特性使得元组比数组更安全，应该经常使用。

### 只读数组和元组

常规的数组是可变的，比如可以使用 `push / splice` 改变数组，如果有时我们希望数组不可变，该数组只能使用无副作用的操作（即操作之后得到新数组，原数组没有变化，如可以使用 concat slice 方法，但不能使用 push splice 方法）。

只读数组或元素要求显式声明：
```ts
let a: readonly number[] = [1, 2, 3]
a[3] = 5  // Error TS2342: Index signature in type 'readonly number[]' only permits reading
a.push(4) // Error TS2339: Property 'push' does not exist on type 'readonly number[]'

let b = a.concat(4) // number[]
```

```ts
let a: readonly [string, ...number[]] = ['a', 2, 3]
a.push(4) // Error TS2339: Property 'push' does not exist on type 'readonly [string, ...number[]]'
```

缺点：只读数组不可变的特性能让代码更易于理解，不过其背后提供支持的仍然是常规的 JS 数组。这意味着，即使只是对数组小小的改动，也要先复制整个原数组，如有不慎，就会影响应用的运行性能。对于小型数组来说影响比较小，但是对于大型数组可能会造成极大的影响。

## enum

枚举的作用是列举类型中包含的各个值，相比较于数组这种有序数据结构，枚举是一种无序数据结构，把键映射到值上。

按照约定：枚举名称为首字母大写的单数形式，枚举中的键也为大写。

枚举分为两种：
- 字符串枚举：字符串到字符串之间的映射
- 数字枚举：字符串到数字之间的映射

### 字符串枚举

```ts
enum Color {
  Red = '#c10000',
  Blue = '#007ac1',
}
let red = Color.Red       // Color
let blue = Color['Blue']  // Color
let green = Color.Green // Error TS2339: Property 'Green' does not exist on type 'typeof Color'
```
字符串枚举是 string 的子类型，所以以下代码不会报错
```ts
let red: string = Color.Red
```

### 数字串枚举
```ts
enum Day {
	Sun,
	Mon,
	Tue,
	Wed,
	Thu,
	Fri,
	Sat
}
```
对于数字检举，TS 会自动为枚举中的各个成员推导为对应的数字，默认第一项索引值为 0，后续递增。也可以自定义每项索引值，未定义的项以前一项索引值为基准+1。

同时也会对枚举值到枚举名进行反向映射，所以在访问检举时可以像对象一样引用值，返回索引。也可以像数组一样用索引取。

```ts
console.log(Day.Sun) // 0
console.log(Day['Mon]) // 1
conssole.log(Day[0]) // Sun
```
数字枚举是 number 的子类型，所以以下代码不会报错
```ts
let sun: Day = Day.Sun
let mon: number = Day.Mon
let tue: string = Day[2]
```

### 数字枚举存在的问题：
1. 当使用索引访问时，超出范围的索引值不会报错 `let noexit = Day[10]`
2. 手动赋值的索引值，可能会与递增计算出来的索引重复，此时 typescript 也不会报错
```ts
enum Days {
	Sun = 3,
	Mon = 1,
	Tue,
	Wed,
	Thu,
	Fri,
	Sat
}
console.log(Days['Sun'] === 3) // true
console.log(Days['Wed'] === 3) // true
console.log(Days[3] === 'Sun') // false
console.log(Days[3] === 'Wed') // true

// 从 Tue 开始自动递增到 3 的时候与前面的 Sun 的取值重复了，但是 TypeScript 并没有报错，导致 Days[3] 的值先是 "Sun"，而后又被 "Wed" 覆盖了。
```
为了避免这种不安全的索引访问，可以通过 `const enum` 指定使用枚举的安全子集。

### const enum

const 声明枚举的特点：
1. `const enum` 不允许反向访问，即不允许数字枚举通过索引访问键
```ts
const enum Language {
  Chinese,
  Englist,
  Spanish,
  Russian,
}
let a = Language.Chinese
let b = Language[0] // Error TS2476: A const enum member can only be accessed using a string literal.
let c = Language[10] // Error TS2476: A const enum member can only be accessed using a string literal.
```
2. `const enum` 默认不会生成任何 JS 代码，而是在用到枚举成员的地方直接使用对应的值。

```ts
enum Color {
  Red = '#c10000',
  Blue = '#007ac1',
}
let red: string = Color.Red
let blue = Color.Blue

// 编译后的 JS代码
"use strict";
var Color;
(function (Color) {
    Color["Red"] = "#c10000";
    Color["Blue"] = "#007ac1";
})(Color || (Color = {}));
let red = Color.Red;
let blue = Color.Blue;
```
```ts
enum Day {
	Sun,
	Mon,
	Tue = 5,
	Wed,
	Thu,
	Fri,
	Sat
}

// 编译后的 JS 代码
"use strict";
var Days;
(function (Days) {
    Days[Days["Sun"] = 3] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
console.log(Days['Sun'] === 3); // true
console.log(Days['Wed'] === 3); // true
console.log(Days[3] === 'Sun'); // false
console.log(Days[3] === 'Wed'); // true
```
但如果是 `const enum`，则不生成 JS 代码
```ts
const enum Language {
  Chinese,
  Englist,
  Spanish,
  Russian,
}
let a = Language.Chinese

// 编译后的 JS 代码
let a = 0 /* Chinese */;
```
3. 但是 `const enum` 定义数字枚举时还有一个缺陷。数字枚举中一个讨厌的超范围的数组就会让整个枚举处于不安全的境地。
```ts
const enum Language {
  Chinese,
  Englist,
  Spanish,
  Russian,
}

function lang(l: Language) {
  return 'executed'
}
lang(Language.Chinese)
lang(12) // 不存在的数字，没有提示报错。

// 编译后的 JS 代码
function lang(l) {
    return 'executed';
}
lang(0 /* Chinese */);
lang(12);
```
由于使用枚举容易导致安全问题，所以建立远离枚举。同样的意图，在 TS 中有其它更好的方式表达。如果坚持使用枚举，应该在只枚举中使用`const enum` 定义的字符串枚举，既安全又不产生冗余的运行时代码。可以在 ts-eslint 中制定发现数字枚举和非 const 枚举时提示。

```json
// https://juejin.cn/post/6844904190213390343
{
  "no-restricted-syntax": [
    "error",
    // 默认的
    // ...
    // 必须使用 const enum
    {
      "selector": "TSEnumDeclaration:not([const=true])",
      "message": "Don't declare non-const enums"
    }
  ]
}
// 这里要注意：
// 需要把默认的其他限制语法也加上，不然被当前的覆盖了，获取默认值的步骤是：
// 1. npx eslint --print-config src/index.ts > eslintrc.log (src/index.ts可以是项目中的其他文件）
// 2. 在eslintrc.log里搜索no-restricted-syntax, 复制默认值即可
```

数字枚举与字符串枚举的区别：
- 数字枚举的索引值默认以前一枚举值递增，并且可以反向映射，即通过索引值访问。
- 字符串枚举不能反向映射。

const enum 与常规枚举的区别：编译后是否产生运行时的 JS 代码。

## object

基于上面 string number boolean 等类型的注解方式，如果要表示对象类型，我们可能很自然地就会想到这样注解对象：
```ts
let obj: object = {
  a: 'x'
}
```
唉，我们发现这是一个正确类型语法，因为 TS 并没有报错。但是当我们访问对象键值时：
```ts
obj.a // Error TS2339: Property 'a' does not exist no type 'object'
```
使用 `object` 声明对象类型时，访问对象属性时，TS 会报错提示该声明的类型并没有 `a` 属性，可我们明明赋值了对象一个 `a` 属性呀，这是怎么回事。

对于这个报错，是因为 TS 的类型系统采用的设计风格是结构化类型(Structural type)，而不是名义化类型(Nominal type)，TS 是直接沿用 JS 对象所采用结构化类型的设计风格。
> 结构化类型是一种编程设计风格，它只关心对象有哪些属性，而不管属性使用什么名称。只要两个对象的结构所描述的属性值的类型是兼容的，就认为两个对象类型是兼容的。
> 结构化类型也被称为照鸭子类型（duck typing），指的是当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。
> 名义化类型表示类型若要相等，就必须具有相同的“名字”

把一个值声明为 `object` 类型，该类型并没有描述该对象有哪些属性，它只用业判断这个变量是一个 JS 引用类型（如对象、数组、函数等），而不是 JS 基础类型（null string 等）。

```ts
let a:object

// 赋值引用类型都不会提示报错
a = {}
a = []
a = function () {}
a = new String()

// 赋值基本类型都会报错：
a = 1           // Error TS2322: Type 'number' is not assignable to type 'object'.
a = null        // Error TS2322: Type 'null' is not assignable to type 'object'.
a = undefined   // Error TS2322: Type 'undefined' is not assignable to type 'object'.
a = Symbol()    // Error TS2322: Type 'symbol' is not assignable to type 'object'.

// 赋值对象虽然不会报错，但在访问对象属性时会报错
a = {b: 'x'}
a.b             // Error TS2339: Property 'b' does not exist no type 'object'
```

除此之外，别无它意，所以在访问属性时，TS 会报错提示。

但如果在 TS 中不显式注解对象类型，让 TS 的类型推导机制自动推导对象的类型：
```ts
let obj = {
  a: 'x'
}

let value = obj.a
```
此时 TS 没有报错，因为TS能自动推导出 obj 的类型为 `{a: string}`。该类型称为对象字面量类型（与基类型的字面量类型不要搞混淆）。据此，我们也可以声明对象时直接明确对象的对象字面量类型：
```ts
let obj: { a: string} = {
  a: 'x'
}
```
如果把对象字面量类型提取出来，用来定义一个类型别名，然后使用类型别名注解对象声明。
```ts
type Obj = {
  a: string,
}
let obj: Obj = {
  a: 'x',
}

obj.a // 不会报错了。
```

对象字面量类型有一个特例：空对象类型 `{}`，除了 `unll / undefined` 外，任何类型都可以赋值给空对象类型。
```ts
let d: {}
d = {}
d = {x: 1}
d = []
d = 2
d = 'a'
d = null      // Error TS2322: Type 'null' is not assignable to type '{}'.
d = undefined // Error TS2322: Type 'undefined' is not assignable to type '{}'.
```
另一种声明对象类型方式：`Object`，它基本与空对象类型 `{}`表现一致，除了 `unll / undefined` 外，任何类型都可以赋值给空对象类型。

但是仍有些细微的差别：使用 `{}`时，可以把 Object 原型内置的方法定义为任何类型，但声明为 `Objectd` 类型时，对原型内置方法声明的类型必须是兼容该方法内置的类型。

```ts
let a: {} = {
  toString() {
    return 3 // toString 内置的返回值应该是字符串，此时重定义为返回数值3, 能通过 TS 的类型检查
  }
}

let b: Object = {
  toString() {
    return 3 // Error TS2322: Type 'number' is not assignable to type 'string'
  }
}
```

总结对象类型的声明方式：
- 对象字面量，可以直接写在变量的冒号后面，也可以使用 type 定义类型别名。推荐使用
- 空对象类型 `{}`，除了 `unll / undefined` 外，任何类型都可以赋值给空对象类型。尽量避免使用
- object 类型，无法描述对象的结构，只能表示变量是一个 JS 引用类型（object / array / function），而不是 null/number 等其它基础类型。并且该对象不能作任何操作。尽量避免使用
- Object 类型，同空对象类型，尽量避免使用。

### 只读属性 readonly

使用 `const` 来声明变量的值为一个基类时，可以让变量值只能读不能改。但直接使用 const 声明变量为对象，只约束了该变量不能重新被赋值，但对象中的属性仍然可以操作，如果要限制对象的属性只能读不能改，则需要使用 `readonly` 修饰符来声明对象中属性的类型。
```ts
const name: string = 'tom'
name = 'jerry' // 报错

type Obj = {
  a: string,
}
const obj: Obj = {
  a: 'x',
}
obj = {a: 'y'} // 报错
obj.a = 'y' // 正常访问

// readonly 约束对象属性只读不写
type Obj = {
  readonly a: string
}
const obj:Obj = {
  a: 'x'
}
obj.a = 'y' // 报错
```

## 可选属性

默认情况下，TS 对对象的属性要求十分严格，如果声明对象的类型结构中只有 string 类型的属性 a，那在对象赋值时如果缺省属性a，或者多了其它属性时，TS 都将报错。

如果需要声明某个属性是可选的，即可有可无时，可以使用 `?` 修饰符来声明该属性类型。可选属性值的为联合类型 ` T | undefined`。

```js
type Obj = {
  a: string,
  readonly b: number,
  c?: number, // 此时 c 属性类型即可以是 number 类型，也可以为 undefined 类型。
}

const obj1: Obj = {a: 'tom', b: 1}
const obj2: Obj = {a: 'tom', b: 1, c: undefined }
```

## 索引签名

如果对象有更多的属性，应该如何声明呢？就需要使用 TS 的索引签名
```ts
type Obj = {
  a: string,
  [K: number]: boolean,
}
```
`[K: T]: U` 句法称为索引签名，表达的意思是，在这对象在，类型为 T 的键对应的值为 U 类型。但键的类型 T只能是 `number | string | symbol`，因为对象只允许这三种类型的值作为键名。

通过这种方式指定的对象就可以有更多属性。
```ts
let a: Obj
a = {a: 'a'}
a = {a: 'a', 10: true}
a = {a: 'a', 10: true, 20: false}
a = {a: 'a', 10: true, 20: false, 30: 'red'} // Error TS2741: Type 'string' is not assignable to type 'boolean'
a = {10: true} // Error TS2741: Property 'b' is missing in type '{10: true}'
```