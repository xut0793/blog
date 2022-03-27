# 快照测试

WWHD

## What: 什么是快照测试

快照测试类似于“找不同”的游戏。快照测试会给运行中的应用程序拍一张图片，并将其与以前保存的图片进行比较，如果图像有什么不同，则测试失败。

传统的快照测试，通常也叫做视觉回归测试，是利用工具获取渲染页面的屏幕截图，并与之前的屏幕截图进行逐像素比较。

现代的 Snapshot 快照测试可以对测试值进行序列化，存储为文本文件，并使用 diff 算法进行比较。

jest 的提供的 Snapshot 快照测试功能，基本上会对任何可以转换为字符串的 javascript 值进行序列化保存。

## Why：为什么需要快照测试

快照测试常用于测试组件的 UI 效果，对界面进行回归测试时非常有效。

> 因为现代 Snapshot 使用序列化值进行比较，所以也不局限于 UI 视图的快照测试，也可用于 log 日志或错误消息记录之类的功能。

## How：怎么使用

### 生成快照 `toMatchSnapshot`

jest 提供了 `toMatchSnapshot` 匹配器来生成快照，并进行快照比对。

你可以传入任何一个可被序列化的值进行测试

```js
expect('value').toMatchSnapshot()
expect({ id: 1, name: 'tom' }).toMatchSnapshot()
expect(document.querySelector('div')).toMatchSnapshot()
```

- 当第一次运行快照测试时，它会在与测试文件同级目录中创建一个`__snapshots__`的文件夹存放该目录下的所有快照测试生成的快照文件，快照文件以 `.snap` 为扩展名保存。
- 当下一次运行快照测试时，程序就会将当前 `toMatchSnapshot()`生成的快照与之前存放的快照文件进行比对，无差异则通过，有不同则测试失败。

```js
// list.spec.js
const List = {
  template: `<li>List Item</li>`,
}

test('render list item correctly', () => {
  const wrapper = shallowMount(List)
  expect(wrapper.element).toMatchSnapshot()
})
```

首次运行后，生成一个快照文件`list.spec.snap`，内容大概像这样：

```js
exports[`render list item correctly`] = `
<li>
  List Item
</li>
`
```

### 更新快照 `--updateSnapshot`

下次再次运行测试文件时，它就会用新值与已保存的文件值进行比较。如果完全匹配，则测试通过。如果有差异，则测试失败，并显示差异信息。

```diff
Snapshot name `render list item correctly`

- Snapshot -1
- Received +1

  <li>
-   List Item
+   Not Item
  </li>
```

此时如果确实是错误问题导致的，可以到源码进行修改，并重新运行测试直到通过。

但如果当前差异是我们计划内的更改，那么就你需要更新当前快照文件。

可以更改 jest 运行命令，添加 `--updateSnapshot`，简写 `-u`，此时 jest 会重写所有失败的快照文件。

但这种批量重写会有产生隐患，有时可能确实需要更新个别快照文件，但并不是所有。所以上述批量命令可能会把错误信息更新到快照文件中。

有两种方法可以解决这个问题

- 命令增加 `--testNamePattern` 命令参数，简写 `-t`，输入一个正则，匹配成功的快照文件才进行更新，如 `jest -t=auth`，则会匹配到所有 name 包含 auth 字段的测试用例。
- 使用**交互模式**：当 Jest 运行失败时，命令行会提示你是否进入 jest 的交互模式， 按 `w` 进入，然后根据提示，您可以选择`u`更新`update`该快照文件，或使用 `s` 跳过`skip`至下一个失败的快照。

### 静态内容的快照测试

静态组件是指没有任何任何逻辑的组件，它总是渲染相同的 HTML 作为输出，并且它不接受任何 prop，也没有任何 state。

为静态组件编写单元测试是没有必要的，但是最初完成了静态组件并手动测试了它的 UI 效果后，想要确保以后该静态组件不会发生变更，那为它进行快照测试就非常有用了。

它的测试代码也非常简单。

```js
import { shallowMount } from '@vue/test-utils'
import Spinner from 'src/components/Spinner.vue'

describe('Spinner.vue', () => {
  test('render correctly', () => {
    expect(shallowMount(Spinner).element).toMatchSnapshot()
  })
})
```

### 动态内容的快照测试

与静态组件对应的，这里的动态组件是指那些包含逻辑和状态的组件，它的渲染输出的 UI 视图会因为更新了 prop 或变动了数据状态而改变。

- 当你为动态组件编写快照测试时，应该尝试捕获尽可能多的不同组合的状态，这样快照测试将尽可能地覆盖更全的功能。
- 快照测试必须是可确定的，也就是说只要没有改动源码，那无论何时测试渲染输出应该总是相同的。

但如果测试组件中包含会变更的状态时，快照测试就会很难通过了。比如一个文章列表组件`ListItem`，其中会实时显示时间，比如最新修改时间显示为：几小前 / 几天前，当超过一个月时，才显示完整的 `yyyy-mm-dd hh:mm:ss` 时间，这时如果对该组件进行快照测试，那总会以失败告终。

