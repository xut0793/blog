# 从关联的选择器组件开发理解`vue`中`watcher`执行顺序 `queueWatcher`

## 明确需求

一个开发需求：将产品、项目、迭代三个下拉框选择器封装成一个联动选择器组件，类似下列布局
```
---------------------------------------------
| 请选择产品 V | 请选择项目 V | 请选择迭代 V |
---------------------------------------------
```
要求：
1. 产品选择器改变时：
  1. 如果选中某个产品，根据产品id，重新请求项目下拉数据，并且清空已选择的项目和迭代选择器
  2. 如果产品选择器是置空，则项目的下接数据和迭代的下接数据置为空数组，同时清空已选择的项目和迭代
2. 项目选择器改变时：
  1. 如果是选中了某个项目，根据项目id，重新请求迭代下拉数据，并且清空已选择的迭代值
  2. 如果是项目选择器置空，则同时将迭代下接数据置为空数组，并清空已选择的迭代值
3. 三个选择器作为整体，当一次改变时对外触发一次 emit('select-change') 事件。

在 HMTL 结构上，如果使用 vue template 写，大致如下，使用三个 el-select 选择器组件实现：
```html
<template>
<ul class="selector">
  <li class="selector-item">
    <span class="icon iconfont-hep">&#xe726;</span>
    <el-select
      v-model="params.product_id"
      key="productItem"
      placeholder="请选择产品"
      filterable
      @change="(v) => onSelectChange('product', v)"
    >
      <el-option
        v-for="item in productSelectData"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </el-option>
    </el-select>
  </li>
  <li class="selector-item">
    <span class="icon iconfont-hep">&#xe72c;</span>
    <el-select
      v-model="params.project_id"
      key="projectItem"
      placeholder="请选择项目"
      @change="(v) => onSelectChange('project', v)"
    >
      <el-option
        v-for="item in projectSelectData"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </el-option>
    </el-select>
  </li>
  <li class="selector-item">
    <span class="icon iconfont-hep">&#xe733;</span>
    <el-select
      v-model="params.sprint_id"
      key="sprintItem"
      placeholder="请选择迭代"
      @change="(v) => onSelectChange('sprint', v)"
    >
      <el-option
        v-for="item in sprintSelectData"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </el-option>
    </el-select>
  </li>
</ul>
</template>

<script>
export default {
  name: 'productProjectSprintSelector',
  data() {
    return {
      params: {
        product_id: '',
        project_id: '',
        sprint_id: '',
      },
      productSelectData: [],
      projectSelectData: [],
      sprintSelectData: [],
    }
  },
  methods: {
    onSelectChange(type, value) {
      console.log('select change type: %s, value: %s', type, value)
      this.$emit('select-change', this.params)
    }
  }
}
</script>

```

## 问题

在这个联动选择器的使用场景，通常作为列表数据的筛选器，某个选择值变化后，可重新请求列表数据。

实现的难点在于第三点：三个选择器作为整体，当一次改变时对外触发一次 emit('select-change') 事件，emit 事件触发肯定在 onSelectChange 函数中处理。

但矛盾点在于：
- 当产品选择改变时，因为要求重置已选择的项目和迭代，此时会导致 onSelectChange 事件分别触发三次，也就同时向外触发了三次 emit 事件，导致外部刷新列表的数据时发送了三次 http 请求。
- 同样的，当项目选择改变时，要求重置已选择的迭代，此时会导致 onSelectChange 事件触发二次，也就同时向外触发了二次 emit 事件，导致外部刷新列表数据时发送了两次请求。

但实际需求是产品改变或者项目改变，要求对外只触发一次列表数据更新，而要屏蔽掉其关联重置功能引起事件。

## 解决方案

最终的解决方案是取消在 el-select 上使用 onSelectChange 事件来处理，而使用 watch 监听事件处理。

