# vue 中 jsx 写法总结

[[toc]]

**WWHD方法论**

## What: JSX 是什么 

JSX 是 Facebook 工程团队在 React 中创造的一个术语。
> JSX 是 JavaScript 的类似 XML 的语法扩展，没有任何定义的语义。

`JSX = Javascript + XML` 所以说 JSX 是一种 Javascript 的语法扩展，我们可以在 Javascript 里面写类 XML 语法，所以它即具备了 Javascript 代码的灵活性，同时又兼具 HTML 的语义化和直观性。

JSX 编译不打算由 JS 或 TS 引擎或浏览器来实现。相反，通常由 Babel 插件将 JSX 转换成常规的 JS 函数来执行。所以基于不同的 Babel 插件，vue JSX 的写法会稍有不同，最新的转换 JSX 的 Babel 插件是支持 vue 3.x 语法，且 JSX 的写法与 React JSX 语法更接近了。
> 通过深入 JSX 内容，会知道 JSX 语法会最终转换成 createElement 函数来执行代码。

## Why: 为什么要用 JSX

即：JSX 解决了什么问题？

Vue 目前推荐的 SFC 文件中使用 `<template></template>` 模板组织 HTML 代码，但很多时间仍然无法解决 HTML 代码重复书写的问题。

这里有一个实际业务开发的例子，在开发后台管理系统中不可避免有很多表格组件，如果使用 Element-ui 的 tabel 组件会写成如下代码：

```html
<el-tabel :data="tableData">
  <el-table-column prop="artifact_name" label="名称"></el-table-column>
  <el-table-column prop="version" label="版本"></el-table-column>
  <el-table-column prop="path" label="Path"></el-table-column>
  <el-table-column prop="package_type" label="类型"></el-table-column>
  <el-table-column prop="size" label="大小"></el-table-column>
  <el-table-column prop="repository_name" label="制品库"></el-table-column>
  <el-table-column prop="update_time" label="更新时间"></el-table-column>
</el-table>
```
上面代码在 `<el-table-column>` 中除了props 和 label 的具体值不同，其它代码基本都是重复的。想象一下，如果要展示更多列，或者有更多页面使用类似的表格。上面这种重复的代码将会持续增长。

