# 构造函数实现面向对象

[[toc]]

## 面向对象编程（OOP）核心概念

> OOP: Object Oriented Programming

- 对象： 对象是最核心概念，在JS中一切实现都依赖于对象
- 类：   类抽象了对象的共同特征
- 封装： 封装实现了数据隐藏和数据访问权限的设置，比如私有属性的保护。
- 继承： 继承非常优雅地实现了代码的重用。
- 多态： 通过函数的重载或方法的覆写实现自定义行为
- 聚合： 功能实现的最小化

所以，这节我们使用ES5的构造函数模式来实现面向对象编程的这些概念。

## 生成对象 `new F`

可以使用字面量形式创建对象：

```js
let lilei = {
     id: 1,
     name: 'lilei',
}
```

但是，字面量形式只限于创建单一的简单对象，不适合创建批量对象。

比如我们要建立一个班的学生信息，为每个学生建立一个对象模型，但每个学生对象拥有相同的结构，即姓名、学号等。

在ES中即可以采用构造函数模式。我们可以自定义一个学生构造器来创建学生对象。

```js
function Student(name,id) {
  this.name = name
  this.id = id
}
// 使用new运算符创建对象
let tom = new Student('tom',1)
let jerry = new Student('jerry',2)
```

## 原型：实现数据共享 `F.prototype`

基于类的面向对象中，“类”是对象的一份创建蓝图，抽象了对象的共同特征，对象基于类创建。但ES中没有“类”的概念，ES是基于原型的面向对象，通过“原型”来共享数据。

所以对于所有学生的信息描述方法我们就可以共享在它们的原型对象上。

```js
Student.prototype.describe = funciton() {
     console.log(`${this.name}'s student number is ${this.id}`)
}
```

## 封装：实现数据隐藏

### 封装的两层概念

1. 将抽象出来的数据和对数据的操作封装在一个抽象对象中，对象对外暴露操作接口，隐藏操作实现细节。
1. 另一层概念是数据访问权限的设置，即属性的可见性。

日常开发中，谈到封装主要集中在第二点的实现上。在TypeScript语言中，通过`public / protected / private`关键字来用户能访问对象属性的层次。在JS中，虽然所有属性都是public的，但是我们仍然可以利用该语言特性来实现类似的封装效果。

- 构造函数中通过闭包实现私有数据
- 使用社区约定的带有下划线开头的键实现私有数据
- 具体化键的属性中私有数据
- 通过IIFE保持全局私有数据

### 构造函数中通过闭包实现私有数据

在前面[创建对象](/ES/oop-1-object-create.html#new-function-形式)章节，我们讲了使用new调用构造函数时，具体发生了什么：
- 以构造函数的 prototype 属性为原型，创建新对象；
- 将新对象作为this 和调用参数传给构造函数；
- 执行构造函数内的代码；
- 如果构造函数返回的是对象，则返回，否则返回第一步创建的对象。

换个角度说，在构造函数调用过程中，有两个过程：

- 创建实例对象
- 执行函数

而函数嵌套声明会形成函数词法作用域链，可以利用函数的作用域链的原理（即函数声明时的词法作用域嵌套形成作用域链，嵌套的内部函数可以调用外层函数内的变量，形成闭包）来实现对象的私有属性。

> 《深入理解JavaScript》P242中，构造函数调用过程中，创建了两个数据结构：一个初始化的实例对象，一个保存着参数和局部变量的词法环境。

```js
function StringBuilder(name,age) {
     let buffer = []

     this.add = function(str) {
          buffer.push(str)
     }
     this.getBufferByString = function() {
          return buffer.join('')
     }
}

StringBuilder.prototype.getPrivateInProto = function() {
     return this.getBufferByString()
}
```
此时，在StringBuilder构造器存在三种值：

1. 公有属性

绑定在实例对象中属性，可以被公共访问的。如上例中的`add / getBufferByString`属性。

2. 私有属性

存在于构造函数的词法环境中的属性是私有的，只有构造函数和构造函数内创建的函数可以访问。如`buffer`数组是私有属性。

3. 特权方法

私有属性十分安全，不能从对象外部访问，也不能在通过原型方法访问，此时需要特权方法：在构造函数内实现的可以访问私有属性的函数。因为在构造函数内部声明，所以可以访问私有属性，同时又是对象公有属性，在外部可以调用。如特权方法：`getBufferByString`

这种实现数据私有化封装的写法，也称为 Crockford（克劳福德）私有模式。

这种方法实现数据私有化，也有一些弊端：

1. 实现不够优雅

为了访问私有属性引入了充当中价的特权方法。在构造函数内部声明函数破坏了关注点分享原型：构造函数实现实例属性，原型实现实例共享的方法。

2. 性能不够好

访问闭包数据会比较慢，并且会消耗量多多的内存保存闭包数据和特权方法。

3. 私有属性无法被外部访问，不便于测试。

### 使用社区约定的带有下划线开头的键实现私有数据

因为ES没有实现其它面向对象中关于public/protected/private的关键字，所以社区中约定成俗使用下划线_来定义私有属性。

```js
function StringBuilder(name,age) {
     this._buffer = []
}

