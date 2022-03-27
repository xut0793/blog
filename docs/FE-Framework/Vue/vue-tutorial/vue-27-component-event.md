# 27 组件三大API之二： event

在上一节中讲到prop单向下行数据绑定的特征，父组件向子组件传值通过prop实现，那如果有子组件需要向父组件传值或其它通信请求呢？
实现上面子组件向父组件通信，我们可以在父组件中将`v-on`绑定在子组件标签上开启一个事件监听，然后在子组件内部使用`$emit`触发该事件。

## v-on / @
```html
<div id="app">
    <p>this is event example for v-on/@<p>
    <!-- 绑定监听事件some-event -->
    <com-child @com-btn-click="handleChildClick"></com-child>
</div>
```
```js
const comChild = Vue.extend({
    template: `<button @click="handleClick">我是子组件内定义的按钮，点击触发父级监听事件</button>`,
    methods: {
        handleClick() {
            this.$emit('com-btn-click',666)
        }
    }
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
    methods: {
        handleChildClick(val) {
    		alert('我是由子组件触发的:' + val);
	}
    }
})
```

**事件名称始终采用kebab-case形式**
不同于组件和 prop，事件名不会作为一个 JavaScript 变量名或属性名，所以不存在任何自动化的大小写转换。即触发的事件名需要完全匹配监听这个事件所用的名称。
又因为v-on绑定在html元素上，而 HTML 是不区分大小写的。而一般事件名称都是采用多个单词，所以建议事件名一律采用`kebab-case`连字符形式。

**事件传参**
子组件在`$emit`触发事件的同时，可以传递一个值，在`v-on`绑定的事件监听器中接收到。
```js
// $emit第一个参数是监听器事件名，第二个是要传递的参数
this.$emit('some-event',666)
```
```js
// 监听事件处理函数第一个参数即为接收的值
handleChildEvent(val) {
    alert('我是由子组件触发的:' + val)
}
```
## 事件修饰符

### .native 原生事件修饰符
- 在一个组件中，如果我们为其绑定一个原生的点击事件`@click`，基本是无效的。
- 在`vue`中对组件绑定原生事件需要带上原生事件修饰符`.native`。
- 在组件中同时存在原生事件和自定义事件，组件自定义事件先于原来事件执行

```html
<div id="app">
        <p>this is event example for .native/@<p>
        <com-child @click="handleNativeClick">按钮@click</com-child>
        <com-child @click="handleNativeClick" @child-btn-click="handelChildBtnClick">按钮@click 和自定义事件@child-btn-click</com-child>
        <com-child @click.native="handleNativeClick">按钮@click.native</com-child>
        <com-child @click.native="handleNativeClick" @child-btn-click="handelChildBtnClick">按钮@click.native 和自定义事件@child-btn-click</com-child>
    </div>
```
```js
const comChild = Vue.extend({
    template: `<div>
			<button @click="handleBtnClick" >
                <slot></slot>
            </button>
			</div>`,
    methods: {
        handleBtnClick() {
            this.$emit('child-btn-click')
        },

    },
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
    methods: {
        handelChildBtnClick() {
            alert("v-on绑定组件自定义事件")
        },
        handleNativeClick() {
            alert('native click')
        }
    }
})
```

### .sync 双向数据绑定

在前面讲解`porp`时，明确了`prop`是数据单向下行的绑定，父组件通过`porp`向子组件传值。
在`v-on / $emit`中，可以在子组件中触发父组件的事件监听器，以达到子组件向父母组件传值或通信的需要，可视为子组件向父组件的数据单向上行绑定。

所以常常将两者结合起来使用。那这里就会产生一个特殊的情况：父组件通过某个`prop`向子组件传值，而子组件通过` v-on / $emit`触发父组件监听器修改的是正是父组件中的这个`porp`值。

