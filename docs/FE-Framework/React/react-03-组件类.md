# react-03: 组件类 `class Name extends React.Component`
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-19 07:55:42
 * @LastEditTime: 2019-09-20 00:02:32
 * @Description:
 -->


语法：

```js
React.createElement(elementName, attr, child)
```

上一节，我们使用 HTML 标签来创建`React`元素，如

```js
let element = React.createElement('h1', null, 'Hello React')
```

但我们也提到第一个参数除了可以是 HTML 标签，也可以是 React 自定义的组件类对象。这一节主要学习下 React 组件类如何表现。

我们使用 ES6 语法 `classic CHILD extends PARENT`，通过继承`React.Component`类来创建一个 React 组件类。

比如，创建一个`Hello React`组件类，用来封闭一个 h1 元素：

```js
class HelloReact extends React.Component {
    render() {
        return React.createElement('h1', null, 'Hello React')
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

**React 组件类中强制要求必须有 render()方法，并返回一个 React 元素**
render()方法只能返回单个元素，如果需要返回多个同级元素，可以使用 html 的非语义的中性元素来包裹，比如 div 或 span。

```js
let h1 = React.createElement('h1', null, 'Hello React')
class HelloReact extends React.Component {
    render() {
        return React.createElement('div', null, h1, h1, h1)
    }
}
let el = React.createElement(HelloReact, null)
ReactDOM.render(el, root)
```

依照约定，包含 React 组件的变量名称应该首字母大写，因为在 JSX 语法中这么做是必须的，所以在这里也遵循这个约定。

> 在 JSX 中，React 通过大小写来区分是普通 HTML 元素（如`<h1></h1>`)还是自定义组件类(如`<Hello World />`)，所以在 JSX 语法中`<h1 />`和`<H1 />`是不同的。关于更多 JSX 内容后面讲解。

组件的意义在于其可重用性，这样使得开发速度更快，产生错误更少。组件封装了元素的属性、状态、事件等，使得更具有独立性和定制性。

后面我们继续讲解如何通过属性实现组件的定制化。
