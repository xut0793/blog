# 组件1：组件继承 extend

1. 组件的构建的全局 API：`Vue.extend(options)`

但在实际型业务项目中很少使用 `extend` API 的形式声明组件，普遍以`.vue`后缀的单文件组件来声明组件，模板编译时内部会调用同样的 API 来创建组件对象。
```js
const MyChild = Vue.extend({
  template: `<p>{{ childMsg }}</p>`
  data() {
    return {
      childMsg: 'This is a child component'
    }
  }
})
```
2. 组件创建后，需要注册，分全局注册和局部注册，这是较为普遍的注册组件的做法。
```js
// 全局注册组件，并且必须在new Vue()之前
Vue.component('MyChild', MyChild)

// 局部注册组件，使用 components 属性
export default {
  name: 'App',
  components: {
    MyChild
  }
}
```
另一种语法简写形式，在注册的同时创建组件，在Vue 内部会解析 extend 函数入参类型。但这种形式在实现项目中较少直接声明组件。
```js
// 全局注册组件
Vue.component('MyChild', {
  data: () => {
    return {
      msg: 'this is a child component'
    }
  },
  template: `<p>{{ msg }} by Vue.component`
})

// 局部注册组件
export default {
  name: 'App',
  components: {
    MyChild: {
      data: () => {
        return {
          msg: 'this is a child component'
        }
      },
      template: `<p>{{ msg }} by Vue.component`
    }
  }
}
```

## 生成组件构建函数

上一节模板渲染时 `vm._render` 最终调用函数`_createElement`来创建 VNode，其中会解析传入的 tag 来判断是生成 VNode 还是调用 `createComponent`函数生成组件：
```js
function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  // 省略部分代码：解析data/childrend等代码
  if (!tag) {
    // in case of component :is set to falsy value 动态组件没有 is 值时创建空注释节点
    return createEmptyVNode()
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    if (config.isReservedTag(tag)) {
      // platform built-in elements tag 是预定义的元素标签，则直接生成 vnode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component 如果 data 未赋值，且在 components 属性上有定义键为tag的构建函数，则直接创建组件，
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
    // direct component options / constructor 如果 tag 不是字符串类型，则直接创建组件
    // 比如：{render: h => h(App)}
    vnode = createComponent(tag, data, context, children);
  }
}
```
`createComponent` 函数主要逻辑：
1. 构建组件的构建函数
1. 解析组件的options，以及组件特有的选项，如 propData / slot / listeners 等
1. 安装组件钩子函数
1. 生成 VNode 返回

```js
function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) { // Ctor: 一个组件构造函数 或者 tag 字符串，如果 Ctor 为 undefined 或 null 直接退出
    return
  }

  var baseCtor = context.$options._base; // Vue.options._base = Vue，所以 baseCtor 就是 Vue 构造函数

  // plain options object: turn it into a constructor
  // 如果传入的 Ctor 是一个对象，则直接使用 Vue.extend(Ctor) 构建组件。单文件组件 export default 导出的就是一个对象
  /**
   * mport HelloWorld from './components/HelloWorld'
   * 
   * export default {
   *   name: 'app',
   *   components: {
   *     HelloWorld
   *   }
   * }
   */
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // 省略代码：解析其它数据 data / propsData / listeners / slot 等逻辑，以及安装组件钩子函数

  // return a placeholder vnode 生成 VNode 返回
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}
```
再看看 `Vue.extend` 函数，在 `initGlobalAPI(Vue)` 函数里的 `initExtend(Vue)` 里定义

```js
function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique cid. 
   * This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   * 
   * 每个实例构建函数都有一个唯一的 cid，便于缓存
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
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
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 初始化组件的 props / computed
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor 以父组件id为key缓存当前组件
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key); // props 属性的调用同 data 一样作了一层代理，this.key = this._props.key
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
```



