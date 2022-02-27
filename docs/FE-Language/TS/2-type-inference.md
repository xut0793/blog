# 类型推导 type inference

- 类型拓宽
  - 什么情况下会进行类型拓宽
  - 阻止类型拓宽的方法：显式注解和 `as const` 断言
- 类型细化
  - 什么情况下会进行类型细化：流程语句配合逻辑运算符以及类型查询语句时
  - 类型细化的局限性，只在当前作用域内有效，针对`(arg: T) => boolean` 类型的函数要跨作用域生效，可以使用 `is` 运算符进行类型断言（类型谓词）`arg is T`
  - 无法进行类型细化时，需要手动明确类型
    - 可辨识联合类型 discriminated union type
    - 类型烙印，模拟名义类型
    - 类型断言: `as is ! !:`

TypeScript是一种带有**类型语法**的JavaScript。TypeScript 中的类型系统要求：显式**声明**部分类型，然后在编译时会**推导**余下类型，并在编译时**检查**类型。

前面讲解了 [TS 如何声明各种类型](1-type-declaration-1.1-basic-type.md)，这一节讲解 TS 如何推导类型，包含两部分内容：类型拓宽和类型细化。

## 类型拓宽 type widening

类型拓宽(type widening) 是理解 TS 类型推导机制的关键。TS 在推导类型时会放宽要求，故意推导出一个更宽泛的类型，而不是限定为某个特定的类型。这样做的好处是大大减少了类型检查器报错的时间。

### 什么情况下会进行类型拓宽

1. 使用 `let / var` 声明变量时，因为后续可能会被重新赋值，所以变量类型将拓宽，从字面量类型拓宽到该字面量的基类型，其中字面量类型 `null / udefined` 拓宽为 `any`。

```ts
let a = 'x'         // 从字面量类型 'x' 拓宽到 string 类型
let b = 3           // 从字面量类型 3 拓宽到 number 类型
let c = true        // 从字面量类型 true 拓宽到 boolean 类型
let d = null        // 从字面量类型 null 拓宽为 any 类型
let e = undefined   // 从字面量类型 undefined 拓宽为 any 类型
enum F { X, Y, Z}
let f = F.X         // 从字面量类型 F.X 拓宽到 F 类型
```
对应的，使用 `const` 声明不可修改的变量时，TS 不会进行类型拓宽，固定为字面量类型。
```ts
const a = 'x'       // 'x'
const b = 3         // 3
const c = true      // true
const d = null      // null
const e = undefined // undefeined
const f = F.X       // F.X
```
但是`const`声明的变量有两种特殊情况下，仍会进行拓宽：
- 将const 声明的变量重新赋值给 let / var 声明的变量，遵循 let / var 规则进行类型拓宽
- 使用 const 声明对象时，对象属性的类型仍会进行拓宽，因为 JS 对象属性是可变的
```ts
// 第一种：将const 声明的变量重新赋值给 let / var 声明的变量，遵循 let / var 规则进行类型拓宽
const a = 'x'       // 'x'
let b = a           // string

// 第二种：使用 const 声明对象时，对象属性的类型仍会进行拓宽，因为 JS 对象属性是可变的
const o = {
  a: 1
}
o.a                 // o.a 的类型并没有固定为字面量类型 1，而是拓宽为 number
o.a = 2             // 因为我们可以给 o.a 重新赋值 number 类型的值，但不能对 o 重新赋值
o.a = 'a'           // Error TS2322: Type 'string' is not assignable to type 'number'.
o = {a: 'a'}        // Error TS2588: Cannot assign to 'o' because it is a constant.
```
另外针对 `null / undefined`类型也有一种特殊情况：
2. 当使用 `let / var` 初始化为 `null / undefined` 的变量离开它声明时所在作用域后，TS 将为其分配最后一个赋值的基类型。
```ts
// let 声明进行类型拓宽
let d = null        // 从字面量类型 null 拓宽为 any 类型
let e = undefined   // 从字面量类型 undefined 拓宽为 any 类型

function x() {
  let x = null // any
  x = 3       // any
  x = 'b'     // any
  return x
}
let ret1 = x() // string
const ret2 = x() // string

function y() {
  let a = undefined
	let b = null
	a = 3
	b = 'b'
	return { a,	b	}
}
let ret = y() // 返回值 ret 是 { a:number, b:string }
```
3. 可选参数 `?` 的类型将拓宽为 `T | undefined` 的联合类型

