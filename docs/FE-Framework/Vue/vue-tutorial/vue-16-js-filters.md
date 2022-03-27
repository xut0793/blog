# 19 filters

- 基本使用
    - 仅限在插值`{{}}`和`v-bind`指令中使用
    - 管道符`|`分隔
    - 链式调用
    - 传入参数
- 全局注册和局部注册
- 纯函数性质（不能使用`this`）

## 基本使用

我们看下之前用计算属性实现的例子,用过滤器实现

```html
<!-- 假设后端返回的价格单位是分，显示格式要求¥0.00元 -->
<!-- expression -->
<div>price：¥ {{ (price / 100).toFixed(2) }}元</div>
<!-- computed -->
<div>price: {{ total }}</div>


<!-- filter -->
<div>price: {{ price | formatPrice1 }}</div>
<!-- filter with argument -->
<div>price: {{ price | formatPrice2('￥') }}</div>
<!-- filter by chain call -->
<div>price: {{ price | formatPrice3 | symbolType('￥') }}</div>
```
```js
new Vue({
    el: "#app",
    data: {
        price: 100,
        memorySetterList: [],
    },
    computed: {
        total() {
            return `￥ ${(this.price / 100).toFixed(2)}元`
        }
    },
    filters: {
        formatPrice1(price) {
            return `￥ ${(this.price / 100).toFixed(2)}元`
        },
        formatPrice2(price,symbol) {
            return `${{symbol}} ${(this.price / 100).toFixed(2)}元`
        },
        formatPrice3(price) {
            return `${(this.price / 100).toFixed(2)}`
        },
        symbolType(price,symbol) {
            var list = new Map([
                ['￥','元'],
                ['$','美元'],
                ['€','欧元']
            ])
            return symbol + price + list.get(symbol)
        }
    }})
```

过滤器为我们格式化文本提供了更便捷的方法。并且`price | filter`比在表达式中直接写`total`更具可读性和扩展性。

过滤器总是将前一个值作为第一个参数传入，自定义参数从第二个开始。使用过滤器需要注意两个事项：
- **不能使用`this`来访问其它数据或方法。**
这一点是故意设计成这样的，因为过滤器必须是纯函数。也就是说不管在哪里使用，同样的输入应该保证同样的输出。如果需要使用外部数据，可以作为参数传入。
- **只能在插值`{{ }}`和指令`v-bind`中使用**
在`vue 1`的版本可以任何可以使用表达式的地方使用，但是`vue 2`中取消了这种做法，并用`v-bind`的使用也是在`vue 2.1.0`中添加的。

## 过滤器注册
之前在`vue`作用域讲过，分全局作用域`vue`，实例作用域`vm=new Vue()`，组件作用域。

根据过滤器的使用范围过分别选择。
```js
// 全局注册，可以在任何实例内或组件内使用
Vue.filter('filterName', function (value, arg) {
    // do something
})

// 实例注册，通过配置对象options属性传入
var vm = new Vue({
    el: "#app",
    data: {
        price: 10000
    },
    filters: {
        filterName(value,arg) {
            // do something
        },
    }
})

// 组件内注册，只限组件内使用，其它组件无法使用
export default {
    data() {
        return {
            price: 10000
        }
    },
    filters: {
        filterName(value,arg) {
            // do something
        },
    }
}
```

## 文件组织

一般我们使用过滤器，也就是因为有频繁操作，所以在项目中一般过滤器都是全局注册。在项目`src`文件中定义一个`filters`文件夹，新建一个`index.js`
```js
import Vue from 'vue'

var filter1 = function (value, arg) { /* do something */ }
var filter2 = function (value, arg) { /* do something */ }
var filter3 = function (value, arg) { /* do something */ }

var filters = {
    filter1,
    filter2,
    filter3,
}

for (filter in filters) {
    Vue.filter(filter, filters[filter])
}

export default Vue
```
```js
// 在main.js文件导入
import './filters/install'
```