```js
watch: {
  'params.product_id'(v) {
    this.params.product_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.project_id = ''
    this.params.sprint_id = ''
    this.projectSelectList = []
    this.sprintSelectList = []
    v ? this.httpGetSelectDataForProject() : null
  },
  'params.project_id'(v) {
    this.params.project_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.sprint_id = ''
    this.sprintSelectList.value = []
    v ? this.httpGetSelectDataForSprint() : null
  },
  'params.sprint_id'(v) {
    this.params.sprint_id = v // 此处也可以省略，因为 v-model 绑定了
  },
  params: {
    deep: true,
    handler(v) {
      this.$emit('select-change', { ...v })
    },
  },
},
```

## 引出的思考

在尝试找到上面使用 watch 解决需求的过程中，改变 `params` 监听代码的顺序，则会导致不同的结果，会和使用 `onSelectChange` 一样对外触发多次 `emit`。

```
watch: {
+ params: {
+   deep: true,
+   handler(v) {
+     this.$emit('select-change', { ...v })   
+   },  
+ }
  'params.product_id'(v) {
    this.params.product_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.project_id = ''
    this.params.sprint_id = ''
    this.projectSelectList = []
    this.sprintSelectList = []
    v ? this.httpGetSelectDataForProject() : null
  },
  'params.project_id'(v) {
    this.params.project_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.sprint_id = ''
    this.sprintSelectList.value = []
    v ? this.httpGetSelectDataForSprint() : null
  },
  'params.sprint_id'(v) {
    this.params.sprint_id = v // 此处也可以省略，因为 v-model 绑定了
  },
- //  params: {
- //    deep: true,
- //    handler(v) {
- //      this.$emit('on-select-change', { ...v })
- //    },
- //  },
},
```

为了弄清楚这种变化的原因，再去扒扒 `vue` 源码中对 `Wathcer` 的实现，加深了对 `vue` 异步渲染的理解。

## 结合源码分析原因

当某个选择器选择值改变时，由于 v-model 绑定的原因，会触发绑定属性的 `setter`，在 `setter` 函数中会执行 `dep.notify()` 派发依赖更新。最终在执行 `watcher.update()`函数中 `queueWatcher(this)` 函数。

核心逻辑 queueWatcher 函数
```js
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 当 flushSchedulerQueue 正进执行时，派发了依赖更新，则视 watcher.id 的先后插入到队列未执行的任务中
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue(); // 遍历 queue 队伍中的 watcher，调用 watcher.run 函数执行 watcher.cb.call(this.vm, value, oldValue);
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```
为了方便理解，各个属性产生的 watcher 分别 `params_watcher / product_watcher / project_watcher / sprint_watcher`。

所以如果对 params 的监听放在最前面，那产生的 watcher.id 顺序为：
> 这里忽略父组件及渲染render_watcher 的id，实际产生的 watcher.id 可能不是这个值，此处仅分析方便定义该组件内 watcher.id，仅为后续说明 watcher.id 对 watcher.cb 执行顺序的影响，
```
// 情形一：params 在前
params_wathcer.id = 1
product_wathcer.id = 2
project_wathcer.id = 3
sprint_watcher.id = 4
```
如果把对 params 的监听放在最后面，那产生的 watcher.id 顺序为：
```
// 情形二：params 在后
product_wathcer.id = 1
project_wathcer.id = 2
sprint_watcher.id = 3
params_wathcer.id = 4
```
模拟当前对产品选择器进行下拉选择值。
```
---------------------------------------------
| 请选择产品 V | 请选择项目 V | 请选择迭代 V |
---------------------------------------------
```

### 分析情形一：params 在前
```
params_wathcer.id = 1
product_wathcer.id = 2
project_wathcer.id = 3
sprint_watcher.id = 4
```
假设此时三个选择器都选择了某个值。然后再选中另一个产品时，此时会触发两个监听器 watcher执行：
- `params`的监听器 watcher 
- `params.product_id`的监听器 watcher

根据 `params_watcher.id=1, product_watcher.id=2`排序，此时 `queue = [params_watcher, product_watcher]`

然后按顺序执行监听器 watcher，`params_watcher.cb()` 会 `emit` 第一次，然后 `has[1]=null`。

然后继续执行`product_watcher.cb()`，在产品监听的监听器 product_watcher.cb 回调函数中，需要重置项目id `this.params.project_id = ''`，此时会触发以下两个监听器 watcher：
- `params`的监听器 watcher
- `params.project_id`的监听器 watcher

