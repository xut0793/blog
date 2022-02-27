# 泛型 Generics

[[toc]]

## 泛型定义

泛型（Generics）是指在定义函数、接口或类的时候，我们不能预先确定具体的类型，但我们能明确可能有哪些类型及类型作用范围，此时在定义时可以先使用一个类型变量来代替具体的类型，在实际使用的时候，编译器会推断当前类型变量指代的实际类型。

看官网的例子：

我们想要设计一个函数，函数的作用是返回任何我们传入的东西，JS 写法中是这样：

```ts
function identity(arg) {
	return arg
}
```

对这个函数，我们期望是你传入什么类型，我返回什么类型。但是在实际调用时你可能传入的具体类型我是不知道的，我唯一明确的一点是函数的返回值跟你传入的 arg 参数的类型是相同的。

大概是像这个样子：

```ts
function identity(arg: T): T {
	return arg
}
```

### 泛型变量

其中 `T` 是我们用来指代某一种类型的变量，叫做类型变量，或者 泛型变量。你可以使用不同的名称，只要在数量上和使用方式上能对应上就可以。一般我们会使用单个大写字母来表示。

但像上面这样定义函数，在书写时编译器就会提示报错，编译时提示报错信息是：`Cannot find name 'T'.` 找不到`T`这个类型定义。

所以我们使用类型变量，也有点像在 JS 中使用变量一样，需要事先声明类型变量。这里声明的位置就是函数名后面，像下面这样：

```ts
function identity<T>(arg: T): T {
	return arg
}
```

此时就可以正常使用了。

```ts
console.log(identity(100))
```

上面这种`identity<T>`跟我们之前讲的类型断言的形式有点类似`<string>arg`，泛型使用类型变量放在后面，类型断言使用具体类型放在前面。

泛型基本都用在引用数据类型上，因为只有引用类型的才具体复杂类型，基本类型都是单例类型。

所以我们接着看下分别在函数、数组、对象、类上使用泛型。

-   第一步：声明泛型变量：类似`变量名<泛型变量>`形式
-   第二步：使用泛型变量

### 1. 泛型定义函数

```ts
// 直接函数定义泛型
function identity<T>(arg: T): T {
	return arg
}

// 泛型接口定义函数
interface IIdentityFn<T> {
	(arg: T): T
}

let myIdentity: IIdentityFn = identity
```

### 2. 泛型数组

```ts
// [index:keyType]:valueType 可索引接口形式
interface INumberArray<T> {
	[index: T]: T
}
let arr: INumberArray<number> = [1, 2]

// elemType[] 形式
let arr: number[] = [1, 2]

// Array<elemType> 形式
let arr: Array<number> = [1, 2]
```

### 3. 泛型接口定义对象

```ts
interface ISport<T> {
	length: number
	sprots: T[]
}
let favoriteSport: ISport<string> = {
	length: 1,
	sprots: ['basketball']
}
```

### 4. 泛型接口定义类

```ts
class GenericNumber<T> {
	zeroValue: T
	add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
	return x + y
}
```

## 多个泛型变量

定义泛型的时候，可以一次定义多个类型参数：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
	return [tuple[1], tuple[0]]
}

swap([7, 'seven']) // ['seven', 7]
```

上例中，我们定义了一个 swap 函数，用来交换输入的元组。

## 泛型约束

泛型指代不确定的类型，所以在函数或类定义某些只限具体类型才能使用的属性或方法时就会报错，比如下面：

```ts
function loggingIdentity<T>(arg: T): T {
	console.log(arg.length)
	return arg
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```

上例中，泛型 T 不一定包含属性 length，比如 number 类型就没有 length，所以编译的时候报错了。

这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束：

```ts
interface Lengthwise {
	length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
	console.log(arg.length)
	return arg
}
```

上例中，我们使用了 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性。

**多个泛型参数间的约束**

```ts
function copyFields<T extends U, U>(target: T, source: U): T {
	for (let id in source) {
		target[id] = (<T>source)[id]
	}
	return target
}

let x = { a: 1, b: 2, c: 3, d: 4 }

copyFields(x, { b: 10, d: 20 })
```

上例中，我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。

另外一个：使用一个之前在索引类型中的例子：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key]
}

let x = { a: 1, b: 2, c: 3, d: 4 }

console.log(getProperty(x, 'a'))
console.log(getProperty(x, 'c')) // Argument of type '"c"' is not assignable to parameter of type '"a" | "b"'.
```

上例中，我们使用了两个类型参数，其中要求`K`继承自`keyof T`中，这样就保证出现不在`keyof T`中的属性就会提示报错。

## 泛型参数的默认类型

在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

注意泛型类型参数默认值还是在泛型参数声明的地方。

```ts
function createArray<T = string>(length: number, value: T): Array<T> {
	let result: T[] = []
	for (let i = 0; i < length; i++) {
		result[i] = value
	}
	return result
}
```
