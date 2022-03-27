# 生命周期 lifecycle

[[toc]]

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置数据监听、编译模板、挂载实例到 DOM、在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。

![lifecycle](../image/vue_lifecycle.jpg)


## callHook

源码中最终执行生命周期的函数都是调用 `callHook` 方法：
```js
function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  // 每个 hook 的 handlers 是数组，因为 mixins 混入时一般都会存在生命周期钩子调用，组件内也会调用，所以组成选项合并时处理成数组
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}
```
```js
// 钩子函数的回调调用时捕获错误
function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}
```

## beforeCreate & created

`beforeCreate` 和 `created` 函数都是在实例化 Vue 的阶段，在 _init 方法中执行的。
```js
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // 省略代码...
    // expose real self
    vm._self = vm;
    initLifecycle(vm); // 挂载内部属性：$root/$parent/$refs=[]/$children=[]/_watcher=null，以及一些生命状态标志 flag: _inactive=null/_isMounted=false/_isDestoryed=false/_isBeingDestoryed=false
    initEvents(vm); // 挂载父组件传入的事件监听器 listeners 到实例 vm._events 对象上，来源于 template 解析到的 v-on 绑定的事件函数
    initRender(vm); // 挂载 $attrs/$listeners，以及绑定 _c/$createElement
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props 1. 解析 inject 属性的数据；2. 并将其设置响应式（即k-v转为getter/setter）同时挂载到 vm 上
    initState(vm); // 初始 script 中的属性：initProps/initMethods/initData/initComputed/initWatch
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    // 省略代码...
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```
## beforeMount & mounted

```js
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

function mountComponent (
  vm,
  el,
  hydrating
) {
  // 省略代码...
  vm.$el = el;
  callHook(vm, 'beforeMount');

  var updateComponent; // updateComponent = function () { vm._update(vm._render(), hydrating); };

  // 省略代码：updateComponet 声明和 render watcher 创建

  // vm.$vnode == null 表明这不是一次组件的初始化过程，因为组件通常有父组件，即 $vnode 不为空。项目中只有通过外部 new Vue 初始化全局实现时 $vnode == null。
  // 对于组件的 mounted 时机是在 patch 过程中
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}
```
注意上面 `vm.$vnode == null`条件的判断，表明这不是一次组件的初始化过程，因为组件通常有父组件，即 $vnode 不为空。项目中只有通过 new Vue 初始化全局实现时 $vnode == null。

## 组件的创建和挂载

组件的各个生命周期定义在 componentVNodeHooks 对象中，在 invokeInsertHook 函数中调用，而invokeInsertHook 函数在 patchVnode 函数中被调用，即在 vm.update 中调用 patch 函数。
```js
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

// invokeInsertHook 函数在 patchVnode 函数中被调用，即在 vm.update 中调用 patch 函数
function invokeInsertHook (vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue;
  } else {
    for (var i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i]);
    }
  }
}
```

## beforeUpdate & updated

`beforeUpdate` 和`updated` 在 wtcher 创建和执行时被调用

```js
// beforeUpdate 传入在 render watcher 创建时，即 mountComponent 函数中
function mountComponent ( vm, el, hydrating) {
  vm.$el = el;
  // 省略代码...
  callHook(vm, 'beforeMount');


  // 创建 render watcher 时，传入 before
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // vm.$vnode == null 表明这不是一次组件的初始化过程，而是我们通过外部 new Vue 初始化过程。
  // 对于组件的 mounted 时机是在 patch 过程中
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

// Watcher 定义中
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  // 省略代码...
  if (options) {
    this.before = options.before; // 组件 watcher 会传入这个属性，即isRenderWatcher=true
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
};
```
然后在数据变动触发 setter 中调用 dep.notify => watcher.update => queueWatcher => flushSchedulerQueue

```js
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  queue.sort(function (a, b) { return a.id - b.id; });

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before(); // 即 this.before, 即 new Watcher 时传入 callHook(vm, 'beforeUpdate')
    }
    
  // 省略代码...

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue); // callHook(vm, 'updated')

}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

## beforeDestroy & destroyed

beforeDestroy 和 destroyed 钩子函数的执行时机在组件销毁的阶段，即 $destroy 方法

```js
Vue.prototype.$destroy = function () {
  var vm = this;
  if (vm._isBeingDestroyed) {
    return
  }
  callHook(vm, 'beforeDestroy');
  vm._isBeingDestroyed = true;
  // remove self from parent 1. 取消父子关联
  var parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // teardown watchers 2、注销所有 watcher
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  var i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  // 3. 触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 destroy 钩子函数执行顺序是先子后父，和 mounted 过程一样
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, 'destroyed');
  // turn off all instance listeners.
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

## activated & deactivated

activated 和 deactivated 钩子函数是专门为 keep-alive 组件定制的钩子。基本同普通组件类似，在上面的 componentVNodeHooks 中都有一个判断：
```js
// componentVNodeHooks 对象中的 insert 函数
if (vnode.data.keepAlive) {
  if (context._isMounted) {
    queueActivatedComponent(componentInstance);
  } else {
    activateChildComponent(componentInstance, true /* direct */);
  }
}

// componentVNodeHooks 对象中的 destroy 函数
if (!vnode.data.keepAlive) {
  componentInstance.$destroy();
} else {
  deactivateChildComponent(componentInstance, true /* direct */);
}
```

