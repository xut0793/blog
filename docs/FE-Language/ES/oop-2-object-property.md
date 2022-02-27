# 对象属性及其操作

[[toc]]

对象的属性可以分为3种：

**1. 属性（property, 称为数据属性）**

对象中最普遍的属性形式。即键值对（key-value)的形式，可以以字符串或Symbol类型作为键。常称为方法的函数也只是作为值value存在。

**2. 访问器（Accessor, 称为访问器属性）**

访问器类似读、写属性的特殊方法。常称为`getter`和`setter`

**3. 内部属性（Internal slot)**

只存在于ES语言规范中，通常将内部属性命名用双层中括号来表示。它们不能用于JS开发中直接访问。但现代JS语言也实现了方法来间接访问其值。

最典型的例子是获取对象的原型`[[prototype]]`、`__proto__`、`Object.getPrototypeOf()`方式的演变。

## 数据属性 properties

平常在使用 ES 定义并初始化一个简单对象时，我们几乎都是以下形式：字面量定义的数据属性

```js
// 字面量形式
let o2 = {
	name: 'Tom',
	age: 18
}

// 或先定义无属性的空对象{}，然后根据需要使用打点或中括号的形式添加属性
let o1 = {}
o1.name = 'Tom'
o1['age'] = 18
```

## 访问器属性 Accessor properties

如果我们对某个属性有特殊的要求，比如赋值时需要进行验证时，可以采用访问器属性。
```js
let kid = {
  name: 'tom',
  _age: 8,
  get age() {
    return this._age
  },
  set age(val) {
    if (val > 18) {
      console.log('The kid age setting should be less than 18' )
    } else {
      this._age = val
    }
  }
}

console.log(kid.age)  // 8
kid.age = 20         // 'The kid age setting should be less than 18'
kid.age = 10
console.log(kid.age) // 10
```
像上面这种，在函数前直接添加`get` `set` 标识符也可以为对象定义属性。使用时跟上面对象调用方法完全一样。

## 内部属性 Internal properties

