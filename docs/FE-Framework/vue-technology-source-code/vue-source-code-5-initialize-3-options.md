# options 处理

[[toc]]

这一节主要理解 vue 实例化或组件实例化过程中，对 options 中各个字符的处理。比如定义一个组件常用到的 options 包括：

```js
<script>
export default {
  name: 'Child',
  components: {},
  directives: {},
  filters: {},
  extend: {},
  mixins: {},
  props: {},
  provide: {},
  inject: {},
  data() { return {}},
  computed: {},
  watch: {},
  methods: {},

  lifecycle hooks
}
</script>
```
入口还是从 new Vue 开始，然后调用 Vue.prototype._init 函数执行实例化。

```js
function Vue (options) {
  if (!(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

/**向 Vue.prototype 原型对象上挂载方法 */
initMixin(Vue); // Vue.prototype._init()
stateMixin(Vue); // Vue.prototype.$set = set / Vue.prototype.$delete = del / Vue.prototype.$watch() { new Watcher() }
eventsMixin(Vue); // Vue.prototype.$on / Vue.prototype.$once / Vue.prototype.$off / Vue.prototype.$emit
lifecycleMixin(Vue); // Vue.prototype.$forceUpdate / Vue.prototype.$destroy / Vue.prototype._update => vm.__patch__
renderMixin(Vue); // Vue.prototype.$nextTick / Vue.prototype._render
initGlobalAPI (Vue) // 全局api挂载 Vue.config/Vue.option / Vue.set / Vue.delete / Vue.nextTick / Vue.observable / Vue.use / Vue.mixin / Vue.components / Vue.directives / Vue.filters / Vue.extend 等
```

## 0. 入口 Vue.prototype._init

这里我们关注 initMixin(Vue) 函数中定义的 _init 函数。

```js
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options 合并处理 option
    if (options && options._isComponent) { // 如果是组件
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else { // 本例到这里
      // 合并配置，将实例 vm.options 与 全局 Vue.options 合并，所以在全局注册的内容在各个组件也能调用。
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
 
    // expose real self
    vm._self = vm;
    initLifecycle(vm); // 挂载内部属性：$root/$parent/$refs=[]/$children=[]/_watcher=null，以及一些生命状态标志 flag: _inactive=null/_isMounted=false/_isDestoryed=false/_isBeingDestoryed=false
    initEvents(vm); // 挂载父组件传入的事件监听器 listeners 到实例 vm._events 对象上，来源于 template 解析到的 v-on 绑定的事件函数
    initRender(vm); // 挂载 $attrs/$listeners，以及绑定 _c/$createElement
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props 1. 解析 inject 属性的数据 resolveInject，从 _provided 取出值；2. 并将其在当前实例上转为getter/setter同时挂载到 vm 上，因为inject只读，所以setter是一个打印警告的自定义函数 warn
    initState(vm); // 初始 script 中的属性：initProps/initMethods/initData/initComputed/initWatch
    initProvide(vm); // resolve provide after data/props 将 provide 对象或函数赋值给 vm._provided 属性，供 initInjections 中使用
    callHook(vm, 'created');

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```
_init 函数的第一步合并配置在上一节已经拆解过了，主要区分是 Vue 实例化还是组件实例化。[合并配置](/FE-Framework/Vue/vue-source-code-5-initialize-2-mergeOptions.html)

## 1. mergeOptons 处理 extends / mixins
这合并配置这一步，会将 export default 导出的对象选项合并到 vm.$options 中。并在 meergeOptions 中处理了选项中的 extends 和 mixins 字段。

```js
function mergeOptions (parent, child, vm) {
  // 省略代码
  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  // mergeOptions 的第二种作用：
  // 针对 extends 或 mixins 的合并，因为Vue实例都有 options.__base = Vue 属性
  // 在 initMixin$1 和 initExtend  中调用。
  if (!child._base) { 
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  // 省略代码
}
```

最后相当于
```js
vm.$options = {
  name: 'Child',
  components: {},
  directives: {},
  filters: {},
  props: {},
  provide: {},
  inject: {},
  data() { return {}},
  computed: {},
  watch: {},
  methods: {},
  lifecycle hooks
}
```
然后依次向下执行一系列实例化函数。

