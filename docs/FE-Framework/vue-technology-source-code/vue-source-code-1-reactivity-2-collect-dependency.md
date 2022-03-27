# 响应式原理2：收集依赖

[[toc]]

上一我们理解了 Vue 利用 Observer 类来实现了数据的变化的侦测，使得我们可以在每个对象属性重新定义的 getter/setter，以及数组重写的原型方法中实现埋点，监听到对象属性值的读取和设置。

接上一节的例子：我们的需求是，对象 data 的 message 属性值变化了，视图中引用的 message 值也要更新。

```html
<div id="#app" @click="onClick">
  {{message}}
</div>

<script src="vue_2.6.12.js"></script>
<script>
const vm = new Vue({
  data: {
    message: 'Hello World'
  },
  methods: {
    onClick() {
      this.message = 'Hello Vue'
    }
  }
})
vm.$mount('#app')
</script>
```
现在假设框架中存在一个更新视图的 render 方法，至于这个方法具体实现可以待到模板编译和页面渲染的章节了解。

相当于说：message 变化，就要执行 `render()` 来更新视图，我们很自然会想到 render 方法应该放在 message 属性的 setter 函数中执行。

```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {

  // 省略代码...
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      // 在这里可以捕获读取对象属性值的操作
      console.log(`getter is called`)
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (getter && !setter) { return } 
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 在这里可以可以捕获设置对象属性值变化了
      render()
    }
  });
}
```

## 依赖管理器 class Dep

message 变化，就要执行 `render()` 来更新视图。换句话说，render 方法的调用依赖于 message 的值是否改变，即 render 方法是 message 属性的一个依赖。

在实际代码中，一个属性的依赖会有很多，也说是在业务逻辑中可以有多处代码的调用依赖于某个属性值的变化，比如下面代码：

message 的依赖就有三个，或者说有三处地方依赖于 message 值：
1. 视图中 div 的内容
1. 计算属性 messageToUppercase 方法返回值
1. watch 中定义的回调函数

```html
<div id="app" @click="onClick">{{message}}</div>

<script src="vue_2.6.12.js"></script>
<script>
const vm = new Vue({
  data: {
    message: 'hello world'
  },
  computed: {
    messageToUppercase() {
      return this.message && this.message.toUpperCase()
    }
  },
  watch: {
    message: function (newValue, oldValue) {
      console.log('message change: newValue: %s, oldValue: %s', newValue, oldValue);
    }
  },
  methods: {
    onClick() {
      this.message = 'hello vue'
    }
  },
})
vm.$mount('#app')
</script>
```

这个时候，我们不可能把这三个依赖执行都放在 message 的 setter 中直接调用，因为代码实现中并不知道某个属性会有哪些依赖，所以需要抽象一层，在某个地方统一管理属性自身的所有依赖，道理很简单，集中一个地方，在开始的时候收集这个属性的所有依赖，在属性值变化的时候统一通知所有的依赖调用更新。

在 Vue 源码实现上述逻辑是：**每个响应式对象属性都创建一个 Dep 实例用来管理它自身的所有依赖，在属性 getter 方法中收集依赖，在 setter 方法中通知所有依赖。**

我们先看下这个依赖管理器 Dep 类的实现，(省略部分代码)
```js
// 源码实现 vue 版本 2.6.12
var uid = 0;

/**
  * A dep is an observable that can have multiple
  * directives subscribing to it.
  * 典型的观察者模式
  * subscriber 订阅者
  * observer 被观察者
  * dependency 依赖
  */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = []; // 存储所有订阅者，即所有依赖
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.notify = function notify () {
  // 省略代码...
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update(); // watcher.update => 根据需求不同决定 wathcer.dirty = true, 还是 watcher.run
  }
};

// helpers 工具函数
/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```
此时，我们可以在定义每个属性的 defineReactive$$ 方法，添加如下代码：
```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  // 省略代码...
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      // 在这里进行依赖收集
      dep.addSub('a subscriber')
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (getter && !setter) { return } 
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 在这里通知依赖
      dep.notify()
    }
  });
}
```

注意上面 getter 方法中 `dep.addSub('a subscriber')`代码，我们明确了要在属性 getter 方法中收集它的依赖，但一个属性的依赖放在那里呢，怎么明确这个依赖？这仍然是个问题。

