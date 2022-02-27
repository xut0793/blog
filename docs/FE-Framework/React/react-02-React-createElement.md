# react-02: React.createElement
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-18 22:29:44
 * @LastEditTime: 2019-09-19 23:49:08
 * @Description:
 -->


上一节我们通过引入两个`React`文件，创建了一个简单的 h1 标题页面。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Heloo React</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script>
        // 1. 创建一个React元素
        const element = React.createElement(
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
        // 2. 选择挂载点
        const root = document.getElementById('root')
        // 3. 渲染成DOM元素，并挂载
        ReactDOM.render(element, root)
    </script>
</html>
```

其中引入的`react`和`react-dom`文件，分别提供了两个全局对象`window.React`和`window.ReactDOM`, 所以可以使用`React.createElement()`方法和`ReactDOM.render()`方法。现在详细解析下这两个 API 使用。

## `React.createElement()`

```js
React.createElement(elementName, data, child)

elementName: HTML标签字符串，如'div','h1'等。或者是React自定义的组件类对象，如<HelloReact />。
data: 需要在HTML标签中显示的特性、行内样式、样式类或事件等，使用对象形式：{id:'uid', name:'Tom'}，如果不需要在html标签上显示任何特性，则输入`null`。
child: 同样是`React.createElement()`创建的子元素，如果是字符串形式则显示为文本内容。

data之后的第三个参数开始，都将作为子元素显示，也就是说child可以是多个。`React.createElement(elementName, attr, child1, child2, child3, ...)`
```

`React.createElement()`创建返回的是 React 元素，并不是真实的 DOM 节点，而是 React 提供对 DOM 的抽象。需要使用`ReactDOM.render(reat_el, mount)`方法渲染成真实的 DOM 元素，并挂载到文档中形成真实的 DOM 节点。

### 参数 1：实现渲染的元素类型

第一个参数`elementName`有两种类型输入：

-   标准的 HMTL 标签名的字符串，名字小写。如'div', 'h1'等
-   React 的组件类对象，名字首字母大写。如'HelloReact'

`React`会查找标准的 HTML 元素列表，如果匹配到就将其作为一种 React 元素类型使用。例如'h1'会匹配到标题的类型名称，渲染时就会在 DOM 中生成`<h1></h1>`元素。
如果匹配不上且符合第二种组件类规范，使用调用实例的 render 方法得到返回的 react 元素。

### 参数 2：实现元素的特性、样式、事件等

在底层，`React`同样会将属性名称与标准的 HTML 属性列表匹配，如果匹配到，该属性会被渲染为 HTML 元素的标准属性。如果非标准属性则会被忽略。

> 因为在 js 中，class 已经是关键字（保留字）了，所以为了避免冲突，html 的 class 属性使用 className 这个别名。并且事件名在 react 中采用小驼峰形式。

```js
const element = React.createElement(
    'h1',
    // 对象形式提供元素的特性、样式、事件等
    {
        id: 'uid',
        className: 'bgcolor', // 注意与原生的class区别，react采用className来代表原生的class功能
        style: { color: 'red' },
        onClick: function(e) {
            // 注意事件名与原生的区别，react采用小驼峰形式，原生是纯小写
            alert('click')
        }
    },
    'Hello React'
)
```

### 参数 3：实现元素的嵌套

比如是： 一个 ul 元素下包含一个或多个 li 元素

```html
<ul>
    <li>Angular</li>
    <li>React</li>
    <li>Vue</li>
</ul>
```

`React`语法写成：

```js
const el_Angular = React.createElement('li', null, 'Angular')
const el_React = React.createElement('li', null, 'React')
const el_Vue = React.createElement('li', null, 'Vue')
const el_div = React.createElement('ul', null, el_Angular, el_React, el_Vue)

const root = document.getElementById('root')
ReactDOM.render(el_div, root)
```
