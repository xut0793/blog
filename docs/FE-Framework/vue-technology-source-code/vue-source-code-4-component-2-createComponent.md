
## 组件2：实例化组件

模板渲染时 `vm._render` 最终调用函数`_createElement`来调用 `createComponent`函数生成组件的 VNode。在组件挂载时更新的回调函数`updateComponent`：

```js
updateComponent = function () {
  vm._update(vm._render(), hydrating);
};
```
可以看到生成的组件 VNode 传给了 `vm._update` 函数来执行。在 [视图渲染2：patch 算法](/FE-Framework/Vue/vue-source-code-3-virtual-dom-2-patch.html)中有提到，通过这样的调用链：`vm._update => vm.__patch__ => patch =>createPatchFunction => createElm`，最终核心执行的是 `createElm`

所以来看下，`createElm` 函数对组件 VNode 的处理：

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // 省略代码...

  // createElm 无论怎样都尝试当成组件创建，观察是否成功。
  // 如果当前节点 vnode 不能作为组件创建返回 false，即往下继承执行
  // 如果当前节点是组件 vnode 则执行组件实例化，并返回 true，当前函数退出
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // 省略代码...
}
```

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  // 这里拿到的 vnode.data 是在 vm._render 函数中 createComponent 函数中创建返回的 vnode
  // 其中  installComponentHooks(data) 执行即安装了组件创建的钩子函数 vnode.data.hook
  var i = vnode.data;
  if (isDef(i)) {
    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // dsDef(i=i.hook)在执行的同时将 i 变为了 hook 对象，同样 isDef(i=i.init)便得最终 i= vnode.data.hook.init 函数
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      // init 函数执行处理了主要处理两件：
      // 1. new vnode.componentOptions.Ctor(options) 
      // 2. child.$mount(hydrating ? vnode.elm : undefined, hydrating); => mountComponent
      // 这样即使得在 createComponent 函数内即触发了组件 wathcer 的生成和组件编译和渲染 vm._update(vm._render())
      i(vnode, false /* hydrating */);
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true
    }
  }
}
```

```js
function installComponentHooks (data) {
  // data.hook = {}
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

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
  
  prepatch: function prepatch (oldVnode, vnode) {...},
  insert: function insert (vnode) {...},
  destroy: function destroy (vnode) {...}
}
```
init 函数执行是通过 createComponentInstanceForVnode 创建一个 Vue 的实例，然后调用 $mount 方法挂载子组件， 先来看一下 createComponentInstanceForVnode 的实现：
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
createComponentInstanceForVnode 函数：
1. 先是构造的一个内部组件的参数options，注意其中将 `_isComponent = true`;
1. 然后执行 new vnode.componentOptions.Ctor(options)。

这里的 vnode.componentOptions.Ctor 对应的就是子组件的构造函数，就是上一节分析了它实际上是继承于 Vue 的一个构造器 Sub，相当于 new Sub(options)。

这里有几个关键参数要注意几个点，_isComponent 为 true 表示它是一个组件，parent 表示当前激活的组件实例（注意，这里比较有意思的是如何拿到组件实例，后面会介绍。）

所以子组件的实例化就是在这个时机执行的，此时它会执行实例的 _init 方法，这个过程有一些和 `new Vue()`时执行 _init 方法不同的地方需要挑出来说：

```js
function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;


      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      
      // 省略代码...
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }
```
上面提到了组件实例化时构造的 options 中_isComponent 为 true，所以走到了 initInternalComponent 过程，看下这个函数的实现：

```js
function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
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
这个函数主要是将 createComponentInstanceForVnode 函数传入的关于父节点的参数合并到内部的选项 $options 里了。

由于组件初始化的时候是不传 el 的，因此`vm.$options.el = undefined`，所以组件是自己接管了 $mount 的过程。这个过程的主要流程在上面安装组件钩子函数componentVNodeHooks 的 init 钩子函数，在完成实例化的 _init 后，接着会执行 child.$mount(hydrating ? vnode.elm : undefined, hydrating) 。
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
  // 省略其它钩子函数
}
```
这里 hydrating 为 true 一般是服务端渲染的情况，我们只考虑客户端渲染，所以这里 $mount 相当于执行 child.$mount(undefined, false)：
```js
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

function mountComponent (vm, el, hydrating) {
  vm.$el = el;
  // 省略代码...
  callHook(vm, 'beforeMount');

  var updateComponent;

  updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);

  hydrating = false;

  return vm
}
```
在实现化组件的 render-watcher 过程中， 调用 this.get()，触发 updateComponent 函数执行，进而执行 vm._render() 方法，执行完 vm._render 生成 VNode 后，接下来就要执行 vm._update 去渲染 VNode 了。

在 _update 函数中有一定设置当前活动实现的代码：`var restoreActiveInstance = setActiveInstance(vm);` 和 `restoreActiveInstance();`

```js
Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };
```
```js
var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}
```
在 vm._update 的过程中，把当前的 vm 赋值给全局变量 activeInstance，同时通过 prevActiveInstance = activeInstance 用 prevActiveInstance 保留上一次的 activeInstance。实际上，prevActiveInstance 和当前的 vm 是一个父子关系，当一个 vm 实例完成它的所有子树的 patch 或者 update 过程后，activeInstance 会回到它的父实例，这样就完美地保证了 createComponentInstanceForVnode 整个深度遍历过程中，我们在实例化子组件的时候能传入当前子组件的父 Vue 实例，并在 _init 的过程中，通过 vm.$parent 把这个父子关系保留。

最后在 `createComponent` 函数中，init初始化完成后，执行 `insert(parentElm, vnode.elm, refElm);`，完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么DOM 的插入顺序是先子后父。

```js
// 该方法定义在 createPatchFunction 函数中，区别于 _render 中 crateComponent。
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  // data 是在 _createElement(context,tag,data,...) 中就传入的
  // 并且在 _render 函数中的 createComponent 中执行安装组件钩子函数 installComponentHooks(data);
  var i = vnode.data;

  if (isDef(i)) {
    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */); // 即 init(vnode, false)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true
    }
  }
}
```