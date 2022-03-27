# 9 表单元素的双向绑定指令`v-model`

目录

- `v-model`的基础用法
- `v-model`双向绑定实现的原理
- `v-model`绑定值的输出类型（字符串、数组、布尔值、自定义）
- `v-model`修饰符：`.lazy  .number   .trim`

VUE为表单元素交互提供了一个能实现双向数据绑定的指令：`v-model`

## `v-model`基础用法
```html
<input type="text" v-model="value" />
```

## `v-model`双向绑定实现的原理

[DEMO：`v-model`双向绑定实现的原理](https://jsrun.net/xxXKp/edit)

我们先理解下双向绑定中“双向”指的什么？

可以理解为信息在逻辑层和视图层两个方向的互相传递。
```
ui <=> js
```
我们前面总结过的指令，都是将逻辑层数据的变化传到视图层更新显示，这是单向数据绑定。比如对于表单的输入框，我们需要向它提供初始值，或通过按钮控制改变它的值。
```html
<div id="example_1">
    <input type="number" v-bind:value="value"/>
    <button @click="changeValue">按钮加10</button>
    <p>{{ value }}</p>
</div>
```
```js
new Vue({
    el: "#example_1",
    data: {
        value: 0
    },
    methods: {
        changeValue() {
            this.value += 10
        }
    }
})

```
上面这个例子，逻辑层中的值`value`改变了，都会通过`v-bind`指令同步到输入框中显示出来。这是逻辑层向视图层的单向传递。但是如果我们直接在输入框中改变值，`value`的值并不会显示改变。也就是说在视图层输入框中值的改变没有通知到逻辑层对应的`value`改变。

如果要实现这点，我们就需要利用到表单元素自身的事件，如`input`输入框元素的`input`事件。能监控到输入框内容的改变，从而处理相应的逻辑。对于这个例子，我们需要在`input`事件处理函数中将当前输入值赋给`value`。利用之前学过的VUE中事件绑定指令`v-on`实现：
```html
<div id="example_2">
    <input type="number" v-bind:value="value" v-on:input="updateValue" />
    <p>{{ value }}</p>
</div>
```
```js
new Vue({
    el: "#example_2",
    data: {
        value: 0
    },
    methods: {
        updateValue(e) {
            this.value = e.target.value
        }
    }
})
```

这样就实现了视图层和逻辑层的双向绑定。但是像上面这种写法，一个`input`元素要绑定`v-bind`指令，同时还要绑定`v-on`指令，不够优雅。

所以VUE直接用一个指令`v-model`来绑定，替代上面的写法实现同一种功能，这就是`v-model`的双向绑定。
```html
<input type="number" v-bind:value="value" v-on:input="updateValue" />
<input type="number" v-model="value" />
```

上面例子，点击按钮会让逻辑层data中的value值加10，这个改变会同步到视图层，显示在input输入框中。同时，直接在视图层input输入框中输入内容也会使逻辑层中value值改变。这就是`v-model`的双向绑定。

具体双向绑定实现的原理，其时很简单，`v-model`指令不过是个语法糖而已，`v-model` 绑定表单元素，会使用该表单元素对应的属性和事件，来实现双向绑定。

但是，VUE内部会智能的根据不同的表单元素，来选用该元素对应的属性和事件来实现`v-model`双向绑定，并且绑定的值输出类型也会不同。

- text 和 textarea 元素使用 value 属性和 input 事件，值为字符串文本；
- checkbox 和 radio 使用 checked 属性和 change 事件，checkbox为单个时绑定值为布尔值，多选为数组，radio绑定依value值类型；
- select 字段将 value 作为 prop ，并将 change 作为事件。多选时为数组

## `v-model`绑定值的输出类型（字符串、数组、布尔值、自定义）

[DEMO：`v-model`绑定值的输出类型（字符串、数组、布尔值、自定义）](https://jsrun.net/8GXKp/edit)

```html
<div id="example_4">
    <!-- 当选中时，`picked` 为 `value`的值 -->
    <input type="radio" v-model="picked" value="a">
    <input type="radio" v-model="picked" value="b">
    <span>{{ picked }}</span><br/>

    <!-- `toggle`类型为非Array时，会忽略value值，直接赋值为 true 或 false 。但是当为数组时，会将value值添加进去-->
    <input type="checkbox" value="1" v-model="toggle">
    <span>{{ toggle }}</span><br/>
    
    <!-- `multiChecked`必须为Array类型时才能将值添加到数组，否则为全选true / false -->
    <input type="checkbox" value="a" v-model="multiChecked">
    <input type="checkbox" value="b" v-model="multiChecked">
    <input type="checkbox" value="c" v-model="multiChecked">
    <span>{{ multiChecked }}</span><br/>

    <!--  -->
    <select v-model="selected">
        <option disabled value="">请选择</option>
        <option>A</option><!-- 当不存在value特性时，会取内容A作为值 -->
        <option value="b">B</option>
        <option value="c">C</option>
    </select>
    <span>{{ selected }}</span><br/>
</div>
```
```js
new Vue({
    el: "#example_4",
    data: {
        picked: '',
        toggle: '',
        // toggle: [],
        multiChecked: [],
        // multiChecked: '',
        selected: '',
        toggle_self: '',
        selected_self: '',
    }
})
```
v-model 绑定的值通常是静态字符串 (对于复选框也可以是布尔值)，但是有时我们可能想把值绑定到一个自定义数据或动态数据上，这时可以用 v-bind 实现，并且v-bind绑定的这个属性的值可以不是字符串。
```html
    <!-- 自定义输出值，选中后toggle_self为 yes 或 no -->
    <input
      type="checkbox"
      v-model="toggle_self"
      true-value="yes"
      false-value="no"
    >
    <span>{{ toggle_self }}</span><br/>
    
    <!-- 自定义输出值，选中后elected_self为对象{number:123} -->
    <select v-model="selected_self">
        <!-- 内联对象字面量 -->
        <option v-bind:value="{ number: 123 }">123</option>
    </select>
    <span>{{ selected_self }}</span>
    <span>{{ selected_self.number }}</span><br/>
```

## `v-model`修饰符：`.lazy  .number   .trim`

[DEMO：`v-model`修饰符](https://jsrun.net/TGXKp/edit)

### `.number`

`v-model`绑定的值一般情况下都是字符串形式，即使`input[type="number"]`时。我们可以验证一下：
```html
<!-- 先触发输入框，再点击按钮，发现内容为字符串拼接形式，而不是相加结果 -->
<div id="example_3">
    <input type="number" v-model:value="value"/>
    <button @click="changeValue">按钮加10</button>
    <p>{{ value }}</p>
</div>
```
```js
new Vue({
    el: "#example_3",
    data: {
        value: 0
    },
    methods: {
        changeValue() {
            this.value += 10
        }
    }
})
```
```
210101010
```

如果要实现点击按钮是数值相加结果，我们可以在按钮事件处理函数中对`value`类型进行处理，如：
```js
this.value = Number(this.value) + 10
this.value = this.value * 1 + 10
```
但是Vue提供了更为简单的方法，使用`.number`修饰符
```html
<input type="number" v-model:value.number="value"/>
```

### `.lazy`
在默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步,表现为实时触发。你可以添加 `.lazy` 修饰符，从而转变为使用 `change` 事件进行同步，表现为输入框失去焦点后触发。

```html
<!-- 在“change”时而非“input”时更新 -->
<input type="number" v-model:value.lazy="value_lazy"/>
```
>oninput 事件在元素值发生变化是立即触发， onchange 在元素失去焦点时触发。

### `.trim`
对于`input`或`textarea`表单元素，如果要自动过滤用户输入的首尾空白字符，可以给 `v-model` 添加 `trim` 修饰符。
```html
<input type="text" v-model:value.trim="value_trim"/>
```