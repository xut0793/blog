# react-16: 高阶组件`HOC：Higher order components`
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-23 23:55:22
 * @LastEditTime: 2019-09-24 09:24:04
 * @Description:
 -->


本节摘自以下参考链接[点击查看原文](https://blog.csdn.net/maomaoyu3211/article/details/84912436) [以及这篇](https://www.jianshu.com/p/0aae7d4d9bc1)

那么，什么是高阶组件呢？比较高阶函数的定义，高阶组件就是接受一个组件作为参数并返回一个新组件的函数。这里需要注意高阶组件是一个函数，并不是组件，这一点一定要注意。

同时这里强调一点高阶组件本身并不是 React API。它只是一种实践模式，这种模式是由 React 自身的组合性质必然产生的。更加通俗的讲，高阶组件通过包裹（wrapped）被传入的 React 组件，经过一系列处理，最终返回一个相对增强（enhanced）的 React 组件，供其他组件调用。一个高阶组件只是一个包装了另外一个 React 组件的 React 组件。

本质上是一个类工厂（class factory），它下方的函数标签伪代码启发自 Haskell

```
hocFactory:: W: React.Component => E: React.Component
//这里 W（WrappedComponent） 指被包装的 React.Component，E（Enhanced Component） 指返回的新的高阶 React 组件。
```

定义中的『包装』一词故意被定义的比较模糊，因为它可以指两件事情：

-   属性代理（Props Proxy）：高阶组件操控传递给 WrappedComponent 的 props，
-   反向继承（Inheritance Inversion）：高阶组件继承（extends）WrappedComponent。

## 简单的例子

**属性代理 Props Proxy （PP）**

属性代理的实现方法如下：

```js
function ppHOC(WrappedComponent) {
    return class PP extends React.Component {
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
}
```

可以看到，这里高阶组件的 render 方法返回了一个 type 为 WrappedComponent 的 React Element（也就是被包装的那个组件），我们把高阶组件收到的 props 传递给它，因此得名 Props Proxy。

**反向继承 Inheritance Inversion（II）**

```js
function iiHOC(WrappedComponent) {
    return class Enhancer extends WrappedComponent {
        render() {
            return super.render()
        }
    }
}
```

如你所见，返回的高阶组件类（Enhancer）继承了 WrappedComponent。这被叫做反向继承是因为 WrappedComponent 被动地被 Enhancer 继承，而不是 WrappedComponent 去继承 Enhancer。通过这种方式他们之间的关系倒转了。

## 高阶组件的作用

我可以使用高阶组件做什么呢？概括的讲，高阶组件允许你做：

-   代码复用，逻辑抽象，抽离底层准备（bootstrap）代码
-   渲染劫持
-   State 抽象和更改
-   Props 更改

在 React 开发过程中，发现有很多情况下，组件需要被"增强"，比如说给组件添加或者修改一些特定的 props，一些权限的管理，或者一些其他的优化之类的。而如果这个功能是针对多个组件的，同时每一个组件都写一套相同的代码，明显显得不是很明智，所以就可以考虑使用 HOC。

## 高阶组件的实现

### 属性代理 Props Proxy （PP）

Props Proxy 可以做什么？

-   更改 props
-   通过 refs 获取组件实例
-   抽象 state
-   把 WrappedComponent 与其它 elements 包装在一起

#### 更改 props

你可以**读取，添加，修改，删除**将要传递给 WrappedComponent 的 props。

例子：添加新 props。比如例子中目前登陆的一个用户可以在 WrappedComponent 通过 this.props.user 获取用户信息。

```js
function ppHOC(WrappedComponent) {
    return class PP extends React.Component {
        render() {
            const newProps = {
                user: currentLoggedInUser
            }
            return <WrappedComponent {...this.props} {...newProps} />
        }
    }
}
```

#### 通过 refs 获取组件实例

你可以通过 ref 获取关键词 this（WrappedComponent 的实例），但是想要它生效，必须先经历一次正常的渲染过程来让 ref 得到计算，这意味着你需要在高阶组件的 render 方法中返回 WrappedComponent，让 React 进行 reconciliation 过程，这之后你就通过 ref 获取到这个 WrappedComponent 的实例了。

例子：下方例子中，我们实现了通过 ref 获取 WrappedComponent 实例并调用实例方法。

```js
function refsHOC(WrappedComponent) {
    return class RefsHOC extends React.Component {
        proc(wrappedComponentInstance) {
            wrappedComponentInstance.method()
        }
        render() {
            const props = Object.assign({}, this.props, {
                ref: this.proc.bind(this)
            })
            return <WrappedComponent {...props} />
        }
    }
}
```

当 WrappedComponent 被渲染后，ref 上的回调函数 proc 将会执行，此时 proc 就有了这个 WrappedComponent 的实例的引用。可以这里用来『读取，添加』实例的 props 或在这里用来执行实例方法 method。

#### 抽象 state

你可以通过向 WrappedComponent 传递 props 和 callbacks（回调函数）来抽象 state，这和 React 中另外一个组件构成思想 Presentational and Container Components 很相似。

例子：在下面这个抽象 state 的例子中，我们幼稚地（原话是 naively :D）抽象出了 name input 的 value 和 onChange。我说这是幼稚的是因为这样写并不常见，但是你会理解到点。

```js
function ppHOC(WrappedComponent) {
    return class PP extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                name: ''
            }
            this.onNameChange = this.onNameChange.bind(this)
        }
        onNameChange(event) {
            this.setState({
                name: event.target.value
            })
        }
        render() {
            const newProps = {
                name: {
                    value: this.state.name,
                    onChange: this.onNameChange
                }
            }
            return <WrappedComponent {...this.props} {...newProps} />
        }
    }
}
```

或者如下：

```js
const root = document.getElementById('root')

//封装了一个按钮，它的功能和显示完全由外部传入的属性传入
class Button extends React.Component {
    render() {
        return <button onClick={this.props.handler}>{this.props.label}</button>
    }
}

// 定义一个高阶组件，给普通按钮添加submit交互
const EnhancedComponent = Component => {
    class _EnhancedComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {
                label: 'submit'
            }
            this.handleClick = this.handleClick.bind(this)
        }

        handleClick(e) {
            alert('submit')
        }

        render() {
            return (
                <Component
                    {...this.props}
                    {...this.state}
                    handler={this.handleClick}
                />
            )
        }
    }

    _EnhancedComponent.displayName = 'EnhancedComponent'
    return _EnhancedComponent
}

// 实现按钮功能增强
const EnhancedButton = EnhancedComponent(Button)

ReactDOM.render(<EnhancedButton />, root)
```

#### 把 WrappedComponent 与其它 elements 包装在一起

出于操作样式、布局或其它目的，你可以将 WrappedComponent 与其它组件包装在一起。一些基本的用法也可以使用正常的父组件来实现（附录 B），但是就像之前所描述的，使用高阶组件你可以获得更多的灵活性。

例子：包装来操作样式

```js
function ppHOC(WrappedComponent) {
    return class PP extends React.Component {
        render() {
            return (
                <div style={{ display: 'block' }}>
                    <WrappedComponent {...this.props} />
                </div>
            )
        }
    }
}
```

### 反向继承 Inheritance Inversion（II）

可以用反向继承高阶组件做什么？

-   渲染劫持（Render Highjacking）
-   操作 state

#### 渲染劫持（Render Highjacking）

> **渲染 指的是 WrappedComponent.render 方法**
> 你无法更改或创建 props 给 WrappedComponent 实例，因为 React 不允许变更一个组件收到的 props，但是你可以在 render 方法里更改子元素/子组件们的 props。

叫做渲染劫持是因为高阶组件控制了 WrappedComponent 生成的渲染结果，并且可以做各种操作。

通过渲染劫持你可以：

-   **读取、添加、修改、删除**任何一个将被渲染的 React Element 的 props
-   在渲染方法中读取或更改 React Elements tree，也就是 WrappedComponent 的 children
-   根据条件不同，选择性的渲染子树
-   给子树里的元素变更样式

> 反向继承的高阶组件不能保证一定渲染整个子元素树，这同时也给渲染劫持增添了一些限制。通过反向继承，你只能劫持 WrappedComponent 渲染的元素，这意味着如果 WrappedComponent 的子元素里有 Function 类型的 React Element，你不能劫持这个元素里面的子元素树的渲染。

##### 条件性渲染

如果 this.props.loggedIn 是 true，这个高阶组件会原封不动地渲染 WrappedComponent，如果不是 true 则不渲染（假设此组件会收到 loggedIn 的 prop）

```js
function iiHOC(WrappedComponent) {
    return class Enhancer extends WrappedComponent {
        render() {
            if (this.props.loggedIn) {
                return super.render()
            } else {
                return null
            }
        }
    }
}
```

##### 通过 render 来改变 React Elements tree 的渲染结果

```js
function iiHOC(WrappedComponent) {
    return class Enhancer extends WrappedComponent {
        render() {
            const elementsTree = super.render()
            let newProps = {}
            if (elementsTree && elementsTree.type === 'input') {
                newProps = { value: 'may the force be with you' }
            }
            const props = Object.assign({}, elementsTree.props, newProps)
            const newElementsTree = React.cloneElement(
                elementsTree,
                props,
                elementsTree.props.children
            )
            return newElementsTree
        }
    }
}
```

这里你可以做任何操作，比如你可以遍历整个 element tree 然后变更某些元素的 props。这恰好就是 Radium 的工作方式。

#### 操作 state

高阶组件可以 **读取、修改、删除**WrappedComponent 实例的 state，如果需要也可以添加新的 state。

> 需要记住的是，你在弄乱 WrappedComponent 的 state，可能会导致破坏一些东西。通常不建议使用高阶组件来读取或添加 state，添加 state 需要使用命名空间来防止与 WrappedComponent 的 state 冲突。

示例：通过显示 WrappedComponent 的 props 和 state 来 debug

```js
export function IIHOCDEBUGGER(WrappedComponent) {
    return class II extends WrappedComponent {
        render() {
            return (
                <div>
                    <h2>HOC Debugger Component</h2>
                    <p>Props</p> <pre>
                        {JSON.stringify(this.props, null, 2)}
                    </pre>
                    <p>State</p>
                    <pre>{JSON.stringify(this.state, null, 2)}</pre>
                    {super.render()}
                </div>
            )
        }
    }
}
```

## 附录

### 命名

当通过高阶组件来包装一个组件时，你会丢失原先 WrappedComponent 的名字，可能会给开发和 debug 造成影响。

常见的解决方法是在原先的 WrappedComponent 的名字前面添加一个前缀。下面这个方法是从 React-Redux 中拿来的。

```js
HOC.displayName = `HOC(${getDisplayName(WrappedComponent)})`
//or
class HOC extends ... {
  static displayName = `HOC(${getDisplayName(WrappedComponent)})`
  ...
}
```

方法 getDisplayName 被如下定义：

```js
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
         WrappedComponent.name ||
         ‘Component’
}
```

**组件的 dispalyName 静态属性**

上例中我们看到 React 组件`displayName`静态属性的使用。同前面讲过的 React 组件类的静态属性`defaultProps` `propTypes`一样使用，在组件类外部定义，用于定义 React 的元素名。

当 React 的元素名称和组件类名不同时，需要设置 displayName（默认组件名就是类名，可以并不总是你想要的名称）。此例中函数名是`EnhancedComponent`,但定义类名是`_EnhancedComponent`，所以需要将组件类名重命名为外部函数名。

> 在 ES 中通常使用下划线( \_ )来定义内部私有属性和方法，此属性或方法不作为暴露给外部接口。这是一种工程师实践中约定成熟的惯例。

### 高阶组件和参数

有时，在高阶组件中使用参数是很有用的。这个在以上所有例子中都不是很明显，但是对于中等的 JavaScript 开发者是比较自然的事情。让我们迅速的介绍一下。

例子：一个简单的 Props Proxy 高阶组件搭配参数。重点是这个 HOCFactoryFactory 方法。

```js
function HOCFactoryFactory(...params) {
    // do something with params
    return function HOCFactory(WrappedComponent) {
        return class HOC extends React.Component {
            render() {
                return <WrappedComponent {...this.props} />
            }
        }
    }
}
```

你可以这样使用它：

```js
HOCFactoryFactory(params)(WrappedComponent)
//or
@HOCFatoryFactory(params)
class WrappedComponent extends React.Component {}
```

### 高阶组件和父组件的不同之处

父组件就是单纯的 React 组件包含了一些子组件（children）。React 提供了获取和操作一个组件的 children 的 APIs。

```js
class Parent extends React.Component {
    render() {
        return <div>{this.props.children}</div>
    }
}

render(<Parent>{children}</Parent>, mountNode)
```

在来总结一下父组件能做和不能做的事情（与高阶组件对比）：

-   渲染劫持
-   操作内部 props
-   抽象 state。但是有缺点，不能再父组件外获取到它的 state，除非明确地实现了钩子。
-   与新的 React Element 包装。这似乎是唯一一点，使用父组件要比高阶组件强，但高阶组件也同样可以实现。
-   Children 的操控。如果 children 不是单一 root，则需要多添加一层来包括所有 children，可能会使你的 markup 变得有点笨重。使用高阶组件可以保证单一 root。
-   父组件可以在元素树立随意使用，它们不像高阶组件一样限制于一个组件。

通常来讲，能使用父组件达到的效果，尽量不要用高阶组件，因为高阶组件是一种更 hack 的方法，但同时也有更高的灵活性。
