# 类 class

[[toc]]

## 类 相关的概念

**发展：**

- 传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链实现继承。
- ES6 中使用 class 关键字声明类
- TS 中除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法，比如类的修饰符

**基本概念：**

- 面向对象（OOP）的三大特性：封装、继承、多态
  - 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
  - 继承（Inheritance）：派生类（子类）继承基类（父类），派生类除了拥有基类的所有特性外，还有一些更具体的特性
  - 多态（Polymorphism）：由继承产生相关的不同的类，对同一个方法可以有不同的实现，呈现多种状态。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat
- 类(Class)：类是面向对象的实现，定义了一件事物的抽象特点，包含它的成员和方法等
  - 构造器（constructor)： 创建对象实例的构造函数
  - 成员（property)：静态属性和实例属性
  - 方法（method)：静态方法和实例方法
  - 存取器（getter & setter）：用以改变属性的读取和赋值行为
  - 修饰符（modifiers）：修饰符是一些关键字，用于限定成员或类型的性质，包括 readonly public protected private static abstract
- 对象（Object）：类的实例，通过 new class 生成
- 抽象类（Abstract Class）：使用 abstract 修饰符，抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口
- 其它：参数属性、静态块（static block)、ESnext 中 `#` 私有字段、派生类和基类初始化顺序、this 与 super

## 声明类

这是声明一个类最基本的语法，使用 `class` 关键字。
```ts
class Point {} 
```
上述结果声明了一个空类，空类没有任何成员。在 TS 结构类型系统中，没有成员的类型通常是其他任何类型的超类型，除 null undefined 外，任何类型的值都可以赋值给它，类型检查跟 `{}` 一样。
```ts
class Point {}
let a: Point
a = null			// Error TS2322: Type 'null' is not assignable to type 'Point'.
a = undefined	// Error TS2322: Type 'undefined' is not assignable to type 'Point'.
a = 12
a = 'ab'
a = {}
a = []
a = Symbol()

let d: {}
d = {}
d = {x: 1}
d = []
d = 2
d = 'a'
d = null      // Error TS2322: Type 'null' is not assignable to type '{}'.
d = undefined // Error TS2322: Type 'undefined' is not assignable to type '{}'.
```

## 构造函数 constructor

一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。

`constructor` 方法是类的默认方法，调用`new`命令创建实例时，自动调用该方法，

```ts
class Point {}
// 等同于
class Point {
	constructor() {}
}
```

类的构造函数与常规函数非常相似，通常在该函数中接受参数对实例属性进行初始化。您可以添加带有类型注释、默认值和重载的参数。区别是类构造函数不需要注解返回值类型，因为它总是返回实例对象。
```ts
class Point {
  x: number;
  y: number;
 
  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

// 重载构造函数
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

## 成员

类中直接声明的字段称为成员，使用与声明常规变量一样的类型注解，`value: T`。

成员声明并初始化的三种方式：
- 成员可以声明的同时直接初始化赋值
- 也可以先声明，然后在构造器中里初始化赋值
- 参数属性：在构造器中使用访问修饰符声明，TS 会默认该参数已初始化，具体值为new 时传入实参。

如果都没初始化赋值，TS 将报错提示。
```ts
class MyClass {
	a: number = 1
	b: number
	constructor(public c: number) {
		this.b = 2
	}
}
```

## 方法

类中的函数属性称为方法。方法使用与常规函数相同的类型注解。

```ts
class MyClass {
	getName(name: string): string {
		return name
	}
}
```

## 访问器成员

像对象的访问器属性一样，如果需要对成员访问和赋值作出某些限制约束时，可以定义它为访问器成员。

```ts
class MyClass {
	#value: number = 0
	get less5() {
		return this.#value
	}
	set less5(val) {
		if (val > 5 || val === 5) return
		this.#value = val
	}
}

