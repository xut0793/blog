# 高级类型

[[toc]]

[Typescript 学习记录：高级类型](https://www.ruphi.cn/archives/266/#anchor8)<br>
[Typescript 高级特性之交叉类型，联合类型，类型保护](https://blog.csdn.net/baidu_28196435/article/details/89707673)

前面学的类型注解都是单一的，称为单例类型。在实际开发中，变量类型会非常复杂，仅仅只是单一类型无法描述，就像 JS 中函数即是 Function 的实例也可以是 Object 的实例。所以在 TS 中了也就有了下面这些混合的高级类型。

## 一、交叉类型

交叉类型可以是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性，常用于接口和泛型合并。

语法：

```ts
T & U
```

例子：

```ts
// 基本类型的交叉，只取它们中共用的部分。number 和 string 都共有的子集类型值只能是 null, undefined，没有什么意义，此种需求常用联合类型。
let name: number & string = null
let name: number & string = undefined

// 但一般对基本类型合并不使用交叉类型，而是使用上节讲的联合类型。所以交叉类型常用于接口或泛型等引用对象的类型上。
// 如果合并接口中出现同名属性，则将属性值类型也合并为交叉类型。如下面 name：number & string，此时name赋值只能是null,undefined。没什么意义。所以交叉类型中尽量让同名属性保持同种类型。
interface A {
	name: string
	age: number
	sayName: (name: string) => void
}
interface B {
	name: number
	gender: string
	sayGender: (gender: string) => void
}

let p: A & B

p.name = null // 此时p.name: number & string，只能赋值null 或 undefined
p.sayName = str => {
	console.log(str)
}
console.log(p.name)
```

## 二、联合类型

联合类型限制类型只能是其中一种。常用于基本类型的联合。

语法：

```ts
T | U
```

例子：

```ts
// 基本类型的联合，表示其中一种
let age: number | string
age = 18
age = '18'

// 如果将联合类型用于定义引用对象的复杂类型，将只取它们中共有的部分定义。
// 下列中接口中同名属性类型也会被转为 联合类型
interface A {
	name: string
	age: number
	sayName: (name: string) => void
}
interface B {
	name: number
	gender: string
	sayGender: (gender: string) => void
}

let p: A | B
p.name = 'tom' // 此时p.name: string | name
p.name = 123
p.gender // 报错，不属于两者的共有部分。
```

## 三、类型断言和类型保护

上面的交叉类型和联合类型可以让一个值为不同的类型，但也都有局限性，比如基本类型的交叉只能使用共用的子集类型，联合复杂类型时也只能访问共有的属性。

```ts
// 对基本类型使用交叉类型，此时age赋值的类型只能是number类型和string类型共同拥有的子集类型unll或undefined。
let age: number & string
age = null
age = undefined

// 对接口使用联合类型，访问接口非共有属性时会报错
interface A {
	name: string
	age: number
	sayName: (name: string) => void
}
interface B {
	name: number
	gender: string
	sayGender: (gender: string) => void
}

let p: A | B
p.age = 18 // 报错: Property 'age' does not exist on type 'B'.
p.gender = 'male' // 报错： Property 'gender' does not exist on type 'A'.
```

那么该如何区分值的具体类型，或者如何访问共有成员？

解决办法有两种：

-   **类型断言**
-   **类型保护**

### 3.1 使用类型断言

类型断言的两种写法：

```ts
<Type>Value
```

```ts
Value as Type
```

此时上面两个问题可以这样解决

```ts
let age: number & string
;(<number>age) = 1
;(age as number) = 18

interface A {
	name: string
	age: number
	sayName: (name: string) => void
}
interface B {
	name: number
	gender: string
	sayGender: (gender: string) => void
}

function getKid(): A | B {
	// do something
}
let kid = getKid()
;(<A>kid).age = 8
;(kid as B).gender = 'girl'
```

使用类型断言的问题是每次操作这个属性都要带上断言，比如上面两次给 age 赋值都得写上类型断言，或者像下面这样重新定义两个方法：

```ts
interface A {
	name: string
	age: number
	sayAge: () => void
}
interface B {
	name: string
	gender: string
	sayGender: () => void
}

function getKid(): A | B {
	let a: A = {
		name: 'tom',
		age: 8,
		sayAge: () => {
			console.log(`A: ${a.name}`)
		}
	}

	let b: B = {
		name: 'jerry',
		gender: 'girl',
		sayGender: () => {
			console.log(`B: ${b.gender}`)
		}
	}

	let random = Math.random()
	return random > 0.5 ? a : b
}

const kid = getKid()

if ((<A>kid).age) {
	;(<A>kid).sayAge = () => {
		console.log(`A: I am ${(<A>kid).age} year old`)
	}
	;(<A>kid).sayAge()
} else {
	;(<B>kid).sayGender = () => {
		console.log(`B: I am ${(<B>kid).gender}`)
	}
	;(<B>kid).sayGender()
}
```

每次都要写一堆尖括号和括号很麻烦，有没有更好方法能判断类型呢？

### 3.2 类型保护

类型保护可以理解为：我明确知道它的类型了，那就采取某种方法显性地指明它是这种类型，以保护这个属性可以在后面程序中放心使用。

常见的类型保护方式有以下几种：

**3.2.1. 自定义类型保护**

自定义类型保护，就是将类型断言封装成一个独立的类型判断函数。但跟普通函数语法上有一些不同：

```ts
function isA(param: A | B): param is A {
	return (<A>param).age !== undefined
}
function isB(param: A | B): param is B {
	return (<B>param).gender !== undefined
}
```

这种`param is SomeType`的形式，就是类型保护，我们可以用它来明确它是联合类型中具体的类型，这样调用时 typescript 就会将变量缩减为该具体类型，在 IDE 中书写可以只显示该类型语法提示。

然后上面都是尖括号的问题可以改成这样：

```ts
// if ((<A>kid).age) {
// 	;(<A>kid).sayAge = () => {
// 		console.log(`A: I am ${(<A>kid).age} year old`)
// 	}
// 	;(<A>kid).sayAge()
// } else {
// 	;(<B>kid).sayGender = () => {
// 		console.log(`B: I am ${(<B>kid).gender}`)
// 	}
// 	;(<B>kid).sayGender()
// }

if (isA(kid)) {
	kid.sayAge = () => {
		console.log(`A: I am ${kid.age} year old`)
	}
	kid.sayAge()
} else {
	kid.sayGender = () => {
		console.log(`B: I am ${kid.gender}`)
	}
	kid.sayGender()
}
```

这里还有一个好处是，当代码进入 else 块中，ts 会推断出当前 kid 是 B 类型，在 IDE 就会有 B 相关的语法提示。

**3.2.2.使用 typeof 和 instanceof**

当我们使用了 typeof 和 instanceof 后，typescript 就会自动限制类型为某一具体类型，从而我们可以安全地在语句体内使用具体类型的方法和属性，如：

```ts
function show(value: string | []) {
	if (typeof value === 'string') {
		return value // ts 限制 value:string
	} else {
		return value.join(',') // ts 限制value:[], IDE也会给出数组相关方法的语法提示
	}
}
```

但是 typeof 只支持 number、string、boolean 或者 symbol（只有这些情况下可以被认为是类型保护）
对于类，我们则可以使用 instanceof

instanceof 的右侧要求是一个构造函数（类）

```ts
// 借用官网 字符串填充的例子
interface Padder {
	getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
	constructor(private numSpaces: number) {}
	getPaddingString() {
		return Array(this.numSpaces + 1).join(' ')
	}
}

class StringPadder implements Padder {
	constructor(private value: string) {}
	getPaddingString() {
		return this.value
	}
}

function getRandomPadder() {
	return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder('  ')
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder()

if (padder instanceof SpaceRepeatingPadder) {
	padder // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
	padder // 类型细化为'StringPadder'
}
```

**3.2.3. 限制 null 和 undefined 类型**

TypeScript 具有两种特殊的类型：null 和 undefined，除了 never 类型，null 和 undefined 是其它任意类型的子集，也就是说值 null 和 undefined 可以赋值给其中任意类型。

null 与 undefined 是所有其它类型的一个有效值，这也意味着，你阻止不了将它们赋值给其它类型。所以我们要避免这种情况的出现。

开启严格的 null 检查模式下， null 和 undefined 值不包含在任何类型里，只允许用它们自己和 any 来赋值（有个例外， undefined 可以赋值到 void）

严格的 null 检查模式开启方式：

**1）. 添加 strictNullChecks 标记**

```base
// 在使用tsc命令行时添加参数 --strictNullChecks
tsc --strictNullChecks file
```

如果是工程项目，可以在配置文件`tsconfig.json`添加编译选项

```json
"compilerOptions": {
    "strictNullChecks": true,
    "preserveConstEnums": true,
    "outFile": "../../built/local/tsc.js",
    "sourceMap": true
}
```

**2）. 手动添加`!`**

如果编译器不能够去除 null 或 undefined，你可以使用类型断言手动去除。 语法是添加 `!` 后缀：

```ts
identifier! // 从 identifier的类型里去除了 null和 undefined：
```

如果在此模式下，仍要使用 null 或 undefined 类型，则可以使用联合类型。

TypeScript 会把 null 和 undefined 区别对待。 string | null， string | undefined 和 string | undefined | null 是不同的类型。

```ts
// 添加 --strictNullChecks
let s = 'foo'
s = null // 错误, 'null'不能赋值给'string'

// 使用联合类型
let sn: string | null = 'bar'
sn = null // 可以
sn = undefined // error, 'undefined'不能赋值给'string | null'
```

可选参数默认值为 undefined，所以在此模式下，如果对可选参数赋值 null 也会报错。

```ts
// 函数可选参数
function f(x: number, y?: number) {
	return x + (y || 0)
}
f(1, 2)
f(1)
f(1, undefined)
f(1, null) // error, 'null' is not assignable to 'number | undefined'

// 对象可选属性
class C {
	a: number
	b?: number
}
let c = new C()
c.a = 12
c.a = undefined // error, 'undefined' is not assignable to 'number'
c.b = 13
c.b = undefined // ok
c.b = null // error, 'null' is not assignable to 'number | undefined'
```

## 四、类型别名

像上面讲的，定义交叉类型或联合类型：

```ts
let age: number | string
let somePeople: IPerson & ILoggable
```

如果代码中多处用到 `IPerson & ILoggable` 交叉类型，那我们就要多次这样写，TS 提供了一种简化的方法，使用类型别名。顾名思义，就是为某种类型定义一个别名，举例说：NBA 球星扬尼斯·安特托昆博(Giannis Antetokounmpo)名称好难叫，那就取个外号叫字母哥，这是一样的道理。

语法：

```ts
type alias = types
```

别名不会新建一个类型，它只会创建一个新的名字来引用现有类型。所以在 VSCode 里将鼠标放在别名上时，显示的是所引用的那个类型。

此时上面的例子，我们可以这样写：

```ts
type AgeType = number | string
type PersonType = IPerson & ILoggable

let age: AgeType
let somePeople: PersonType
```

类型别名还可以用于定义字符串字面量类型

### 4.1 字符串字面量类型

字符串字面量类型允许你指定某个字符串类型的变量值必须的指定范围内的固定值。和联合类型或者枚举类型很像，但注意字符串字面量使用`type`关键字声明，且只为 string 类型。

```ts
type Sports = 'basketball' | 'football' | 'pingpong'

let favouriteSport: Sports = 'basketball' // ok
let favoutiteSport1: Sports = 'swimming' // 报错： Type '"swimming"' is not assignable to type 'Sports'
```

字符串字面量类型还可以用于函数重载：

> 重载允许声明多少同名的函数，接受不同数量或不同类型的参数，作出不同的处理。

下面这个例子，函数接受字符串类型但不同值的标签，返回不同类型的标签元素

```ts
// 一般是直接这样定义
function createElement(tagName: string): Element {
    // ...
}

// 但我们可以利用字符串字面量和函数重载，定义类型更明确的函数
function createElement(tagName:'img'):HTMLImageElement
function createElement(tagName:'div'):HTMLDivElement
function createElement(tagName: string):Element {
    switch(tagName) {
        case "img":
            let eImg = document.createElement('img')
            eImg.src = 'ts.png'
            return eImg
        default:
            let eDiv = document.createElement('div')
            eDiv.setAttribute('class', 'bg-color')
            return eDiv
    }
}

// createElement函数调用时 IDE能提示参数选项 img div
let eImg = createElement('img') // OK
let eDiv = createElement('div') // OK
let eInput createElement('input') // Error
// Argument of type '"input"' is not assignable to parameter of type '"img"'.
// Argument of type '"input"' is not assignable to parameter of type '"div"'.
```

上面的函数重载相当于以下写法：

```ts
type tagType = 'img' | 'div'
function createElement(tagName: tagType): Element {
	switch (tagName) {
		case 'img':
			let eImg = document.createElement('img')
			eImg.src = 'ts.png'
			return eImg
		default:
			let eDiv = document.createElement('div')
			eDiv.setAttribute('class', 'bg-color')
			return eDiv
	}
}
```

### 4.2 可辨识联合类型

我们可以组合单例类型，联合类型，类型保护和类型别名来创建一种高级模式的类型：辨识联合类型，它也称做 标签联合类型 或 代数数据类型。 可辨识联合在函数式编程很有用处。 一些语言会自动地为你辨识联合；而 TypeScript 则基于已有的 JavaScript 模式来创建。

> 单例类型主要指单个基本类型或单个接口类型，联合类型和交叉类型是由多个单例类型组合起来的。

可辨识联合类型具有 3 个要素：

-   具有普通的单例类型属性 -— 可辨识的特征。
-   一个类型别名包含了那些类型的联合 -— 联合。
-   此属性上的类型保护。

下面通过一个官网的例子来讲解可辨识联合类型的这三个要素：

计算不同形状的面积：

1)、定义几个接口

```ts
// 1. 定义接口
interface ISquare {
	kind: 'square'
	size: number
}
interface IRectangle {
	kind: 'rectangle'
	width: number
	height: number
}
interface ICircle {
	kind: 'circle'
	radius: number
}
```

从上面可以看到，我们声明的每个接口都一个`kind`属性，其它都为不同名的属性，这里`kind`属性就称做 **可辨识的特征** （三要素第一条）。

目前上面三个接口还没有任务联系，我们需要把他们联合在一起，使用类型别名：(三要素第二条)

```ts
type Shape = ISquare | IRectangle | ICircle
```

现在我们可以使用这个可辨识联合类型：Shape

书写下面代码，在 IDE 中可以看到清楚的语法提示，而且各个 case 中，属性提示只限于特定接口定义的。

```ts
function area(s: Shape) {
	switch (s.kind) {
		case 'square':
			return s.size ** 2
		case 'rectangle':
			return s.width * s.height
		case 'circle':
			return Math.PI * s.radius ** 2
	}
}

// 声明一个参数，调用下area函数
let shape: ICircle = {
	kind: 'circle',
	radius: 10
}
console.log(area(shape))
```

三要素第三条的类型保护，主要体现在类型的完整性检查。比如下面我新添加一个三角形

```ts
interface ITriangle {
	kind: 'triangle'
	bottom: number
	height: number
}
type Shape = ISquare | IRectangle | ICircle | ITriangle
```

那现在我想要达到什么效果呢？ 我定义的 Shape 已经包含了 ITriangle，但是在 area 函数中暂时并没有实现 triangle。我希望此时编译时要报错，提醒我 area 并没有完全实现和 Shape 中所有联合类型。
也就是希望 TS 能帮我做完整性检查。那怎么样才能达到这种效果呢？

一种是启用 `strictNullChecks`（在命令行添加参数或项目 tsconfig.json 开启），并指定 area 的返回值类型 number。因为 area 中 switch 没有包涵所有情况，所以 TypeScript 认为这个函数有可能会返回 undefined。 如果你明确地指定了返回值类型为 number，那么编译时就看到一个错误，因为实际上返回值的类型为 number | undefined。

```basj
tsc --strictNullChecks test-ts.ts
```

报错：

```
Function lacks ending return statement and return type does not include 'undefined'.
```

但是这种方法并不十分好，因为--strictNullChecks 对旧代码支持不好。

第二种方法是使用`never`类型，实际上是定义一个函数返回报错信息

```ts
function assertNever(x: never): never {
	throw new Error('Unexpected object: ' + x)
}
function area(s: Shape) {
	switch (s.kind) {
		case 'square':
			return s.size * s.size
		case 'rectangle':
			return s.height * s.width
		case 'circle':
			return Math.PI * s.radius ** 2
		default:
			return assertNever(s)
	}
}
```

原理就是 ITriangle 在 case 中没有对应的实现，就进入到 default 中，将 s 传入 x，但此时 s 是 ITriangle 类型，而 x 我们定义为 never 类型，所以编译器就会及时标识 s 类型错误：

```
Argument of type 'ITriangle' is not assignable to parameter of type 'never'
```

这种方式需要你定义一个额外的函数，但是在你忘记某个 case 的时候也更加明显。

## 五、索引类型

先看下面这个例子的需求：

```js
let person = {
	name: 'tom',
	age: 18,
	male: true
}
// 要实现一个根据提供key返回person[key]的函数
function getProp(obj, key) {
	return obj[key]
}
```

上面例子用 TS 的类型来注解这个函数，会遇到一个问题，就是我们 `obj[key]` 的值的类型是不同的，根据 person 的定义可能是 `string/number/boolean` 其中之一，那要如何定义 getProp 函数的返回值类型呢？总不能定义 any 吧？因为我们确实是知道函数返回值类型只能是 person 对象中属性已定义的类型。

此时 TS 提供了**索引类型**来解决这人问题，**索引类型**解决了动态属性的类型注解问题。

比如上面例子的 TS 写法就可以这样：

> 这里函数类型注解涉及到 泛型 概念，请同步了解 泛型 相关概念

```ts
function getPropValue<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key]
}

interface IPerson {
	name: string
	age: number
	male: boolean
}

let person: IPerson = {
	name: 'tom',
	age: 18,
	male: true
}

console.log(getPropValue(person, 'age')) // 18
console.log(getPropValue(person, 'hobby')) // Error:  Argument of type '"hobby"' is not assignable to parameter of type '"age" | "name" | "male"'.
```

编译器会检查传入的 key 是不是 person 上所拥有的全部属性之一，如果不是报错。

这里有几个新的类型操作符：

-   `T` `U`称为类型变量，可以自定义任何有意义的名称。
-   索引类型查询操作符： keyof
-   索引访问操作： T[K]

**索引类型查询操作符： keyof**

对于任何类型 T， keyof T 的结果为 T 上已知的公共属性名的联合。 那`K extends keyof T`表示 K 是 keyof T 返回的联合类型中的一种。

```ts
let personProps: keyof IPerson
// 相当于
type presonPropTypes = 'name' | 'age' | 'male'
let personProps: presonPropTypes
```

但区别是，如果此时向 IPerson 添加了一个`address:string`，`keyof IPerson`结果会自动联合增加的`'address'`

**索引访问操作符： `T[K]`**

使用`T[K]`来动态表示`person[key]`的值的类型。比如此时 key 为 name，则`person['name']`的值的类型是 string，即此时`T[K]`表示 string。

## 六、映射类型

我们可能会遇到这么一些需求：将一个现有类型的每个属性都变为可选的，或者将每个属性变为只读的。

```ts
interface IPerson {
	name: string
	age: number
}

// 转变为可选形式
interface IPersonPartial {
	name?: string
	age?: number
}

// 或者转变为可读的形式
interface IPersonReadonly {
	readonly name: string
	readonly age: number
}
```

怎么样在不需要重新定义的情况下，解决这个问题呢？

TS 为我们提供了**映射类型**，能够使得这种转化更加方便。

在映射类型里，新类型将以相同的形式去转换旧类型里每个属性，如以上例子可以改写为：

```ts
// 定义一个类型转换（相当于定义一个类型转换函数）
type Readonly<T> = {
	readonly [P in keyof T]: T[P]
}
type Partial<T> = {
	[P in keyof T]?: T[P]
}

// 调用类型转换 （相当于调用类型转换函数，获得目标类型返回）
type PersonReadonly = Readonly<Person>
type PersonPartial = Partial<Person>
```

那基于这种函数的思想，使用映射类型可以基于已有的类型包装成一些复杂类型：

在上面我们使用索引类型定义了一个`getPropValue`的函数,用于获取对象指定属性的值。那这里我们再定义一个类似的函数，要求从按指定属性从原对象中返回一个子集对象。

```js
let person = {
	name: 'tom',
	age: 18,
	male: true
}

function pick(obj, ...props) {
	let ret = {}
	for (let prop of props) {
		if (obj.hasOwnProperty(prop)) {
			ret[prop] = obj[prop]
		}
	}
	return ret
}

let picked = pick(person, 'name', 'age')
console.log(picked) // {name:'tom', age:18}
```

那用 TS 来实现上面的代码定义。
首先我们要知道，最终结果 picked 的类型肯定是 person 中类型的一部分。所以我们要用类型推断出来，而不是重新定义它。

```ts
// 定义一个接口，来约束源对象的类型结构
interface IPerson {
	name: string
	age: number
	male: boolean
}
// 按IPerson的类型结构，声明一个源对象
let person: IPerson = {
	name: 'tom',
	age: 18,
	male: true
}

// 依据IPerson类型结构，定义一个结果对象的类型推断函数
type pickType<T, K extends keyof T> = {
	[P in K]: T[K]
}

// 定义实现函数
function pick<T, K extends keyof T>(source: T, ...props: K[]): pickType<T, k> {
	let ret = {} as pickType<T, k>
	for (let prop of props) {
		if (source.hasOwnProperty(prop)) {
			ret[prop] = source[prop]
		}
	}
	return ret
}

let picked = pick(person, 'name', 'age')
console.log(picked)
```

像这上面这种类似工具性的映射类型，TS 已包含在标准库中，可以从`node_modules/typescript/lib`文件夹类型定义文件`lib.es5.d.ts`

内置在标准库中的映射类型常用的有：

```ts
Readonly < T > --将T中类型都变为只读
Partial < T > --将T中类型都变为可选
Pick < T, U > --从T中提取包含U的类型
Exclude < T, U > --从T中剔除可以赋值给U的类型
Extract < T, U > --提取T中可以赋值给U的类型
Nullable < T > --将T中类型都变为可为null的联合类型
NonNullable < T > --从T中剔除null和undefined
ReturnType < T > --获取函数返回值类型
InstanceType < T > --获取构造函数类型的实例类型
```

## 七、总结

-   解决**单例类型**单一使用问题，可以使用 **联合类型** 或 **交叉类型**
-   解决联合类型 或 交叉类型中共有属性的访问报错问题，可以使用 **类型断言** 或 **类型保护**
-   解决相同类型重复书写问题，可以使用 **类型别名** **字符串字面量类型** 或 **可辨识联合类型**
-   解决动态类型定义问题，可以使用 **索引类型**
-   解决基于已有类型转换的问题， 可以使用 **映射类型**