也会重置迭代id `this.params.spring_id = ''`，也会触发以下两个监听器 watcher：
- `params`的监听器 watcher
- `params.project_id`的监听器 watcher

注意这个时间点 `product_watcher`正在执行中，所以此时的标识位 `flushing=true; wating=true`

所以，此时这四个新触发的监听器 watcher 是如何如何插入队列 `queue`的呢？

```
// 此时的 queue
--------------------------------------------
| params_watcher(1)  | product_watcher(2)   |
| 已执行 has[1]=null | 正在执行             |
--------------------------------------------
```
核心逻辑 queueWatcher 函数
```js
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 当 flushSchedulerQueue 正进执行时，派发了依赖更新，则视 watcher.id 的先后插入到队列未执行的任务中
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```
- 先是进行 `params_watcher`的处理: 由于 `has[1]=null / flushing=true`会进入 `else`的逻辑。

此时 `i=1 / index=1` 并且 `queue[1].id = product_watcher.id = 2 / watcher.id = params_watcher.id = 1` while 条件不成立，直接将 params_watcher 插入了队列未尾，并且 `has[1]=true`。

- 然后是 `project_watcher`的处理：由于 `has[3]=undefined / flushing=true`，同样会进入 `else` 的逻辑，注意`if (has[id] == null）`的判断是宽松相等`==`，不是全等`===`，所以 `has[3]=undefined`条件也成立。

此时 `i=2 / index=1` 并且 `queue[2].id = params_watcher.id = 2 / watcher.id = project_watcher.id = 3` while 条件不成立，直接将 project_watcher 插入队列未尾。

- 再进行迭代改变触发的 params_watcher 的处理，此时因为 `has[1]=true`，队列中已存在，所以忽略。

- 最后是 `sprint_watcher` 的处理，同`project_watcher`一样，最终会被插入队列尾部。

此时 queue 队列是这样的：
```
// 此时的 queue
---------------------------------------------------------------------------------------------------------
| params_watcher(1)  | product_watcher(2)   | params_watcher(1) | project_watcher(3) | sprint_watcher(4) |
| 已执行 has[1]=null | 正在执行             |                   |                    |                   |
----------------------------------------------------------------------------------------------------------
```
当 `product_watcher`执行完，`params_watcher`会被再次执行，第二次触发 `emit`。

然后接着执行到 `project_watcher`，在 `project_watcher.cb()` 执行过程中，会置空迭代，但因为 sprint_id 在产品回调中已经被置空，前后值没变，所以不会派发依赖更新。
`if (newVal === value || (newVal !== newVal && value !== value)) { return }`

所以 params 监听在前的第一种情形，选择器都有值的情况下，改变产品，会导致 emit 触发二次。

### 分析情形二：params 在后
```
product_wathcer.id = 1
project_wathcer.id = 2
sprint_watcher.id = 3
params_wathcer.id = 4
```
同样假设此时三个选择器都选择了某个值。然后再选中另一个产品时，此时会触发两个监听器 watcher执行：
- `params`的监听器 watcher 
- `params.product_id`的监听器 watcher

根据 `params_watcher.id=4, product_watcher.id=1`排序，此时 `queue = [product_watcher, params_watcher]`

然后执行`product_watcher.cb()`，在产品监听的监听器 product_watcher.cb 回调函数中，需要重置项目id `this.params.project_id = ''`，此时会触发以下两个监听器 watcher：
- `params`的监听器 watcher
- `params.project_id`的监听器 watcher

也会重置迭代id `this.params.spring_id = ''`，也会触发以下两个监听器 watcher：
- `params`的监听器 watcher
- `params.project_id`的监听器 watcher

```
// 此时的 queue
--------------------------------------------
product_watcher(1) | params_watcher(4)  | 
正在执行           |                    |
--------------------------------------------
```
所以，此时这四个新触发的监听器 watcher 是如何如何插入队列 `queue`的呢？

