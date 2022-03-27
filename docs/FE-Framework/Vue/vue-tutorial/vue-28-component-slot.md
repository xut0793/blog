# 29 组件三大API之三： slot

- `<slot>`标签
- `v-slot`指令
- 普通插槽
- 有默认值的插槽
- 具名插槽
- 作用域插槽

## `<slot>`标签 和 `v-slot`指令

`v-slot`是`Vue 2.6.0`引入的一个新语法指令，目的是统一之前`slot / slot-scope`的用法。统一的指令语法更简洁也更易理解。

之前讲解的`prop`实现了组件向下的数据传递，而`event`中`v-on / $emit`可以实现组件向上的数据传递。这一节`v-slot`指令实现组件内容的自定义功能。

一个简单的例子，自定义一个按钮组件：
```html
<div id="app">
    <p>this is example for slot</p>
    <custom-button></custom-button>
</div
```
```js
const customButton = Vue.extend({
    template: `<button>提交</button>`,
})

const vm = new Vue({
    el: "#app",
    components: {
        customButton,
    },
})
```
此时这个自定义按钮注定是一个提交按钮，因为我们把按钮上的文字固定写死了“提交”。如果我们需要根据按钮使用的场景不同，显示不同的文字，比如可以是提交、删除、确认、返回等。此时我们就可以使用组件`<slot>`标签，它相当于组件里面内容的占位符。

## 普通插槽

上面的例子我们只需要在组件定义时，在按钮文字的地方用`<slot><slot>`标签代表即可
```js
const customButton = Vue.extend({
    template: `<button>
        <slot></slot>
    </button>`,
})
```
然后在使用组件时提供提供内容即可
```html
<div id="app">
    <p>this is example for slot</p>
    <custom-button>提交</custom-button>
    <custom-button>删除</custom-button>
    <custom-button>返回</custom-button>
</div
```
此时自定义按钮上要显示什么文字完成由组件使用时决定，而不是组件定义时决定。

## 有默认值的插槽
需求升级，我们希望组件在调用时没有写入文字时，默认显示”确认“。此时可以在组件`<slot>`标签定义时提供一个内容文字，将作用为组件内容缺省时的显示。
```js
const customButton = Vue.extend({
    template: `<button>
        <slot>确认</slot>
    </button>`,
})
```
```html
div id="app">
    <p>this is example for slot</p>
    <!-- 有输入内容显示输入的内容：提交 -->
    <custom-button>提交</custom-button>
    <!-- 没有输入内容时默认显示定义时文字：确认 -->
    <custom-button></custom-button>
</div
```

## 具名插槽

上面自定义按钮组件只提供了一个占位插槽，但需要抽象为组件的内容各式各样，比如一个段落内容组件，包括自定义标题、段落正文、写作时间三部分。按分析这个组件至少得分三部分，而且三部分的内容也只有在组件使用时才知道输入什么。

所以我们定义组件时，提供三个占位插槽，一个是用于标题、一个用于显示时间，其它内容都作为正文
```js
const customSection = Vue.extend({
    template: `<section>
        <header>
        <slot name="title"></slot>
        </header>

        <main>
        <slot></slot>
        </main>
        
        <footer>
        <slot name="time"></slot>
        <footer>
    </section>`,
})
```
```html
<custom-section>
    <template v-slot:title>段落标题</template>
    <template>这是段落正文部分，内容很长，这里就省略了......</template>
    <template v-slot:time>2019-5-26</template>
</custom-section>
```
语法很简单：
- 组件定义时：`<slot>`标签的时候指定一个`name`属性值即可
- 组件使用时，`<template>`标签中用`v-slot`指令参数指明具体的名称，表示当前模板内容用于哪个占位符的`slot`即可。

> 在拥有多个具名插槽时，组件调用时写入插槽的内容需要用`<template>`标签包裹

**未命名的默认插槽，有一个内部自带的名称`default`**
```html
<!-- 定义时 -->
 <main><slot></slot></main>
 <main><slot name="defalut"></slot></main>
<!-- 使用时 -->
<template>这是段落正文部分，内容很长，这里就省略了......</template>
<template v-slot:default>这是段落正文部分，内容很长，这里就省略了......</template>
```
**动态选择插槽**
子组件内可以定义多组插槽，外部引用时根据条件决定显示调用哪个具名插槽，相当于一个switch语句。
```html
<div id="app">
    <button @click="changeSlot">点击切换slot</button>
    <custom-section>
        <template v-slot:[variable]>改变了插槽</template>
    </custom-section>
</div>
```
```js
const customSection = Vue.extend({
    template: `<article>
        <slot name="js">this is content for js</slot>
        <slot name="html">this is content for html</slot>
        <slot name="css">this is content for css</slot>
    </article>`,
})
const vm = new Vue({
    el: "#app",
    components: {
        customSection
    },
    data: {
        index: 0,
        arr: ['html', 'css', 'js'],
        variable: 'html'
    },
    methods: {
        changeSlot() {
            this.variable = this.arr[++this.index % 3]
        }
    }
})
```

## 作用域插槽

这里有一个域的概念，在官方文档中有一句话：
> **父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。**

简单来说：
插槽内容虽然被子组件标签包裹，但实际上插槽跟子组件标签一样都属性于父级模板作用域。可以直接引用父组件作用域内的数据。但却不能直接引用子模板作用域内的数据。

