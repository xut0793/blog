# 创建对象

ES中创建对象主要有以下几中方式：
[[toc]]

这章主要是列举生成对象的几种方式，但演示代码中都涉及了面向对象相关的概念：构造函数、类、原型等知识，可以查看**面向对象**部分的其它章节来了解。

## 字面量形式

使用字面量形式，可以直接创建简单对象。这个对象是`Object()`对象构造器的直接实例
```js
let person = {
  name: 'John',
  describe: function() {
    return `Person named ${this.name}`
  }
}
// 使用ES新语法，对象内部的函数属性可以省略function关键字
let person = {
  name: 'John',
  describe() {
    return `Person named ${this.name}`
  }
}
```

利用ES对象具有高度动态性的特点，可以一开始创建一个空对象，然后再向对象添加属性

```js
let person = {}
person.name = 'John'
person.describe = function() {
  return `Person named ${this.name}`
}
```

## Object() / new Object()

在前面[对象类型转换原始值类型](/ES/type-9-conversion)时，我们已经提到过，ES语言提供了`Objecct()`构造函数。

它可以将原始值类型转为包装对象。但同时，我们也可以直接调用它生成一个空对象。像上面采用字面量形式创建的对象都是`Ojbect()`构造器的直接实例对象。

我们可以直接将它当成函数调用`Object()`，或者作为对象构造器使用`new Object()`调用，结果都是一样的。

```js
// let person = new Object()
let person = Object()  
person.name = 'John'
```

## new + Function 形式

字面量形式只限于创建单一的简单对象，不适合创建批量对象，比如这些对象拥有相同的结构形式。

举个例子：如果我们要建立一个班的学生信息，为每个学生建立一个对象模型，但每个学生对象拥有相同的结构，即姓名、学号等。

此时我们可以采用工厂模式来批量创建类似的对象。

```js
function createStudent(name, id) {
  let o = new Object()
  o.name = name
  o.id = id
  return o
}

let tom = createStudent('tom', 1)
let jerry = createStudent('jerry', 2)
```
但在ES语言层面，为上述工厂模式采用了一种更为优雅的实现方式，即构造函数模式。

我们可以自定义一个学生构造器来创建学生对象
```js
function Student(name,id) {
  this.name = name
  this.id = id
}
// 使用new运算符创建对象
let tom = new Student('tom',1)
let jerry = new Student('jerry',2)
```
可以看到两种不同之处：
1. 构造器内部没有显式的创建新对象，而是直接将属性赋值在`this`上
1. 没有return语句

实际上，new运算符在语言内部实现了下面几个步骤：
- 以构造函数的 prototype 属性为原型，创建新对象；
- 将 新对象作为this 和调用参数传给构造函数；
- 执行构造函数内的代码；
- 如果构造函数返回的是对象，则返回，否则返回第一步创建的对象。

> 关于构造函数和原型的知识可以查看[构造函数](/ES/oop-4-constructor)和[原型](/ES/oop-3-prototype)章节

可以看到，工厂模式中生成一个新对象和返回对象的功能都通过new运算符在语言内部实现了，使得开发者实现起来很简单。

根据上面步骤，我们自己可以实现一个new运算符的功能

```js
function _new(fn,...args) {
  let obj = Object.create(fn.prototype)
  let ret = fn.apply(obj, args)
  if (ret !== null && typeof ret === 'object') {
    return ret
  } else {
    return obj
  }
}

function Student(name,id) {
  this.name = name
  this.id = id
}

let tom = _new(Student, 'tom', 1)
let jerry = _new(Student, 'jerry', 2)
console.log(tom);
console.log(jerry);
```

## new + Class 形式

ES6规范中新增`Class`语法是对构造器语法的替代，在语法书写上更完全贴近于“基于类”的语言规范。`Class`语法的优势在于更优雅的实现了对象继承。
```js
class Student {
  constructor(name,id) {
    this.name = name
    this.id = id
  }
}

// 同样new运算符创建对象
let tom = new Student('tom',1)
let jerry = new Student('jerry',2)
```

## Object.create()

`Object.create()` 方法创建一个新对象，使用参数中提供的对象来作为新创建对象的原型对象。

语法：
```js
/**
 * @params { Object } proto 计划作为新对象原型的已有对象。
 * @params { Object } propertiesObject 可选。如果没有指定为 undefined，如果有则作为新对象属性。
 * @return { Object } 一个带着指定的原型对象和属性的新对象。
*/
Object.create(proto[, propertiesObject])
```

例子：
```js
// o = {};
// 上面以字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);

// 例用第二个参数定义新对象的属性，需要采用属性描述符的形式声明属性
tom = Object.create(Object.prototype, {
  // id会成为所创建对象的数据属性
  id: { 
    value: 1,
    writable:true,
    enumerable:true,
    configurable:true,
  },
  // name会成为所创建对象的访问器属性
  name: {
    enumerable:true,
    configurable: true,
    get: function() { return 'tom' },
    set: function(value) {
      console.log("Setting `name` to", value);
    }
  }
});
```

关于对象的数据属性和访问器属性可以查看下一章节内容[对象属性](/ES/oop-2-object-property)





