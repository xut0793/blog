# 模板编译2：parse 解析器

HTML 模板的解析逻辑就是循环解析 template 字符串，用正则做各种类型片段的匹配，对于不同情况分别进行不同的处理，直到整个 template 被解析完毕。 在匹配的过程中会利用 advance 函数不断前进整个模板字符串，直到字符串末尾。

```js
function advance (n) {
  index += n
  html = html.substring(n)
}
```

需要被截取处理的片段分多种类型：
- 开始标签，如 `<div>`; 开始标签中还要解析属性数据，如`<div id='test' @click='onClick'>`等
- 结束标签，如`</div>`
- 注释，如 `<!-- 这是HTML注释-->`
- DOCTYPE声明，如 `<!DOCTYPE HTML>`
- 条件注释，如 `<!--[if !IE]>-->条件注释<!--<![endif]-->`
- 文本，包括纯文本和变量文本，如`线文本`, `变量文本{{message}}`

这些不同的类型片段，都由相应的正则表达式匹配：

```js
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
```
然后匹配成功，都有对应的处理函数处理生成对应的 AST 结构：

```js
parseHTML(template, {
  // 省略代码...
  start: function start (tag, attrs, unary, start$1, end) {　// 处理开始标签
    var element = createASTElement(tag, attrs, currentParent);
    processRawAttrs(element)
    processFor(element);
    processIf(element);
    processOnce(element);
  },
  end: function end (tag, start, end$1) {...}, //处理结束标签
  chars: function chars (text, start, end) {...}, // 处理文本片段
  comment: function comment (text, start, end) {...}) // 处理注释处理
})
```

DOM 是有层级嵌套关系的，所以对应生成的 AST 也是有嵌套结构，通过内部维护一个数组堆栈来解决，用栈来记录层级关系，这个层级关系可以理解为DOM的深度。

HTML 解析器总是从前往后解析，每当遇到开始标签，使用 start 函数处理后，把当前构建的节点推入栈中；当遇到结束标签，使用 end 函数处理，就从栈中弹出一个节点。这样保证每次处理 sart 函数时，栈中最后一个节点就是当前正在处理节点的父节点。

## 总体流程

- 首先判断模板第一个字符是不是 `<`：
- 如果是，再进一步以各种类型的正则来匹配片段特征，进行相应的处理。因为以此开头类型太多了，比如开始标签、结束标签、注释等。
- 如果不是以 `<` 开始，那一定是文本片段

![vue-source-code-compile-parse.png](../image/vue-source-complie-parse.png)

## 源码解析

```js
//  $mount： prototype.￥mount 有两个：
// 一个是web平台重写的 mount，主要是模板解析成 render，
// 另一个是核心公共的 mount，主要是 render 渲染。

var mount = Vue.prototype.$mount; 
// 公共mount代码，主要是 render 渲染过程，核心代码 vm._update(vm._render())，执行 vm.$options.render()
Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el);

  // 省略代码：解析拿到 template 的值
  if (template) {
    // 如果 template 值存在，则进行模板解析，得到渲染函数，赋值给 render 属性。
    var ref = compileToFunctions(template, {
      outputSourceRange: "development" !== 'production',
      shouldDecodeNewlines: shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
      delimiters: options.delimiters,
      comments: options.comments
    }, this);

    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    options.render = render;
    options.staticRenderFns = staticRenderFns;
  }
  return mount.call(this, el, hydrating)
};

// 一系列适配的函数柯里化后，最基础的是 baseCompile
var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;

var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  // 模板编译的核心三步骤：parse / optimize / generate
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
```
第一步解析模板成 AST：parse函数，核心是 parseHTML 函数的调用。
```js
function parse (
  template,
  options
) {

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var whitespaceOption = options.whitespace;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  // 省略辅助函数的声明代码
  parseHTML(template, {
    // 省略代码...
    start: function start (tag, attrs, unary, start$1, end) {　// 处理开始标签
      var element = createASTElement(tag, attrs, currentParent);
      processRawAttrs(element)
      processFor(element);
      processIf(element);
      processOnce(element);
    },
    end: function end (tag, start, end$1) {...}, //处理结束标签
    chars: function chars (text, start, end) {...}, // 处理文本片段
    comment: function comment (text, start, end) {...}) // 处理注释处理
  })
  return root
}
```
parseHTML函数通过 advance 函数和正则匹配，不断截取字符进行处理，直到 template 截到空为止

```js
function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;

  // 循环处理直到 template 被截为空字符
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<'); // 是否以 < 开头
      if (textEnd === 0) {
        /**
         * 以 < 开头，又有很多种情况：
         * 1. 注释，如 `<!-- 这是HTML注释-->`
         * 2. 条件注释，如 `<!--[if !IE]>-->条件注释<!--<![endif]-->`
         * 3. DOCTYPE声明，如 `<!DOCTYPE HTML>`
         * 4. 结束标签，如`</div>`
         * 5. 其它情况都当作开始标签处理：比如`<div id='test' @click='onClick'>`等
        */

        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue
        }
      }

      // 如果 < 存在，但不是第一个字符，是在其它位置，则有可能文本内容包含 < 字符，都处理成text，如 `这是一段包含<符号的文本`
      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      // 如果模板中找不到 < ，则说明整个模板都是文本
      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }
      // 使用文本处理钩子 chars
      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      // 省略代码：处理纯文本内容的元素，如 script style
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (!stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {...}

  function handleStartTag (match) {...}

  function parseEndTag (tagName, start, end) {...}
}
```
其中重要关注的开始标签的解析，开始标签通常包含：标签名、指令、属性、事件等，主要包括两步` parseStartTag()` 和 `handleStartTag(startTagMatch)`，两者都在 parseHTML 函数内部声明的，看上面省略的代码。

