# 21 mixins

混入是一种对重复代码的组织方式，可以在多个组件间复用代码。

如果在项目中，在多个组件间有一段逻辑代码是共同的。那常见的处理方式是：
- 每个组件都复制粘贴代码（显然这是最不好方式）
- 将以共同的代码逻辑抽离成多个函数，并存储到util文件里，在组件使用时引入这个方法。
- 直接将共同的代码剥离出来，并存储到你定义的mixin文件里，在组件使用时引入，并在实例选项中全局混入，或组件中局部混入。

后两种方式在思想上是一致的，但是mixin混入比方法抽离更为彻底，在混入中完全按照vue的代码组织方式，可以使用`method`或生命周期钩子函数，可以包含`this`对象等。而抽离成工具方法中，不能使用vue相关的选项属性，只能是将重复的逻辑代码自定义成函数形式。
> 混入对象可以引用任何`vue`组件所能引用的东西，就好像它是组件本身一样

## 基本使用：
比如在项目中有几个组件都要获取用户信息，调用`getUserInfo`方法。则可以按下面这么操作：

```js
// userInfoMixin.js
export const userInfoMixin = {
    methods: {
        getUserInfo() {
            return fetch(`api/user/${this.userId}`)
                    .then(res => res.json())
        }
    }
}
```
```js
// A组件内，先引入，再使用
import {userInfoMixin} from '.mixins/userInfoMixin'

export default {
    mixins: [userInfoMixin],
    props: {
        userId: {
            type: number
        }
    }
    data() {
        return {
            userInfo: null,
        }
    },
    mounted() {
        // 直接调用this打点调用混入的方法，就像使用自身定义的一样
        this.getUserInfo()
        .then(res => {
            this.userInfo = res
        })
    }
}
```

但上面这个例子，我们只虽剥离一个共同的方法。在utils中经常类似这么操作。实际上混入可以使用vue组件的任意属性，所以上面的`data`中的`userInfo`和`mounted`中的方法调用代码都是重复的，所以可以按下面优化后，这样混入：
```js
// userInfoMixin.js
export const userInfoMixin = {
    data() {
        return {
            userInfo: null,
        }
    },
    mounted() {
        this.getUserInfo()
        .then(res => {
            this.userInfo = res
        })
    }
    methods: {
        getUserInfo() {
            return fetch(`api/user/${this.userId}`)
                    .then(res => res.json())
        }
    }
}
```
```js
// A组件内，先引入，再使用
import {userInfoMixin} from '.mixins/userInfoMixin'
export default {
    mixins: [userInfoMixin],
    props: {
        userId: {
            type: number
        }
    }
}
```

虽然混入使组件简化了很多，但是让追踪数据的来源变得复杂了。当决定将哪些代码放在混入对象中，哪些代码保留在组件中，你必须衡量这样做的代价和收益。

## 混入注意事项

如果混入对象和组件间有重复的选项，`vue`会根据重复的选项类型来区别对待
- 对生命周期钩子函数的重复，会将它们添加到一个数组中，并会全部执行。
- 对其它重复的数据、方法、计算属性等非生命周期函数，组件中的属性优先级更高，会覆盖混入的对应项。

```js
//mixin
export const hi = {
    mounted() {
        console.log('hello from mixin!')
        }
    }

    //vue instance or component
    new Vue({
        el: '#app',
        mixins: [hi],
        mounted() {
        console.log('hello from Vue instance!')
        }
    });

    //当组件创建时，`mixin`混入中信息会先于组件中信息的输出。
    > hello from mixin!
    > hello from Vue instance!
```


```js
//mixin
export const hi = {
        methods: {
            sayHello: function() {
            console.log('hello from mixin!')
            }
        },
        mounted() {
            this.sayHello()
        }
    }

    //vue instance or component
    new Vue({
        el: '#app',
        mixins: [hi],
        methods: {
        sayHello: function() {
            console.log('hello from Vue instance!')
        }
        },
        mounted() {
        this.sayHello()
        }
    })

    // 组件内的方法覆盖了`mixin`的同名方法。
    > hello from Vue instance!
    > hello from Vue instance!
```

## 混入内对象的命名规范
有时候会特意用到这种冲突的覆盖，但有时需要避免这种冲突覆盖，在`vue`官方代码风格指南中建议对于混入的私有属性（不应该在在混入之外在使用的方法、数据或计算属性）,应该在它们名称前面添加前缀`$_`以示区分。比如上面会被覆盖的方法可以命名成`$_sayHello`。这在开发自定义组件或插件时极为重要，因为用户在使用插件的项目中，可能会使用相同的属性名称，如果重名会造成BUG。

## 混入`mixin`的源码解读
其实源码中`mixin`原理并不复杂，只是将`mixin`中的对象与`vue`自身的options属性合并在一起。复杂是需要判断混入对象中的各个属性，根据属性不同采用不用的合并策略。
```js
// 文件位置： vue/src/core/index
// vue实例初始化全局API
import { initGlobalAPI } from './global-api/index'
initGlobalAPI(Vue)
```
```js
// 文件位置： vue/src/core/goloba-api/index
import { initMixin } from './mixin'
initMixin(Vue)
```
```js
// 文件位置：vue/src/core/global-api/mixin
import { mergeOptions } from '../util/index'

export function initMixin (Vue) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```
```js
// mergeOptions方法在：vue/src/core/util/options
export function mergeOptions () {
    // ...其它代码
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        // 如果组件parent内已经处理过的属性，则不再处理
        if (!hasOwn(parent, key)) {
        mergeField(key)
        }
    }
    function mergeField (key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}

// 不同的全并策略
strats.data = function (){ /* do something */}
strats.watch = function (){ /* do something */}
strats.props =
strats.methods =
strats.inject =
strats.computed = function (){ /* do something */}

// 对于component / directive / filter 等模板依赖相关的属性的混入策略
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

// 对于生命周期钩子的混入策略
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
/**
 * Hooks are merged as arrays.
 */
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]) // 推入数组中
    }
  }
  return res
}
```