```ts
type Obj = {
	a: number,
	b?: string,  // string | undefined
}
const o: Obj = {
	a: 1,
	b: undefined // 可以赋值 undefined
}

function fn(a: number, b?: string) {
	return b ? a + b : a.toString()
}
type f = typeof fn  // (a: number, b?: string | undefined) => string
```

### 如何阻止类型拓宽

1. 显式注解类型, 阻止 `let / var` 声明的变量的类型拓宽

```ts
let a: 'x' = 'x'
let b: 3 = 3
let c: true = true
let d: null = null
let e: undefined = undefined
enum F { X, Y, Z}
let f: F.X = F.X
```

2. 使用 `as const` 断言。

在 TS 的类型层面的语法中也有一个特殊的 `const` 类型，它用作类型断言不仅能阻止类型拓宽，还会递归地把属性转为 `readonly`。
> 区分 TS 中的 const 关键字和 JS 中的 const 关键字：TS 中 const 关键字配合 as 运算符用作类型断言，JS 中 const 作用声明常量

```ts
// 没有注解类型，TS 类型推导会将对象属性类型进行拓宽
const o1 = {
  a: 1      // number
}

// 显式注解类型，不会拓宽，但可以赋值，虽然字面量类型的值只是它本身
const o2: { a: 1 } = { a: 1 }
o2.a = 1
o2.a = 2 // Error TS2322: Type '2' is not assignable to type '1'.

// 如果要阻止对象属性被修改，可以增加 readonly 修饰符
const o3: {readonly a: number} = { a: 1 }
o3.a = 2 // Error TS2540: Cannot assign to 'a' because it is a read-only property.

// 可以使用 as const 一步阻止类型拓宽和赋值
let o4 = { a: 1 } as const  // {readonly x: 3 }
o4.a = 1 // Error TS2540: Cannot assign to 'a' because it is a read-only property.
```

## 类型细化 type narrowing

类型细化，也有被称为类型缩窄、类型守卫等。它也是 TS 类型推导的机制之一。

TS 采用的是**基于流的类型推导，这是一种符号执行**，在类型检查器中内嵌符号执行引擎，它会分析代码中的流程语句（如 if ? || switch等）和类型查询语句（如 typeof instanceof in等），然后将细化的类型反馈给类型检查器。
> 符号执行是一种分析程序的方式，这种方式使用一个特定的程序（称为符号求值程序，或叫符号执行引擎）来运行程序。但它的运行不是为变量赋予具体的值，而是使用符号建模变量，在程序真正运行的过程中约束变量的值。符号执行引擎在执行时可以表达出“这个变量从未使用，或这个函数永远不返回等类似信息，反馈给类型检查器报错提示。
> 基于流的类型推导是细化代码块中类型的一种方式，在类型检查器中内嵌符号执行引擎，为类型检查器提供反馈，以接近人类程序员的方式分析程序。

### 什么情况下会进行类型细化

使用流程语句或类型查询语句来细化类型。[P154]
- 流程语句配合逻辑运算符时： `if switch ?` 配合 ` == != === !==`。
- 类型查询语句： `typeof, instanceof, in`等。

