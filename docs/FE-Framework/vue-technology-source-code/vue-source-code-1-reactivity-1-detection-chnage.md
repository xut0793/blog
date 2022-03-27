# 响应式原理1：侦测数据变化

[[toc]]

对 Vue 框架的使用，最大的好奇应该就是为什么改变一个数据值，视图界面就会自动更新吧。

比如下面这个简单的例子：点击事件只对变量 message 赋值，没有操作任何 DOM 元素内容，但视图显示内容也会自动更新。这就是 Vue 最大的特点：**视图渲染与数据状态自动关联。**

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

对上面的例子，我们保持两个疑问：
1. message 作为 data 对象的属性，为什么可以直接通过 `this.message` 操作，而不是 `this.data.message`;
1. message 的值变了，为什么视图中 DOM 内容也会自动变；

数据状态改变，要让视图也进行更新，那前提必然是我们能够捕获到当前变化的数据。这个捕获主要是基于 JavaScript 语言提供的 `Object.defineProperty` 这个 API。

## 对象的访问器属性 getter / setter

> 参考：[对象属性及其操作](/FE-Language/ES/oop-2-object-property.html)

JavaScript 语言中对象属性有两种形式
- 数据属性
- 访问器属性

```js
// 下面 data 对象属性 name 就是数据属性，
// 属性 age 就是访问器属性，定义 age 的 getter / setter
const data = {
  name: 'tom',
  get age() {
    return 18
  }
  set age() {
    console.log(`The girl's age has always been 18` )
  }
}
```
这里最关键的部分就是，在 JS 中通过 `Object.defineProperty` 方法可以将对象的数据属性转为访问器属性。

```js
/**
 * 如果目标对象target_obj本身已经存在prop属性，那么修改该对象的现有属性， 并返回这个对象。
 * 如果目标对象上没有这个属性，那么会直接在目标对象上定义这个新属性，并返回这个对象。
 *
 * @params {Object} target_obj 目标对象
 * @params {String} prop 要定义或修改的属性名称
 * @params {Object} descriptor 将要被定义或修改的属性描述符
 * @params {Boolean} descriptor.enumerable 属性能不能被枚举，即for-in 或 in 语句能不能遍历它
 * @params {Boolean} descriptor.configurable 属性能不能做其它配置，比如删除属性，或者重新定义属性描述符等
 * @params {Boolean} descriptor.writable 数据属性的 value 是不是只读，即这个属性值能不能被赋值
 * @params {*} descriptor.value 数据属性的 value 值
 * @params {Function} descriptor.get 访问器属性的 getter，用于获取属性值
 * @params {Function} descriptor.set 访问器属性的setter，用于设置属性值
 * @return {Ojbect} 返回属性定义或修改后的目标对象
 */
Object.defineProperty(target_obj, prop, descriptor)
```
> JS 对象属性中还有一个概念：[属性描述符 descriptor](/FE-Language/ES/oop-2-object-property.html#属性描述符)

我们看下，如何将数据属性 name 转为访问器属性，一般也称为定义 name 的 getter / setter。

```js
Object.defineProperty(data, 'name', {
  enumerable: true,
  configurable: true,
  get () {
    return 'tom'
  },
  set (newValue) {
    console.log(`set newValue: %s`, newValue)
  }
})
```
看上面代码，我们设置 name 属性执行了 setter 方法，并不能把 newValue 设置成功，因为再次通过取值器 getter 获取不到新值。解决方案可以通过包装一层函数，通过闭包函数来缓存中间 value 的值。

```js
function defineReactive(target, key) {
  let value = target[key]

  Object.defineProperty(obj, 'name', {
    enumerable: true,
    configurable: true,
    get () {
      return value
    },
    set (newValue) {
      value = newValue
    }
  })
}