在此情形下，如果需要对该组件进行快照测试，就有必要模拟一个固定的时间用于测试。

> 在 jest 中对复杂依赖进行模拟的手段有：jest.fn / jest.spyOn / jest.mock

```js
descibe('ListItem.vue’, () => {
  const mockNow = jest.spyOn(Date, 'now')
  const dateNowTime = new Date('2021-05-20 22:55:00')

  mockNow.mockImplementation(() => dateNowTime) // 模拟一个固定时间，用于列表渲染

  const item = {
    id: 12,
    title: 'learn vue-test-utils',
    by: 'xut',
    updateTime: (dateNowTime / 1000 ) - 6000,
  }

  const wrapper = shallowMount(ListItem, {
    propsData: {
      item,
    }
  })

  mockNow.mockRestore() // 退出 data.now 模拟
  expect(wrapper.element).toMatchSnapshot() // 生成快照测试，并比对。
})
```

```js
```

理想情况下，影响视图渲染结果的所有分支都应该被快照测试覆盖。但是实际是不可能实现 100% 页面的快照测试。

为一个组件输出大量快照测试，就意味着组件每次细微的改变就会有大量失败的快照测试用例。所以快照测试适量即可。

```tip
《Vue.js 应用测试》作者说他的习惯是一个组件的快照测试不会超过三个。他遵循的组件开发工作流：
1. 编写单元测试来覆盖组件的核心功能，(TDD 开发模式：测试驱动开发)
1. 编写组件代码，使得组件逻辑测试通过
1. 编写组件样式，并在浏览器手动测试组件样式
1. 完成组件样式后，再添加一个快照测试，尽量使用较全面数据，便得快照测试覆盖大部分页面功能。视需求再增加其它分支的快照测试。
```

## 快照测试最佳实践

- 30% 的快照测试

快照测试位于测试金字塔中间位置，差不多占测试用例 30% 左右。因为快照测试速度并不理想，越多的快照测试会消耗更长的时间; 并且少部分的代码改动，可能会导致大面积的快照测试失败。

- 快照测试添加独立的测试命令

因为单元测试是频繁执行的，不想因为快照测试的速度影响单元测试的速度，所以可以：

- 将快照测试文件独立存入到 `tests/snapshots`，使用独立配置文件，主要是更改配置文件中 `testMatch / testPathIgnorePatterns` 来匹配对应的测试文件
- 创建独立的测试命令：
  - `test:unit: "jest --config="path/jest.unit.config.js"`
  - `test:snap: "jest --config="path/jest.snap.config.js"`

## 扩展：动态匹配 expect.any

`expect.any(constructor)` 会匹配需要断言的值与给定构造函数创建的值是同类型即可通过，也就是说只对断言值的类型作限制。

```js
it('will fail every time', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  }

  expect(user).toMatchSnapshot()
})

// 会生成如下快照 Snapshot
exports[`will fail every time 1`] = `
Object {
  "createdAt": 2018-05-19T23:36:09.816Z,
  "id": 3,
  "name": "LeBron James",
}
`
```

对于上述动态的属性值 `createdAt / id`，会导致每次运行快照测试失败。此时我们可以通过 `toMatchSnapshot` 函数传入一个对象，明确告诉 jest 进行快照比对时对它们只断言类型，不需要断言完全相同的值，以便让整个快照测试随时通过。

```js
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  }

  expect(user).toMatchSnapshot({
    createdAt: expect.any(Date),
    id: expect.any(Number),
  })
})

// 会生成如下快照 Snapshot
exports[`will check the matchers and pass 1`] = `
Object {
  "createdAt": Any<Date>,
  "id": Any<Number>,
  "name": "LeBron James",
}
`
```

`toMatchSnapshot(propertyMatchers)` 传入的属性匹配对象将作为需要断言对象的子集。`toMatchSnapshot` 函数在执行快照比对过程中，会使用传入的属性值作比对，并且更新快照文件中，而没有传入的属性值与旧快照值作比对。

对于明确数据结构的值进行快照测试时非常有用，所以常用于后端 json 文件的单元测试。对前端 UI 进行动态内容快照测试时更易用第一种固定模拟值的方法。

## 扩展：内联快照 toMatchInlineSnapshot

使用行内 Snapshot 的前提是：安装 prettier `npm i perttier -D`

行内 Snapshot 和普通 Snapshot 的区别：

- `toMatchInlineSnapshot()` 行内 Snapshot 把生成的快照放到了测试用例里边，作为`toMatchInlineSnapshot`函数的第二个参数的形式传入。
- `toMatchSnapshot()` 普通 Snapshot 会把生成的快照放到`__snapshots__`目录中单独的文件里。

第一次执行时：

```js
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  }

  expect(user).toMatchInlineSnapshot({
    createdAt: expect.any(Date),
    id: expect.any(Number),
  })
})
```

第二次执行时，jest 会自动将上次生成的快照作为参数传入：

```js
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  }

  expect(user).toMatchInlineSnapshot(
    {
      createdAt: expect.any(Date),
      id: expect.any(Number),
    },
    `
    Object {
      "createdAt": Any<Date>,
      "id": Any<Number>,
      "name": "LeBron James",
    }
    `
  )
})
```

