# 5 列表渲染的指令`v-for`

- `v-for` on Array / Object / String / Number
- `v-for` on template
- `v-for` on expression
- `v-for` with key

`v-for`指令可以对一个可迭代对象进行遍历，将指定的值循环输出显示。

## 基本语法形式：
```
v-for = "item in arr"    OR   v-for = "(item, index) in arr"
v-for = "value in obj"   OR   v-for = "(value, key, index) in obj"
v-for = "char in str"    OR   v-for = "(char, index) in str"
v-for = "n in num"
v-for = "item in expression"   expression === Array / Object / str / num
```
> 以上 index, key都是可省略，并注意参数的顺序：值在前，序号或键值在后。

>`in` 改为 `of` 同样有效，如 `v-for = "item of arr"`

[ 点击查看DEMO: v-for on Array/Object/String/Number/template](https://jsrun.net/GsXKp/edit)

```js
//js
new Vue({
    el: "#app",
    data: {
        arr: ["HTML", "CSS", "JS", "JQ", "VUE"],
        obj: {
            Rocket: "McGrady",
            Lakers: "Kobe",
            Mavericks: "Nowitzki",
        },
        str: "abc",
        num: 3
    }
})
```

```html
<!-- Array -->
<li v-for = "item in arr">{{ item }}</li>
<li v-for = "(item, index) in arr">{{ index + "-" + item }}</li>
<li v-for = "(item, index) of arr">{{ index + "-" + item }}</li>
```

```html
<!-- Object -->
<li v-for = "value in obj">{{ value }}</li>
<li v-for = "(value, key) in obj">{{ key + "-" + value }}</li>
<li v-for = "(value, key, index) in obj">{{index + "-" + key + "-" + value }}</li>
```

```html
<!-- String -->
<li v-for = "char in str">{{ char }}</li>
<li v-for = "(char, index) in str">{{ index + "-" + char }}</li>
```

```html
<!-- Number -->
<li v-for = "n in num">{{ n }}</li>
```

```html
<!-- v-for on template -->
<h3>super star in NBA team</h3>
<template v-for = "(starName, teamName) in obj">
    <p>team name: {{ teamName }}</P>
    <p>super star: {{ starName }}</p>
</template>
```
> 使用`template`包裹元素块可以让文档避免太多无意义块元素，如太多只作包裹性质的`div`

[ 点击查看DEMO: v-for on expression](https://jsrun.net/PcXKp/edit)

```html
<!-- v-for on expression -->
<ul id="app">
    <!-- v-for 渲染计算属性的值，偶数列表 -->
    <li v-for="even in evenNumbers">{{ even }}</li>
    <br/>
    
    <!-- v-for 渲染方法oddNumber执行返回的奇数列表 -->
    <li v-for="odd in oddNumbers(numbers)">{{ odd }}</li>
</ul>
```
```js
new Vue({
    el: "#app",
    data: {
        numbers: [1,2,3,4,5,6,7,8,9]
    },
    computed: {
        evenNumbers() { return this.numbers.filter(item => item % 2 === 0)}
    },
    methods: {
        oddNumbers(arr) { return arr.filter(item => item % 2 !== 0)}
    }
})
```

## key 标识列表元素的唯一性

同上一节中讲到的`v-if`中的`key`作用一样，如果在`v-for`的数据发生了变化，vue并不是重新生成并渲染所有元素，而是智能找到需要更改的元素，并只更新这些元素，其它元素“就地复用”。这是VUE的差异对比机制控制的（virtual DOM和DOM diff会在下一阶段总结）。


刻意采用这种默认机制可以获取页面渲染性能的提升，但官方仍然建议不要使用默认做法，正确做法是加上`key`，以便对每个列表元素提供一个可跟踪的唯一属性值，在大型项目中或组件列表渲染中更为高效。

> `key`应该是一个字符串或数值类型的唯一值。不要使用对象或数组之类的`非原始类型值`，如不要用下标`index`作为 v-for 的 key。

[ 点击查看DEMO: v-for with key](https://jsrun.net/pcXKp/edit)

```html
 <!-- has key -->
<div id="app">
    <template>
        <demo-key
            v-for="(item, i) of items"
            @click.native="items.splice(i,1)">
            {{ item }}
        </demo-key>
    </template>
</div>
```

```html
<!-- no key -->
<div id="app">
    <template>
        <demo-key
            v-for="(item, i) of items"
            :key="item"
            @click.native="items.splice(i,1)">
            {{ item }}
        </demo-key>
    </template>
</div>
```

```js
// js
const randomColor = () => `hsl(${Math.floor(Math.random() * 360)},75%, 85%)`
const DemoKey = {
    template: `<p :style="{backgroundColor: color}"><slot></slot></p>`,
    data: () => ({
        color: randomColor()
    })
}

new Vue({
    el: "#app",
    data: {
        items: ["one", "two", "three", "four", "five"]
    },
    components: {
    	DemoKey
	}
})
```