defineReactive(data, 'name')
```

了解了上面的基础内容，我们再看源码中该函数的实现就可以看懂了（省略一些其它代码逻辑）：

```js
// 源码 vue 版本 2.6.12
/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {

  // 取出目标对象key属性的属性描述符，判断其 descriptor.configurable 是否可配置，比如 Object.frezze(obj) 冻结的对象就是不可配置的
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // 如果该属性本身是访问器属性，则判断该访问器属性的 getter / setter 是否存在
  // 如果该属性是数据属性，即 getter = undefined，则直接取值 obj[key]
  // val 就是充当 getter / setter　中介的闭包函数内的缓存变量
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      // 省略部分代码
      return value
    },
    set: function reactiveSetter (newVal) {
      // 取出旧值，如果旧值与新值相等，或者新值和旧值都是 NaN，则直接返回
      var value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (getter && !setter) { return } // 只定义 getter，没有定义setter 的属性不能赋值
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 省略其它代码
    }
  });
}
```

## 侦测对象的变化

将对象的每个属性都用 `defineReactive$$1` 方法重新定义一遍，这样对对象属性的读取和设置我们就可以实现捕获了。无非就是在每个 getter / setter 函数中增加一些我们需要的操作逻辑：

```js
// 源码 vue 版本 2.6.12
/**
  * Walk through all properties and convert them into
  * getter/setters. This method should only be called when
  * value type is Object.
  * 
  * 将所有对象属性都转为 getter/setter，该方法只适用于对象类型
  */
