# 33 vue内置过渡组件transition

目录
- 什么是过渡
- 基本过渡或动画实现的语法
    - css过渡动画：transition / animation
    - js过渡：特定事件钩子函数
- 各种情形下的过渡实现，使用`<transition>`
    - 初始渲染过渡动画, appear
    - 单个元素的条件渲染（v-if/v-show)过渡动画
    - 多个元素的条件渲染，指定key、mode
    - 动态组件切换过渡动画，指定mode
    - 列表元素同时渲染，使用`<transition-group`，指定tag,key
    - 过渡效果的复用，包装成组件
- 状态过渡
    - 数值，结合watch和TweenMax
    - 使用colorjs和Tween.js
    - 包装成组件
- `<transition>`的属性prop:
  - name - string，用于自动生成 CSS 过渡类名。例如：name: 'fade' 将自动拓展为.fade-enter，.fade-enter-active等。默认类名为 "v"
  - mode - string，控制离开/进入的过渡时间序列。有效的模式有 "out-in" 和 "in-out"；默认同时生效。
  - enter-class - string
  - enter-active-class - string
  - enter-to-class - string
  - leave-class - string
  - leave-active-class - string
  - leave-to-class - string
  =====================
  - appear - boolean，是否在初始渲染时使用过渡。默认为 false。
  - appear-class - string
  - appear-active-class - string
  - appear-to-class - string
  ==========================
  - css - boolean，是否使用 CSS 过渡类。默认为 true。如果设置为 false，将只通过组件事件触发注册的 JavaScript 钩子。
  - @before-enter
  - @enter
  - @after-enter
  - @enter-cancelled
  - @before-leave
  - @leave
  - @after-leave
  - @leave-cancelled (v-show only)
  - @before-appear
  - @appear
  - @after-appear
  - @appear-cancelled
- `<transition-group tag="">`其它prop同`<transition>`

这里只是把内容和概念整理成更易理解和记忆的知识脉路，官方文档在这一节内容提供了非常详细的示例说明，就不重复写示例了。
**[各种示例请点击查看官方文档](https://cn.vuejs.org/v2/guide/transitions.html)**
## 什么是过渡
过渡是元素的某个属性由一个值（状态）平滑转变到另一个值（状态），避免界面突然变化。

通常CSS的属性值的改变都是立即更新的，即从旧值立即改变到新值，而CSS的`transition`属性则提供了方法帮助实现CSS属性值的平滑转换，或者`animation`属性实现自定义动画的形式完成状态改变。

vue提供了两种类型的过渡或动画，
- 使用`transition`组件实现元素或组件的过渡和动画
- 使用外部库实现数据状态的过渡和动画

## `transition`内置组件实现元素/组件的过渡或动画
vue内部封装了一个实现过渡或动画的组件`transition`，被它包裹的元素或组件会在插入，更新或者移除DOM元素时应用过渡或动画效果。

**过渡或动画触发的情形**
在vue中出现元素插入、更新或者移除的情形有以下几种，也就是说`transition`组件包裹的元素出现以下几中情形时，将应用过渡或动画效果：
- 初始渲染时
- 条件渲染（v-if / v-show）
- 动态组件 component配合is特性切换组件
- 列表渲染（v-for)

**过渡或动画的实现方式**
`transition`组件要实现过渡或动画的方式有两种：
- 绑定特定的CSS类名
- 绑定特定的JS事件


**特定的CSS类名钩子**
在进入/离开的过渡或动画中，会有 6 个 class 切换，然后在特定的类中使用CSS的`transition`属性实现过渡效果，使用CSS3的`animation`属性实现动画的效果。

- v-enter
- v-enter-active
- v-enter-to
=========
- v-leave
- v-leave-active
- v-leave-to

具体过程：

- `v-enter：`定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
- `v-enter-active：`定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类中可以使用`transition / animation`属性定义进入进入过渡的过程时间，延迟和曲线函数。
- `v-enter-to:` 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
- v-leave: 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除
- `v-leave-active：`定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类中可以使用`transition / animation`属性定义进入离开过渡的过程时间，延迟和曲线函数。
- `v-leave-to:` 2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。

![CSS过渡或动画的6个类钩子过程](../image/transition.png)

上面的v代表`transition`组件的`name`的值。如`<transition name="my-transition">`，那么 v-enter 会替换为 my-transition-enter

