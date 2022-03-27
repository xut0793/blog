# 8 绑定元素事件的指令`v-on` 及事件修饰符
2019-4-2


目录
- 对比原生事件绑定、jQuery事件绑定
- Vue事件绑定
    - Vue绑定事件中获取事件对象`event`
    - 事件修饰符
        - 事件行为修饰符： `stop / prevent / capture / self / once / passvise`
        - 键盘事件修饰符： `按键码keycode / 按键别名`
        - 鼠标事件修饰符： `left / middle / right`
        - 系统修饰键修饰符： `ctrl / shift / alt / meta`，以及 `exact`

前面介绍的所有指令,包括插值`{{ }}`、`v-html`、`v-if`、`v-show`、`v-for`、`v-bind`都是绑定数据`data`的显示。但在实际中，还涉及到元素交互的绑定，即元素事件。

`javascript`和`HTML`之间的交互是通过`事件`实现的，`事件`就是用户或浏览器自身发生交互的时候执行的某种动作，包括事件名称和事件处理程序（或DOM2级中的事件监听器）。

回顾，在原生`javascript`中为事件指定处理程序有三种方式：

- HTML事件处理程序
- DOM 0级事件处理程序
- DOM 2级事件处理程序

> 关于原生事件更多内容，如事件流、事件处理程序、事件对象、事件类型、事件委托等，可以阅读《javascript高级程序设计》第13章 P345
## HTML事件处理程序
在`HTML事件处理程序`中，每个元素支持的事件，都可以使用`on`+`事件名`作为该元素的HTML特性来指定。
```html
<button id="btn1" onclick="alert('事件绑定1')">按钮点击1</button>
```
在HTML中定义事件处理程序可以直接包含要执行的js代码，也可以调用页面`script`元素中定义的脚本代码。
```html
<button id="btn1" onclick="showMessage()">按钮点击2</button>

<script>
    // HTML事件
    function showMessage(e) {
        alert("事件绑定2")
    }
    // 删除对应事件
    document.getElementById("btn1").setAttribute("onclick",null)
</script>
```

## DOM 0级事件处理程序
DOM 0级事件处理程序是通过`javascript`指定事件处理程序的最传统的方式。每个DOM元素对象（包括`window`和`document`）都有自己的事件处理程序属性，属性以`on`+`事件名`组成，且为小写形式，如元素的点击事件`click`，则元素的DOM对象对应的事件处理程序属性为`onclick`，将这种属性值设置为一个函数，就可以指定事件处理程序。
```html
<button id="btn3">按钮点击3</button>

<script>
    // DOM 0级事件
    var btn3 = document.getElementById("btn3")
    btn3.onclick = function () {
        alert("事件绑定3")
    }

    // 删除对应事件
    btn3.onclick = null
</script>
```
## DOM 2级事件处理程序
而在DOM 2级事件处理程序是以事件监听器的形式绑定到DOM元素，如`addEventListener("click", fn, canCapture)`。

在DOM 2级事件中定义了两个方法，分别用于为元素添加事件监听和删除事件监听的操作：

- `addEventListener(eventName, fn, canCapture)`
- `removeEventListener(eventName, fn, canCapture)`

>通过`addEventListener()`添加的事件处理程序只能使用`removeEventListener()`移除。并且移除时传入的参数必须与添加时传入的参数完全相同。也就意味着`addEventListener()`添加的处理函数是匿名函数时将无法移除。

```html
<button id="btn4">按钮点击4</button>

<script>
    // DOM 2级事件
    var btn4 = document.getElementById("btn4")
    btn4.addEventListener("click", function () {
        alert("事件绑定4")
    }, false)

    btn4.removeEventListener("click", function() { // 无效，移除匿名处理函数无效
        alert("事件绑定4")
    }, false)

    function fn() {
        alert("事件绑定")
    }
    btn4.addEventListener("click", fn, false)
    btn4.removeEventListener("click", fn, false) // 有效

</script>
```

## jQuery 绑定事件

在`jQuery`中通过`on`方法为元素对象绑定事件，并且为部分常用事件提供了简写形式。
```html
<button id="btn5">jQuery按钮点击5</button>
<button id="btn6">jQuery简写按钮点击6</button>

<script>
    // jQuery 绑定事件
    $("#btn5").on("click",function () {
        alert("jQuery事件绑定5")
    })

    $("#btn6").click(function () {
        alert("jQuery的click简写形式")
    })

    // 移除该元素上所有事件
    $("#btn5").off()
</script>
```

## Vue 绑定事件

在原生js还是jq中，常用的事件绑定写法都必须先获取到目标元素。而在`vue`中，使用指令`v-on`监听元素事件，在写法上类似`THML事件处理程序`。即同其它指令一样，将`v-on`指令写在具体绑定元素的开始标签中，将在触发时调用 JavaScript 代码。
```html
<div id="app">
    <button id="btn7" v-on:click="alert('VUE绑定的click事件7')">Vue绑定按钮点击7--内联形式</button>
    <button id="btn8" v-on:click="alertMessage">Vue绑定按钮点击8--调用方法形式</button>
</div>

<script>
    // Vue 绑定事件
    new Vue({
        el: "#app",
        data: {},
        methods: {
            alertMessage() {
                alert("VUE绑定的click事件8")
            }
        }
    })
</script>
```
许多事件处理逻辑会更为复杂，所以直接把 JavaScript 代码写在 v-on 指令中是不可行的。通常的作法是用 v-on 接收一个需要调用的方法名称，将具体的处理代码写在methods中（按钮8的写法）。