function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

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
      console.log('setter is called, and value is changed')
    }
  });
}
```

## 侦测数组的变化

如果某个属性值是数组形式：

```js
const obj = {
  list: [1,2,3]
}
```
那我们对数组的操作通常是调用数组的方法，而不是直接通过赋值。类似这样

```js
obj.list.push(4)
console.log(obj.list)
```
此时，我们调用函数`defineReactive$$1(obj, 'list`) 转换后，`console.log(obj.list)`读取数组仍会触发 getter，但之前通过数组方法改变对象属性值的操作不再触发 setter 了，这时就不能捕获 list 属性的改变了。我们需要想其它方法来解决这个问题。

vue 采用的方法就是重写那些会改变原数组内容的方法。这里涉及的知识点主要是对象原型、原型链相关的知识。

>沿着对象原型链查找对象属性，如果在某个原型对象上找到该属性，则返回。所以可以在原型链中插入一个新原型对象，重写部分同名的方法。

```js

var arrayProto = Array.prototype; // 将原生的数组原型对象进行缓存
var arrayMethods = Object.create(arrayProto); // 以原生数组原型对象为原型创建一个新对象

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
  * Intercept mutating methods and emit events
  * 在新的原型对象上定义同名的方法，以实现拦截
  */
methodsToPatch.forEach(function (method) {
  // cache original method　从缓存的原型对象中获取原生方法
  var original = arrayProto[method];　
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    
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
    // 省略部分逻辑，这样能捕获改变数组内容的方法的操作，类似对象中 setter 的作用
    console.log(`arr value is changed: %s`, inserted)
    return result
  });
});

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
```

所以我们在转化一个对象成响应式对象时，就要对对象属性值进行判断是数组还是其它：

```js
if (Array.isArray(value)) {
  // 如果是数组，就重写该数组的原型对象
  value__proto__ = arrayMethods
} else {
  // 其它类型就直接定义 getter / setter
  this.walk(value);
}
```

## Observer 类：统一定义数据响应式

一个对象转成响应式对象，至少需要做以下操作：
1. 遍历对象的每个属性
1. 判断每个属性值是数组还是其它，采用不同的操作
1. 如果是嵌套对象，或者数组元素中还有对象或数组元素，还要递归处理
1. 如果某个属性已经被处理，则不需要再处理

所以以上操作，封装成一个 Observer 类，来统一处理上述逻辑

```js
// 源码 vue 版本 2.6.12
/**
  * Attempt to create an observer instance for a value,
  * returns the new observer if successfully observed,
  * or the existing observer if the value already has one.
  * 
  * 尝试为一个值创建一个 observer 观察者实例
  * 如果当前值是否已经有一个实例（value__ob__)，则返回该实例，否则新建一个 new Observer返回
  */
function observe (value, asRootData) {
  // isObject(value) {return obj !== null && typeof obj === 'object'}
  // 非对象类型数据或者 VNode 类型退出
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) { 
    // 如果 value.__ob__存在，且为 Observer 实例，则返回原来的__ob__
    ob = value.__ob__;
  } else if (
    shouldObserve &&                                                                       // 可以被观察
    !isServerRendering() &&                                                                // 不是服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) &&        // 是数组或者普通对象，且对象可扩展
    !value._isVue                                                                          // 不是Vue实例
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {  // 是观察实例的 options.data 数据时，asRootData=true。查看initState(vm)/initData(vm)
    ob.vmCount++;
  }
  return ob
}

/**
  * Observer class that is attached to each observed
  * object. Once attached, the observer converts the target
  * object's property keys into getter/setters that
  * collect dependencies and dispatch updates.
  * 
  * 1. 设置 value.__ob__ = this
  * 2. value 是数组，调用 this.observeArray(value)
  * 3. value 是对象，调用 this.walk(value)，（如果命名 observerObject 更好理解也与数组统一）
  */
var Observer = function Observer (value) {
  this.value = value;
  def(value, '__ob__', this);
  this.vmCount = 0;
  if (Array.isArray(value)) {
    if (hasProto) { // var hasProto = '__proto__' in {};
      protoAugment(value, arrayMethods); // value.__proto__ = arrayMethods
    } else {
      copyAugment(value, arrayMethods, arrayKeys); 
      // var arrayKeys = Object.getOwnPropertyNames(arrayMethods) 返回指定对象的所有自身属性的属性名,包括不可枚举的属性（enumberable:false)。Object.keys()只能获取可枚举的属性
      // 然后逐个复制
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
  * Walk through all properties and convert them into
  * getter/setters. This method should only be called when
  * value type is Object.
  */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
  * Observe a list of Array items.
  */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {

  // 取出目标对象key属性的属性描述符，判断其 descriptor.configurable 是否可配置，比如 Object.frezze(obj) 冻结的对象就是不可配置的
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // 如果该属性本身是访问器属性，则判断该访问器属性的 getter / setter 是否存在
  // 如果该属性是数据属性，即 getter = undefined，则直接取值 obj[key]
  // val 就是充当 getter / setter　中介的闭包函数内的缓存变量
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      // 省略部分代码
      return value
    },
    set: function reactiveSetter (newVal) {
      // 取出旧值，如果旧值与新值相等，或者新值和旧值都是 NaN，则直接返回
      var value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (getter && !setter) { return } // 只定义 getter，没有定义setter 的属性不能赋值
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal); // 设置的newVal也需要转为响应式
      // 省略其它代码
    }
  });
}

// helpers 工具方法
/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
  * Augment a target Object or Array by intercepting
  * the prototype chain using __proto__
  */
function protoAugment (target, src) {
  target.__proto__ = src;
}

/**
  * Augment a target Object or Array by defining
  * hidden properties.
  */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
```

## proxy 属性访问的代理

```js
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
1. message 作为 data 对象的属性，为什么可以直接通过 `this.message` 操作，而不是 `this.data.message`;

实际上 Vue 内部解析得到 options.data 的值都赋予了内部属性 `_data`，`this.message = this._data.message`。具体源码实现如下：

```js
function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};

  if (!isPlainObject(data)) {
    data = {};
    warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    // 不能与已经定义的方法重名 methods
    if (methods && hasOwn(methods, key)) {
      warn(
        ("Method \"" + key + "\" has already been defined as a data property."),
        vm
      );
    }
    // 不能与已经定义的 props 重名
    if (props && hasOwn(props, key)) {
      warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) { // 以 & 或 _ 开头的 key 作为保留属性，外部不能定义
      // 对 data 中的每一个 key 作一层代理
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```
```js
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
// vm.key = vm._data.key
```

除了 options.data 作了 proxy 代理外，options.prop 也是作了同样的代理。