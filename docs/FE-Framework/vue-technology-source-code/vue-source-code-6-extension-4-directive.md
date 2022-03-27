# 指令系统 directive

Vue 在模板中使用的指令集主要有两类：框架定义的指令和用户自定义指令

Vue 框架已定义的指令有：
- v-show
- v-if / v-else / v-else-if
- v-for
- v-text
- v-html
- v-model
- v-on
- v-bind
- v-slot
- v-pre
- v-once
- v-cloak

经过前面章节内容的理解，我们知道 Vue 项目运行会经过以下几个步骤：
1. 完成 Vue 构造函数初始化：构造函数及原生对象方法挂载
1. 完成 new Vue 实例化：实例属性和方法挂载
1. template 模板如果有的话，模板编译 compiler: parse => optimize => generate，生成代码字符串
1. 渲染函数 render 调用生成 vnode (new VNode)
1. patch 生成真实 DOM 并挂载显示视图

![vue-source-constructor-instance](../image/vue-source-constructor-instance.png)
![vue-source-compiler-render-patch](../image/vue-source-compiler-render-patch.png)

[[toc]]

这一节关于 Vue 指令系统，主要集中在模板编译和视图渲染过程中。

## 模板编译阶段 parse 解析指令

模板中的指令语法都是写在开始标签中，所以指令的编译也是在模板开始标签的处理集中在 `options.start` 和 `processAttrs` 函数中。

函数调用全路径是 `$moun => compileToFunctions => baseCompile => parse => parseHTML => parseStartTag => handleStartTag => options.start => processPre / processFor / processIf / processOnce / closeElement => processElement => processKey / processRef / processSlotContent / processComponent / processAttrs => processModifiers / processFilters / addProp / addAttr / addHandler / addDirective`

```js
function parseHTML (html, options) {

  // 省略代码...
  while (html) {
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // 省略代码
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue
        }
      }
    }
  }

  function advance (n) {
    index += n;
    html = html.substring(n);
  }
}
```
### parseStartTag => match.attrs

在 parseStartTag 函数中主要循环处理，当不是结束标签，并且含有动态绑定或普通属性时循环匹配，将匹配结果推入 match.attrs

```js
// var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
  // var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  // var startTagOpen = new RegExp(("^<" + qnameCapture));
  // var startTagClose = /^\s*(\/?)>/;
  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      // 循环处理：不是结束标签，并且含有动态绑定或普通属性时循环匹配，将匹配结果推入 match.attrs
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
        // match 捕获的结果attr，是一个嵌套数组，可以在控制台打印:
        /**
         * 举例：`id="test_id"`.match(attribute)
         * 返回：["id="test_id"", "id", "=", "test_id", index: 0, input: "id="test_id"]
        */
      }
      if (end) {
        match.unarySlash = end[1]; // 是否是一元标签 <img>、<br/>
        advance(end[0].length);
        match.end = index;
        return match
      }
      /**
       * 举例：<div id="test_id"></div>
       * return match = {
       *  tagName: "div",
       *  attrs: [["id="test_id"", "id", "=", "test_id", index: 0, input: "id="test_id", start:5, end:17]],
       *  unarySlash: null
       *  start: 2
       *  end: 10
       * };
      */
    }
  }
```
### handleStartTag => 对象形式 attrs

接着是执行 handleStartTag 函数，将 match.attrs 数组元素处理成对象形式 attrs

```
 match.attrs: 
 [["id="test_id"", "id", "=", "test_id", index: 0, input: "id="test_id", start:0, end:9], ["@click="onClick", "@click", "=", "onClick", index: 0, input: "@click="onClick"", start: 11, end: 27]],
handleStartTag 结果：
attrs: [{name: 'id', value: "test-di", start:0, end:9},{name: "@click", value: "onClick", start: 11, end: 27}]
```
然后在 handleStartTag 函数最后将处理好的 attrs 作为实参调用 `options.start(tagName, attrs, unary, match.start, match.end)`

### options.start 处理部分指令 v-pre / v-for / v-if / v-once

在 options.start 函数中第一件事创建一个 ASTElement 对象，然后解析部分指令就是往这个对象添加对应的 key-value

> start 函数是作为 parseHTML 函数调用的实参传入的。