```html
<div id="app">
    <p>this is event example for prop and $emit<p>
    <P>父组件中的num:{{ num }}</P>
    <button-counter :count='num' @child-btn-click="handelChildBtnClick"></button-counter>
</div>
```
```js
const buttonCounter = Vue.extend({
    template: `<div>
			<button @click="handelIncrease" >子组件点击次数：{{ count }}</button>
			</div>`,
    props: {
        count: Number
    },
    methods: {
        handelIncrease() {
            this.$emit('child-btn-click', this.count+1)
        },
    },
})

const vm = new Vue({
    el: "#app",
    data: {
        num: 0,
    },
    components: {
        buttonCounter,
    },
    methods: {
        handelChildBtnClick(val) {
            this.num = val;
        },
    }
})
```

父子通信传递和修改的都是同一个`prop`时，`Vue`提供一个语法糖`.sync`，可以进行简写:

```html
<div id="app">
    <p>this is event example for .sync<p>
    <P>父组件中的num:{{ num }}</P>
    <!-- <button-counter :count='num' @child-btn-click="handelChildBtnClick"></button-counter> -->
    <button-counter :count.sync='num'></button-counter>
</div>
```
```js
const buttonCounter = Vue.extend({
    template: `<div>
			<button @click="handleIncrease">子组件点击次数：{{ count }}</button>
			</div>`,
    props: {
        count: Number
    },
    methods: {
        handleIncrease() {
            // this.$emit('child-btn-click', this.count+1)
            this.$emit('update:count', this.count+1)
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        num: 0,
    },
    components: {
        buttonCounter,
    },
    methods: {
        // handelChildBtnClick(val) {
        //     this.num = val;
        // },
    }
})
```
上面注释的内容就是省略的内容，可以看到`.sync`语法糖就是对父组件绑定自定义事件那部分代码进行了简略，并指定`$emit`触发的父组件监听事件名必须为`update:count`的写法。
实际上完全还原`.sync`的写法是：

```html
<div id="app">
    <p>this is event example for .sync update:count<p>
    <P>父组件中的num:{{ num }}</P>
    <!-- <button-counter :count='num' @child-btn-click="handelChildBtnClick"></button-counter> -->
    <button-counter :count='num' @update:count="handelChildBtnClick"></button-counter>
</div>
```
```js
const buttonCounter = Vue.extend({
    template: `<div>
			<button @click="handleIncrease">子组件点击次数：{{ count }}</button>
			</div>`,
    props: {
        count: Number
    },
    methods: {
        handleIncrease() {
            // this.$emit('child-btn-click', this.count+1)
            this.$emit('update:count', this.count+1)
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        num: 0,
    },
    components: {
        buttonCounter,
    },
    methods: {
        handelChildBtnClick(val) {
            this.num = val
        }
    }
})
```

对于`v-bind='object`形式传入一个对象时，实现对象某个属性值的双向绑定，可以简写改成这样：`v-bind.sync='object'`

```html
  <div id="app">
    <p>this is event example for .sync object.lnag<p>
    <!-- <button-counter v-bind='frontend' @child-change-lang="handleChildChangeLang"></button-counter> -->
    <button-counter v-bind.sync='frontend'></button-counter>
</div>
```
```js
const buttonCounter = Vue.extend({
    template: `<div>
            <p>前端语言：{{ lang }}</p>
            <p>前端框架：{{ framework }}</p>
            <p>前端编辑器：{{ editor }}</p>
			<button @click="handleChangeLang">子组件内点击改变前端语言</button>
			</div>`,
    props: {
        lang: String,
        framework: String,
        editor: String,
    },
    methods: {
        handleChangeLang() {
            this.$emit('update:lang', 'HTML')
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        num: 0,
        frontend: {
            lang: "javascript",
            framework: "vue",
            editor: "vscode",
        }
    },
    components: {
        buttonCounter,
    },
    methods: {
        // handleChildChangeLang(val) {
        //     console.log(val)
        //     this.frontend.lang = val
        // }
    }
})
```

### v-model自定义组件的双向输入绑定

在上面`.sync`实现双向数据绑定时，概念上有一些熟悉，因为之前在基础指令学习时，有一个用于表单元素输入的双向数据绑定指令`v-model`，总结的时候，提到过这也是一个语法糖而已。

