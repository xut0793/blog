# 类型注解

[[toc]]

我们先回顾下 ES 中七种数据类型分类：

-   基本数据类型：`Null` `Undefined` `Boolean` `Number` `String`，以及 ES6 新增的`symbol`
-   引用数据类型：`Object` (`Array` `Function` )

TS 中新增了以下几中类型：

-   元组: `Tuple`
-   枚举: `Enum`
-   描述类型：`Any` `Void` `Never`

那我们看看在`TS`中如何对这些数据类型进行类型注解的。

## 基本类型

### Null 和 Undefined

这个类型是 js 中也是比较特殊的。它们类型都具有唯一值。即`Null`类型的数据只可能被赋于`null`，`Undefined`类型值只可能被赋于`nudefined`

```js
let n = null
let u = undefined
```

在 TypeScript 中，也是使用 null 和 undefined 来定义这两个原始数据类型

```ts
let n: null = null
let u: undefined = undefined
```

此时，如果我们对已进行类型注解的变量赋值其它就会报错

```ts
// type.ts
let n: null = null
n = 1

let u: undefined = undefined
u = '1'
```

上面代码如果用 js 写是没有问题的。但是如果采用 ts 写，在书写时编译器就会提示错误。如果继续使用`tsc type.ts`编译就会报如下错误提醒我们。

```
type.ts:4:1 - error TS2322: Type '1' is not assignable to type 'null'.

4 n1 = 1
  ~~

type.ts:7:1 - error TS2322: Type '"1"' is not assignable to type 'undefined'.

7 u1 = '1'
  ~~

Found 2 errors.

C:\Users\Administrator\Desktop\ts-demo\example>
```

这就是`TS`类型注解的好处，配合编译器，在代码书写时或者代码编码时就提示潜在错误，不在等到程序运行时才发现错误。

> TS 编译会提示错误，但不是中断编译，仍然会将代码生成到.js 文件中。如果要阻止此行为，可要在添加配置选择`tsc type.ts --noEmitOnError`。项目中可以在 tsconfig.json 中配置。

### Boolean 布尔值

布尔值是最基础的数据类型，在 Typescript 中，使用 `boolean` 定义布尔值类型：

```ts
let isDone: boolean = false
```

### Number 数值

在 Typescript 中，使用 `number` 定义数值类型

```ts
let decimal_literal: number = 20
let binary_literal: number = 0b10100 // 二进制表示 20
let octal_literal: number = 0o24 // 八进制表示 20
let hexadecimal_literal: number = 0x14 // 十六进制表示 20
let notANumber: number = NaN
let infinityNumber: number = Infinity
```

### String 字符串

在 Typescript 中，使用 `string` 定义数值类型

```ts
let myName: string = 'Tom'
let myAge: number = 25
// ES6 模板字符串
let sentence: string = `Hello, my name is ${myName}, I'm is ${myAge} year old`
```

### Symbol

自 ES6 起，Symbol 成为了一种新的原生类型，表示独一无二的值，就像 Number 和 String 一样，属性于基本类型。

但在使用上有区别：

```js
// 在之前基本类型中，变量都直接采用字面量的形式赋值
let num: number = 1

//  Symbol类型值必须由Symbol()生成。
let sym = Symbol()
//并且每次调用Symbol()函数生成的值都是不相等的，即使传入函数参数一样。
// Symbol类型值由Symbol()生成，所以也无需像其它基本类型一样使用：进行类型注解。因为ts内部对Symbol()函数返回值已指定类型，就像我们后面讲到的在ts中函数的使用一样。
```

> Symbol 类型的学习可以参考阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/symbol)

## 引用类型

在 TypeScript 中，我们使用接口 `Interfaces` 来定义对象的类型。

接口（Interfaces）是一个很重要的概念，在这里先用接口满足我们对引用类型的类型注解。后面单独一节来详细了解下接口。

### Object 对象

用接口来注解一个对象类型

```ts
// 声明一个接口，使用关键字 interface
// 接口一般首字母大写，在有的编程语言中会建议接口的名称加上 I 前缀。 interface IPerson
interface Person {
	name: string
	age: number
}

let tom: Person = {
	name: 'Tom',
	age: 25
}
```

上面的例子中，我们声明了一个接口 Person，并且定义了它拥有一个 string 类型的属性 name，和一个 number 类型的属性 age。

接着定义了一个变量 tom，它的类型是 Person。这样，我们就约束了 tom 的形状必须和接口 Person 一致。

这样，在定义的变量比接口少了一些属性是不允许的：

```js
interface IPerson {
	name: string;
	age: number;
}

