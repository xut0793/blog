# react-04: 属性传递 props
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-19 08:59:15
 * @LastEditTime: 2019-09-20 23:27:56
 * @Description:
 -->


上一节我们使用组件类封装的 h1 元素是固定内容，在重用时显示的内容都是一样的。

```js
class HelloReact extends React.Component {
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
            'Hello React'
        )
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

如何可以定制一个组件，使得组件重用时可以显示不同效果？这个功能可以通过组件的属性来实现。

## props

我们改造下之前的 HelloReact 组件，让它返回 h1 元素的 id class style 等内容都可配置

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

我们可以看到，之前写在 render 方法内部 h1 元素的内容都被抽离出来，写在组件类对象上，在组件内部通过`this.props`获取第二个参数赋给 h1 元素，特别的是第三个参数即 h1 的内容是通过`this.props.children`获取的。

这些都是固定 API，记住就好了。

props 属性与 HTML 属性非常相似，这也是 React 的设计目的之一，包括 HTML 属性、事件、js 语法都在遵循着开发者已有的习惯。

React 元素属性分为两类：

-   为元素渲染标准的 HTML 属性： 如 id title style href src 等
-   在 React 组件类中使用的自定义属性。

**在底层，React 会将属性名称与标准的 HTML 属性列表相匹配。**

-   如果有匹配，属性就会被渲染为 HTML 元素的标准属性（第一种情况）。
-   如果不匹配，就说明不是标准属性，它不会被渲染为 HTML 元素的属性（第二种情况）。

但不管是标准属性或自定义属性，只要在组件类中定义了都可以通过`this.props`对象中访问到，`this.props.PROPERTY_NAME`。

### 属性视为元素内不可变的值

属性在组件内部是不可变的.调用组件时外部传入的属性,在组件内部是不应该修改它的.所以属性应该在传入组件前应该定义好值.

而组件呈现视图的动态性应该由组件内部状态`state`维护.我们会在后面的章节讲到组件的状态.