console.log(test.less5)  // 0
test.less5 = 3
console.log(test.less5)  // 3
test.less5 = 10
console.log(test.less5)  // 3
```

## 修饰符 static readonly public protected private #

这些修饰符可以分为两类：
- `static` 修饰符：决定了该成员和方法附加的对象是类自身还是类的实例对象
- 其它的都归为访问修饰符：`readonly public protected private #`：限定了类中成员和方法可被访问范围

### static 静态成员和静态方法

`static` 修饰符与其它访问限定修饰符不一样，它决定了该成员和方法附加的对象。
- 没有添加时，成员和方法都附加在实例对象上，分别称为实例成员和实例方法。
- 添加 static 时，成员和方法都附加在类自身上，分别称为静态成员和静态方法。

```ts
class User {
	name: string = 'tom'
	sayHi() {
		console.log(this.name); // 实例方法中的 this 指身实例对象 this === new User
	}
	static staticProperty = 'static property'
	static describe() {
		console.log(this.staticProperty) // 静态方法中的 this 指向类型自身 this === User
	}
}

// 静态成员和方法只能通过类自身访问
User.staticProperty
User.describe()

// 实例成员和方法只能通过类的实例对象访问
const user = new User()
user.name
user.sayHi()
```

### static 静态块

静态块作用域是 ES2022 的新特性[class static initialization blocks]()，是一个完善 class 的功能。
> 参考链接 [精读《class static block》](https://juejin.cn/post/7007219984145317902)

```ts
class MyClass {
	static {
		console.log(this === MyClass) // true
	}
}
```
为什么我们需要 class static block 这个语法呢？
在一个类，我们可以在构造器中完成对实例属性的批量初始化，但如果想在类内部对静态属性做批量初始化，在以前就不得不写一些冗余的代码。
```ts
class Translator {
  static translations = {
    yes: 'ja',
    no: 'nein',
    maybe: 'vielleicht',
  };
  static englishWords = [];
  static germanWords = [];
  static _ = initializeTranslator( // (A)
    this.translations, this.englishWords, this.germanWords);
}
function initializeTranslator(translations, englishWords, germanWords) {
  for (const [english, german] of Object.entries(translations)) {
    englishWords.push(english);
    germanWords.push(german);
  }
}
```
我们必须把 `initializeTranslator` 写在类外面，因为在 Class 内部不能写代码块，但这造成一个严重的问题，是外部函数无法访问 Class 内部属性，所以需要定义一个作为中介的静态方法 `-`，然后做一堆枯燥的传值。所以为了自定义一段静态变量初始化逻辑，需要做出两个妥协：
- 在外部定义一个函数，并接受大量 Class 成员变量传参。
- 在 Class 内部定义一个无意义的变量 _ 用来启动这个函数逻辑。

这就是 class static block 提案的动机，句法是 static 关键字后面不跟变量，而是直接跟一个代码块，在这个代码块内部可以通过 this 访问到类的自身，也就是可以访问类中所有定义的静态成员和方法。
```ts
class Translator {
  static translations = {
    yes: 'ja',
    no: 'nein',
    maybe: 'vielleicht',
  };
  static englishWords = [];
  static germanWords = [];
  static { // (A)
    for (const [english, german] of Object.entries(this.translations)) {
      this.englishWords.push(english);
      this.germanWords.push(german);
    }
  }
}
```
静态块执行顺序：
- 静态块状只在类声明的时候执行一次，所以执行时机肯定比 new class 时才执行构造器函数之前。
- 一个类中可以定义多个静态块，按定义的先后顺序执行。
- 父类和子类中的静态也是父类先执行。
```ts
class SuperClass {
  static superField1 = console.log('superField1');
  static {
    assert.equal(this, SuperClass);
    console.log('static block 1 SuperClass');
  }
  static superField2 = console.log('superField2');
  static {
    console.log('static block 2 SuperClass');
  }
}

class SubClass extends SuperClass {
  static subField1 = console.log('subField1');
  static {
    assert.equal(this, SubClass);
    console.log('static block 1 SubClass');
  }
  static subField2 = console.log('subField2');
  static {
    console.log('static block 2 SubClass');
  }
}

// Output:
// 'superField1'
// 'static block 1 SuperClass'
// 'superField2'
// 'static block 2 SuperClass'
// 'subField1'
// 'static block 1 SubClass'
// 'subField2'
// 'static block 2 SubClass'
```

### 访问修饰符

访问修饰符的作用是不让类暴露过多的实现细节，只开放规定的 API，这是类封装特性的体现。
访问修饰符限定类中成员和方法可被访问范围，它可以作用于实例成员和方法，也可以作用于静态成员和方法
- `readonly`: 用于修饰成员，成员初始化后，只能访问，不能再赋值。
- `public`：公共的，默认值修饰符，在任何地方都可以访问，包括类内部和外部，基类和派生类
- `protected`：受保护的，只能在类本身和派生类中访问，在实例对象中不允许访问
- `private`：私有的，可访问范围更窄，只能在类自身中被访问，在派生类和实例对象中都是不允许访问
- `#`: ES2020 版本中原生实现的私有域，只能在被声明的类中被访问。与 `private` 效果基本一致，区别在于 `private` 是在 TS 中实现，编译成 JS 后约束将消失，而 `#` 是 ES 的原生实现，运行时仍生效。

#### readonly

- readonly 用来修饰成员，除了在构造函数外，该成员只读，不允许写
- 如果和其它修饰符同时存在的话，readonly 放在后面
- 实例成员和静态成员都可以修饰
```ts
class Cartoon {
	static readonly category: string = 'Disney'
	public readonly name: string
	constructor(name: string) {
		this.name = name
	}
}

console.log(Cartoon.category)  // Disney
Cartoon.category = 'Marvel'   // Error TS2540: Cannot assign to 'category' because it is a read-only property.

let a = new Cartoon('Donald Duck')
console.log(a.name) 				// Donald Duck
a.name = 'Mickey Mouse' 		// Error TS2540: Cannot assign to 'name' because it is a read-only property.
```

#### public

类成员和属性，不管是实例和静态，默认都是 `pullic`，一个 public 成员可以在任何地方进行访问，并且因为 `public` 是默认值，所以可以省略。
```ts
class Greeter {
	public static language = 'english' 
  public greet() {
    console.log("hi!");
  }
}
console.log(Greeter.language)
const g = new Greeter();
g.greet();
```

#### protected

protected 成员仅对声明它们的类自身和继承该类的子类中可见，但子类也可以重载基类的成员和方法，以改变其在基类中的访问性。
```ts
class Base {
	protected p = 1
  	protected m = 2
	getProperity() {
		// 在基类中可以访问 protected 修饰的成员和方法
		console.log('p: %s, m: %s', this.p, this.m)
	}
}
class Derived extends Base {
	getP() {
		// 在子类中可以访问 protected 修饰的属性
		console.log(this.p)
	}
  	// 重载基类的成员和方法，可以改变基类成员和方法的访问性
  	public m = 15;
}
const d = new Derived();
console.log(d.p) // Error TS2445: Property 'p' is protected and only accessible within class 'Base' and its subclasses.
console.log(d.m) // OK
```

#### private

private 只可以当前声明所在类的方法访问。
- 私有的静态成员只能在当前类的静态方法中使用
- 私有的实例成员只能当前类的实例方法中使用
```ts
class Base {
	// private 修饰的成员和方法只限在基类的方法中访问，其它地方都不行
	private static sv = 'static property'
	static getStaticProp() {
		console.log(this.sv)
	}
	private v = 3
	getProp() {
		console.log('private v: ', this.v)
	}
}
class Derived extends Base {
	getP() {
		// 在子类实例的方法中也不可以访问基类中 private 修饰的属性
		console.log(this.v)
	}
}
const d = new Derived();
console.log(d.v) // 子类实现也不能访问 Error TS2341: Property 'v' is private and only accessible within class 'Base'.

Base.sv // Property 'sv' is private and only accessible within class 'Base'.(2341)
const b = new Base()
console.log(b.v) // 基类的实现也不能访问 Private 属性
```
#### 原生 ES 语法：`#`

TS 的访问性修饰符限制的访问性范围有两个缺陷：
- private 修饰的成员允许使用括号表示法进行访问

比如上一个例子中
```ts
const d = new Derived();
d.v // 子类实现也不能访问 Error TS2341: Property 'v' is private and only accessible within class 'Base'.
d['v'] // OK

Base.sv // Property 'sv' is private and only accessible within class 'Base'.(2341)
Base['sv'] // OK
const b = new Base()
b.v // 基类的实现也不能访问 Private 属性
b['v'] // OK
```

- TS 类型系统访问性修饰（private、protected）限定的访问性范围，只在 TS 的类型检查过程中执行。在 TS 编译为 JS 后，意味着 JavaScript 运行时构造（如in或简单的属性查找）仍然可以访问 private 或 protected 修饰的成员。

```ts
class MySafe {
  private secretKey = 12345;
}
```
```js
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey); // OK
```

但是 ES6 提供了原生的语法定义私有字段`#`，在编译后保持仍然私有，并且也不提供括号表示法的访问，实现真正意义上的硬私有。

```ts
class Dog {
	static #a = 0
  	#b = 0;
	static getStaticProp() {
		this.#a
	}
	getProp() {
		this.#b
	}
}

Dog.#a // Property '#a' is not accessible outside class 'Dog' because it has a private identifier.
Dog['#a'] // Error

const dog = new Dog()
dog.#barkAmount // Error
dog['#barkAmount'] // Error
```

### 参数属性

另外 TS 提供了特殊的语法将构造函数参数转换为具有相同名称和值的类属性。这些被称为参数属性(paramenter properties)，通过在构造器参数中添加可访问修饰符 readonly public，private，protected 来声明并初始化成员，并且同样具有修饰符限制的作用。

```ts
// 如果一个成员的初始化值需要通过构造器参数来赋值，可能会这么写
class MyClass {
	b: number
	constructor(initB: number) {
		this.b = initB
	}
}

// 这种情况，可以利用 TS 参数属性的特性，简化成下面这种：
class MyClass {
	constructor(public b: number){}
}

// 参数属性支持的修饰符包括 readonly public protected private
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3)
console.log(a.x)
console.log(a.z)	// Error TS2341: Property 'z' is private and only accessible within class 'Params'.
```

## 继承 extends

类使用`extends`关键字实现类的继承，被继承的类称为基类，也叫父类，继承的类称为派生类，也叫子类。

派生类具有其基类的所有公开的属性和方法（public/protected)，还可以定义属性自己的其他成员。

