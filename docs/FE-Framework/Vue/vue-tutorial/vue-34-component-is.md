# 36 component动态组件：is属性

让多个组件使用同一个挂载点，并动态切换，这就是动态组件。

必要条件：
- 组件标签使用`<component></component>`
- 动态绑定使用`is`特性`v-bind:is=""`

```html
 <div id="app">
    <button @click="changeCom('home')">Home</button>
    <button @click="changeCom('page')">page</button>
    <button @click="changeCom('about')">About</button>

    <component :is="variable"></component>
</div>
```
```js
const vm = new Vue({
    el: "#app",
    components: {
        home: {template: `<div>home</div>`},
        page: {template: `<div>page</div>`},
        about: {template: `<div>about</div>`},
    },
    data: {
        variable: 'home'
    },
    methods: {
        changeCom(name) {
            this.variable = name
        }
    }
})
```

`is`绑定组件的是组件name属性值，也可以绑定一个组件的构造器选项对象。
```html
<component :is="comOptions"></component>
```
```js
data: {
    comOptions: {
        template: `<div>直接传入一个组件的选项对象</div>`,
    }
},
```