Vue 的解决方案是：需要收集的依赖会临时存放在全局唯一的变量 `Dep.target` 中，即在全局唯一的 Dep 类上定义一个静态属性。
```js
get: function reactiveGetter () {
  var value = getter ? getter.call(obj) : val;
  // 在这里进行依赖收集
  // dep.addSub('a subscriber')
  if (Dep.target) {
    dep.addSub(Dep.target)
  }
  return value
},
```

## 依赖 class Watcher

在上面阐述依赖意思的例子中，我们可以看到在业务代码中，依赖可以是多种形式的：

- render 渲染依赖
- computed 计算属性依赖
- watch 属性依赖

虽然在业务代码层面依赖可以表现出多种形式，但在框架内部的实现上需要进行抽象统一形式，才能实现代码逻辑。

在 Vue 中对依赖的抽象就是 Watcher 类。也就是说 一个依赖就是一个 Watcher 实例。

相比 Observer / Dep ，在 Watcher 的实现中，需要注意的细节更多。比如说此时我们要思考的是：
1. 我们在 Observer 中知道依赖收集是通过 getter 方法实现的，但想想第一次触发 getter 方法在哪里？
1. getter 中触发依赖收集时收集的是 Dep.target 的值，如何保证收集依赖的时候，Dep.target 的值刚好是预期的 watcher？

在 Vue 中的策略就是: 建立一个依赖堆栈，当前激活的依赖在栈顶，且赋值给 Dep.target。
```js
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```
在 new Watcher 时候，触发依赖收集前调用 pushTarget(this)，此时就可以保证当前时刻 watcher 的唯一，完成后 popTarget()。

并且每个 watcher 也需要知道自己被哪些依赖管理器 dep 所持有，以便当自己不再作为依赖时，能从所有持有该 watcher 的 dep 中删掉。

```js
// // 源码实现 vue 版本 2.6.12
/**
 * Class Watcher: 有三种：render-watcher / user-watcher / computed-watcher
 * 
 * watcher.user  - 用户在 option.watch 自定义的 watcher，即 user-watcher
 * watcher.lazy  - 用于标记 computed 中实例 watcher, 即 computed-watcher
 * watcher.dirty - 标记 computed-watcher 是否需要重新计算值，还是使用缓存的值 watcher.value
 * isRenderWatcher=true 时，watcher 实例存入 vm._watcher，其中存入在vm._watchers，此时为渲染 render-watcher
 */

var uid$2 = 0;
/**
  * A watcher parses an expression, collects dependencies,
  * and fires callback when the expression value changes.
  * This is used for both the $watch() api and directives.
  */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this; // render-watcher 视图渲染的订阅者
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user; // 用户在option.watch 自定义的 watcher，即 user-watcher,
    this.lazy = !!options.lazy; // 用于标记 computed 中实例watcher, 即 computed-watcher
    this.sync = !!options.sync;
    this.before = options.before; // 组件 watcher 会传入这个属性，即isRenderWatcher=true
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers 标记 computed-watcher 是否需要重新计算值，还是使用缓存的值 watcher.value
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn; // comppute wathcer or render wathcer
  } else {
    this.getter = parsePath(expOrFn); // user wathcer
    if (!this.getter) {
      this.getter = noop;
      warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy 
    ? undefined // 如果是 computed-watcher，初始化不执行依赖收集。computed-watcher 只在视图解析读取 computed 值才会执行
    : this.get(); // 其它 user-watcher 和 render-watcher 创建依赖的同时，即触发依赖收集
};


/**
* Evaluate the getter, and re-collect dependencies.
*/
Watcher.prototype.get = function get () {
  // 以下三步在 get 函数内执行，可以确保当前 Dep.target 上保存着当前实例化的 watcher
  pushTarget(this); // Dep.target = this
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm); // 读取值，触发 getter，再触发 dep.depend()
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // 省略代码...
    popTarget(); // 恢复 Dep.target 之前的值，或者 Dep.target = undefined
  }
  return value
};

/**
  * Add a dependency to this directive.
  */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) { // wathcer 中已经持有某个依赖，也就说明该依赖的subs中也持有该 watcher ，所以不用添加。这样就避免重复
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
  * Depend on all deps collected by this watcher.
  */
Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
};
```

