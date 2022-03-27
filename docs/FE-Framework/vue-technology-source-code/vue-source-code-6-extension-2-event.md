# 事件中心 event

[[toc]]

Vue 中的事件分为两种：
- 原生 DOM 事件：原生 DOM 节点只能添加原生 DOM 事件。
- 组件自定义事件：只有组件节点才可以添加自定义事件，如果需要在组件上添加原生DOM事件，需要使用 .native 修饰符，并且该事件作用在组件根节点上的真实DOM元素。

> .native 修饰符只能添加在组件上，对真实DOM节点的事件添加.native 修饰符会被忽略。


例子：

```js
let Child = {
  // 原生 DOM 元素添加原生 DOM 事件
  template: '<button @click="clickHandler($event)">click me</button>',
  methods: {
    clickHandler(e) {
      console.log('Button clicked!', e)
      this.$emit('select')
    }
  }
}

let vm = new Vue({
  el: '#app',
  // 组件 child 上添加自定义事件 select，以及在组件上添加.native修饰符的原生事件
  template: '<div>' +
  '<child @select="selectHandler" @click.native.prevent="clickHandler"></child>' +
  '</div>',
  methods: {
    clickHandler() {
      console.log('Child clicked!')
    },
    selectHandler() {
      console.log('Child select!')
    }
  },
  components: {
    Child
  }
})
```

按照这个例子，看下 Vue 源码中对事件的处理逻辑

## 模板编译1：parse
模板编译 div 过程略过，直到编译 child 标签时：

parse => parseHTML => parseStartTag => handleStartTag => options.start => closeElement => processElement => processAttrs 

看下 processAttrs:
```js
// var onRE = /^@|^v-on:/;
// var dirRE = /^v-|^@|^:|^#/;
// var argRE = /:(.*)$/;
// var bindRE = /^:|^\.|^v-bind:/;
// var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
// var dynamicArgRE = /^\[.*\]$/;
// 这个函数处理了修饰符、事件过滤器、事件绑定
function processAttrs (el) {
  // attrsList: [{name: 'id', value: 'test_id',start,end}, {name: '@click', value: 'onClick',start,end}]
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) { // dirRE = /^v-|^@|^:|^#/; 即匹配 v-on / @ / v-bind / : / v-slot / #
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers 解析动态属性修饰符，比如 @click.stop, v-bind:show.sync
      // modifiers = {sync: true, native: true}
      modifiers = parseModifiers(name.replace(dirRE, ''));
      // support .foo shorthand syntax for the .prop modifier
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind:attr or :attr
        // 省略代码：对 v-bind 的处理
      } else if (onRE.test(name)) { // v-on @
        name = name.replace(onRE, '');
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        // 解析事件各种修饰符，最后添加 el.events 或 el.nativeEvents 数组中储存着 handler
        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
      } else { // normal directives： v-show v-text v-html 自定义指令
        // 对剩余指令的处理，如 v-show v-text v-html 以及自定义指令
      }
    } else {
      // literal attribute
      // 对静态属性的处理，如title href src
    }
  }
}
```
在processAttrs 中，省略部分代码主要关注事件指令的处理。在对标签属性的处理过程中，判断如果是指令，首先通过 parseModifiers 解析出修饰符，然后判断如果事件的指令，则执行 addHandler 方法

```js
// 事件修饰符
// .stop - 调用 event.stopPropagation()。阻止冒泡
// .prevent - 调用 event.preventDefault()。阻止默认行为
// .capture - 添加事件侦听器时使用 capture 模式。捕获模式
// .passive - (2.3.0) 以 { passive: true } 模式添加侦听器。 冒泡模式
// .self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
// .native - 监听组件根元素的原生事件。
// .once - 只触发一次回调。
// .{keyCode | keyAlias} - 只当事件是从特定键触发时才触发回调。
// .left - (2.2.0) 只当点击鼠标左键时触发。
// .right - (2.2.0) 只当点击鼠标右键时触发。
// .middle - (2.2.0) 只当点击鼠标中键时触发。
function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn,
  range,
  dynamic
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  // prevent passive 不能一起使用
  if (
    warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.',
      range
    );
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  // 鼠标右键、中键触发事件
  if (modifiers.right) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
    } else if (name === 'click') {
      name = 'contextmenu';
      delete modifiers.right;
    }
  } else if (modifiers.middle) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
    } else if (name === 'click') {
      name = 'mouseup';
    }
  }

  // 这里使用使用标记，在 patch 渲染阶段会根据这些标记会有对应模式的特殊处理
  // check capture modifier 捕获模式
  if (modifiers.capture) {
    delete modifiers.capture;
    name = prependModifierMarker('!', name, dynamic);
  }
  if (modifiers.once) { // 只调用一次
    delete modifiers.once;
    name = prependModifierMarker('~', name, dynamic);
  }
  // istanbul ignore if  冒泡模式
  if (modifiers.passive) {
    delete modifiers.passive;
    name = prependModifierMarker('&', name, dynamic);
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  // {name: '@click', value: 'onClick',start,end}
  var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range); // newHandler = "onClick"
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}
```
可以看到，addHandler 函数：
1. 是一边校验 modifiers，一边删除，保留最后未处理的修饰符。
1. 通过 .native 修饰符区分原生事件还是组件自定义事件，分别存放在 el.nativeEvents 和 el.events