内部属性只存在于ES语言规范中，通常将内部属性命名用双层中括号来表示。它们不能用于JS开发中直接访问。但现代JS语言也实现了方法来间接访问其值，或者将内部属性使用Symbol类型值来定义。
> 关于内部属性如何作用的更多例子可以查看[类型检测](/ES/type-7-checking.html#object-prototype-tostring)章节

最典型的例子是获取对象的原型`[[prototype]]`、`__proto__`、`Object.getPrototypeOf()`方法的演进。

JS中每个对象都有一个内部属性`[[prototype]]`，保持着它原型对象的引用。在早期JS中我们可以通过引用对象的构造函数的prototype属性来曲线获得实例对象的原型。
```js
[].constructor.prototype === Array.prototype
```
但这种引用很奇怪，相当于通过构造器绕个弯，并且由于ES语言对象的动态性，构造器的prototype是可以被重写的，所以这种方式并不保证准确。

所以最早mozilla在firefox浏览器中提供了自己实现的私有属性 `__proto__`来获得`[[prototype]]`同样的引用。

```js
[].__proto__ === Array.prototype
```

后面其它浏览器厂商也相继实现了`__proto__`私有属性，但它并不是ES语言规范中的一部分。鉴于其应用的普遍性，在ES6最新的规范中，语言标准实现了`Object.getPrototypeOf()`方法来获取对象的原型对象。

```js
Object.getPrototypeOf([]) === Array.prototype
```

## Object.definePorperty 定义并操作属性

可以通过`Object.definePorperty()`方法来定义属性，并利用属性描述符来控制单个属性的行为。

语法参考：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

```js
/**
 * 如果目标对象target_obj本身已经存在prop属性，那么修改该对象的现有属性， 并返回这个对象。
 * 如果目标对象上没有这个属性，那么会直接在目标对象上定义这个新属性，并返回这个对象。
 *
 * @params {Object} target_obj 目标对象
 * @params {String} prop 要定义或修改的属性名称
 * @params {Object} descriptor 将要被定义或修改的属性描述符
 * @return {Ojbect} 返回属性定义或修改后的目标对象
 */
Object.defineProperty(target_obj, prop, descriptor)
```
### 属性描述符

简单理解它就是对目标对象当前这个属性的一组描述，可以控制一个属性以下几种行为：
- writable：属性是不是只读，即这个属性值能不能修改
- enumerable：属性能不能被枚举，即for-in 或 in 语句能不能遍历它
- configurable：属性能不能做其它配置，比如删除属性，或者重新定义属性描述符等

那属性描述符是怎么定义这个属性的一系列规则的呢？实际上 `descriptor` 也是一个对象，对象内部不同的属性定义了不同的行为规则。

```js
let o1 = {
	name:'Tom',
}
Object.getOwnPropertyDescriptor(o1,'name')
// obj对象的数据属性name描述符descriptor
descriptor = {
	value: 'Tom',
	writable: true,
	enumerable: true,
	configurable: true
}
```

```js
let o2 = {
	get play() {
		console.log('运动')
	},
	set play(sprot) {
		console.log(sport + '运动')
	}
}

Object.getOwnPropertyDescriptor(o2,'paly')
// obj对象的访问器属性age的描述符descriptor
descriptor = {
    get: [Function: get name],
    set: [Function: set name],
    enumerable: true,
    configurable: true
}
```

上面总结过对象属性可以是数据属性，或者访问器属性。所以相对应的数据属性的描述符 和 访问器属性的描述符在结构和 key 键是有点区别的。

两者描述符对象中相同的属性是`enumerable` `configurable`，然后数据属性描述对象对象不同的属性是`value` `writable`，访问器属性描述符不同的属性是`get` `set`。

实际上这些描述符对象的属性也被称为目标对象的内部属性，通过加双中括号表示。当然一个对象的内部属性可不仅仅只有这几个哦。

前面我们也说了描述符对象是用来约定目标对象属性的。所以这些内部属性具体描述了什么规则呢？

```js
[[value]]: 任意数据类型，用来表示具有数据属性的目标对象的属性的值
[[writable]]: 布尔值，用来表示具有数据属性的目标对象的属性的值能不能被重写，即能不能`=`等号重新进行赋值操作

[[enumerable]]： 布尔值，数据属性和访问器属性都有，用来表示该属性是否可以被枚举，比如`for-of`、`for in`或`in`等语句或操作符中遍历中能否获取到该属性
[[configurable]]: 布尔值，数据属性和访问器属性都有，用于表示该属性是否可以配置，比如能否使用`delete`操作符删除该属性，或能否重新使用`defineProperty()`方法重新定义属性描述符对象等。

[[get]]: 一个函数类型，用来配置访问器属性`getter`方法
[[set]]: 一个函数类型，用来配置访问器属性`setter`方法
```

理解了上面的这些，我们可以用`Object.defineProperty()`来重新定义对`o1` `o2`对象，看下面怎么写：

```js
// 数据属性
let o1 = {
	name:'Tom'
}

// 使用defineProperty方法重写
let o1 = {}
Object.defineProperty(o1, 'name', {
	value: 'Tom', // 定义值
	wriable: true, // 可以重新赋值
	enumberable: true, // 可以用于循环遍历
	configurable: true // 可以使用delete删除操作
})

console.log(o1.name) // Tom
```

```js
// 访问器属性
let o2 = {
	get play() {
		console.log('运动')
	},
	set play(sprot) {
		console.log(sport + '运动')
	}
}

// 使用defineProperty方法重写
let 02 = {}
Object.defineProperty(o2, 'play', {
	enumberable: true,
	configurable: true,
	get: function() {
		console.log('运动')
	},
	set: function(sport) {
		console.log(sport + '运动')
	}
})
```

### 描述符缺省时的默认值

以字面量的形式定义对象的属性,对象属性描述符的特征值都默认为 true

```js
let o2 = {
	name: 'Tom'
}
// 前面[创建对象]章节内容中五种方式中直接创建的对象,内部属性描述符的特征都默认为true
//  [[writable]]:true   [[configurable]]:true   [[enumerable]]:true
// 相当于以下形式
Object.defineProperty(o1, 'name', {
	value: 'Tom',
	writable: true,
	enumerable: true,
	configurable: true
})
```

但是如果使用`Object.defineProperty()`定义某个属性时，缺省的描述符特征值默认为`false`

```js
let o3 = {}
Object.defineProperty(o3, 'name', {
	value: 'Tom'
})
// 此时o3.name属性是不可配置/不可重写/不可检举的.因为内部属性值都默认false了.
// 相当以下形式
Object.defineProperty(o3, 'name', {
	value: 'Tom',
	writable: false,
	enumerable: false,
	configurable: false
})

o3.name = 'jerry'
console.log(o3.name)  // 还是 Tom
```

访问器属性的定义也同上面一样。

### 只读 writable:false

我们通过更改 `[[writable]]` 标志来把属性设置为只读，即不能被重新赋值：
```js
let user = {
  name: "John"
};

// 对已定义的属性使用 Object.defineProperty重新定义时不缺少的属性描述符不会变为false，而是保持默认，即最开始的true
Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete"; // Error: Cannot assign to read only property 'name'

// 对于新属性，我们需要明确地列出哪些属性描述符是 true，不然默认false
Object.defineProperty(user, "age", {
  value: 18,
	// writable 缺省默认false
  enumerable: true,
  configurable: true
});

console.log(user.age); // 18
user.age = 28; // Error
```

### 不可枚举 enumerable:false

对象的不可枚举属性在`for-of`、 `for-in`、`in`、`Object.keys()`等表达式中不会被遍历到，像对象继承的`toString()`或`valueOf()`属性不会出现在属性遍历中一样。
```js
let user = {
	name: 'tom',
	age: 18
}

// 默认情况下，两个属性都会被遍历
console.log(Object.keys(user)) // ['name','age']

// 如果我们想把age隐藏，可以修改它的属性描述符enumerable
Object.defineProperty(user, "age", {
  enumerable: false
});
console.log(Object.keys(user)) // ['name']
```

### 不可配置 configurable:false

不可配置标志（configurable:false）有时会预设在内建对象和对象内部属性中。

不可配置的属性包括两点特征：
1. 属性不能被删除，即delete运算无效
1. `configurable:false`是单向操作，一旦配置为false，意味着也不能再使用`defineProperty`改回来了, 或者配置其它特征值。

例如，Math.PI 是只读的、不可枚举和不可配置的：
```js
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

console.log( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
```
比如，我们将 user.age 设置为“永久密封”的常量，年龄永远18：
```js
let user = {
	name: 'tom',
	age: 18
}

Object.defineProperty(user, "age", {
  value: "18",
  writable: false,
  configurable: false
});

// 下面的所有操作都不起作用：
//   user.age = 29
//   delete user.age
//   defineProperty(user, "age", { value: 29 })
Object.defineProperty(user, "name", {writable: true}); // Error

// 但保留了可枚举
console.log(Object.keys(user))  // ['name', 'age']
```


## Object.defineProperties(obj,props)批量定义多个属性

对比下`Object.defineProperty(obj,prop)` 和 `Object.defineProperties(obj,props)`写法

-   `Object.defineProperty(obj,prop)`: 一次定义一个属性
-   `Object.defineProperties(obj,props)`: 可以一次定义多少属性

```js
let p1 = {}
Object.defineProperty(p1, 'name', {
	value: 'tom',
	writable: true,
	enumerable: true,
	configurable: true
})
console.log(p1.name)
console.log(Object.getOwnPropertyDescriptor(p1, 'name'))

// 输出
/**
 tom
{ value: 'tom',
  writable: true,
  enumerable: true,
  configurable: true }

*/
```

```js
let p2 = {}
Object.defineProperties(p2, {
	name: {
		value: 'tom',
		writable: true,
		enumerable: true,
		configurable: true
	},
	age: {
		value: 18,
		writable: true,
		enumerable: true,
		configurable: true
	}
})
console.log(p2.name)
console.log(p2.age)
console.log(Object.getOwnPropertyDescriptors(p2))

// 输出
/**
tom
18
{ name:
   { value: 'tom',
     writable: true,
     enumerable: true,
     configurable: true },
  age:
   { value: 18,
     writable: true,
     enumerable: true,
     configurable: true } }


*/
```

上面我们通过属性描述符可以控制对象单个属性的行为。ES还提供了一些方法可以限制访问整个对象的行为。

## 对象行为的控制

### Object.preventExtensions(obj)

禁止向对象添加新属性。

### Object.seal(obj)

禁止添加/删除/修改对象属性。为对象所有的属性设置 configurable: false。

### Object.freeze(obj)

禁止添加/删除/更改对象属性。为对象所有的属性设置 configurable: false, writable: false。


另外提供了它们的检测：

### Object.isExtensible(obj)

如果添加属性被禁止，则返回 false，否则返回 true。

### Object.isSealed(obj)

如果添加/删除属性被禁止，并且所有现有的属性都具有 configurable: false则返回 true。

### Object.isFrozen(obj)

如果添加/删除/更改属性被禁止，并且所有当前属性都是 configurable: false, writable: false，则返回 true。


示例：
```js
let user = {
	name: 'tom',
	age: 18,
}

console.log(Object.getOwnPropertyDescriptors(user))
/*
name:{
	value: "tom"
	writable: true
	enumerable: true
	configurable: true
}
age: {
	value: 18
	writable: true
	enumerable: true
	configurable: true
}
*/

/****禁止扩展对象属性************************************************/

Object.preventExtensions(user)
console.log(Object.isExtensible(user)) // false 即禁止添加属性

user.gender = 'girl'
console.log(Ojbect.keys(user)) // ['name','age'] 并没有新添加的gender属性
console.log(Object.getOwnPropertyDescriptors(user)) // 此时属性描述符未改变
/*
name:{
	value: "tom"
	writable: true
	enumerable: true
	configurable: true
}
age: {
	value: 18
	writable: true
	enumerable: true
	configurable: true
}
*/

/****密封对象：禁止配置对象******************************************/

Object.seal(user)
console.log(Object.isSealed(user))  // true
user.name = 'jerry' // name还可以重新赋值
delete user.age  // false 删除不成功
console.log(Object.getOwnPropertyDescriptors(user)) // 此时属性描述符configurable: false
/*
name:{
	value: "tom"
	writable: true
	enumerable: true
	configurable: false
}
age: {
	value: 18
	writable: true
	enumerable: true
	configurable: false
}
*/

/****冻结对象：不可配置也不可写************************************************/

Object.freeze(user)
console.log(Object.isFrozen(user))  // true
user.name = 'Eich'  // Error
console.log(Object.getOwnPropertyDescriptors(user)) // 此时属性描述符writable和configurable为false
/*
name:{
	value: "tom"
	writable: false
	enumerable: true
	configurable: false
}
age: {
	value: 18
	writable: false
	enumerable: true
	configurable: false
}
*/
```

这些方法在实际中很少使用，但还是有些场景适合。

1. 比如在VUE中对确定不会改变的常量对象，可以使用`Object.freeze()`冻结属性，避免添加到vue响应式系统中增加性能负担。
```js
const OBJ = {
	status: 1,
	status_name: '待发货'
}
export default {
	data() {
		return {
			frezzeObj: Object.freeze(OBJ)
		}
	}
}
```
2. 在`vue.prototype`上挂载全局方法，要避免被篡改，可以设计只读，或者只使用getter

```js
Object.defineProperty(Vue.prototype, '$http', {
	value: http,
	writable: false,
	enumerable: true,
	configurable: true
});

// 或者getter形式

Object.defineProperty(Vue.prototype, '$http', {
    get(){
     return http;
    }
});
```


## 参考链接

- 《深入浅出JavaScript》 P195
- [现代JavaScript教程 - 属性标志和属性描述符](https://zh.javascript.info/property-descriptors)
- [现代JavaScript教程 - 属性的 getter 和 setter](https://zh.javascript.info/property-accessors)
- [29个对象API实战，千万别错过！](https://mp.weixin.qq.com/s/zwLl826E1mSwVInnCAC4Yg)

