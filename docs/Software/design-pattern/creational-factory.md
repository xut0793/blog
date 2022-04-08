# Factory 工厂模式

- 简单工厂 Simple Factory
- 工厂方法 Factory Method
- 抽象工厂模式 Abstract Factory

工厂模式核心是隔离类的声明和类的实例化，通过其它类来实现，而不是直接调用具体类的构造器。

假设现在做一个图形的积木游戏，根据提示选取对应的图形在基座上安装。首先定义了各种形状基本图形。

```ts
interface Shape {
  inset(): void
}

class Rect implements Shape {
  inset() {
    console.log('rect insetted')
  }
}
class Circle implements Shape {
  inset() {
    console.log('circle insetted')
  }
}
class Triangle implements Shape {
  inset() {
    console.log('triangle insetted')
  }
}
```
在主程序中，根据提示选择对应的图形类进行实例化，比如提示三角形，则用 Triangle 类的实例嵌入基座上。
```ts
const readline = require('readline')
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const question = util.promisify(rl.question).bind(rl);

async function main() {
  try {
    let shape: Shape
    const answer = await question('请输入图形');
    
    switch (answer) {
      case 'triangle':
        shape = new Triangle()
        break
      case 'circle':
        shape = new Circle()
        break
      default:
        shape = new Rect()
        break
    }
    
    shape.inset()

  } catch (err) {
    console.error('Question rejected', err);
  }
}
```

## Simple Factory 简单工厂
可以看到，main 函数中出现冗长的 case 语句来实现选择使用哪种图形类进行实例化。根据单一职责原则，可以把实例化的代码抽离出来作为一个独立的方法，这个独立的方法就是一个简单的工厂方法。
```ts
function createShape(type: string) {
  let shape: Shape
  
  switch (type) {
    case 'triangle':
      shape = new Triangle()
      break
    case 'circle':
      shape = new Circle()
      break
    default:
      shape = new Rect()
      break
  }
  
  return shape
}
```
在面向类的编程语言中是无法直接创建对象和函数的，必须先声明类，然后用类来创建对象和方法，所以在面向类的编程语言中可以声明一个简单工厂类，利用类的静态方法创建实例。
```ts
class SimpleFactory {

  static create(type: string): Shape {
    let shape: Shape
    
    switch (type) {
      case 'triangle':
        shape = new Triangle()
        break
      case 'circle':
        shape = new Circle()
        break
      default:
        shape = new Rect()
        break
    }
    
    return shape
  }
}
```
此时 main 函数的功能职责就更单一明确了。
```ts
async function main() {
  try {
    const answer = await question('请输入图形');
    
    // const shape = createShape(answer)
    const shape = SimpleFactory.create(answer)
    shape.inset()

  } catch (err) {
    console.error('Question rejected', err);
  }
}
```

## Factory Method 工厂方法

简单工厂(Simple Factory)模式中，各种具体形状类的创建都是通过唯一一个工厂进行对应的实例化。随着游戏的进行，需要增加更多的图形，这个简单工厂就会被不断的反复修改，缺乏可扩展性。在实践中，对于一些庞大复杂的系统，大量的产品判断逻辑被堆积在一个简单工厂方法中，看起来功能强大，但维护起来举步维艰，让简单工厂变得一点也不简单了。即便简单工厂的结果是只返回一种图形，但内部也充斥着各种判断逻辑。

工厂方法的模式就是不再将所有产品的实例化都聚集在一个工厂类中完成，而让每一个产品都对应一个创建工厂的类，这样每个产品都自己所属的工厂来生产，而对应工厂来说，一个工厂只生产一种产品，功能职责更单一。

