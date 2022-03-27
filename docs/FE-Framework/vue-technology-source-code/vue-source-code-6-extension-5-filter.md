# 过滤器 filter

[[toc]]

## 过滤器的使用

过滤器注册也分为全局注册和组件内注册：
```js
// 全局注册
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// 组件内 fitler 选项注册
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```
过滤器使用可以在`{{ }}`插槽中，也可以应用在`v-bind`表达式中：
```js
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```
另外，关于过滤器两点事项：
- 过滤器应该总是被添加在 JavaScript 表达式的尾部，由管道符号`|`指示
- 过滤器可以接收参数，但表达式的值始终为第一个参数。


因为过滤器有两种使用场景，所以也需要从两个场景的代码上看源码

## 过滤器应用在插槽中

首先需要知道插槽在 Vue 源码中哪里被解析的。根据前端编译章节的理解，插槽解析函数的路径是：

`$mount => compileToFunctions => createCompiler => baseCompile => parse => parseHTML => options.chars`

```js
function parse (template, options) {
  // 省略代码
  parseHTML(template, {
    // 省略代码
    start,
    end,
    comment,
    chars: function chars (text, start, end) {
      // currentParent 是在解析开始标签时压入堆栈的栈顶元素 
      // 在 start 中 if (!unary) { currentParent = element; stack.push(element); }
      // 在 end 中  stack.length -= 1; currentParent = stack[stack.length - 1];
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start: start }
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored."),
              { start: start }
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }

      var children = currentParent.children;

      // 主要是对 text 为空的处理逻辑
      if (inPre || text.trim()) { // 当 text 非空时返回 text
        // function isTextTag (el) { return el.tag === 'script' || el.tag === 'style'}
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
      } else if (!children.length) { // 如果 text 是空格，且元素没有子节点,则删除开始标记之后仅限空白的节点
        // remove the whitespace-only node right after an opening tag  
        text = '';
      } else if (whitespaceOption) { // 空白处理策略 whitespace?: 'preserve' | 'condense'; 保留还是浓缩
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' ';
        } else { // preserve 保留空格
          text = ' ';
        }
      } else {
        text = preserveWhitespace ? ' ' : '';
      }

      // text 有值处理
      if (text) {
        if (!inPre && whitespaceOption === 'condense') { 
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE$1, ' '); // 将多个空格压缩成单个空格
        }
        var res;
        var child;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          // 如果非v-pre内容，且 text 不为空，且存在插槽动态绑定内容
          child = {
            type: 2,
            expression: res.expression, // _f("capitalize")("message")
            tokens: res.tokens, // [{@binding: _f("capitalize")("message")}]
            text: text
          };
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          // test 不为空，或者 不存在 children时，或者有子元素且最后一个子元素是文本元素且文本不为空
          child = {
            type: 3,
            text: text
          };
        }
        if (child) {
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          // 作为子元素插入
          children.push(child);
        }
      }
    }
  })
}
```
其中关键的是 parseText 函数
```js
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});
/**
 * 例子：
 * text: "{{ message | capitalize }}"
 */
function parseText (
  text,
  delimiters // 可以自定义插槽的符号，默认是 {{ 和 }}
) {
  // 因为可以自定义插槽符号，所以需要根据 delimiters 动态创建匹配正则
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) { // 纯文本返回 undefined
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim()); // _f("capitalize")("message")
    tokens.push(("_s(" + exp + ")")); // _s => toString
    rawTokens.push({ '@binding': exp }); // {@binding: _f("capitalize")("message")}
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}
```
此时出现过滤器解析的函数 parseFilters

```js
var validDivisionCharRE = /[\w).+\-_$\]]/;

/**
 * parseFilters 对 exp 表达式逐个字符解析，处理多种边界情况，最终结果是
 * "message | capitalize" => _f("capitalize")("message")
 * "message | capitalize('arg1','arg2')" => _f("capitalize")("message",'arg1','arg2')
 * "message | filterA | filterB" => _f("filterB")(_f("filterA")("message"))
 */
function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) { // exp: message filter: capitalize
  var i = filter.indexOf('(');
  if (i < 0) { // 说明过滤器没有带参数
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")  // _f("capitalize")("message")
  } else { // 过滤器有带参数 capitalize('arg1','arg2')"
    var name = filter.slice(0, i); // capitalize
    var args = filter.slice(i + 1); // 'arg1','arg2') 注意这里结尾有 )，所以下面拼接时最后的不添加 ）
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}
```
## 过滤器应用在 v-bind 中

