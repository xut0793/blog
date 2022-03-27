# 34 vue内置缓存组件keep-alive

`<keep-alive>`标签内包裹的组件切换时会缓存组件实例，而不是销毁它们。避免多次加载相应的组件,减少性能消耗。并且当组件在 `<keep-alive>`内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

- include  字符串或正则表达式。只有名称匹配的组件会被缓存。
- exculde  字符串或正则表达式。任何名称匹配的组件都不会被缓存。
================
- activated 缓存组件激活时触发
- deactivated 缓存组件失活时触发

**`<keep-alive>`包裹的组件内要求同时只有一个组件被渲染**

## 基本使用
```html
<!-- 基本 -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

<!-- 和 `<transition>`过渡动画 一起使用 -->
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
```

## 条件缓存`include / exclude`
- 匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称 (父组件 components 选项的键值)。匿名组件不能被匹配。
- include 和 exclude 属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：

```html
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>

<!-- 结合vuex动态修改cacheComponents数组变量实现动态判断 -->
<keep-alive :include="cacheComponents">
  <router-view></router-view>
</keep-alive>

<!-- 结合this.$route.meta条件判断 -->
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```

## keep-alive生命周期钩子函数：activated、deactivated
包含在`<keep-alive>`中创建的组件，会多出两个生命周期的钩子: `activated `与 `deactivated`。
只有组件被 keep-alive 包裹时，这两个生命周期才会被调用，如果作为正常组件使用，是不会被调用，以及在 2.1.0 版本之后，使用 exclude 排除之后，就算被包裹在 keep-alive 中，这两个钩子依然不会被调用！另外在服务端渲染时此钩子也不会被调用的。

**什么时候获取数据**
使用 keep-alive 会将数据保留在内存中，如果要在每次进入页面的时候获取最新的数据，需要在activated阶段获取数据，承担原来created钩子中获取数据的任务。
当引入keep-alive 的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated。

我们知道 keep-alive 之后页面模板第一次初始化解析变成HTML片段后，再次进入就不在重新解析而是读取内存中的数据，即，只有当数据变化时，才使用VirtualDOM进行diff更新。故页面进入的数据获取应该在activated中也放一份。数据下载完毕手动操作DOM的部分也应该在activated中执行才会生效。

所以，应该activated中留一份数据获取的代码，或者不要created部分，直接将created中的代码转移到activated中。


## 具体实践
[https://www.cnblogs.com/wangmaoling/p/9803960.html](https://www.cnblogs.com/wangmaoling/p/9803960.html)
[https://www.cnblogs.com/wangmaoling/p/9826063.html](https://www.cnblogs.com/wangmaoling/p/9826063.html)
