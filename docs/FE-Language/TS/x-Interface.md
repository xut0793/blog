# 接口 Interfaces

[[toc]]

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。接口的就是为类型检查定义检查标准，即值的结构必须按接口的定义去实现。

接口基本用法在[基础类型]()一节也讲过了。这里主要是对类相关的概念作个总结。

## 用接口定义值的结构

### 1. 用接口定义对象结构

```ts
interface IPerson {
	name: string
	age: number
}

const person: IPerson = {
	name: 'tom',
	age: 18
}
```

### 2. 用接口定义函数结构

```ts
interface ISum {
	sum(a: string, b: string): number
}

const sum: ISum
sum = function(a: string, b: string): number {
	return a + b
}
```

但一般函数不用接口定义，函数有更为便捷的类型约束方式

```ts
function sum(a: string, b: string): number {
	return a + b
}
```

### 3. 用接口定义数组结构

```ts
interface IList {
	[index: number]: number
}

const arr: IList = [1, 2, 3]
```

但一般数组也不用接口定义，数组有更为便捷的约束方式

```ts
const arr: number[] = [1, 2, 3]
```

### 4. 用接口定义类

关于类的基本知识请查看上节 [TS 中的类]()

或者更准确说法是： **用类去实现接口**。因为接口只是对类结构的一个描述规则，而类和类的实例是对这个规则的实现。

```ts
// 定义了一个报警器的接口规范，它有一个发出警告的方法alert
interface Alarm {
	alert(): void
}

// 防盗门可以安装报警器，所以Alarm可以在防盗门的类上实现
class SecurityDoor implements Alarm {
	constructor() {}
	alert() {
		console.log('be be be ...')
	}
}

// 汽车也有防盗报警功能，所以汽车的类也可以实现Alarm接口
class Car implements Alarm {
	constructor() {}
	alert() {
		console.log('di di di ...')
	}
}
```

一个完整的类是具有两部分： 静态部分 和 实例部分。一个类实现了一个接口时，只对其实例部分（实例属性和实例方法）进行类型检查，不会对类的静态部分（类的构造器和私有属性和方法）作类型检查。

所以可以创建一个辅助函数来分别定义：

```js
// 针对类的构造函数的接口,可以使用C标识
interface CCar {
    new(color:string)
}

// 针对类的实例部分的接口
interface ICar {
    alert():void
}

// 创建一个辅助函数传入类，返回实例，返回的实例类型符合接口ICar
function createCar(ctor:CCar, color:string):ICar {
    return new ctor(color)
}

// 定义一个类实例ICar
class Car implements ICar {
    constructor(color:string) {}
    alert() {
        console.log('di di di ...')
    }
}

let redCar = createCar(Car, 'red')
```

## 接口定义可选属性、只读属性、任意属性

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

### 可选属性

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

### 任意属性

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

### 只读属性

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

## 接口的合并、接口继承接口、接口继承类

### 合并接口

同名的接口会进行合并，合并的机制是把双方的成员放到一个同名的接口里。

```ts
interface Box {
	height: number
	width: number
}

interface Box {
	scale: number
}

let box: Box = { height: 5, width: 6, scale: 10 }
```

接口的非函数的成员应该是唯一的。如果它们不是唯一的，那么它们必须是相同的类型。如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。

对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。 同时需要注意，当接口 A 与后来的接口 A 合并时，后面的接口具有更高的优先级。

```ts
interface Cloner {
	clone(animal: Animal): Animal
}

interface Cloner {
	clone(animal: Sheep): Sheep
}

interface Cloner {
	clone(animal: Dog): Dog
	clone(animal: Cat): Cat
}
```

合并的效果类似如下声明：

```ts
interface Cloner {
	clone(animal: Dog): Dog
	clone(animal: Cat): Cat
	clone(animal: Sheep): Sheep
	clone(animal: Animal): Animal
}
```

注意每组接口里的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置。这是因为重载函数的匹配优先级是从上到下的。

有一个例外是当出现特殊的函数签名时。 如果签名里有一个参数的类型是 单一的字符串字面量（比如，不是字符串字面量的联合类型），那么它将会被提升到重载列表的最顶端。

比如下例：

```ts
interface Document {
	createElement(tagName: any): Element
}
interface Document {
	createElement(tagName: 'div'): HTMLDivElement
	createElement(tagName: 'span'): HTMLSpanElement
}
interface Document {
	createElement(tagName: string): HTMLElement
	createElement(tagName: 'canvas'): HTMLCanvasElement
}
```

合并后的 Document 将会类似下面这样效果：

```ts
interface Document {
	createElement(tagName: 'canvas'): HTMLCanvasElement
	createElement(tagName: 'div'): HTMLDivElement
	createElement(tagName: 'span'): HTMLSpanElement
	createElement(tagName: string): HTMLElement
	createElement(tagName: any): Element
}
```

### 继承接口

接口也可以相互继承，能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```ts
interface Shape {
	color: string
}

interface Square extends Shape {
	sideLength: number
}

let square = <Square>{}
square.color = 'blue'
square.sideLength = 10
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```ts
interface Shape {
	color: string
}

interface PenStroke {
	penWidth: number
}

interface Square extends Shape, PenStroke {
	sideLength: number
}

let square = <Square>{}
square.color = 'blue'
square.sideLength = 10
square.penWidth = 5.0
```

### 接口继承类

接口也可以继承类：

```ts
class Point {
	x: number
	y: number
}

interface Point3d extends Point {
	z: number
}

let point3d: Point3d = { x: 1, y: 2, z: 3 }
```

## 接口定义混合类型

上面说过，可以使用接口的方式来定义一个函数需要符合的形状：

```ts
interface SearchFunc {
	(source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {
	return source.search(subString) !== -1
}
```

函数也是对象，所有有时候，一个函数还可以有自己的属性和方法：

```ts
interface Counter {
	(start: number): string
	interval: number
	reset(): void
}

function getCounter(): Counter {
	let counter = <Counter>function(start: number) {
		return start.toString()
	}
	counter.interval = 123
	counter.reset = function() {
		this.interval = 0
	}
	return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```