### `v-on`的简写 `@`
同`v-bind`可以简写成`:`一样，`v-on`也可以简写成`@`
```html
<button id="btn7" @click="alert('VUE绑定的click事件7')">v-on的简写形式@</button>
```

[DEMO：v-on on HTML / DOM / jQuery / Vue`](https://jsrun.net/BJXKp/edit)

### **获取原生事件对象`event`**

如果`v-on`的事件处理程序绑定的是无参方法时，那么事件对象会作为默认参数传入，这个事件对象是原生的DOM事件对象，同`onclick`或`addEventListener()`获取到的事件对象一模一样。

如果绑定的是有参方法时，也可以通过传入`$event`变量来获取事件对象。

```html
<div id="app">
    <div>计数：{{ counter }}</div>
    <button v-on:click="counter++">click to add 1</button>
    <button v-on:click="increase">click to add 1 by method</button>
    <button v-on:click="increaseByNum(10, $event)">click to add num by method</button>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        counter: 0
    },
    methods: {
        increase(e) {
            this.counter++;
            console.log(e.type)
        },
        increaseByNum(n,e) {
            this.counter += n;
            console.log(e.type)
        }
    }
})
```

### 事件修饰符
在事件处理程序中，我们经常需要阻止事件的某些行为，比如`<a href="#">`标签默认跳转行为，或者阻止点击冒泡行为等。在原生js中通过事件对象`event`中对应的属性实现。
```js
var link = document.getElementById("a");
link.onclick = function (event) {
    event.preventDefault() // 阻止默认行为
    event.stopPropagation() // 阻止事件冒泡
}
```
在Vue事件绑定中，提供了简便操作，通过使用对应的修饰符即可实现。修饰符是由点开头的指令后缀来表示的。

#### 事件行为修饰符
- .stop
- .prevent
- .capture
- .self
- .once
- .passive

```html
<!-- 阻止单击事件默认的冒泡行为 -->
<div class="out" @click="outMsg">
    <div class="inner" @click.stop="innerMsg">stop bubble</div>
</div>

<!-- 点击不会跳转至外部页面 -->
<a href="www.baidu.com" @click.prevent="alertMessage" style="background:orange">prevent</a>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式，即先触发外部元素事件，再触发内部元素事件 -->
 <div class="out" @click.capture="outMsg">
    <div class="inner" @click="innerMsg">can capture</div>
</div>

<!-- 点击事件将只会触发一次  Vue 2.1.4 新增-->
<button @click.once="alertMessage">once</button>

<!-- 只当在 event.target 是当前元素自身时触发处理函数，内部元素冒泡至外部元素不会再触发外部事件 -->
<div class="out" @click.self="outMsg">
    <div class="inner" @click="innerMsg">out self</div>
</div>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 `onScroll` 完成 Vue 2.3.0 新增 -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

#### 键盘事件修饰符

在键盘事件中，通常需要监听特定按键的事件行为，所以在Vue中可以直接通过键盘事件修饰符实现
```html
<!-- 只有当keyCode=13的按键（enter)按下时执行submit方法 -->
<input v-on:keyup.13="submit">
```
但实现上通过keyCode正逐渐被废弃，所以Vue从2.5.0版本开始，可以使用键盘事件对象中`event.key`属性的所有可能值作为按键码的别名使用。

```html
<input v-on:keyup.enter="submit">
<input v-on:keyup.shift-left="submit">
```

#### 系统修饰键修饰符
在键盘按键中，有几个特殊的用于组合键的按键` ctrl / shift / alt / meta`，叫做`修饰键`。
>其中`meta`在不同系统上代表不同，如在 Mac 系统键盘上，`meta` 对应 command 键 (`⌘`)。在 Windows 系统键盘 `meta` 对应 Windows 徽标键 (`⊞`)
```html
<!-- 按住Ctrl情况下点击Click才生效，即 ctrl+alt+click也会被触发 -->
<div @click.ctrl="doSomething">Do something</div>
```
如果只想按下ctrl键时就触发，可以使用`.exact`修饰符（vue 2.5.0版本新增）
```html
<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>
```

#### 鼠标事件修饰符
同键盘事件修饰符一样，鼠标事件有3个对应的鼠标事件修饰符
- `.left`
- `.middle`
- `.right`
```html
<!-- 只有鼠标右键按下时执行submit方法 -->
<button type="submit" @mousedown.right="submit">提交</button>
```

[DEMO：事件修饰符](https://jsrun.net/JxXKp/edit)

### vue组件事件

[组件事件event]()