在`.sync`实现时说过，`$emit`触发的事件名必须按要求写法`update:prop`的形式才行。同样的，`v-model`语法糖实现的前提也必须存在指定的值，默认是特性值是`value`，绑定的事件名是`input`。
`v-model`在绑定原生的表单元素时，会根据表单元素的类型不同，选择对应的特性和事件来实现双向绑定。
- text 和 textarea 元素使用 value 属性和 input 事件，值为字符串文本；
- checkbox 和 radio 使用 checked 属性和 change 事件，checkbox为单个时绑定值为布尔值，多选为数组，radio绑定依value值类型；
- select 字段将 value 作为 prop ，并将 change 作为事件。多选时为数组

那把`v-model`用在自定义的组件中时，v-model 默认会查找组件中名为 value 的 prop 和名为 input的事件。如果有一个不存在，则无法实现`v-model`双向绑定的效果。


```html
<!-- 原生表单输入框元素直接用v-model -->
<div id="native-test">
    <p>data中iptValue的值是： {{ iptValue }}</p>
    <input type="text" v-model="iptValue">
</div>
```
```js
const vm = new Vue({
    el: "#native-test",
    data: {
        iptValue: ''
    },
})
```
那如果现在有一个自定义的输入组件,根元素就是一个`input`元素，在组件在直接绑定`v-model`是否有效呢？
```html
<div id="app">
    <p>显示iptValue的值：{{ iptValue }}</p>
    <!-- <input type="text" v-model="iptValue"> -->
    <com-input v-model="iptValue"></com-input>
</div>
```
```js
const comInput = Vue.extend({
    template: `<input type="text"></div>`,
})

const vm = new Vue({
    el: "#app",
    data: {
        iptValue: '初始值'
    },
    components: {
        comInput,
    },
})
```
结果是无效，因为在模板编辑阶段子组件`com-input`上用`v-model`时没有在组件身上找到`value`和`input`事件。也不会找到内部原生的`input`。

**自定义组件v-model指令**

所以根据`v-model`绑定原生表单组件时的原理，手写一个组件双向输入绑定
```html
 <div id="app">
    <p>显示iptValue的值：{{ iptValue }}</p>
    <!-- <input type="text" v-model="iptValue"> -->
    <com-input :value='iptValue' @input="handleComInput"></com-input>
</div>
```
```js
const comInput = Vue.extend({
    template: `<input type="text" :value="value" @input="handleInnerIput"></div>`,
    props: ['value'],
    methods: {
        handleInnerIput(e) {
            this.$emit('input', e.target.value)
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        iptValue: '初始值'
    },
    components: {
        comInput,
    },
    methods: {
        handleComInput(val) {
            this.iptValue = val
        }
    }
})
```
这样我们就让组件`com-input`有了`value`属性和`input`事件，此时满足`v-model`有实现条件。我们就可以在组件上直接使用`v-model`绑定了

```html
 <div id="app">
    <p>显示iptValue的值：{{ iptValue }}</p>
    <!-- <input type="text" v-model="iptValue"> -->
    <!-- <com-input :value='iptValue' @input="handleComInput"></com-input> -->
    <com-input v-model="iptValue"></com-input>
</div>
```

所以说，只要我们封装的组件能提供value属性和input事件，就可以对该组件使用v-model指令。而不需要组件内部一定是表单元素。
```html
<div id="app">
    <p>显示iptValue的值：{{ iptValue }}</p>
    <!-- <input type="text" v-model="iptValue"> -->
    <!-- <com-input v-model="iptValue"></com-input> -->
    <com-div v-model='iptValue'></com-div>
</div>
```
```js
const comDiv = Vue.extend({
    // template: `<input type="text" :value="value" @input="handleInnerIput"></div>`,
    template: `<div>
        <span @click="handleClick" style="border: 1px solid #000;">点击改变值的显示 {{ value }}</span>
    </div>`,
    props: ['value'],
    methods: {
        handleClick(e) {
            this.$emit('input', this.value+1)
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        iptValue: 0
    },
    components: {
        comDiv,
    },
})
```

### 组件的model属性