```ts
class Animal {
	constructor(public name) {}
}
class Cat extends Animal {
	constructor(name: string) {
		super(name) // 调用父类的 constructor(name)
		console.log(this.name)
	}
	sayHi() {
		return 'Meow, ' + super.sayHi() // 调用父类的 sayHi()
	}
}

let c = new Cat('Tom') // Tom
console.log(c.sayHi()) // Meow, My name is Tom
```

### 派生类可以重写基类的成员
派生类还可以覆盖基类字段或属性。在派生类可以使用`super.`语法来访问基类成员。
- 在 static 静态方法中，`super` 代表基类自身，可以访问基类的静态属性和方法
- 在实例方法中，`super`代表基类的实现，可以访问基类的实例属性和方法

```ts
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
```

### 基类和派生类初始化的顺序
```ts
class Base {
  name = "base";
  constructor() {
		// 属性成员声明和初始化在构造函数运行之前，所以这里可以直接访问
		// 并且因为派生类的字段初始化在基类之后，所以此处 name 是 base
    console.log("My name is " + this.name);
  }
}
 
class Derived extends Base {
  name = "derived";
	// 缺省的话相当于默认执行以下构造器函数
	// constructor() {
	// 	super()
	// }
}
 
// Prints "base", not "derived"
const d = new Derived();
```
JavaScript 定义的类初始化顺序是：先基类后派生类。先属性后构造函数。
1. 基类字段被初始化
2. 基类构造函数运行
3. 派生类字段被初始化
4. 派生类构造函数运行

