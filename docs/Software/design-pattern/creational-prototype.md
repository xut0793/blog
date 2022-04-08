# Prototype 原型模式

prototype 原型模式就是通过克隆生成实例的方式，也称克隆模式。

注意，这里的原型 prototype 跟 JS 中原型是不一样的，只是刚好用了同一个词。为了区分，也可以把原型模式中的原型理解为原件，然后通过复印生成一个副本。

> 设计模式最早是由 GOF 针对面向对象语言总结的一系统实践，而严格的面向对象语言，比如 java，通常是从类 new 一个实例，但这个 new 的过程会触发一些复杂的操作，比如类的加载、实例化、初始化等，但克隆操作时 java 虚拟机是直接进行内存操作，拷贝原对象的数据流生成新的副本对象，其效率远远高于 new 关键字触发的实例化操作。

从类到对象叫作“创建”，而由本体对象到副本对象则叫作“克隆”，原型模式指的就是后者的克隆操作。
原型模式适用于需要生成很多实例对象的场景，比如坦克大战中，自己操作的主坦克可以是一个单例模式，不断出现的敌方坦克就可以使用原型模式不断克隆出来。

## 简单复制
在 JS 中，如果要复制一个对象，最简单的几种方式：
```js
const shape = {
  category: 'Square',
  width: 10,
  height: 10,
}

// JS 复制一个普通对象的几种方法
const copyShape1 = {...shape} // 解构方式
const copyShape2 = Object.assign({}, shape) // Object.assign
// 循环
const copyShape3 = {}
for (let [key, value] of Object.entries(shape)) {
  copyShape3[key] = value
}
```
上面的 shape 对象是一个字面量对象，如果是一个 new 出来的对象，那我们就要考虑 JS 中原型对象的继承了。

```ts
class Shape {
  width: number
  height: number
  category: string

  constructor(w: number, h: number) {
    this.width = w
    this.height = h
    this.category = w === h ? 'square' : 'rectangle'
  }
  getArea(): number {
    return this.width * this.height
  }
}

const square: Shape = new Shape(10, 10)
console.log(square.getArea()) // 100

// 此时简单的复制对象
const copySquare = {...square}
copySquare.getArea() // copySquare.getArea is not a function
```
`getArea` 方法在 `square` 实例对象的原型方法，实际调用链是 `square._proto_.getArea`。所以上面用对象解构方式实现的简单复制，只能复制实例对象自身可枚举的属性，不能复制原型对象上的属性和方法。

## 原型链复制
有一种解决方法是直接将实例对象作为副本的原型对象，这样基于JS原型链的规则，也可以访问到`getArea`方法。

```ts
const copySquare = Object.create(square)
console.log(copySquare.getArea()) // 100
```
但这种方式也有问题，它没有完全隔离原对象和副本对象。比如此时更改 square 对象的类型，会影响到 copySquare 对象。
```ts
square.width = 10
square.height = 100
square.category = 'rectangle'
square.getArea() // 1000

copySquare.getArea() // 也变成了 1000
copySquare.category // 'rectangle'
```

## 结合简单和原型连的复制
预期中，我们希望复制的副本对象是原本对象的某一刻的快照，即副本与原本能完全隔离互不影响，也能继承原型对象上的方法。所以可以结合以上两种方式进行克隆操作：
```ts
const copySquare = {...square}
Object.setPrototypeOf(copySquare, Object.getPrototypeOf(square))

// 或者先设置原型，再复制实例
let copySquare = Object.create(Object.getPrototypeOf(square))
Object.assign(copySquare, square)

// 此时square如何变化，也不影响副本对象
square.width = 10
square.height = 100
square.category = 'rectangle'
square.getArea() // 1000

// 此时 copySquare 仍然可以使用 getArea 方法，计算的面积仍然是 100，且类型是正方形 square
copySquare.getArea()
copySquare.category
```

## 浅拷贝和深拷贝
事实上，上述实例对象复制也并没有达成副本与原本完全隔离的目的，因为 JS 中对象类型的复制只是内存地址的复制，指向的仍是同一个堆内存中的对象。这种复制称为浅拷贝。

