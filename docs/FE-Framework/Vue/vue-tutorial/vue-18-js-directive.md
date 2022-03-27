# 22 directives

在讲解视图层指令时，我们讲到`ref`特性，使用它我们可以获取当前`DOM`元素对象，以便执行相关操作。
```html
<div id="app">
    <input ref="ipt" type="text" v-model="value" />
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        value: ''
    },
    methods: {
        handleEle() {
            let ele = this.$refs.ipt
            // do somthing
        }
    }
})
```
如果某个`DOM`操作在不同组件的元素或组件内多个元素都需要执行，像这样在每个组件里都重复写一遍处理逻辑代码肯定不是好办法。此时我们可以自定义一个指令，在指令钩子函数的回调里复用逻辑代码。

其时，自定义指令的思想还是代码复用的想法，同组件、混入、函数思想一样。

## 基本使用
根据指令使用范围的不同，你可以将指令定义在全局作用域、实例作用域或单个组件作用域内。
```js
// 在vue全局作用域
vue.directive('name', {
    bind: function (el, binding,vnode){/* do something */},
    inserted: function (el, binding,vnode){/* do something */},
    update: function (el, binding,vnode, oldVnode){/* do something */},
    componentUpdated: function (el, binding,vnode, oldVnode){/* do something */},
    unbind: function (el, binding,vnode){/* do something */},
})

// 在实例作用域中
var vm = new Vue({
    directives: {
        'name': {
            bind: function (el, binding,vnode){/* do something */},
            inserted: function (el, binding,vnode){/* do something */},
            update: function (el, binding,vnode, oldVnode){/* do something */},
            componentUpdated: function (el, binding,vnode, oldVnode){/* do something */},
            unbind: function (el, binding,vnode){/* do something */},
        }
    }
})

// 在组件作用域中
export default {
    directives: {
        'name': {
            bind: function (el, binding,vnode){/* do something */},
            inserted: function (el, binding,vnode){/* do something */},
            update: function (el, binding,vnode, oldVnode){/* do something */},
            componentUpdated: function (el, binding,vnode, oldVnode){/* do something */},
            unbind: function (el, binding,vnode){/* do something */},
        }
    }
}
```

## 指令钩子函数

其中，指令有多个钩子函数，正如`vue`实例和组件有生命周期钩子函数一样。它们有不同的命名，和不同触发时机。
- `bind`： 钩子函数会在指令绑定到元素时调用。只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：钩子函数会在绑定的元素被添加到父节点时调用。但是和`mounted`一样，此进还不能保证元素已经被添加到父节点上（仅保证父节点存在）。可以使用`this.$nextTick`来保证这一点。
- `update`：钩子函数在绑定该指令的组件`vnode`节点被更新时调用，但是该组件的子组件的`vnode`可能此时还未更新。但是你可以通过比较更新前后的值（`vnode`, `oldVnode`）来忽略不必要的模板更新 (详细的钩子函数参数见下)
- `componentUpdated`：钩子函数会在组件的 VNode 及其子组件的 VNode 全部更新后调用。
- `unbind`：钩子函数用于指令的拆除，只调用一次，当指令从元素上解绑时调用。

但不是每次自定义指令的时候需要调用所有钩子，事实上，它们都是可选的，你可以根据自定义指令的需求确定指令回调函数执行的时机，来绑定特定的时机的钩子上。基本最常用的就是`bind`和`update`。针对最常用的有简写的方式，直接传入一函数，但不建议，代码中最好明确指令绑定的钩子。

### 钩子函数的参数

五个钩子的回调函数都包含3个参数`el`、`binding`、`vnode`。其中`update`和`componentUpdate`钩子函数包含第4个参数`oldVnode`。
```js
vue.directive('name', {
    bind: function (el, binding, vnode){/* do something */},
    inserted: function (el, binding, vnode){/* do something */},
    update: function (el, binding, vnode, oldVnode){/* do something */},
    componentUpdated: function (el, binding, vnode, oldVnode){/* do something */},
    unbind: function (el, binding, vnode){/* do something */},
})
```
我们通过一个自定义指令例子来理解每个参数具体的含义：
指令的使用都需要加上`v`,并且以`-`连字符连接。如`v-name`、`v-my-name`。
```html
<div v-my-directive:example.one.two = 'someExpression'>自定义指令示例<div>
```
```js
 // 全局注册
vue.directive('my-directive', {
    bind: function (el, binding, vnode){/* do something */},
})
```
- `el`：指令所绑定的`DOM`元素，可以用来直接操作`DOM`对象。
- `vnode`: `Vue`编译生成的虚拟节点，具体`API`见下文。
    - **`vnode.context`来获取当前指令所处的上下文对象`this`，这个属性很有用**，
    - `vnode.ele`来获取该节点元素，但必须在`vnode.context.$nextTick(() => console.log(vnode.elm.parentNode))`得到保证。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。
