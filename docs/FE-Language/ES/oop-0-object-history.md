# 理解对象和面向对象

[[toc]]


> 以下内容引自极客时间《重学前端》javascript章节

## 什么是对象

`Object` 译作对象，但在中英文语境中，对其释义的理解完全不同。

单词 Object 在英文中，是一切事物的总称，而中文的“对象”却没有这样的普适性，我们在学习编程的过程中，更多是把它当作一个专业名词来理解。

在《面向对象分析与设计》这本书中，作者 Grady Booch 从人类的认知角度来说，对象应该是下列事物之一：
- 一个可以触摸或者可以看见的东西；
- 人的智力可以理解的东西；
- 可以指导思考或行动（进行想象或施加动作）的东西。

然后根据对象的自然定义，在编程语言中进行抽象，对象应该具有下几个特征：
- 对象具有唯一标识性：即使完全相同的两个对象，也并非同一个对象。
- 对象有状态：对象具有状态，同一对象可能处于不同状态之下。
- 对象具有行为：即对象的状态，可能因为它的行为产生变迁。

基于以上对象的自然定义和语言实现对象的特征，在语言开发中进行对象建模。

在这个时候，不同的编程语言对实现对象模型的会采用不同的方法，导致了不同的语言下对象有不同的语言特性。

### 基于类来描述对象

其中最成功的流派是使用“类”的方式来描述对象，这类编程语言的代表是 C++ 和 JAVA。在这类语言中，总是先有类，再从类去实例化一个对象，对象一旦创建，不可更改，称为静态对象。类与类之间又可能会形成继承、组合等关系。

这类对象对比对象抽象的理论特征：
- 对象具有唯一标识性： 对象具有唯一标识的内存地址。基本上各类语言都是通过内存地址来体现唯一性
- 对象有状态： C++ 中称它们为“成员变量”，JAVA中称它们为“属性”
- 对象具有行为：C++ 中称它们为“成员函数”，JAVA中称它们为“方法”

### 基于原型来描述对象

但Brendan Eich在创造JavaScript时，却选择了一个更为冷门的方式来描述对象，即采用“原型”方式。JavaScript 并非是第一个使用原型的语言，在它之前，self、kevo 等语言已经开始使用原型来描述对象了。

