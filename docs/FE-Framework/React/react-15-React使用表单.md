# react-15: 使用表单
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-23 01:21:31
 * @LastEditTime: 2019-09-23 01:21:31
 * @Description: 
 -->

表单元素是 web 页面捕获用户输入（数据）和行为（单击）的重要交互元素。React 为了保持简单的逻辑：根据声明的样式绘制 UI，即用户输入同步表单元素的状态变化，使得视图与用户交互一致。所以部分表单元素在 React 中与标准 HTML 有一些不同。

实际所有表单元素中，只需要四个元素就可以实现 HTML 中所有的输入字段：`input` `textarea` `select`和`option`。React 通过给它们设置可变属性`value` `checked` `selected`来实现。这些特殊的属性也称为交互式属性，并且通过`onChange`事件捕获它们的输入。

> 记得在 React 前面学习中，定义属性是不可变，状态是可变。但是在表单元素是特殊的，因为用户需要与元素交互并且改变这些属性。对于其它所有元素则没有此特性。

> React 也支持其它构建表单的元素，例如`fieldset` `<keygen>` `datalist` `label`等，但这些元素不具有像可变属性 value 之类的特性，它们会被渲染为相应的原生 HTML 标签。

> React 中的 onChange 事件与 HTML 的 onchange 事件工作机制不同，前者的兼容性更好。在 HTML 中，DOM 的 change 事件只有在失去焦点时才触发，input 事件才会在内容每次变更时实时触发。在 React 中，每次内容的变更都会实时触发 onChange 事件，并不仅仅为失去焦点时触发。

> React 也有 onInput 事件，但那只是针对 DOM 中的 oninput 事件的封装，只有在需要访问 oninput 事件的原生行为时才使用 onInput。在 React 中的最佳实践是使用 onChange，它的行为和 oninput 一致。

-   value: 适用于`<input>` `<textarea>` `<select>`
-   checked: 布尔值，适用于`<input>`中的 type="checkbox"和 type="radio"
-   selected: 布尔值，适用于`<option></option>`与`<select>`一起使用。

```js
<input
type="text"
name="email"
value={this.state.email}
onChange={()=>this.handleEmailInputChange}
>
```

```js
<input
type="radio"
name="FrameworkradioGroup"
value="React"
checked={this.state.radioGroup['react']}
onChange={()=>this.handleRadioChange}
>
```

```js
<input
type="checkbox"
name="FrameworkCheckboxGroup"
value="React"
checked={this.state.chekboxGroup['react']}
onChange={()=>this.handleCheckboxChange}
>
```

```js
<textarea
name="desc"
value={this.state.desc}
onChange={()=>this.handleTextareaChange}
>
```

```js
<select
    value={this.state.selectedValue}
    onChange={() => this.handleSelectChange}
>
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="javascript">Javascript</option>
</select>
```

```js
<select
    multiple={true} // 实现多选
    // this.state.selectedValue为数组，比如实现预览html css,值的类型为
    value={['html', 'css']}
    onChange={() => this.handleSelectChange}
>
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="javascript">Javascript</option>
</select>
```

```js
// 捕获值的变更都从事件对象event.target.value
handler(e) {
    this.setState({
        someValue: e.target.value
    })
}
```

## 受控组件与非受控组件

针对表单元素而言，由 React 负责控制或设置它的值，该表单元素即为受控组件。React 最佳实践尽量使用受控组件。

-   受控组件： 由 React 控制和设置它的值的表单元素
-   非受控组件： 一般由 ref 属性获取原生 DOM 元素进行操作变更

```js
// 受控组件
<input
type="text"
value={this.state.email}
onChange={()=>this.handleEmailInputChange}
>

// 非受组件
<input
type="text"
>

<input
type="text"
onChange={()=>this.handleEmailInputChange}
>
```

一个非受控组件的引用示例

```js
class Content extends React.Component {
    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
    }

    submit(e) {
        let ipt = this.refs.emailInput
        console.log(ReactDOM.findDOMNode(ipt))
        console.log(ReactDOM.findDOMNode(ipt).value)
    }

    render() {
        return (
            <form>
                <label htmlFor="email">邮箱</label>
                <input ref="emailInput" type="text" name="email" placeholder="输入邮箱">
                <input type="button onClick={this.submit} value="提交">
            </form>
        )
    }
}
```
