# 函数 function

一个函数包括几部分：函数名、参数、函数体、返回值。
对函数的使用分也为两个步骤：先声明函数，再调用函数。

## 注解函数

TS 对函数进行类型注解主要在函数声明这一步，并且只对函数参数和返回值进行类型注解。结合函数声明的几种方式，TS 对函数注解如下：
```ts
// 具名函数
function sum(a: number, b: number): number { return a + b }

// 函数表达式
const sum = function(a: number, b: number): number { return a + b }

// 箭头函数表达式
const sum = (a: number, b: number) => a + b
```

在函数调用时，无需提供任何额外的类型信息，直接传入实参即可，TS 会检查实参是否函数形参注解的类型兼容。如果缺少参数或者传入参数类型有误，都会报错。
```ts
sum(1) // Error TS2554: Expected 2 arguments, but got 1
sum(1, 'a') // Error TS2345: Argument of type 'a' is not assignable to parameter of type 'number'
```
像上面例子，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？

## 可选参数

使用 `?` 表示可选的参数
```ts
function fullName(firstName: string, lastName: string, midName?: string): string {
	if (midName) {
		return `${firstName} ${midName} ${lastName}`
	} else {
		return `${firstName} ${lastName}`
	}
}
```
可选参数需要注意的一点是：**可选参数一定是放在必要参数后面。**
```ts
function fullName(firstName: string, lastName?: string, midName: string): string {
	// some code
}
// Error TS1016: A required parameter cannot follow an optional parameter
```
## 参数默认值

默认参数语法同 JS 一致，使用 `=` 赋值即可

```ts
function fullName(firstName: string, lastName: string = 'lin', midName?: string): string {
	if (midName) {
		return `${firstName} ${midName} ${lastName}`
	} else {
		return `${firstName} ${lastName}`
	}
}

fullName('tao')
```
## 剩余参数

像上面求和函数，如果我们需要对传入任意个数的数字进行求和输出，即函数参数数量不固定，此时如果声明形参类型呢。

在 ES6 之前要实现该需求，我们可以使用 `arguments` 变量来处理
```js
function sumVariable() {
  return Array.from(arguments).reduce((total, n) => total + n, 0)
}
sumVariable(1, 2, 3)
```
但如果上述代码在 TS 环境调用，则会报错`Error TS2554: Expected 0 arguments, but got 3.`

由于声明 `sumVariable` 函数时没有指定参数，因为在 TS 看来，该函数不接受任何参数，但调用时却传入了实参，所以会报错。

并且在函数体内，TS 对变量 `total` `n` 的推断类型都是 `any`，而不是预期的 `number`。

要解决这个问题，就需要使用剩余参数形式(rest parameter)。值层面的语法同 ES 的 rest 语法一样。
```ts
function sumVariable(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}
sumVariable(1, 2, 3)
```
剩余参数需要注意的一点是：**一个函数最多只能有一个剩余参数，并且必须位于最后一个参数**

```ts
function sumVariable(initalVal: number, ...numbers: number[]):number {
  return numbers.reduce((total, n) => total + n, initalVal)
}
```

## 注解this类型

在 JS 中的每个函数都有一个默认的无需声明的变量 `this`，它的值取决于函数的调用方式。
```js
let x = {
  a() {
    return this
  }
}
x.a() // x

// 如果在调用a函数之前重新赋值，this也将改变
let a = x.a
a() // 在浏览器端 this 将指向 undefined
```
正因为 this 如果脆弱和不安全，所以 TS 需要将此类隐患提前报错提示，有两种方案：
- 配置 tslint 规则 `no-invalid-this`，严禁在函数中使用this，除了在类方法和对象方法。
- tsconfig.json中设置`noImplicitThis: true` 或 `strict: true`，强制要求显式注解函数中 this 的类型。(同样此规则不会要求为类或对象方法注解this)

注解函数this的类型，**要求在函数的第一个参数指定this类型**，其它参数依次往后声明。

```ts
function fancyDate(this: Date) {
  return `${this.getFullYear()}/${this.getMonth()}/${this.getDate()}`
}
fancyDate.call(new Date)
fancyDate() // Error TS2684: The 'this' context of type 'void' is not assignable to method's 'this' of type 'Date'.
```
这样每次调用函数时，TS 将确保 this 总是符合预期，否则提前报错。

## 函数返回值类型

