# 类型检查 type checking

TypeScript是一种带有**类型语法**的JavaScript。
TypeScript 中的类型系统要求：显式**声明**部分类型，然后在编译时会**推导**余下类型，并在编译时**检查**类型。

前面讲解了
- [TS 如何声明各种类型](1-type-declaration-1.1-basic-type.md)
- [TS 如何推导类型](2-type-inference.md)

这一节讲解 TS 如何进行类型检查，包含以下内容：
- 明确赋值检查[P38]
- 可赋值性检查[P148]
  - 类型兼容性：超类型、子类型[P139]
  - 类型型变 [P141]
    - 对象和数组的型变（协变）
    - 函数的型变（参数逆变，返回值协变）
- 多余属性检查[P151]
  - 新鲜对象字面量类型(fresh object literal type)
- 全面性检查（穷尽性检查）[p159]
  - switch 的 default 分支增加 never 类型赋值保证穷尽性。`const exhaustiveCheck: never = val`

## 明确赋值检查

先声明变量，再对变量进行初始化赋值是 JS 中一种常见的模式，在 TS 中也支持，并且 TS 的类型系统会确保，程序中使用该变量时已经明确为其赋值了。[P38]

```ts
let i: number
let j = i * 3 // Error TS2454: Variable 'i' is used before being assigned.

// 即便没有显式注解类型， TS 也会强制检查
let a
let b = a * 3 // Error TS2532: Object is possibly 'undefined'.
```

## 可赋值性检查 [P148]

TS 在判断 “ A 类型是否可以赋值给 B 类型？” 时，遵循几个简单的规则：
- `A <: B`：如果 A 是 B 的子类型，那么在可以使用 B 的地方也可以使用 A。
- A 是 any 类型，因为 any 既是所有类型的超类型，也是所有类型的子类型，即 any 是 `top type` 也是 `bottom type`。

这里涉及到类型兼容性的几个概念：超类型、子类型、型变（不变、协变、逆变、双变）。

### 类型兼容性：超类型、子类型 [P139]

如果类型 A 是类型 B 的子类型，那返过来说，B 就是 A 的超类型。

为了便于理解，使用自定义的一套句法表示：`A <: B` 指 A 类型是 B 类型的子类型，或者为同种类型，那对应的 `B >: A` 指 B 类型是 A 类型的超类型，或者为同种类型。

对于 TS 中基础类型的兼容性，可以用下面一种图来述[P27]：
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
```
- 所有字面量类型都是对应基类型的子类型
- 数字枚举是 number 类型的子类型，字符串检举是 string 的子类型
- 元组是数组的子类型
- any 即是 top type 也是 bottom type，就是说 any 既是所有类型的超类型，也是所有类型的子类型，
- unknown 是 top type，是所有类型的超类型
- never 是 bottom type，是所有类型的子类型
- 联合类型是各个成员类型的超类型

### 类型型变 [P141]

对于基础类型来说，对照上图可以很容易判断 A 类型是不是 B 类型的子类型，但是对于泛型（参数化类型）或者其它复杂类型的情形，就不是那么直接明确了。比如：
- 什么情况下结构化类型 A 对象是结构化类型 B 对象的子类型？
- 什么情况下 `Array<A>` 是 `Array<B>` 的子类型？
- 什么情况下函数 `(a: A) => B` 是函数 `(c: C) => D` 的子类型？

型变包含四种情况：
- 不变，就是说只能是类型 T
- 协变：可以是类型 T 的子类型或相同类型，即 `A <: T`
- 逆变：可以是类型 T 的超类型或相同类型，即 `A >: T`
- 双变：即可以是类型 T 的子类型，也可以是它的超类型，或者相同类型，即 `A <: T` 或 `A >: T`

#### 对象和数组的型变（协变）

TS 的类型系统采用的设计风格是结构化类型(Structural type)，而不是名义化类型(Nominal type)，TS 类型的这种设计风格是直接沿用 JS 对象所采用结构化类型的设计风格。
结构化类型是一种编程设计风格，它只关心对象有哪些属性，而不管属性使用什么名称。只要两个对象的结构所描述的属性值的类型是兼容的，就认为两个对象类型是兼容的。
> 结构化类型也被称为照鸭子类型（duck typing），指的是当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。
> 名义化类型表示类型若要相等，就必须具有相同的“名字”

所以说判断对象类型的兼容性，TS 的行为是这样：**如果 A 对象可赋值给 B 对象，那么会检查 A 对象中是否有 B 对象声明的每个属性，且 A 对象中这个属性的类型必须是 B 对象对应属性的子类型**。

也就是说 TS 对结构（对象、类、数组）的属性进行了协变。

同样的，对于数组或元组，如果数组 A 中元素的类型是数组 B 中相同索引元素的子类型，那数组 A 是可以赋值给数组 B 的。

> 不是所有编程语言都采用这种结构化类型协变的规则。在某些语言中，对象的属性类型“不变”，有些语言对可变对象和不可变对象有不同的规则，有些语言甚至要显式指定对数据类型进行型变的句法。
> 不允许型变对象的属性类型，安全性是提高了，但是会导致类型系统用起来更烦琐，而且会禁止某些实际上安全的操作，所以 TS 类型系统在易用性和安全性上做出了权衡，选择了协变规则。[P144]

```ts
/**
 * 缩写一个删除用户的函数
 * 应用中存在三种类型的用户对象 ExistingUser NewUser LegacyUser
 */
