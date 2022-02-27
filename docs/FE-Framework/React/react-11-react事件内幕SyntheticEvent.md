# react-11: 事件的内幕
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-22 12:10:08
 * @LastEditTime: 2019-09-22 18:46:04
 * @Description:
 -->


在上一节示例中，我们为了验证原生 DOM 事件监听器第三个参数改为 true 捕获时触发，为了观察是否还冒泡向上传播，特意在根元素 document 上增加了监听器。如果是捕获时触发，那 document 监听不到。如果是冒泡触发，那同时也会触发 document 监听事件。

```js
// 原生事件捕获和冒泡测试
const h1 = document.getElementById('js-event')
// 根元素上注册监听子元素的冒泡事件
document.addEventListener('click', function(e) {
    alert('h1 click event bubble document')
})
h1.addEventListener(
    'click',
    function(e) {
        alert('native click envent in js')
    },
    // 声明冒泡阶段触发，此时doucument事件监听也会触发
    // false,
    // 声明捕获阶段触发，此时document事件监听不会触发。
    true
)
```

此时我们会观察到，原生事件冒泡向上传播，事件触发的顺序是：目标元素 => 根元素
但我们在运行 React 元素的事件时，一个有趣的现像是，事件触发顺序刚好发过来了。
先是根元素 => 目标元素

## React 事件的内幕

这里就涉及到 React 事件的内幕：
**把所有子元素的事件监听器都注册在根元素（document)上，触发后分发到对应子元素上。**这也是事件委托的实践。

```js
class HelloReact extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: function(e) {
                    alert('Hello React bubble')
                }
            },
            'React Event'
        )
    }
}
```

上面的例子，我们在 react 内 h1 元素通过 onClick 绑定的事件，实际上并没有把这个点击事件绑定到对应的 h1 元素上，而是统一放到了 document 上处理。

## React 事件流

1. 点击 h1 元素，首先触发这个元素的原生事件流，经过原生的捕获、目标、冒泡阶段，直到最后冒泡到 document 上，这是一段完整原生事件流

2. 在 document 根元素上，先触发 document 上的原生事件，再触发 React 为 document 注册的 dispatchDiscreteEvent，即分发 react 的合成事件，这个触发过程也是和冒泡类似，从里向外的。在 React 内部，也维护了一张映射表来跟踪高层级元素和目标元素之间的事件绑定，所以可以使得分发合成事件时可以模拟原生事件冒泡一样的顺序，从里向外。

针对以上过程：

-   如何使所有绑定的 react 元素的 onClick 无效？ 在子元素上绑定一个原生事件，然后阻止这个事件冒泡即可（event.stopPropagation)。

-   如何只执行子元素的 onClick 而不执行父元素的 onClick？在子元素的 onClick 中阻止事件冒泡即可，注意这里获取到的是合成事件，调用的是合成事件的方法，也就是说不管是原生事件还是合成事件， stopPropagation 的用法是一致的。

-   如何只执行 onClick，而不触发 document 的原生事件呢？在 onClick 中，调用： e.nativeEvent.stopImmediatePropagation 。这里的效果相当于在 document 的第一个原生事件（react 自动绑定上的 dispatch）中调用了 stopImmediatePropagation 阻止了 document 剩余的原生事件。

这里涉及到 DOM 原生事件对象两个原生 API 的区别：

-   event.stopImmediatePropagation(): 阻止同一 dom 上的后续事件的执行以及阻止冒泡
-   event.stopPropagation(): 仅能阻止冒泡。

## React 事件对象

为了解决跨浏览器兼容性问题，使得用户在不同的浏览器中拥有相同的体验，React 封装了浏览器原生事件。React 在底层使用自己的特殊类（SyntheticEvent)来定义合成事件。SyntheticEvent 类的实例会被传递给事件处理程序，这个实例即 React 的事件对象。

```js
class Hello extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: evt => {
                    // 事件处理程序默认参数evt即React事件对象
                    console.log(evt)
                }
            },
            'Hello React Event'
        )
    }
}
```

React 事件与大多数原生事件具有相同的属性和方法，SyntheticEvent 类的属性和方法有：

```js
currentTarget: DOMEventTarget, 捕获事件的元素，即事件绑定的元素
target: DOMEventTarget,触发事件的元素
nativeEvent: DOMEvent, 浏览器原生事件对象
type: 标签名字字符串

preventDefault(): 阻止元素的默认行为，如a标签的链接跳转，表单自动提交等。
isDefaultPrevented(): 布尔值，如果默认行为被阻止，返回true

stopPropagation(): 阻止事件冒泡传播
isPropagationStopped(): 布尔值，如果事件冒泡被阻止，返回true

persist(): 从事件池中删除合成事件，并允许用户代码中对事件对象的引用
isPersistent(): 布尔值，如果合成事件被移除事件池，返回true
```