在我们的例子中，组件 child 和 组件内部节点 div 创建的 ASTElement 对象的事件属性：

```js
// 父组件的 child 节点生成的 el.events 和 el.nativeEvents 如下：
el.events = {
  select: {
    value: 'selectHandler'
  }
}

el.nativeEvents = {
  click: {
    value: 'clickHandler',
    modifiers: {
      prevent: true
    }
  }
}

// 子组件的 button 节点生成的 el.events 如下：
el.events = {
  click: {
    value: 'clickHandler($event)'
  }
}
```

parse 函数执行后生成 AST，传给 optimize ，它的逻辑主要优化静态节点和静态根节点，跟当前事件分析无关，所以略过。接着来到模板编译的最后阶段 generate

## 模板编译2：generate

generate 阶段的主要目的是生成可用于渲染函数的代码字符串。

gererate => genElement => genData$2

genData$2 函数主要是从 ASTElement 对象上解析组装生成 data，用于 _createElement(tag,data,children) 函数的的第二入参。整个 generate 阶段都是字符串拼接过程，所以 genData$2 也是拼接 data 的字符串形式。

```js
function genData$2 (el, state) {
  /**
   * data = {
   *  dirs: dirs,
   *  key: key,
   *  ref: ref
   * ...
   * }
   */
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  // dateGenFns => genData
  // function genData (el) {
  //   var data = '';
  //   if (el.staticClass) {
  //     data += "staticClass:" + (el.staticClass) + ",";
  //   }
  //   if (el.classBinding) {
  //     data += "class:" + (el.classBinding) + ",";
  //   }
  //   return data
  // }
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:" + (genProps(el.attrs)) + ",";
  }
  // DOM props
  if (el.props) {
    data += "domProps:" + (genProps(el.props)) + ",";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
  }
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}
```
此时，我们关注对事件的解析，从 ASTElement.envents 和 ASTElement.nativeEvents 中取出事件，调用 genHandlers，对组件中使用了 .native 修修饰符的事件，第二个入参会传入 true，即 isNative = true

```js
function genHandlers (
  events,
  isNative
) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  var dynamicHandlers = "";
  // 循环遍历，处理每一个事件 genHandler
  for (var name in events) {
    var handlerCode = genHandler(events[name]);
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += name + "," + handlerCode + ",";
    } else {
      staticHandlers += "\"" + name + "\":" + handlerCode + ",";
    }
  }
  staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
  if (dynamicHandlers) {
    return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
  } else {
    return prefix + staticHandlers
  }
}
```
genHandlers 方法遍历事件对象 events，对同一个事件名称的事件调用 genHandler(name, events[name]) 方法
```js
var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
var fnInvokeRE = /\([^)]*?\);*$/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

function genHandler (handler) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);
  var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    // 处理各类修饰符，拼接对应的代码
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]; // stop: '$event.stopPropagation();',
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : isFunctionInvocation
          ? ("return " + (handler.value))
          : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}
```
genHandler 函数先判断：
- 如果 handler 是一个数组，就遍历它然后递归调用 genHandler 方法并拼接结果
- 接着对 modifiers 做判断，对于没有 modifiers 的情况，就根据 handler.value 不同情况处理，要么直接返回，要么返回一个函数包裹的表达式；- 对于有 modifiers 的情况，则对各种不同的 modifer 情况做不同处理，添加相应的代码串。

