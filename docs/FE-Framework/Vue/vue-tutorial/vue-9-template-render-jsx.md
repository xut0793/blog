# 13 vue模板内容的写法

目录
- outerHTML获取内容
- template属性获取内容
    - ES6的字符串模板
    - `<template>`标签
    - `<srcipt type="text/x-template></script>`
- render()函数
    - `render(createElement => createdElement(标签名称，数据对象，子节点列表))`
    - JSX语法：`render(() => {return (JSX)})`

vue遵循**数据驱动**的理念，在视图层通过**模板**处理数据在页面的显示。所以vue至少要获取到数据和模板内容。数据在VUE实例化时通过配置项的options对象的data属性传入，即`options.data`，那模板内容即页面HTML内容如何获取到呢？

我们先看下官方文档中，VUE的生命周期图解：
![outerHTML-template-render](../image/outerHTML-template-render.png)

在vue实例化过程中，会先判断配置对象options是否有提供template属性值，如果没有就使用原生DOM方法`el.outerHTML()`获取挂载元素中的DOM内容作为模板内容，如果有提供template属性值，就直接使用其值，并覆盖`el`元素中的内容。

另外，vue所获取到的template内容最终都需要传入`render()`渲染，所以vue 2.0之后，也直接将`render`方法暴露出来，可以直接使用。

所以，最终vue获取HTML内容有三种方式：outerHTML() / template / render()，其中每种方法又有一些各自的写法。

## outerHTML获取内容
```html
<div id="example_outerHTML">
    <div>{{ msg }}</div>
</div>

<script>
new Vue({
    el: "#example_outerHTML",
    data: {
        msg: "HELLO VUE by outerHTML"
    }
})
</script>
```
## template 属性写法
```html
<div id="example_template_string"></div>

<script>
new Vue({
    el: "#example_template_string",
    data: {
        msg: "HELLO VUE by template string"
    },
    // 简单HTML直接使用字符串拼接，也可以使用ES6模板字符串换行书写，更直观
    // template: "<div>{{ msg }}</div>",
    template: `<div>
                <span>{{ msg }}</span>
            </div>`,
})
<script>
```
## template 标签写法
```html
<div id="example_template_tag"></div>
<template id="temp_tag">
    <div>{{ msg }}</div>
</template>

<script>
new Vue({
    el: "#example_template_tag",
    data: {
        msg: "HELLO VUE by template tag"
    },
    // 使用<template>标签写法
    template: "#temp_tag",
    
})
</script>
```
## script x-template类型
```html
<div id="example_script"></div>
<script id="temp_script" type="text/x-template">
    <div>{{ msg }}</div>
</script>

<script>
new Vue({
    el: "#example_script",
    data: {
        msg: "HELLO VUE by template script"
    },
    template: "#temp_script"
})
</script>
```
## render(createElement)
```html
<div id="example_render_createElement"></div>

<script>
new Vue({
    el: "#example_render_createElement",
    data: {
        msg: "HELLO VUE by render createElement"
    },
    // 写法一：
    // render: function (createElement) {
    //     return createElement("div", this.msg)
    // },

    // 写法二： 约定 const h = this.$createElement，所以简写
    render: function (h) {
        return h("div", this.msg)
    },

    // 写法三：使用ES6语法，同名对象的简写
    // render: h => h("div", this.msg)
})
</script>
```
## JSX
```html
<div id="example_render_JSX"></div>

<script>
// JSX语法需要安装插件
// npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
new Vue({
    el: "#example_render_JSX",
    data: {
        msg: "HELLO VUE by render JSX"
    },
    render: function () {
        return (
            <div>{{ msg }}</div>
        )
    }
})
</script>
```
在实际开发中，都采用`.vue`的单文件组件写法，所以HTML内容固定写法是在`<template></tempate>`标签内，但此类文件需要安装`vue-loader`解析插件。
在`main.js`中`new Vue()`实例化时，获取全局的`APP.vue`组件时都采用`render()`形式。

## 延伸扩展知识（点击查看）

- vue的`render(tagName, data, childNode)`详解
- JSX语法详解
- HTML5的`template`元素：内容模板元素
- 原生DOM的方法：`outerHTML`/`innerHTML`/`outerText`/`innerText`/`textContent`区别