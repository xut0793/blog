# react-13: JSX
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-22 22:16:24
 * @LastEditTime: 2019-09-22 23:23:49
 * @Description:
 -->


迄今为止，我们的示例代码都在使用`React.createElement`创建`React`元素。

比如我们创建下面这个 HTML 结构：

```html
<div>
    <ul>
        <li>
            <a href="www.baidu.com">链接</a>
        </li>
    </ul>
</div>
```

看看使用原来`React.createElement`方法如何完成上面的结构

```js
render() {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'ul',
            null,
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {
                        href: 'wwww.baidu.com'
                    },
                    '链接'
                )
            )
        )
    )
}
```

这还是没有任何属性、样式和事件绑定的结构，已经如此嵌套和麻烦了。写这样的代码绝对没有愉悦的心情。所以 React 团队重新创造了 JSX 语法来改善这种写法，这是 React 最伟大的设计之一。
我们先直观感觉下用 JSX 重写上面的结构：

```js
render() {
    return (
        <div>
            <ul>
                <li>
                    <a href="www.baidu.com">链接</a>
                </li>
            </ul>
        </div>
    )
}
```

看起来几乎和 HTML 代码一样。这就是 JSX 的伟大。JSX 是一种类 XML 语法的小语言，但它改变了 React 组件的编写方式。

JSX 需要由编译工具转移成标准的 ES 语法。所在正式体验之前我们需要在浏览器引入 babel 转译器来帮我们把 JSX 语句转成 ES 语法。

我们还是以最初的`Hello React`来做例子

第一步：引入 babel

```js
<script src="http://cdn.bootcss.com/babel-core/5.8.38/browser.js"></script>
```

第二步：script 标签定义类型`type="text/babel"`

```js
<script type="text/babel"></script>
```

第三步：书写 JSX

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Heloo React JSX</title>
        <style>
            .bgcolor {
                background-color: gold;
            }
        </style>
    </head>
    <body>
        <div id="root"></div>
    </body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="http://cdn.bootcss.com/babel-core/5.8.38/browser.js"></script>
    <!-- <script>
        // React.createElement
         const root = document.getElementById('root')
        //  class HelloReact extends React.Component {
        //      render() {
        //          return React.createElement(
        //              'h1',
        //              {
        //                  id: 'uid',
        //                  className: 'bgcolor',
        //                  style: { color: 'red' },
        //                  onClick: function(e) {
        //                      alert('click')
        //                  }
        //              },
        //              'Hello React'
        //          )
        //      }
        //  }
        //  let el = React.createElement(HelloReact, null)
        //  ReactDOM.render(el, root)
    </script> -->
    <script type="text/babel">
        const root = document.getElementById('root')

        // JSX
        class HelloReact extends React.Component {
            render() {
                return (
                    <h1
                        id="uid"
                        className="bgcolor"
                        style={{ color: 'red' }}
                        onClick={() => {
                            alert('click')
                        }}
                    >
                        Hello React
                    </h1>
                )
            }
        }
        ReactDOM.render(<HelloReact />, root)
    </script>
</html>
```

**JSX 是 React.createElement()方法的语法糖**，经转译器转译后最终还是使用 React.createElement()创建 React 元素。但 JSX 大大提供了我们编写 React 代码的效率和体验。

下一节我们详细了解 JSX 语法
