# 7 绑定元素样式的指令`v-bind:class` 和`v-bind:style`

[[toc]]

在HTML元素结构中，`class`和`style`特性(`attribute`)是非常突出的，可以为元素添加样式属性(`property`)。

在Vue中，如果我们有动态添加类的需求，比如根据数据条件判断是否需要添加某个类，就可以用`v-bind`指令绑定。因为元素的 class 列表和内联样式syle是数据绑定中非常频繁的操作，所以vue中做了专门的增加，可以非常灵活的使用各种形式来动态绑定样式。

总体上看在写法上，有三类形式：表达式、对象、数组


## `v-bind:class`

我们先看下常规class样式添加写法
```html
<div class="font-color">Set the font color to red by class</div>
```
```css
.font-color {
    color: red;
}
```
再看vue语法动态绑定类class

[点击查看DEMO：`v-bind:class`](https://jsrun.net/fdXKp/edit)
```html
<div id="app">
    <!-- 表达式形式，可以是data中的数据，也可以是计算属性中的数据 -->
    <p :class="singleClass">Add class with value</p>
    <p :class="singleClassByCompute">Add class with computed</p>

    <!-- 对象形式，value为真值，则key作为类生效。value也可以是表达式计算的返回值 -->
    <p :class="{active:true}">Add class with object</p>
    <p :class="{active: 12 < 10 ? true : false}">Add class with object base on condition</p>

    <!-- 数组形式，类名为数据项，也可以表达式-->
    <p :class="['active']">Add class with array</p>
    <p :class="[12 > 10 ? 'active' : '']">Add class with array base on condition</p>

    <!-- 也可以绑定多个动态类 -->
    <p :class="multiClass">Add class with multiple value</p>
    <p :class="{'font-color': true, bg:true}">Add class with multiple value</p>
    <p :class="{'font-color': 12 < 10, bg:true}">Add class with multiple value</p>
    <p :class="[singleClass, multiClass]">Add class with multiple value</p>
    <p :class="[12 > 10 ? 'singleClass':'', multiClass]">Add class with multiple value</p>

    <!-- 动态类与固定类混用，对象和数组形式混用 -->
     <p :class="[{singleClass:true}, multiClass]">Add class with multiple value</p>
     <p class="always" :class="singleClass">Add class with multiple value</p>
    <p :class="[singleClass, 'always']">Add class with multiple value</p>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        singleClass: {active:true},
        multiClass: {
            'font-color': true,
            bg: true,
        }
    },
    computed: {
        fontColorByCompute() {
            return {
                active: 12 < 10 ? true : false,
            }
        }
    }
})
```
```css
.active {
    color: red;
}
.bg {
    background-color: orange;
}
.font-color {
    color: #fff;
}
.always {
    background-color: blue;
}
```
由于写法非常灵活，所以我一般在实际项目中遵循以下规则：

- 对象形式用于绑定单个动态类
- 数组形式用于绑定多个动态类
- 较复杂条件判断类使用计算属性

## `v-bind:style`
vue绑定的`style`为行为样式，我们先看下常规行为样式写法
```html
<div style="font-size:red;">set font color to red by style</div>
```
[点击查看DEMO：`v-bind:style`](https://jsrun.net/JdXKp/edit)
```html
<div id="app">
    <!-- 表达式形式，可以是data中的数据，也可以是计算属性中的数据 -->
    <p :style="styleObj">set inline styel width data</p>
    <p :style="styleByComputed">set inline style width computed</p>
    
    <!-- 对象形式，value为属性值，key为属性名。value也可以是表达式计算的返回值 -->
    <p :style="{color:'orange'}">set inline styel width object</p>
    <p :style= "{color: 12 < 10 ? 'red' : 'yellow'}">set inline style width object base on condition</p>
    <p :style="{color: getColor()}">set inline styel width object base on method</p>
    
    <!-- 数组形式，用于指定一个或多个样式对象。如果有相同样式名，后面会覆盖前面 -->
    <p :style="[bg,styleObj]">set inlne style with array</p>
    <p :style="[12 > 10 ? bg : styleObj]">set inline style with array base on condition</p>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        styleObj: {
            color: 'red'
        },
        bg: {
            backgroundColor: 'blue',
            color: '#fff'
        }
    },
    computed: {
        styleByComputed() {
            return {
                backgroundColor: 'orange',
                color: '#fff'
            }
        }
    },
    methods: {
        getColor() {
        	return `hsl(${Math.floor(Math.random() * 360)}, 75%, 85%)`
    	}
    }
})
```
在上面，对复合类属性的单个属性名采用驼峰式写法，vue会自动将该对象的属性转为正确的CSS属性名，这意味着我们不用操心短横杠的问题啦。
如`backgroundColor`同样有效，最终会被vue转为正确的`background-color`。

同样在实际项目中：

- 单个样式的动态绑定采用对象形式。
- 同一个条件下的多个样式可以用单个对象来表示。
- 不同条件下多个样式或样式组可以用数组形式。复杂表达式计算采用计算属性。