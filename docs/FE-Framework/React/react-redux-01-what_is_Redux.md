# what is Redux

`Redux` 是 `JavaScript` 的状态容器， 提供可预测化的状态管理。

**什么是可预测化？**
可以理解为根据一个固定的输入，必然会得到一个固定的输出。是一个纯函数的性质。

**什么是状态？**
我们把应用程序的数据称为状态。这是有道理的，因为我们所说的数据会随着时间的推移发生变化，这其实就是应用的状态。

所以`Redux`就是一个组织应用程序数据的管理器，我们把应用程序的所有数据给它托管，然后只能用它对外提供给我们的一些固定的 API 方法来操作这些数据。

# why need Redux ?

> 现在前端应用开发的基本架构：MVC
>
> -   数据和视图的分离解耦（开放封闭原则）；视图层 View：使用框架`React` `Vue`等；数据模型 Model，即数据状态管理使用`Redux` `Vuex`
> -   以数据驱动视图，只关心数据变化，DOM 操作被封装，数据变化驱动视图更新:控制器 Control

**`React` 本身只是非常轻量级的视图层框架，用来构建用户视图。**

用 `React` 写项目时，我们通过一个个组件来构建一个应用，但是如果一个应用中组件很多，组件之间经常要共享一些数据，这些数据可能来自服务器端，用户输入的数据，用户交互数据，当前 UI 状态，本地的缓存数据等等。如何能够有条理的管理这些数据？

如果只用 `React` 本身提供的数据通信方式（父子通信、context 通信）来写，那将会很复杂，因为任何一个子组件都可以通过 context 修改全局数据，无法追踪数据变化。所以说 `React` 只是非常轻量级的视图层框架。如果做大型的应用，就需要在 `React` 的基础上配套一个面向数据层的数据管理框架和 `React` 结合使用，这样我们就会把应用程序的所有数据全部委托给这个数据管理器，每个组件获取或修改数据就只能通过数据管理器提供方式去操作，这样数据的变化就得可预测和可控了。

<!-- ![component initiating change](./component-initiating-change.png) -->

**`Redux` 就是一个数据层的框架**

我们把应用程序的数据（state）和每个数据对应的变更的方式（action)提供给`Redux` ，那么 `Redux` 就会提供一个仓库 store，把所有的数据都放在该仓库中 store 里，外部组件要从 store 里拿数据必须用`store.getState()`方法，然后组件修改 store 里的数据必须用`store.dispatch(action)`方法。
![Redux](./img/Redux.png)

**`Redux 和 React-Redux`** **`Redux= Reducer + Flux`**

要注意的是，`Redux` 和 `React-Redux` 并不是同一个东西。`Redux` 是一种架构模式（`Flux` 架构的一种变种），它不关注你到底用什么库，你可以把 `Redux` 应用到 `React` 和 `Vue`，甚至跟 `jQuery` 结合都没有问题。
而 `React-Redux` 就是把 `Redux` 这种架构模式和 `React.js` 结合起来的一个库，就是 `Redux` 架构在 `React.js` 中的体现。

`React-Redux`主要实现了将 store 挂载到 react 的全局上下文 context，以及为各个子组件 redux 的 API 和数据状态改变关联的组件视图的更新逻辑。

**`Redux`三大原则**

-   **单一数据源**
    使用 redux 的程序，所有的 state 都存储在一个单一的数据源 store 内部，类似一个巨大的对象树。

-   **state 是只读的**
    state 是只读的，能改变 state 的唯一方式是通过触发 action 来修改

-   **使用纯函数执行修改**
    为了描述 action 如何改变 state tree ，你需要编写 reducers。
    > 一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数

# `Redux`核心概念

![Redux](./img/redux.png)

