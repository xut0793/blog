# react-01: what is react

<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-18 20:46:42
 * @LastEditTime: 2019-09-19 23:15:52
 * @Description:
 -->

## what is React

参考`React`官网的解释：**React 是一个用于构建用户界面的 javascript 库**
最大特点的是**使用纯 javascript 来创建 web UI,并且采用基于组件的架构**

**划重点：**

-   **使用纯 js 来创建 UI 元素**
-   **采用组件来构建 web UI**

`React`挑战了我们一开始学习 web 前端就被灌输的关注点分离原则：HTML 负责结构，CSS 负责样式，JS 负责交互。`React`将 html css js 所有 ui 界面相关都写在 js 文件中。

`React`挑战的另一点是需要模板来构建用户界面。在早期，特别是`jQuery`时代，我们通常使用 js 模板库来实现复杂用户界面，但其越来越无法满足现代前端的需求，特别是要解决视图对数据频繁变更的及时响应问题。

`React`提供了一种简化前端开发的新方法，摈弃模板的概念，而是使用 js 创建可复用可组合的组件来构建用户界面。这样使得庞大的项目更容易重用，维护和扩展。

> 现代前端框架，不管 Angular/React/Vue 解决的一个根本性的核心问题：
> **web 页面视图与数据的实时更新问题**

## why use React

`React`提供创建 web 更简单的方式，并且将界面拆分成细粒度更高的组件形式，使得代码书写更少，效率更高。

当然使用`React`也有缺点，比如它不是一个完备的瑞士军刀型的框架，需要开发者配合社区开发的其它工具来集成一个完备开发架构。但这同时也是它的灵活之处，可能自由选择搭配使用。

## how to use React

从前面理解`React`，始终记住两个重点概念：

-   **使用纯 js 来创建 UI 元素**
-   **采用组件来构建 web UI**

下面我们先直观了解下如何实现上面两点，后面章节再详细讲解。

### Hello React

例如下面这个标准的 HTML 元素，基本涵盖了 HTML 元素的 id class style event

```html
<h1 id="uid" class="bgcolor" style="color:red;" onclick="alert('click')">
    Hello React
</h1>
```

**使用 React 创建跟上面一样效果的元素：**

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Heloo React</title>
        <style>
            .bgcolor {
                background-color: ;
            }
        </style>
    </head>
    <body>
        <h1
            id="uid"
            class="bgcolor"
            style="color:red;"
            onclick="alert('click')"
        >
            Hello HTML
        </h1>

        <div id="root"></div>

        <div id="root_class"></div>
    </body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script>
        /**
         * 使用纯js来创建UI元素
         */
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
        ReactDOM.render(element, root)
        // 2. 选择挂载点
        const root = document.getElementById('root')
        // 3. 渲染成DOM元素，并挂载
        ReactDOM.render(element, root)

        /**
         * 采用组件来构建web UI,将h1元素对应的属性、状态、事件封装成一个可复用HelloReact组件
         * 现代前端不管是模块化发展，还是组件化发展都是为了代码复用，实现高内聚低耦合的代码。
         */
        // 1. 采用ES6类语法创建组件，强制要求组件必须实现一个render()方法，render方法返回一个react元素
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
                    'Hello React from class'
                )
            }
        }
        // 2. 调用组件返回react元素，内部原理会实现render方法调用
        const el = React.createElement(HelloReact, null)
        // 3. 选择挂载点
        const root_class = document.getElementById('root_class')
        // 4. 渲染成DOM元素，并挂载
        ReactDOM.render(el, root_class)
    </script>
</html>
```

你可以仔细对比三种方法的异同，下一节详细讲解`React.createElement()`这个 API