let tom: IPerson = {
	name: 'Tom'
}

// 编译器会提示报错，强制编译会输出如下错误信息
// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
// Property 'age' is missing in type '{ name: string; }'.
```

多一些属性也是不允许的：

```js
interface IPerson {
	name: string;
	age: number;
}

let tom: IPerson = {
	name: 'Tom',
	age: 25,
	gender: 'male'
}
// 编译器会提示报错，强制编译会输出如下错误信息
// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

可见，赋值的时候，变量的形状必须和接口的形状保持一致。

#### 可选属性

有时我们希望不要完全匹配一个形状，那么可以用可选属性：`?`

```ts
interface IPerson {
	name: string
	age?: number // 在属性名后面紧接 ? 表示该属性在实现时可有可无
}
let tom: IPerson = {
	name: 'Tom'
}
```

```ts
interface IPerson {
	name: string
	age?: number
}
let tom: IPerson = {
	name: 'Tom',
	age: 25
}
```

这时仍然不允许添加未定义的属性，解决这个问题可以使用定义接口的任意属性

#### 任意属性

有时候我们希望一个接口允许有任意的属性，可以使用如下方式：

```ts
interface IPerson {
	name: string
	age?: number
	[propName: string]: any // 使用 [propName: string] 定义了对象可以有一个字符串string类型命名key的任意属性。
}
let tom: IPerson = {
	name: 'Tom',
	gender: 'male'
}
```

需要注意的是，一旦在定义了任意属性的接口中，它的确定属性和可选属性的类型都必须是任意属性定义类型的子集：

```ts
interface IPerson {
	name: string
	age?: number
	[propName: string]: string
}
let tom: IPerson = {
	name: 'Tom',
	age: 25,
	gender: 'male'
}
// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

上例中，任意属性的值允许是 string，但是可选属性 age 的值却是 number，number 不是 string 的子属性，所以报错了。

#### 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性：

```ts
interface IPerson {
	readonly id: number
	name: string
	age?: number
	[propName: string]: any
}
let tom: IPerson = {
	id: 89757,
	name: 'Tom',
	gender: 'male'
}
tom.id = 9527
// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，使用 readonly 定义的属性 id 初始化后，又被赋值了，所以报错了。

注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候：

```TS
interface IPerson {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}
​
let tom: IPerson = {
    name: 'Tom',
    gender: 'male'
};
​
tom.id = 89757;
​
// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

**总结一下**
`Typescript`使用接口`interface`来对引用对象进行类型注解，并介绍了接口声明中可选属性、任意属性、只读属性的规则。

上面只是用接口对对象类型进行约束，下面我们再学习引用类型中其它几个类型（Array、Function）如何使用接口进行类型注解。

### Array 数组

用接口对数组进行类型注解

```ts
interface INumberArray {
	[index: number]: number
}

let arr: INumberArray = [1, 1, 2, 3, 5]
```

接口 INumberArray 表示一个可索引接口：索引 key 为 number 类型，索引值为 string 类型。

**引申下两点：**

-   上面定义的可索引接口 INumberArray，其时也可以用于定义一个对象

```ts
let obj: INumberArray = {
	1: 'hello',
	2: 'world'
}
```

因为 obj 的实现完全符合接口 INumberArray 的定义。用在数组上，是因为数组隐含的 index 就是 number 类型。

-   除了上面形式的可索接口，还有一种叫**类类型接口**，用来对 ES6 中类进行规则，我们在类中再讲解。

在 TypeScript 中，数组类型的约定是比较灵活，主要有三种定义方式：

-   `interface` 可索引接口的形式，见上面
-   `elemType[]` 形式
-   `Array<elemType>` 形式（数组泛型）

```js
// [index:keyType]:valueType 可索引接口形式
interface INumberArray {
	[index: number]: number;
}
let arr: INumberArray = [1, 1, 2, 3, 5]

// elemType[] 形式
let arr: number[] = [1, 1, 2, 3, 5]

// Array<elemType> 形式
let arr: Array<number> = [1, 1, 2, 3, 5]
```

可以比较看出，`elemType[]`形式最简洁，所以也是平常最常用的数组注解形式。

一旦对数组作了类型注解，任意一下数组项不符合约定，就会报错。

```ts
let errorArr: number[] = [1, '1', 2, 3, 5]
// error: Type 'string' is not assignable to type 'number'.

