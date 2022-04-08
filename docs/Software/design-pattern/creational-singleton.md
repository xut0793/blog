# Singleton 单例模式

[[toc]]

单例模式(Singleton)指在程序中有且仅有一个对象，提供统一的接口访问。适用于全局只有一个实例的场景。

代码实现：
```ts
class Singleton {

  private static instance: Singleton = new Singleton()

  private constructor() {}

  public static getInstance() {
    return this.instance
  }
} 
```
## 实例化的时机

- **eager initialzation 饿汉模式**，即声明时就创建了实例
- **lazy initialzation 懒汉模式**，延迟实例化，使用时才实例化

上面的代码实现就是饿汉模式，在声明类的静态属性时就实例化了。
```ts
class Singleton {
  private static instance: Singleton = new Singleton()
  // 省略
}
```
可能有人觉得在类内部就马上声明实例，有些诧异，类都还没声明好就能进行实例化调用了？其时原因在于我们实例是赋给类的静态属性的，如果是类的实例属性当然不行，会造成死循环。上面代码如果通过 TS 编译转成 JS 原型写法就明白了先后顺序了。
```js
function Singleton() {}
Singleton.instance = new Singleton()
Singleton.getInstance = function () {return this.instance}

// 或者在 JS 类语法只实现静态方法，未实现 static 属性时
class Singleton {
  static getInstance() { return this.instance}
}
Singleton.instance = new Singleton()
```
饿汉模式存在的问题是如果当前类只声明未使用时，会白白浪费掉 instance 实例占用的内存。最好是在需要时才实例化，就衍生了懒汉模式。

```ts
class Singleton {
  private static instance: Singleton | null = null

  private constructor() {}

  public static getInstance() {
    // 懒汉模式 lazy initialzation 延迟实例化，使用时才实例化
    if (this.instance === null) {
      this.instance = new Singleton()
    }
    return this.instance
  }
}
```
> 在多线程语言中，如 java，在懒汉模式的实现上还要考虑加上同步锁 synchronized。JS 是单线程语言，可忽略。

## 实例化的方式

- 限制new，只允许通过指定方法获取实例
- 允许new，且多次操作也返回同一个对象，即透明的单例模式

上面 TS 代码中，可以看到为类的构造函数声明了 `private` 私有修饰符，这是为了禁止通过 `new` 的方式来获取实例，只允许通过类的静态方法 `getInstance` 来获取实例。强行使用，TS 编译会报错。

> 在原生JS中，要限制 new 的行为，可以通过 [new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 实现

在这种限制下，这个类与传统类的使用方法就不一样了，对用户来说，一开始我并不知道这是一个实现单例的类，并不知道需要通过 `getInstance`方法才能得到实例对象。所以这种方式让这个类的使用变得不“透明”了。

如果允许通过 `new` 来实例，且保证多次调用后，也与 `getInstance` 获取的是同一个实例，这可以实现一个透明的单例模式。
```ts
class Singleton {

  private static instance: Singleton = new Singleton()

  constructor() {
    // 注意这里一定要 return，因为使用 new 时，构造函数是否有 return 对象，呈现的结果是有差异的，具体可查看JS中new的实现。
    return Singleton.instance
  }

  public static getInstance() {
    return this.instance
  }
}
```
如果允许new ，并且对应懒汉模式时，构造函数的代码修改如下
```ts

class Singleton {
  private static instance: Singleton | null = null

  constructor() {
    if (!Singleton.instance) Singleton.instance = this
    return Singleton.instance
  }
  public static getInstance() {
    if (this.instance === null) {
      this.instance = new Singleton()
    }
    return this.instance
  }
}
```

## 有限的多例模式

单例模式可扩展为有限的多例（Multiton）模式，这种模式可生成有限个数的实例并保存在类内部的实例列表中，可通过特定的id访问。
```ts
class Multiton {
  private static maxNum: number = 2
  private static instanceList: Multiton[] = []

  id: number
  private constructor(id:number) {
    this.id = id
  }

  toString() {
    return `这是第${this.id}个实例对象`
  }

  static getInstance(id:number) {
    return this.instanceList[id - 1]
  }

  // ts4.4 实现在静态块功能 static block，是ES第三阶段的功能，相当于类初始化代码
  static {
    for (let i = 0; i < this.maxNum; i++) {
      this.instanceList.push(new Multiton(i+1))
    }
  }
}
```

## 总结

Singleton 模式中的角色：
- 只有一个实例对象 `instance`；
- 对外提供一个访问该单例的方法  `getInstance`。

优点：
- 单例模式可以保证内存里只有一个实例，减少了内存的开销，避免对资源的多重占用。
- 单例模式设置全局访问点，可以优化和共享资源的访问。

缺点：
- 单例模式的功能代码通常写在一个类中，如果功能设计不合理，则很容易违背单一职责原则。
- 单例模式一般没有接口，扩展困难。如果要扩展，则除了修改原来的代码，没有第二种途径，违背开闭原则。
- 因为全局只有一实例，所以不利于单元测试和代码调试。


