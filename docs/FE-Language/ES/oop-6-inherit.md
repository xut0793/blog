# 继承

继承的目的也是为了实现对代码的重用。在传统 OOP 中，继承都是指类与类之间的关系，但在JS中由于不存在类的概念，继承只发生在对象之间。

在 JS 对象中，对象属性的访问可以为对象自身的属性，也可以为对象原型上的属性。所以如果一个对象 A 要继承另一对象 B 的代码，一般就包括继承 B 对象自身的属性，和 B 对象原型上的属性。

在 JS 中实现继承，有以下四种方式：

1. 对象属性拷贝（浅拷贝和深拷贝)
1. `Object.create()`
1. 构造器 `new F()`
1. class 语法

[[toc]]

## 属性拷贝（浅拷贝和深拷贝)

严格意义来说，属性拷贝并不算真正意义上继承，因为每个对象都保存着一份属性。

### 浅拷贝

```js
function extend(child, parent) {
  for( let key in parent) {
    child[key] = parent[key]
  }
  return child
}
```

通过一个简单的循环遍历，复制了父对象的所有属性。但这个方法对于属性值是引用类型时，会导致一些不可预测的结果，因为引用类型的赋值拷贝的只是其引用地址。所以要实现完全复制，需要递归处理引用类型值，即深拷贝。

```js
function extendDeep(c, p) {
  let c = c || {}

  for (let k in p) {
    if (typeof p[k] === 'object') {
      c[k] = Array.isArray(p[k]) ? [] : {}
      extendDeep(c[k], p[k])
    } else {
      c[k] = p[k]
    }
  }
}
```

## `Object.create()`

- 语法：
```js
/**
 * @param { Object } proto 将要作为新对象原型的对象
 * @param { Object } propertiesObject 可选参数，使用属性描述符的形式定义新对象的属性，对应 Object.defineProperties() 的第二个参数
 * @return { Object } 以 proto 对象为原型的新对象
*/
Object.create(proto[, propertiesObject])
```

- 示例：

```js
const Shape = {
  name: 'shape',
  getName() {
    return this.name
  }
}

const Triangle = Object.create(Shape)
Triangle.name = 'triangle'

// 上面两行代码等同于以下代码
const Triangle = Object.create(TwoDShape, {
  name: {
    value: 'triangle',
    writable: true,
    enumerable: true,
    configurable: true
  }
})
 

 console.log(Shape.getName()); // shape
 console.log(TwoDShape.getName()); // triangle 
 // TwoDShape调用的 getName 方法即是从 Shape 上继承的，同时覆写了 name 属性
```

## 构造器 `new + F`

> 《JavaScript 面向对象编程指南》 chapter-6 page-152

这是传统 JS 语言中创建对象，以及实现对象继承最普遍的方式。

我们从两个角度来阐述构造器如何实现对象继承

### 继承实例对象属性: 构造器借用

构造器借用，即调用函数的 apply 方法
```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}

Shape.prototype.getName = function () {return this.name}

// 构造器借用，构造器也是函数，自然可以调用函数的方法
function Triangle(x, y) {
  Shape.apply(this, arguments)
  this.name = 'triangle'
}

const my_triangle = new Triangle(10, 10)
console.log(my_triangle.x, my_triangle.y, my_triangle) // 10 10 triangle
```
此时，实例对象 my_triangle 可以访问继承而来的属性 x y， name 属性被重新覆写

但 Shape 原型上的方法 getName 未继承，不能调用

```js
console.log(my_triangle.getName()) // TypeError: my_triangle.getName is not a function
```

### 继承原型对象属性: 直接赋值原型

Shape 构造器的每个实例对象都会保存一份 name 属性，这存在内存资源的浪费。正常的做法是将所有实例所共享的属性和方法定义在原型对象上。

并且，不鼓励将实例对象的属性纳入继承关系中，而是围绕共享的原型对象构建继承关系。因为如果对象自身属性被设定的太过具体，也就失去了可重用性。

