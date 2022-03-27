# 视图渲染1：Virtual Dom 和 VNode

[[toc]]

## 什么是虚拟 DOM：virtual DOM

虚拟 DOM 就是一种将数据状态映射成视图的解决方案，它的动作原理是使用状态来生成虚拟节点 VNode，然后根据虚拟节点 VNode 创建真实 DOM 对象，最后插入视图，完成状态到视图的渲染过程。然后更新视图过程中，在渲染之前，会使用新生成的虚拟节点树与缓存的上一次的虚拟节点树进行对比，更新不同的部分到视图中。

将数据状态映射成视图的解决方案有很多，虚拟 DOM 只是其中一种而已。目前三大主注框架都有自己一套渲染方案，在 Angular 中就是脏检查流程，React 中使用虚拟 DOM，Vue 1.x 通过细粒度的绑定，回调中直接操作 DOM，但 Vue 2.x 采用了虚拟 DOM。 

## 为什么引入虚拟 DOM

引入虚拟 DOM 的原因，主要目的是为了提升程序性能。

在 WEB 环境下，真实 DOM 操作的执行速度远不如 JavaScript 的执行速度，因此把大量的 DOM 操作转移到 JavaScript 中，通过新老 Vnode 对比的算法找出真正需要更新的节点，最大限度减少了原生 DOM 操作，从而提升程序性能。本质上是使用 JavaScript 的运算成本替换 DOM 操作的执行成本，这样做能显著提升性能，所以这么做很划算。

例如，一个 ul 标签下有很多 li 标签，其中只有一个 li 的内容有变化。这种情况下最简单粗暴的做法是删除原来整个ul节点，生成一份新的节点树插入，实现更新。但其实，除了那个发生了内容变化的 li 节点外，其它节点都不需要重新渲染，造成浪费。

所以引入虚拟 DOM，在渲染视图前，通过生成的新旧节点树进行对比，找出真正需要更新节点来进行 DOM 操作，这样只需要重新渲染一个节点。

## Virtual DOM 做了什么

从整个渲染过程看，虚拟 DOM 在 Vue 框架内部实现中，主要做了以下事情：
- 创建与真实 DOM 节点所对应的虚拟节点 VNode
- 将虚拟节点 VNode 和上一次生成的虚拟节点 old VNode 进行对比，patching 算法，找到真正需要更新的节点
- 将需要更新的节点生成真实 DOM，并插入视图中。

## 虚拟节点 Virtual Node

虚拟节点是虚拟 DOM 方案中真正落地的内容，它可以理解为节点描述对象，指导了应该怎样去创建真实的 DOM 节点。

> 简单讲 VNode 就是一个 JavaScript 对象

```js
// VNode 构造函数
var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

// 生成一个文本节点
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// 生成一个注释节点
var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};
```

## Virtual Node 作用

1. 在 JavaScript 环境下模拟了真实 DOM
1. 实现性能优化：首次渲染的 VNode 进行缓存，之后更新过程中前后虚拟节点进行比较，找出只需要更新的节点来构建真实 DOM

## Virtual Node 类型

DOM 元素有多种不同的类型，对应的虚拟节点也有不同类型：
>本质上是 VNode 生成的实例中有效属性不同，无效属性值默认为 undefined 或 false，比如上面的文本节点和注释节点实例对象
1. 注释节点: text / isComment
1. 文本节点: text
1. 元素节点：tag / data / children / comtext
1. 组件节点: componentOptions / componentInstance
1. 函数式组件节点: functionContext / functionalOptions
1. 克隆节点: isCloned

## 创建 VNode 源码

```js
// 源码 vue 2.6.12
vm.$mount(vm.$options.el);
// 不同平台共用部分的 $mount，区别于模板编译开始时的 $mount
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// 挂载组件核心代码：vm._update(vm._render(), hydrating);
function mountComponent (vm, el, hydrating) {
  vm.$el = el;
  // 如果模板编译后，仍不存在 render 属性，则判断一个注释的空节点挂载
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

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

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

// vm.render 在初始化原型对象属性时生成
function renderMixin (Vue) {
  // install runtime convenience helpers
  // 模板编译用到的各类辅助函数，如 _v / _s / _c 等
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      // 在 web 平台 vm._renderProxy 就是 vm
      /**
       * 自定义 render 函数时，形参的 h 或者 createElement 就是这里代码调用
       * import APP from './src/APP.vue'
       * new Vue ({
       *  render(h => h(APP))
       * })
      */
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

// vm._createElement 在 new Vue 实例化时，this._init() 中 initRender()生成
function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // 内部模板编译调用
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 外部用户自定义 render 时调用
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  // 避免使用被观察的数据作为 vnode data
  if (isDef(data) && isDef((data).__ob__)) { // v !== undefined && v !== null
    warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  // 动态组件中 component 中 绑定 is 自定义 tag 
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};
```