如果结合静态成员和静态块的顺序：先静态后动态，先基类后派生类。
- 基类的静态块代码执行
- 基类的静态属性初始化
- 派生类的静态代码执行
- 派生类的静态属性初始化
- 基类实例属性被初始化
- 基类构造函数运行
- 派生类的实例属性初始化
- 派生类的兛函数运行

```ts
class SuperClass {
  static superField1 = console.log('superField1');
  static {
    console.log('static block 1 SuperClass');
  }
  static superField2 = console.log('superField2');
  static {
    console.log('static block 2 SuperClass');
  }

  name = "base";
  constructor() {
		console.log("My name is " + this.name);
  }
}

class SubClass extends SuperClass {
  static subField1 = console.log('subField1');
  static {
    console.log('static block 1 SubClass');
  }
  static subField2 = console.log('subField2');
  static {
    console.log('static block 2 SubClass');
  }

  name = "derived";
  constructor() {
		super()
		console.log("My name is " + this.name);
  }
}
const subclass = new SubClass()

// 输出
"superField1" 
"static block 1 SuperClass" 
"superField2" 
"static block 2 SuperClass" 
"subField1" 
"static block 1 SubClass" 
"subField2" 
"static block 2 SubClass"
 
"My name is base" 
"My name is derived" 
```

