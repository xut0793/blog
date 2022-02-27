# React Router v4 使用
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-29 23:14:53
 * @LastEditTime: 2019-09-30 15:11:03
 * @Description:
 -->


> React Router 4.0 （以下简称 RR4）遵循着 React 的设计理念，即一切皆组件。所以 RR4 只是一堆 提供了导航功能的组件（组件传递给 props 若干对象和方法），具有声明式（声明式编程简单来讲就是你只需要关心做什么，而无需关心如何去做)。

RR4 本次采用单代码仓库模型架构（monorepo），这意味者这个仓库里面有若干相互独立的包，分别是：

-   react-router： React Router 核心
-   react-router-dom： 用于 DOM 绑定的 React Router
-   react-router-native： 用于 React Native 的 React Router
-   react-router-redux： React Router 和 Redux 的集成
-   react-router-config： 静态路由配置

本文主要讨论在 web app 中如何使用使用 RR4，不会罗列出所有组件的属性，只关注常用的 API，作个记录，以便忘记查看。

## 引用

**react-router 还是 react-router-dom？**

在 React 的使用中，我们一般要引入两个包，react 和 react-dom，那么 react-router 和 react-router-dom 是不是两个都要引用呢？

实际中，**我们只要引用`react-router-dom`就行了**，不同之处就是后者比前者多出了 `<NavLink>` `<BrowserRouter>` `<HashRouter>` 这样已经封装过的用于 DOM 类的高阶组件。
因此我们只需引用 react-router-dom 这个包就行了。

如果要搭配 redux ，你还需要使用 react-router-redux。

## 路由器 `Router`

Router 是所有路由组件共用的底层接口。

一般我们的应用并不会使用这个接口，而是根据项目需要采用封装过的列高级的路由。

-   `<BrowserRouter>`：使用 HTML5 提供的 history API 来保持 UI 和 URL 的同步；
-   `<HashRouter>`：使用 URL 的 hashchange 来保持 UI 和 URL 的同步；
-   `<NativeRouter>`：为使用 React Native 提供路由支持；
-   `<MemoryRouter>`：能在内存保存你 “URL” 的历史纪录(并没有对地址栏读写)；
-   `<StaticRouter>`：从不会改变地址；

### `<BrowserRouter>` `<HashRouter>`

在 web 开发中，经常用到的路由器组件就是`<BrowserRouter>`，使对应着之前 v2/v3 中`history={browserHistory}`属性。使用 HTML5 提供的`history`对象的 API `popstate`来实现页面路由。

> v4 版的`Router` `BrowserRouter` `HashRouter`组件下只允许存在一个子组件。区别于 v3/v2 路由组件的嵌套来代替页面的嵌套。

> 使用`<BrowserRouter>`路由模板，需要后端配合设置页面每次 url 请求返回 html 文件。

**basename: string**

**作用：** 为所有位置添加一个基准 URL，类似 HTML 中`<base href=baseURL>`

**使用场景：** 假如你需要把页面部署到服务器的二级目录，你可以使用 basename 设置到此目录。

**注意：** 正确格式应该有一个前导斜线，但结尾不能有斜线。

```js
// 引入
import { BrowserRouter } from 'react-router-dom'

// 使用
<BrowserRouter basename="/subdir" >
    <App/>
</BrowserRouter>

// 导航
// 渲染结果：<a href="/subdir/react">
<Link to="/react" />
```

```js
// 引入：
import { HashRouter } from 'react-router-dom'

// 使用
<HashRouter basename="/calendar">
    <App/>
</HashRouter>

// 导航
// 渲染结果： <a href="#/calendar/today">
<Link to="/today"/>
```

## 路由`Route`

`Route`是核心组件。它最基本的职责就是当页面的访问地址 url 与 Route 上的 path 匹配时，就渲染出对应的 UI 界面。
主要包括以下重要内容：

-   三种渲染 render 方式：`component` `render` `children`
-   三个加强 path 匹配的属性：`exact` `strict` `sensitive`
-   三个传递给视图组件的 props：`match` `location` `history`

