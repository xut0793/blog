# react-10: 组件的事件处理
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-21 21:33:02
 * @LastEditTime: 2019-09-22 18:59:04
 * @Description:
 -->


要点：

-   写法：小驼峰写法，区别原生的全部小写。
-   捕获事件写法，添加 Capture
-   this 绑定三种方式
-   React 事件都是注册到根元素（document)上处理
-   React 合成事件
-   事件对象 event 的区别
-   React 不支持 DOM 事件的处理

## React 事件语法

我们先看下原生 DOM 事件如何写的。

```html
<h1 onclick="alert('native click event in html tag')">native click event</h1>
```

或者在 js 中绑定事件

```js
const h1 = document.getElementById('js-event')
h1.addEventListener('click', function(e) {
    alert('native click envent in js')
})
```

再看下 React 中绑定事件

```js
const root = document.getElementById('root')
// 组件类
class HelloReact extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                id: 'uid',
                className: 'bgcolor',
                style: { color: 'red' },
                // 事件绑定
                onClick: function(e) {
                    alert('Hello React')
                }
            },
            'React Event'
        )
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

可以看到，React 事件绑定，以**on+事件名**，采用**小驼峰命名规范**。如`onClick`、`onMouseOver`

形式上和原生在 HMTL 中绑定事件很像（特别是后面学习 JSX 写法），React 事件同其它属性一样，添加到`React.createElement`方法的第二个参数对象中。React 都遵循小驼峰写法。

## React 绑定捕获阶段事件,添加`Capture`

在原生 DOM2 级事件中规定事件流的三个阶段： **事件捕获阶段、处理目标阶段、事件冒泡阶段。**

```js
addEventListener(eventName, handler, captureOrBubble)
```

DOM3 级事件新增事件监听器`addEventListener(eventName, handler, captureOrBubble)`的第三个参数接受一个布尔值。`true`代表事件捕获阶段触发，`false`代表冒泡阶段触发，默认方式。

```js
const h1 = document.getElementById('js-event')
h1.addEventListener(
    'click',
    function(e) {
        alert('native click envent in js')
    },
    // 捕获阶段触发
    true
)
```

那在 React 中如何定义事件触发阶段呢？

默认冒泡事件，如果某个事件需要在捕获阶段触发，则添加`Capture`,即**on+事件名+Capture**

改下前面的例子，让 react 事件在捕获和冒泡阶段都触发

```js
const root = document.getElementById('root')
// 组件类
class HelloReact extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                id: 'uid',
                className: 'bgcolor',
                style: { color: 'red' },
                // 捕获事件绑定
                onClickCapture: function(e) {
                    alert('Hello React Capture')
                }
                // 默认冒泡事件绑定
                onClick: function(e) {
                    alert('Hello React default bubble')
                }
            },
            'React Event'
        )
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

## React 事件处理程序中 this 的指向

我们分别从原生事件绑定两种方式和 React 事件绑定中打印 this。观察输出结果

```html
<h1 onclick="console.log(this)">native click event in html</h1>
```

```js
// html
;<h1 id="js-event">native click event in js</h1>
//js
const h1 = document.getElementById('js-event')
h1.addEventListener('click', function(e) {
    console.log(this)
})
```

```js
class HelloReact extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: function(e) {
                    console.log(this)
                    alert('Hello React bubble')
                }
            },
            'React Event'
        )
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

可以看到原生的事件绑定中，this 都指向 DOM 元素自身。而 react 中 this 输出 undefined。

这是因为 ES6 中代码自动启用严格模式，相当于声明了`use strict`。而 js 在严格模式中全局 this 指向 undefined。

要实现 react 组件中事件处理程序的 this 引用指向组件类实例，就需要手动为事件处理程序绑定 this 值。

可以有三种方式：

```js
1. 在类的构造函数constructor()中，绑定`this.handler = this.handler.bind(this)`
1. 在事件程序中直接绑定`onClick: (handler).bind(this)`
1. 使用ES6箭头函数语法自动绑定当前类实例this：`onClick: ()=>{onsole.log(this)}`
```

```js
class HelloReact extends React.Component {
    constructor(props) {
        super(props)
        // 第一种
        // this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e) {
        console.log(this)
    }
    render() {
        return React.createElement(
            'h1',
            {
                onClick: this.handleClick
            },
            'React Event'
        )
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

第二种

```js
 render() {
    return React.createElement(
        'h1',
        {
            id: 'uid',
            className: 'bgcolor',
            style: { color: 'red' },
            // 第二种，自已绑定
            onClick: (function() {
                console.log(this)
            }).bind(this)
        },
        'React Event'
    )
}
```

第三种：箭头函数

```js
 render() {
    return React.createElement(
        'h1',
        {
            id: 'uid',
            className: 'bgcolor',
            style: { color: 'red' },
            onClick: () => {
                console.log(this)
            }
        },
        'React Event'
    )
}

```

## 组件事件传递

父子组件间事件传递就跟属性传递一样，自定义一个事件名称，在子组件内通过`this.props.handler`接收即可。

```js
class Hello extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: this.props.handler
            },
            `Hello ${this.props.content}`
        )
    }
}

const el = React.createElement(Hello, {
    content: 'React',
    handler: () => {
        alert('Hello React props')
    }
})

ReactDOM.render(el, root)
```