> 这里还有一个 vue 官网中[例子](https://cn.vuejs.org/v2/guide/render-function.html)

如何解决 HTML 中重复代码的问题？

使用 Vue 提供的 render 函数来实现 HTML 代码。

```js
export default {
  name: 'example',
  data() {
    tableData: [],
    columns: [
      {
        prop: 'artifact_name',
        label: '名称',
      },
      // 省略...
    ]
  },
  render() {
    return (
      <el-tabel data={this.tableData}>
        {this.columns.map(item => (
          <el-table-column {...{ props:item }} />
        ))}
      </el-table-column>
    )
  }
}
```

## HOW：如何使用 JSX

Vue 中实现 JSX 语法的 Babel 插件也是一直在更新，所以安装不同的 Babel 插件所支持的 JSX 写法上会有不同，所以有时候如果看到某种写法不支持，可能是当前安装的 Babel 插件不支持。

### 插件1：babel-plugin-transform-vue-jsx

此插件支持 vue 2.x 版本语法，并且要求 Babel 6.x 。安装该插件的同时要附加安装一些其它语法支持的插件，并且配合 Babel 的默认预设插件 babel-preset-env

```
npm install --save-dev  babel-plugin-syntax-jsx  babel-plugin-transform-vue-jsx  babel-helper-vue-jsx-merge-props
npm i -D babel-preset-env
```
配置 babelrc.js
```js
{
  "presets": ["env"],
  "plugins": ["transform-vue-jsx"]
}
```
具体 JSX 语法查阅 [Vue JSX](https://github.com/vuejs/jsx) 以及 [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)

### 插件2： babel-preset-jsx

这个是 Babel 的一个预设配置，它集成了更多的 JSX 语法转换相关的插件，实现了更多 vue JSX 便利的写法，并且要求 Babel 7.x 以上。
```
npm install --save-dev @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
```
因为它是 Babel 的一个预设包，所以 babelrc.js 配置如下：
```js
{
  presets: ['@vue/babel-preset-jsx'],
}
```
默认情况下，它的所有新的 JSX 写法特性都是启用的（compositionAPI 除外），在配置中也可以有选择开启或关闭某些语法特性。

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx',
      {
        compositionAPI: false, //  @vue/babel-sugar-composition-api-inject-h and @vue/babel-sugar-composition-api-render-instance
        functional: true, //  @vue/babel-sugar-functional-vue
        injectH: true, //  @vue/babel-sugar-inject-h
        vModel: true, //  @vue/babel-sugar-v-model
        vOn: true, //  @vue/babel-sugar-v-on
      },
    ],
  ],
}
```
上面每个特性都对应着一个实现该特性的  babel 插件。具体特性支持的 JSX 语法可以搜索各插件查看 [babel-prset-jsx](https://github.com/vuejs/jsx/tree/dev/packages/babel-preset-jsx)

### 插件3：babel-plugin-jsx

这是最新 JSX 插件，要求 Vue 3.x 和 Babel 7.x 以上。它支持 vue 3.0 语法，并且支持 vue 指令参数 args 的写法。

```
npm install @vue/babel-plugin-jsx -D
```
Babel 配置，要配置 Babel 默认的预设 babel-preset-env
```js
// babel.config.js
module.exports = {
  presets: ['env'],
  plugins: ['@vue/babel-plugin-jsx']
}
```
目前支持 vue 3.x 语法的 UI 库都使用该插件：`Ant Design Vue` `Vant` `Element Plus`。

具体更新的 JSX 写法参考 [babel-plugin-jsx](https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md)

## JSX 通用语法

JSX 大部分写法可以参照 [vue JSX](https://github.com/vuejs/jsx)

既然 JSX 可以用来替换 template 的写法，我们可以先剖析下 `<template>` 中一个普通元素或一个组件元素的开始标签中由哪些东西组成：

```html
<!-- 一个普通元素 -->
<input v-if="isShow" type="text" :disabled="isDisabled" class="input-class" :class="{active: isActive}" style="font-size:12px" @click="onClick" />
<!-- 一个组件元素 -->
<custon-component v-show="isShow" link :product="product" class="custom-class" :class="{active: isActive}" style="font-size:12px" @custom-click="onClick" >
  <input /> <!-- slot 插槽内容 -->
</custom-component>
```
不管是普通元素还是组件，在开始标签中的东西基本可以分为以下几种：
1. 组件 prop：组件元素特有。
1. 普通 attribute 属性：有静态和动态之分，动态即使用 v-bind 或 ：绑定。
1. class 和 style 属性：在 vue 中将 class 和 style 会区别于普通属性，但同样有静态和动态区分。
1. 事件：v-on 或 @ 绑定，或 hook 事件。
1. 指令：可以细分类型
  1. 作用于元素 DOM 内容的指令：v-text / v-html
  1. 逻辑指令：v-if / v-else / v-else-if / v-for
  1. 动态内容绑定指令：v-bind / v-model
  1. 事件绑定指令：v-on (同上事件)
  1. 插槽指令：v-slot
  1. 自定义指令
1. 其它特殊属性：key is ref slot

针对以上这些特征，我们分别介绍它们在 JSX 语法中如何实现。

### 元素内容

```html
<template>
  <div>
    <!-- 静态内容 -->
    <span>Hello JSX</span>
    <!-- 动态内容 -->
    <div>{{ message }}</div>
  </div>
