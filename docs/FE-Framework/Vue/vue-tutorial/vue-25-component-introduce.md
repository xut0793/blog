# 25 组件概念
`Vue`遵循`Web Component`规范，提供了自己的组件系统。组件是一段独立的代码，代表页面中某个功能块，拥有自己的数据、JS、样式，以及标签。组件的独立性是指形成自己独立的作用域，不会对其它组件产生任何副作用。

**Vue 组件是可复用 Vue 实例，接受相同的选项option对象 (除了一些根级特有的选项) 和使用相同的生命周期钩子，以及模板调用方式。**

**Vue 组件可以嵌套，所以组件之间可以进行引用和通信**

## 组件定义

`Vue`提供了专用的API来定义组件，组件构造器函数： `Vue.extend()`
```js
    const MyComponent = Vue.extend(option)
    // option跟new Vue(option)时基本相同（除了el/data）
```
这样，我们就构建好了一个组件，但现在还无法使用这个组件。还需要将这个组件注册到对应的应用中。

## 组件的注册

为了能在模板中使用，这些组件必须注册以便 `Vue` 能够识别。有两种注册方式：**全局注册和局部注册**。

### 全局注册

使用API：`Vue.component`就可以完成组件全局注册，全局注册的组件可以被多个`Vue`实例复用。
```js
Vue.component('my-component', MyComponent)
// 组件注册语句必须在new Vue(option)之前
```

### 局部注册
使用`Vue`实例的`components`属性注册局部组件，局部注册的组件只在包含它的父组件作用域内有效。
```js
const MyChild = Vue.extend({
    template: `<p>{{ childMsg }}</p>`
    data: function() {
        return {
            childMsg: 'This is a child component'
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        msg: 'This is a parent component'
    },
    components: {
        MyChild: MyChild
    }
})
```
上述`Child`组件只在`vm`实例内有效。在其它新建的实例内无法引用。

### 注册语法糖
`Vue`对全局注册和局部注册都提供了简写方法，可以在注册的同时定义组件，`Vue`内部会自动调用`extend`方法构建组件。
> [Vue源码解读之Component组件注册](https://segmentfault.com/a/1190000016125184)
```js
// 全局注册
Vue.component('MyChild', {
    template: `<p>{{ childMsg }}</p>`
    data: function() {
        return {
            childMsg: 'This is a child component'
        }
    }
})

// 局部注册
new Vue({
    el: "#app",
    data: {
        msg: 'This is a parent component'
    },
    components: {
        MyChild: {
            template: `<p>{{ childMsg }}</p>`
            data: function() {
                return {
                    childMsg: 'This is a child component'
                }
            }
        },
    }
})
```

## 组件的使用

在注册组件同时，也声明了一个自定义标签，即组件名。在`Vue`模板需要调用的地方使用组件名作为自定义的标签，直接调用组件。  
```js
<My-Child></My-Child>
```

## 注意事项：

### option的区别
```js
const MyChild = Vue.extend(option)
const vm = new Vue(option)
```
- data必须是一个函数
因为组件是可复用的，如果组件的data是一个对象的直接引用，那复用多个组件将共享一个对象，其中一个组件修改了对象属性，其它组件引用了该对象属性的值也会变化，这是我不希望看到的。而通过函数返回值，将实现每个组件拥有独立的数据对象。
[点击查看官方示例解释](https://cn.vuejs.org/v2/guide/components.html)

```js
new Vue({
    el: "#app",
    data: {
        msg: 'This is a parent component'
    },
    components: {
        MyChild: {
            template: `<p>{{ childMsg }}</p>`
            data: function() {
                return {
                    childMsg: 'This is a child component'
                }
            }
        },
    }
})
```

### 解析 DOM 模板时的注意事项
有些 HTML 元素，诸如 `<ul>`、`<ol>`、`<table>` 和 `<select>`，对于哪些元素可以出现在其内部是有严格限制的。而有些元素，诸如 `<li>`、`<tr>` 和 `<option>`，只能出现在其它某些特定的元素内部。

这会导致我们使用这些有约束条件的元素时遇到一些问题。例如：
```html
<table>
  <blog-post-row></blog-post-row>
</table>
```
这个自定义组件 `<blog-post-row></blog-post-row>` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。幸好这个特殊的 is 特性给了我们一个变通的办法：

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```
**需要注意的是如果我们从以下来源使用模板的话，这条限制是不存在的：**

- 字符串模板 (例如：template: '...')
- 单文件组件 (.vue)
- `<script type="text/x-template">`
[vue获取模板内容的N种方式，点击查看](https://www.cnblogs.com/webxu20180730/p/10890790.html)

## 组件的命名规范
[官方组件命名风格指南](https://cn.vuejs.org/v2/style-guide/#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)

- 在JS域中使用PascalCase，在DOM模板域中使用kebab-case
- 以父组件或更高级别的单词开头，使用语义完整的单词

> - 由于 HTML 是大小写不敏感的，在 DOM 模板中必须使用 kebab-case
> - 在 JavaScript 中，PascalCase 是类和构造函数 (本质上任何可以产生多份不同实例的东西) 的命名约定，Vue 组件也可以有多份实例，所以同样使用 PascalCase 是有意义的。


[点击查看DEMO](https://jsrun.net/WyyKp/edit)
```html
<div id="app">
    <p>{{ msg }}</p>
    <com-local></com-local>
    <com-global></com-global>
</div>
<p>=================================</p>
<div id="other">
    <p>{{ msg }}</p>
    <com-other-local></com-other-local>
    <com-global></com-global>
</div>
```
```js
// 使用构造器函数定义组件
const ComLocal = Vue.extend({
    data: function() {
        return {
            msg: 'This is a local component'
        }
    },
    template: `<p>{{ msg }} by Vue.extend</p>`
})

// 全局注册组件，并且必须在new Vue()之前
Vue.component('ComGlobal', {
    data: () => {
        return {
            msg: 'this is a global component'
        }
    },
    template: `<p>{{ msg }} by Vue.component`
})

// 创建一个Vue 实例对象vm，调用全局组件和使用extend定义的局部组件
const vm = new Vue({
    el: "#app",
    data: {
        msg: 'This is a vm'
    },
    components: {
        ComLocal
    }
    
})

// 创建另一个Vue实例对象otherVm，调用全局组件和使用内部components属性定义的局部组件
const otherVm = new Vue({
    el: '#other',
    data: {
        msg: 'This is other Vue'
    },
    components: {
        comOtherLocal: {
            template: `<p>This is a local component by components properity</p>`
        }
    }
})
```

```
// 输出
This is a vm
This is a local component by Vue.extend
this is a global component by Vue.component
=================================
This is other Vue
This is a local component by components properity
this is a global component by Vue.component
```