核心逻辑 queueWatcher 函数
```js
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 当 flushSchedulerQueue 正进执行时，派发了依赖更新，则视 watcher.id 的先后插入到队列未执行的任务中
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```
- 先进行由重置项目id引起的 `params_watcher` 的处理: 由于此时`params_watcher`已经在队伍未尾，即 `has[4]=true`，所以会被忽略。

- 再看 `project_watcher`, 此时 `i=1 / index=0` 并且 `queue[1].id = params_watcher.id = 4 / watcher.id = project_watcher.id = 2` while 条件成立，会进行 `i--`，在判断 while 条件不成立，此时 `i=0`，会将 project_watcher 插入到 `product_watcher`之后，`params_watcher`之前。
- 重置迭代id 引起的处理同项目完全相同。

所以最终 queue 队列是这样的：
```
// 此时的 queue
--------------------------------------------------------------------------------
product_watcher(1) | project_watcher(2) | sprint_watcher(3) | params_watcher(4) 
正在执行            |                   |                    |                   |
---------------------------------------------------------------------------------
```
所以 params 监听在最后的情形二，选择器都有值的情况下，改变产品，最终 emit 只会触发一次。


<hr />

下面是对源码解读的扩展的内容：
- 组件实例的创建过程
- vue 依赖收集过程
- vue 依赖派发过程

## 组件实例创建

我们一步步从 `createComponent`创建组件到 `Vue.prototype._init`函数中 `initWatch` 到监听回调被执行的 ` watcher.run()` 看懂上面变化的原因。

1. `vm.$mount('#app')`
2. 模板编译后 `vm.$options.render` 中包含 `"_c('HelloWorld', data)"`
3. `vm._update(vm._render(), hydrating)`

其中: `vm._render()` 函数中
1. ` vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };` 
2. `function createElement(vm,a,b,c,d,false) {/**省略*/ return _createElement(vm, 'HelloWorld', data, undefined, undefined)}`
3. `vnode = function _createElement(vm, 'HelloWorld', data, undefined, undefined)) {/**省略*/ var vnode = createComponent(Ctor, data, vm); return vnode}`
其中 `vm._update(vnode, hydrating)`函数中


所以我们只关注 `_render()` 和 `_update()` 函数中两个`createComponent()` 函数的逻辑
```js
// 在vm._render 函数中执行 createComponent() 函数
function createComponent (Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base; // Vue.options._base = Vue，所以 baseCtor 就是 Vue 构造函数

  // plain options object: turn it into a constructor 
  // 如果传入的 Ctor 是一个对象，则直接使用 Vue.extend(Ctor) 构建组件。export default 导出的就是一个对象
  /**
   * export default {
   *   name: 'HelloWorld',
   *   data() {
   *     return {
   *      msg: 'World',
   *     }
   *   }
   * }
   */
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor); // 构建组件构建函数
  }

  // 省略代码...


  // 安装组件钩子函数到 data 中，包括 init / prePatch / insert / destory，
  // 特别是其中 init 函数会执行组件实例的初始化和挂载：
    // 1. new vnode.componentOptions.Ctor(options) 
    // 2. child.$mount(hydrating ? vnode.elm : undefined, hydrating);

  // 注意这里只是将组件的钩子函数挂载到 data 中，然后 data 会随下面 new VNode 执行传递到 componentOptions.data 中。
  // 具体钩子函数的执行是在 vm._update(vnode, ...) 函数中的 createComponent 
  installComponentHooks(data);


  // return a placeholder vnode
  // 实例化组件 VNode
  var name = Ctor.options.name || tag;
  // VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory)
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')), // tag = 'vue-component-id-helloworld
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, // componentOptions
    asyncFactory
  );
  return vnode
}


// installComponentHooks
function installComponentHooks (data) {
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

  prepatch: function prepatch (oldVnode, vnode) {
    // 省略
  },
  insert: function insert (vnode) {
    // 省略
  },
  destroy: function destroy (vnode) {
    // 省略
  }
};

// createComponentInstanceForVnode
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

`vm._update(vm._render(), hydrating)` 中 `vm._render()` 函数执行后返回 vnode 传递给`vm._update(vnode, hydrating)`函数:
调用路径：
`vm._update(vnode) => vm.__patch__(vm.$el, vnode) => createElm(vnode, ...) => createComponent(vnode, insertedVnodeQueue, parentElm, refElm)`

```js
// createElm
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  vnode.isRootInsert = !nested; // for transition enter check
  // createElm 无论怎样都尝试当成组件创建，观察是否成功。
  // 如果当前节点 vnode 不能作为组件创建返回 false，即往下继承执行
  // 如果当前节点是组件 vnode 则执行组件实例化，并返回 true，当前函数退出
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  // 省略其它代码
}