</template>
```
```js
// vue 2.x 版本，同 template 一样， render 函数返回内容也要包裹在一个根元素上。在 vue 3.x 版本中可以使用 fragment 特性，不需要根元素
// JSX 对静态内容直接写，动态内容使用一层大括号包裹动态内容。
render() {
  return (
    <div>
      <span>Hello JSX</span>
      <div>{ this.message }</div> 
    </div>
  )
}
```

### Attributes / Props

不管是普通元素 Attribute 属性或组件的 prop 属性，还是属性其它的特殊属性 is key ref
- 如果是静态的直接写;
- 动态的需要写在大括号内，但不需要使用冒号。

```html
<template>
  <div>
    <input type="email" :disabled="isDisable" />
    <custom-component link :data="productData" ref="customCom"/>
  </div>
</template>
```
```js
render() {
  return (
    <div>
      <input type="email" disabled={this.isDisabled} />
      <custom-component link data={this.productData} ref="customCom" />
    </div>
  )
}
```

### class / style

class 的静态和动态写法同属性一样。

style 在 JSX 中一般都不采用静态写法，而是使用动态写法，以对象的形式传入。所以看起来像是双层大括号包裹。

```html
<template>
  <div>
    <span class="a" :class="{active: isActive}" :style="{fontSize:'12px', color: getColor()}">
  </div>
</template>
```
```js
render() {
  return (
    <div>
      <span class={{a: true, active: isActive}} style={{fontSize:'12px', color: this.getColor()}}>
    </div>
  )
}
```

### 事件 v-on / @

对于组件元素来说，事件需要区分触发自定义事件还是触发组件DOM的原生事件。

```html
<template>
  <div>
    <input @change="onChangeHnadler" />
    <custom-component @custom="onCustomEventHandler" @click.native="onNativeClickHandler" />
  </div>
</template>
```
JSX 事件绑定以 `on` 开头，小驼峰式命名，事件处理函数包裹在大括号内。如果是 DOM 原生事件，以 `nativeOn` 开头。
```js
render() {
  return (
    <div>
      <input onChange={this.onChangeHnadler} />
      <custom-component Oncustom={this.onCustomEventHandler} nativeOnClick={this.onNativeClickHandler} />
    </div>
  )
}
```

vue 事件还有特殊的一部分：事件修饰符 和 按键修饰符。

#### 事件修饰符

vue 提供的事件修饰符包括：
- .stop
- .prevent
- .capture
- .self
- .once
- .passive

```html
<!-- 阻止事件冒泡，向上继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 取消事件默认行为，提交后不再刷新页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

大部分的事件修饰符都无法在JSX中使用，我们需要在代码中使用这些修饰符含义的原本代码去实现

```jsx
render() {
  return (
    <section>
      <div onClick={(ev) => {
        ev.stopPropagation() // 对应 stop 修饰符的作用
        ev.preventDefault() // 对应 prevent 修饰符的作用
        if (ev.target !== ev.currentTarget){ // 对应 self 修饰符的作用
          return
        }
        this.onClickHandler()
      }} >事件修饰符</div>
    </section>
  )
}
```
对于`.once / .capture / .passive / .capture.once`，如果在 vue JSX 中用原生代码实现，需要书写很多模板代码，所以 Vue 专门对 JSX 事件实现了几个前缀语法来简化业务开发的代码量：
> on 的属性写法可以查看下面的 深入理解 JSX 中内容。
```js
render() {
  return (
    <div
      on={{
        // 相当于 :click.capture
        '!click': this.$_handleClick,
        // 相当于 :input.once
        '~input': this.$_handleInput,
        // 相当于 :mousedown.passive
        '&mousedown': this.$_handleMouseDown,
        // 相当于 :mouseup.capture.once
        '~!mouseup': this.$_handleMouseUp
      }}
    ></div>
  )
}
```
#### 按键修饰符

