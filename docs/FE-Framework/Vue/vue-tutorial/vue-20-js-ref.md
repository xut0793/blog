# 10 使用ref直接访问DOM元素


传统DOM操作或jQuery操作DOM，都必须是选择器先选择对应的DOM元素。比如：
```html
<button id="btn">按钮</button>
```
```js
var dom = document.getElementById("btn");
var $dom = $("#btn")
console.log(dom === $dom[0]) // true
```
在vue中提供了更为便捷的方法，只需要在元素开始标签内添加ref特性即可。然后在js部分使用`this.$refs`获取DOM元素。这个元素完全是原生DOM元素。

    `this.$refs`返回的是一个对象，所有注册过的`ref`特性的值作为对象的`key`，对应的DOM元素为`value`。

    为了保证`this.$refs`调用能获取DOM元素，需要在`this.$nextTick`的回调函数中执行。关于`$nextTick`函数下节讲解。
```html
<button ref="btn" id="btn">按钮</button>
```
```js
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://unpkg.com/vue"></script>
new Vue({
    mounted(){
        this.$nextTick(() => {
            let dom = document.getElementById("btn7")
            let $dom = $("#btn7")
            let v_dom = this.$refs.btn

            console.log('dom == $dom', dom === $dom[0]) // true
            console.log('dom === v_dom', dom === v_dom) // true
        })
    }
})
```
虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做，此时使用ref是非常便利的方法。
[DEMO：ref获取dom元素](https://jsrun.net/gHXKp/edit)
