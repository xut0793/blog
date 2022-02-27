# react-08: 组件状态 state
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-20 23:21:03
 * @LastEditTime: 2019-09-21 08:16:12
 * @Description:
 -->


迄今为止,我们已经使用了属性,已经了解到通过更改属性可以获得不同的视图.但是属性是在组件外部编写的逻辑,在当前组件内部,属性是不可更改的,因为它们是在组件创建时就定义好传进来的.

现在如果在组件内部元素响应事件变化,需要更改视图的显示?也就是第一篇文章提到的框架的核心:数据的变化如何使用视图更新及时响应?

这就是状态要解决的问题,也是 React 的核心概念.使用状态储存组件内部可变的数据,并根据数据变化更新视图,从而构建一个交互式应用.

React 会保留每次视图的最新状态,一旦状态又发生变化时,React 会非常智能的更新需要更新的地方,而不会全部替换.React 使用虚拟 DOM 技术通过对比状态变化前后视图来确定增量,更新

在讲组件属性时我们就提到一点:
**属性在传入组件内应维持不可变,而组件的动态性应该由组件状态维护**

所以这节,我们来了解下组件状态`state`。学习如何设置状态初始值、访问状态、更新状态。

## 设置状态初始值

1. 在 ES6 `React.Component`类中的构造函数中使用`this.state`
1. 并且使用参数`props`调用`super(props)`方法，这是 ES6 语法 class 类实现继承的语法规范。否则父组件`React.Component`将不起作用。

```js
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        // 初始化状态
        this.state={
            someState = 'someValue'
        }
    }
}
```

> 和其它 OOP 语言一样，constructor()函数会在创建这个类的实例时最先被调用。如果创建 constructor()函数，那么几乎总需要调用 super()方法，否则不会执行父类的构造函数。如果不定义 constructor()方法，那么 super()方法默认调用。这都是 ES6 的 class 类的语法规范。

## 访问状态，即获取状态值

只要该状态属性已经初始化，则可以在类中任何位置访问`this.state.name`,即使在构造函数中也可以引用已初始化的某个状态值来初始化另一个状态。

```js
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        // 初始化状态
        this.state={
            someState = 'someValue'
        }
    },
    render() {
        return React.createElement('h1',null, this.state.someState)
    }
}
```

## 更新状态`this.setState`

使用 React 类的内部方法`this.setState(data,callback)`来改变状态。当此方法调用时，React 将 data 和当前组件类的其它状态合并，然后调用 render()方法更新视图。完成之后执行回调 callback。

如果有依赖新状态执行的操作，可以使用 callback 中来执行，这样可能确保这个新状态是可用的。如果依赖新状态的操作没有在状态变更的回调中执行，这等同于同步使用异步操作，那此时的状态值仍然是旧的，可以会产生 BUG。

> 具体 React 执行 this.setState 后执行视图更新的机制，后面章节再详解。

**划重点**

-   `this.setState()`会触发`render()`
-   不能在`render()`中调用`setState`。因为这将导至死循环`（setState => render => setState...)`，这种情况下，React 会报错

### 综合示例

实现一个时钟的类组件，每隔一秒更新显示的时间

```js
const root = document.getElementById('root')

class Clock extends React.Component {
    constructor(props) {
        super(props)
        // 初始化当前时间
        this.state = {
            currentTime: new Date().toLocaleString()
        }

        // 调用更新时间方法
        this.updateTime()
    }

    updateTime() {
        setInterval(() => {
            console.log('Updating time...')
            this.setState({
                currentTime: new Date().toLocaleString()
            })
        }, 1000)
    }

    // 输出视图
    render() {
        console.log('Rendering....')
        return React.createElement('h1', null, this.state.currentTime)
    }
}

const el = React.createElement(Clock)
ReactDOM.render(el, root)
```

在这里，我们可以打开浏览器控制台，手动为 h1 元素添加一个内联样式（比如把字体设为红色`color:red;`）.可以看到红色在时间更新时会一直保留着。这可以很好说明 React 是如何更新视图的。

我们 Clock 组件渲染了整个 h1 元素，但 setState 只修改了 h1 的文本内容，所以 React 只会更新 h1 的 innerHTMl 内容。添加的 h1 内联样式并没有被更新最初状态。

**React 只会更新依赖数据变化的部分视图。**

## 状态与属性

**相同点：**

-   状态和属性都是类的特性，通过`this.state`和`this.props`获取
-   状态和属性都用于呈现不同的视图，属性呈现创建时即初始化的视图，状态呈现交互过程中的视图

**不同点：**

-   属性从父组件即当前组件之外定义，状态在当前组件内部定义。
-   属性在组件内部不可变更，只能从父组件变更后重新创建视图。