```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}


function Triangle(x, y, w, h) {
  this.w = w
  this.h = h
  this.name = 'triangle'
}
// 复用 js 属性的动态性，对默认的原生原型对象进行覆写
Triangle.prototype = Shape.prototype
// 修补脆弱的 constructor 属性，使得 实例对象访问自身的构造器指向正确
Triangle.prototype.constructor = Triangle

const my_triangle = new Triangle(10, 10)
console.log(my_triangle.getName()) // triangle 此时继承来自原型的 getName 方法调用正确返回
```

此时子对象 my_triangle 与 new Shape() 创建的父对象的原型，实现上是同一个，因为在 JS 中对象赋值是引用指针的拷贝

```js
const my_shape = new Shape(10, 10)
console.log(Object.getPrototypeOf(my_triangle) === Object.getPrototypeOf(my_shape)) // true
```

这个时间，如果在子类原型上定义一个自有的方法，会影响到父类

```js
Triangle.prototype.getArea = function() {
  console.log('getArea');
  return this.w * this.h / 2
}

shape.getArea() // getArea
```

### 继承原型对象属性: 切断对象引用关系--使用临时构造器 `new F()`

为了切断对象引用带来的关联关系，可以引入一个中间对象，即空的 `new F()`

```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}

function Triangle(x, y, w, h) {
  this.w = w
  this.h = h
  this.name = 'triangle'
}

function F() {}
F.prototype = Shape.prototype
Triangle.prototype = new F()
Triangle.prototype.constructor = Triangle

Triangle.prototype.getArea = function() {
  console.log('getArea');
}

const my_shape = new Shape()
my_shape.getArea()  // // TypeError: getArea is not a function

const my_triangle = new Triangle()
my_triangle.getArea() // getArea
```

可以想像到，下面这段代码基本是通用的：
```js
function F() {}
F.prototype = Shape.prototype
Triangle.prototype = new F()
Triangle.prototype.constructor = Triangle
```
所以可以抽出封装成一个公共方法来实现原型继承
```js
function extend(Child, Parent) {
  let F = function () {}
  F.prototype = Parent.prototype
  Child.prototype = new F()
  Child.prototype.constructor = Child
}

// 那 Triangle 继承 Shape 就可以写成
extend(Triangle, Shape)
```


### 继承原型对象属性: 切断对象引用关系--使用`Object.create()`

因为 `Object.create()` 也能实现继承，所以上面代码可以这样替换

