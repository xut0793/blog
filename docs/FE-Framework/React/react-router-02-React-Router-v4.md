# React Router v4 API
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-28 08:55:56
 * @LastEditTime: 2019-09-29 23:15:01
 * @Description:
 -->


React Router 4 引入了一种基于 component 的动态路由，区别之前版本的静态路由（或者说集中式路由）
[react+router4 入门](https://www.jianshu.com/p/5c3a77b6b250)
[React Router V3 与 V4 的区别](https://www.jianshu.com/p/bf6b45ce5bcc)

v2/v3 的版本采用的方式是将路由看成是一个整体的单元，与别的组件是分离的，一般会单独放到一个 router 文件中，对其进行集中式管理；并且，布局和页面的嵌套由路由的嵌套所决定。

v4 的版本则将路由进行了拆分，将其放到了各自的模块中，不再有单独的 router 模块而是对应不同平台终端的 router，充分体现了组件化的思想。

## 知识概要

核心概念 | 路由器`<Router>`  | 路由`<Route>`| 导航`<Link>`
--|--|--|--
封装组件 | `<BrowserRouter>`<br/>`<HashRouter>`<br/>`<NativeRouter>`<br/>`<memoryRouter>`<br/>`<staticRouter>` | `<Switch>` | `<NavLink>`<br/>`<Redirect>` 
主要特性 | `basename={string}`<br/>`forceRefresh={bool}`<br/>`getUserConfirmation={func}`<br/>`keyLength={number}` | <div style="font-size:12px;font-weight:bold;">三种组件渲染方式：</div>`component={Comp}`<br/>`render={func}`<br/>`children={func}`<br/><div style="font-size:12px;font-weight:bold;margin-top:10px;">路径匹配：</div>`path={string}`<br/>`exact={bool}`<br/>`strict={bool}`<br/>`sensitive={bool}`<div style="font-size:12px;font-weight:bold;margin-top:10px;">传入组件的三大 props：</div>`match` `location` `history` | <div style="font-size:12px;font-weight:bold;">Link / Redirect</div>`to={string|object}`<br/>`replace={bool}`<div style="font-size:12px;font-weight:bold;margin-top:10px;">NavLink：</div>`to={string|object}`<br/>`exact={bool}`<br/>`strict={bool}`<br/>`activeClassName={string}`<br/>`activeStyle={object}`<br/>`isActive={func}`
编程导航 | | | <div style="font-size:12px;font-weight:bold;">组件标签导航：</div>`Link` `NavLink` `Redirect`<div style="font-size:12px;font-weight:bold;">编程导航：</div>`this.props.history.push(path[,state])`<br/> `this.props.history.replace(path[,state])`<br/> `this.props.history.go(n)`<br> `this.props.history.goBack()`<br>`this.props.history.goForward()`
参数传递 | | <div style="font-size:12px;font-weight:bold;">组件内接收：</div>`path='/path/:name'` => `this.props.match.params.name`<br/>`path='/path'`=>`this.props.location.search`<br/>`path='/path'`=>`this.props.location.state` | <div style="font-size:12px;font-weight:bold;">导航路径传递参数：</div> `<Link to='path/xu' />`<br/>`<Link to='path?name=xu&uid=1' />`<br/>`<link to={object形式} />`<div style="font-size:12px;font-weight:bold;">编程导航传递：</div>    `this.props.history.push(object形式)`
组件`props` | | <div style="font-size:12px;font-weight:bold;margin-top:10px;">match</div>`path` `url` `params` `isExact`<div style="font-size:12px;font-weight:bold;margin-top:10px;">location</div>`pathname` `hash` `search` `state`<div style="font-size:12px;font-weight:bold;margin-top:10px;">history</div>`length` `push(path, [state])` `replace(path, [state])` `go(n)` `goBack()` `goForward()`

## 基础使用

同`React`一样分为核心包和不同终端渲染的包。`Router`核心包是`react-router`，然后在 web 端路由使用`react-router-dom`,不同的是`react-router-dom`集成了`react-router`了，所以在 web 端只使用路由只需要下载`react-router-dom`包即可

**安装 router**

```js
// npm
npm i -S react-router-dom

// yarn
yarn add react-router-dom
```

**引入 router 的路由组件**

```js
// web端
import { BrowserRouter, Route, Link } from 'react-router-dom'
```

**组件内使用路由组件**

```js
// 路由导航可以使用Link，也可以在组件内使用编程导航
// Route 可以作为组件在任何组件内部使用
import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

const Layout = () => (
    <div>
        <header>
            <ul>
                <li>
                    <Link to="/" />
                    Home
                </li>
                <li>
                    <Link to="/content" />
                    Content
                </li>
                <li>
                    <Link to="/about" />
                    About
                </li>
            </ul>
        </header>
        <main>
            <Route exact path="/" component={HomePage} />
            <Route path="/content" component={ContentPage} />
            <Route path="/about" component={AboutPage} />
        </main>
    </div>
)

const HomePage = () => <h1>Home</h1>
const ContentPage = () => <h1>Content</h1>
const AboutPage = () => <h1>About</h1>

const App = () => (
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
)

render(<App />, document.getElementById('root'))
```