```js
const customSection = Vue.extend({
    template: `<section>
        <header>
        <slot name="title"></slot>
        </header>

        <main>
        <slot></slot>
        </main>

        <footer>
        <slot name="time"></slot>
        <footer>
    </section>`,
    data:() => {
        return {
            innerTitle: '写在子级的标题'
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        outerTitle: '写在父级的标题'
    },
    components: {
        customSection,
    },
})
```
上面代码，我们在根组件`vm`中定义了标题`outerTitle: '写在父级的标题'`，也在子组件`custom-section`定义了标题`innerTitle: '写在子级的标题'`。

```html
<div id="app">
    <p>这里可以直接引用父级标题：{{ outerTitle }}</p>
    <custom-section>
        <!-- 在插槽模板内也可以使用父级作用域内的数据的 -->
        <template v-slot:title>{{ outerTitle }}</template>
        <!-- <template v-slot:title>段落标题</template> -->
        <template>这是段落正文部分，内容很长，这里就省略了......</template>
        <template v-slot:time>2019-5-26</template>
    </custom-section>
</div>
```
```html
<div id="app">
    <p>这里是肯定不可以直接引用子级标题：{{ innerTitle }}</p>
    <custom-section>
        <!-- 在插槽也不能直接引用子组件内的数据，控制台会报错!!! -->
        <template v-slot:title>{{ innerTitle }}</template>
        <!-- <template v-slot:title>段落标题</template> -->
        <template>这是段落正文部分，内容很长，这里就省略了......</template>
        <template v-slot:time>2019-5-26</template>
    </custom-section>
</div>
```

但插槽的内容最终是显示在子组件中的，所以很多时候需要用子组件内部的数据来进行操作。此时就需要在定义插槽时将子组件内的数据向上传递，让调用插槽时可以使用。
```js
const customSection = Vue.extend({
    template: `<section>
        <header>
        // <slot name="title"></slot>
        <slot name="title" :title="innerTitle"></slot>
        </header>

        <main>
        <slot></slot>
        </main>

        <footer>
        <slot name="time"></slot>
        </footer>
    </section>`,
    data:() => {
        return {
            innerTitle: '写在子级的标题'
        }
    }
})
```
```html
 <div id="app">
    <p>这里可以直接引用父级标题：{{ outerTitle }}</p>
    <custom-section>
        <!-- <template v-slot:title>段落标题</template> -->
        <template v-slot:title="slotProp">{{ slotProp.title }}</template>
        <template>这是段落正文部分，内容很长，这里就省略了......</template>
        <template v-slot:time>2019-5-26</template>
    </custom-section>
</div>
```
看到，在定义时`<slot>`标签内使用`v-bind`绑定子组件内需要传递的值
```html
<slot name="title" :title="innerTitle"></slot>
```
在插槽调用时，通过`v-slot`的值来的接收后就可以使用了。
```html
<template v-slot:title="slotProp">{{ slotProp.title }}</template>
```
并且`v-slot`的值接收过来是一个对象形式，定义时`v-bind`可以绑定多个，在`v-slot`的值中以键值对接收，使用时对象打点调用。
```html
<slot name="title" :title="innerTitle" :author="author"></slot>
<template v-slot:title="slotProp">{{ slotProp.title + '-' + slotProp.author }}</template>
```
**插槽prop的解构**
当然如果不想使用对象打点调用的方式，也可以使用ES6对象解构的语法调用。
```html
<slot name="title" :title="innerTitle" :author="author"></slot>
<template v-slot:title="{ title, author }">{{ title + '-' + author }}</template>
```
**插槽prop的重命名**
如果传递上来的prop可能跟父级作用域引用的变量重名，可以在解构时重命名
```html
<slot name="title" :title="innerTitle" :author="author"></slot>
<template v-slot:title="{ title, author：writer }">{{ title + '-' + writer }}</template>
```
**插槽prop的默认值**
也可以写一个默认内容，避免接收的prop是undefined情况
```html
<slot name="title" :title="innerTitle" :author="author"></slot>
<template v-slot:title="{ title, author='anonymity'}">{{ title + '-' + author }}</template>
```
**插槽prop的就是函数参数**
在官方文档中说明，插槽内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里，所以ES6函数参数的新语法都可以使用，如解构、参数默认值等
```js
function (slotProps) {}
function ({title, author}) {}
function ({title, author=anonymity}) {
  // 插槽内容
}
```
## `v-slot`的简写`#`

跟`v-bind`简写成`:`，`v-on`简写成`@`一样，`v-slot`简写`@`

当采用简写`#`后面必须接一个插槽名称，当`#`绑定默认插槽时，需要写成`#default`
```js
// 可以
<template v-slot="slotProp"></template>
// 错误
<template #="slotProp"></template>
// 改成
<template #defalut="slotProp"></template>
```
**独占默认插槽时，v-slot可以绑定在子组件标签上,省略template**
```html
<div id="app">
    <p>this is example for slot</p>
    <custom-button v-slot={type}>{{ type ? '确定' : '删除'}}</custom-button>
    <custom-button #default={type}>{{ !type ? '确定' : '删除'}}</custom-button>
</div
```
```js
const customButton = Vue.extend({
    template: `<button><slot :type="btnType"></slot></button>`,
    data() => {
        return {
            btnType: 1, // 1 确定 0 删除
        }
    }
})

const vm = new Vue({
    el: "#app",
    components: {
        customButton,
    },
})
```
**总结**
```js
v-slot:slotName="slotProp"
#:slotName="slotProp"
```