此时，在 getter 中的代码更改为：

```js
get: function reactiveGetter () {
  var value = getter ? getter.call(obj) : val;
  // 在这里进行依赖收集
  if (Dep.target) {
    Dep.target.depend(dep)
  }
  return value
},
```

Dep 类的增加 depend() 方法：
```js
Dep.prototype.depend = function depend () {
  /**
   * 该方法最关键的点： Dep.target = watcher，会在数据的 getter 中设置 pushTarget(this)
   * 并且添加依赖不是直接调 this.addSub，而是绕到 dep.append(wathcer) => watcher.addDep(dep) => dep.addSub(wathcer)
   * 之所以这样绕一圈，是因为既需要在 dep.subs 中持有全部 watcher，又需要在每个 watcher 的 depIds/deps 中持有所有的 dep。
   */
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};
```
所以总结起来：**new Watcher 创建一个依赖时，即完成依赖收集工作。**

## 依赖收集

具体路径：
1. watcer = new Watcher() 中执行 this.get()
1. get()中设置Dep.target值，并且执行 this.getter()，触发属性取值的 getter
1. getter()中执行 Dep.target.depend()，即 watcher.depend()，触发 deps中的每个 dep 执行 dep.depend()
1. dep.depend()中再次执行Dep.target.addDep(this),即 watcher.addDep(dep)，检查重复性，在 watcher 内部保存当前 dep，并调用 dep.addSub(watcher)
1. dep.addSub(watcher)执行this.subs.push(watcher)，完成依赖收集。

```js
// 1. watcer = new Watcher() 中执行 this.get()
new Watcher()

var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  // 省略代码...
  this.value = this.get(); // 这里会读取被观察对象的属性值，从而触发getter，进行依赖收集
};

// 2. get() 中设置 Dep.target 值，并且执行 this.getter()，触发属性取值的 getter
Watcher.prototype.get = function get () {
  // 以下三步在 get 函数内执行，可以确保当前 Dep.target 上保存着当前实例化的 watcher
  pushTarget(this); // Dep.target = this
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm); // 读取值，触发 getter，再触发 dep.depend()
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // 省略代码...
    popTarget(); // 恢复 Dep.target 之前的值，或者 Dep.target = undefined
  }
  return value
};

// 3. getter()中执行 Dep.target.depend()，即 watcher.depend()，
get: function reactiveGetter () {
  var value = getter ? getter.call(obj) : val;
  // 在这里进行依赖收集
  if (Dep.target) {
    Dep.target.depend(dep)
  }
  return value
},

// 4. 触发 deps中的每个 dep 执行 dep.depend()
Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
};

// 5. dep.depend()中再次执行Dep.target.addDep(this),即 watcher.addDep(dep)
Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

// 6. 检查重复性，在 watcher 内部保存当前 dep，并调用 dep.addSub(watcher)
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) { // wathcer 中已经持有某个依赖，也就说明该依赖的subs中也持有该 watcher ，所以不用添加。这样就避免重复
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) { // 确保该 watcher 没有被新 newDeps 也没有被旧 dep 收集过
      dep.addSub(this); // 触发依赖管理器收集当前依赖 watcher
    }
  }
};

// 7. dep.addSub(watcher)执行this.subs.push(watcher)，完成依赖收集。
Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};
```

## 数组的依赖收集

因为数组值的改变不会触发 setter 方法，而是从重写的方法中确发列新通知。所以数组的依赖管理器自然不能放在 `definedReactive$$1`函数的闭包属性中。需要一个地方让数组的getter方法能获取到，也要让重新定义的数组操作方法中能获取到的地方。