```js
function parse (template, options) {
  // 省略代码
  parseHTML(template, {
    // 省略代码
    start: function (tag, attrs, unary, start, end) {
      // 省略代码...

      // inVPre = false
      // v-pre 指令：跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签
      // function processPre (el) {
      //   if (getAndRemoveAttr(el, 'v-pre') != null) {
      //     el.pre = true;
      //   }
      // }
      if (!inVPre) {
        // processPre 解析元素中是否有包含 v-pre 指令
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      // platformIsPreTag = options.isPreTag = function (tag) { return tag === 'pre'; };
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }

      if (inVPre) {
        // 如果元素有 v-pre 指令，则 processRawAttrs 是将 element.attrsList 中的属性一个个复制挂载到 element.attrs 上
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        // 对结构性指令 v-for / v-if / v-once 需要单独处理
        /**
         * 数组遍历
         * v-for="(item, index) in list"
         * element.for = list
         * element.alias = item
         * element.iterator1 = index
         */
        /**
         * 对象遍历
         * v-for="(value, key, index) in object
         * element.for = list
         * element.alias = item
         * element.iterator1 = key
         * element.iterator2 = index
        */
        processFor(element);
        // v-if="showModal" => el.if="showModal" el.ifConditions = [{exp: "showModal", block: el}]
        // v-else => el.else = true
        // v-else-if="!showModal" => el.elseif = "!showModal"
        processIf(element);
        // v-once => element.once = true
        processOnce(element);
      }

      // 如果解析当前组件的根节点还未定义，那此时的 element 就是根节点。因为 template 的解析是从前往后的，所以肯定是 root 节点最先解析
      if (!root) {
        root = element;
        {
          // 主要校验根节点不能是 <slot> 节点，或者 v-for 不能用在 template 节点上。
          checkRootConstraints(root);
        }
      }

      // 如果不是一元标签，则将当前元素压入堆栈，以便结束标签匹配
      // 否则，则处理结尾标签
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },
    end,
    chars,
    comment
  }) {
    // 省略代码...
  }
}
```
在 options.start 函数中处理了四种内部指令： v-pre 、 v-for 、 (v-if / v-else / v-else-if) 、 v-once，特别注意 v-for 和 v-if 指令生成的 ASTElement 对象的属性。

剩余的指令处理，集中到最后调用的 closeElement 函数中。实际上在此函数中主要调用 parseElement 函数

```js
function closeElement (element) {

  if (!inVPre && !element.processed) {
    element = processElement(element, options);
  }
  // 省略代码...
}
```

### processElement 函数处理 key / ref / is / v-slot / class

```js
function processElement ( element, options) {
  // element.key = keyValue，并且校验 key 不能用在 template 元素上，也不能用在transition-group的子元素身上
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  // 无格式的朴素元素，即没有绑定key,没有插槽，没有绑定任何属性，如 <div>this is plain element</div>
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  );
  // element.ref = refValue
  processRef(element);
  // 处理 v-solt 或者旧版 slot-scope 属性
  processSlotContent(element);
  // 处理 slot 元素的结尾标签 <slot/> ，设置 element.slotName=name 并校验 slot 元素上不能绑定 key
  processSlotOutlet(element);
  // <component :is="Child"></component> 设置 element.ecomponent = 'Child'
  processComponent(element);
  // transforms => transformNode，处理 class 属性，分静态 class 和动态绑定的 class
  // el.staticClass = JSON.stringify(staticClass), 比如： el.staticClass="'test-class'"
  // el.classBinding = classBinding; 比如： el.classBinding = "{show?'active':''}"
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
  return element
}
```

这里主要关注 processAttrs 函数，集中处理了剩余的指令