```ts
interface Shape {
  inset(): void
}

class Rect implements Shape {
  inset() {
    console.log('rect insetted')
  }
}
class Circle implements Shape {
  inset() {
    console.log('circle insetted')
  }
}
class Triangle implements Shape {
  inset() {
    console.log('triangle insetted')
  }
}

// 对应的工厂方法
interface Factory {
  create(): Shape
}
class RectFactory implements Factory {
  crate(): Shape {
    return new Rect()
  }
}
class CircleFactory implements Factory {
  crate(): Shape {
    return new Circle()
  }
}
class TriangleFactory implements Factory {
  crate(): Shape {
    return new Triangle()
  }
}
```
此时在主程序中生成图形的时候，还是会面临最初的问题，虽然工厂方法明确了产品和工厂的职责，但在使用时在主程序中逻辑的耦合还存在。
```ts
async function main() {
  try {
    const answer = await question('请输入图形');
    let shape: Shape
    
    switch (answer) {
      case 'triangle':
        shape = new TriangleFactory().create()
        break
      case 'circle':
        shape = new CircleFactory().create()
        break
      default:
        shape = new RectFactory().catre()
        break
    }
    
    shape.inset()

  } catch (err) {
    console.error('Question rejected', err);
  }
}
```
此时，我们可以抽象出一个针对工厂方法的工厂进行解耦。
```ts
class FactoryMethodFactory {
  static create(type: string): Factory {
    let factory: Factory
    
    switch (answer) {
      case 'triangle':
        factory = new TriangleFactory()
        break
      case 'circle':
        factory = new CircleFactory()
        break
      default:
        factory = new RectFactory()
        break
    }

    return factory
  }
}

async function main() {
  try {
    const answer = await question('请输入图形');
    const factory = FactoryMethodFactory.create(answer)
    const shape = factory.create()
    shpae.inset()
  } catch (err) {
    console.error('Question rejected', err);
  }
}
```
在实际应用中，这些工厂类往往创建一次实例就够了，没有必要每次调用 ShapeFactoryFactory.createShape(str) 时都实例化新对象。就是每一种工厂都只实现一个单例，这个时候就可以结合前面的单例模式，用一个哈希对象缓存起来。在实现上，可以使用饿汉模式，在类创建时，提前实例化好工厂类，或者懒汉模式，在使用到时才实例化并缓存。
```ts
class FactoryMethodFactory {
  static factoryMap = new map()
  static create(type: string): Factory {

    let factory: Factory = this.factoryMap.get(type)
    if (factory) return factory

    switch (answer) {
      case 'triangle':
        factory = new TriangleFactory()
        break
      case 'circle':
        factory = new CircleFactory()
        break
      case 'rect':
        factory = new RectFactory()
        break
      default:
        break
    }

    if (factory) this.factoryMap.set(type, factory)
    return factory
  }
}
```
从代码实现上，工厂方法模式相比简单工厂模式要更麻烦，更为繁琐。那么我们什么时候应该用简单工厂模式，什么时候用工厂方法模式呢？
- 如果要创建的子类很少且创建逻辑并不复杂，用简单工厂模式要更好，也不容易写错。
- 如果实例化的逻辑很复杂，或涉及到其他类的创建和关联之类的，用工厂方法模式。遵循单一职责原则，将复杂的创建过程解耦。这时候如果你用简单工厂模式，将所有创建逻辑放在单独一个类里，会导致这个类异常复杂，不易维护。

## Abstract Factory 抽象工厂

不管是简单工厂还是工厂方法模式，都只是针对单一对象，而抽象工厂能够应对更加复杂的产品族系的需求，比如创建同类型的一组对象。

还是以上面拼图为例，现在有两种品牌的拼图，乐高和迪士尼，两种不兼容，我们不能把乐高的矩形拼在迪士尼的基座上。如果按工厂方法的模式，三个图形类（矩形、圆、三角形）对应三个图形工厂类，再对应两种品牌，需要声明12个类，如果还要增加图形，那类的声明就会发生组合爆炸。这个时候我们需求在品牌的角度进行抽象，而不是关注具体的产品。

```ts
interface BrandFactory {
  createRect(): Rect
  createCircle(): Circle
  createTriangle(): Triangle
}

class LegoFactory implements BrandFactory {
  createRect() {
    return new Rect()
  }
  createCircle() {
    return new Circle()
  }
  createTriangle() {
    return new Triangle()
  }
}

class DisneyFactory implements BrandFactory {
  createRect() {
    return new Rect()
  }
  createCircle() {
    return new Circle()
  }
  createTriangle() {
    return new Triangle()
  }
}
```
使用时
```ts
async function main() {
  try {
    const answer = await question('请输入图形');
    const factory = new LegoFactory()
    let shape
    switch (answer) {
      case 'triangle':
        shape = factory.createTriangle()
        break
      case 'circle':
        shape = factory.createCircle()
        break
      case 'rect':
        shape = factory.createRect()
        break
      default:
        break
    }
    
    shpae.inset()
  } catch (err) {
    console.error('Question rejected', err);
  }
}
```
同理，如果要隔离main中的实例化逻辑，可以再实现一个抽象工厂的工厂来解耦。

## 区别

首先明确一点，工厂的模式属于创建型设计模式，关注点在于隔离类的声明和类的实例化。
- 简单工厂：适用于创建逻辑简单的单一对象
- 工厂方法：适用于创建逻辑复杂的单一对象，将复杂的创建逻辑进行解耦
- 抽象工厂：适用于创建一组对象，关注焦点一定是基于产品族系层面的，比如品牌或者系列。