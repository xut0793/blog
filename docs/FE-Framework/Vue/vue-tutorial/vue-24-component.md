# 24 component 组件

1. **组件的概念**

    Vue 组件同时也都是 Vue 实例，可接受相同的选项对象`option` (除了一些根级特有的选项) 和使用相同的生命周期钩子，以及模板调用方式。

1. **组件的构建和注册**

    - 构建：`com = Vue.extend(option)`
    - 注册：
        - 全局注册：`Vue.component('my-com', com)`
        - 局部注册：`vm.components: {'my-com': com}`
    - 语法糖： `Vue.component('my-com',option)`   `vm.components('my-com': option)`
    - 组件命名规范

1. **组件三大API： `prop`  /  `event`  /  `slot`**

    **prop**

    - 字符串数组形式： `props: ['prop1', 'prop2', ...]`
    - 对象形式： 
        ```js
        props: {prop1: Number}
        props: {
            prop1: {
                type: [Number, String],
                required: true,
                default: 100,  //当默认值是对象或数组时，必须从函数返回值获取 () => { return value }
                validator: (value) => {
                    // do somethings  return Boolean
                    return result
                }
            }
        }
        ```
    - prop的命名规范
    - 动态prop（除字符串外，其它类型传入都需要使用动态prop，即v-bind绑定）
    - 单向数据流和prop实现双向绑定.sync修饰符
    - 非prop特性
        - 被替换或合并
        - 禁用继承 `inheritAttr: false`
        - `$attr`

    **event**

    - `v-on  /  $on` 监听事件
    - `$once`  一次性事件
    - `$emit` 触发事件
    - `$off`  卸载事件监听
    - `$listeners` v-on绑定监听器集合（除原生监听事件）
    - `.native` 原生事件修饰符
    - `.sync`  双向绑定修饰符
    - `model` 属性

    **slot**

    - 普通插槽 
        ```html
        <slot></slot>
        ```
    - 插槽提供默认值 
        ```html
        <slot>default content</slot>
        ```
    - 具名插槽 
        ```html
        <slot name="someName"></slot>
        <!-- 组件调用 -->
        <my-com>
            <template v-slot:somName></template>
        <my-com>
        ```
    - 作用域插槽 
        ```html
        <slot :prop="value"></slot>
        <!--组件调用 -->
        <my-com>
            <template v-slot='childValue'>{{ cilidValue.value}}</template>
        </my-com>
        ```
    - 独占默认插槽的写法
        ```html
        <some-component v-slot="childValue"> {{ childValue.value }}</some-component>
        <some-component v-slot:default="childValue"> {{ childValue.value }}</some-component>
        ```
    - 解构插槽prop
        ```html
        <my-com v-slot="{value}">{{ value }}</my-com>
        <!-- 重命名 -->
        <my-com v-slot="{value: otherName}">{{ otherName }}</my-com>
        <!-- 重命名并提供默认值 -->
        <my-com v-slot="{value: {otherName: defaultValue}}">{{ otherName }}</my-com> 
        ```
    - 动态插槽名
        ```html
        <my-com>
            <template v-slot:[dynamicSlotName]></template>
        </my-com>
        ```
    - `v-slot` 的简写 `#`
        ```html
        <my-com>
            <template #somName></template>
        <my-com>
        ```
    - 模板编译作用域
    父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

1. **组件依赖注入**
    - `provide`
    - `inject`

1. **组件实例的引用**
    - `ref / $refs`
    - `$root`
    - `$parent`
    - `$children`
    - `自定义扩展方法`

1. **组件间的通信**
    - 父子组件通信 `prop / $emit`
    - 嵌套组件 `$attrs` / `$liteners`
    - 后代组件通信 `provide / inject`
    - 组件实例引用 `$root` / `$parent` / `$children` / `$refs`
    - 事件总线 `const Bus = new Vue()`
    - 状态管理器 `Vuex`

1. **动态组件`<component is="com-name"></component>`**

1. **异步组件`function`**

1. **内置组件`transiton` / `keep-alive` / `component`**

1. **其它**
    - 组件的递归调用
    - 组件的循环引用
    - `v-once`创建静态组件