```js
// Start tag:
var startTagMatch = parseStartTag(); // 解析开始标签,返回一个对象
if (startTagMatch) {
  handleStartTag(startTagMatch);
  if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
    advance(1);
  }
  continue
}


// parseStartTag
/**
 * return match = {
 *  tagName,
 *  attrs
 *  unarySlash
 *  start
 *  end
 * }
*/
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
    // 循环处理：不是结束标签，并且含有动态绑定（如指令事件等）的或普通属性时循环匹配，将匹配结果推入 match.attrs
    // var startTagClose = /^\s*(\/?)>/ 是否是自闭合标签或者说一元标签 <img>、<br/>
    // var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
   // var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
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
  }
}
// handleStartTag
/**
 * match = {
 *  tagName: "div",
 *  attrs: [["id="test_id"", "id", "=", "test_id", index: 0, input: "id="test_id", start:0, end:9]],
 *  unarySlash: null
 *  start: 2
 *  end: 10
 * };
*/
function handleStartTag (match) {
  var tagName = match.tagName;
  var unarySlash = match.unarySlash;
  var unary = isUnaryTag$$1(tagName) || !!unarySlash;

  // 省略代码...
  // 这里的信心是对 match.attrs 的处理，拿到属性名和属性值
  /**
   * match.attrs: [["id="test_id"", "id", "=", "test_id", index: 0, input: "id="test_id", start:0, end:9]],
   * 
   * 结果：attrs: [{name: 'id', value: "test-di", start, end},{name: "@click", value: "onClick"}]
  */
  var l = match.attrs.length;
  var attrs = new Array(l);
  for (var i = 0; i < l; i++) {
    var args = match.attrs[i];
    var value = args[3] || args[4] || args[5] || '';
    var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
      ? options.shouldDecodeNewlinesForHref
      : options.shouldDecodeNewlines;
    attrs[i] = {
      name: args[1],
      value: decodeAttr(value, shouldDecodeNewlines)
    };
    if (options.outputSourceRange) {
      attrs[i].start = args.start + args[0].match(/^\s*/).length;
      attrs[i].end = args.end;
    }
  }

  if (!unary) {
    // 压入堆栈，当解析到结束标签时，用于匹配开始标签， lastTag总是堆栈最上面的标签
    stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
    lastTag = tagName;
  }
  // parseHTML 调用时传入的 start / end / chars 处理函数
  if (options.start) {
    options.start(tagName, attrs, unary, match.start, match.end);
  }
}
```
在 options.start 函数中的核心是三件事：
- 创建 AST 元素：createASTElement
- 处理 AST 元素：判断 element 是否包含各种指令通过 processXXX 做相应的处理，处理的结果就是扩展 AST 元素的属性
- AST 树管理：同样利用 stack 堆栈处理 AST 各种嵌套关系，如父子关系
```js
parseHTML(template, {
  // 省略其它代码...
  start: function start (tag, attrs, unary, start$1, end) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        // 创建 AST 树
        var element = createASTElement(tag, attrs, currentParent);

        // AST 树处理
        if (ns) {
          element.ns = ns;
        }

        {
          if (options.outputSourceRange) {
            element.start = start$1;
            element.end = end;
            element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
              cumulated[attr.name] = attr;
              return cumulated
            }, {});
          }
          attrs.forEach(function (attr) {
            if (invalidAttributeRE.test(attr.name)) {
              warn$2(
                "Invalid dynamic argument expression: attribute names cannot contain " +
                "spaces, quotes, <, >, / or =.",
                {
                  start: attr.start + attr.name.indexOf("["),
                  end: attr.start + attr.name.length
                }
              );
            }
          });
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          warn$2(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            "<" + tag + ">" + ', as they will not be parsed.',
            { start: element.start }
          );
        }

        // apply pre-transforms
        // 转换各种属性，定义在：
        // parse 函数中： preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
        // preTransformNode 函数处理 v-for v-if/v-else 以及针对 checkbox radio 的特殊处理，其中核心的是 processElement 函数
        for (var i = 0; i < preTransforms.length; i++) {
          element = preTransforms[i](element, options) || element;
        }

        if (!inVPre) {
          processPre(element); // v-pre
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else if (!element.processed) {
          // structural directives 
          // 处理开始标签中 v-for / v-if / v-else / v-once 指令
          processFor(element);
          processIf(element);
          processOnce(element);
        }

        // AST 树管理
        if (!root) {
          root = element;
          {
            checkRootConstraints(root);
          }
        }

        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },
})
```
preTransformNode 函数处理 v-for v-if/v-else 以及针对 checkbox radio 的特殊处理，其中核心的是 processElement 函数。

processElement 函数里调用一系列 processXXX 函数处理对应部分内容，如 ref key slot attr 等内容。
```js
function processElement (
  element,
  options
) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  );

  processRef(element);
  processSlotContent(element);
  processSlotOutlet(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
  return element
}
```

开始标签中具体关于 v-for 和 key，以及 v-if / v-else， 以及动态属性v-bind、动态类名 v-bind:class，动态行内样式 v-bind:style，以及绑定事件 v-on 的解析，后面关于指令章节再讲。

parse 函数最终返回 AST ，给 optimize 函数使用。下一节讲解 optimize 源码部分。