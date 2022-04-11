# Facade 门面模式

Facade 门面模式，又称外观模式。外观类为包含许多复杂子系统提供一个简单的接口，隐藏系统的复杂性，简化客户端直接使用外观类。

无论是门或者面，指代的都是系统的外观部分，利用门面把多个复杂子系统关在门里面隐藏起来，来自外部的访问只能通过这道门面来进行，而不必再关心门面里面隐藏的子系统如何运转。总之，无论门面内部如何错综复杂，从门面外部看起来总是一目了然，使用起来很简单。

比如傻瓜相机，只要按下快门键就可以完成拍照，不用手动去调整对焦、光线、光圈等一系列复杂操作。比如到餐馆吃饭，只管点菜下单即可，不用自己去向菜市场买菜，自己去厨房做菜，也不用自己收拾碗筷。

情形一：自己做一顿饭
```ts
class Luncheon {
  constructor() {
    // 菜市场商户
    this.vegetableMarketer = new VegetableMarket()
    // 找妹妹帮忙
    this.sister = new Helper()
    // 找妈妈下厨
    this.mom = new Chef()
  }
  lunch() {
    // 找菜市场商户买菜
    this.vegetableMarketer.purchase()
    // 妹妹帮忙冼菜
    this.sister.wash()
    // 妈妈下厨
    this.mom.cook()
    // 大家用餐
    eat()
    // 自己洗碗收拾
    clean()
  }
}
```
情形二：下馆子聚餐
```ts
class Facade {
  constructor() {
    // 餐馆开门前就准备好菜，招好了厨师、服务员、清洁工
    this.vegetableMarketer = new VegetableMarket()
    this.vegetableMarketer.purchase()
    this.chef = new Chef()
    this.waiter = new Waiter()
    this.cleaner = new Cleaner()
  }

  order() {
    this.waiter.order() // 服务员接待、入座、点菜下单
    this.chef.cook()
    this.waiter.serve()
  }
  clean() {
    this.cleaner.clean()
    this.cleaner.wash()
  }
}

function Luncheon() {
  constructor() {
    this.restaurant = new Facade()
  }
  lunch() {
    this.restaurant.order()
    this.eat()
    this.restaurant.clean()
  }
}
```
## 区别

### 外观模式与工厂模式
- 工厂模式属于创建型模式，抽象了创建对象的复杂性，特别是虚拟工厂封装创建产品中多个不同组件类的实例。
- 外观模式属性于结构型模式，抽象了事件流程的复杂性，可以并不产出任务东西。

### 外观模式与中介者模式
外观和中介者模式的职责类似，它们都尝试将大量紧密耦合的类组织起合作。不同的是：
- 外观为子系统中的所有对象组织起来，对外定义了一个简单接口， 但是它本身没有提供任何新功能。并且各个子系统本身不会意识到外观的存在。如果需要，子系统中的对象可以直接相互调用。
- 中介者将子系统之间的沟通行为中心化。各子系统只知道中介者对象，无法直接相互调用沟通。