```ts
/**
 * 示例参数来自：[TypeScript 夜点心：自定义类型守卫](https://zhuanlan.zhihu.com/p/108856165)
 */

// 类型判断 typeof
function test(input: string | number) {
  if (typeof input == 'string') {
    // 这里 input 的类型「收紧」为 string
  } else {
    // 这里 input 的类型「收紧」为 number
  }
}

// 实例判断 instanceof
class Foo {}
class Bar {}

function test(input: Foo | Bar) {
  if (input instanceof Foo) {
    // 这里 input 的类型「收紧」为 Foo
  } else {
    // 这里 input 的类型「收紧」为 Bar
  }
}

// 属性判断 in
interface Foo {
  foo: string;
}

interface Bar {
  bar: string;
}

function test(input: Foo | Bar) {
  if ('foo' in input) {
    // 这里 input 的类型「收紧」为 Foo
  } else {
    // 这里 input 的类型「收紧」为 Bar
  }
}

// if 配合逻辑运算符 == != === !==
type Foo = 'foo' | 'bar' | 'unknown';
function test(input: Foo) {
  if (input != 'unknown') {
    // 这里 input 的类型「收紧」为 'foo' | 'bar'
  } else {
    // 这里 input 的类型「收紧」为 'unknown'
  }
}

// switch 逻辑判断
type UserTextEvent = {
	type: 'TextEvent',
	value: string,
	target: HTMLInputElement
}
type UserMouseEvent = {
	type: 'MouseEvent',
	// value: [number, number],
	positionX: number,
	positionY: number,
	target: HTMLElement
}
type UserEvent = UserTextEvent | UserMouseEvent
function handle(event: UserEvent) {
	switch(event.type) {
		case 'TextEvent': {
			event.value
			event.target
			return
		}
		default: {
			event.positionX
			event.positionY
			event.target
			return
		}
	}
}
```
一个综合解析示例：
```ts
/**
 * 使用 parseWidth 函数，把 CSS 宽度的值和单位解析出来。
 */
type Unit = 'cm' | 'px' | '%'
type Width = {
	unit: Unit,
	value: number
}

let units: Unit[] = ['cm', 'px', '%']

// 传入的 width 值可能是一个数字，可能是一个带单位的字符串，也可能是 unll 或 undefined。
function parseWidth(width: number | string | null | undefined): Width | null {
	/**
	 * 这里作不严格相等比较，如果 width 是 null 或 undefined，尽量返回
	 * 这里遇到 if 流程语句，TS 基于流式推导，即通过符号执行程序后，TS 会知道，如果此处检查不通过，width 类型将可能是 number | string
	 */
	if (width == null) {
		return null
	}

	/**
	 * 所以经过这个 if (width == null) 流程语句的分析，此处 width 的类型 number | string | null | undefined 将会被细化成 number | string
	 * typeof 运算符在不管是在 JS 运行时还是在 TS 编译时都会查询值的类型。
	 * 检查通过， TS 会进一步将 width 类型细化为 number
	 */
	if (typeof width === 'number') {
		return {
			unit: 'px',
			value: width,
		}
	}

	/**
	 * if (typeof width === 'number') 检查也未通过，那 width 类型必为 string，毕竟形参中注解的类型只剩这一种类型了
	 */
	let unit = units.find(unit => width.endsWith(unit))
	if (unit) {
		return {
			unit,
			value: parseFloat(width)
		}
	}

	/**
	 * 当用户传入的 width 为字符串，并且包含一个不受支持的单位时，units.find(unit => width.endsWith(unit)) 也可能返回 undefined。
	 * 执行这里返回 null
	 */
	return null
}
```

### 类型细化的局限性，使用 `is`运算符解决

类型细化只能细化当前作用域中的变量类型，一旦离开这个作用域，类型细化的能力不会随之转移到新的作用域中。[P173]
```ts
function isString(str: unknown): boolean {
  return typeof str === 'string'
}

function parseInput(input: string | number) {
  let formatedInput: string

  if (isString(input)) {
    formatedInput = input.toUpperCase() // Error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
  } ellse {
    formatedInput = input.toString()
  }
  return formatedInput
}
```
在 `isString` 的实现中 根据类型细化，如果它返回 `true`，那输入参数的类型会细化为 `string`，可是这个类型细化的结果并没有作用到函数 `parseInput` 的作用域中，在这里调用 `string` 的特有的方法 `toUpperCase` 仍会提示报错。

