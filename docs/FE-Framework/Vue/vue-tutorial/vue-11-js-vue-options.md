# 14 new Vue(options)中option配置项

2019-4-14

Vue的核心是`数据驱动`，在`template`中实现视图逻辑，在`javascript`中实现业务逻辑。要通过模板`template`将数据显示在页面上，需要使用指令来实现。

在前面我们已经总结了模板中指令的相关内容。从现在开始，我们关注`javascript`业务逻辑层。也是就是数据驱动中数据来源和处理。

Vue在实例创建过程中，通过options配置对象传入数据。vue核心层viewModel部分会解析处理这个配置对象，使之能够关联模板，实现数据驱动的效果。

我们先看下在构建一个实例new Vue(options)中传入的options对象基本包含哪些内容：
```html
<div id="app"></div>
```
```js
var APP = new Vue({
    // 挂载点
    el: "#app",
    // 模板的依赖：组件、自定义指令、过滤器
    components: {},
    directives: {},
    filters: {},
    // 需合并的外部选项：混入
    mixins: {},
    // 本地状态响应式选项：数据、计算属性
    data: {},
    computed: {},
    // 响应式状态触发回调：监听器
    watch: {},
    // 生命周期函数：实例创建各阶段的回调
    beforeCreate: function () {},
    created: function () {},
    beforeMount: function () {},
    mounted: function () {},
    beforeUpdate: function () {},
    updated: function () {},
    activated: function () {},
    deactivated: function () {},
    beforeDestory: function () {},
    destoryed: function () {},
    // 事件处理函数：方法
    methods: {},
    // 声明式渲染：template/render 二选一
    template: `<div>
        <div>日期：{{ day | formatTimestampToDate }}</div>
        <button type="button" @click="addOneDay">add one day</button>
    </div>
    `,
    render: h => h(), //渲染：与template 二选一
})
```
> 上面选项顺序遵守`vue`官方推荐,具体查看[vue编码风格指南](https://cn.vuejs.org/v2/style-guide/#%E7%BB%84%E4%BB%B6-%E5%AE%9E%E4%BE%8B%E7%9A%84%E9%80%89%E9%A1%B9%E7%9A%84%E9%A1%BA%E5%BA%8F-%E6%8E%A8%E8%8D%90)

后面我们对配置对象`options`进行理解：
1. [`el:''` 挂载点]()
1. [`components: {}` 组件]()
1. [`directives: {}` 自定义指令](https://www.cnblogs.com/webxu20180730/p/10891658.html)
1. [`filters: {}` 过滤器](https://www.cnblogs.com/webxu20180730/p/10891616.html)
1. [`mixins: {}` 混入](https://www.cnblogs.com/webxu20180730/p/10891639.html)
1. [`data: {}` 数据](https://www.cnblogs.com/webxu20180730/p/10891560.html)
1. [`computed: {}` 计算属性](https://www.cnblogs.com/webxu20180730/p/10891568.html)
1. [`watch: {}` 监听器](https://www.cnblogs.com/webxu20180730/p/10891604.html)
1. [`methods: {}` 方法](https://www.cnblogs.com/webxu20180730/p/10891585.html)
1. [`template: ''` 模板](https://www.cnblogs.com/webxu20180730/p/10890790.html)
1. [`render()` 函数渲染](https://www.cnblogs.com/webxu20180730/p/10890790.html)
