# react-12: 组件生命周期 lifycycle
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-22 19:05:32
 * @LastEditTime: 2019-09-22 22:14:27
 * @Description:
 -->


React 将所有组件生命周期事件定义分成三类，也是 React 组件生命周期的三个阶段：

-   挂载事件（挂载阶段）： 发生在 React 组件被绑定到真实的 DOM 节点时
-   更新事件（更新阶段）： 发生在 React 组件有新的属性或状态需要更新时，或者强制更新时
-   卸载事件（卸载阶段）： 发生在 React 组件从 DOM 元素中卸载时。

生命周期事件允许通过实现自定义逻辑来增加组件的能力，比如后端数据交互，React 不支持的 DOM 事件实现，集成其它类库等。

> 暂以 v16.0 之前讲解，v16 版本变化较大，后面单独一节讲解

**React v16.0 之前的生命周期**
![Raect lifycycle v16.0 before](./img/react_lifycycle_v15.png)

要实现组件生命周期事件，只需要在组件类中定义一个方法。React 在执行过程中，会检查是否存在一个和事件名称相同的方法，如果有，则调用该方法，否则，将继续执行正常的流程。

**先列举出所有的生命周期函数，再与这三个阶段对应、解释**

```js
const root = document.getElementById('root')
// 显示组件
class Logger extends React.Component {
    constructor(props) {
        super(props)
        console.log('constructor')
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log('componentWillReceiveProps')
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        return true
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate')
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    render() {
        console.log('rendering... display')
        return React.createElement('h1', null, this.props.time)
    }
}
// 容器组件
class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0,
            curTime: new Date().toLocaleString()
        }
        this.updateTime()
    }
    updateTime() {
        setInterval(() => {
            this.setState({
                counter: ++this.state.counter,
                curTime: new Date().toLocaleString()
            })
        }, 1000)
    }

    render() {
        if (this.state.counter > 2) return false
        return React.createElement(Logger, {
            time: this.state.curTime
        })
    }
}

ReactDOM.render(React.createElement(Content), root)
```

## 组件初始化(initialization)阶段

```js
// 显示组件
class Logger extends React.Component {
    constructor(props) {
        super(props)
        console.log('constructor')
    }
}
// 容器组件
class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0,
            curTime: new Date().toLocaleString()
        }
        this.updateTime()
    }
}
```

类的构造方法( constructor() ),自定义组件类 Logger / Content 继承了 react.Component 这个基类，才能有 render()、生命周期、setState()等方法可以使用，这也说明为什么函数组件没有状态和生命周期，因为没有继承基类，不能使用这些方法。

super(props)用来调用基类的构造方法( constructor() ), 也将父组件的 props 注入给子组件，功能子组件读取(组件中 props 只读不可变，state 可变)。

在 constructor()中常用来做一些组件的初始化工作，如定义 this.state 的初始内容。

## 组件的挂载(Mounting)阶段

此阶段分别执行`componentWillMount`，`render`，`componentDidMount`三个方法。

**componentWillMount**

-   在组件挂载到 DOM 前调用，且只会被调用一次。
-   在这边调用 this.setState 不会引起组件重新渲染，也可以把写在这边的内容提前到 constructor()中，所以项目中很少用。
-   在这里请求异步数据，render 可能不会渲染到，因为 componentWillMount 执行后，render 立马执行。

**render**

-   根据组件的 props 和 state（无论 props 进行重新传递或 state 进行重新赋值，无论值是否有变化，都可以引起组件重新 render）。
-   渲染出一个虚拟 dom，或者在 props 或 state 改变时进行 diff 算法，更新 dom 树。
-   return 一个 React 元素（虚拟 DOM），不负责组件实际渲染工作，由 React 自身根据此元素去渲染出页面 DOM（如调用 ReactDOM.render()渲染并挂载)。
-   render 是纯函数（Pure function：函数的返回结果只依赖于它的参数；函数执行过程里面没有副作用），不能在里面执行 this.setState，会执行死循环引起 React 报错终止。
-   子组件的 render()函数会在父组件 render()执行的时候被执行。

**componentDidMount**

-   组件挂载到 DOM 后调用，且只会被调用一次。
-   在这里可以异步请求数据。
-   在这里设置状态会触发重新渲染。但是不推荐在这里使用 setState 函数，它会触发一次额外的渲染，而且是在浏览器刷新屏幕之前执行，用户看不到这个状态。在这里使用 setState 函数会导致性能问题。

## 组件的更新(update)阶段

此阶段前需要先明确下 react 组件更新机制。setState 引起的 state 更新或父组件重新 render 引起的 props 更新，更新后的 state 和 props 相对之前无论是否有变化，都将引起子组件的重新 render[具体看这篇文章](https://www.cnblogs.com/penghuwan/p/6707254.html)

### 造成组件更新有三种情况

1. 父组件重新 render
1. 组件本身调用 setState，无论 state 有没有变化。
1. 手动调用`this.forceUpdate()`进行强制更新

此阶段分别执行:

1. `componentWillReceiveProps`
1. `shouldComponentUpdate`
1. `componentWillUpdate`
1. `render`
1. `componentDidUpdate`

**componentWillReceiveProps(nextProps)**

-   此方法只调用于 props 引起的组件更新，参数 nextProps 是父组件传给当前组件的新 props。
-   setState 引用的更新不会调用此方法
-   但父组件 render 方法的调用不能保证重传给当前组件的 props 是有变化的，所以在此方法中根据 nextProps 和 this.props 来查明重传的 props 是否改变，以及如果改变了要执行啥，比如根据新的 props 调用 this.setState 出发当前组件的重新 render。
    -   该函数(componentWillReceiveProps)中调用 this.setState() 将不会引起二次渲染。因为 componentWillReceiveProps 中判断 props 是否变化了，若变化了，this.setState 将引起 state 变化，从而引起 render，此时就没必要再做第二次因重传 props 引起的 render 了，不然重复做一样的渲染了。

**shouldComponentUpdate(nextProps, nextState)**
此方法通过比较 nextProps，nextState 及当前组件的 this.props，this.state，返回 true 时当前组件将继续执行更新过程，返回 false 则当前组件更新停止，以此可用来减少组件的不必要渲染，优化组件性能。

**componentWillUpdate(nextProps, nextState)**
此方法在调用 render 方法前执行，在这边可执行一些组件更新发生前的工作，一般较少用。

**render**
render 方法在上文讲过，这边只是重新调用。

**componentDidUpdate(prevProps, prevState)**
此方法在组件更新后被调用，可以操作组件更新的 DOM，prevProps 和 prevState 这两个参数指的是组件更新前的 props 和 state

## 卸载(unmounte)阶段

此阶段只有一个生命周期方法`componentWillUnmount`

**componentWillUnmount**
此方法在组件被卸载前调用，可以在这里执行一些清理工作，比如清楚组件中使用的定时器，清楚 componentDidMount 中手动创建的 DOM 元素等，以避免引起内存泄漏。

## 示例

在上一节，我们有一个问题是如何监听非 React 组件事件，如`reset`。

```js
const root = document.getElementById('root')
// 监听窗口的resize事件，输出当前窗口宽度
class ListenResize extends React.Component {
    constructor(props) {
        super(props)
    }

    // 事件处理程序：窗口缩放时输出窗口宽度大小
    handleResize(e) {
        console.log(window.innerWidth)
    }

    // 在DOM挂载完成时，注册resize监听事件
    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    }

    // 在组件卸载时，移除resize监听事件
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    render() {
        return React.createElement('h1', null, 'React resize')
    }
}

ReactDOM.render(React.createElement(ListenResize), root)
```