**自定义钩子类名，结合第三方动画库**
`transition`组件除了提供prop除了`name`，还有以下自定义钩子类名的属性：
- enter-class
- enter-active-class
- enter-to-class (2.1.8+)
================
- leave-class
- leave-active-class
- leave-to-class (2.1.8+)

**补充CSS3属性`transition / animation`语法**
```css
transition: property duration timing-function delay;

transition-property: 设置要使用过渡效果的 CSS 属性的名称。;
transition-duration: 规定完成过渡效果需要多少秒或毫秒，必须设置，否则时长为 0，就不会产生过渡效果。
transition-timing-function：规定速度效果的速度曲线，值可以为：linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier(n,n,n,n)。
transition-delay：定义过渡效果何时开始。
```

```css
animation: name duration timing-function delay iteration-count direction;

animation-name: 规定需要绑定到选择器的 keyframe 名称。
animation-duration: s/ms 规定完成动画所花费的时间，以秒或毫秒计,默认0。
animation-timing-function: 	规定动画的速度曲线,值可以为：linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier(n,n,n,n)，默认ease。
animation-delay: s/ms 规定在动画开始之前的延迟，默认0。
animation-iteration-count: n / infinite 规定动画应该播放的次数，默认1。
animation-direction: normal / alternate 规定是否需要轮流反向播放动画，默认normal。

@keyframes animationname {keyframes-selector {css-styles;}}
animationname: 动画名称
keyframes-selector： 动画时长的百分比，可以是0-100% 或from（与 0% 相同）和to（与 100% 相同）
css-styles： 一个或多个合法的 CSS 样式属性。如{top:0px; background:red; width:100px;}
```

**js过渡事件钩子**
事件名：
- before-enter
- enter
- after-enter
- enter-cancelled
=================
- before-leave
- leave
- after-leave
- leave-cancelled

每个事件处理函数都有参数el,其中enter / leave处理函数还有参数done，它是一个函数参数。
```js
methods: {
    // --------
    // 进入中
    // --------
    beforeEnter: function (el) {/*do something*/},
    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    enter: function (el, done) {/*do something*/ done()},
    afterEnter: function (el) {},
    enterCancelled: function (el) {/*do something*/},

    // --------
    // 离开时
    // --------
    beforeLeave: function (el) {/*do something*/},
    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    leave: function (el, done) {/*do something*/done()},
    afterLeave: function (el) {/*do something*/},
    // leaveCancelled 只用于 v-show 中
    leaveCancelled: function (el) {/*do something*/}
}
```

当需要在js事件钩子中定义元素过渡的css属性，但又避免style中定义css的影响，可以绑定`v-bind:css='false'`，指明忽略style中CSS的应用。

### 过渡/动画在各种不同情形下的实现
**初始渲染 appear**
当对元素初始渲染时应用过渡或动画，可以使用单独提供的特性appear
```
// css类
<transition appear><!-- ... --></transition>
.appear
.appear-active
.appear-to

// 自定义类名
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>

// js事件钩子
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```
**单个元素/单个组件的（v-if / v-show)**
- 使用基本`<transition>`的css类或js事件的方式即可

**多个元素时切换时（同一时间渲染多个节点中的一个）**
- 相同标签元素的切换，设置`key`
- 为避免A元素的离开和B元素的进入同时发生，设置过渡模式`mode='in-out / out-in'`

**多个组件切换时（同一时间渲染多个节点中的一个）**
- 尽量使用动态组件`<component is="">`写法
- 仍然要设置过渡模式`mode="out-in / in-out"`

**列表的过渡（同一时间渲染多个节点）**
使用`<transition-group name="" tag="">`
- `<transition>`同`<template>`一样并不会渲染实际元素，但是`<transition-group>`会渲染成一个真实的DOM元素。所以可以用tag标签指定渲染成某类元素。缺少默认为span元素。
- 内部元素必须指定唯一的key
- 过渡模式mode特性不可用。

## 复用过渡
就是说将用transition包裹实现了过渡效果的组件，再重新定义成一个组件，以`<transition>或<transition-group>`为根组件即可。

### 状态过渡动画

对可以以数值形式存储，或者可以转换为数值的数据，结合 Vue 的响应式和组件系统`watch / computed`，结合第三方库来实现切换元素的过渡动画。
这类数据包括：
- 数字和运算
- 颜色的显示
- SVG 节点的位置
- 元素的大小和其他的属性

**使用watch监听器和第三个方动画插件结合**
比如数字类动画插件`TweenMax`
颜色`Color.js`结合补间动画`Tween.js`