errorArr.push('8')
// error: Argument of type '"8"' is not assignable to parameter of type 'number'.
```

所以在工作中某个变量我们知道肯定是数组类型，但数组中各个项目具体是什么类型不确定。
此时可以考虑使用 `any` 类型来注解索引值类型。`any` 代表是任意类型。具体后面讲解

```ts
let anyArr: any[] = ['typescript', 2019, { website: 'http://tslang.cn' }]
```

### Tuple 元组

如果我们明确知道数组的长度及各个元素的类型，此时就可以用 TS 新增的一种类型 **元组 Tuple**来定义

```ts
let tupleArr: [string, nubmer] = ['typescript', 2019]
```

当对单个元组项进行赋值时，如果类型不对，或者越界都会报错

```ts
// 以下写法都会报错
tupleArr[0] = 1
tupleArr[1] = true
tupleArr[2] = 'a'
// 在新版ts中，对元组不管是访问越界还是越界赋值都会报错。（旧版会先推断一个联合类型出来）
```

对元组类型声明后，如果初始化时少了，也会报错

```ts
let tupleArr: [string, nubmer]
tupleArr = ['ts'] // 报错，因为少了一项

// 但是可以按索引项单独赋值，不会报错
tupleArr[0] = 'ts'
```

TS 新增的数据类型除了`Tuple`，还有 `Any` `Void` `Never` `Tuple` `Enum` 等，会放在后面讲，提前在数组这里讲 `Tuple` 元组，主要是跟数组有关联，方便记忆和理解。

### Function 函数

用接口对函数进行类型注解

```ts
interface ISum {
	(a: number, b: nubmer): number
}

// 函数表达式
let sum: ISum
sum = function(a: number, b: number): number {
	return a + b
}

// 实际上因为TS具有类型推断能力，所以一旦我们指定了接口，可以这样简写
let sum1: ISum
sum1 = function(a, b) {
	return a + b
}
// 通过类型注解后的函数，
// 在编译器，当光标悬浮在对应参数上，也能显示参数类型。
// 在声明时如果形参数量不对、参数类型不对，返回值类型不对时都会及时报错。
// 在调用时，实参类型不对，或者少传多传，也都会及时报错
```

但实际上，函数还有另一种更常用的类型定义形式

> 在 js 中，函数定义有两种形式：函数声明和函数表达式。

> 一个函数包括三部分：参数、函数体、返回值，所以对函数类型注解主要是针对参数类型和返回值类型

```ts
// 函数声明（Function Declaration）
function sum(x: number, y: number): number {
	return x + y
}
```

```ts
// 函数表达式（Function Expression）
// 注意类型定义中的 => 区别于箭头函数的=>
let mySum: (x: number, y: number) => number = function(x: number, y: number): number {
	return x + y
}
// 利用TS的类型推断，上面函数表达式可简写
// 我们对等号右侧的匿名函数进行了类型定义，左侧mysum则可以通过类型推断出来。
let mySum = function(x: number, y: number): number {
	return x + y
}
```

关于函数类型三种方式，平常中应该选择并坚持一种写法。常用是使用函数声明的方式

```ts
// 接口定义函数类型
interface ISum {
	(a: number, b: nubmer): number
}

let sum: ISum
sum = function(a: number, b: number): number {
	return a + b
}

// 函数声明（Function Declaration）
function sum(x: number, y: number): number {
	return x + y
}

// 函数表达式（Function Expression）
let mySum: (x: number, y: number) => number = function(x: number, y: number): number {
	return x + y
}
```

**TS 中函数涉及的其它概念**

-   可选参数
-   参数默认值
-   剩余参数
-   函数重载

**可选参数**

前面提到，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？

与接口中的可选属性类似，我们用 `?` 表示可选的参数：

```ts
function fullName(firstName: string, lastName: string, midName?: string): string {
	if (midName) {
		return `${firstName} ${midName} ${lastName}`
	} else {
		return `${firstName} ${lastName}`
	}
}

