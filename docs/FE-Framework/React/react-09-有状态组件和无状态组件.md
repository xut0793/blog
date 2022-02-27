# react-09:  有状态组件和无状态组件
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-21 08:16:46
 * @LastEditTime: 2019-09-21 21:31:32
 * @Description:
 -->


## 无状态组件

字面上理解，无状态组件即是没有`state`的组件。
更准确的定义是：**无状态组件即没有状态，也没有任何 React 组件生命周期和方法，也无法使用 ref 引用**（后面章节讲解组件生命周期，如果实在需要引用 ref，可包装一层 react 组件）。

此时，无状态组件的视图建立可以只依赖于传入的属性`props`。可以想像为**一个输入为属性`props`，然后输出`UI`视图的简单函数**。

无状态组件的优点是可预测性，因为唯一的输入决定了输出。可预测性意味着更容易理解、维护和调试。事实上，没有状态是最理想的 React 实践。同时也是 React 官方推荐的最佳实践：**尽可能使用无状态组件替代普通组件**

前面我们一开始都在使用`Hello React`的无状态组件在讲解 React 组件的基本属性。

```js
class Hello extends React.Component {
    render() {
        return React.createElement('h1', null, `Hello ${this.props.content}`)
    }
}

let el = React.createElement(Hello, { content: 'React' })
ReactDOM.render(el, root)
```

对于无状态组件，React 提供了一种简单的函数式语法，使用此语法可以创建一个带有属性参数的函数并返回视图。

上面的 Hello 组件类可以改成下面这样写法：

```js
const Hello = function(props) {
    return React.createElement('h1', null, `Hello ${props.content}`) // props不需要再使用this.props
}

// 使用ES6箭头函数写法
const Hello = props => React.createElement('h1', null, `Hello ${props.content}`)
```

可以看到代码简洁了很多。

无状态组件中，不能拥有状态，但还是有两个属性：`defaultProps`和`propTypes`来设置无状态组件的属性默认值和类型。

```js
const Hello = props =>
    React.createElement('h1', null, t`Hello ${props.content}`)

Hello.defaultProps = {
    content: 'React'
}

Hello.propTypes = {
    contnet: PropTypes.string.isRequired
}
```

## 最佳实践：

**有状态组件处理逻辑，无状态组件展示视图**

下面创建一个时间的组件，由视图上由两部分：上部分是以表盘展示时分秒针的转动，下部分显示数字时间变化。

我们会把这个时钟组件分成三个组件：

-   一个时钟的父组件`Clock`，
-   表盘显示子组件
-   数字显示子组件。

其中父组件更新当前时间，并把时间传给子组件展示。所以父组件是有状态组件，子组件只接受时间进行输出是无状态组件。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>React propTypes</title>
        <style>
            .dialstyle {
                width: 200px;
                height: 200px;
                border: 1px solid black;
                border-radius: 50%;
                position: relative;
            }
            .secondstyle {
                width: 40%;
                height: 1px;
                background-color: red;
                position: absolute;
                top: 50%;
                left: 50%;
                /* transform: rotate(0deg); */
                transform-origin: 0% 0%;
            }

            .minutestyle {
                width: 30%;
                height: 3px;
                background-color: gray;
                position: absolute;
                top: 50%;
                left: 50%;
                /* transform: rotate(-45deg); */
                transform-origin: 0% 0%;
            }

            .hourstyle {
                width: 30%;
                height: 5px;
                background-color: goldenrod;
                position: absolute;
                top: 50%;
                left: 50%;
                /* transform: rotate(-90deg); */
                transform-origin: 0% 0%;
            }
        </style>
    </head>
    <body>
        <div id="root"></div>
    </body>
    <script
        crossorigin
        src="https://unpkg.com/react@16/umd/react.development.js"
    ></script>
    <script
        crossorigin
        src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    ></script>
    <script>
        const root = document.getElementById('root')

        // 外层状态组件，用于更新时间
        class Clock extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    currentTime: new Date()
                }
                this.updateTime()
            }

            updateTime() {
                setInterval(() => {
                    this.setState({
                        currentTime: new Date()
                    })
                }, 1000)
            }

            render() {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(AnalogDisplay, {
                        time: this.state.currentTime.getTime()
                    }),
                    React.createElement(DigitalDisplay, {
                        time: this.state.currentTime.toLocaleString()
                    })
                )
            }
        }

        // 数字显示无状态组件
        const DigitalDisplay = props =>
            React.createElement('div', null, props.time)

        // 表盘显示无状态组件是（圆框，时针，分针，秒针）
        const AnalogDisplay = props => {
            let date = new Date(props.time)
            let secondRotate = {
                transform: `rotate(${(date.getSeconds() / 60) * 360 - 90}deg)`
            }
            let minuteRotate = {
                transform: `rotate(${(date.getMinutes() / 60) * 360 - 90}deg)`
            }
            let hourRotate = {
                transform: `rotate(${(date.getHours() / 12) * 360 - 90}deg)`
            }

            return React.createElement(
                'div',
                {
                    className: 'dialstyle'
                },
                React.createElement('div', {
                    className: 'secondstyle',
                    style: secondRotate
                }),
                React.createElement('div', {
                    style: minuteRotate,
                    className: 'minutestyle'
                }),
                React.createElement('div', {
                    style: hourRotate,
                    className: 'hourstyle'
                })
            )
        }

        ReactDOM.render(React.createElement(Clock), root)
    </script>
</html>
```

### 划重点

-   区分有状态组件和无状态组件
-   无状态组件的函数语法
-   并保持无状态组件的简单性，没有状态，没有方法
