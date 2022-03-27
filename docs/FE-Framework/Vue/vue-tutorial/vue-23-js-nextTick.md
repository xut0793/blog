# 12 vm.nextTick

在jQuery中，如果我们要生成一个ul-li的列表元素，我们也不会在循环体中每生成一个li就将它插入到ul中，而是在循环体内拼接每个li,待循环体结束后，再一并添加到ul元素上进行视图渲染。这样是为了避免页面不断的进行重排和重绘，优化页面性能。
```js
var list = [1,2,3,4,5,6]

// bad
for (var i = 0; i < list.length; i++) {
    $("<li></li>").text(list[i]).appendTo("#one")
}

// good
var temp = ""
for (var i = 0; i < list.length; i++) {
    temp += `<li>${list[i]}</li>`
}
$("#two").append(temp)
```

同样，在Vue中，不可能监控到一个数据更新就马上去刷新视图，而是异步执行 DOM 更新。

当观察到数据变化，Vue 会开启一个队列，用来缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。然后，在下一个的事件循环前的“tick”中，Vue 再使用刷新后队列中的数据去执行渲染工作。这种使用队列并在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的，很大的提升了页面性能。

所以当我们在this.someData = newValue时，并没有马上在页面中渲染newValue。所以如果此时我们从DOM元素中获取相应的值是没有改变的。
```html
<div id="tick">
    <p ref="msg">{{ msg }}</p>
    <button @click="updateMsg">更新msg</button>
</div>
```
```js
var vm = new Vue({
    el: "#tick",
    data: {
        msg: 123
    },
    methods: {
        updateMsg() {
            this.msg = 456;
            console.log("this.msg",this.msg) // 456 数值是已更新
            console.log("msg.textContent", this.$refs.msg.textContent) // 123 视图未更新
        }
    }
})
```

如果实际需求确实需要操作数据变化后相关的DOM，VUE提供了`nextTick( callback )`方法来执行DOM渲染完成后的回调。可以使用全局的`Vue.nextTick( callback )`,也可以使用实例对象的提供的`this.$nextTick( callback )`

上面的例子改写下：
```js
var vm = new Vue({
    el: "#tick",
    data: {
        msg: 123
    },
    methods: {
        updateMsg() {
            this.msg = 456;
            console.log("this.msg",this.msg) // 456 数值是已更新
            console.log("msg.textContent", this.$refs.msg.textContent) // 123 视图未更新
            this.$nextTick(() => {
                console.log("nextTick", this.$refs.msg.textContent) // 456 此时视图已更新
            })
        }
    }
})
```

现在，回头再仔细回味下解释vue文档中的```异步更新队列```中这段解释：
> 只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

同一个数值在同一事件中被多次改变，队列中只会保留最后值用来执行视图更新，并且执行页面渲染时机是当前事件执行结束后。

我们验证下：
```js

var vm = new Vue({
    el: "#tick",
    data: {
        msg: 123
    },
    methods: {
        updateMsg() {
            this.msg = 456;
            console.log("first_this.msg",this.msg)
            console.log("first_this.$refs.msg.textContent", this.$refs.msg.textContent)
            this.$nextTick(() => {
                console.log("first_nextTick", this.$refs.msg.textContent)
            })

            for (let i=0; i < 5000; i++) {
                console.log('i')
            }

            this.msg = 789;
            console.log("second_this.msg",this.msg)
            console.log("second_this.$refs.msg.textContent", this.$refs.msg.textContent)
            this.$nextTick(() => {
                console.log("second_nextTick", this.$refs.msg.textContent)
            })
        }
    }
})
```

```
first_this.msg 456
first_this.$refs.msg.textContent 123
5000 i
second_this.msg 789
second_this.$refs.msg.textContent 123
first_nextTick 789
second_nextTick 789
``` 

观察页面，并没有出现456后再变成789，而是直接变成789，两次的赋值只取了最后一次数值用来渲染，并且两次nextTick回调打印的都是同一个值。所以页面的渲染是在整个`updateMsg`事件执行后进行的。
