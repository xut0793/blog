# Typescript 类型系统

> 参考 《Typescript 编程》

[[toc]]

`Typescript`是在`Javascript`语言的基础上，提供了语言的**静态类型系统**，而且这套类型系统是图灵完备的，完全可以进行元编程的类型语言。

所以理解 Typescript 可以划分为两个层面：
- 值层面：即有效的 JS 代码
- 类型层面：即 TS 附加的类型系统，包括类型和类型运算符，可以实现类型编程

## 类型系统

**类型系统指类型检查器为程序分配类型时使用的一系列规则。**

现代语言采用的类型系统不尽相同，一般来说，类型系统有两个极端：
- 一种是通过显式句法告诉编译器值的类型
- 另一种是自动推导值的类型

比如：
- Java 和 C 语言几乎需要显式注解所有类型，然后在编译时检查。
- Javascript / Python / Ruby 等在运行时自动推导类型，Haskell 和 OCaml 在编译时推导和检查类型
- Typescript 和 Scala 则兼容两种，要求显式注解部分类型，然后在编译时自动推导和检查余下部分的类型


## 类型

**类型是指一系列值和可以对值执行的操作**

比如说：
- `boolean`类型包含两个布尔值(true / false)，以及可以对布尔值执行的操作，如 || / && / ! 等
- `number`类型包含所有数字，以及可以对数字执行的操作，如 + - * / % || && ? 等
- `string`类型包含所有字符串，以及可以对字符串执行的操作，如 + .concat .toUpperCase 等

所以当我们知识某个值是什么类型时，就知道可以对这个值进行什么样的操作，不属于这个类型的操作则报错，这些检查在编译时由类型检查器执行。

## 基类型

```
                                                             +---------+
                                                             | unknown |
                                                             +----+----+
                                                                  |
                                                                  |
                                                                  v
                                                             +----v----+
                                                             |   any   |
                                                             +----+----+
                                                                  |
                                                                  |
                                                                  v
     +------------+----------------------+-----------+-------------------------+------------+---------------------+
     |            |                      |           |            |            |            |                     |
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
     |            |                      |           |            |                          |                    |           |              |
     |            |                      |           |            |                          |                    v           |              |
     |            |                      |           |            |                          |                +---+-----+     |              |
     |            |                      |           |            |                          |                |  tuple  |     |              |
     |            |                      |           |            |                          |                +---+-----+     |              |
     |            |                      |           |            |                          |                    |           |              |
     v            v                      v           v            v                          v                    v           v              v
     +------------+----------------------+-----------+---------------------------------------+--------------------+-----------+--------------+
                                                                  |
                                                                  |
                                                                  v
                                                              +--------+
                                                              | never  |
                                                              +--------+

```
- array 数组应该保持同质化，即保证数组中的每个元素都具有相同的类型。
- tupe 元组是数组的子类型，表示长度固定，各索引位置的值具有固定的已知类型，但不一定是相同的类型。
- null 表示缺少值
- undefined 表示尚未赋值
- void 表示没有显式 return 返回值的函数的返回类型
- never 表示函数根本不会有返回值时函数的返回类型，如函数内部 throw 抛出异常，或死循环的情况。never 是所有类型的子类型，但基本只具有理论意义，不会把 never 赋值给其它类型。
- unknown 同 any 类似也表示任务值，是其它所有类型的父类型，但是与 any 区别时在使用 unknown 类型的值进行操作时， TS 会要求你细化类型，明确是某一种类型才可以，所以比使用 any 更安全。
- 普通的 enum 编译之后会保留下来，用 const enum 通常情况下编译之后不会保留下来

## 字面面类型

**字面量类型指仅表示一个值的类型**
```ts
let a: true = true
let b: 1 = 1
```

## 索引签名

`[key: T]: U` 这样表达称为索引签名。用在对象的类型注解中，快速建立一个内部字段类型相同的接口。

所以在声明对象类型时，除了显式声明键值的类型外，还可以借助索引签名定义对象更多的键值。

```ts
type Arr = {
  length: string,
  [key: number]: string,
}

let simulateArr:Arr = {
  length: 3,
  '0': 'A',
  '1': 'B',
  '2': 'C',
}
```

## 类型别名和接口

接口 interface 是对结构建模的方式，对应值层面可以表示对象、数组、函数、类等。
类型别名 type 属于类型层面的编程，为某种类型定义一个别称，相当于值层面的定义变量。

类型别名 type 和接口 interface 都是命名类型的方式，算是同一概念的两种句法，就像函数表达式和函数声明之间的关系。

- 共同点：
都可以定义结构化类型。
```ts
type User = {
  name: string
  age: number
}

interface User = {
  name: string
  age: number
}
```
也可以对结构化类型进行扩展
```ts
// type
type Person = {
  name: string
  age: number
}

type Male = Person & {
  gender: 'male'
}

type Female = Person & {
  gender: 'female'
}

// interface
interface Person {
  name: string
  age: number
}

interface Male extends Person {
  gender: 'male'
}

interface Female extends Person {
  gender: 'female'
}
```
- 不同点：

1. 类型别名更通用，右边可以是任何类型，包括number / boolean / string 等基础类型和对象的结构类型，也可以是类型表达式，如联合类型、交叉类型等。但接口声明中，右边必须为结构化类型。
2. 扩展接口时，TS 会检查扩展的接口是否可以赋值给被扩展的原接口，比如扩展中有一个同名但不同类型的属性时会报错。而使用类型接口时，同名不同类型时，TS会扩宽该同名属性的类型，形成联合类型。
3. 同名的接口会进行声明合并，即自动把多个同名的接口组合在一起。但声明同名的接口类型时会报错。
4. 接口可用于类的实现 `class xx implements interface1, interface2 {}`