### super 和 this

- super 在派生类中使用
  - 如果在派生类的静态方法中代表基类本身，可以访问基类的静态属性和方法
  - 如果在派生类的实例方法中代表基类的实例，可以方法基类的实例属性和方法
- this 在方法中使用
  - 如果是在静态方法中代表类自身，可以访问类的静态属性和方法
  - 如果是在实例方法中代表类实例，可以访问类的实例属性和方法


## 抽象类 abstract

abstract 用于定义抽象类和其中的抽象方法。

抽象类特点：
-   抽象类是不允许被实例化的，只能应于子类继承，通常用于定义类模板
-   抽象类中的抽象方法必须在子类实现

```ts
public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

let a = new Animal('Jack');
// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

上面的例子中，我们定义了一个抽象类 Animal，并且定义了一个抽象方法 sayHi。在实例化抽象类的时候报错了。

```ts
abstract class Animal {
	public name
	public constructor(name) {
		this.name = name
	}
	public abstract sayHi()
}

class Cat extends Animal {
	public eat() {
		console.log(`${this.name} is eating.`)
	}
}

let cat = new Cat('Tom')
// index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
```

上面的例子中，我们定义了一个类 Cat 继承了抽象类 Animal，但是没有实现抽象方法 sayHi，所以编译报错了。

```ts
abstract class Animal {
	public name
	public constructor(name) {
		this.name = name
	}
	public abstract sayHi()
}

class Cat extends Animal {
	public sayHi() {
		console.log(`Meow, My name is ${this.name}`)
	}
}

let cat = new Cat('Tom')
```

上面的例子中，我们只用抽象类来继承，并在子类中实现了抽象方法 sayHi，所以编译通过了。


## 类实现接口 implements

声明类时可以使用 `implements` 关键字指明该类要满足某些结构约束。
```ts
interface Animal {
	readonly name: string
	eat(food: string): void
	sleep(hours: number): void
}
interface Feline {
	meow(): void
}

