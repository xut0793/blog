# 16 computed

在指令章节讲过，插值`{{ }}`和指令都接受变量和表达式的写法，使用表达式可以进行简单的二元或三元运算。但如果要执行更加复杂的计算或频繁重复的计算，如果还是直接写在指令的表达式中会让代码过于臃肿，不好看不优雅。这个时候可以使用`computed`属性。
比如：
```html
<!-- 假设后端返回的价格单位是分，显示格式要求¥0.00元 -->
<!-- bad -->
<div>总价：¥ {{ (price / 100).toFixed(2) }}元</div>
<!-- good -->
<div>总价：{{ total }}</div>
```
```js
computed: {
    total() {
        return `￥ ${(this.price / 100).toFixed(2)}元`
    }
},
```
计算属性就是data对象的一个扩展和增强版本。data中的值可以进行读写操作，同样计算属性的值也是可读可写的。
```js
// 单纯读取时，函数写法，默认调用get方法
computed: {
    total() {
        return `￥ ${(this.price / 100).toFixed(2)}元`
    }
},

// 可读可写时，对象写法
computed: {
    total: {
        get: function () {
            return `￥ ${this.price.toFixed(2)}元`
        }, 
        set: function (newValue) {
           this.price = newValue / 100
        }
    }
}
```
常规想法，在这里容易产生一个误区，当我对计算属性赋值，如`this.total = 250`,`total`值会被覆盖直接等于250。但是，实际对计算属性赋值，如果是对象形式，只是会触发执行`set`函数，具体视图如何显示，取决于我们在`set`函数体内的执行代码，有没有更新`get`中的依赖值。

看个例子
[点击查看DEMO:computed by get and set](https://jsrun.net/85XKp/edit)
```html
<div id="app">
    <div>总价：{{ total }}</div>
    <button @click="changePrice">price加1</button>
    <button @click="changeTotal">直接赋值total</button>
    <div>赋值列表：{{ memorySetterList }}</div>
</div>
```
```js
new Vue({
    el: "#app",
    data: {
        price: 100,
        memorySetterList: [],
    },
    computed: {
        total: {
            get(){
                return `￥ ${this.price.toFixed(2)}元`
            },
            set(setVal) {
                this.memorySetterList.push(setVal)
            }
        }
    },
    methods: {
        changeCount() {
            this.price++
        },
        changeDouble() {
            console.log("setBefore:this.total:",this.total)
            this.total += 50
            console.log("setAfter:this.total:",this.total)
        }
    }
})
```
结果显示，`this.total`的值变不会有改变，赋值列表每次都是同样的值，并每点一次加50的效果。只有当`price`值改变才会触发更新。所以直接对计算属性赋值`this.price = someValue`只是被`this.total`的`setter`方法捕捉到而已。

这也正是计算属性的特点一：**依赖改变才会改变**
上面的例子如果要实现对`total`赋值的同时,视图中`{{ total }}`也显示改变,可以在计算属性的`setter`中对其依赖值`price`进行改变。
```js
computed: {
    total: {
        get: function () {
            return `￥ ${this.price.toFixed(2)}元`
        }, 
        set: function (newValue) {
           this.price = newValue / 100
        }
    }
}
```
计算属性的另一个特点：**值会被缓存**
多处调用计算属性，都是相同的值。并且依赖改变，多处调用的值都是会同时更新。
```html
<div id="app">
    <div>count1：{{ count1 }}</div>
    <div>addCount1ByComputed: {{ addCount1ByComputed}}</div>
    <div>addCount2ByMethod:{{count2}}</div>
</div>
```
```js
var vm = new Vue({
    el: "#app",
    data: {
      count1: 1,
      count2: 1,
    },
      computed: {
        addCount1ByComputed() {
            return this.count1 * 10
        }
    },
    methods: {
        addCount2ByMethod() {
            this.count2++
        },
    },
    mounted() {
        console.log("========computed========")
        for (let i=0; i<5; i++) {
            console.log(this.addCount1ByComputed)
        }
        console.log("=======methods=======")
        for (let i=0; i<5; i++) {
            this.addCount2ByMethod()
            console.log(this.count2)
        }
    },
})
```

###### 计算属性的特点：
- 只有当计算属性所依赖的值改变时，才会重新触发执行函数改变其值。
- 计算属性会被缓存，如果其依赖值不改变，即使在多个地方多次调用，函数体代码也不会被执行，只是取用已经被缓存的值。


##### 总结
我理解`computed`就是对数据的显示的一种包装，这种包装的需要可能是出于数据格式的美化或数据调用上简化复用考虑。而`computed`的`get`方法提供一种包装方法，`set`也是一种包装方法。只是大部分情况下，一种`get`方法已足够我们解决需求。很少有`get`解决起来还不够完美的情况下再需要使用`set`配合的情况。

但也确实有需要`get/set`同时包装一个数据对象的情况，比如根据后端请求回的商品价格price是分的单位，但现在视图上渲染需要按一定格式如`¥0.00元`格式，并且在其它地方使用`price`参与运算需要元的单位。

一般常规的做法是，在每个调用`price`都手动除一次100，或者在请求成功的回调中对`price`先转化元单位，再赋值到data中响应。但也可以使用`computed`在`set`方法处理转为元再赋值`this.price`，实现`price`相关包装逻辑都在一起。如下例：

```html
<div>总价：{{ total }}</div>
```
```js
new Vue({
    el: "#app",
    data: {
        price: '',
    },
    computed: {
        total: {
            get: function () {
            return `￥ ${this.price.toFixed(2)}元`
            }, 
            set: function (newValue) {
            this.price = newValue / 100
            } 
        }
    }
}),
mounted() {
    this.request_getGoodsPrice()
    .then(
        // 常规写法
        // res => this.price = res.totalPrice / 100
        // 使用set方法，将price的处理逻辑合在一起，都是total的计算属性方法中。
        res => this.total = res.totalPrice
    )
}
```