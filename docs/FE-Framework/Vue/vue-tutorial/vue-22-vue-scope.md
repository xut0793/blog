# 11 vue 作用域

目录
- 全局作用域：`Vue`对象
    - 全局api
- 局部作用域：
    - 实例对象`vm`
        - 实例api
    - 组件`component`
        - 组件配置选项

```
在引入Vue文件时，就相当于拥有了一个全局Vue对象。
在var vm = new Vue(option)时，就相当于创建了一个实例对象vm
在注册一个组件后，就相当于创建了一个组件对象。
```

全局`Vue`对象的属性和方法能被所有实例对象共享，或者说继承。全局API调用是`Vue`打点调用。形式是：`VUE.directive`、`VUE.filter`。

一个页面中可以创建多个实例对象，比如`var test = new Vue()`、`var example = new Vue()`。实例对象的api是经过vue特定封装的，以`$`开始。形式是：`test.$filter` 、`example.$data`。

定义在组件内部的属性只限组件内使用。使用`Vue.component()`注册时为全局组件，可以被所有实例对象使用。在`var test = new Vue({components:header})`注册的组件为实例对象test内的局部组件，只能被test实例对象内部使用，不能被其它实例对象使用。

在组件内声明的属性或方法，可以直接用指向当前组件对象的`this`打点调用，形式如`this.filter`、`this.message`。此时的`this`也可调用当前组件所属实例对象中的属性和方法，但必须`$`开头，`this.$options`、`this.$data`。