StringBuilder.prototype.add = function(str) { this._buffer.push(str) }
StringBuilder.prototype.getBufferByString = function(str) {
     this._buffer.join('')
}
```
这种实现全靠大家约定遵守，也有利弊：

1. 实现了构造函数和原型关注点分离的原则，并且使用原型中共享的方法访问私有属性，避免特权方法出现。
2. 但直接的问题，私有属性并不是真正实现私有，外部仍然可以访问。
3. 因为私有属性实际作为实例对象属性，会导致键值命名冲突，比如继承的子构造函数的属性命名冲突等。


### 具体化键和IIFE实现私有数据

上述靠约定实现的带下划线的私有属性，存在问题之一就是导致属性键冲突，比如来自子构造函数的属性，或者混入mixin的键。

此时可以将具体私有属性的键统一在一个地方命名，通过对象中括号的计算属性来调用`this[KEY_BUFFER]`

```js
let StringBuilder = function() {
     const KEY_BUFFER = '_StringBuilder_buffer'

     function StringBuilder() {
          this[KEY_BUFFER]= []
     }
     StringBuilder.prototype = {
          constructor: StringBuilder,
          add: function(str) {this[KEY_BUFFER].push(str)},
          getBufferByString: function() {return this[KEY_BUFFER].join('')}
     }

     return StringBuilder
}()
```

可以看到我们在使用函数表达式声明时，在外层函数调用了，这样会马上形成一个函数作用域，将KEY_BUFFER保存在闭包环境中，并且常量值命名带有构造器命名前缀，有效避免污染全局命名空间，也就不会与其它属性键冲突了。


## 多态：方法的重写

多态主要是指不同对象通过相同的方法调用来实现各自行为的能力。

最典型的实现就是ES内部的构造函数对`toString()`方法的重写

```js
let obj = {name: 'tom'}
let arr = [1,2,3]
let fn = function() {return 123}

console.log(obj.toString()) // [object Object]
console.log(arr.toString()) // "1,2,3"
console.log(fn.toString())  // function() {return 123}

// 我们也可以实现自己toString()方法
let obj1 = {
     name:'tom',
     toString(){return this.name}
}
console.log(obj1.toString())  // tom
```

## 聚合：对象合并

面向对象的聚合，有时也称为组合。在“基于类”实现的语言中主要是继承多个类的实现，在ES“基于原型”的实现中主要是指将现有几个对象的能力合并成一个新对象的能力。

使用ES提供的`Object.assign()`方法可以轻松实现这类需求。
> Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象，但同名属性会被覆盖

```js
// 简单的对象合并
let source = {
     name: 'tom',
     sayName() {
          return `my name is ${this.name}`
     }
}

let target = {
     name: 'jerry',
     describe() {
          return `named is ${this.name}`
     }
}

// 让target拥有sayName方法
Object.assign(target,source)
target.sayName() // my name is tom  name属性被覆盖，所以值变成了tom

// 如果只是单纯想使用source中的sayName方法，不希望name属性值被覆盖，可以通过函数作为对象提供的方法call
source.sayName.call(target) // my name is jerry
```
在类的继承中，希望能继承到多个对象，则可以使用混入的方式。但是有一个弊端：

`Object.assign` 会覆盖同名的属性，因此，通常应该仔细考虑 mixin 的命名方法，以最大程度地降低发生这种冲突的可能性。

```js
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它类的原型
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.OtherSuperMethod = function() {
     // use OtherSuperClass method to do something
};
```

> [MDN object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)<br>[MDN object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

## 继承：实现代码复用

对象原型实现了拥有相同属性结构的对象实现共享数据，也是代码复用的一种实现。而继承是更进一步实现代码优雅复用的一种实现。

比如，给定对象构造器Super，我们需要实现另一种构造器Sub，它除了拥有自己的一些属性外，还拥有Super实例的所有特性。

在ES6没出现class之前，ES没有内建的机制实现这种功能，必须手动实现对象属性的继承。

对象属性继承我们要实现几个目的：

- 继承实例属性
- 继承原型属性
- 确保`instanceof`正常工作，即构造器原型的`constructor`属性指向正确，即`F.prototype.constructor === F`

### 继承实例属性

实例属性是在它自己的构造函数中设置的，因此要继承实例属性需要借调其父构造函数。
```js
function Super(prop1) {
     this.prop1 = prop1,
}

