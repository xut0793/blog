# 模板编译1：模板内容的形式

[[toc]]

## Vue 模板内容的形式

在 Vue 中编写 HTML 内容主要有以下几种方式：
1. render 属性：createElement / jsx
1. template 属性: template / x-template
1. el

```js
// JSX语法需要安装插件
// npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
new Vue({
    el: "#example_render_JSX",
    data: {
        msg: "Hello Vue by render JSX"
    },
    render: function () {
        return (
            <div>{{ msg }}</div>
        )
    }
})

// createElement
new Vue({
    el: "#example_render_createElement",
    data: {
        msg: "Hello Vue by render createElement"
    },
    render: function (h) {
        return h("div", this.msg)
    },
})

// template string
new Vue({
    el: "#example_template_string",
    data: {
        msg: "Hello Vue by template string"
    },
    template: `<div>
                <span>{{ msg }}</span>
            </div>`,
})

// template element
<template id="temp_tag">
    <div>{{ msg }}</div>
</template>
<script>
new Vue({
    el: "#example_template_tag",
    data: {
        msg: "Hello Vue by template tag"
    },
    // 使用<template>标签写法
    template: "#temp_tag",
    
})
</script>

// template x-template
<script id="temp_script" type="text/x-template">
    <div>{{ msg }}</div>
</script>

<script>
new Vue({
    el: "#example_script",
    data: {
        msg: "Hello Vue by template script"
    },
    template: "#temp_script"
})
</script>

// outerHtml
<div id="example_outerHTML">
    <div>{{ msg }}</div>
</div>

<script>
new Vue({
    el: "#example_outerHTML",
    data: {
        msg: "HELLO VUE by outerHTML"
    }
})
</script>
```

## template 解析

所以 web 平台 Vue 在挂载时，主要是两件事：
1. 如果没有 render ，解析 template 值
1. 将 template　编译成渲染函数，赋值给 render 属性

template 解析：
1. options.render 是否有值，有直接用，无则判断是否有 template
1. options.template 是否有值，有解析 template，无则判断是否有 el
1. options.template 是否是字符串，如果是，字符串是否是以 # 开头，如果不是以　# 开头，就是纯字符串直接返回
1. options.template 字符串且以 # 开头，则调用 idToTemplate 拿到值

```js
var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* 挂载点元素不能是 body 或者 document */
  if (el === document.body || el === document.documentElement) {
    warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          if (!template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) { // template 属性直接是 DOM 元素
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) { // 没有 template 属性，获取挂载点内的 html 节点
      template = getOuterHTML(el);
    }
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
  }
  return mount.call(this, el, hydrating)
};

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});
```

# template 编译

在拿到 template　值后，会调用　compileToFunctions　函数将模板编译得到　render 。


compileToFunctions 函数是为了适应各平台内容，经过一系列函数柯里化后的函数。

```js

var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;

var createCompiler = createCompilerCreator(baseCompile);

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      // 省略代码...
      var compiled = baseCompile(template.trim(), finalOptions);
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

function baseCompile (
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
}
```

在 baseCompile 函数中看到模板编译的核心代码，所以模板编译主要分为三部分：
1. parse 函数将模板解析为 AST，属性于解析器功能
1. optimize 函数遍历 AST 标记为静态节点，属性优化器功能
1. generate 函数使用 AST 生成渲染函数，属性代码生成器功能

```js
// 假设 template　内容
template: `<div ic="test" @click="onClick">{{message}}</div>`
// 1. parse(template)后的 AST
{
  tag: "div",
  type: 1,
  parent: undefined,
  attrsList: [
    {
      name: "id",
      value: "test"
    },
    {
      name: "@click",
      value: "onClick"
    }
  ],
  arrtsMap: {
    @click: "onClick",
    id: "test"
  },
  children: [
    {
      type: 2,
      text: "{{message}}",
      expression: "_s(message)'
    }
  ]
}
// 2. optimize(ast, options) 优化。主要判断 static: false；staticRoot: false
{
  tag: "div",
  type: 1,
  parent: undefined,
+ static: false,
+ staticRoot: false,
  attrsList: [
    {
      name: "id",
      value: "test"
    },
    {
      name: "@click",
      value: "onClick"
    }
  ],
  arrtsMap: {
    @click: "onClick",
    id: "test"
  },
  children: [
    {
      type: 2,
    + static: false,
      text: "{{message}}",
      expression: "_s(message)'
    }
  ]
}

// 3. generate(ast, options) 生成渲染函数：
// 渲染函数其实就是一系列嵌套在一起的创建元素节点的函数：_c / _v / _s 等
`with(this){return _c('div',{attrs:{"id":"test"},on:{"click":onClick}},[_v(_s(message))])}`
```