### processAttrs 函数处理剩余指令

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
        name = name.replace(bindRE, '');
        // 解析过滤器
        value = parseFilters(value);
        isDynamic = dynamicArgRE.test(name); // 比如： v-bind:[eventName]
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        if ( value.trim().length === 0 ) {
          warn$2(
            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
          );
        }
        if (modifiers) {
          // 将name驼峰化
          if (modifiers.prop && !isDynamic) {
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel && !isDynamic) {
            name = camelize(name);
          }
          // 如果 v-bind:show.sync=value，则需要添加 update:show 的事件
          if (modifiers.sync) {
            syncGen = genAssignmentCode(value, "$event");
            if (!isDynamic) {
              addHandler(
                el,
                ("update:" + (camelize(name))),
                syncGen,
                null,
                false,
                warn$2,
                list[i]
              );
              if (hyphenate(name) !== camelize(name)) {
                addHandler(
                  el,
                  ("update:" + (hyphenate(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
              }
            } else {
              // handler w/ dynamic event name
              addHandler(
                el,
                ("\"update:\"+(" + name + ")"),
                syncGen,
                null,
                false,
                warn$2,
                list[i],
                true // dynamic
              );
            }
          }
        }
        if ((modifiers && modifiers.prop) || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value, list[i], isDynamic);
        } else {
          addAttr(el, name, value, list[i], isDynamic);
        }
      } else if (onRE.test(name)) { // v-on @
        name = name.replace(onRE, '');
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        // 解析事件各种修饰符，最后添加 el.events 或 el.nativeEvents 数组中储存着 handler
        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
      } else { // normal directives v-show v-text v-html v-model 和 自定义指令
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        isDynamic = false;
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1);
            isDynamic = true;
          }
        }
        // el.directives
        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
        if (name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute 文字属性 title href src
      {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.',
            list[i]
          );
        }
      }
      // el.attrs 或 el.dynamicAttrs
      addAttr(el, name, JSON.stringify(value), list[i]);
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true', list[i]);
      }
    }
  }
}
```
processAttrs 处理了各种指令，我们主要关注各种指令处理后的值。

- 如果存在动态绑定属性，el.hasBinding = true
- v-bind 指令如果作用在组件上，会调用 addAttrs 存入 el.attrs = [] 数组中，如果是元素，会调用 addProp 存储 el.props = [] 数组中，每个存入的元素都包含解析出来的指令修饰符对象 modifiers 
- v-on 指令会通过 addHandler 函数，区分是否有 .native 修饰符，分别存入 el.events 和 el.nativeEvents 数组中
- 剩余指令 v-show / v-text / v-html / v-model 和 自定义指令会存储 el.directives 数组中
- 如果是常规的静态属性，如 title / href 之类，同 v-bind 类似存入 el.props 或 el.attrs 数组中。

```js
ASTElement = {
  attrs: [], // 用于组件，静态属性
  dynamicAttrs: [], // 用于组件 v-bind
  props: [], // 普通元素属性
  events: [], // v-on
  nativeEvents: [], // v-on:click.native 用于组件
  directives: [], // v-text v-html v-show v-model 自定义指令
  pre: Boolean, // v-pre
  if: exp, // v-if
  ifConditions: [{exp,block}],
  else: Boolean, // v-else
  elseif: exp, // v-else-if
  for: object, // v-for
  alias: item,
  iterator1: key,
  iterator2: index,
  once: Boolean, // v-once
  slot: [], // v-slot
  key: keyValue, // :key="keyValue"
  ref: refValue, // ref="refValue"
  staticClass: String, // class="test"
  classBinding: String // :class="bindTest"
}
```

之后，parse 函数执行完毕，生成嵌套的 ASTElement 元素形成 AST 树。传入 optimize(ast,optons)，处理后再传入 generate(ast,optons)函数。

## 模板编译阶段 generate 生成指令结果

在 parse 阶段，通过 processXXX 函数解析了开始标签内的各种属性和指令，存入了 ASTElement 对象的对应的属性中。

在 generate 函数中，则会通过 genXXX 函数处理 ASTElement 对象中指令的各个属性的值。

函数调用全路径是 `generate(ast,options) => genElement(ast, state) => genStatic / genOnce / genFor / genIf / genChildren / genSlot / genComponent / genData => genDirectives / genProps / genHandlers / genScopedSlots`

Vue 有一些内置指令在内部是自己实现的，针对这些指令的处理函数是通过在 state 实参传入的，包括 v-show / v-model / v-text / v-show

```js
function generate (ast, options) { // options = baseOptions
  var state = new CodegenState(options); // 添加部分options
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};
```
这里指令的代码 `this.directives = extend(extend({}, baseDirectives), options.directives);`，其中：options.directives 是在 `createCompiler(baseOptions)` 传入的 baseOptions
```js
var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