type User = {
	id?: number,
	name: string,
}
function deleteUser(user: User) {
	if (user.id) delete user.id
	return user
}

type ExistingUser = {
	id: number,
	name: string,
}
let existingUser: ExistingUser = {
	id: 123446,
	name: 'exsiting user',
}
deleteUser(existingUser)
```
要判断函数是否可以接受 existingUser 入参，TS 类型检查的可赋值性检查规则会检查 ExistingUser 类型是否是 User 类型的子类型。 
因为 deleteUser 函数接受一个对象参数，根据对象结构化类型的协变规则，会判断实参对象的每个属性类型是否是形参对象属性的子类型。

上例中：函数形参的类型 User 是 `{id?:number, name: string}`，而我们传入的实参类型 ExistingUser 是 `{id: number, name: string}`，其中 name 属性都是 string，符合协变规则；而 id 属性，传入的 number 类型是预期类型 number | undefined 的子类型，所以作为整体 `{ id: number, name: string }` 是 `{ id?: number, name: string }` 的子类型，所以 `deleteUser(existingUser)` 不会报错。

同样的，如果传入一个新用户，NewUser 中 id 类型是 undefined, 是 User 中可选 Id 属性类型 number | undefined 的子类型，所以 NewUser 是 User 的子类型。

```ts
// 还未保存到数据库的新用户没有 id
type NewUser = {
	name: string,
}
let newUser: NewUser = {
	name: 'new user'
}
deleteUser(newUser)
```
但是如果传入一个遗留的旧用户数据，LegacyUser 中可选属性 id 的类型是 `number | string | undefined` 是 User 中可选属性 id 类型 `number | undefined` 的超类型，所以整体类型 LegacyUser 是 User 的超类型，不符合结构化类型协变规则，作为函数实参会提示报错。
```ts
type LegacyUser = {
	id?: number | string,
	name: string,
}
let legacyUser: LegacyUser = {
	id: '654321',
	name: 'legacy user'
}
deleteUser(legacyUser) 
// Error TS2345: Argument of type 'LegacyUser' is not assignable to parameter of type 'User'.
// Types of property 'id' are incompatible.
//   Type 'string | number | undefined' is not assignable to type 'number | undefined'.
//     Type 'string' is not assignable to type 'number | undefined'.
```

#### 函数的型变（参数逆变，返回值协变）

对于函数，如果要函数 A 是函数 B 的子类型，那么必须同时符合以下规则：
- 函数参数符合逆变规则：函数 A 的 this 类型和参数的类型都必须是函数 B 的 this 类型和对应参数类型的超类型
- 函数返回值符合协变规则：函数 A 的返回值类型是函数 B 返回值类型的子类型。

```ts
// 待补充例子
```

## 多余属性检查 [P151]

TS 在检查一个对象是否可以赋值给另一个对象类型时会做协变：如果 A 对象可赋值给 B 对象，那么会检查 A 对象中是否有 B 对象声明的每个属性，并且要求 A 对象中这个属性类型必须是 B 对象对应属性的子类型。

但是如果 TS 严守这个规则，而不做额外的检查，将导致一个问题：
```ts
// 假如有个 Options 对象，我们把它传给类做些配置
type Options = {
  baseURL: string,
  cacheSize?: number,
  env?: 'prod' | 'dev'
}
calss API {
  constructor(private options: Options){}
}

/**
 * 此时实参类型符合 Options 类型的声明，一切正常
 */
new API({
  baseURL: 'https://api.site.com',
  env: 'prod',
})

