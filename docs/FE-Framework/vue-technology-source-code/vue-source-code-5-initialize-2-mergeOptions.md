# 合并配置

Vue 实例化主要是两种场景：
- 外部调用 `new Vue`实例化主应用 APP 时
- 内部创建组件时 `new vnode.componentOptions.Ctor(options)`

从模板编译时的分析 `vm._render => _createElement => createComponent => Ctor = baseCtor.extend(Ctor)`，可以看到创建组件的构造函数 Ctor 是继承于 Vue 构造函数的，通过 `Vue.extend` API，所以 new 时调用的都是 `this._init` 函数。

```js
Vue.prototype._init = function (options?: Object) {
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  // 省略代码...
}
```
这里可以看到，`new Vue` 时，配置合并调用的是 `mergeOptions` 函数，而如果是组件实例化，则调用 `initInternalComponent`函数。

## Vue 实例化配置合并 mergeOptions

new Vue 实例化时 _init 中调用：mergeOptions
```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor), // 拿到 Vue.options
  options || {},
  vm
)
```
其中 `resolveConstructorOptions(vm.constructor)` 的主要作用是拿到合并 Vue.options

```js
function resolveConstructorOptions (Ctor) { // Vue
  var options = Ctor.options; // new Vue 时，拿到 Vue.options，定义在 initGlobalAPI 中
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super); // 递归，最终拿到 Vue.options，定义在 initGlobalAPI 中
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}
```
现在在看 mergeOptions 函数，它主要有两个作用：
- Vue 实例化时的配置合并
- extend 或 mixins 时的配置合并

```js
function mergeOptions (
  parent, // Vue.options 在 initGlobalAPI 中定义
  child,  // new Vue(options) 时传入的 options
  vm
) {
  // 从 vm.options.components 中取出key，校验名称的合法性。不能与 HTML5 标签名以及 Vue 内置保留的名称相同
  checkComponents(child);

  if (typeof child === 'function') {
    child = child.options;
  }

  // 规范化 props / inject / directives，因为这些选项都有不同使用形式
  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

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

  var options = {};
  var key;
  // 将父构造器即 Vue 上的 options 复制到 options 中
  for (key in parent) {
    mergeField(key);
  }
  // 在父构造器即 Vue 上的 options 没有，但子组件上有定义的 option 赋值到 options 中
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  // strat 定义了各种字段的合并策略，比如 data / methods 在 new Vue 时要传入对象，hooks 是函数
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }

  return options
}
```

## 组件实例化配置合并 initInternalComponent

再复习下组件创建过程：
1. 构建组件的构造函数 Sub：`vm._render => _createElement => createComponent => Ctor = baseCtor.extend(Ctor) => new VNode(...) => vnode.componentOptions =  { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }`
1. 实例化组件: `vm._update => vm.__patch__ => patch =>createPatchFunction => createElm => createComponent => i(vnode,false) => createComponentInstanceForVnode(vnode, activeInstance) => new vnode.componentOptions.Ctor(options)`

所以看下 Ctor 构造函数创建时定义的 options

```js
/**
 * export default {
 *   name: 'app',
 *   components: {
 *     HelloWorld
 *   }
 * }
 * extendOptions 就是 export default 导出对象
*/
Vue.extend = function (extendOptions) {
  extendOptions = extendOptions || {};
  var Super = this;
  var SuperId = Super.cid;
  // 避免多次执行 Vue.extend 的时候对同一个组件重复构造。
  var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  var name = extendOptions.name || Super.options.name;
  if (name) {
    validateComponentName(name);
  }

  // 经典的对象原型继承
  var Sub = function VueComponent (options) {
    this._init(options); // 实例化时执行 Vue._init 一样的逻辑
  };
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constructor = Sub;

  Sub.cid = cid++;
  Sub.options = mergeOptions(
    Super.options, // Vue.options 在 initGlobalAPI 定义
    extendOptions // 组件定义 export default 对象
  );
  Sub['super'] = Super;

  // 省略代码...
  return Sub
};
}
```

再看下 `new vnode.componentOptions.Ctor(options)` 实例化时定义的 options
```js
function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}
```

最后看下，在 `_init` 函数内调用 `initInternalComponent(vm, options)`时， options 的处理，这样 options 的来源就清晰了：
```js
function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options); // Sub.options
  // doing this because it's faster than dynamic enumeration.
  // 比直接调用 new Vue 中 mergeOptions 动态合并选项更快。
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```