```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}

function Triangle(x, y, w, h) {
  this.w = w
  this.h = h
  this.name = 'triangle'
}


Triangle.prototype = Object.create(Shape.prototype)
Triangle.prototype.constructor = Triangle

Triangle.prototype.getArea = function() {
  console.log('getArea');
}

const my_shape = new Shape()
my_shape.getArea()  // // TypeError: getArea is not a function

const my_triangle = new Triangle()
my_triangle.getArea() // getArea
```
> Object.create() 方法在兼容低版本时的 polyfill 的核心代码 跟 new F() 的实现基本一样。 [Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

在上面的示例中，你会发现 Triangle 实例对象对 x y 属性的调用都无效。因为都只继承了原型上的方法 getName，并未继承实例属性 x y

### 同时继承实例属性和原型属性 

要同时实现两种来源的属性继承，其实就是上述方法的组合，另外还有一种方法是直接让子类原型等于父类的实例

1. 构造器借用 apply + new F
1. 构造器借用 apply + Object.create
1. 子类原型等于父类实例
1. 构造器借用 apply + 实例对象

#### 构造器借用 apply + new F 和 构造器借用 apply + Object.create

```js
// 1. 构造器借用 apply + new F
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}

function Triangle(x, y, w, h) {
  Shape.call(this, x, y)
  this.w = w
  this.h = h
}

extend(Triangle, Shape)
// 或者, 二选一
Triangle.prototype = Object.create(Shape.prototype)
Triangle.prototype.constructor = Triangle

Triangle.prototype.getArea = function() {
  return this.w * this.h / 2
}

const my_triangle = new Triangle(10, 10, 8, 4)
console.log(my_triangle.x, my_triangle.y, my_triangle.getName(), my_triangle.getArea() ) // 10 10 'Shape' 16
```

#### 子类原型等于父类实例

```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}

function Triangle(w, h) {
  this.w = w
  this.h = h
}

Triangle.prototype = new Shape(10, 10)
Triangle.prototype.constructor = Triangle

Triangle.prototype.getArea = function() {
  return this.w * this.h / 2
}

const my_triangle = new Triangle(8, 4)
console.log(my_triangle.x, my_triangle.y, my_triangle.getName(), my_triangle.getArea() ) // 10 10 'Shape' 16
```
可以看到这种方法虽然可以实现实例属性和原型属性同时继承，但实例化子类时，传递参数是割裂的，并且参数 x, y 并不能随实例自定义（除非实例后再进行重新赋值）。

另一个问题是属性访问时沿原型链查的的路径相其它方法更长。

```
my_triangle.getName 访问会查的以下节点
1. my_triangle 自身
2. my_triangle.__proto__  即 new Shape()
3. new Shape().__proto__
```

要解决这种参数传递割裂的问题，出现了下面这种

#### 实例 + 构造器借用的方式

```js
function Shape(x, y) {
  this.x = x
  this.y = y
  this.name = 'Shape'
}
Shape.prototype.getName = function () {return this.name}

function Triangle(x, y, w, h) {
  Shape.call(x, y)
  this.w = w
  this.h = h
}

Triangle.prototype = new Shape(5,5)
Triangle.prototype.constructor = Triangle

Triangle.prototype.getArea = function() {
  return this.w * this.h / 2
}

const my_triangle = new Triangle(10, 10, 8, 4)
console.log(my_triangle.x, my_triangle.y, my_triangle.getName(), my_triangle.getArea() ) // 10 10 'Shape' 16
```
但这种方式，又带来了另一个问题：就是父类构造器被调用了两次，也就是说属性 x, y 分别在 my_triangle 和 my_triangle.prototype 上各有一份。

```js
console.log(my_triangle.x) // 10 继承在实例对象上
delete my_triangle.x
console.log(my_triangle.x) // 5 继承原型对象上
```

## class 语法

在发布ES2015语言规范后，现代ES在语言规范层面提供了一种更高级的面向对象编程方式：`Class`类构造方法，使得我们实现面向对象更加方便。

> 更详细的 Class 语法总结 [oop-5-class](/FE-Language/ES/oop-5-class.html)

```js
// class 基本语法
class MyClass {
  constructor() { ... }
  method() { ... }
}
let instance = new MyClass()
```

ES中对象有三种属性，开发时使用的有数据属性和访问器属性，很少涉及内部属性。

在ES中面向对象中涉及到三类对象：

1. new出来的实例对象
1. 构造函数本身也是一个对象，也可以有自身的属性
1. 用于共享数据的原型对象

按照这个思路，我们使用 class 语法，如何定义这三类对象的属性

### 实例属性

```js
class User {

  constructor(name) {
    this.name = name;
  }
}
```

每一个Class都包含一个构造函数`constructor()`，即使你省略，语言也会默认创建一个空的`constructor()`。所以在这个构造函数内通过`this`挂载的即是实例属性。如上面的`name`属性定义。

有一份提案，可以将属性直接在类内部声明，声明后仍可以在构造器内赋值。
```js
class User {
  // 直接定义实例属性，并可以初始化（最新的ES提案阶段，暂未成为规范标准）
  name
  age = 18
  
  constructor(name) {
    this.name = name;
  }
}
```


### 原型上共享属性

```js
class User {

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }
}
```
以前需要在构造函数原型对象`F.prototype`上定义共享属性的方式，在`Class`语法中可以直接定义，如上面的`sayHi()`函数
> 函数也是属性，但有时也被称为方法

### 访问器属性
```js
class User {

  constructor(name) {
    this.name = name;
  }

  get age() {
    return 18
  }

  set age(val) {
    if (val > 20) return
  }
}
```
可以看到访问器属性也是直接在类中，而不是`constructor`构造函数中定义的。所以同原型上定义共享方法一样，`Class`声明的`getter / setter`方法也都是在原型上定义的。
> 稍后原理会具体说明

### 静态属性 static

静态属性是属性类对象本身属性，类实例无法调用。以前需要将构造函数当作对象添加静态属性，比如上面使用`Sub._super`实现静态属性。

在ES6的`Class`语法，使用关键字`static`来声明静态属性.
```js
class User {
  // 静态属性(属性于新ES提案阶段，暂未成为规范标准)
  static staticProperty = 'static property'

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(this.name);
  }

  // 静态方法 （在ES2015版已成为规范标准）
  static describe() {
    console.log(`this is ${this}`)
  }
}

// 调用静态方法
User.describe()
// 区别于实例方法
let tom = new User('tom')
tom.sayHi()
```

### 私有属性 `#`

在构造函数中实现私有属性，开发都需要采用自己的方式去实现，比如使用IIFE自执行行函数创建闭包来实现。但是有一个马上就会被加到最新ES规范中的已完成的 Javascript 提案，它为私有属性和方法提供语言级支持。

私有属性和方法应该以 # 开头。它们只在类的内部可被访问(静态方法和实例方法都可以），但私有属性不被子类继承。
```js
class User {
  #privateProperty = 'private value'

  constructor(name,prop) {
    this.name = name;
    // 可以在构造函数中对私有属性赋值
    this.#privateProperty = prop
  }

  sayHi() {
    console.log(this.name);
    console.log(this.#privateProperty)
  }

  // 静态方法
  static describe() {
    console.log(`this is ${this}`)
    console.log(this.#privateProperty)
  }
}
```

### 未来Class属性语法

如果关于属性的提案都在未来成为规范的话，那关于在class内定义属性的代码将更加统一规范

```js
class User {
  // 属性在一处统一声明，初始化可选
  #privateProperty = 'private value';
  static staticProperty = 'static property';
  name
  age = 19
  
  // 构造函数，可以对任何属性初始化
  constructor(name,age) {
    this.name = name
  }

  // 访问器属性
  get age() {
    return 18
  }

  set age(val) {
    if (val > 20) return
  }

  // 静态方法
  static getStaticProp() {
    console.log(User.staticProperty)
  }

  // 原型共享方法
  sayHi() {
    console.log(this.name);
    console.log(this.#privateProperty)
  }
}
```

### extends 关键字实现继承

在构造函数模式实现继承，我们需要手工处理很多代码。但在`class`类模式中，使用`extends`关键字创建一个类作为另一个类的一个子类。

```js
class Animal { 
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

// 继承
class Dog extends Animal {}

var d = new Dog('Mitzie');
d.speak();// 'Mitzie makes a noise.'
```

### extends 继承对常规方法和静态方法都有效

`Sub extends Super` 创建了两个 `[[Prototype]]` 引用：
- Sub 函数作为对象自身的原型继承自 Super 函数对象，这一点实现了静态属性继承
- Sub.prototype 原型继承自 Super.prototype，这一点实现实例属性和原型属性继承

所以说：`extends`继承对常规方法和静态方法都有效。

```js
class Animal {
  static planet = "Earth";

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }

}

// 继承于 Animal
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbits = [
  new Rabbit("White Rabbit", 10),
  new Rabbit("Black Rabbit", 5)
];

rabbits.sort(Rabbit.compare);

rabbits[0].run(); // Black Rabbit runs with speed 5.

alert(Rabbit.planet); // Earth
```
上例中，我们在子类Rabbit中调用了父类Animal的静态方法`compare`和属性`compare`都有效。

![class-inherit.png](./images/class-inherit.png)

可以使用代码验证下：
```js
class Animal {}
class Rabbit extends Animal {}

// 对于静态的
alert(Rabbit.__proto__ === Animal); // true

// 对于常规方法
alert(Rabbit.prototype.__proto__ === Animal.prototype); // true
```

此内容的原文链接[继承静态属性和方法](https://zh.javascript.info/static-properties-methods#ji-cheng-jing-tai-shu-xing-he-fang-fa)

### super 关键字实现父类引用

super在class类中使用的方式有两种：
- 对象调用：`super.property`
- 函数调用：`super(params)`

super出现在类的位置不同，表现的意义也不同：

- 在`constructor`函数中使用函数调用形式`super(params)`，表示调用继承的父类构造函数，并获取到`this`的正确指向。
- 在静态方法中使用`super.method()`调用，此时super指向父构造器
- 在原型方法中使用`super.method()`调用，此时super指向原型对象

```js
class Animal { 
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

// 继承
class Dog extends Animal {
  // 方法重写
  speak() {
    super.speak()  // super === Animal.prototype
    console.log(this.name + ' barks.');
  }
}

var d = new Dog('Mitzie');
d.speak();// 'Mitzie makes a noise.' \n 'Mitzie barks.'
```

### 重写constructor

目前为止，我们继承的子类是没有自己的构造器的。像我们定义一个类时缺省constructor时，语法会默认添加一个空的constructor一样，继承的子类如果缺省了，也会被默认添加。但代码有些不同。

```js
class Animal {}
// 相当于
class Animal {
  constructor() {}
}
```
子类的缺省相当于
```js
class Dog extends Animal {}
// 相当于
class Dog extends Animal {
  constructor(...args) {
    super(...args)  // super === Animal.prototype.constructor
  }
}
```
这里有一个规则：

**继承的子类如果要声明自己的 constructor ，则必须调用 super(...)，并且一定要在使用 this 之前调用。**

在ES中，继承的子类（所谓的“派生构造函数”，英文为 “derived constructor”）的构造函数与其他函数之间是有区别的。

在构造函数模式，或class的父类constructor中，通过 new 执行一个构造函数时，它将创建一个空对象，并将这个空对象赋值给 this。

但派生的构造函数，因为具有特殊的内部属性 `[[ConstructorKind]]:"derived"`。这是一个特殊的内部属性，它会影响new运算的操作：

当new 继承的子类的` constructor` 执行时，它不会执行上述正常的操作，而是期望父类的 `constructor` 来完成这项工作，但new结果返回的对象是作为子类实例的，虽然调用的是父构造器来生成新对象的。

在继承子类构造函数中，this调用在super调用之前，将会报错，因为此时未执行父构造器生成子实例，即this暂无指向。

```js
class Dog extends Animal {
  constructor(name,speed) {
    // this.speed = speed   // 此时将会报错
    super(name)  // super === Animal.prototype.constructor
    this.speed = speed

  }
}
```

### super 内部的实现原理 `[[HomeObject]]`

在类或对象的方法中（即函数）添加了一个新的内部属性 `[[HomeObject]]` 属性，它记住了方法声明时所在的类或对象。而super.method()就是引用了method内部的该属性值来解析执行的。

```js
let animal = {
  name: "Animal",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "Long Ear",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

// 正确执行
longEar.eat();  // Long Ear eats.
```


重要的一点：**明确方法而不是函数声明的属性才有该内部属性**

 `[[HomeObject]]` 属性只在使用ES6新语法，在对象或类的方法时使用 `method()`，而不是 `method: function()`时才具有。

```js
let animal = {
  eat: function() { // 早期旧语法是这样写的，此时eat函数不具有 [[HomeObject]]属性
    console.log('eating')
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

rabbit.eat();  // 错误调用 super（因为animal.eat函数里没有 [[HomeObject]]
```
修正上面的错误，改用新语法声明对象方法，即省略function关键字
```js
let animal = {
  eat() { // ES2015新语法，此时eat函数具有 [[HomeObject]]属性
    console.log('eating')
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

rabbit.eat();  // eating
```

至于新增`[[HomeObject]]`内部属性是为了解决什么问题？具体可以参看下面链接：

[深入内部探究 `[[HomeObject]]`](https://zh.javascript.info/class-inheritance#shen-ru-nei-bu-tan-jiu-he-homeobject)






