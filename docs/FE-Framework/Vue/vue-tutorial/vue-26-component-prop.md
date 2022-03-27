# 26 组件三大API之一： prop

- prop的大小写
- prop接收类型
    - 字符串数组形式
    - 对象形式： type / required / default / validator
- prop传递类型: 静态传递 / 动态绑定
- 单向数据流
- 非prop：替换或合并 / 禁用inheritAttrs:false  / $attrs

上节对组件的概念讲到，组件是可复用的`Vue`实例，并且组件可以嵌套，组件间可以相互通信。
两个嵌套的组件通信，父组件向子组件传值，常规的做法就是采用`prop`

先看个一个例子直观感受下：
```html
<div id="app">
    <p>这个一个父子组件传值的例子</p>
    <my-child text-color="red"></my-child>
</div>
```
```js
new Vue({
    el: '#app',
    components: {
        MyChild: {
            template: `<div :style="{color: textColor}">The text will be colorfully</div>`,
            props: ['textColor']
            // 在子组件中可以像使用data数据一样使用props中的数据。
        }
    }
})
```

## prop的大小写
在组件命名规范中提到过，HTML是大小写不敏感的，在DOM模板中必须使用 kebab-case，即连字符-形式。在JS域中，prop使用camelCase ,即小驼峰形式。区别于组件名的PascalCase大驼峰形式。

## prop接收值类型

简单的传值可以采用数组形式，但更建议使用语义更明确，且带有数值验证功能的对象形式。这样当 prop 验证失败的时候，开发环境下， Vue 将会在控制台产生一个警告。

**字符串数组形式**
```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```
**带验证功能的对象形式：type / required / default / validator**
```js
// 官方示例
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    // type类型可以是：String Number Boolean Array Function Object Date Symbol
    // type也可以是自定义的构造函数，内部将通过 instanceof 检查确认
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取，原因同data一样
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数，通过true 不通过false
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

## 父级组件传递prop的方式

### 静态传值
静态传值，始终将值以字符串形式传递到子组件接收。
```html
<my-child text-color="red"></my-child>

<!-- 子组件接收的到number值是字符串类型1，而不是数值1。 -->
<my-child number="1"></my-child>
<!-- isUse接收到是字符串"false"，如果对isUse验证布尔值，将当作true验证通过。 -->
<my-child is-user="false"></my-child>
```
如果传值要符合预期，就要使用动态传值，将prop值用`v-bind / :`绑定。
如果是将父组件的响应式数据，如data/computed数据传递，也必须用`v-bind / : `绑定，这样父组件中的值变化，也会响应更新到子组件使用对应prop的地方。

### 动态传值

[引用官方示例，需要查看官方原文请点击](https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E9%80%92%E9%9D%99%E6%80%81%E6%88%96%E5%8A%A8%E6%80%81-Prop)
**传入一个响应式动态变量**
```html
<!-- 传递一个动态变量color可以在data或computed中声明 -->
<my-child :text-color="color"></my-child>
```
**传入一个数字**
```
<!-- 即便 `42` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:likes="42"></blog-post>
```
**传入一个布尔值**
```html
<!-- 即使该is-published没有值的情况在内，都意味着 `true`。-->
<blog-post is-published></blog-post>

<!-- 即便 `false` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:is-published="false"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```
**传入一个数组**
```html
<!-- 即便数组是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```
**传入一个对象**
```html
<!-- 即便对象是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>
<!-- 或者 -->
<blog-post
  v-bind:author="author"
></blog-post>
data: {
  author: {
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }
}
<!-- 组件接收时格式：组件可以通过打点访问对象的属性 -->
Vue.component('child', {
  props: ['author'],
  template: '<span >{{ author.name }}  {{author.company}}</span>'
})

<!-- 将一个对象的所有属性都作为 prop 传入-->
<blog-post v-bind="author"></blog-post>
<!-- 组件接收格式：props需要声明对象的每个属性 -->
Vue.component('child', {
  props: ['name','company'],  
  template: '<span >{{ name }}  {{company}}</span>'
})
```

## 单向数据流
prop使父子组件间形成了一个单向数据绑定，父组件的值可以供子组件调用。在使用`v-bind`动态绑定时，每当父组件传入的值发生更新，子组件也会将对应的prop刷新。但是子组件无法对prop值直接进行修改，如果这样做，控制台会发出警告。
这就是组件prop的单向数据流特性。

但是在实现项目中，子组件内部在使用prop值的地方并不是一直不变的，可能初始值使用prop传入的值，但后面在子组件内还会更新此处的值，但受限于无法在子组件内直接修改prop，所以可以尝试以下两种方式：

- **将传入的prop赋值给data作为初始值**
此时prop仅会被使用一次，当赋值给data后，即使父组件更新prop值也不会对子组件有影响。
```js
props: ['initialCounter'],
data: function () {
  return {
    // 在前面讲解生命周期章节中有标示,在初始化阶段Vue内部initProp在initMethods/initData之前开始，所以可以在data中直接使用this.prop进行赋值
    counter: this.initialCounter
  }
}
```
- **将传入的prop使用计算属性包装一层使用，此时父组件更新prop仍会使子组件更新，而且可以通过计算属性的setter对赋值操作进行拦截处理**
```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

- **注意对prop传入引用类型数据（对象、数组）的修改产生的影响**
注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。

## 非prop的特性
一个非 prop 特性是指父组件有传向子组件，但是子组件并没有在 props中定义的特性。
此时这些非prop特性会按以下规则处理：

- 直接作用于组件的根元素上。
    - 如果子组件的根元素上已经定义过这个特性，那么外部传入的特性将会覆盖子组件内部定义的特性，外部优先权更大
    - class 和 style 会智能的进行合并，而不是简单的覆盖

- 如果不想子组件根元素接收这些非prop特性，则需要在子组件内部声明`inheritAttrs: false`。但这条声明对class 和 style 智能合并行为无效，即class/style仍会合并非prop

- 不管根元素是默认接收非prop特性，还是显示声明了拒绝接收，这些非prop特性都会被vue内部定义的`$attrs`对象接收（除class/style)。并且这个对象在子组件内部可以通过`this.$attrs`进行正常调用。
比如：`v-bind='$attrs'`动态传入当前子组件的子组件，或仍绑定在当前子组件上，进行兜底。

```html
<div id="app">
  <base-input
      label='示例'
      v-model="username"
      autofocus
      placeholder="Enter your username"
  ></base-input>
    </div>
```
```js
// v-bind="$attrs"，相当于将整个$attrs对象值作用于元素上。见上面动态绑定一个对象所有属性示例
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
      <label>
      {{ label }}
      <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
      >
      {{ $attrs }}
      </label>
    `,
    created(){
        console.log('$attrs in baseInput',this.$attrs)
    }
})
const vm = new Vue({
    el: "#app",
    data: {
        username: '',
    },
    mounted() {
        this.$nextTick(() => {
            console.log('$attrs in vm',this.$attrs)
        })
    }
})
```
```
$attrs in baseInput: {autofocus: "", placeholder: "Enter your username"}
$attrs in vm: {}
```