再进一步讲，v-model指令默认情况下是选择value属性和input事件，那是否像checkbox一样让v-model绑定其它属性和对应的事件呢。
vue 2.2.0以上版本为组件增加一个`model`对象属性，用来指定v-model绑定自定义的prop和event事件。
```html
<div id="app">
    <p>显示iptValue的值：{{ iptValue }}</p>
    <!-- <input type="text" v-model="iptValue"> -->
    <com-input v-model="iptValue"></com-input>
    <com-div v-model='iptValue'></com-div>
</div>
```
```js
const comDiv = Vue.extend({
    // template: `<input type="text" :value="value" @input="handleInnerIput"></div>`,
    template: `<div>
        <span @click="handleClick" style="border: 1px solid #000;">点击改变值的显示 {{ otherName }}</span>
    </div>`,
    model: {
        prop: 'otherName',
        event: 'some-event'
    },
    props: ['otherName'],
    methods: {
        handleClick(e) {
            this.$emit('some-event', this.otherName+1)
        }
    }
})

const vm = new Vue({
    el: "#app",
    data: {
        iptValue: 0
    },
    components: {
        comDiv,
    },
})
```

### .sync 和 v-model 区别

从上面分析的组件.sync和v-model实现的原理上看，一个组件只能定义一个model属性用业指定prop和event。所以：
- v-model在组件中只能实现一个prop的双向数据绑定，并且较适合用于绑定的prop类型为基本类型。
- .sync可以在组件中指定多个prop的双向数据绑定，绑定的prop类型较宽，对象类型的绑定更方便。

比如当`v-bind.sync='obj'`时，就会把obj对象中的每一个属性都作为一个独立的 prop 传进去，然后各自添加用于更新的 v-on 监听器，实现对象中每个属性的双向绑定。

## 组件事件系统

`Vue`内置了一套完整的事件触发器逻辑：

- `vm._events`：保存有 `$on` 注册的事件回调
- `$on`：监听组件自身触发的事件
- `$emit`： 触发事件
- `$off`： 卸载组件自身的事件监听器
- `$once`： 单次监听，只会执行一次事件监听，之后不再有效
- `$listeners`: 包含**在组件标签上v-on注册的**所有自定义监听器的对象，key为事件名，value为事件监听函数。

### `$on / $once`
`$on`开启的监听事件和`$emit`触发的监听事件都是在同一个组件实例。
```html
<div id="app">
    <p>this is event example for $on<p>
    <com-child></com-child>
</div>
```
```js
const comChild = Vue.extend({
    template: `<button @click="handleClick">我是子组件内定义的按钮，点击触发监听事件</button>`,
    data: () => {
        return {
            count: 0,
        }
    },
    methods: {
        handleClick() {
            this.count++
            this.$emit('comBtnClick',this.count)
        }
    },
    mounted() {
        this.$on('comBtnClick', (val) => {
            alert('我是由$on注册的监听子组件按钮点击事件'+val)
            if (val === 3) {
                console.log('卸载事件监听')
                this.$off('comBtnClick')
            }
        })
        this.$once('comBtnClick', (val) => {
            alert('我是由$once注册监听子组件按钮点击事件，只会触发一次'+val)
        })
    }
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
})
```
对于组件内部触发有条件下其它事件时，比如就监听执行一次用`$once`,或监听执行然后某条件满足下不再监听用`$on配合$off`。
但是如果是持续监听，只要事件触发就执行某动作，完全可以将监听回调函数写成methods中方法，事件处理时直接执行该方法。
```js
const comChild = Vue.extend({
    template: `<button @click="handleClick">我是子组件内定义的按钮，点击触发监听事件</button>`,
    methods: {
        handleClick() {
            // this.$emit('comBtnClick',888)
            this.comBtnClick(val)
        },
        comBtnClick(val) {
            alert('我是按钮点击触发执行'+val)
        }
    },
})
```
上面使用`$on / $emit`如果只在组件内部执行，并不能实现子组件向父组件传值通信的目的。此时我们需要再配合`$refs`属性实现。
> `ref`特性用在单个`HTML`元素上可以获取原生`DOM`节点对象，用在组件标签上，可以获取该组件实例对象。