## 2. initInjections 和 initProvide 处理 provide / inject

```js
// 将 options.provide 的值挂载到 vm._provided
function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false); // 关闭响应式处理，因为 inject 的值在父组件 provide 传入前已是响应式
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      // 从下向下循环遍历得到 父组件的parent._provided 值，与 initProvide 呼应
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}
```
## 3. initState

剩余选项都在 initState 函数内处理。

```js
function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```
## 4. initProps 处理 props

这里对 props 的作用了一层 proxy 代理。 `vm[propKey] = vm._props[propKey]`

```js
function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm); // 对 props 各种形式的验证，值 value = propsData[key]
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}
```

## 5. initMethods 处理 methods

initMethods 处理较为简单，第一步校验不能与 prop 和 vue 保留字重名，第二步直接将方法挂载到 vm 上。
```js
function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}
```

## 6. initData 处理 data

1. 校验 data 结果必须是普通的对象结构
1. 校验 data 的 key 不能与 props / methods / 保留字 重名
1. proxy 代理 data，即 vm[key] = vm._data[key]
1. 将 data 转为响应式的 getter / setter，即 observe(data)，关于 Vue 响应式过程请查看 [响应式原理](/FE-Framework/Vue/vue-source-code-1-reactivity-1-detection-chnage.html)

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
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) { // 以 & 或 _ 开头的 key 作为保留属性，外部不能定义
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```
## 7. initComputed 处理 computed

computed 定义的值为什么具有缓存能力
- 因为声明的每个 computed 都有对应实例一个 watcher 存放在 computedWatcher 中，并在首次调用 getter 进，会将该 watcher　添加到其依赖的 Dep 实例中。
- 每个 computed 的 getter 都重写了，在getter调用时，会读取对应的 watcher，在返回 watcher.value，之前会通过 watcher.dirty 值判断是否需要更新当前coputed的值。
- 在某个依赖值变化时，setter 中调用 dep.notify(),遍历其依赖 watcher，调用watcher.update(), 在其中会通过 watcher.lazy 的值判断是否是computed的watcher，如果是将 watcher.dirty = true。这样下次调用 computed 时返回 watcher.value 之前会根据 dirty = true，调用 watcher.evaluate() 重新获取 watcher.get()的值更新到 watcher.value

所以说 computed 的值缓存在其对应的 computed-watcher 的 watcher.value 中，而 watcher.dirty 控制了值是否需要更新。

```js
var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate(); 
        // 这里执行会获取computed 的getter，执行时也会触发函数内依赖数据的getter，所以此时 targetStack=[render-watcher, computed-watcher]
        // 当读取计算属性依赖的数据的 getter 时，会将 computed-watcher 添加到其 dep.subs中，同时将该dep 添加到 computed-watcher 的 deps 中。
      }
      if (Dep.target) { // 此时 Dep.target 是 render-watcher
        watcher.depend();
        // 遍历 computed-watcher 中被添加 deps，执行dep.depend，即将 render-watcher 添加到了每个依赖项 dep 中。
        // 此时computed所依赖的每个数据dep中subs=[computed-watcher, render-watcher]，并且顺序也是重要的，因为queueWatcher中需要排序。
        // 到此完成一个computed的依赖收集，某个数据的改变会先触发computed-watcher的update，保证dirty=true，然后再执行render-watcher时，能获取最新的computed的value
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}
```

## 8. initWatch 处理 watch

```js
function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

```

而 vm.$watch 调用的是实例原型上的方法，即 Vue.prototype.$watch，此方法在 Vue 构造函数初始化时声明的。

```js
// stateMixin(Vue)
Vue.prototype.$watch = function (
  expOrFn,
  cb,
  options
) {
  var vm = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {};
  options.user = true;
  var watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
    }
  }
  return function unwatchFn () {
    watcher.teardown();
  }
};
```
最后关于 Wtcher 类的定义，请查看前面关于响应式的理解 [Vue 响应式原理](/FE-Framework/Vue/vue-source-code-1-reactivity-2-collect-dependency.html)

## 9. callHook 调用 lifycycle hooks

关于 Vue 生命周期的调用时机，请查看前 [生命周期调用](/FE-Framework/Vue/vue-source-code-6-extension-1-lifecycle.html)