-   **store**
    store 是存储数据的公共区域，应用程序的所有数据都放在了 store 中。一个 `Redux` 应用只有一个单一的 store。
    **创建 store**
    创建一个 store，需要传入 reduer，用来描述 store 内部如何通过 action 改变 state。

    ````js
    import { createStore } from 'redux'
    import counter from './reducers'

        const store = createStore(counter)
        ```
        store 提供了以下功能：
        - 维持应用的 `state`；
        - 提供 `getState()` 方法获取 state；
        - 提供 `dispatch(action)` 方法更新 state；
        - 通过 `subscribe(listener)` 注册监听器;
        - 通过 `subscribe(listener)` 返回的值函数注销监听器
    ````

-   **state**
    单词的意思是状态，但什么是状态，前面已经说了，可以理解为状态就是数据在某一时刻的快照。

    -   **getState**
        用于获取某一时间数据的方法。这是唯一能够获取 state 的方法。

-   **action**
    action 描述了一个更新 state 的动作。任何导致数据 state 变化的行为都是一个 action
    它是一个对象，其中 type 属性是必须有的，除了 type 字段外，action 对象的其它属性完全由你自己决定。

    ```js
    {type: 'UPDATE_TITLE_COLOR', titleColor: 'green'}
    ```

    -   **action types**
        在一般项目中，各类数据特别多，所有对应执行数据变更的动作 action 种类也特别多，这个时候可以使用一个单独文件来定义和组织项目中的所有 action type 类型，并使用常量来定义，这是最佳实践。

    ```js
    // actionTypes.js
    export const INCREASE = 'INCREASE' export const DECREASE = 'DECREASE'
    ```

    -   **actionCreator**
        如上图，调用 rducer dispatch 都是需要传入 action，特别是 dispatch 使用频率跟 action 数量相当，所以每次参数都书写一个 action 对象会显得特别麻烦，而 actionCreator 就是定义一个 action 对象的一个方法。它是一个函数，传入 action 的负载参数，返回一个 action 对象。

    ```js
    // actions.js
    import { INCREASE, DECREASE } from '../actionTypes'
    // 函数声明形式
    export function increase(count) {
    	return { type: INCREASE, count }
    }
    // ES6 箭头函数形式
    export const decrease = count => ({ type: DECREASE, count })
    ```

-   **reducer**
    reducers 描述了 action 如何改变 state
    reducer 是更新 state 的核心，它里面封装了更新 state 的逻辑，reducer 是一个纯函数，由外界提供（封装业务逻辑，在 createStore 时传入），并传入旧 state 对象和 action，返回新的 state
    `js reducer = (previousState, action) => newState`
    谨记 reducer 一定要保持纯净。只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用、没有 API 请求、没有变量修改，单纯执行计算。

    ```js
    // reducers.js
    import { INCREASE, DECREASE } from '../actionTypes'

    const initState = {
    	count: 0
    }

    export function countReducer(state = initState, action) {
    	switch (action.type) {
    		case INCREASE:
    			return {
    				...state,
    				count: state.count + action.count
    			}
    		default:
    			return state
    	}
    }
    ```

    -   **combineReducers**
        在应用中，把应用的整个 reducer 写在一文件中，会导致 switch 的分支 case 非常冗长，难以查看。这时需要将 reducer 拆分多个，每个 reducer 负责维护部分 state，最后通过`Redux`提供的 `combineReducers`函数来合成一个最终的`reducer`用于创建 store。类似 webpack 中 webpack-mergey 库的作用。

            ```js
            import { combineReducers } from 'redux'

            const counter = combineReducers({
            countReducer,
            logReducer
            })

            export default counter
            ```

-   **dispatch**

    它用于派发一个动作 action，这是唯一的一个能够修改 state 的方法。
    它内部的做的一件事情是将派发的动作 action 作为参数传入 store 初始时获取的 reducer，reducer 会根据传入的 action 执行对应的逻辑，基于旧的 state 来更新出一个新的 state。

    ````js
    // 使用 action 对象形式
    import { INCREASE, DECREASE } from '../actionTypes'
    store.dispatch({type:INCREASE,count:1})

        // 使用actionCreator形式
        import {increase, decrease} from './actions'
        store.dispatch(increase(1))
        ```

    ````

# how to use Redux ?

![Redux use](./img/Redux_use.png)

1. **定义动作类型 action types**

```js
// actionTypes.js
export const INCREAMENT = 'INCREAMENT'
```

2. **通过 actionCreator 创建 action:**

```js
// actions.js
import { INCREAMENT } from './actionTypes'
export const increase = count => ({ type: INCREASE, count })
```

3. **定义 reducer**

```js
// reducers.js
import { INCREAMENT } from './actionTypes'
const initState = {
    count: 1
}
export default const reducer = (state=initState, action) => {
    switch(action.type) {
        case INCREAMENT:
            return {
                ...state,
                count: state.count + action.count
            }
    }
}
```

4. **创建 store**

```js
import reducer from './reducers'
import { createStore } from 'redux'

const store = createStore(reducer)
```

5. **订阅状态 state 变化**

```js
function loggerCount() {
	console.log(state.count)
}
let unsubscribleLoggerCount = store.subcribe(loggerCount)
```

6. **dispatch 派发一个增加计数的动作**

```js
import { increase } from './actions'
store.dispatch(increase(10))
```

# 参考资料

[从零开始手写 redux](https://mp.weixin.qq.com/s/SEtYfMofnGNoxYpXWx1wDg)
[完全理解 redux（从零实现一个 redux）](https://mp.weixin.qq.com/s/jfDrhX6jMr36dRaFCH9Xbw)
[redux 简明教程](https://github.com/react-guide/redux-tutorial-cn)
[React.js 小书](http://huziketang.mangojuice.top/books/react/lesson30)
[一个小项目让你学会使用 redux](https://www.jianshu.com/p/786e7174b0c2)
[Redux 使用流程与个人心得（一）](https://www.jianshu.com/p/f6c5434c6e2d)
[React-Redux](https://www.jianshu.com/p/ad7eddb23d66)