上面的例子修改下，使用`$on / $emit / $refs`实例子组件向父组件组件的目的
```html
<div id="app">
    <p>this is event example for $on / $emit / $refs<p>
    <com-child ref="comChild"></com-child>
</div>
```
```js
const comChild = Vue.extend({
    template: `<div>
			<button @click="handleBtnClick">我是子组件内定义的按钮，点击触发监听事件</button>
			</div>`,
    methods: {
        handleBtnClick() {
            this.$emit('comBtnClick',999)
        },
    },
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
    mounted() {
        this.$refs.comChild.$on('outerSelfEvent', val => {
            console.log('组件按钮点击了')
        })
        this.$refs.comChild.$once('outerSelfEvent', val => {
            console.log('组件按钮点击了,我只监听执行一次')
        })
    }
})
```

### $off
移除自定义事件监听器。

- 如果没有提供参数，则移除所有的事件监听器；
- 如果只提供了事件，则移除该事件所有的监听器；
- 如果同时提供了事件与回调，则只移除这个回调的监听器（此时注册事件时回调函数不能采用匿名函数写法）。

```html
 <div id="app">
    <p>this is event example for $off<p>
    <com-child ref="comChild"></com-child>
</div>
```
```js
const comChild = Vue.extend({
    template: `<div>
			<button @click="handleBtnClick1">点击触发触发组件内部监听事件elert</button>
			<button @click="handleBtnClick2">点击触发触发组件内部监听事件console</button>
			<button @click="handleUninstallAllListener">点击卸载组件内所有事件监听$off()</button>
			<button @click="handleUninstallTheEvent">点击卸载组件内指定事件监听器$off(event)</button>
			<button @click="handleUninstallTheEventCallback">点击卸载组件内指定监听器$off(event,cb)</button>
			</div>`,
    methods: {
        handleBtnClick1() {
            this.$emit('handleAlert')
        },
        handleBtnClick2() {
            this.$emit('handleConsole')
        },
        handleUninstallAllListener() {
            console.log('卸载所有监听器')
            this.$off()
        },
        handleUninstallTheEvent() {
            console.log('卸载指定事件handleAlert的所有监听器')
            this.$off('handleAlert')
        },
        handleUninstallTheEventCallback() {
            console.log('卸载指定事件handleConsole中的handleConsole2监听器')
            this.$off('handleConsole', this.handleConsole2)
        },

        handleConsole2() {
            console.log('监听器Console2')
        }

    },
    mounted() {
        this.$on('handleAlert',function () {
            alert('监听器alert1')
        })
        this.$on('handleAlert',function () {
            alert('监听器alert2')
        })
        this.$on('handleConsole',function () {
            console.log('监听器Console1')
        })
        this.$on('handleConsole',this.handleConsole2 )
    }
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
})
```

### $listeners

包含了父作用域中的在组件标签上所有通过v-on注册的事件监听器。
但不包括：
1. 含有.native 修饰器的原生事件监听器
1. 组件使用$on注册的监听器

下面的例子，我们在子组件标签上绑定了一个原生事件，二个`v-on`方式的自定义事件，一个`$on`方式的自定义事件。
但终`$listeners`打印出来的只有其中二个`v-on`方式绑定的事件。
```html
<div id="app">
    <p>this is event example for $listeners<p>
    <com-child
        ref="comChild"
        @click.native="handleNativeClick"
        @child-btn-click-console="handelChildBtnClickConsole" @child-btn-click-alert="handelChildBtnClickAlert"
    ></com-child>
</div>
```
```js
const comChild = Vue.extend({
    template: `<div>
			<button @click="handleBtnClick" >点击触发触发组件内部监听事件elert</button>
			</div>`,
    methods: {
        handleBtnClick() {
            this.$emit('child-btn-click-alert')
            this.$emit('child-btn-click-console')
            this.$emit('handleConsole')
        },

    },
    mounted() {
        this.$on('handleConsole',function () {
            console.log('$on绑定监听器')
        })
        // 打印出$listeners
        console.log('$listeners:', this.$listeners)
    }
})

const vm = new Vue({
    el: "#app",
    components: {
        comChild,
    },
    methods: {
        handelChildBtnClickAlert() {
            alert('v-on绑定$emit触发alert')
        },
        handelChildBtnClickConsole() {
            console.log("v-on绑定$emit触发console")
        },
        handleNativeClick() {
            alert('native click')
        }
    }
})
```
```
$listeners:
child-btn-click-alert: ƒ invoker()
child-btn-click-console: ƒ invoker()
```



