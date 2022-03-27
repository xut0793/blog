# 18 watch

[[toc]]

`watch`可以监听`data`和`computed`中值的变化。

`watch`在实例对象作用域中可以监听实例对象的数据，即`var vm = new Vue(options)`时作为配置对象属性传入。监听组件作用域内的数据，可以在组件的配置选项中传入。


## 基本语法形式：
- `key: porp | obj.prop | arr[idx] | computed`
- `value: String | Function | Array | Object( handler | [deep | immediate])`
- `retuan: Function`

[点击查看DEMO:例子](https://jsrun.net/5tXKp/edit)
```js
var vm = new Vue({
    data: {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: {
            f: {
                g: 5
            }
        },
        h: [6,7,8]
    },
    computed: {
        i: function () {
            return a * 2
        }
    }
    watch: {
        // key: porp | obj.prop | arr[idx] | computed
        a: 'setA',
        'e.f.g': 'setA',
        e: {
            hander: function (newVal, oldVal) { /*do something */ },
            deep: true,
            }
        'h[1]': function (newVal, oldVal) { /*对数据项监听无效 */ }
        i: function (newVal, oldVal) { /*do something */ }

        // value: String | Function | Object | Array
        b: function (newVal, oldVal) {
            console.log('new: %s, old %s', newVal, oldVal)
        },
        c: {
            // handler is neccessary, deep and immediate are selectable
            hander: function (newVal, oldVal) { /*do something*/ },
            deep: true,
            immediate: true,
        },
        d: [
            function handle1(newVal, oldVal) { /*do something */ },
            {
                hander: function (newVal, oldVal) { /*do something */ },
                deep: true,
            }
        ],
    },
    methods: {
        setA: function (newVal, oldVal) {
            console.log('watch with data by method')
        }
    }
})
```


## `watch`的使用

- 监听`data`对象中的某个对象属性
- 监听回调函数可用的参数`（newVale, oldVale)`
- 立即执行一次回调`immediate: true`
- 深度监听`deep: true`
- 注销监听器`unWatch()`

### 监听对象某个属性
在`data`数据中我们会存入对象，有时只想监听当对象某一个属性值变化，此时可以在监听器的名称`key`中，使用`.`操作符，就像访问这个对象的属性一样。但是必须用字符串符号包裹。
```js
new Vue({
    data: {
        e: {
            f: {
                g: 5
            }
        },
        h: [6,7,8]
    },
    watch: {
        'e.f.g': function () {
            // do something
        },
         'h[1]': function () { /*do something */ }
    }
})
```

### 深度监听 `deep: true`
默认情况下，监听某个对象时，只有当整个对象引用改变时才触发监听回调。但有时，我们期望这个对象的任意一个属性值发生变化都能触发监听回调。而不是监听整个对象引用变化或仅仅某一个属性值变化。此时我们可以在对象写法中传入`deep:true`的配置项

下例的例子，不管是`e.n`变化，还是`e.f.g`变化，又或是`e.f`或`e`变化都会触发回调。
```js
new Vue({
    data: {
        e: {
            f: {
                g: 5
            },
            n: 6
        },
    },
    watch: {
        e: {
            handler: function { /* do something */},
            deep: true
        }
    }
})
```
### 立即执行一次回调`immediate: true`
`watch`最初绑定的时候，默认是不会马上执行的，要等到监听值变化后才响应。那如果想要初次绑定成功就马上执行一次回调，怎么办呢？我们需要传入`immediate=true`选项。
```js
watch: {
        e: {
            handler: function { /* do something */},
            deep: true,
            immediate: true,
        }
    }
```

> 深度监听、立即执行都需要采用对象写法形式传入配置

### 监听回调函数可用的参数`（newVale, oldVale)`
当监听回调执行时，会被传入两个参数：
- 监听对象当前值（已改变的新值）
- 监听对象原来的值

```js
 b: function (newVal, oldVal) {
            // 此时 this.b === newValue
        },
```

### 注销监听
为什么要注销 `watcher`？因为我们的组件是经常要被销毁的，比如我们跳一个路由，从一个页面跳到另外一个页面，那么原来的页面的 `watcher` 其实就没用了，这时候我们应该注销掉原来页面的 `watch`，不然的话可能会导致内置溢出。

好在我们平时 `watch` 都是写在组件的选项中的，他会随着组件的销毁而销毁。在`beforeDestory`阶段实例对象的所有属性和事件都被销毁。

```js
const app = new Vue({
  template: '<div id="root">{{text}}</div>',
  data: {
    text: 0
  },
  watch: {
    text(newVal, oldVal){
      console.log(`${newVal} : ${oldVal}`);
    }
  }
});
```

但是，如果我们使用下面这样的方式写 `watcher`，那么就要手动注销了，这种注销其实也很简单。

```js
const unWatch = app.$watch('text', (newVal, oldVal) => {
  console.log(`${newVal} : ${oldVal}`);
})

unWatch(); // 手动注销watch
```
`app.$watch`调用后会返回一个值,是函数，就是`unWatch`方法，只需要执行该方法即可完成注销当前监听器实例。

`unWatch`方法实际上是每个监听器实例生成时继承的方法`teardown()`，见上面监听器初始化最后阶段示例。

像上面这种监听单个数据项变化，往往不建议使用，因为有比监听器更好的方式来处理，即计算属性。如果需要监听数据赋值的变化，可以使用计算属性的`setter`是更好的方式。

但是监听器很适合处理异步操作。比如数据请求的回调、或页面路由的变化。
在实际项目中常常需要在全局应用实例作用域内监听各页面路由切换的变化。
```js
var vm = new Vue({
    watch: {
        '$route.path': function (to, from) {
            // do something
        }
    }
})
```
比监听路由变化更好方式是使用路由守卫。比如上例中可以设置全局路由守卫`beforeEach`或`afterEach`

### `watch`的源码解读
在`new Vue()`创建一个实例的初始化阶段，即在生命周期函数`beforeCreate`和`created`之间会初始化传入的选项`options`中的一系列属性值。
`watch`的初始化阶段包括：

    判断`value`是不是数组  --> 判断`value`是不是对象 --> 判断`key`是不是函数 --> 执行初始化

- 在`initwatch`函数中判断当前`watch`的`value`是不是数组，如果是数组就遍历数据取出每一个数组项传入`createWathcher`函数，如果不是数组，直接传入。
```js
function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < hander.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}
```
- 在`createWathcer`函数中判断`value`是不是对象，如果是对象取出`obj.handler`属性值赋值给`handler`，其它属性值如`deep/immediate`作为整体赋值给`options`。如果是字符串则取`method`，如果是函数直接使用。
```js
function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(expOrFn, handler, options)
}
```
- 执行`vm.$watch(expOrFn, handler, options)`函数。会创建一个`watcher`实例，并且判断是否存在`immediate`，为真则立即执行一次回调。如果没有则当监听对象变化时再执行回调。
```js
Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    options = options || {}
    const watcher = new Watcher(vm, expOrFn, cb, options)
    
    if (options.immediate) {
        cb.call(vm, watcher.value)
    }
    // 返回监听器实例的注销方法teardown
    return function unWatchFn() {
        watcher.teardown()
    }
}
```
- 在类`Wathcer`中除了定义`wathcer`的行为，还做了以下两件事：
    - 也会判断当前`key`是不是字符串还是函数，如果是函数，则取计算属性中函数直接赋值，如果是字符串，则解析该字符串获取监听的值。
    - 判断`options`的属性中是否存在`deep`值，为真时则对监听对象实行深度监听，否则只监听当前对象。
```js
    export default class Watcher {
        constructor (vm, expOrFn, cb, options) {
            this.vm = vm
            this.cb = cb
            
            if (typeof expOrFn === 'function') {
                this.getter = expOrFn
            } else {
                this.getter = parsePath(expOrFn)
            }

            if (options) {
                this.deep = !!options.deep
            } else {
                this.deep = false
            }
        }
     }
```