那要如何才能让类型细化跨作用有效呢？ 此时可以使用 TS 的 `is` 运算符自定义类型防护措施。
> 自定义类型防护也有称为 自定义类型守卫
> `is`运算符也有叫类型谓词，也是类型断言的一种

句法是：`value is T`，它的使用是有限制的，只针对以下这种情况：
- 如果某个函数只接受一个参数，在函数内部细化了该参数的类型，并且返回一个布尔值。此时可以使用 `is` 运算符自定义类型防护确保该参数细化的结果能跨作用域转移，在该函数使用的地方都起作用。
- 这个函数限制只接受一个参数，但参数类型不限制，可以为基础类型，也可以是自定义的其它类型。

```ts
function isString(str: unknown): str is string {
	return typeof str === 'string'
}
function parseInput(input: string | number): string {
	let formatedInput: string
	if (isString(input)) {
		formatedInput = input.toUpperCase() // input：string 类型细化跨作用生效了
	} else {
		formatedInput = input.toString()  // input: number
	}
	return formatedInput
}

// 参数不局限在基础类型，也可以是复杂类型
class Animal {
   public run() {}
}

class Dog extends Animal {
  public bark() {
    console.log('bark.')
  }
}

class Cat extends Animal {
  public meow() {
    console.log('meow.')
  }
}

function isCat(lucky: Dog | Cat): lucky is Cat {
  // return 'meow' in lucky;
  return lucky instanceof Cat
}

const animalVoice = (animal: Dog | Cat) => {
  if (isCat(animal)) {
    animal.meow();
  };
}

const cat = new Cat();
animalVoice(cat); // meow.
```

### 可辨识联合类型 discriminated union type

通过一个例子来说明可辨识联合类型，假如需要构建一个自定义的事件系统：[P157]
- UserTextEvent 描述键盘事件，保存用户输入的文本
- UserMouseEvent 描述鼠标事件，保存用户鼠标的位置
```ts
type UserTextEvent = { value: string }
type UserMouseEvent = { value: [number, number] }
type UserEvent = UserTextEvent | UserMouseEvent
function handle(event: UserEvent) {
	if (typeof event.value === 'string') {
		event.value // string
		// do something
		return
	}
	event.value // [number, number]
}
```
在上面，TS 通过流程语句可以知道：
- 在 if 块中的 event.value 肯定是一个字符串类型 `string`
- 在 if 块后面，event.value 肯定是元组类型 `[number, number]`

但如果情况变复杂一些，需要为事件增加一些信息，比如增加目标元素 target
```ts
type UserTextEvent = { value: string, target: HTMLInputElement }
type UserMouseEvent = { value: [number, number], target: HTMLElement }
type UserEvent = UserTextEvent | UserMouseEvent
function handle(event: UserEvent) {
	if (typeof event.value === 'string') {
		event.value // string
		event.target // HTMLInputElement | HTMLElement
		// do something
		return
	}
	event.value // [number, number]
	event.target // HTMLInputElement | HTMLElement
}
```
上面的结果中，event.value 的类型可以顺序细化，但是 event.target 的类型却不能。为什么？

因为上述联合类型 UserEvent 并不能通过 event.value 来确定成员的唯一性。比如现在增加一个键盘事件，value 用来表示键盘字符。
```ts
type UserKeyboardEvent = { value: string, target: HTMLElement}
type UserEvent = UserTextEvent | UserMouseEvent | UserKeyboardEvent
```
那么此时 handle 函数的处理逻辑可能就会出错。 

为此，需要一个标识，能区分联合类型的各种分支情况。

