# 17 methods

函数是十分优雅的语言特性，它让我们可以采用可复用的方式存储一段逻辑，从而不用重复代码就可以在多处调用。函数、组件、模块等都有复用代码的考虑，函数应该是最早组织复用代码的实现。
在`vue`中，函数被定义为方法来使用，配置在`methods`属性中，`methods`是一个对象，函数名和函数体分别作为`methods`对象的键值对。

```js
new Vue({
    el: "#app",
    data: {
        count: 0,
    },
    methods: {
        increase: function () {
            this.count++
        }
    }
})
```
在学习事件绑定指令`v-on`时介绍有几种写法，指令接收表达式写法，所以我们可以直接将简单的事件处理逻辑写在指令的表达式中。
```html
<div id="#app">
    <div>{{ count }}</div>
    <button @click="count++">count+1<button>
</div>
```
但是在实现项目中，事件处理函数的逻辑往往都是比较复杂的，不可能向上面这样将处理逻辑写在HTML元素中，所以就可以定义函数，写在`methods`方法中。
```html
<div id="app">
    <div>计数：{{ count }}</div>
    <button @click="increase">count+1</button>
</div>
```
```js
methods: {
    addOneDay() {
        this.count++
    }
},
```
### this
`this`指向当前所处的组件，可以使用`this`访问当前组件的配置对象`Optiins`的所有属性值。并且经过`vue`的封装，可以直接打点调用某个属性值。比如：
```js
var vm = new Vue({
    el: "#app",
    data: {
        count: 0,
    },
    computed: {
        double() {return this.count *2}
    }
    methods: {
        addCount() {this.count++}
    }
})
```
此时`this`指向这个`vue`实例`vm`。调用`vm.data.count`属性不需要`this.data.count`的写法，而是直接`this.count`或`this.double`或`this.addCount`。在计算属性和方法或其它配置对象属性中使用也一样。

具体见[`vue`作用域概念：全局和局部](https://www.cnblogs.com/webxu20180730/p/10890888.html)