function Sub(prop1,prop2) {
     Super.call(this, prop1)
     this.prop2 = prop2
}
```

### 继承原型属性

单只继承实例属性，并没有完全实现拥有继承Super所有特性的要求。因为一般会常用原型来保存共享数据，所以我们需要解决如何让Sub继承Supers构造器原型上的方法。

解决方法就是让Sub原型对象的原型等于Super的原型，即`Sub.prototype.__proto__ === Super.prototype`
> Sub.prototype也是一个对象，实例对象都有自己的内部属性`[[prototype]]`，对此不明白的可以看上一节[原型](/ES/oop-3-prototype)

```js
function Super(prop1) {
     this.prop1 = prop1,
}
Super.prototype.method1 = function() {return 'Super prototype method}

function Sub(prop1,prop2) {
     this.prop2 = prop2
}
Sub.prototype = Object.create(Super.prototype)
// 改变了原型默认的Sub.prototype后，还需要确保F.prototype.constructor === F和subInstance instanceof Sub正确
Sub.prototype.constructor = Sub
```

### 组合继承，既继承实例属性又继承原型属性

上面不管是实例继承还是原型继承都只实现了一部分属性的继承，要实现继承Super全部特性，就需要方法两者结合。

```js
function Super(prop1) {
     this.prop1 = prop1,
}
Super.prototype.method1 = function() {return 'Super prototype method'}

function Sub(prop1,prop2) {
     Super.call(this, prop1)
     this.prop2 = prop2
}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
```

### 通过父类实例实现父类原型继承

在实现原型上属性的继承，还有一种是通过父类实例可以获取它原型属性的原理
```js
function Super(prop1) {
     this.prop1 = prop1,
}
Super.prototype.method1 = function() {return 'Super prototype method'}
let SuperInstance = new Super('porp')
// 此时SuperInstances可以使用原型的方法，SuperInstance。mehod1()

function Sub(prop1,prop2) {
     Super.call(this, prop1)
     this.prop2 = prop2
}
Sub.prototype = new Super('porp')
Sub.prototype.constructor = Sub
```

但这种方法很少用，因为它虽然实现了继承，但两次调用了Super构造器，一次`Super.call(this, prop1)`和另一次`new Super('porp')`，导致重复，并且prop1属性在Sub实例属性和原型对象上都存在。

所以通过构造函数更优雅实现继承一般采用组合继承，实例属性继承和原型属性继承相组合的方式。

### 避免硬编码父构造函数的名字

上例中，我们一直通过指定父构造函数名来引用父构造函数，这样硬编码投入灵活性。特别当我们需要在子构造器覆写父构造器的属性时：
```js
function Super(prop1) {
     this.prop1 = prop1,
}
Super.prototype.method1 = function() {return 'Super prototype method'}

function Sub(prop1,prop2) {
     Super.call(this, prop1)
     this.prop2 = prop2
}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
// 覆写继承过来的method1方法
Sub.prototype.method1 = function(x) {
     let superResult =  Super.prototype.call(this)
     return superResult + x
}
```

此时又一次使用了Super函数名，使得继承时两个构造函数耦合严重，缺少扩展性。此时我们可以将父构造器的原型赋值给子构造器的一个属性来解决这个问题。

```js
Sub._super = Super.prototype
```
然后替换上面的代码，如下：
```js
function Super(prop1) {
     this.prop1 = prop1,
}
Super.prototype.method1 = function() {return 'Super prototype method'}

function Sub(prop1,prop2) {
     sub._super.constructor.call(this, prop1)
     this.prop2 = prop2
}
Sub.prototype = Object.create(Sub._super)
Sub.prototype.constructor = Sub
Sub._super = Super.prototype
// 覆写继承过来的method1方法
Sub.prototype.method1 = function(x) {
     let superResult =  Sub._super.call(this)
     return superResult + x
}
```

再进一步，我们可以把设置继承的语句封装成工具函数。

```js
function setInherit(Sub, Super) {
     Sub.prototype = Object.create(Super.prototype)
     Sub.prototype.constructor = Sub
     Sub._super = Super.prototype
}
```
```js
function Super(prop1) {
     this.prop1 = prop1
}
Super.prototype.method = function() {return 'Super prototype method'}

function Sub(prop1,prop2) {
     Sub._super.constructor.call(this, prop1)
     this.prop2 = prop2
}
setInherit(Sub,Super)
// 继承之后，再实现方法覆写
Sub.prototype.method1 = function(x) {
     let superResult =  Sub._super.method.call(this)
     return superResult + x
}
```