v-bind 用于在开始标签中绑定动态属性，所以函数路径跟上一节讲解指令基本一样：
`$mount => compileToFunctions => createCompiler => baseCompile => parse => parseHTML => parseStartTag => handlerStartTag => options.start => closeElement => processElement => processAttrs => processFilters`

具体 processFilters 解析同上面。

```js
// var onRE = /^@|^v-on:/;
// var dirRE = /^v-|^@|^:|^#/;
// var argRE = /:(.*)$/;
// var bindRE = /^:|^\.|^v-bind:/;
// var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
// var dynamicArgRE = /^\[.*\]$/;
// 这个函数处理了修饰符、事件过滤器、事件绑定
function processAttrs (el) {
  // attrsList: [ {name: 'v-bind:atrr', value: 'value | filterV',start,end}]
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) { // dirRE = /^v-|^@|^:|^#/; 即匹配 v-on / @ / v-bind / : / v-slot / #
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers 解析动态属性修饰符，比如 @click.stop, v-bind:show.sync
      // modifiers = {sync: true, stop: true}
      modifiers = parseModifiers(name.replace(dirRE, ''));
      // support .foo shorthand syntax for the .prop modifier
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind:attr or :attr
        name = name.replace(bindRE, ''); // name = attr
        // 解析过滤器
        value = parseFilters(value); // value = '_f("filterV")("value")' 关于 parseFilter 具体见上面分析
        isDynamic = dynamicArgRE.test(name); // 比如： v-bind:[eventName]
        if (isDynamic) { // v-bind:[attr]，则去掉前后的 [ ]
          name = name.slice(1, -1); 
        }
        if ( value.trim().length === 0 ) {
          warn$2(
            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
          );
        }
      // 省略代码
}
```

## 过滤器的执行

通过上面可以知道，一个过滤器表达式最终会被 parseFilter 解析成带 _f 函数的代码字符串
```js
"message | capitalize" => _f("capitalize")("message")
"message | capitalize('arg1','arg2')" => _f("capitalize")("message",'arg1','arg2')
"message | filterA | filterB" => _f("filterB")(_f("filterA")("message"))
```
这些代码字符串，最终在 generate 函数中包裹在 with 函数中返回，由 createFunction 函数生成 render 结果赋值给 vm.$options.render

```js
// generate
function generate (ast, options) {
  // 省略代码
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);

  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (template, options) {
      // 省略代码...
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (template, options, vm ) {
    options = extend({}, options);
    // 省略代码

    // compile
    var compiled = compile(template, options);

    // 省略代码
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // 省略代码
  }
}

// vm.render
function createFunction (code, errors) {
  try {
    // 此函数调用，即执行 with 语句："with(this){return " + code + "}"，返回 code。 而code中的 _c / _f / _s 等等函数会在 vm._render 函数中调用
    return new Function(code) 
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}
```
code 代码字符串的下划线简写函数是在 Vue 构造函数初始化时，renderMinixs(Vue) 中调用 installRenderHelpers(Vue.prototype) 传入的。

```js
function renderMixin (Vue) {
  // install runtime convenience helpers
  // 在原型上安装 _c / _f / _s 等等工具函数
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    try {
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement); // vm._renderProxy = vm，此时即执行代码字符串 code 中的函数。
    } catch (e) {
      // 省略代码
    }
};
```
```js
function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}
```
这里我们看下过滤器相关的 `target._f = resolveFilter` 函数

```js
// _f("capitalize")("message") 过滤器执行 id = "capitalize"
// _f 函数是在 Vue 构造函数初始化时 renderMinixs(Vue) 中调用 installRenderHelpers(Vue.prototype) 传入的。
// 会在 vm._render 函数中调用 render.call(vm._renderProxy, vm.$createElement);
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 * 
 * 从 vm.$options 中提出对应的资源
 * resolveAsset(this.$options, 'filters', id, true) || identity
 * Ctor = resolveAsset(context.$options, 'components', tag)
 * resolveAsset(vm.$options, 'directives', dir.name, true);
 */
function resolveAsset (
  options, // vm.$options 在 _init 函数 mergeOptions 时合并了选项
  type, // type = filters / components / directives
  id, // key
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type]; // vm.$options[filters] 取出声明的所有过滤器
  // check local registration variations first
  // 在 options.filters 中检查是否有 type 的过滤器，有则返回
  // 如果没有，将 type 变成小驼峰形式再试，有则返回
  // 如果还没有，将 type 变成大驼峰形式再试，有则返回
  // 如果仍没有，打印警告
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}
```