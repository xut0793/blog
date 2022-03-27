# 3 插值 和 v-html

本节开始，我们按如下顺序学习vue模板API-指令。点击各部分的`DEMO`可在线查看代码

- 输出字符串文本内容的插值：`{{}}`
- 输出HMTL元素作为内容的指令：`v-html`
- 绑定元素可见性的指令：`v-if/else`， `v-show`
- 创建列表元素的指令：`v-for` 及 `key`作用
- 绑定元素特性的指令：`v-bind` 及其参数
- 绑定元素事件的指令：`v-on` 及其参数和修饰符
- 实现表单元素值双向绑定的指令：`v-model`


## 内容 => 插值

`{{ }}`插值，即Mustache语法，严格来说不纳入vue指令系统中。但自己方便知识归纳的统一性，估且算作指令一部分。所以插值的`{{}}`双括号写法只适用于元素内容的部分，不能用作元素特性中。

Mustache插值包裹的值可以是具体的值，也可以是简单运算的表达式。依赖的值发生了改变，插值处的内容都会更新。

[DEMO 插值`{{}}`和v-html](https://jsrun.net/rEXKp/edit)

```hbs
<div id="app">
    <p>{{ str }}</p>
    <p>{{ number }}</p>
    <p>{{ arr[1] }}</p>
    <p>{{ obj.num }}</p>
    <p>{{ arr[1] + obj.num }}</p>
    <p>{{ result }}</p>
    <p>{{ sum(arr[1], obj.num) }}</p>
    <p>{{ Boolean(obj.num) }}</p>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        str: "abc",
        number: 888,
        arr: [1,2,3],
        obj: {
            num: 4
        },
    },
    computed: {
        result() {return this.arr[1] + this.obj.num}
    },
    methods: {
        sum(a, b) {return a + b}
    }
})
```
```
abc
888
2
4
6
6
6
true
```
## v-html 指令

`{{ }}`插值只会将数据渲染输出为普通文本字符，而非 HTML 代码。为了输出真正的 HTML，你需要使用 `v-html` 指令。
```html
<div id="app">
    <div>{{ message }}</div>
    <div v-html="message"></div>
</div>
```
```javascript
new Vue({
    el: "#app",
    data: {
        message: "<span>example</span>"
    }
})
```
```
<span>example</span>
example
```