一个好的标记要满足下述条件：
1. 在联合类型各组成部分的相同位置上，如果是对象类型的联合，使用相同的字段；如果是元组类型的并集，使用相同的索引。
2. 最好使用字符串字量类型，并且确保在联合类型中是独一无二的。
```ts
type UserTextEvent = { type:'TextEvent', value: string, target: HTMLInputElement }
type UserMouseEvent = { type: 'MouseEvent', value: [number, number], target: HTMLElement }
type UserKeyboardEvent = { type: 'Keyboard', value: string, target: HTMLElement}
type UserEvent = UserTextEvent | UserMouseEvent | UserKeyboardEvent
function handle(event: UserEvent) {
	switch(event.type) {
		case 'MouseEvent':
			event.value       // [number, number]
			event.target      // HTMLElement
		break
		case 'Keyboard':
			event.value       // string
			event.target      // HTMLElement
		break
		default:
			event.value       // string
			event.target      // HTMLInputElement
		break
	}
}
```

一个可辨识的联合类型实现，包含了：
1. 使用具有唯一性的字面量类型标记
1. 使用联合类型
1. 使用类型细化机制（类型守卫）
1. 使用类型全面性检查（类型穷举）

### 类型烙印，模拟名义类型

可辨识联合类型能很好区分联合类型的各个成员，但如果需要区分同种类型的不同含义的情况时，TS 如何细分类型。[P185]

举例说明：

应用中有几种 ID 类型，但实际都是 string 类型。然后应用中声明一个通过用户ID查询用户信息的函数。如果有良好的文档，可能有助于开发人员知道这个函数应该传入用户ID，但因为用户ID毕竟也只是字符串 string 类型的别名，万一哪个开发人员传入了同样是字符串的其它类型的 ID，TS 类型系统也不能提前报告这个错误。
```ts
type UserID = string
type OrderID = string
type CompanyID = string

function queryUserInfo(id: UserID) {
  // do something
}
```
这种场景下，就体现了名义类型(nominal typing)的作用了。虽然 TS 的类型系统是结构化类型(structural type)，原生不支持名义化类型。但是我们在 TS 现有的类型系统基础上模拟名义类型，就是使用类型烙印(type branding)技术来模拟实现。
> 结构化类型是一种编程设计风格，它只关心对象有哪些属性，而不管属性使用什么名称。只要两个对象的结构所描述的属性值的类型是兼容的，就认为两个对象类型是兼容的。
> 结构化类型也被称为照鸭子类型（duck typing），指的是当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。
> 名义化类型表示类型若要相等，就必须具有相同的“名字”

类型烙印，顾名思意，就是为类型打上一个可区分的唯一性标记，类似上述可辨识联合类型的字面量标记。