vue 支持对事件添加按钮码或按键别名来监听键盘事件。

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
<input v-on:keyup.13="submit">
```
这类修饰符在 JSX 中需要原始代码实现
```js
render() {
  return (
    <section>
      <div onClick={(ev) => {
         if(event.keyCode === 13) {
          // 在特定键触发时才触发，执行逻辑
          this.onClickHandler()
        }
      }}>按键修饰符</div>
    </section>
  )
}
```

以上语法为早期插件 `babel-plugin-transform-vue-jsx`实现的事件 JSX 写法。

如果你使用上述方案2安装的 babel 预设 `babel-preset-jsx` 中有包含一个替代 `v-on`指令的插件`@vue/babel-sugar-v-on`，可以使用 `vOn`替换，并且可以以基本一致的方式使用事件修饰符。
```jsx
<input vOn:click={this.newTodoText} />
<input vOn:click_stop_prevent={this.newTodoText} />
```

如果使用支持 vue3 的插件 `babel-plugin-jsx` 仍然是 `on` 前缀的语法，如果需要支持 `vOn`和修饰符可以再安装插件`@vue/babel-sugar-v-on`。

#### hook 事件

当在父组件上需要监听子组件的生命周期钩子函数时，可以绑定 hook 事件。

当然，在实际业务开发中，如果是自己定义的组件，基本不需要绑定 hook 事件。我们通常通过子组件 emit 出事件。

比如需要在父组件中监听子组件渲染完成的事件：
```js
// Child 组件中
mounted() {
  this.$emit("mounted");
}
```
在父组件中可以这么写：
```html
<Child @mounted="handleFn"/>
```
但如果是第三方组件时，是没办法这样实现的。取而代之的方法就是使用 `@hook` 前缀监听组件生命周期中的钩子函数。

```html
<v-chart
  @hook:mounted="loading = false"
  @hook:beforeUpdated="loading = true"
  @hook:updated="loading = false"
  :data="data"
/>
```
那么在 JSX 中对应的写法是对事件名添加特定的前缀 `hook`
```jsx
render() {
  return (
    <v-chart
      hookMounted="handleFn"
      hookBeforeUpdated="loading = true"
      data={tthis.data}
    />
  )
}
```

### 指令

指令：可以细分类型
1. 作用于元素 DOM 内容的指令：v-text / v-html
1. 逻辑指令：v-if / v-else / v-else-if / v-for
1. 动态内容绑定指令：v-bind / v-model
1. 事件绑定指令：v-on
1. 插槽指令：v-slot

#### 作用于元素 DOM 内容的指令：v-text / v-html

- v-text
```html
<!-- v-text 指令基本不用，使用插槽 {{ }} 形式 -->
<div v-text="message"></div>
<!-- 等同于 -->
<div>{{ message }}</div>
```
```jsx
render() {
  return (
    <div>{this.message}</div>
  )
}
```

- v-html
如果变量是包含DOM标签的字符串，需要按 DOM 结构渲染，此时可以使用 `v-html` 指令。
```html
<!-- 假设 domStr = '<span>Hello JSX</span> -->
<div v-html="domStr"></div>
```
`v-html`指令对应 JSX 的需要添加特定的前缀语法 `domProps`。
```jsx
render() {
  return (
    <div domPropsInnerHTML={this.domStr}>
  )
}
```
> 所以对 `v-text` 指令也可以使用 `domPropsInnerText`，但基本不会这么写.aa-category-title

#### 逻辑指令：v-if / v-else / v-else-if / v-for

JSX 对应的逻辑指令都可以使用 JS 语法替换：

- `v-if / v-else / v-else-if` 使用三元运算符替换 `condition ? exprIfTrue : exprIfFalse`
```html
<div v-if="isShow">显示</div>
<div v-else>隐藏</div>
```
```jsx
render() {
  return (
    <div>
      { this.isShow
        ? <div>显示</div>
        : <div>隐藏</div>
      }
    </div>
  )
}
```

- `v-for` 使用数组 `map`方法替换
```html
<el-tag
 v-for="(item, index) in content"
 :key="index"
 type="success"
 >
  {{item.name}}