/**
 * 假如现在实参有一个拼写错误的属性 evn，TS 会报错提示
 */
new API({
	baseURL: 'https://api.site.com',
	evn: 'dev',
  // Error TS2345: Argument of type '{ baseURL: string; evn: string; }' is not assignable to parameter of type 'Options'.
  //               Object literal may only specify known properties, and 'evn' does not exist in type 'Options'.
  //               参数类型'{ baseURL: string; evn: string; }'不能赋值给类型为'Options'的参数。
  //               对象字面量只能指定已知的属性，而'evn'在类型'Options'中不存在。
})
```
根据 TS 对象类型的可赋值性规则，分析这个实参类型与形参类型的兼容性：
- 预期的形参类型 A 是 `{ baseURL: string, cacheSize?: number, env?: 'prod' | 'dev'`，而传入的实参类型 B 是 `{baseURL: string, evn: string }`
- 根据结构化类型协变的规则，B 中有 A 在必须的类型 `baseURL: string`，对 A 中其它属性类型都是可选的，所以从这里判断 B 是 A 的子类型，`B <: A`

传入函数的实参类型是形参类型的子类型，TS 为什么还要报告错误？

这就是 TS 类型检查的另一个规则：多余属性检查。具体行为是：
- 当尝试把一个**新鲜**的对象字面量类型(fresh object literal type) T 赋值给另一个类型 U 时，如果 T 中有不在 U 中声明的属性，TS 将报错。

### 新鲜对象字面量类型(fresh object literal type)

这里特别注意这个 **新鲜** 的理解：
- 新鲜的对象字面量类型：指的是 TS 直接从对象字面量中推导出来的类型。
- 如果一个对象字面量类型有类型断言，或者把它赋值给了一个变量，那么它将不再新鲜，它的类型也会被拓宽为常规的对象类型。

```ts
// 实参是新鲜的对象字面量类型
new API({
  baseURL: 'https://api.site.com',
  env: 'prod',
})

// 实参是新鲜的对象字面量类型，将执行多余属性检查和可赋值性检查，报错
new API({
  baseURL: 'https://api.site.com',
  badEnv: 'prod', // Error TS2345
})

// 实参执行了类型断言，不再是新鲜对象字面量类型，不会执行多余属性检查，只执行可赋值性检查（见上例分析过程），所以不会报错。
new API({
  baseURL: 'https://api.site.com',
  badEnv: 'prod',
} as Options)

// 字面量类型赋值给了变量，不再是新鲜对象字面量类型，不会执行多余属性检查，只执行可赋值性检查（见上例分析过程），所以不会报错。
let badOptions = {
  baseURL: 'https://api.site.com',
  badEnv: 'prod',
}
new API(badOptions)

// 显式注解 options 的类型为 Options，此时赋值的仍是新鲜字面量类型，并在 let options 变量初始化时就执行多余属性检查和可赋值性检查，而不是在函数传入实参时检查。
let options: Options = {
  baseURL: 'https://api.site.com',
  badEnv: 'prod', // Error TS2345
}
new API(options)
```
## 全面性检查（穷尽性检查）[p159]

> 程序员睡觉之前会在床头柜上放两个杯子，一个杯子装满水，防止口渴；另一个杯子空着，防止不渴。 -----佚名

全面性检查（也称为穷尽性检查）也是 TS 类型检查中的一项，它会在发现缺少某种分支判断的情况下报错提醒，确保所有分支情况都被覆盖。这样能让代码避免很多问题。
> 这个概念源自基于模式匹配的语言，如 Haskell OCaml 等。

不管使用哪种流程控制语句(`switch / if / throw` 等)，TS 都能在未涵盖所有情况时做出提醒。

```ts
// Error TS7030: Not all code paths return a value. 不是所有的代码路径都返回值。
function isBig(n: number) {
  if (n >= 100) {
    return true
  }
}
```
```ts
interface Foo {
  type: 'foo'
}
interface Bar {
  type: 'bar'
}
type All = Foo | Bar

// Error TS7030: Not all code paths return a value. 不是所有的代码路径都返回值。
function handleValue(val: All) {
	switch(val.type) {
		case 'foo':
		// do something
		return val.type
	}
}

/**
 * 要解决上面的报错，必须穷举联合类型 All 中 type 的类型
 */
 function handleValue(val: All) {
	switch(val.type) {
		case 'foo':
      // 这里 val 类型被细化为 Foo
		return val.type
		case 'bar':
		  // 这里 val 类型被细化为 Bar
		return val.type
	}
}

/**
 * 上面 handleValue 函数对分支穷尽，即便后面有一天你的同事改了 All 的类型：type All = Foo | Bar | Baz，但它忘记了在 在 handleValue 里面加上针对 Baz 的处理逻辑。仍然会提示 Error TS7030
 * 但是如果对于使用了 default 默认分支时，情况就不一样了。上述错误会执行default，隐藏了错误。
 */
function handleValue(val: All) {
	switch(val.type) {
		case 'foo':
      // 这里 val 类型被细化为 Foo
		return val.type
		case 'bar':
		  // 这里 val 类型被细化为 Bar
		return val.type
    default:
      return null
	}
}

/**
 * 此时可以使用一个 hack 的方法，在 default 分支中做一个兜底处理： 将 val 赋值给一个 never 类型变量。
 * 如果 val 被穷尽 (exhaust)了，那在 default 分支，val 的类型自然就是 never，赋值给 exhaustiveCheck 变量不会报错。
 * 如果临时增加了 ALL 的类型，又没有添加对应的处理逻辑时，遗漏的类型会进入 default 分支，一个非 never 类型的变量赋值给 never 类型将会报错。
 * 所以通过这个办法，对使用了 default 分支的代码，你可以确保 switch 总是穷尽 (exhaust) 了所有 All 的类型。
 */
function handleValue(val: All) {
	switch(val.type) {
		case 'foo':
      // 这里 val 类型被细化为 Foo
		return val.type
		case 'bar':
		  // 这里 val 类型被细化为 Bar
		return val.type
    default:
      const exhaustiveCheck: never = val
      return null
	}
}
```
这里添加一个书中逐渐完善类型检查的例子。
```ts
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

function getNextDay(w: Weekday): Day {
	switch(w) {
		case 'Mon': return 'Tue'
		case 'Tue': return 'Wed'
		case 'Wed': return 'Thu'
		case 'Thu': return 'Fri'
		case 'Fri': return 'Sat'
	}
}

/**
 * 上述例子，大部分人会改造成使用对象映射的方式。
 * 代码编写被中断了，回头又忘记继续补全日期，那下次直接访问其它星期时就会报错。
 */
let nextDay = {
	Mon: 'Tue'
}
nextDay.Mon
nextDay.Tue // Error TS2339: Property 'Tue' does not exist on type '{ Mon: string; }'.

/**
 * 虽然在访问时有报错提示，但是如果加强对 nextDay 声明时的类型安全措施，可以让错误提示更为友好
 * 
 * 我们的预期是 nextDay 对象属性的键必须是 Weekday 类型，属性的值是 Day 类型，此时要如何进行类型注解呢？
 * 
 * 使用常规的对象的索引类型签名，只能约束属性的键为 `string | number | symbol` 类型，不能约束为预期的 Weekday 类型，不能约束为预期的星期类型
 */
type NextDay = {
	[key: string]: Day
}
let nextDay: NextDay = {
	Mon: 'Tue'
}

/**
 * 此时可以使用 TS 内置的 Record 工具类型，来描述键值有映射关系的对象
 * Record 类型相比索引签名的区别，使用 Record 可以约束对象的键为 string 或 number 的子类型。
 */
type NextDay = Record<Weekday, Day>
// 此时在对象声明时就会提示报错，而不是对象访问时才报错提示，并且错误信息更友好
// Error TS2739: Type '{ Mon: "Tue"; }' is missing the following properties from type 'NextDay': Tue, Wed, Thu, Fri
let nextDay: NextDay = {
	Mon: 'Tue'
}

/**
 * 另一种方式是直接使用 TS 的 in 运算符，声明映射类型，这也是 Record 类型内部实现的源码。
 */
type NextDay = {
  [K in Weekday]: Day
}
// Error TS2739: Type '{ Mon: "Tue"; }' is missing the following properties from type 'NextDay': Tue, Wed, Thu, Fri
let nextDay: NextDay = {
	Mon: 'Tue'
}

/**
 * 完整示例
 */
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'
type NextDay = Record<Weekday, Day>
let nextDay: NextDay = {
	Mon: 'Tue',
	Tue: 'Wed',
	Wed: 'Thu',
	Thu: 'Fri',
	Fri: 'Sat',
}

/**
 * 延伸 Record 类型的实现
 * keyof any 结果是 string | number | symbol
 * K extends keyof any 是泛型约束，K 只能为  string | number | symbol 联合类型的子类型
 */
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