打烙印的方法有很多种，具体可以查看[Nominal typing techniques in TypeScript](https://michalzalecki.com/nominal-typing-in-typescript/)，这里举例种两种推荐的方法。

1. 使用伴生对象模式（即存在类型层面代码和值层面代码同名变量）模拟名义类型
```ts
// 首先，为各个类型合成类型烙印，模拟名义类型
// 这里选择的烙印标记是 uniuqe symbol，因为这是 TS 中两个真正意义上是名义类型的类型之一（另一个是 enum)。当然你也可以使用其它烙印，保要能保证烙印唯一性即可。
type UserID = string & { readonly __brand: unique symbol}
type OrderID = string & { readonly __brand: unique symbol}
type CompanyID = string & { readonly __brand: unique symbol}

// 然后，需要找到一种创建上述名称类型值的方法，这里使用伴生对象模式为每个带烙印的类型声明一个同名的工厂函数，用来创建对应类型值
// 符合 string 和 { readonly __brand: unique symbol} 并集值不可能存在，所以只能使用类型断言（as 运算符），人为指定某个值的类型为带烙印的类型
function UserID(id: string) {
	return id as UserID
}
function OrderID(id: string) {
	return id as OrderID
}
function CompanyID(id: string) {
	return id as CompanyID
}

// 最后使用对应类型的工厂函数生成值
let userId = UserID('d23xdf')
let orderId = OrderID('dfsfdf')
let str = 'sdfsdf'

function queryUserInfo(id: UserID) {
	// do something
}

queryUserInfo(userId)
queryUserInfo(orderId)  // Error TS2345: Type 'OrderID' is not assignable to type '{ readonly __brand: unique symbol; }'.
queryUserInfo(str)      // Error TS2345: Argument of type 'string' is not assignable to parameter of type 'UserID'.
```
2. 使用特定字符串打烙印，并声明一个生成模拟名义类型的工具类型

这种方式与可辨识联合类型异曲同工，使用一个唯一性的字符串字量面类型模拟名义类型。
```ts
type NominalType<T, flag> = T & { readonly __brand: flag} // 定义一个生成模拟名义类型的工具类型
type UserID = NominalType<string, 'USER_ID'>
type OrderID = NominalType<string, 'ORDER_ID'>
type CompanyID = NominalType<string, 'COMPANY_ID'>
function queryUserInfo(id: UserID) {
	// do something
}
let userId = 'd23xdf' as UserID
let orderId = 'dfsfdf' as OrderID
let str = 'sdfsdf'
queryUserInfo(userId)
queryUserInfo(orderId) // Error TS2345: Type 'OrderID' is not assignable to type '{ readonly __brand: "USER_ID"; }'.
queryUserInfo(str)     // Error TS2345: Argument of type 'string' is not assignable to parameter of type 'UserID'.
```

### 类型断言 `as`

有时，我们可能没有足够的时间把所有类型都规划好，特别是旧 JS 项目迁移成 TS 项目时，也有时可能 TS 类型细化能力不足以推导出正确类型时，就需要我们手动明确类型，就好像我们主动告诉 TS："我比你更清楚，确定此处是什么类型"。

类型断言的句法，使用 `as` 运算符：`value as T`。
> 类型断言还有一种旧句法：尖括号句法 `<T>value`，因为容易与 TSX 句法冲突，所以建议优先使用 as 句法，语意更明确。
> 在 tslint 中配置 no-angle-bracket-type-assertion 规则，强制要求类型断言使用 as 句法。

```ts
const data: object = ['a', 'b', 'c']
data.length // Error TS2339: Property 'length' does not exist on type 'object'.
(data as string[]).length
```
- 在第一行中，我们把 array 的类型显示注解为 object。
- 在第二行中，我们看到此类型不允许访问任何属性。
- 在第三行中，我们用类型断言(运算符 as)告诉 TS 确定 data 是一个array。现在就可以访问属性 .length 了。

类型断言也有一定的限制，并不是任何一个类型都可以被断言为任何另一个类型。

```ts
/**
 * 比如 string 类型也有 length 属性，但是如果把声明为 object 类型的 data 断言为 string，会报错
 * Error TS2352: Conversion of type 'object' to type 'string' may be a mistake because neither type sufficiently overlaps with the other. 
 *               If this was intentional, convert the expression to 'unknown' first.
 *               将类型'object'转换为类型'string'可能是一个错误，因为这两种类型都不能与另一种类型充分重叠。
 *               如果这是有意的，首先将表达式转换为“unknown”。
 */
(data as string).length // 
```
类型断言的限制：**只能断言一个类型是自身的超类型或子类型**。即如果 `A <: B <: C`，那么可以断言 B 是 A，或者 B 是 C。

基于此限制，可以确定类型断言可以应用到：
- 联合类型可以被断言为其中一个类型
- 枚举类型可以被断言为其中一个成员类型
- 任何类型都可以被断言为 any，any 可以被断言为任何类型。因为 any 既是一个 `top type`，也是一个 `bottom type`，它所有类型的超类型，也是所有类型的子类型。

上述例子中object 类型，只表示变量是一个 JS 引用类型对象（如 object/array/function等），而不是基础类型（如 null/number等）。并且该对象不能作任何操作。将 object 断言成 string 报错，因为两种类型并不兼容。
> object / Object / {} / 对象字面量类型详解见 [1-type-declaration-1.1-basic-type.md](1-type-declaration-1.1-basic-type.md)

### 非空断言 `后缀 value!`

包含 undefined 或 null 类型的联合类型，则非空断言运算符(non-nullish 运算符)将从联合中删除 nudefined / null类型。就好比告诉 TypeScript：“这个值不会是 undefined 或 null。”
```ts
function getValue(strMap: Map<string, string>, key: string) {
	if (strMap.has(key)) {
		const value = strMap.get(key)
		value.length // Object is possibly 'undefined'.
		return value
	}
	return null
}
```
在上例中，在 map 中 get 方法没有找到时会返回 undefined, 所以 TS 会推断返回值 value 类型是 `string | undefined` 的联合类型，所以在获取 `value.length` 会报错，因为 undefined 类型并不会有 lenght 属性。

但是我们上面已经通过 map 的 has 方法判断为真了，所以 value 的结果绝不会是 undefined。因为这个 if 流程语句 TS 无法通过 map 的 has 方法细化类型，我们只能手动明确类型，此时你可以使用 `as` 运算符，像这样
```ts
const value = strMap.get(key) as string
```
但是对于排除 `undefined / null` 类型，TS 提供了专门的句法，非空断言运算符(non-nullish 运算符)，后缀 `value!` 表示。
```ts
function getValue(strMap: Map<string, string>, key: string) {
	if (strMap.has(key)) {
		const value = strMap.get(key)!  // 进行非空断言
		value.length // 正常
		return value
	}
	return null
}
```

### 明确赋值断言 `前缀 value!: T`

TS 的类型检查中有一条检查规则：明确赋值检查，即如果先声明变量，后初始化，那TS将会确保在使用该变量时检查该变量是否已经赋值。[P38]
> 类型检查包括：明确赋值检查、可赋值性检查、多余属性检查、全面性检查。具体查看[类型检查](3-type-checking.md)

```ts
let useId: string
useId.toUpperCase() // Error TS2454: Variable 'useId' is used before being assigned.
```
这样很好，能让我们避免运行时才发现的错误。

但是如果我们能确保是在用户已经登录的情况下，通过本地强缓存查找到用户ID，因此 getCacheUser 函数调用后，userId 肯定已经有值了。但是 TS 无法通过静态类型检查知道这点，因为上述逻辑只有在运行时才知晓，而 TS 的类型系统是在编译时才生效。所以上述报错仍然存在。

```ts
let userId: string
getCacheUser()
userId.toUpperCase()

function getCacheUser() {
	userId = window.localStorage.getItem('userID')
}
```
此时我们可以使用明确赋值断言告诉 TS，在读取 userId 时，肯定已经为它赋值了。明确赋值断言的句法：`value:T`
```ts
let userId!: string  // 明确赋值断言，注意感叹号的位置
getCacheUser()
userId.toUpperCase()

function getCacheUser() {
	userId = window.localStorage.getItem('userID')! // 非空断言，因为 getITem 方法获取不到值时返回 null
}
```
另一个很好的例子
```ts
class Position {
  // 如果这里 x , y 不加明确赋值断言，会报 Error TS2564: Property 'x' has no initializer and is not definitely assigned in the constructor.
	x!: number
	y!: number
	constructor() {
    // this.x = 0
    // this.y = 0
		this.initParams()
	}
	initParams() {
		this.x = 0
		this.y = 0
	}
}
```
  
### 断言总结

断言相关的运算符：
- `is`运算符：自定义类型守卫
- `as`运算符：手动明确类型
- 后缀`!`运算符：`value!`，不是 `null / undefined` 类型的非空断言
- 前缀`!`运算符: `value!:T`，明确赋值断言

不管是哪种断言是不得已的方法，应尽可能的避免使用。他们是屏蔽了 TS 静态类型系统为我们提供的类型安全防护。如果大量依赖这些特性，有必要重构你的代码。****