## `toBe(value) / toEqual(value) / toContainEqual(item) / toStrictEqual(value)`

### `toBe(value)`

`toBe(value)` 比较规则基本与 `Object.is()`函数一致。[MDN: Object.js](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

主要关注两点：

- 常用来比较原始值的完全相等。`expect(true).toBe(true)`
- 如果是用于对象，则检查对象为同一个引用地址，即验证对象引用的一致性。但不保证对象内部属性值或结构一致。

### `toEqual(value)`

因为 `toBe` 传入对象时只判断对象引用的一致性，即判断对象堆内地址是否相同。但对于对象内部的属性值和结构不比较。

所以 `toEqual(object)`会递归的比较对象的每一个属性值，即两者深度相等时才测试通过。并不在乎对象是否引用一致，只关注内部属性值和属性结构的一致性。

```js
const can1 = {
  flavor: 'grapefruit',
  ounces: 12,
}
const can2 = {
  flavor: 'grapefruit',
  ounces: 12,
}

describe('toEqual and toBe', () => {
  // can1 与 can2 对于 toEqual 是相同的对象，因为属性和属性值都一样。
  test('have all the same properties', () => {
    expect(can1).toEqual(can2)
  })

  // 对于 toBe 来说却是两种不同的对象，因为声明的两个对象有不同的地址
  test('are not the exact same can', () => {
    expect(can1).not.toBe(can2)
  })
})
```

### `toStrictEqual(value)`

比 `toEqual` 更严格的检查，使用`.toStrictEqual`测试的对象要求具有相同的类型以及结构。

- `{a:undefined, b: 2}` 与 `{b: 2}` 是不相等的
- 稀疏数组也是不相等的 `[,1]`与 [undefined, 1]
- 不是同一个类 class 的实例对象也是不相等的。

```js
class LaCroix {
  constructor(flavor) {
    this.flavor = flavor
  }
}

describe('the La Croix cans on my desk', () => {
  test('are not semantically the same', () => {
    // 对象属性和值都一致， toEqual 通过
    expect(new LaCroix('lemon')).toEqual({ flavor: 'lemon' })

    // 传入对象和预期对象不属于同一类的实例，toStrictEqual 是不会通过的
    expect(new LaCroix('lemon')).not.toStrictEqual({ flavor: 'lemon' })
  })
})
```

### `toContainEqual(item)`

可以判断数组中是否包含一个特定对象，类似 toEqual 与 toContain 的结合。

```js
function myBeverages() {
  return [
    { delicious: true, sour: false },
    { delicious: false, sour: true },
  ]
}
test('is delicious and not sour', () => {
  const myBeverage = { delicious: true, sour: false }
  expect(myBeverages()).toContainEqual(myBeverage)
})
```

延伸： `.toContain(item)`

判断数组是否包含特定子项

```js
const shoppingList = ['diapers', 'beer']

test('购物清单（shopping list）里面有啤酒（beer）', () => {
  expect(shoppingList).toContain('beer')
})
```

### `toMatchObject(object)`

判断一个对象嵌套的 key 下面的 value 类型，需要传入一个对象。

```js
const houseForSale = {
  bath: true,
  bedrooms: 4,
  kitchen: {
    amenities: ['oven', 'stove', 'washer'],
    area: 20,
    wallColor: 'white',
  },
}
const desiredHouse = {
  bath: true,
  kitchen: {
    amenities: ['oven', 'stove', 'washer'],
    wallColor: expect.stringMatching(/white|yellow/),
  },
}

test('the house has my desired features', () => {
  expect(houseForSale).toMatchObject(desiredHouse)
})
```

延伸：`.toHaveProperty(keyPath, value)`

判断在指定的 path 下是否有这个属性，嵌套的 path 可以用 `.`分割，也可以用数组。

```js
// Object containing house features to be tested
const houseForSale = {
  bath: true,
  bedrooms: 4,
  kitchen: {
    amenities: ['oven', 'stove', 'washer'],
    area: 20,
    wallColor: 'white',
  },
}

test('this house has my desired features', () => {
  // 简单的引用
  expect(houseForSale).toHaveProperty('bath')
  expect(houseForSale).toHaveProperty('bedrooms', 4)

  expect(houseForSale).not.toHaveProperty('pool')

  // 使用 . 点号表示深度引用
  expect(houseForSale).toHaveProperty('kitchen.area', 20)
  expect(houseForSale).toHaveProperty('kitchen.amenities', [
    'oven',
    'stove',
    'washer',
  ])
  expect(houseForSale).not.toHaveProperty('kitchen.open')

  // 使用包含keyPath的数组进行深度引用
  expect(houseForSale).toHaveProperty(['kitchen', 'area'], 20)
  expect(houseForSale).toHaveProperty(
    ['kitchen', 'amenities'],
    ['oven', 'stove', 'washer']
  )
  expect(houseForSale).toHaveProperty(['kitchen', 'amenities', 0], 'oven')
  expect(houseForSale).not.toHaveProperty(['kitchen', 'open'])
})
```