其中不同修饰符，需要补全不同的代码串：

```js
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};
// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
};
```
在我们的例子中，最终生成的 data 字符串：
```js
// child
'{
  "on": {"select": selectHandler},
  "nativeOn": {"click": function($event) {
      $event.preventDefault();
      return clickHandler($event)
    }
  }
}'

// div
'{
  "on": {"click": function($event) {
      clickHandler($event)
    }
  }
}'
```
到此，编译部分完成，下一个阶段是渲染，分别调用 vm._render 和 vm.update 函数

## 渲染1：_render

vm._render 函数的主要作用是生成虚拟DOM，执行 options.render函数中调用 _createElement 生成嵌套的 vnode。

`vnode = render.call(vm._renderProxy, vm.$createElement);`

此时在 _createElement 函数中，如果解析到不是正常标签，则会调用创建组件的函数 createComponent

```js
function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    // 1. 创建组件的构造函数
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // 省略代码...

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    // 2. 解析组件构造函数的 options
    resolveConstructorOptions(Ctor);

    // 省略代码...

    // 3. 关键步骤：对于组件，会将 data.on 数据即 ASTElement.events 数据即组件自定义事件存入 listeners
    // 而将 data.nativeOn 数据即 ASTElement.nativeEvents 即添加了.native 修饰符的事件存入 data.on
    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    // 省略代码

    // install component management hooks onto the placeholder node
    // 安装组件钩子函数，包括 init / prePatch / insert / destory，其中 init 函数会使用 new Ctor 创建组件实例
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context, // .native 修饰符的原生事件存入 vnode.data.on
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, // 组件自定义的事件存储 vnode.componentOptions.listeners
      asyncFactory
    );

    return vnode
  }
```

## 渲染2：vm._update
vm._render 函数生成虚拟 DOM 树之后，传入 vm._update

`vm._update => vm.__patch__ => patch => createElm`

createElm 函数的内部，第一步总是调用 createComponent 函数尝试是否能创建一个组件，如果不能返回 fase，执行正常元素的创建过程。如果是组件，那就执行 createComponent 函数内部的一系列逻辑，返回 true，return 退出 createElm 函数的执行。

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
    
    // 尝试创建组件
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // 标准元素的处理
    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        // 处理元素子节点
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          // 调用对应钩子函数
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        // 将元素插入当前父元素
        insert(parentElm, vnode.elm, refElm);
      }

      if (data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }
```

所以从 createElm 函数开始，分组件和标签元素的事件处理逻辑

## 组件事件的处理

vm._update 阶段 createComponet 函数中，即调用 init() 函数进行组件实例化。
```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  var i = vnode.data;
  if (isDef(i)) {
    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      // 
      i(vnode, false /* hydrating */);
    }
    
    // 省略代码...
  }
}
```
此时，我们看一下组件实例化过程，调用 `i(vnode, false /* hydrating */);`，实际上执行的就是 componentVNodeHooks.init 钩子。init 钩子函数中在 vm._render 阶段的 createComponent 函数中执行 installComponentHooks(data) 函数中添加的。

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
  // 省略其它钩子函数 prePatch insert destory
}
```
init 函数调用的是 createComponentInstanceForVnode 函数

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
在 createComponentInstanceForVnode 函数内实例了组件的实例化 `new vnode.componentOptions.Ctor(options)`

注意这里 `_parentVnode: vnode`，那么关于原生事件的处理函数就变成了存储在 `_parentVnode.data.on` 中，自定义事件都在 `_parentVnode.componentOptions.listeners`。

因为 Ctor 继承于 Vue，所以 new Ctor 实际执行的就是 Vue.prototype._init 函数。
```js
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    
    // merge options
    // 合并选项过程根 vue 实例和组件 Vue 实例区分处理
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
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
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


    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```
在组件实例化时，合并配置的处理不同，组件是调用 `initInternalComponent(vm, options)`，其中对组件自定义事件有关代码：`opts._parentListeners = vnodeComponentOptions.listeners;`

```js
// 此时的入参 options = vnode，因为 i(vnode, false /* hydrating */)
function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    // 这里拿到组件的自定义事件的处理函数
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }
```
合并配置完成后，继承执行函数实例化，执行了 `initEvents(vm)` 函数

```js
function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```
拿到 listeners 后，执行 updateComponentListeners(vm, listeners) 方法：
```js
function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}
```
updateListeners 主要逻辑：
1. 
1. 对象新旧事件，确定是添加还是删除