通常TS需要注解函数参数的类型，而返回类型不要求必须注解，TS 能推导出来返回值类型，但也可以显式注解。

函数返回值有两种特殊的类型： `void` `never`
- void 表示函数没有显式 return 返回任何值时
- never 表示函数根本不返回值时的情形，比如函数体内部执行抛出异常，或者函数死循环时。

```ts
// 显示 retrqn 返回一个数字或 null 的函数
function a(x: number): number | null {
  return x < 10 ? x : null
}

// 显式 return 返回 undefined
function b(): undefined {
  return undefined
}

// 没有显式 return，所以函数返回 void 类型
function c(): void {
  let a = 2 + 2
}

// 抛出异常，函数返回 never 类型
function d(): never {
  throw TypeError('always error')
}

// 死循环，函数返回 never 类型
function e(): never {
  while(true) {
    console.log('do something')
  }
}

// 在一个函数中调用了返回 never 的函数后，之后的代码都会变成 deadcode
function test() {
  d();    // 这里的 d 是返回 never 的函数
  console.log(111);  // Error: 编译器报错，此行代码永远不会执行到
}
```

## 调用签名

函数是一等公民，指的是函数可以值值一样作为参数或返回值。
```js
function uppercaseFirstLetter(str: string):string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 如何声明参数 `handler` 的类型？
function processor(arg: string, handler): string {
  return handler(arg)
}

// 如何声明 `getStringProcessor` 返回值类型呢？
function getStringProcessor(arg: string) {
  return typeof arg === 'string' ? uppercaseFirstLetter : null
}
```
对一个函数，我们可以像 `uppercaseFirstLetter` 一样进行类型注解。但如果函数是作为参数传递，如何声明参数 `handler` 的类型？如果函数作为返回值，如何声明 `getStringProcessor` 返回值类型呢？

此时就需要使用函数调用签名，也称为函数的类型签名，它是 TS 用来表示函数整体的类型语法。

比如上述 `uppercaseFirstLetter` 函数可以描述为是一个接爱一个 string 参数，并返回 string 的函数。在 TS 中用调用签名来表示该函数的整体类型：
```ts
(str: string) => string
```
可以看到调用签名的句法跟箭头函数非常相似，这是有意为之的。

调用签名的特点：
- 调用签名只包含类型层面的代码，即只有类型，没有值。
- 调用签名常用于函数作为参数或返回值的情形，以及重载函数。
- 调用签名中必须显式注解返回值类型，因为其中没有函数体的定义，TS 无法推导类型的返回类型。
- 调用签名中无法声明参数默认值，因为调用签名只是类型层面代码，它可以表达出函数的参数类型，包括可选参数、剩余参数、this参数，但不能声明值层面的代码，即参数默认值。

所以上述代码可以这样进行函数参数的注解：
```ts
function processor(arg: string, handler: (str: string) => string): string {
  return handler(arg)
}

function getStringProcessor(arg: string):((str: string) => string) | null {
  return typeof arg === 'string' ? uppercaseFirstLetter : null
}
```

为避免重复调用签名的代码，可以使用 type 定义类型别名（后面的类型编程章节会讲解）。
> 它相当值层面代码中的 let const 声明变量一样，在类型层面使用 type 来声明一个变量来作为某个类型的别名

```ts
type Handler = (str: string) => string

function processor(arg: string, handler: Handler): string {
  return handler(arg)
}

function getStringProcessor(arg: string): Handler | null {
  return typeof arg === 'string' ? uppercaseFirstLetter : null
}
```
`type`定义调用签名除了上面这种简写形式，也可以使用完整形式：
```ts
// 简写形式：当只有一个调用签名时使用更简洁
type Handler = (str: string) => string

// 完整形式：可以定义多个调用签名，如函数重载时
type Handler = {
  (str: string): string
}
```

## 重载函数

重载函数指的是有多个调用签名的函数。