</el-tag>
```
数组 `map` 返回 vnode 数组，JSX 自动渲染数组内元素。
```jsx
render() {
  return (
    <div>
      {
        this.content.map((item, index) => {
          return (
            <el-tag key={ index } type="success">{ item.name }</el-tag>
          );
        })
      }
    </div>
  )
}
```

#### 动态内容绑定指令：v-bind / v-model

- `v-bind`指令或其简写形式`:`，上面已经提过，可以直接将动态内容写入大括号内。
```html
<input type="email" :disabled="isDisable" />
```
```jsx
<input type="email" disabled={this.isDisabled} />
```
- `v-model`

`v-model`指令是一个语法糖，在 vue 实现上是通过动态绑定属性 `value` 和更新该属性的事件组成。

```html
<input v-model="inputValue" />
<!-- 等效于 -->
<input :value="inputValue" @change="ev => inputValue = ev.target.value" />
```
在早期插件1 `babel-plugin-transform-vue-jsx` 绑定 `v-model` 的 JSX 写法,需要自已手动实现动态属性和事件。
```jsx
render() {
  return (
    <div>
      <input value={this.inputValue} onChange={ev => this.inputValue = ev.target.value} />
    </div>
  )
}
```
但在插件2方案中安装预设 `babel-preset-jsx` 中有包含一个替代 `v-model`指令的插件`@vue/babel-sugar-v-model`，可以使用 `vModel`替换。

```jsx
<input vModel={this.newTodoText} />
// 包括 v-model 修饰符的支持，比如 v-model.trim
<input vModel_trim={this.newTodoText} />
```

#### 自定义指令

除了上述默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。

自定义指令基本使用形式：`v-mydirective:[argument].modifier="value"`

如果只是简单的自定义指令，没有指令参数和修饰符的话，可以像 template 中一样直接书写：
```jsx
<Child v-name={value} />
}
```
但是这种方式不支持有指令参数或修饰符的自定义指令，这种情况可以使用以下变通方法：
- 将一切作为对象传入
```jsx
<Child v-name={{
  value,
  modifiers: {abc: true},
  arg: 'arg'
}} />
```
- 使用原始的 createElement 第二个参数的对象属性传入
```jsx
const directives = [
  { name: 'my-dir', value: 123, modifiers: { abc: true }, arg:'arg' }
]

return <div {...{ directives }}/>
```

如果使用支持 vue3 的插件`@vue/babel-plugin-jsx`，则支持以下写法：
```jsx
<input v-model={val} />
<input v-model={[val, ['modifier']]} />
<A v-model={[val, 'argument', ['modifier']]} /> // 如果第二个参数传入的值为字符串，则作为指令参数 arg 的值
<a v-custom={[val, 'arg', ['a', 'b']]} />
```

### 插槽

vue 插槽分为三种：默认插槽、具名插槽、作用插槽，在使用上分两步：
1. 需要在子组件声明插槽。
2. 然后在父组件调用子组件时传入插槽内容。

#### 默认插槽

- 使用 SFC 文件模板 template 时如下：
```html
<!-- 1. 子组件中定义插槽 -->
<button>
  <slot></slot>
</button>

<!-- 2. 父组件中调用子组件时传入插槽内容 -->
<Child>
  <div>该元素将作为默认插槽的内容</div>
</Child>
```

- 如果使用 JSX 定义和使用默认插槽时，如下：
```jsx
// 1. 子组件中定义插槽
<button>
  { this.$slots.default }
</button>

// 2. 使用时同原来一样
<Child>
  <div>该元素将作为默认插槽的内容</div>
</Child>
```

#### 具名插槽

- 使用 SFC 文件模板 template 时如下：
```html
<!--1. 子组件中定义插槽  -->
<button>
  <slot name="before"></slot>
  <slot ></slot>