```js
  function updateListeners (
    on,
    oldOn, // {}
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name); // 解析之前几个特别修饰符事件的处理 `passive => &name   once => ~name   capture => !name`，

      if (isUndef(cur)) {
        warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );

      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    // 旧事件 oldOn 中有，但在新事件on没有的，应该删除
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }
```

我们这里关注还是 add 和 remove$1 函数
```js
function add (event, fn, once) {
  if (once) {
    target.$once(event, fn)
  } else {
    target.$on(event, fn)
  }
}

function remove (event, fn) {
  target.$off(event, fn)
}
```
即 Vue 构造函数初始化时定义的事件中心：即把组件自定义事件都存储在 vm._events 属性中。
> vm._events 在 _init 函数中的 initEvents 定义，见上面。
```js
function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }
```
## 标准元素的事件处理

在上述分支片 vm._update => patch => createElm 函数中：

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
    
    // 尝试创建组件
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    // 标准元素的处理
    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        // 处理元素子节点
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          // 调用对应钩子函数
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        // 将元素插入当前父元素
        insert(parentElm, vnode.elm, refElm);
      }

      if (data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }
```
标签元素，就会继续执行到：

```js
//1. 创建一个真实DOM元素
vnode.elm = nodeOps.createElement(tag, vnode)

//2. 循环处理元素子节点创建
createChildren(vnode, children, insertedVnodeQueue);
if (isDef(data)) {
  // 3. 初始化则创建元素 vnode.elm 的各种属性，即调用对应元素创建的钩子函数
  invokeCreateHooks(vnode, insertedVnodeQueue);
}
// 4. 将则创建的元素插入当前父元素
insert(parentElm, vnode.elm, refElm);
```
其中 `invokeCreateHooks(vnode, insertedVnodeQueue)` 函数会执行元素初始化工作，即各类属性和事件

```js
function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
    cbs.create[i$1](emptyNode, vnode);
  }
  i = vnode.data.hook; // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) { i.create(emptyNode, vnode); }
    if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
  }
}
```
其中，关键代码是`cbs.create[i$1](emptyNode, vnode);` cbs变量是在创建 patch 函数时就定义好了 `var patch = createPatchFunction(backend)`
```js
var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  // 省略代码...
  
  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    // 省略代码...
  }
}
```
所以可以看到关注是 modules 定义，它包含两部分：platformModules 和 baseModules

```js
var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

var baseModules = [
    ref,
    directives
  ];

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];
```
可以看到 modules 中定义了元素中各个属性在各个钩子函数的处理。就本节事件举例来说：

```js
var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};
var attrs = {
  create: updateAttrs,
  update: updateAttrs
};
```
经过 createPatchFunction 函数中那段代码转化后，cbs 对象结果为：

```js
var cbs = {
  create: [
    updateAttrs,
    updateDOMListeners
  ],
  update: [
    updateAttrs,
    updateDOMListeners
  ],
  activate: [...],
  update: [...],
  remove: [...],
  destory: [...]
}
```

这样在 createPatchFunction 函数生成patch函数前就处理好了，然后在调用 patch => createElm => invokeCreateHooks 函数中：

```js
function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
    // 执行对应钩子函数
    cbs.create[i$1](emptyNode, vnode);
  }
  i = vnode.data.hook; // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) { i.create(emptyNode, vnode); }
    if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
  }
}
```
`cbs.create[i$1](emptyNode, vnode);`即会执行组件周期的钩子函数，即 cbs.create 内的全部钩子。对事件而言，会调用 updateDOMListeners  函数：

```js
  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }
```
updateListeners 函数上面在组件自定义事件中有说过，这里关注 add$1 和 remove$2 函数，即调用原生 DOM 的API注册事件：

```js
function add (
  event: string,
  handler: Function,
  once: boolean,
  capture: boolean,
  passive: boolean
) {
  handler = withMacroTask(handler) // 原生 DOM 事件异步处理都采用宏任务，所以处理句柄需要用 withMacroTask 函数包裹一层。
  if (once) handler = createOnceHandler(handler, event, capture)
  target.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}

function remove (
  event: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  (_target || target).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  )
}
```
> 关于 withMacroTask 函数，请查看 [nextTick](/FE-Framework/Vue/vue-source-code-6-extension-3-nextTick.html)