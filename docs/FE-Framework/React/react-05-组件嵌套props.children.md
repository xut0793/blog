# react-05: 组件嵌套`props.children`
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-20 08:33:13
 * @LastEditTime: 2019-09-20 20:43:39
 * @Description:
 -->


在上一节，我们提到`this.props.children`来获取第三个参数的值显示 h1 元素的内容。

比如下面创建一个列表，通过`this.props.children`获取嵌套的`li`元素。

```js
class Ul extends React.Component {
    render() {
        return React.createElement('ul', null, this.props.children)
    }
}
const li_Angular = React.createElement('li', null, 'Angular')
const li_React = React.createElement('li', null, 'React')
const li_Vue = React.createElement('li', null, 'Vue')

let child = document.getElementById('child')

ReactDOM.render(
    React.createElement(Ul, null, li_Angular, li_React, li_Vue),
    child
)
```

关于`this.props.children`有趣的是，如果有多个子元素时，它是一个数组，可以通过数组的形式访问其中元素。

```js
this.props.children[0]
this.props.children[1]
```

-   但是如果没有子元素，`this.props.children`是`undefined`;
-   如果只有一个子元素时，它就不是一个数组形式了。
    -   如果传递的是引号定义的字符串内容，它就是一个字符串值
    -   如果是一个 react 元素，它就是一个对象。

注意区别以下三种打印结果

```js
class Ul extends React.Component {
    render() {
        console.log(this.props.children)
        return React.createElement('ul', null, this.props.children)
    }
}

const string_text = 'Hello React string'

const single_li = React.createElement('li', null, 'Hello React single li')

const li_Angular = React.createElement('li', null, 'Angular')
const li_React = React.createElement('li', null, 'React')
const li_Vue = React.createElement('li', null, 'Vue')

let child = document.getElementById('child')

ReactDOM.render(
    // 不传递值，this.props.children是undefined
    React.createElement(Ul, null),
    // this.props.children是一个字符串'Hello React string'
    React.createElement(Ul, null, string_text),
    // this.props.children是一个react元素 sinle_li
    React.createElement(Ul, null, single_li),
    // this.props.children是一个数组
    React.createElement(Ul, null, li_Angular, li_React, li_Vue),
    child
)
```

此时如果对 children 长度使用`this.props.children.length`去判断就会产生 bug。因为 length 是字符串的有效属性，会返回字符串长度，如果是对象或 undefined 就会报错。

所以 react 提供了`React.Children.count(this.props.children)`来获取子组件的准确计数。

React.Children 提供了用于处理 this.props.children 不透明数据结构的实用方法。[React.Children 相关 API](https://zh-hans.reactjs.org/docs/react-api.html#reactchildren)

```js
React.Children.count(children)
React.Children.only(children)
React.Children.map(children, function[(thisArg)])
React.Children.forEach(children, function[(thisArg)])
React.Children.toArray(children)
```

总结：

-   使用`this.props.children`获取嵌套的子元素
-   `this.props.children`的值类型是不确定的，可能是 undefined、字符串、react 元素对象、数组
-   `this.props.children`因为值类型不确定，所以使用`this.props.children.length`获取个数会产生 bug，应该使用`React.Children.count(this.props.children)`获取准确个数
-   扩展了`React.Children`几个 API：
    `React.Children.map`,`React.Children.forEach`,`React.Children.toArray`，`React.Children.only`