// 注意一点就是：可选参数后面不允许再出现必需参数了，即可选参数一定是放在最后面
function fullName(firstName: string, lastName?: string, midName: string): string {
	// some code
}
// index.ts(1,40): error TS1016: A required parameter cannot follow an optional parameter.
```

**参数默认值**

默认参数语法同 JS 一致，使用 `=` 赋值即可

```ts
function fullName(firstName: string = 'Tom', lastName: string, midName?: string): string {
	if (midName) {
		return `${firstName} ${midName} ${lastName}`
	} else {
		return `${firstName} ${lastName}`
	}
}
```

**剩余参数**

ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数（rest 参数）,`rest`是一个数组类型，所以我们用 TS 的数组类型注解的方式。但因为一般无法确定数组内部元素的类型，所以数组项定义为`any`类型，如果你确定数组项元素类型则可以指明具体类型。

> rest 参数只能是最后一个参数

```ts
function push(array: any[], ...items: any[]) {
	items.forEach(function(item) {
		array.push(item)
	})
}
```

```ts
function sum(...args: number[]): number {
	return args.reduce((sum, item) => sum + item)
}
```

**函数重载**

原生 js 中是没有函数重载概念的。但 TS 中因为有了类型区分，也就可以定义函数名相同，参数类型不同的多个函数了。

重载允许声明多少同名的函数，接受不同数量或不同类型的参数，作出不同的处理。

```ts
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
	if (typeof x === 'number') {
		return Number(
			x
				.toString()
				.split('')
				.reverse()
				.join('')
		)
	} else if (typeof x === 'string') {
		return x
			.split('')
			.reverse()
			.join('')
	}
}
```

上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

## TS 新增类型

TS 除了支持 JS 已有的数据类型，还新增以下数据类型

-   Tuple 元组
-   Enum 枚举
-   Any
-   Void
-   Never

元组已经在上面讲过了，这里补充其它几类：

### Enum 枚举

`Enum` 类型是对 JavaScript 标准数据类型的一个补充。

通常分为 数字枚举 和 字符串枚举。数字枚举具有反向映射功能，但字符串枚举没有。

**数字枚举**

```ts
enum Days {
	Sun,
	Mon,
	Tue,
	Wed,
	Thu,
	Fri,
	Sat
}
```

通常用于一组确定范围的值。默认第一项索引值为 0，后续递增。也可以自定义每项索引值，未定义的项以前一项索引值为基准+1。

同时也会对枚举值到枚举名进行反向映射，所以可以像对象一样引用值，返回索引。也可以像数组一样用索引取值

```ts
enum Sport {
	Basketball,
	Football,
	Pingpong,
	Running
}

let favouriteSport1: Sport = Sport.Basketball
let favouriteSport2: number = Sport.Pingpong
let favouriteSport3: Sport = Sport['Football']

console.log(favouriteSport1) // 输出 0
console.log(favouriteSport2) // 输出 2
console.log(favouriteSport3) // 输出 1

enum OrderStatus {
	Unpaid = 5,
	Shipped = 10,
	Received = 15,
	Completed = 20,
	finished = 30
}
let currentOrderStatus: string = OrderStatus[10]
let currentOrderStatus1: Sport = OrderStatus[10] // 会报错，类型注解不对，不能为Sport，只能为string
console.log(currentOrderStatus) // Shipped
```

需要注意两点：

-   注意上面 let 声明三个变量的类型注解 分别是 Sport number string
-   手动赋值项的索引，可能会与递增计算出来的索引重复，此类型 typescript 并不会报错

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
```

上面的例子中，递增到 3 的时候与前面的 Sun 的取值重复了，但是 TypeScript 并没有报错，导致 Days[3] 的值先是 "Sun"，而后又被 "Wed" 覆盖了。

所以使用的时候需要注意，最好不要出现这种覆盖的情况。

### Any Void Never

**Any**

`any` 表示该值的类型可以是任何类型（基本类型和引用类型范围内的）。有些情况下由于不清楚具体类型时，比如动态获取的值或未限定用户输入值类型时，可以使用。

```ts
let notSure: any = 4
notSure = 'any类型的值可以随时更新赋值类型'
console.log(notSure)
notSure = true
console.log(notSure)
```

**Void**

`void` 表示该值只能是 null,nudefined 其中的一种，不能是常规类型(booean,number,string,array,tuple,enum,object)。常用于没有返回值的函数类型（因为函数默认返回 undefined)

```ts
function test(text: string): void {
	console.log(text)
}
test('void通常用于没有显示声明return语句的函数返回值类型')
```

```ts
// 将一个变量声明为void类型没有什么意义，因为此时该变量就只能被赋值为null或nundefined类型了。还不如直接声明为null或undefined
let unusable: void = undefined
unusable = null
```

**Never**

`never` 表示不存在的值的类型。
常用于内部抛出错误的函数返回值类型，或陷入死循环的函数返回值类型（但一般不可能主动在代码中写死循环的函数，所以 never 常用于主动抛出异常错误的函数返回值类型

```ts
function error(message: string): never {
	throw new Error(message)
}

error('some error')

// 代码中不会写这种代码
function infiniteLoop(): never {
	while (true) {}
}
```

总结

```
any: 用于数据类型不确定性，如动态获取的
void： 用于无返回值的函数
never: 用户主动抛出错误的函数
```
