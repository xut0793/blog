# react-07: 组件属性值类型的校验 propTypes
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-20 21:48:39
 * @LastEditTime: 2019-09-20 23:20:24
 * @Description:
 -->


上一节讲解了组件属性的默认值配置`defaultProps`，同样在开发过程中属性传递还涉及到一个值类型的问题。如果某个属性在组件内部是使用数组相关方法操作，如果此时传入非数组类型的值时就会导致程序报错。所以对组件属性值的类型进行约束也是非常有必要的。

### `React`中可以通过`propTypes`静态属性来实现校验。

在`React v5.5`以前版本是集成。但之后的版本已经拆分成一个单独的包`prop-types`,所以我们需要在 HTML 中引入`prop-types`的 CDN 链接(因为我们之前一直在 html 浏览器作演示,如果是工程化可以 npm 下载包)。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>React propTypes</title>
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
    <script src="https://unpkg.com/prop-types/prop-types.js"></script>
    <script>
        const root = document.getElementById('root')
        class Hello extends React.Component {
            render() {
                return React.createElement(
                    'h1',
                    null,
                    `Hello ${this.props.content}`
                )
            }
        }
        // 设置默认值
        Hello.defaultProps = {
            content: 'React'
        }
        // 属性值类型校验
        Hello.propTypes = {
            content: PropTypes.string
        }

        ReactDOM.render(React.createElement(Hello, { content: 'World' }), root) // 此时正常

        ReactDOM.render(React.createElement(Hello, { content: 123 }), root) // 能显示,但控制台会打印警告信息
    </script>
</html>
```

可以看到,同上节默认值写法完全一样.同样,也可以用还在提案阶段的`static`语法.

```js
const root = document.getElementById('root')
class Hello extends React.Component {
    // 设置默认值
    static defaultProps = {
        content: 'React'
    }
    // 属性值类型校验
    static propTypes = {
        content: PropTypes.string
    }
    render() {
        return React.createElement('h1', null, `Hello ${this.props.content}`)
    }
}

ReactDOM.render(React.createElement(Hello, { content: 'World' }), root) // 此时正常

ReactDOM.render(React.createElement(Hello, { content: 123 }), root) // 能显示,但控制台会打印警告信息
```

如果需要将某个属性设为必须值,可以添加`isRequired`,如:

```js
// 属性值类型校验
Hello.propTypes = {
    content: PropTypes.string.isRequired // 表明content属性必需且为string类型
}
```

### `PropTypes`对象包含的所有验证类型 API 有:

```js
MyComponent.propTypes = {
    /*************************
     * JS原始类型验证
     ***************************/
    // JS原始类型，这些全部默认是可选的
    optionalArray: PropTypes.array,
    optionalBool: PropTypes.bool,
    optionalFunc: PropTypes.func,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
    optionalString: PropTypes.string,
    optionalSymbol: PropTypes.symbol,

    // 可以直接渲染的任何东西，可以是数字、字符串、元素或数组
    optionalNode: PropTypes.node,

    // React元素
    optionalElement: PropTypes.element,

    // 指定是某个类的实例
    optionalMessage: PropTypes.instanceOf(Message),

    // 可以是多个值中的一个
    optionalEnum: PropTypes.oneOf(['News', 'Photos']),

    // 可以是多种类型中的一个
    optionalUnion: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Message)
    ]),

    /*************************
     * 多重嵌套类型检测
     ***************************/
    // 限制数组内的各项元素的类型,只能是某种类型值的数组
    optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

    //限制对象内属性值只能是特定类型属性值
    optionalObjectOf: PropTypes.objectOf(PropTypes.number),

    // 限制对象各个key的值类型,即value的类型.具有相同属性值的对象
    optionalObjectWithShape: PropTypes.shape({
        color: PropTypes.string,
        fontSize: PropTypes.number
    }),

    /********************************************
     * 必需性验证,在任意值类型限制后面添加.isRequired
     *********************************************/
    // 必选条件，可以配合其他验证器，以确保在没有提供属性的情况下发出警告
    requiredFunc: PropTypes.func.isRequired,

    // 必选条件，提供的属性可以为任意类型
    requiredAny: PropTypes.any.isRequired,

    /****************************************************************
     * 自定义验证规则,必须提供一个正则验证规则,如果不匹配,返回一个Error实例
     *****************************************************************/
    // 自定义‘oneOfType’验证器。如果提供的属性值不匹配的它应该抛出一个异常
    // 注意：不能使用‘console.warn’ 和 throw
    customProp: function(props, propName, componentName) {
        if (!/matchme/.test(props[propName])) {
            return new Error(
                'Invalid prop `' +
                    propName +
                    '` supplied to' +
                    ' `' +
                    componentName +
                    '`. Validation failed.'
            )
        }
    },

    // 自定义‘arrayOf’或者‘objectOf’验证器。
    // 它会调用每个数组或者对象的key，参数前两个是对象它本身和当前key
    // 注意：不能使用‘console.warn’ 和 throw
    customArrayProp: PropTypes.arrayOf(function(
        propValue,
        key,
        componentName,
        location,
        propFullName
    ) {
        if (!/matchme/.test(propValue[key])) {
            return new Error(
                'Invalid prop `' +
                    propFullName +
                    '` supplied to' +
                    ' `' +
                    componentName +
                    '`. Validation failed.'
            )
        }
    })
}
```

### 示例部分:

```js
// 限制对象各个key的值类型,即value的类型.具有相同属性值的对象
optionalObjectWithShape: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired
})
//示例
static propTypes = {
    object:PropTypes.shape({
        name:PropTypes.string,
        age:PropTypes.number
    })
}
```

```js
// 指定只有一个子元素可以作为内容传递给组件,且必需
optionalElement: PropTypes.element
// 示例
class MyComponent extends React.Component {
    render() {
        // 只能包含一个子元素，否则会给出警告
        const children = this.props.children
        return <div>{children}</div>
    }
}

MyComponent.propTypes = {
    children: React.PropTypes.element.isRequired
}
```

```js
// 自定义‘oneOfType’验证器。如果提供的属性值不匹配的它应该抛出一个异常
customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
    return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
    );
    }
}

// 示例: 验证一个邮箱
MyComponent.propTypes = {
    email: function(props, propName, componentName) {
        let regx = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if(!regx.test(props[propName])) {
            return new Error(`Email validation failed!`)
        }
    }
}
```

> 属性类型校验不会强制改变属性值的数据类型和输出,只会提供警告.也就是说,如果处于开发环境,属性类型不匹配,控制台会收到警告信息.但在生产环境下,React 内部会抑制警告的输出.

> React.js 提供两种版本的包,一个用于开发环境下,会输出觉见错误的额外警告,而生产版本(mini)包括性能优化并且剥离了所有错误信息.