事实上，Brendan 更是曾透露过，他最初的构想是一个拥有基于原型的面向对象能力的 Scheme 语言（Scheme 是一门函数式语言，但是函数式的JS另一话题）。
> 关于 JavaScript语言创建的历史可以参考[EcamScript历史](/ES/ES_history.html#%E5%88%9B%E9%80%A0javascript)。

JS对象对比对象抽象的理论特征：
- 对象具有唯一标识性： 对象具有唯一标识的内存地址。JS也是通过内存地址来体现对象的唯一性。
- 对象有状态和行为： 在 JavaScript 中，将状态和行为统一抽象为“属性”。
> 在JS中函数被设计成一种特殊的对象，可以像值一样进行传递和赋值，体现为函数是一等公民，具体查看函数章节。基于JAVA的流行和影响，日常中还是会将JS中函数属性称为方法。只是一种称呼无所谓，但我们还是要明白在JS中属性定义时，并没有区分函数，因为在JS体系中函数也像值一样对待。

JS基于原型设计的对象的两大特征：

#### 1. 对象的高度动态性

基于原型的对象最大的优势是具有高度的动态性，体现在程序运行时可以动态修改对象的状态和行为。这是跟绝大多数基于类的静态的对象设计完全不同地方，也是JavaScript语言突出的特点。

```js
let o = { a: 1 }; 
o.b = 2; 
o.a = 3
console.log(o.a, o.b); // 3 2
```

JS中对象属性除了被设计成高度动态性后，还被设计成了比其它语言更复杂的形式，以便提高抽象能力。

#### 2. 对象属性描述符

js提供了数据属性和访问器属性，并为每种属性提供了对应的属性描述符特性，可以更精确地自定义属性。
```js
// 常规使用
let person = {
  // name属性的形式就是数据属性
  name:'John',
  
  // age属性的形式就是访问器属性
  get age() {
    return 18
  },
  set age(val) {
    console.log(val)
  }
}

// 数据属性和访问器属性的调用形式时没有区别
person.name        // John
person.age        // 18
person.age = 28   // 28

// 获取属性的描述符
Object.getOwnPropertyDescriptor(person, 'name')   
/* 
{ value: 'John', 
  writable: true, 
  enumerable: true, 
  configurable: true 
}
*/
// 访问器属性描述符
Object.getOwnPropertyDescriptor(person, 'age')   
/* 
{ get: [Function: get age], 
  set: [Function: set age], 
  enumerable: true, 
  configurable: true 
} */

// 也可以通过描述符自定义属性行为
Object.defineProperty(person, 'name', {
  writable: false,             // 将 name 属性变为只读，不可写
  enumerable: true,
  configurable: true
})

console.log(person.name)     // John
person.name = 'jerry'
console.log(person.name);   // John
```

## 面向对象编程

从编程语言描述对象模型的方式不同，我们知道“基于类”并非面向对象的唯一形式，还有“基于原型”的面向对象实现。

“基于类”的编程：提倡使用一个关注分类和类之间关系开发模型。在这类语言中，总是先有类，再从类去实例化一个对象。类与类之间形成继承、组合等关系。

“基于原型”的编程：提倡程序员去关注一系列对象实例的行为，然后才去关心如何将这些对象重叠的部分划分到最近的原型对象上，而不是将它们分成类。

>所以JavaScript 标准对基于对象的定义：“语言和宿主的基础设施由对象来提供，并且 JavaScript 程序即是一系列互相通讯的对象集合”。

比较起来JS是更为纯粹的面向对象编程语言，而不是通过类创建对象。这也是为什么有句话说“JS中一切皆对象”。

### 历史问题

在早期的JS语言规范中，创建对象的语法形式上，与"基于类"编程的JAVA语言很像，比如都使用`new`运算符来生成对象，使用`this`来调用对象属性，但在继承的实现上又与JAVA安全不同，这种似像非像的样子，导致大量的 JavaScript 程序员试图在原型体系的基础上，把 JavaScript 变得更像是基于类的编程，进而产生了很多所谓的“框架”，比如 PrototypeJS、Dojo。

事实上，它们成为了某种 JavaScript 的古怪方言，甚至产生了一系列互不相容的社群，显然这样做的收益是远远小于损失的。以至于官方在 ES2015版本中提供了 `class` 关键字来定义类，尽管，这样的方案仍然是基于原型系统来模拟类的实现，但是它修正了之前的一些常见的“坑”，统一了社区的方案，这对语言的发展有着非常大的好处。

出现JavaScript与Java似像非像的结果是有历史原因的，鉴于当时Brendan Eich所在的网景公司与SUN公司（创建了Java语言）的公司政治原因，JavaScript 推出之时，管理层就要求它去模仿 Java。所以，JavaScript 创始人 Brendan Eich 在“基于原型”的基础上引入了 new、this 等Java的语言设施，使之“看起来语法更像 Java”，来应对管理层要求。

### 原型机制

但是在理解JS基于原型的面向对象实现时，如果我们抛开 JavaScript 用于模拟 Java 类实现而增加的复杂语法设施（如 new、Function Object、函数的 prototype 属性等），原型系统可以说相当简单。 概况起来就两点：
- 所有对象都有一个内部私有属性`[[prototype]]`，指向对象的原型；
- 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止。

> 在具体实现原型系统时有两种实现思路：<br>1. 一种是并不真的去复制一个原型对象，而是使得新对象持有一个原型对象的引用 <br>2. 另一种是切实地复制对象，从此两个对象再无关联。<br>历史上的基于原型的语言，因此也产生了两个流派。JavaScript 显然选择了前一种方式。

在ES6规范中，ES提供了一系列内置函数，以便更为直接地访问操纵原型。
- Object.create 根据指定的原型创建新对象，原型可以是 null；
- Object.getPrototypeOf 获得一个对象的原型；
- Object.setPrototypeOf 设置一个对象的原型。

利用这三个方法，我们可以完全抛开类的思维，利用原型来实现抽象和复用。

```js
const yewen = { yongchun: true }
const xiaolong = { jiequandao: true }
const zidan = { roushu: true }

// zidan对象只能访问自身的属性 roushu
console.log("zidan can roushu: ", 'roushu' in zidan)            // zidan can roushu:  true
console.log("zidan can jiequandao: ", 'jiequandao' in zidan)    // zidan can jiequandao:  false
console.log("zidan can yongchun: ", 'yongchun' in zidan)        // zidan can yongchun:  false

console.log('======================================')

// 将对象xiaolong设为zidan的原型
Object.setPrototypeOf(zidan, xiaolong)
// 现在对象zidan可以访问对象xiaolong身上的属性jiequandao，但还不能访问对象yewen身上的属性yongchun
console.log("zidan can roushu: ", 'roushu' in zidan)            // zidan can roushu:  true
console.log("zidan can jiequandao: ", 'jiequandao' in zidan)    // zidan can jiequandao:  true
console.log("zidan can yongchun: ", 'yongchun' in zidan)        // zidan can yongchun:  false
// 并且现在对象xiaolong也不能访问对象yewen身上的属性
console.log("xiaolong can yongchun: ", 'yongchun' in xiaolong)  // xiaolong can yongchun:  false

console.log('=======================================');

// 将对象yewen设为xiaolong的原型
Object.setPrototypeOf(xiaolong, yewen)

// 现在zidan可以访问xiaolong和yewen的属性，并且xiaolong也可以访问yewen的属性
console.log("zidan can roushu: ", 'roushu' in zidan)            // zidan can roushu:  true
console.log("zidan can jiequandao: ", 'jiequandao' in zidan)    // zidan can jiequandao:  true
console.log("zidan can yongchun: ", 'yongchun' in zidan)        // zidan can yongchun:  true
// 并且现在对象xiaolong也不能访问对象yewen身上的属性
console.log("xiaolong can yongchun: ", 'yongchun' in xiaolong)  // xiaolong can yongchun:  true
```

```js
    -----------------            -------------------            -----------------
    |     zidan     |            |     xiaolong    |            |     yewen     |
    |    -------    |            |     --------    |            |    -------    |
    | roushu:true   |            | jiequandao:true |            | yongchun:true |
    | [[prototype]] |----------->|  [[prototype]]  |----------->| [[prototype]] |
    -----------------            -------------------            -----------------
    /**
     * 1. 所有对象都有一个内部私有属性[[prototype]]，指向对象的原型。
     * 2. 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止。
     * 3. 而通过[[prototype]]属性连接起来的这个链条就称为原型链。
    */
```

### 早期JS用构造函数实现基于原型的面向对象

考虑到 new、Function、 Function.prototype 等基础设施今天仍然有效，而且被很多代码使用，学习这些知识也有助于我们加深理解原型工作原理。

在早期的 JavaScript 语法规范中，new + Function 是实现原型继承唯一的方式。

这种方式有两个要点：
1. 所有对象都有一个内部私有属性`[[prototype]]`，指向对象的原型。
1. 所有函数对象都有一个prototype属性，指向其new出来的实例对象的原型。

> 注意这里的属性的区别，`[[prototype]]`是内部属性，语言实现内部使用，外部无法调用。而函数对象的prototype属性是常规属性。<br>鉴于对象的`[[prototype]]`内部属性无法调用，各浏览器厂商自己实现了`__proto__`属性，但它不是语言规范中定义的。在ES6中才实现了`Objecdt.getPrototypeOf()`方法，同`__proto__`功能一样。

```js
function Person(name) {
  this.name = name
}
Person.prototype.kungfu = function(kungfu_name) {
  console.log(`${this.name} can ${kungfu_name}`)
}

let zidan = new Person('zidan')
zidan.kungfu('ruodao')            // zidan can ruodao
```

new 运算接受一个构造器和一组调用参数，new 这样的行为，试图让函数对象在语法上跟Java中创建对象变得相似。

new操作符的实现，间接提供了两种为对象添加属性的方式，一是在构造器中添加属性，二是在构造器的 prototype 属性上添加属性。

new 操作内部主要实现了下面功能：
- 以构造函数的 prototype 属性为原型，创建新对象；
- 将 新对象作为this 和调用参数传给构造函数执行；
- 如果构造函数返回的是对象，则返回，否则返回第一步创建的对象。

至于使用`new + Function`的原型系统去模拟类的继承、封装等功能可以查看后面的[构造函数](/ES/oop-4-constructor)。

### 现代js中使用Class实现基于原型的面向对象

在 ES6的规范中加入了新特性 `class`，使得JS的面向对象形式跟Java中基于类的面向对象形式在语法形式完全一样。但是在本质上并没有改变JS是基于原型的面向对象语言，`Class`的实现仍然是基于原型系统来模拟类的。

使用新的关键字 `Class` 来定义类，而使得`Function`回归原本的函数语义。

```js
class Person {
  constructor(name) {
    this.name = name
  }

  kungfu(kungfu_name) {
    console.log(`${this.name} can ${kungfu_name}`)
  }
}

let xioalong = new Person('xiaolong')
xioalong.kungfu('jiequandao')             // xiaolong can jiequandao
```

使用`Class`语法更方便实现继承。
```js
class Shifu {
  constructor(name) {
    this.name = name,
    this.kungfu = 'yongchun'
  }
}

class Tudi extends Shifu {
  constructor(name) {
    super(name)
  }
}

let zidan = new Tudi('zidan')
console.log(zidan.kungfu)
```

至于`Class`实现继承比构造函数实现继承更优，以及`Class`更详细的语法，可以查看[Class](/ES/oop-5-class)

### 面向对象编程（OOP）核心概念

> Object Oriented Programming

- 对象： 对象是最核心概念，在JS中一切实现都依赖于对象
- 类：   类抽象了对象的共同特征
- 封装： 封装实现了数据隐藏和数据访问权限的设置，比如私有属性的保护。
- 继承： 继承非常优雅地实现了代码的重用。
- 多态： 通过函数的重载或方法的覆写实现自定义行为
- 聚合： 功能实现的最小化

查看[构造函数](/ES/oop-4-constructor)章节，了解使用`new + Function`的构造函数来实现OOP概念。

查看[Class](/ES/oop-5-class)章节，了解通过现代`Class`语法实现面OOP概念。