```ts
/**
 *根据函数的声明方式不同：函数表达式和具名函数，对应的函数重载签名的句法也不同
 */

// 函数表达式的形式时，声明重载函数，定义多个调用签名
type Reverse = {
  (arg: number): number,
  (arg: string): string,
}
// 实现调用签名
let reverse: Reverse = (arg: number | string): any => {
  if (typeof arg === 'number') {
    return Number(arg.toString().split('').reverse().join(''))
  } else {
    return arg.split('').reverse().join('')
  }
}

// 具名函数形式时，声明函数重载，其中前面两句声明函数调用签名，后面一个是调用签名的实现
function reverse(arg: number): number
function reverse(arg: string): string
function reverse(arg: number | string) {
  if (typeof arg === 'number') {
    return Number(arg.toString().split('').reverse().join(''))
  } else {
    return arg.split('').reverse().join('')
  }
}
```
### TS 调用签名重载机制：
- 函数重载可以分为两部分：声明函数的调用签名和实现函数的调用签名
- 在函数实现调用签名时注解的参数和返回值类型应该兼容每个调用签名中的类型，特别是声明了多个调用签名时，应该手动联合各个调用签名中对应位置的类型，根据联合类型进行类型拓宽后的作为结果。[P81]
- 函数实现的具体代码中要作好类型守卫的代码，TS 会做全面性检查，缺少时报错
- 在函数调用时，根据实参类型按声明顺序从上到下解析重载。

### 函数重载适用的情形

适用的情形：函数根据传入参数的不同会返回不同的类型时。

```ts
// 如果传入的参数不同，但是得到的结果（类型）却相同，可以使用可选参数代替。
function func (a: number): string
function func (a: string): number
function func (a: number | string ): string | number {
  // do something
}
```

函数重载的意义在于能够让你知道传入不同的参数得到不同的结果。
- 如果传入的参数不同，但是得到的结果（类型）却相同，那么可以不需要函数重载，可以使用可选参数代替。
- 如果函数的返回值类型相同，那么也不需要使用函数重载，可以使用联合类型的参数代替。

```ts
// 如果传入的参数不同，但是得到的结果（类型）却相同，可以使用可选参数代替。
function func (a: number): number
function func (a: number, b: number): number
function func (a: number, b: number | undefined): number {
  // do something
}

// 可选参数代替
function func (a: number, b?: number): number


// 如果函数的返回值类型相同，可以使用联合类型的参数代替。
function func (a: number): number
function func (a: string): number
function func (a: string | number): number {
  // do something
}

// 直接使用联合类型来代替
function func (a: number | string): number
```

## 函数的多态

函数重载的意义在于能够让你知道传入不同的参数得到不同的结果。但使用函数重载的前提是我们已经明确了该函数有哪些参数类型以及会返回哪些对应的类型。

那如果事先不知道需要什么参数类型，以及会返回哪些类型时，如何处理呢？

比如实现一个自定义的 filter 函数，迭代数组筛选出符合条件的元素。
```js
const filter = (arr, fn) => {
  let result = []
  for (let item of arr) {
    if (fn(item)) {
      result.push(item)
    }
  }
  return result
}
```
对于这个filter函数，我们无法预知传入的arr参数的类型，它可能是一个数字数组，也可能是字符串数组或者是对象数组，也就是说这个函数有多种形态，即使函数重载也不好穷尽所有的可能性。

但我们知道一些相关联的信息：
- 传入的 arr 元素是什么类型，那返回也必然是同样的元素类型
- fn 接收的是 arr 元素类型，返回一个布尔值类型

此时，如果我们用 `T` 表示 arr 数组元素的类型，那filter的调用签名可以这样表示
```ts
type Filter = <T>(arr: T[], fn: (T) => boolean) => T[]
```
上述表达的意思就像：因为我们事先不知道 filter 函数参数和返回值具体是什么类型，所以用 `T` 来表示这个未知的类型，可以理解 T 就是一个类型的占位符。
待 filter 函数调用时， TS 会从传入的 arr 中推导出 T 具体的类型，然后将 T 出现的每一处替换为推导出的类型，然后再执行类型检查。

```ts
/**
 * 类型别名 + 箭头函数表达式
 */
type Filter = <T>(arr: T[], fn: (T) => boolean) => T[]
const filter: Filter = (arr, fn) => {
  let result: T[] = []
  for (let item of arr) {
    if (fn(item)) {
      result.push(item)
    }
  }
  return result
}

// T 绑定为 number
filter([1,2,3], _ => _ > 2) // [3]
// 推导出 T 为 string
filter(['a', 'b'], _ => _ !== 'b') // ['a']
// 推导出 T 为 { firstname: string }
let names = [{firstname: 'betch'}, {firstname: 'xin'}]
filter(names, _ => _.firstname.startsWith('b')) // [{firstname: 'betch'}]
```

所以函数的多态问题可以使用泛型来解决。关于泛型更多内容可以查看[类型编程-泛型](4-type-programming.md)







