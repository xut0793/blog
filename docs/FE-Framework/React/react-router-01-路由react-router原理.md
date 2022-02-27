#  Router 前端路由
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-27 07:52:10
 * @LastEditTime: 2019-09-28 08:55:17
 * @Description:
 -->


## 前端路由和后端路由

**后端路由**
在最初浏览 web 页面时，或在多页面应用中，一个 URL 对应一个 HTML 页面，一个 Web 应用包含很多 HTML 页面，在多页应用中，页面路由控制由服务器端负责，这种路由方式称为后端路由。

多页应用中,每次页面切换都需要向服务器发送一次请求，页面使用到的静态资源也需要重新加载，存在一定的浪费。
而且，页面的整体刷新对用户体验也有影响，因为不同页面间往往存在共同的部分，例如导航栏、侧边栏等，页面整体刷新也会导致共用部分的刷新。

**后端路由**
在单页面应用中，URL 发生并不会向服务器发送新的请求，所以“页面跳转逻辑”由前端负责，这种路由方式称为前端路由。

## 路由原理

路由的基本认知就是在浏览器 URL 的改变需要同步变量视图上展示的内容。在浏览器原生的 web API 中提供了 URL 改变的两种监听事件。

-   **一种是`hashchange`事件**
    当 URL 的片段标识符更改时，将触发 hashchange 事件 (跟在＃符号后面的 URL 部分，包括＃符号)

*   **另一种是监听`popstate`事件**
    在 BOM 中的 history 对象维护了浏览器 URL 的历史记录栈，当活动历史记录条目更改时，将触发 popstate 事件。

    在 history 对象中，原有的方法`forward()` `back()` `go()`来操作浏览器的 history 记录栈，实现导航的前进、后退、和跳转。在 HTML5 对 BOM 中 history 对象又新增了两种方法：`history.pushState()` 和 `history.replaceState()`，开放了手动代码添加和替换 history 记录。

> 需要注意的是调用 history.pushState()或 history.replaceState()不会触发 popstate 事件,只是修改了栈中的记录。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退、前进按钮（或者在 Javascript 代码中调用 history.back()、forward()、go()）

使用`popstate`实现路由，需要服务器端配合，将当前 URL 的请求都定向返回 html 文件。所以这里`hashchange`实现一个模拟路由。

### 手动模拟 HashRouter 模式

主要是两件事：

-   建立一份 hash 值与视图组件的映射表，如#about -> About
-   全局监听 hashchange 事件做出响应。事件可以在 React 组件的`componentDidMount`注册，在`componentWillUnmount`卸载

```js
// 建立路由与页面组件映射表 myRoute.jsx
import React from 'react'
import { Index, About, Account } from './pages.jsx'
export default {
    '#about': <About />,
    '#accounts': <Account />,
    '*': <Index />
}
```

```js
// 创建页面组件 page.jsx，是表现组件 负责视图构建
import React from 'react'
const Index = props => (
    <div>
        <h1>index</h1>
        <p>
            <a href="#accounts">accounts</a>
        </p>
        <p>
            <a href="#about">about</a>
        </p>
    </div>
)

const Account = props => (
    <div>
        <h1>account</h1>
        <a href="#">back home</a>
    </div>
)
const About = props => (
    <div>
        <h1>about</h1>
        <a href="#">back home</a>
    </div>
)

export { Index, Account, About }
```

```js
// 新建路由器组件 MyRouter.jsx 是容器组件，定义实现逻辑
import React, { Component } from 'react'

class MyRouter extends Component {
    constructor(props) {
        super(props)
        ;(this.state = {
            hash: window.location.hash
        }),
            (this.updateHash = this.updateHash.bind(this))
    }

    updateHash() {
        console.log('hash update....')
        this.setState({
            hash: window.location.hash
        })
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.updateHash, false)
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.updateHash, false)
    }

    render() {
        let matchRoute = this.props.mapping[this.state.hash]
        if (matchRoute) {
            return matchRoute
        } else {
            return this.props.mapping['*']
        }
    }
}

export default MyRouter
```

```js
// 在APP.JSX中使用路由器导航
import React, { Component } from 'react'

import MyRouter from './MyRouter'
import myRoute from './MyRoute'

class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <MyRouter mapping={myRoute} />
    }
}

export default App
```

```js
// 在index.jsx 渲染并挂载
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('app'))
```