- `binding`：对象，包含以下该指令的相关属性。具体如下：
    - `name`：指令的名称，但不包含`v-`部分，在上例中值为`my-directive`。
    - `arg`：指令的参数，即`example`。
    - `modifiers`: 对象，指令的修饰符对象。即`{one:true, two:true}`。
    - `expression`： 指令表达式的字符串形式。即`"someExpression"`。
    - `value`： 指令表达式计算的结果，即`value = someExpression`。如果`data`对象中`。{someExpression: (3/4).toFixed(2)`,则`value = o.75`。
    - `oldVlue`：指令上一次的`value`值。它只在`update` 和 `componentUpdated` 钩子中可用。

## 文件的组织

一般我们使用指令，也就是因为有频繁操作，所以在项目中一般都是全局注册。在项目`src`文件中定义一个`directives`文件夹，新建一个`index.js`
```js
import Vue from 'vue'

var hasPerm = {
    bind(el, binding, vnode){
        let permissionList = vnode.context.$route.meta.permission

        if(!permissionList){
            console.error(`权限判断不生效。因路由中不包含permission字段，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
            return
        }
        if(typeof (permissionList) != "object" || !permissionList.length){
            console.error(`权限判断不生效。因路由中permission字段非数组类型或内容为空，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
            return
        }
        if(!permissionList.includes(binding.value)){
            el.parentNode.removeChild(el)
        }
    }
}

var directives = {
    hasPerm
}

for (item in directives) {
    Vue.directive(item, directives[item])
}

export default Vue
```
```js
// 在main.js文件导入
import './filters/install'
```

或者将自定义指令写成插件形式，注册到`Vue`中
```js
const hasPermission = {
    install: function (Vue){
        Vue.directive('hasPermission', {
            bind(el, binding, vnode){
                let permissionList = vnode.context.$route.meta.permission
                if(!permissionList){
                    console.error(`权限判断不生效。因路由中不包含permission字段，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
                    return
                }
                if(typeof (permissionList) != "object" || !permissionList.length){
                    console.error(`权限判断不生效。因路由中permission字段非数组类型或内容为空，请检查路由表设置。当前路由地址：${vnode.context.$route.path}`)
                    return
                }
                if(!permissionList.includes(binding.value)){
                    el.parentNode.removeChild(el)
                }
            }
        })
    }
}

export default hasPermission
```
```js
// 所有自定义的插件都在plugins文件夹的install.js完成注册
import Vue from 'vue'
import hasPermission from './hasPermission'

const Plugins = [
    hasPermission
]

// 全局注册插件
Plugins.map((plugin) => {
    Vue.use(plugin)
})

export default Vue
```

```js
// 在main.js文件导入
import './plugins/install'
```

## 扩展知识：`vnode API`
`vnode`参数
```js
// 源码路径： vue/scr/vnode/vnode.js
export default class VNode {
    // outer
    tag: string | void;
    data: VNodeData | void;
    children: ?Array<VNode>;
    text: string | void;
    elm: Node | void;
    ns: string | void;
    context: Component | void; // rendered in this component's scope
    key: string | number | void;
    componentOptions: VNodeComponentOptions | void;
    componentInstance: Component | void; // component instance
    parent: VNode | void; // component placeholder node

    // strictly internal
    raw: boolean; // contains raw HTML? (server only)
    isStatic: boolean; // hoisted static node
    isRootInsert: boolean; // necessary for enter transition check
    isComment: boolean; // empty comment placeholder?
    isCloned: boolean; // is a cloned node?
    isOnce: boolean; // is a v-once node?
    asyncFactory: Function | void; // async component factory function
    asyncMeta: Object | void;
    isAsyncPlaceholder: boolean;
    ssrContext: Object | void;
    fnContext: Component | void; // real context vm for functional nodes
    fnOptions: ?ComponentOptions; // for SSR caching
    devtoolsMeta: ?Object; // used to store functional render context for devtools
    fnScopeId: ?string; // functional scope id support

    // ... 其它代码
}
```