</button>

<!-- 2. 父组件中调用子组件时传入插槽内容，在 vue 2.6 之后使用 v-slot 且只能作用于 template 元素上-->
<Child>
  <!-- <div slot="before">该元素将作为具名插槽的内容</div> -->
  <template v-slot:before>
    <div>该元素将作为具名插槽的内容</div>
  </template>
  <div>该元素将作为默认插槽的内容</div>
</Child>
```

- 如果使用 JSX 定义和使用默认插槽时，如下：
```jsx
// 1. 子组件中定义插槽
<button>
  { this.$slots.before }
  { this.$slots.default }
</button>

// 2. 使用时同原来一样
<Child>
  <div slot="before">该元素将作为具名插槽的内容</div>
  <div>该元素将作为默认插槽的内容</div>
</Child>
```

#### 作用域插槽

如果父组件调用子组件时，传入插槽的内容依赖于子组件自身的数据时，就可以用作用域插槽来定义。

不管是默认插槽还是具名插槽，都可以变成作用域插槽。

- 使用 SFC 文件模板 template 时如下：
```html
<!--1. 子组件中定义默认插槽, 对于要向上暴露的数据动态绑定到具体的 slot 标签上  -->
<button>
  <slot name="before" :named_value="obj1"></slot>
  <slot :default_value="obj2"></slot>
</button>

<!-- 2. 父组件中调用子组件时传入插槽内容 -->
<Child>
  <template v-slot:before="{named_value}">
    <div>显示具名作用域插槽暴露的数据 {{ named_value }}</div>
  </template>
    <!-- v-slot 或 v-slot:default  -->
    <template v-slot="{default_value}">
    <div>显示默认作用域插槽暴露的数据 {{ default_value }}</div>
  </template>
</Child>
```

- 如果使用 JSX 定义和使用默认插槽时，如下：
```jsx
// 1. 子组件中定义默认插槽，此时使用另一个 API: this.$scopedSlots
<button>
  { this.$scopedSlots.before({named_value:obj1}) }
  { this.$scopedSlots.default({default_value:obj2}) }
</button>
// 2. 父组件中调用子组件传入插槽内容时需要使用子组件内部暴露出的数据，此时需要在 scopedSlots 中调用
<Child 
  scopedSlots={
    {
      before: ({named_value}) => <div>显示具名作用域插槽暴露的数据 {{ named_value }}</div>
      default: ({default_value}) => <div>显示默认作用域插槽暴露的数据 {{ default_value }}</div>
    }
  }
/>

// 如果只有默认作用域插槽，也可以像下面这样写
<Child>
  {({default_value}) => <div>显示默认作用域插槽暴露的数据 {{ default_value }}</div>}