// createComponent
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  // 这里拿到的 vnode.data 是在 vm._render 函数中 createComponent 函数中 installComponentHooks(data) 函数初始化的
  // installComponentHooks(data) 执行即安装了组件创建的钩子函数 vnode.data.hook
  var i = vnode.data;
  if (isDef(i)) {
    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // dsDef(i=i.hook)在执行的同时将 i 变为了 hook 对象，同样 isDef(i=i.init)便得最终 i= vnode.data.hook.init 函数
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      // init 函数执行处理了主要处理两件：
      // 1. new vnode.componentOptions.Ctor(options) 
      // 2. child.$mount(hydrating ? vnode.elm : undefined, hydrating); => mountComponent
      // 这样在 createComponent 函数内就完成了组件实例的初始化和组件内真实 DOM 元素树 vnode.elm 渲染。
      i(vnode, false /* hydrating */);
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    // 在上面 i(vnode, false) 生成了组件实例，并渲染了组件内真实的 dom 树元素 vnode.elm
    // 然后在这一步，将组件元素插入到父组件中完成挂载。
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

我们主要目的是观察组件 watch 的处理，所以我们需要关注组件实例初始化过程：
```js
// vm._render() => createComponent() => installComponentHooks(data) => componentVNodeHooks.init() => createComponentInstanceForVnode

function createComponentInstanceForVnode (
  vnode, 
  parent
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

/**
  Ctor 函数是在 createComponent() 函数一开始处理的：
*/
function createComponent (Ctor, data, context, children, tag) {
  // 省略代码
  var baseCtor = context.$options._base; // Vue.options._base = Vue，所以 baseCtor 就是 Vue 构造函数
    if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor); // 构建组件构建函数
  }
}

/**
  在 Vue.extend() 函数中
*/
Vue.extend = function (extendOptions) {
  
  var Sub = function VueComponent (options) {
    this._init(options);
  };

  // 省略代码
  return Sub
}
```
所以 `new vnode.componentOptions.Ctor(options)`就相当于 `Vue.prototype._init(options)`执行。

```js
Vue.prototype._init = function (options) {
  var vm = this;
  // a uid
  vm._uid = uid$3++;

  // 省略代码

  initLifecycle(vm); // 挂载内部属性：$root/$parent/$refs=[]/$children=[]/_watcher=null，以及一些生命状态标志 flag: _inactive=null/_isMounted=false/_isDestoryed=false/_isBeingDestoryed=false
  initEvents(vm); // 挂载父组件传入的事件监听器 listeners 到实例 vm._events 对象上，来源于 template 解析到的 v-on 绑定的事件函数
  initRender(vm); // 挂载 $attrs/$listeners，以及绑定 _c/$createElement
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props 1. 解析 inject 属性的数据；2. 并将其设置响应式（即k-v转为getter/setter）同时挂载到 vm 上
  initState(vm); // 初始 script 中的属性：initProps/initMethods/initData/initComputed/initWatch
  initProvide(vm); // resolve provide after data/props
  callHook(vm, 'created');

  // 省略代码
}
```
关注 watch 的初始化，即 `initState` 函数：
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
然后即 `initWatch` 函数
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
```
然后 `createWatcher(vm, key, handler);`
```js
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
所以在 `options.watch` 定义，与直接调用 `this.$watch` 定义一样效果。

看下 `vm.$watch`
```js
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

    // options.watch 或者 this.$watch 定义的监听，都会被标识为 user=true，代表用户自定义的 watcher
    options.user = true;

    // 核心代码 Watcher 构造函数
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }

    // watch 函数调用返回一个可以取消 watch 监听的方法。
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}
```
### Watcher

```js
/**
 * Class Watcher 实例有三种类型：render-watcher / user-watcher / computed-watcher
 * 
 * watcher.user  - 用户在 option.watch 或调用 this.$watch() 自定义的 watcher，即 user-watch
 * watcher.lazy  - 用于标记 computed 中实例 watcher, 即 computed-watcher
 * watcher.dirty - 标记 computed-watcher 是否需要重新计算值，还是使用缓存的值 watcher.value
 * isRenderWatcher = true 时，表示当前实例化的 render-watcher ，实例赋值在 vm._watcher，也存入 vm._watchers
 *
 * Watcher.prototype 原型对象方法：
 * get(): 关键代码是开头 pushTarget(this) 和结尾的 popTarget()，以及 this.getter.call(vm,vm)
 * addDep(): 判断 dep 是否重复添加的关键，只有 watcher 中的 newDepIds 中不存在才添加 dep.addSub(this)
 * cleanupDeps(): get()方法执行的善后处理，处理 deps/newDeps 和 depIds/newDepIds。
                  比如 v-if/v-else 这类视图，一次更新，if 绑定的数据依赖就不需要了，在新一轮依赖收集完成后，要将上一次旧的无用依赖清除掉，并将新的转为旧的，新的清空。
 * update(): 1. 对 computed-watcher 只设置 this.dirty=true，2. 其它 watcher，加入队列执行 queueWatcher(this)
 * run(): 执行实例 watcher 时传入的回调函数 this.cb.call(this.vm, value, oldValue);
 * evaluate(): 针对 computed-watcher ，获取 coputed 最新值
 * depend(): 循环遍历该 watcher 中的 dep，向其中再加入当前 watcher, 会计算属性 getter 有调用
 * teardown(): 将 watcher 从 dep.subs 中删除
 */


var uid$2 = 0;
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) { // mountComponent 函数中 new Watcher 会传入 isRenderWatcher = true 表示当前实例化的是 render-watcher
    vm._watcher = this; // render-watcher
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user; // 用户在option.watch 或 this.$watch() 时自定义的 watcher，即 user-watch,
    this.lazy = !!options.lazy; // 用于标记 computed 中实例watcher,即 computed-watcher
    this.sync = !!options.sync;
    this.before = options.before; // render-watcher 会传入这个属性，即 beforeUpdate 钩子函数
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb; // 监听回调函数
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
    this.getter = expOrFn; // computed watcher 和 updateComponent
  } else {
    this.getter = parsePath(expOrFn); // user watcher
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
    ? undefined
    : this.get();
};
```
这里要注意初始化 `watcher.id` 的 `uid$2` 变量是全局的。

在 `initWatch` 函数中，通过 `for (var key in vm.$options.watch)` 可以知道，我们声明在 watch 对象中属性的先后顺序不同，会导致对应的 watcher.id 大小是不同的。这一点在理解后续执行 watcher.cb 函数的顺序时非常重要。
```js
// initWatch
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
```
所以看我们产生问题的代码：
```
watch: {
+ params: {
+   deep: true,
+   handler(v) {
+     this.$emit('select-change', { ...v })   
+   },  
+ }
  'params.product_id'(v) {
    this.params.product_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.project_id = ''
    this.params.sprint_id = ''
    this.projectSelectList = []
    this.sprintSelectList = []
    v ? this.httpGetSelectDataForProject() : null
  },
  'params.project_id'(v) {
    this.params.project_id = v // 此处也可以省略，因为 v-model 绑定了
    this.params.sprint_id = ''
    this.sprintSelectList.value = []
    v ? this.httpGetSelectDataForSprint() : null
  },
  'params.sprint_id'(v) {
    this.params.sprint_id = v // 此处也可以省略，因为 v-model 绑定了
  },
- //  params: {
- //    deep: true,
- //    handler(v) {
- //      this.$emit('on-select-change', { ...v })
- //    },
- //  },
},
```
为了方便理解，假设监听各个属性产生的 watcher 分别 `params_watcher / product_watcher / project_watcher / sprint_watcher`。

所以如果对 params 的监听放在最前面，那产生的 watcher.id 顺序为：
> 这里忽略父组件及渲染render_watcher 的id，实际产生的 watcher.id 可能不是这个值，此处仅分析方便定义该组件内 watcher.id，仅为后续说明 watcher.id 对 watcher.cb 执行顺序的影响，
```
params_wathcer.id = 1
product_wathcer.id = 2
project_wathcer.id = 3
sprint_watcher.id = 4
```
如果把对 params 的监听放在最后面，那产生的 watcher.id 顺序为：
```
product_wathcer.id = 1
project_wathcer.id = 2
sprint_watcher.id = 3
params_wathcer.id = 4
```

## 依赖收集

Watcher 构造函数初始化的最后，会调用 `this.get()` 完成依赖收集的过程。

> vue 中的依赖实际上可以理解为 watcher，所以依赖收集，就是 watcher 收集过程。

```js
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};
```
这里 `this.getter` 即 `new Watcher` 中 `this.getter = parsePath(expOrFn)` 返回的一个函数。
```js
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}
```
`value = this.getter.call(vm, vm);`调用传入了 `vm`，即找到 `vm[params][product_id]` 的值。其它同理。

因为 params 对象定义在 data 中，在 `initData` 中完成了 `observe(data)`，每个属性都被包装成了对应的 `getter / setter`，所以在实例化 watcher 过程中执行 `this.get() => this.getter.call(vm,vm)`就会触发对应属性的 `getter` 函数。
```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  // 省略代码
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }
  var getter = property && property.get;
  var setter = property && property.set;

  Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) { // 此时 Dep.target 正是上面 watcher.get 函数中 pushTarget(this); 设置的。
          dep.depend(); // 
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        // 省略代码，在下面依赖派发中解析
    });
  }
}
```
这里看下 Dep 依赖管理器的定义
```js
var uid = 0; // 定义 dep.id 序列器也是全局的。
var Dep = function Dep () {
  this.id = uid++;
  this.subs = []; // 每个 data 中的属性相关的依赖(watcher)就放在这里。
};

Dep.prototype.depend = function depend () {
  /**
   * 该方法最关键的点： Dep.target = watcher，watcher.get 函数中设置 pushTarget(this)
   * 并且添加依赖不是直接调 this.addSub，而是绕到 dep.append(wathcer) => watcher.addDep(dep) => dep.addSub(wathcer)
   * 之所以这样绕一圈，是因为既需要在 dep.subs 中持有全部 watcher，又需要在每个 watcher 的 depIds/deps 中持有相应的 dep。
   */
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};
```
此时这里的 `Dep.target` 即 `user-watcher` 实例。看下`watcher.addDep` 方法的定义
```js
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  // 这一步的对 dep 的去重
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

// Watcher 的 constructor 构造函数中声明了 dep 存储数组
// this.deps = [];
// this.newDeps = [];
// this.depIds = new _Set(); // Set 数据类型的值具有唯一性
// this.newDepIds = new _Set();
```
上面 `dep.addSub(this);`再次转回 `Dep` 实例的方法。
```js
Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

// var Dep = function Dep () {
//   this.id = uid++;
//   this.subs = []; // 每个 data 中的属性相关的依赖(watcher)就放在这里。
// };
```

这个过程就是 vue 依赖收集过程，即 vue 的 watcher 收集过程。

依赖收集不是直接调 `dep.addSub`，而是绕到 `dep.append(wathcer) => watcher.addDep(dep) => dep.addSub(wathcer)`,之所以这样绕一圈，是因为既需要在 Dep 实例的 `dep.subs` 中持有订阅了该属性的全部 `watcher`，也需要在每个 watcher 的 `depIds/deps` 中持有该 watcher 被哪些 dep 收集的信息。

就好比公司招聘和员工求职的过程，公司需要收到到所有应聘都的信息，员工自已也需要收集到自己所投递的所有公司信息一样。

## 依赖派发

当 `el-select`选择值改变时，因为 `v-model`绑定的原理，`params.product_id`会被赋一个新值。此时就是触发 `product_id` 属性的 `setter` 函数。其它监听属性同理。

```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  // 省略代码
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }
  var getter = property && property.get;
  var setter = property && property.set;

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 省略代码，见上面依赖收集解析
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val; 
      // 这里调用 getter() 还会触发 dep.depend()，如果去重？
      // 在 watcher.addDep 函数中会有 if (!this.newDepIds.has(id)) 和 if (!this.depIds.has(id)) 的判断。 其中 newDepIds 和 depIds 都是 new Set() 类型。

      /* 如果前后值未发生变化，则不派发依赖更新 */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal); // 设置的newVal也需要转为响应式 getter / setter
      dep.notify(); 
      // 遍历dep.subs中的每个watcher，调用 watcher.update
      // 判断是computed-watcher，则 watcher.dirty=true，其它运行 watcher.run() 
      // run() => this.cb.call(this.vm, value, oldValue)  
    });
  }
}
```
这里关键是 `dep.notify()` 派发依赖更新。
```js
Dep.prototype.notify = function notify () {
  var subs = this.subs.slice();
  if (!config.async) {
    /**
     * 这里就会依赖 watcher.id 的从小到大的顺序，即 watcher 声明选后的顺序。
     * 以此保证后面 watcher.run 调用时，先派发父组件的依赖，再派发子组件依赖。
     *
     * 对于我们此时的问题，在自定义的 options.watch 中定义的监听，会按 watch 对象属性声明的先后顺序排序，即 params_watcher / product_watcher / project_watcher / sprint_watcher 
     */
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update(); 
    // watcher.update => 根据watcher 类型不同决定： 如果是 computed-watcher，则 watcher.dirty=true，其它类型运行 watcher.run()
  }
};  
```
看下 `subs[i].update()` 函数执行，实际上是 `watcher.update()`函数。
```js
Watcher.prototype.update = function update () {
  if (this.lazy) { // computed-watcher
    this.dirty = true;
  } else if (this.sync) { // 同步执行
    this.run();
  } else {
    queueWatcher(this);
  }
};
```
常规下，vue 项目中的 watcher 实际都是异步的。所以这里代码会执行到 `queueWatcher(this)`

```js
/**
 * 这里引入了队列的概念，这也是 Vue 在做派发更新的时候的一个优化的点:
 * 它并不会每次数据改变都触发 watcher 的回调，而是把这些 watcher 先添加到一个队列里，然后在 nextTick 后执行 flushSchedulerQueue。
 *
 * 这里有几个细节要注意一下:
 *   首先用 has 对象保证同一个 Watcher 只添加一次；
 *   接着对 flushing 的判断当前是不是正在执行监听回调 cb() 的过程中，区别处理
 *   最后通过 waiting 保证对 nextTick(flushSchedulerQueue) 的调用逻辑只有一次; 
*/
var MAX_UPDATE_COUNT = 100;
var queue = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;

function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;

    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      // 当 flushSchedulerQueue 正进执行时，即 watcher.cb() 执行过程，再次派发了依赖更新，则视 watcher.id 的先后插入到队列未执行的任务中

      // 注意这里 while 是逆向查询的。从 queue 尾部开始找到当前要插入 watcher.id 的位置，结果也是保证 queue 队列中的 watcher.id 仍然是从前到后保持升序。
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}


function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  /**
   * queue.sort((a, b) => a.id - b.id) 对队列做了从小到大的排序，这么做主要有以下要确保以下几点：
   * 1.组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。
   * 2.用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。
   * 3.如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。
   * 
  */
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  /**
   * index 不能定义在局部，因为在队列执行过程中，可能还会有 watcher 插入队列，队列的 queue.length 会变化，并且当前遍历到的 index 在 queueWatcher 函数中也要使用
  */
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;

    watcher.run();
    // in dev build, check and stop circular updates.
    if (has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  // 队列执行完成后重置相关状态 如 index has flushing wating 的值
  resetSchedulerState();

  // call component updated and activated hooks
  // 激活相关生命周期钩子函数
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);
}
```
`watcher.run()`函数
```js
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {

      // set new value
      var oldValue = this.value;
      this.value = value;

      if (this.user) {
        try {
          // 执行 user-watcher 监听回调函数。
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        // render-watcher / computed-watcher
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
```
上面就是依赖派发的过程。
