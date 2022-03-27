# 6 绑定元素特性的指令`v-bind`

回顾下，从HTML元素的结构看，在VUE框架中，内容由插值`{{ }}`和`v-html`绑定；`v-if`和`v-show`可以控制元素的可见性；`v-for`可以用于批量生成列表元素。

这一节介绍下绑定元素特性的指令`v-bind`的用法：
```html
v-bind:attribute = value
v-bind:attribute = expression
// v-bind 简写 ：
:attribute = value
:attribute = expression
```
[ 点击查看DEMO v-bind on attribute](https://jsrun.net/ydXKp/edit)

```html
<div id="app">
    <button v-bind:disabled = "disabledForBtn">click me</button>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        disabledForBtn: true
    }
})
```
这个例子当`disabledForBtn`为真值时，按钮被禁用，即`disabled`特性生效。其中`disabled`称为指令`v-bind`的参数，而`=`后面的值其它指令一样，可以是具体的布尔值类型值，也可以表达式试算的结果值。

```html
<div id="app">
    <input v-bind:disabled = "new Date().getHours() > 12" />
</div>
```

但通常不建议将复杂计算写在tempalte模板中，可以使用后面要讲到的计算属性来表达，使代码更为简洁。
```html
<div id="app">
    <input v-bind:disabled = "isCanUseInput" />
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        canUseBtn: true
    },
    computed: {
       isCanUseInput: () => new Date().getHours() > 12
    }
})
```

当在页面中有大写特性绑定，需要反复书写`v-bind`相当重复工作，所以Vue提供了简写方式：用冒号` : `代替`v-bind`。

```html
<button :disabled = "disabledForBtn">click me</button>
<input  :disabled = "new Date().getHours() > 12" />
<input  :disabled = "isCanUseInput" />
```
无论选择用`v-bind`还是简写冒号的形式，建议在页面中都尽量保持一致性。

HTML元素中有两个特殊的特性，`class`和`styel`，下一节具体讲解。