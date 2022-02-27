# react-06: 组件属性默认值 defaultProps
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-20 20:45:55
 * @LastEditTime: 2019-09-20 21:48:04
 * @Description:
 -->


在前一节我们知道可以为组件自定义属性使得组件类可配置。比如像下面这样配置`HelloReact`组件的颜色、事件、CSS 类名等。

```js
const root = document.getElementById('root')
class HelloReact extends React.Component {
    render() {
        return React.createElement('h1', this.props, this.props.children)
    }
}

let el = React.createElement(
    HelloReact,
    {
        id: 'uid',
        className: 'bgcolor',
        style: { color: 'red' },
        onClick: function(e) {
            alert('click')
        }
    },
    'Hello React'
)
ReactDOM.render(el, root)
```

在实际开发多人协作，或者某类组件频繁使用时，如果每次调用都要配置每一个属性时，不免会出现某个属性漏配置而出错的情况。此时我们可以用 React 提供的功能，为属性设置默认值：`defaultProps`静态属性。如果组件调用时未传入属性，则显示组件的默认值。

### `className.defaultProps`

```js
const root = document.getElementById('root')

class Hello extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                id: 'uid',
                className: 'bgcolor',
                style: { color: 'red' },
                onClick: function(e) {
                    alert('click')
                }
            },
            `Hello ${this.props.content}`
        )
    }
}

// 定义默认值
Hello.defaultProps = {
    content: 'React'
}

let el_default = React.createElement(Hello)
let el_null = React.createElement(Hello, null)
let el_id = React.createElement(Hello, { id: 'uid' })
let el_world = React.createElement(Hello, { content: 'World' })
let el_china = React.createElement(Hello, { content: 'China' })
ReactDOM.render(
    React.createElement(
        'div',
        null,
        el_default,
        el_null,
        el_id,
        el_world,
        el_china
    ),
    root
)
```

在浏览器上打开观看上面结果。如果`React.createElement()`第二个参数未传或`null`或对应属性未传，都将使用属性的默认值。

### `static defaultProps`

另外一种写法通过 static 的写法，不过还在提议阶段，babel 暂不能转换，但是以后很有可能成为正式规范，毕竟当前类相关内容都放置在类内部更便于代码组织。

> 在工程化时使用 npm 安装 babel 包可以配置使用提案阶段的 API

```js
const root = document.getElementById('root')

class Hello extends React.Component {
    // 定义默认属性
    static defaultProps = {
        content: 'React'
    }
    render() {
        return React.createElement(
            'h1',
            {
                id: 'uid',
                className: 'bgcolor',
                style: { color: 'red' },
                onClick: function(e) {
                    alert('click')
                }
            },
            `Hello ${this.props.content}`
        )
    }
}

ReactDOM.render(React.createElement(Hello), root)
```