var directives$1 = {
  model: model,
  text: text,
  html: html
};
```
其中定义了 v-text / v-html / v-model 指令的处理程序：

```js
function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
  }
}

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
  }
}

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead.",
        el.rawAttrsMap['v-model']
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.',
      el.rawAttrsMap['v-model']
    );
  }

  // ensure runtime directive metadata
  return true
}
```

至于这些指令处理程序在何时调用，待后面讲到 genDirective 函数时讲解。现在我们重新来看 generate 函数，它会调用 `genElement(ast, state)`，我们也知道 state 中有部分指令需要的处理函数。

### genElement 函数处理 v-once / v-for / v-if / is / v-slot

```js
function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      // "_c('div', {attrs:{id:'test-id'}, children},"
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}
```
这里我们例举几个我们关注的函数：

```js
// v-once => _o
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      state.warn(
        "v-once can only be used inside v-for that is keyed. ",
        el.rawAttrsMap['v-once']
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

// v-for => _l
function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      el.rawAttrsMap['v-for'],
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

// v-if => (a)?_m(0):_m(1)
function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

// <component :is='Child'> => _c(Child, data, children)
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}
```
### genData 函数处理剩余指令

除此之外，其它指令主要通过 genData 函数生成 _c 函数需要的 data 实参：

data 是一个对象字符串，各个指令的解析值添加到 key-value 中。

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
  // attributes 组件的属性添加到了 data.attrs
  if (el.attrs) {
    data += "attrs:" + (genProps(el.attrs)) + ",";
  }
  // DOM props 这里可以看到之前在 processAttrs 中针对普通元素处理的 el.props 改为了 data.domPorps
  if (el.props) {
    data += "domProps:" + (genProps(el.props)) + ",";
  }
  // event handlers 事件处理调用 genHandlers
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
genData 函数这里实际上直接处理了 v-bind 解析到 ASTElement.props 和 ASTElement.attrs 中的数据。这里还需要关注的是一开始就处理的 genDirective 函数，以及针对 v-on 绑定的事件 genHandlers 函数

### genDirective 函数处理 v-show / v-html / v-text / v-model 及自定义指令

在 parse 阶段的 processAttrs 中的 addDirective 函数中我们把这些指令都添加到了 ASTElement。directives 属性中。 然后在 generate 阶段的 genElement 中的 genData 中调用 genDirective 函数。

```js
function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;

  // 取出 ASTElement.directives 中的所有指令逐个遍历处理
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    // 这里调用 state.directives 就是上面特意讲的在 genElement 调用前初始化的步骤：
    // `this.directives = extend(extend({}, baseDirectives), options.directives);`
    // baseOptions.directives 有 v-html / v-text / v-model 指令的处理函数赋值给了 gen
    var gen = state.directives[dir.name]; // gen 只针对 v-html / v-text / v-model 指令，执行后i没有返回值，所以 needRunTime = undefined
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn); // 如果是 v-text 指令相当于调用 text(el, dir) 返回 undefined
    }
    if (needRuntime) { // v-show 和 自定义指令会执行下面逻辑，即完成拼接 directives: [{},{}]
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) { // v-show 和 自定义指令会执行下面逻辑，即完成拼接
    return res.slice(0, -1) + ']'
  }
}
```
```js
function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
  }
}

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
  }
}

// function model () 函数仍旧调用了一系列 genXXX 函数，我们看下其中一个针对 input 的处理 genDefaultModel 
function genDefaultModel (
    el,
    value,
    modifiers
  ) {
    var type = el.attrsMap.type;

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
      var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
      var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (value$1 && !typeBinding) {
        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
        warn$1(
          binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
          'because the latter already expands to a value binding internally',
          el.rawAttrsMap[binding]
        );
      }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy
      ? 'change'
      : type === 'range'
        ? RANGE_TOKEN
        : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', ("(" + value + ")"));
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }
```
通过 genDirective 函数，我们知道如下结果：
- v-html 指令执行 html 函数，调用 addProp 函数，向 ASTElement.props 数组添加 {name: 'innerHTML', ...} 对象
- v-html 指令执行 text 函数，调用 addProp 函数，向 ASTElement.props 数组添加 {name: 'textContent', ...} 对象
- v-model 指令针对 input 元素，调用 addProp 函数，添加 {name: 'value', ...} 属性和调用 addHandler 函数向 el.events 数组中添加 blur 事件
- 剩余的 v-show 和自定义指令则向 data:{directives:[{v-show}, {自定义指令}]}

这就是为什么 genData 函数一开始就调用 genDirective 函数，因为 genDirective 函数处理逻辑还在向 ASTElement 对象属性中添加数据。必须执行在 genProp 之前。

### genHandlers 函数处理 v-on 事件

`v-on:eventName.modifier=handler` 事件指令处理函数需要处理各类修饰符，增加或补全事件处理函数的代码。最终的结果是在 data 中完成 data.on 和 data.nativeOn 数组的值
```js
// genData
if (el.events) {
  data += (genHandlers(el.events, false)) + ",";
}
if (el.nativeEvents) {
  data += (genHandlers(el.nativeEvents, true)) + ",";
}