#### 三种渲染 render 方式：`component` `render` `children`

每种方法都有特定的使用场景。在同一 `<Route>` 中，只能使用其中一种方法。

看看下面的例子，了解`component` `render` `children`的不同。大多数情况下，我们都会使用 component 方式 。

**`component`与`render`不同**
[render、children、component 傻傻分不清楚(react-router v5.0)](https://blog.csdn.net/weixin_44809405/article/details/91393342)
[React router 的 Route 中 component 和 render 属性的使用](https://cloud.tencent.com/developer/article/1372981)
[React 组件化中 render 与 component 的区别](https://zhuanlan.zhihu.com/p/55730576)

```js
class Bar extends Component {
    constructor(props) {
        super(props)
        console.log('===========Bar constructor=======')
    }
    componentDidMount() {
        console.log('======Bar componentDidMount=======')
    }
    render() {
        return <h2>in Bar {this.props.idx}</h2>
    }
}

class App extends Component {
    constructor(props) {
        console.log('========App constructor===========')
        super(props)
        this.state = {
            idx: 1
        }
    }

    componentDidMount() {
        console.log('======App componentDidMount=======')
    }

    handleBtnClick() {
        this.setState({
            idx: this.state.idx + 1
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.idx}</h1>
                <button
                    onClick={() => {
                        this.handleBtnClick()
                    }}
                >
                    add +1
                </button>
                <div>
                    <BrowserRouter>
                        <Route component={() => <Bar idx={this.state.idx} />} />
                        {/* <Route render={() => <Bar idx={this.state.idx} />} /> */}
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}
```

当使用 component 时，意味着明确这是一组件，router 将使用 React.createElement 根据给定的 component 创建一个新的 React 元素。

所以当使用`component={() => <Bar idx={this.state.idx}}`的内联形式绑定一个组件时，因为使用了 component 属性，当匿名函数当作子组件来渲染，执行 React.createElement 方法，createElement 方法在创建组件进行 diff 阶段，比较的 type 不是 Bar 这个类，而是一个匿名函数。由于父组件 app 的状态改变时执行 render 方法，每次都会生成不一样的匿名函数`() => <Bar idx={this.state.idx}`，所以每次都会完全重新生成一个组件，所以由这个匿名函数开始的内部所有子节点都会重新执行组件生命周期，不断出现旧组件的卸载和新组件的挂载。也就出现上例中点击按钮 Bar 组件中的 log 都有输出。

所以如果某个场景中，重量级的外层节点组件出现这个问题，就会影响到所有子节点的性能。此时就应该使用`render={() => <Bar idx={this.state.idx}`形式。父组件状态改变，执行 render 方法后，返回给 createElement 都是 Bar 组件，状态改变后组件 diff 后只进行局部更新渲染，也不会重复执行 mount、unmount 生命周期啦。上例中就不会有 log 输出。

所以`component`适用于无依赖于父组件传递 props 明确组件，而`render`适用于依赖父组件传入 props 的使用内联匿名函数形式绑定子组件。

另外，`render`内联的匿名函数也接受 route 组件传入的所有参数，可以进行嵌套组合

```js
//内联方式
<Route path="path" render={() => <div>这是内联组件写法</div>} />

//嵌套组合方式
<Route path="path" render={ props => (
    <ParentComp>
        <Comp {...props} />
    </ParentComp>
```

**总结：**
`component`属性相当于执行新创建组件的全生命周期
`render`属性相当于执行组件的更新渲染阶段 update，也就不会执行挂载和卸载了。

**children 与 render 区别**

在`component`和`render`属性中，只有当前路由和 path 匹配成功了，才会渲染对应的组件。

children 属性是这三个属性中比较特殊的一个，它的值为一个函数，当 Route 有 children 属性时，不管当前的路径是否与 path 匹配，该函数都会执行，即都会渲染匿名函数中的组件。

children 属性也会接受所有由 route 传入的所有参数，包括 match location history。但是其中 match 只有当路由和 path 匹配时才会传入对象值，否则为 null

```js
const UserList = props => {
    console.log('UserList', props)
    return (
        <div>
            <h2>User List</h2>
            <Link to="/user/xu">跳转用户xu</Link>
            <br />
            <hr />
            {/*使用children属性，当路由/user时,渲染UserList组件同时，User组件也渲染出来*/}
            <Route path="/user/:name" children={props => <User {...props} />} />
        </div>
    )
}

const User = props => {
    console.log('User', props)
    // 当路由/user时，User也会渲染，但此时props.match为null，只有路由/user/:name匹配时，match才会对象值。
    return <h3>Hello {props.match ? props.match.params.name : 'match:null'}</h3>
}

const App = () => {
    ;<BrowserRouter>
        <Link to="/user">测试children</Link>
        <br />
        <hr />
        <Route path="/user" component={UserList} />
    </BrowserRouter>
}
```

**`component` `render` `children`三者顺序**
当三者同时存在时，优先渲染 component 的值，其次是 render 属性的值，而 children 属性的值优先级最低。
为了避免 不必要的错误，尽量每个 Route 中只是用他们三个中的其中一个。

```
component > render > children
```

#### 三个 path 匹配的属性：`exact` `strict` `sensitive`

**path:string**
任何 path-to-regexp 可以解析的有效的 URL 路径

路由路径是匹配一个（或一部分）URL 的 一个字符串模式。大部分的路由路径都可以直接按照字面量理解，除了以下几个特殊的符号：

-   `:paramName` – 匹配一段位于 /、? 或 # 之后的 URL。 命中的部分将被作为 match 对象 params 属性的值传入 props
-   `()` – 在它内部的内容被认为是可选的
-   `*` – 匹配任意字符（非贪婪的）直到命中下一个字符或者整个 URL 的末尾

```js
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

**相对路径：**如果一个路由使用了相对路径，那么完整的路径将由它的所有祖先节点的路径和自身指定的相对路径拼接而成。 `path="../pathname"`
**绝对路径：**以`/`开始，使用绝对路径可以使路由匹配行为忽略嵌套关系。`path="/pathname"`
**优先级：**路由算法会根据定义的顺序自顶向下匹配路由。

```js
<Route path="/" component={HomePage} />
<Route path="/content" component={ContentPage} />
```

此时浏览器 URL：`http://localhost:8080/content`时，`/`和`/content`都匹配成功，所以`HomePage`和`ContentPage`组件都渲染出来。

如果此时不需要`HomePage`渲染，需要增加`exact`属性，指明当前 path 采用精确匹配方式。

**exact**
exact 默认为 false，如果为 true 时,需要和路由相同时才能匹配，但是如果有斜杠也是可以匹配上的

```js
<Route exact path="/" component={HomePage} />
<Route path="/content" component={ContentPage} />
<Route path="/content/" component={ContentPage} />
// 此时当URL=/content时，只会渲染ComtentPage组件，HomePage组件匹配不成功。
```

**strict**
strict 默认为 false，如果为 true 时，要求匹配路由后面的斜线`/`，并且忽略斜线`/`后面的内容。
即只要有`/`斜线前匹配，不管`/`斜线后面是否有内容都算匹配成功。

```js
<Route strict path="/one/" component={About} />
```

| path  | location.pathname | strict | matches? |
| ----- | ----------------- | ------ | -------- |
| /one/ | /one              | true   | no       |
| /one/ | /one/             | true   | yes      |
| /one/ | /one/two          | true   | yes      |
| /one/ | /one              | false  | yes      |
| /one/ | /one/             | false  | yes      |
| /one/ | /one/two          | false  | no       |

如果不要匹配斜杠真正的严格精确匹配，可以同时加上`exact` `strict`

```js
<Route exact strict path="/one" component={About} />
// 此时 /one/将匹配不上
```

**sensitive**
默认 false, 路径不区分大小写。
如果为 true ，则路径匹配区分大小写

```js
<Route strict path="/one/" component={About} />
```

| path | location.pathname | sensitive | matches? |
| ---- | ----------------- | --------- | -------- |
| /one | /one              | true      | yes      |
| /One | /one              | true      | no       |
| /One | /one              | false     | yes      |

#### 三个传递给视图组件的 props：`match` `location` `history`

如果一个 path 跟 URL 匹配，则渲染的组件接受的 props 将传入`match` `location` `history`属性

**match**

-   params - (object) key／value 与动态路径的 URL 对应解析。如：`path="/user/:name` =>`params={name:somename}`
-   isExact - (boolean) 判断组件 path 是否与当前视图 URL 匹配。
-   path - (string) 用于匹配的路径模式。对应 `<Route>` 中`path`值
-   url - (string) 用于匹配部分的 URL 。对应 `<Link>` 中`to`值

```js
<Route path="/user/:name" component={User}>
<Link to="/user/xu">用户详情</Link>
```

```js
// 传入props.match
match = {
    isExact: false,
    path: "/"
    url: "/",
    params:{
        name:xu
    }
}
```

**location**
保持着组件渲染时对应 URL 相关的信息。

```js
// 路由视图
<Route path="/users" component={Users}>
// 路由组件导航
<Link to={{
    pathname:'/users',
    search: '?pageSize=10&&pageNum=1',
    state: {auth:true}
    }}>用户详情</Link>

// 或者是编程导航
props.history.push({
    pathname:'/users',
    search: '?pageSize=10&&pageNum=1',
    state: {auth:true}
})
```

```js
// 传入props.location
location = {
    hash: ""
    key: "4j1z7l"
    pathname: "/users"
    search: "?pageSize=10&&pageNum=1"
    state: {
        auth:true
    }
}
```

**location.search**
包括 URL 的查询参数`search`，类似 get 请求，明文显示在 URL 地址栏，并且是字符串形式，实际项目中需要转为对象形式。

第一种：可以使用`'query-string`包

```js
// 安装
// 在node.js中原生提供该模块
npm i -D query-string
yarn add query-string --dev

// 引入
const queryString = require('query-string');

// 使用
const parsed = queryString.parse(props.location.search);
```

第二种：使用 web API `RLSearchParams`
`URLSearchParams` 接口定义了一些实用的方法来处理 URL 的查询字符串
[MDN: URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

```js
const search = props.location.search // could be '?foo=bar'
const params = new URLSearchParams(search)
const foo = params.get('foo') // bar
```

**location.state**
保存路由隐式传递参数 state，类似`post`请求，参数信息不在 url 中显示，只由`location.state`获取。

**history**

history 对象保存着当前视图在 history 历史记录栈中的信息。通常会具有以下属性和方法：

-   length - (number 类型) history 堆栈的条目数
-   action - (string 类型) 当前的路由 URL 在栈中操作(PUSH, REPLACE, POP)
-   location - (object 类型) 当前的位置。location 会具有以下属性：
    -   pathname - (string 类型) URL 路径
    -   search - (string 类型) URL 中的查询字符串
    -   hash - (string 类型) URL 的哈希片段
    -   state - (object 类型) 提供给例如使用 push(path, state) 操作将 location 放入堆栈时的特定 - - location 状态。只在浏览器和内存历史中可用。
-   push(path, [state]) - (function 类型) 在 history 堆栈添加一个新条目
-   replace(path, [state]) - (function 类型) 替换在 history 堆栈中的当前条目
-   go(n) - (function 类型) 将 history 堆栈中的指针调整 n
-   goBack() - (function 类型) 等同于 go(-1)
-   goForward() - (function 类型) 等同于 go(1)
-   block(prompt) - (function 类型) 阻止跳转。(详见 history 文档)。

history 对象是可变的，所以从 history.location 对象中获取当前视图路由相关信息并不准确。

一般获取当前路由`Route`传入的参数是从`props.location`获取，而不从`props.history.location`获取。

一般常用的是`props.history`中用于编程导航的方法`push` `replace` `go` `goBack` `goForward`

```js
// 编程导航
const history = props.history
history.push({
    pathname: '/user',
    state: {
        uid: 123
    }
})

history.replace({
    pathname: '/user',
    state: {
        uid: 123
    }
})

history.go(5) // 前进5个页面栈
history.go(-5) // 后退5个页面栈

history.goBack() // 相当于 history.go(-1)
his.tory.goForward() // 相当于 history.go(1)
```

## 声明式导航组件 `Link` `NavLink` `Redirect`

### `Link`

属性： `to` `replace`

**to: string|object**

```js
// 引入
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>

<Link to='/courses?sort=name'/> // 参数在props.location.search中获取?sort=name

<Link to={{
  pathname: '/courses',
  search: '?sort=name', // 参数在props.location.search中获取?sort=name
  hash: '#the-hash',
  state: { fromDashboard: true } // 参数在props.location.state获取
}}/>
```

**replace: bool**
如果为 true，则单击链接将替换历史堆栈中的当前入口，而不是添加新入口。重定向

```js
<Link to="/courses" replace />
```

其它，其它属性都将放在 `<a>` 上的属性，例如标题，ID，className 等。

```js
<Link id="uid" className="activeclass" to="/courses" />
// 渲染为
<a href="/coursers" id="uid" class="activeclass">
```

### `NavLink`

一个特殊版本的 Link，当它与当前 URL 匹配时，可以为当前匹配的路径添加激活的样式，样式可以使用`activeClassName` 或 `activeStyle`设置

```js
<NavLink
    to="/user"
    activeClassName="selected"
>user</NavLink>

<NavLink
    to="/user"
    activeStyle={{
        fontWeight: 'bold',
        color: 'red'
    }}
>user</NavLink>
```

另外也可以设置激活时应用样式的条件，通过`exact` `strict` `isActive`
**exact: bool**
如果为 true，则仅在位置完全匹配时才应用 active 的类/样式。
**strict: bool**
当情况为 true 才应用 active 的类/样式。要考虑位置是否匹配当前的 URL 时，pathname 尾部的斜线要考虑在内。
**isActive: func**
一个为了确定链接是否处于活动状态而添加额外逻辑的函数，如果你想做的不仅仅是验证链接的路径名与当前 URL 的 pathname 是否匹配，那么应该使用它设置额外逻辑确定是否匹配。

### `Redirect`

### 编程式导航 `history`

从`props.history`获取编程导航方法`push` `replace` `go` `goBack` `goForward`

```js
// 编程导航
const history = props.history
history.push({
    pathname: '/user'
})

history.replace({
    pathname: '/user'
})

history.go(5) // 前进5个页面栈
history.go(-5) // 后退5个页面栈

history.goBack() // 相当于 history.go(-1)
his.tory.goForward() // 相当于 history.go(1)
```

## 参数传递

三种：

-   动态路由的方式：

```js
<Route path="/user/:name" component={User}>
<Link to="/use/xu">

// User组件内获取
let name = props.match.params.name
```

-   URL 查询参数 search 方式

```js
<Route path="/courses" component={Courses}>

// 声明式导航
<Link to='/courses?sort=name'/> // 参数在props.location.search中获取?sort=name
<Link to={{
  pathname: '/courses',
  search: '?sort=name', // 参数在props.location.search中获取?sort=name
}}/>

// 编程式导航
history.push({
    pathname: '/user',
    search: {
        sort:name
    }
    // 或者
    // pathname: '/user?sort=name'
})

// Courses组件获取
let search = props.location.search

// 可使用query-string 或 URLSearchParams 解析。见上面location对象讲解
```

-   URL 携带参数 state 方式

```js
<Route path="/courses" component={Courses}>

<Link to={{
    pathname:'/users',
    state: {auth:true}
    }}>用户详情</Link>

// 或者是编程导航
props.history.push({
    pathname:'/users',
    state: {auth:true}
})

// Courses组件内获取
let state = props.location.state
```