## 类型兼容性、子类型和父类型、可赋值性

1. 类型兼容性

TypeScript的类型系统是结构类型系统（Structural type system），也称鸭子类型（duck typing），指的是如果任意声明的类型，如果它们是以相同的结构来描述值的类型，那么它们是兼容的，也可以说是等价的。

与之对应的另一种类型系统是声明类型系统(Nominative type system)，就是两个类型若要相等，就必须具有相同的“名字”。

> 当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子

2. 子类型和父类型

给定两个类型 A 和 B，如果 B 是 A 的子类型，那对应的 A 称为 B 的父类型，么意味着在任何可以使用父类型 A 的地方，可以放心地使用子类型 B。

- 子面量类型都是对应基类型的子类型
- 元组 tupe 都是数组 array 的子类型
- unknown 是 any 的子类型，其它类型都是 unknown 的子类型，所以所有类型也是 any 的子类型
- never 是所有类型的子类型。

3. 可赋值性：指在判断需要 A 类型的地方可否使用 B 类型时 TS 采用的规则：
- 对非枚举类型来说：如果 B 是 A 的子类型，则可赋值性判断成立。
- 对枚举类型(enum / const enum)来说：如果 B 是 A 的成员，则可赋值性判断成立，或者 A 至少有一个成员是 number 类型，且 B 类型是数字，则可赋值性判断成立。

## 型变：不变、协变、逆变、双变

## 类型拓宽和类型缩窄(也叫类型细化)



## 类型编程

什么是TypeScript的类型编程？

通过 TypeScript 运算符，把类型当作参数进行逻辑运算处理，从而获得新类型的过程称为类型编程。

TypeScript 看似简单的类型标注背后，其实是一门隐藏在类型空间里的强大编程语言。

### 类型运算符

```
// 修饰符
+: 修饰符加
-: 修饰符减
?: 可选修饰符
readonly: 只读修饰符

// 通用
instanceof：实例判断
typeof：类型判断，获取值的类型
type：类型别名
|： 联合类型
&： 交叉类型
!: 非空断言
as： 类型断言
is：类型保护(类型守卫)
extend: 类型约束，使得类型缩窄

// 对象类型的类型运算符
T[key]: 属性查找，获取对象某个属性值的类型
T[number]: 键入数组类型的方式，获取数组各个元素的类型
keyof: 获取对象所有的键，组成一个字符串字面量的联合类型
in: 映射类型，[K in P]:T 表示循环 P 中的每一项，赋予 T 类型


// 泛型函数类型的运算符
<>：泛型，用于声明一个或多个泛型参数，声明的位置决定了泛型参数的作用域
=: 定义泛型参数的默认值

// 条件类型的运算符

? ：条件运算符，常搭配类型约束 extends 来使用 T extends U ? X : Y。
条件类型的分配特性：没有被额外包装的联合类型参数（祼类型），在条件类型进行判定时会将联合类型分发，分别进行判断。 (T | U) extends U ? X : Y 等同于 (T extends U ? X : Y) | (U extends U ? X : Y)
infer U：声明待推断的类型 U，常用于条件类型中。（infer是inference的缩写）
```

### 声明类型变量的方式

把一个类型声明为变量，有三种方法：

- 泛型`<>`
- infer
- in

其中大部分都是通过泛型来引入，因此泛型是TS类型编程的基础。

### 内置的工具类型

```ts
/**
 * 条件工具类型
 *******************/
type Exclude<T, U> = T extends U ? never : T; // 获取在 T 中但不在 U 中的类型
type Extract<T, U> = T extends U ? T : never; // 获取 T 中可赋值给 U 的类型
type NonNullable<T> = T extends (null | undefined) ? never : T; // 排除 T 中不是 null undefined 的类型
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never; // 获取函数类型的参数类型组成的元组类型
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any; // 获取函数返回值类型
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never; // 获取类构建函数的参数类型，相当于 Parameters，但它用于类
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any; // 获取一个类的实例类型，相当于 ReturnType，但它用于类
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown; // 获取函数 this 的类型，如果没有返回 unknown 类型

/**
 * 对象映射工具类型
 *******************/
// 把 T 类型中的每个字段都转为可选属性的新类型
type Partial<T> = {
  [K in keyof T]?: T[k];
};

// 将可选属性转为必要属性的新类型
type Required<T> = {
    [K in keyof T]-?: T[K];
};

// 转为只读属性的新类型
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};

// 创造一个新类型，同时将 Keys 中所有的属性的值的类型转化为 T 类型。
// 这里的 keyof any 也可以用内置的 PropertyKey 代替，等同于 number | string | symbol，即可用作对象属性的联合类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

/**
 * 对象属性裁剪工具类型
 **********************/
// 在 T 类型中的 Keys 类型提取出来，创建为一个新类型。
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// 从 Type 的所有属性中，移除 Keys 键用剩下的键来创建新类型。
type Omit<T, K extends keyof any> = { 
  [P in Exclude<keyof T, K>]: T[P];
}

```
社区中也有更多的工具类型，可以参照[utility-types](https://github.com/piotrwitek/utility-types)