在 Vue 的实现，即将数组的依赖管理器定义为 Observer 的实例属性。
```js
var Observer = function Observer (value) {
  this.value = value;
  def(value, '__ob__', this);
  // 这个 dep 有两个作用: 1. 用于数组放置依赖；
  // 2. 在 user-watcher 定义 depp=true 时对下层对象值添加当前依赖，用于 traverse 深层遍历的优化
  this.dep = new Dep();
  this.vmCount = 0;
  if (Array.isArray(value)) {
    if (hasProto) { // var hasProto = '__proto__' in {};
      protoAugment(value, arrayMethods); // value__proto__ = arrayMethods
    } else {
      copyAugment(value, arrayMethods, arrayKeys); 
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    // __ob__ 是在 new Observer 时将当前observer绑定到 value，即 value.__ob__ = observer
    var ob = this.__ob__;
    
    // 如果是向数组中插入新值，则需要将该新值转为响应式
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    // notify change 数组的任何变化都需要触发依赖更新
    ob.dep.notify();
    return result
  });
});
```

## 递归收集依赖

```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  // 对 value 进行判断，如果是对象或数组递归处理，返回 ob 实例
  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) { // 如果当前一个嵌套对象，将让子对象也依赖当前依赖
          childOb.dep.depend();
          if (Array.isArray(value)) { // 是数组遍历数组每一项
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      // 这里还会触发 dep.depend()，如果去重？在 Dep.target.addDep(dep)会去判断当前dep是否已添加DepIds，然后 dep.addSub(watcher)
      var value = getter ? getter.call(obj) : val; 
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal); // 设置的新值 newVal 也需要转为响应式
      dep.notify(); 
    }
  });
}

function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

methodsToPatch.forEach(function (method) {
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__; // __ob__ 是在 new Observer 时将当前observer绑定到value，即value.__ob__=observer
    
    // 如果是向数组中插入新值，则需要将该新值转为响应式
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); } // 将插入的新值转为响应式

    ob.dep.notify();
    return result
  });
});
```

## 清理依赖

在 Wacther 实现中我们可以注意到有定义 `newDep/newDepIds` 和 `deps/depIds` 这两组变量。并且在 `prototype.get` 方法最后执行了 `this.cleanupDeps();`。

也就是说，每次完成依赖收集后都要作一次依赖清理，通过前后存储的 newDeps/deps来对比需要清理陈旧的依赖。

比如说下面代码：

```html
<div v-if="isShow">显示A {{ A }}</div>
<div v-else>显示B {{ B }}</div>
<script>
  data: {
    isShow: true,
    A: 'A',
    B: 'B'
  }
</script>
```
首次初始化时当 `isShow = true` 时，属性 A 的 dep 中的 subs 应该持有依赖: `[render-watcher]`，同样的 render-watcher 中的 deps 应该有一个 A的 dep： `[dep-a]`
但是当 `isShow = false`时，页面重新渲染，会读取到B，此时属性 B 的 dep 中 sub 应该持有渲染依赖：`[render-watcher]`，同样的 render-watcher 中的 deps 应该要添加 dep-b，但原来的 dep-a 是否还要保存着呢？因为此时 A 不被任何 watcher 订阅，所以不需要，此时就需要清理掉。然后所 dep-b 添加进去。

即 watcher 要实现一个 cleanupDeps 方法：
```js
/**
  * Clean up for dependency collection.
  */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) { 
      // 如果旧 dep.id 在新 newDepIds 不存在，即删除
      dep.removeSub(this);
    }
  }
  // 然后将新 newDep / newDepIds 转为 旧 dep/depIds。并将新 ndwDep/newDepIds 置空
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};
```

## 总结

1. 在 Vue 中什么是依赖：所谓依赖就是一个 Watcher 实例，dep 收集起来存入 subs 数组中的就是 watcher
2. 在 Vue 中 watcher 有三种：
   1. 组件渲染的 render-watcher，new Watcher 时会传入 isRenderWatcher = true
   2. 声明 computed 的每一个属性是 computed-watcher，标识符是 watcher.lazy = true
   3. 自定义 watch 的每一个属性是 user-watcher，标识符是 watcher.user = true

3. 要关注它们的区别：
   1. render-watcher 作为组件依赖，触发 dep.depend 去收集的时机是在每一个 data / computed / props / inject 的 getter
   2. computed-watcher 作为计算属性依赖，触发 dep.depend 去收集的时机是 vm._render　函数调用过程中执行 _createElement 函数调用各类辅助函数 _c / _s / _v 等，即模板渲染时
   3. user-watcher 作为用户自定义依赖，触发 dep.depend 去收集的时机是它自身被创建时。只有 user-watcher 是创建依赖即完成依赖收集。



