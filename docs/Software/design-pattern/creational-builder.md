# Builder 建造者模式

建造者模式，或称生成器模式，属性于创建型模式。建造者模式并不复杂，就是将类的创建逻辑从类的构造函数中抽离出来，让一个复杂的对象的构建与它的表示进行解耦。

在其它创建型模式中，使用者不关心这个实例对象是如何被创建出来的，只需要得到一个实例对象就可以了。但建造者模式在得到最终实例对象的同时，重点关注实例对象的创建过程，不同的创建过程产生不同的实例对象。

## 简单建造者
比如我们经常在类的构造函数中进行参数的校验，当在构造函数中对各个参数的校验逻辑过于复杂时，我们可以考虑把构造函数中的逻辑抽离出来，放到构造类中，这个构造类就充光一个建造者 builder 的角色。
```ts
// 创建一个矩形，需要校验rect 的初始属性：要求传入唯一 id, 宽高 width, height，左上角位置 x, y, 如果提供了中心位置则通过计算出左上角位置。
class Rect {
  constructor(private id: string, private x: number, private y: number, private width: number, private height: number) {}
  draw() {
    console.log(`draw rect with id ${this.id}, pos (${this.x}, ${this.y}), size ${this.width}x${this.height}`)
  }
}

class RectBuilder {
  private id: string = ''
  private x: number
  private y: number
  private cx: number
  private cy: number
  private width: number
  private height: number

  setPos(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }
  setCenterPos(cx: number, cy: number) {
    this.cx = cx
    this.cy = cy
    return this
  }
  setSize(width: number, height: number) {
    this.width = width
    this.height = height
    return this
  }
  setID(id: string) {
    this.id = id
    return this
  }
  build(): Rect {
    if (this.id === '') {
      throw new Error('不能设置空字符串')
    }
    if (this.width === undefined || this.height === undefined) {
      throw new Error('未设置宽高')
    }

    let x: number, y: number
    if (this.cx !== undefined) {
      x = this.cx - this.width / 2
      y = this.cy - this.height / 2
    } else if (this.x === undefined) {
      throw new Error('未设置位置或中心位置')
    } else {
      x = this.x
      y = this.y
    }
    return new Rect(this.id, x, y, this.width, this.height)
  }
}

// 使用
const rect: Rect = new RectBuilder()
    .setID('rect-5')
    .setPos(0, 0)
    .setCenterPos(100, 100) // 此时前面设置的 x，y 被覆盖。
    .setSize(30, 50)
    .build()

rect.draw()
```
## 复杂建造者
既然是建造者，就以房屋建造为例进行说明。一幢房屋建造非常复杂，为了简化其数据模型，我们将组成建筑物的模块归纳为3个组件，分别是地基、墙体、屋顶，将它们组装起来就能形成一座建筑物。
```ts
class Building {
  // 用List来模拟建筑物的组装
  private buildingComponents: string[] = []

  // 地基
  setBasement(basement: string) {
    this.buildingComponents.push(basement)
  }

  // 墙体
  setWall(wall: string) {
    this.buildingComponents.push(wall)
  }

  // 屋顶
  setRoof(roof: string) {
    this.buildingComponents.push(roof)
  }

  // 输出成型的房屋
  toString() {
    let buildingStr: string = ''
    for (let comp of this.buildingComponents) {
      buildingStr += comp
    }
    return buildingStr
  }
}
```
房屋的建筑工艺十分复杂，不同的建筑物有不同的建筑标准，比如建造平房、建造别墅和建造多层公寓等，如何保证各道工艺的质量，需要有对应建筑资质的专业建筑施工方 Builder 来完成。
```ts
// 定义施工方的接口，相当于公布建筑招标的施工标准
interface Builder {
  buildBasement(): void
  buildWall(): void
  buildRoof(): void
  getBuilding(): Building
}

// 别墅施工方
class HouseBuilder implements Builder {
  private house: Building
  constructor() {
    this.house = new Building()
  }

  // 别墅打地基的工艺
  buildBasement() {
    console.log("挖土方，部署管道，埋线缆，水泥加固、搭建围墙")
    this.house.setBasement('╬╬╬╬╬╬╬╬╬╬\n')
  }

  // 别墅墙体的工艺
  buildWall() {
    console.log("搭建本质框架，石膏板封墙，粉刷内外墙")
    this.house.setWall("|田|田|田|\n")
  }

  // 别墅屋顶的工艺
  buildRoof() {
    console.log("建造木质屋顶，阁楼、安装烟囱，做好防水")
    this.house.setRoof("◢▇▇▇▇▇▇◣\n")
  }

  getBuilding() {
    return this.house
  }
}


// 多层公寓施工方
class ApartmentBuilder implements Builder {
  private house: Building
  constructor() {
    this.house = new Building()
  }

  // 多层公寓打地基的工艺
  buildBasement() {
    console.log("深挖地基，修建地下车库，部署管道、线缆、通风")
    this.house.setBasement('╚═════════════╝\n')
  }

  // 多层公寓墙体的工艺
  buildWall() {
    console.log("搭建本质框架，石膏板封墙，粉刷内外墙")
    // 8层
    for (let i = 0; i < 8; i++) {
      this.house.setWall("| 口 | 口 | 口 |\n")
    }
  }

  // 多层公寓屋顶的工艺
  buildRoof() {
    console.log("建造木质屋顶，阁楼、安装烟囱，做好防水")
    this.house.setRoof("╔═══════════════╗\n")
  }

  getBuilding() {
    return this.house
  }
}
```
房屋建筑工艺复杂，由对应的建筑资质的施工方保证，但整个施工工序同样重要，不至于屋顶在下面，地基在天上的情况。施工方只负责干活，如何保证整个建筑物的施工质量和施工流程，就需要一个工程监理的角色，在施工现场指导施工，并把控整个施工流程，确保施工质量。
```ts
class Director {
  private builder: Builder
  constructor(builder: Builder) {
    this.builder = builder
  }

  setBuilder(builder: Builder) {
    this.builder = builder
  }

  direct() {
    console.log("=====工程项目启动=====")

    // 第一步：打地基
    this.builder.buildBasement()

    // 第二步：建造墙体
    this.builder.buildWall()

    // 第三步：建筑封顶
    this.builder.buildRoof()

    console.log("=====工程项目竣工=====")

    return this.builder.getBuilding()
  }
}
```
项目实施
```ts
function main() {
  let building: Building
  // 组建别墅施工队
  let builder: Builder = new HouseBuilder()
  const director = new Director(builder)
  building = director.direct()
  console.log(building)

  // 替换施工队，建造公寓楼
  builder = new ApartmentBuilder()
  director.setBuilder(builder)
  building = director.direct()
  console.log(building)
}
```
**工艺和工序**
复杂对象的构建显然需要专业的建造团队，建造标准的确认让产品趋向多样化，基建造工艺可以交给多位建造者(builder)去各显其长，而建造工序的保证则交由项目总监(director)去全局把控。梳理需求中变与不变的部分，使**工艺多样化**和**工序标准化**，通过相同的构造过程产出不同的产品。

建造者模式的角色：
- Product 产品：复杂的产品类，构建过程相对复杂，需要其它组件组装而成。对应上面的建筑物 Building
- Builder 建造者接口：声明了产品组装的各个部件标准，对应上面 Builder 接口
- ConcreteBuilder 建造者的实现：具体的建造者实现类，产品标准的多种实现，负责产品组成的各个部件的生产，不包含产品组装步骤。对应上面别墅施工方和公寓楼施工方。
- Director 指导者：指导建造者按一定的逻辑组装产品，对应上面的工程总监。


建造者与工厂模式的区别
- 总的来说，建造者模式与工厂模式的关注点不同，工厂模式只需要获得实例对象即可，不关心对象如何实现。而建造者关注创建对象的过程，解耦了对象的实现和表现。
- 工厂模式中，客户端实例化工厂类，然后调用工厂方法获取所需对象；不关心对象的实现，只需要获得对象即可。
- 建造者模式中，客户端可以不直接调用建造者相关方法，而是通过指挥者来指导如何生成对象，它更侧重一步步构建一个复杂对象，返回一个完整的对象。
- 所以建造者模式用于创建复杂对象；工厂模式用于创建简单对象。