// isNative 处理 nativeEvent 中事件，即针对组件事件有.native 修饰符。
// dynamic 属性代表动态获取事件名的写法： v-on[dynamicEventName]="handler"
function genHandlers (
  events,
  isNative
) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  var dynamicHandlers = "";
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
至此，各个指令处理分化的结果：

- v-show 和自定义指令，存入了 data.directives 数组中
- v-if / v-else / v-else-if 处理成 (a)?_m(0):_m(1)
- v-for 处理成 _l
- v-once 处理成 _o
- v-text 向 data.domProps 中添加 textContent 属性
- v-html 向 data.domProps 中添加了 innerHTML 属性
- v-model 分别向 data.domProps 中添加了 value 属性和向 data.on 添加 input 事件
- v-on 向 data.on 添加事件
- v-bind 分别向 data.attrs 或 data.domProps 数组添加数据
- v-pre 存入了 data.pre:true

```js
// _createElement(tag, data, children)
data: {
  directives: [],
  key: keyValue,
  ref: refValue,
  pre: true,
  tag: ComponentName,
  staticClass,
  classBinding,
  attrs: [],
  domProps: [],
  on: [],
  nativeOn: [],
  slot,
  model: {value, callback, expression}
}
```

之后通过 vm._render 调用执行代码字符串的 with 语句，调用 createElement 及各种辅助函数生成虚拟 DOM 树，即嵌套结构的 vnode 节点。

最后将 vnode 传入 vm._update 函数中执行 patch 函数，生成真正的 DOM 元素。

## 渲染阶段 patch 执行指令处理程序

函数调用全路径： `vm._update => createPatchFunction => patch => createElm => createComponnent / invokeCreateHooks => create => updateAttrs / updateClass / updateDOMListeners / updateDOMProps / updateStyle / updateDirectives`

这里关注 createElm 函数，在这个函数中分出两条主线：一条是组件创建实例化过程，另一个是普通元素处理中执行 crate 钩子函数处理已创建的真实 dom 元素的各种属性 updateXXX 处理函数

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
  // 省略无关代码

  // 第一步就是用当前 vnode 尝试创建组件，如果不能创建组件则作为普通元素向下处理，否则执行创建组件逻辑
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  var data = vnode.data;
  var children = vnode.children;
  var tag = vnode.tag;
  if (isDef(tag)) {
    // 如果是作为普通元素标签，则用标签 tag 创建元素 nodeOps.createElement(tag, vnode)，但暂时该元素没有任何属性和事件绑定，相当创建一个空对象，还没有任何属性一样。
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode);
    setScope(vnode);

      // 尝试递归创建子元素
      createChildren(vnode, children, insertedVnodeQueue);
      // 如果有 vnode.data ，即 generate 阶段处理传给 createElement 函数的 data
      if (isDef(data)) {
        // 关键步骤：执行元素创建钩子函数 create，在这里面会向空元素添加属性和绑定事件
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
      // 最后向父元素插入当前创建的新元素
      insert(parentElm, vnode.elm, refElm);

      if (data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) { // 注释元素
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else { // 文本元素
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }
```
所以看下函数 invokeCreateHooks 的定义：

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
关键的是执行 cbs.create 函数。cbs 变量是在 patch 函数的 createPatchFunction 函数中保存着。看下 cbs 的初始化过程：

```js
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
  
  // 省略代码
  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    // 省略代码
    createElm(vnode)
  }
}
```

所以可以看到关键是 modules 定义，它包含两部分：platformModules 和 baseModules

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
可以看到 modules 中定义了元素中各个属性在各个钩子函数的处理。就属性和事件举例来说：

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
    updateClass,
    updateStyle,
    updateDOMProps,
    updateDOMListeners,
    updateDirectives
  ],
  update: [...],
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
`cbs.create[i$1](emptyNode, vnode);`即会执行钩子函数create，即 cbs.create 内的全部钩子。

```js
updateAttrs => elm.removeAttribute(key)
updateClass => el.setAttribute('class', cls)
updateStyle => setProp => el.style.setProperty(name, val)
updateDOMProps => elm.appendChild(elm.firstChild) / elm.removeChild(elm.firstChild)
updateDOMListeners => updateListeners => add / remove=> target.addEventListener(event, handler) / target.removeEventListener(event, handler)
updateDirectives => _update => callHook$1(dir, 'bind / update / insert / unbind', vnode, oldVnode) => callback(vnode.elm, dir, vnode, oldVnode, isDestroy)
```