这里有几个在原生事件中陌生的属性和方法：
**nativeEvent**
React 虽然对原生事件进行了封装，但仍提供了访问原生事件对象的属性，即`nativeEvent`.它对应触发该事件的原生 DOM 节点的引用，即原生事件对象中`target`属性，而不是捕获事件的 DOM 元素`currentTarget`

**persist()**
为了提供更好的性能，在 React 内部维护着一个事件池， 对 `SyntheticEvent` 对象可能会被重用，而且在事件回调函数被调用后，即一旦事件处理程序执行结束，合成事件将被取消，所有的属性都会无效。出于性能考虑，你不能通过异步访问事件（console 也是一个异步操作）。

例如上面代码例子, 实际在控制台输出 evt 属性都是 null：

```js
class Hello extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: evt => {
                    // 事件处理程序默认参数evt即React事件对象，在异步获取或浏览器控制台输出都是空值
                    console.log(evt)
                    // 但是其中属性可以正常输出
                    console.log(e.target)
                    console.log(e.currentTarget)
                    console.log(e.nativeEvent)
                    console.log(e.type)
                }
            },
            'Hello React Event'
        )
    }
}
```

这是因为 React 里面的事件并不是真实的 DOM 事件，而是自己在原生 DOM 事件上封装的合成事件。
合成事件是由事件池来管理的，合成事件对象可能会被重用，合成事件的所有属性也会随之被清空。所以当在异步处理程序（如 setTimeout 等等）中或者浏览器控制台中去访问合成事件的属性，有可能就是空的。

解决方案：event.persist()，其实就是将当前的合成事件从事件池中移除，使得代码中可以继续保有对该事件的引用，以及仍然能访问该事件的属性。

```js
class Hello extends React.Component {
    render() {
        return React.createElement(
            'h1',
            {
                onClick: evt => {
                    evt.persist()
                    console.log(evt.isPersistence())
                    // 此时可以正常输出react事件对象的值
                    console.log(evt)
                }
            },
            'Hello React Event'
        )
    }
}
```

## 总结：

在原生 JS 或 jQuery 写法，通常是将事件监听绑定在目标 DOM 节点上。但在复杂交互页面，因为操作频繁，为了便于管理事件，最佳实践是将目标 DOM 事件委托给其父节点上处理。即在父节点上绑定事件监听器。这也是事件冒泡和事件委托（事件代理）的实践。

> 事件委托和事件代理说的是同一个意思，只是对应阐述的目标对象不同。在父节点上绑定事件监听器，在子元素角度来说是事件委托给了父节点处理。在父节点角度说，是代理了所有子元素的事件处理。

所以 React 对事件处理的优化采用了此方案。但同时为了需要还原原生的事件流，又封装了一层逻辑，通过事件分发模拟了事件流的执行效果。

并且因为 W3C 标准事件规范在各大浏览器中实现不一，在编写原生程序时，需要编写很多兼容性代码。正因为跨浏览器兼容性问题，所以 React 封装了浏览器原生的事件，确保了 react 写的代码在各个浏览器页面上运行效果一致性。如同 jQuery 对 DOM 事件的封装使用目的一样。

**这就是`React SyntheticEvent`合成事件**。包括

-   `根元素document的事件代理dispatchDiscreteEvent`
-   `分发事件时模拟事件流`
-   `跨浏览器兼容的合成事件对象`。

React 支持绝大部分原生 DOM 事件，包括鼠标、滚轮、键盘、触摸、剪粘板、选择、表单、焦点、滚动、图片、动画、过渡等。

| 序号 |   事件组   | React 已支持的事件                                                                                                                                                                                                              |
| ---- | :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    |  鼠标事件  | 点击：onClick onDoubleClick <br/>鼠标移动：onMouseDown onMouseEenter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp <br/>拖放事件：onDrag onDragStart onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDrop |
| 2    |  滚轮事件  | onWheel                                                                                                                                                                                                                         |
| 3    |  键盘事件  | onKeyDown onKeyPress onKeyUp                                                                                                                                                                                                    |
| 4    |  选择事件  | onSelect                                                                                                                                                                                                                        |
| 5    | 剪贴板事件 | onCopy onCut onPaste                                                                                                                                                                                                            |
| 6    |  触摸事件  | onTouchStart onTouchMove onTouchEnd onTouchCancel                                                                                                                                                                               |
| 7    |  滚动事件  | onScroll                                                                                                                                                                                                                        |
| 8    |  表单事件  | onChange onInput onSubmit                                                                                                                                                                                                       |
| 9    |  焦点事件  | onFocus onBlur                                                                                                                                                                                                                  |
| 10   |  图片事件  | onLoad onError                                                                                                                                                                                                                  |
| 11   |  动画事件  | onAnimationStart onAnimationEnd onAnimationIteration                                                                                                                                                                            |
| 12   |  过渡事件  | onTransitionEnd                                                                                                                                                                                                                 |

但也有部分 DOM 事件暂时未得到支持,如`resize`。对不支持的 DOM 事件如何实现监听呢？

就是下一节要讲解的 React 生命周期。