```ts
const obj = {
  a: 1,
  b: {
    c: 2
  }
}

const shallowClone = {...obj}
console.log(shallowClone.a, shallowClone.b.c) // 1 2
obj.a = 100
obj.b.c = 1000
console.log(shallowClone.a, shallowClone.b.c) // 1 1000
```
如果要实现深拷贝，就需要判断值的类型，递归实现。
```ts
function deepClone(obj: object) {
  const ret = Object.create(Object.getPrototypeOf(obj))
  for (let [key, val] of Object.entries(obj)) {
    if (Object.prototype.toString.call(val) === "[object Object]") {
      ret[key] = deepClone(val)
    } else {
      ret[key] = val
    }
  }

  return ret
}
```
用上述例子验证下
```ts
const copy = deepClone(obj)
obj.b.c = 1000
console.log(copy.b.c) // 2

const copySquare = deepClone(square)
square.category = 'rectangle'
console.log(copySquare.category) // square
```
上述的 deepClone 实现非常简陋，有很多边界没有处理，比如对象循环引用的处理、symbol 作为键的属性复制、其它类型对象的复制（array/map/set/Date/RegExp/ArrayBuffer等)等等，可以深入了解下 lodash 库中 clone 和 cloneDeep 方法的实现。

## 原型模式的代码实现

原本对象要实现一个clone接口，用于克隆自己。

```ts
abstract class Prototype {
  clone(src:any) {
    const ret = Object.create(Object.getPrototypeOf(src))
    for (let [key, val] of Object.entries(src)) {
      if (Object.prototype.toString.call(val) === "[object Object]") {
        ret[key] = this.clone(val)
      } else {
        ret[key] = val
      }
    }

    return ret
  }
}

class Shape extends Prototype {
  width: number
  height: number
  category: string
  prop: any

  constructor(w: number, h: number) {
    super()
    this.width = w
    this.height = h
    this.category = w === h ? 'square' : 'rectangle'
    this.prop = {
      a: {
        b: {
          c: 1
        }
      }
    }
  }
  getArea() {
      return this.width * this.height
  }
}

const shape1 = new Shape(10, 10)
console.log(shape1.prop.a.b.c, shape1.category, shape1.getArea())
const shape2 = shape1.clone(shape1)


shape1.width = 10
shape1.height = 100
shape1.category = 'rectangle'
shape1.prop.a.b.c = 1000000000000
console.log(shape1.prop.a.b.c, shape1.category, shape1.getArea())

console.log(shape1 === shape2)
console.log(shape2.prop.a.b.c, shape2.category, shape2.getArea())
```

## 带原型管理器的原型模式

原型模式可以扩展为带原型管理器的原型模式，它在原型模式的基础上增加了一个原型管理器 PrototypeManager 类。该类用 map 保存多个可复制的原型，使用方可以通过管理器的 get(key) 方法从中获取用于已经复制的副本对象。

```ts
interface Shape {
    clone: () => Shape
    getArea: () => number
}

class Square implements Shape {
    x: number
    constructor(x: number) {
        this.x = x
    }
    getArea() {
        return this.x**2
    }
    clone() {
        const copy = Object.create(Object.getPrototypeOf(this))
        copy.x = this.x
        return copy
    }
}

class Circle implements Shape {
    r: number
    constructor(r: number) {
        this.r = r
    }
    getArea() {
        return this.r ** 2 * Math.PI
    }
    clone() {
        const copy = Object.create(Object.getPrototypeOf(this))
        copy.r = this.r
        return copy
    }
}

class PrototypeManager {
    private protoMap = new Map<string, Shape>()
    put(key: string, shape: Shape) {
        this.protoMap.set(key, shape)
    }
    get(key: string) {
        return this.protoMap.get(key)?.clone() ?? null
    }
}

const protoManager = new PrototypeManager()
protoManager.put('square', new Square(10))
protoManager.put('circle', new Circle(5))

console.log(protoManager.get('square')?.getArea())
console.log(protoManager.get('circle')?.getArea())
```
## 总结

- 原型模式中的角色：原型对象和clone接口
- 适用场景：需要批量实例对象的情形。