class Cat implements Animal, Feline {
	name = 'Whiskers'
	eat(food: string) {
		console.info('Ate some', food, '. Mmm!')
	}
	sleep(hours: number) {
		console.info('Slept for', hours, 'hours')
	}
	meow() {
		console.info('Meow')
	}
}
```
上述这些接口定义的属性和方法在类型上都是安全的，如果在类中忘记实现某个属性或方法， TS 会报错提示。

事实上，在 TS 类型系统中类既是值也是类型。那到底是实现接口还是继承抽象类呢[P119]：
- 接口
  - 更通用：是对结构建的方法，不止用于类，也可以用于对象、数组等。
  - 更轻量：接口不生成 JS 运行时代码，只存在于编译时。
  - 一个类可以同时实例多个接口
- 抽象类
  - 只对类建模，而且生成运行时代码。
  - 但抽象类可以有构造方法，可以提供默认实现，还可以设置属性和方法的修饰符，这些是接口做不到的。
  - 一个类只能继承一个抽象类


## class 与原型的比较

ES6 中引入了`class`关键字来定义一个类。`class`只是一个语法糖，绝大部分功能用 ES5 的构造函数加原型都可以实现。但`class`的写法让面向对象编程的语法更加清晰。

> ES6 一般就指最新版本的 ES，包括从 ES2015 开始到最新的 ES2019。有时也把 ES6 称为 ES next 。但 ES7 ES8 ES9 这种称呼并不准确，只能说它们是 ES6 的子版本，要知道 ES5 到 ES6 用了将近 10 年才更一个版本。但目前官方版本发布从 ES2015 开始，使用年号命名。

ES6 的`class`语法与原型实现的比较：

```js
class MyClass {
	// 静态属性：ES2016提案中，但在TS中可用
	static myStaticProp = 'static property'
	// 实例实例：可以不用在构造函数中使用this.instanceProp声明。直接在类中声明并初始化，更方便代码组织
	instanceProp = 'instance property'

	constructor(count) {
		// 旧方法，实例属性在构造函数中使用this声明和初始化
		// this.instanceProp = 'instance property'
		this._count = 0
	}

	// 静态方法，添加static
	static getStaticProp() {
		// 静态方法中的this指向构造函数本身，此处 this指向 MyClass，因为调用对象是类本身 MyClass.getStaticProp()
		console.log('static:', this === MyClass)
		return this.myStaticProp
	}
	// 实例方法
	getInstanceProp() {
		// 实例方法中的this指向实例本身，此处 this 指向 new MyClass(),因为调用对象是实例 new MyClass().getInstanceProp()
		console.log('instance:', this)
		return this.instanceProp
	}

	// 存取器 之 取值，this 指向实例
	get count() {
		console.log('get _count')
		return this._count
	}
	// 存取器 之 存值，即贬值，this 指向实例
	set count(newValue) {
		console.log('set _count')
		this._count = newValue
	}
}

// 静态属性和方法调用
let staticProp = MyClass.myStaticProp
let getStaticProp = MyClass.getStaticProp()
console.log(staticProp, getStaticProp)

// 实例属性和方法调用
const my = new MyClass(1)
let instanceProp = my.instanceProp
let getInstanceProp = my.getInstanceProp()
console.log(instanceProp, getInstanceProp)

// 存取器调用
console.log(my.count)
my.count = 10000
console.log(my.count)
```

上述代码编译成 ES5 代码，可以看看静态属性和方法，以及存取器是怎么实例的，也就知道 this 的指向啦。

```js
var MyClass = (function() {
	function MyClass(param) {
		this.instanceProp = 'instance property'
		this._count = 0
		// this.instanceProp = 'instance property'
		this._count = param
	}

	// 静态属性和方法
	MyClass.myStaticProp = 'static property'
	MyClass.getStaticProp = function() {
		console.log('static:', this)
		return this.myStaticProp
	}

	// 实例方法挂载到对象原型上
	MyClass.prototype.getInstanceProp = function() {
		console.log('instance:', this)
		return this.instanceProp
	}

	// 存取器的定义
	Object.defineProperty(MyClass.prototype, 'count', {
		get: function() {
			console.log('get _count')
			return this._count
		},
		set: function(newValue) {
			console.log('set _count')
			this._count = newValue
		},
		enumerable: true,
		configurable: true
	})

	return MyClass
})()
```