</Child>
```

总结：
从上面的示例代码来看，其它 vue 插槽更准确划分为维度是：
- 是否有命名：没有命名作为默认插槽，有命名作为具名插槽
- 是否需要向上传递数据：需要作为作用插槽，不需要作为普通插槽

从 VUE 提供给 JSX 写法的 API 来看，就分为作用域插槽和普通插槽
- 普通插槽：使用 `this.$slots`，对象属性值为 Vnode 对象
- 作用域插槽：使用 `this.$scopedSlots`, 对象属性值是一个函数，函数入参即为传递的数据

参考链接：
- [vue 的 jsx 写法获取作用域插槽的写法](https://stackoverflow.com/questions/65504104/how-to-get-vue-slot-property-in-jsx)
- [$slots 和 $scopedSlots 区别](https://blog.csdn.net/guzhao593/article/details/89219229)

## Deep: 深入理解 JSX

- render
- createElement h

### 理解 render　函数

在 Vue 项目中使用 SFC (.vue 单文件组件)进行开发，在 SFC 中，组织 HTML 代码有以下几中方式：
1. `<template>` 模板
1. `options.template` 属性（较少使用）
1. `options.render`属性

从源码上看，render 属性优先级最高。并且 template 模板也最终会经过编译转为 render　属性的值。
1. options.render 是否有值，有直接用，无则判断是否有 template
1. options.template 是否有值，有解析 template，无则判断是否有 el
1. options.template 是否是字符串，如果是，字符串是否是以 # 开头，如果不是以　# 开头，就是纯字符串直接返回
1. options.template 字符串且以 # 开头，则调用 idToTemplate 拿到值
```js
var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el);

  /* 挂载点元素不能是 body 或者 document */
  if (el === document.body || el === document.documentElement) {
    warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  // 解析模板，然后编译成 render　渲染函数
  if (!options.render) { // 如果不存在 render
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (!template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) { // template 属性直接是 DOM 元素
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) { // 没有 template 属性，获取挂载点内的 html 节点
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (config.performance && mark) {
        mark('compile');
      }

      // 如果 template 值存在，则进行模板解析，得到渲染函数，赋值给 render 属性。
      var ref = compileToFunctions(template, {
        outputSourceRange: "development" !== 'production',
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      // 模板编译的结果赋值到 options.render 属性上。
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};
```
在源码中，模板编译的核心函数：
```js
function baseCompile (template, options) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}
```
主要功能有三部分：
1. parse 函数将模板解析为 AST，属性于解析器功能
1. optimize 函数遍历 AST 标记为静态节点，属性优化器功能
1. generate 函数使用 AST 生成渲染函数，属性代码生成器功能

我们使用一段简单的模板代码，看下编译后赋值给 options.render 的值是什么？
```js
// 假设 template　内容
template: `<div ic="test" @click="onClick">{{message}}</div>`

// 经过编译后
options.render = `with(this){return _c('div',{attrs:{"id":"test"},on:{"click":onClick}},[_v(_s(message))])}`
```
可以看到在源码中，render 是一个 with 语句，它的执行结果返回的是一个函数 `_c`。它是在 Vue 初始化函数定义的：
```js
Vue.prototype._init = function (options) {
  // 省略代码
  var vm = this;
  initRender(vm); // 挂载 $attrs/$listeners，以及绑定 _c / $createElement
}
function initRender (vm) {
  // 省略代码

  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
  
  // 省略代码
}
```
所以说， render 的值是 `createElement` 函数调用的结果。

上面是源码层面代码，对应的开发者使用时，我们直接在 render 函数中编写 JSX 时，render 函数的形参就是 createElement 函数，通常会通过 `const h = createElement` 赋值，简写成 h 函数。

```js
export default {
  render(h) {
    h('div', null, ['Hello JSX'])
  }
}
```
那为什么我们在上面示例代码中都没有传入 h 参数呢
```jsx
render() {
  return (
    <div>
      <input value={this.inputValue} onChange={ev => this.inputValue = ev.target.value} />
    </div>
  )
}
```
这是因为插件 [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx) 解析 JSX 语法时会自动注入 h 函数。
> 从3.4.0版开始，只要使用ES2015语法中声明的任何方法和getter(不是函数或箭头函数)中，只要有JSX，我们自动注入const h = this.$createElement。这样在使用时就可以删除(h)参数。

```js
// 符合 ES2015 语法规范声明的函数才会自动注入 h
Vue.component('jsx-example', {
  render () { // h will be injected
    return <div id="foo">bar</div>
  },
  myMethod: function () { // h will not be injected
    return <div id="foo">bar</div>
  },
  someOtherMethod: () => { // h will not be injected
    return <div id="foo">bar</div>
  }
})

@Component
class App extends Vue {
  get computed () { // h will be injected
    return <div id="foo">bar</div>
  }
}
```

### 理解 createElement 函数

为什么说 JSX 只是语法糖呢，并且并不需要 JS 引擎去实现解析，而只需要通过 Babel 插件实现呢。

因为任何 JSX 语法都会转换为 h 函数，交于 js 引擎去执行。

```js
// JSX 语句
<div id="foo">{this.text}</div>

// 会被转换成
h('div', {
  attrs: {
    id: 'foo'
  }
}, [this.text])
```

vue 2.x 官网上有对 [createElement](https://cn.vuejs.org/v2/guide/render-function.html)函数的详细介绍：
```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者执行返回 String 或 组件选项对象的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中属性 attribute、props 或事件对应的数据对象。可选。没有时可填入 null
  {
    // (详情见下一段)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '可以是字符',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```
对于 `createElement`函数的第二个参数对象，主要有以下属性：
```js
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'calss': 'string'
  'class': {
    foo: true,
    bar: false
  },
  'calss': ['string', {foo:true}],

  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },

  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },

  // 组件 prop
  props: {
    myProp: 'bar'
  },

  // DOM property
  domProps: {
    innerHTML: 'baz',
    innerText: 'string',
  },

  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器，需要在处理函数中手动检查 keyCode，或者实现 stop prevent 代码。
  on: {
    click: this.clickHandler,
    // 相当于 :click.capture
    '!click': this.$_handleClick,
    // 相当于 :input.once
    '~input': this.$_handleInput,
    // 相当于 :mousedown.passive
    '&mousedown': this.$_handleMouseDown,
    // 相当于 :mouseup.capture.once
    '~!mouseup': this.$_handleMouseUp
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 仅用于组件，监听子组件生命周期钩子函数
  hook: {
    mounted: fn
  }

  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue` 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],

  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```
因为插件支持 JSX Spread 功能，会智能地合并嵌套的数据属性。所以 JSX 中也可以像 createElement 函数一样传入第二个函数一样的数据对象。

```js
// 常用写法
<Child
  id: 'child'
  ref='Child'
  class='custom-class'
  style={{fontSize:'12px'}}
  customProp={this.customProp}
  onChnage={this.handleChange}
  scopedSlots={
    {
      before: ({named_value}) => <div>显示具名作用域插槽暴露的数据 {{ named_value }}</div>
      default: ({default_value}) => <div>显示默认作用域插槽暴露的数据 {{ default_value }}</div>
    }
  }
  v-name={{
    value,
    modifiers: {abc: true},
    arg: 'arg'
  }}
>

// 可以如下面这样
const options = {
  'class': 'custom-class',
  style: {fontSize:'12px'}
  attrs: {id: 'child'},
  props: {customProp: this.customProp},
  on: {
    change: this.handleChange,
  },
  scopedSlots: {
    before: ({named_value}) => <div>显示具名作用域插槽暴露的数据 {{ named_value }}</div>
    default: ({default_value}) => <div>显示默认作用域插槽暴露的数据 {{ default_value }}</div>
  }
  directives = [
    { name: 'my-dir', value: 123, modifiers: { abc: true }, arg:'arg' }
  ]
}

<Child {...options} />
```
因为插件[@vue/babel-helper-vue-jsx-merge-props](https://github.com/vuejs/jsx/tree/dev/packages/babel-helper-vue-jsx-merge-props)提供的支持，两种方法可以混用：
```js
const data = {
  class: ['b', 'c']
}
const vnode = <div class="a" {...data}/>

// 结果是
{ class: ['a', 'b', 'c'] }
```

- [如何在 Vue 中使用 JSX 以及使用它的原因](https://juejin.cn/post/6844904061930586125#heading-1)
- [学会使用 Vue JSX, 一车老干妈都是你的](https://xie.infoq.cn/article/6af7782f35bfe69f25548470e)
- [vue 的 jsx 写法记录](https://segmentfault.com/a/1190000020436220)
- [vue 的 jsx 写法获取作用域插槽的写法](https://stackoverflow.com/questions/65504104/how-to-get-vue-slot-property-in-jsx)