module.exports = {
  '/Design/': [
    {
      text: '设计',
      children: [
        { text: 'Font 字体', link: '/Design/font' },
        { text: 'Color 色彩', link: '/Design/color' },
        { text: 'Image 图像', link: '/Design/image' },
      ],
    },
    {
      text: '工具',
      children: [{ text: 'Figma', link: '/Design/figmat' }],
    },
  ],
  '/FE-Language/HTML/': [
    {
      text: 'HTML基础',
      children: [
        { text: 'HTML是什么', link: '/FE-Language/HTML/0-introduce' },
        { text: 'HTML语法', link: '/FE-Language/HTML/1-grammar' },
      ],
    },
    {
      text: 'HTML文档结构',
      children: [
        { text: '文档内容模型', link: '/FE-Language/HTML/2-content-model' },
        { text: '文档结构', link: '/FE-Language/HTML/3-doc-structure' },
        { text: '文档声明 doctype', link: '/FE-Language/HTML/4-doctype' },
        { text: '文档根元素 html', link: '/FE-Language/HTML/5-html' },
        { text: '文档头部 head', link: '/FE-Language/HTML/6-head' },
        { text: '文档主体 body', link: '/FE-Language/HTML/7-body' },
      ],
    },
    {
      text: 'HTML主要元素',
      children: [
        {
          text: '面布局语义化元素',
          link: '/FE-Language/HTML/8-layout-structural-semantics',
        },
        {
          text: '文本结构语义化元素',
          link: '/FE-Language/HTML/9-text-structural-semantics',
        },
        {
          text: '文本内容语义化元素',
          link: '/FE-Language/HTML/10-text-content-semantics',
        },
        { text: '链接 a', link: '/FE-Language/HTML/11-a' },
        { text: '图像 img', link: '/FE-Language/HTML/12-img' },
        { text: '表格 table', link: '/FE-Language/HTML/13-table' },
        { text: '表单 form', link: '/FE-Language/HTML/14-form' },
      ],
    },
  ],
  '/FE-Language/ES/': [
    {
      text: '前言',
      children: [
        { text: '软件基本概念', link: '/FE-Language/ES/intro-1-software' },
        { text: 'EcmaScript历史', link: '/FE-Language/ES/intro-2-es-history' },
      ],
    },
    {
      text: '基本语法',
      children: [
        { text: '概括', link: '/FE-Language/ES/base-0-index' },
        {
          text: '表达式与操作符',
          link: '/FE-Language/ES/base-1-expression-operators',
        },
        { text: '变量', link: '/FE-Language/ES/base-2-variant' },
        { text: '语句', link: '/FE-Language/ES/base-3-statement' },
        { text: '严格模式(use strict)', link: '/FE-Language/ES/base-4-strict' },
      ],
    },
    {
      text: '数据类型',
      children: [
        { text: '值和类型', link: '/FE-Language/ES/type-0-index' },
        { text: '类型检测', link: '/FE-Language/ES/type-7-checking' },
        {
          text: '原始值和包装对象',
          link: '/FE-Language/ES/type-8-primitive-wrapper',
        },
        { text: '类型转换', link: '/FE-Language/ES/type-9-conversion' },
        {
          text: 'Null / Undefined / Boolean 类型',
          link: '/FE-Language/ES/type-1-null-undefined-boolean',
        },
        { text: 'Number 类型', link: '/FE-Language/ES/type-2-number' },
        { text: 'String 类型', link: '/FE-Language/ES/type-3-string' },
        { text: 'Object 类型', link: '/FE-Language/ES/type-6-object' },
        { text: 'Symbol 类型', link: '/FE-Language/ES/type-4-symbol' },
        { text: 'Bigint 类型', link: '/FE-Language/ES/type-5-bigInt' },
      ],
    },
    {
      text: '面向对象',
      children: [
        { text: '概括', link: '/FE-Language/ES/oop-0-index' },
        {
          text: '对象和面向对象',
          link: '/FE-Language/ES/oop-0-object-history',
        },
        { text: '创建对象', link: '/FE-Language/ES/oop-1-object-create' },
        {
          text: '对象属性和操作',
          link: '/FE-Language/ES/oop-2-object-property',
        },
        { text: '原型和原型链', link: '/FE-Language/ES/oop-3-prototype' },
        {
          text: '构造函数实现面向对象',
          link: '/FE-Language/ES/oop-4-constructor',
        },
        { text: 'class实现面向对象', link: '/FE-Language/ES/oop-5-class' },
        { text: '继承', link: '/FE-Language/ES/oop-6-inherit' },
      ],
    },
    {
      text: '函数 Function',
      children: [
        { text: '概括', link: '/FE-Language/ES/fn-0-index' },
        { text: '函数是特殊的对象', link: '/FE-Language/ES/fn-1-intro' },
        { text: '函数基础概念', link: '/FE-Language/ES/fn-2-base' },
        { text: '函数运行的概念', link: '/FE-Language/ES/fn-3-runtime' },
        { text: '函数高阶应用', link: '/FE-Language/ES/fn-4-senior' },
        { text: '', link: '/FE-Language/ES/' },
      ],
    },
    {
      text: '内置对象',
      children: [
        { text: '对象分类', link: '/FE-Language/ES/built-in-index' },
        { text: 'GlobalThis', link: '/FE-Language/ES/built-in-GlobalThis' },
        { text: 'Boolean', link: '/FE-Language/ES/built-in-Boolean' },
        { text: 'Number', link: '/FE-Language/ES/built-in-Number' },
        { text: 'String', link: '/FE-Language/ES/built-in-String' },
        { text: 'Array', link: '/FE-Language/ES/built-in-Array' },
        { text: 'Map', link: '/FE-Language/ES/built-in-Map' },
        { text: 'Set', link: '/FE-Language/ES/built-in-Set' },
        { text: 'Map', link: '/FE-Language/ES/built-in-Map' },
        {
          text: 'WeakMap-WeakSet',
          link: '/FE-Language/ES/built-in-WeakMap-WeakSet',
        },
        { text: 'Date', link: '/FE-Language/ES/built-in-Date' },
        { text: 'RegExp', link: '/FE-Language/ES/built-in-RegExp' },
        { text: 'Error', link: '/FE-Language/ES/Error' },
      ],
    },
    {
      text: '异步编程',
      children: [
        { text: '异步编程的演进', link: '/FE-Language/ES/async-0-history' },
        { text: 'promise', link: '/FE-Language/ES/async-0-promise' },
        {
          text: 'generator / iterator',
          link: '/FE-Language/ES/async-0-generator-iterator',
        },
        { text: 'async / await', link: '/FE-Language/ES/async-0-async-await' },
      ],
    },
    {
      text: '模块化编程',
      children: [
        { text: '前端模块化演进', link: '/FE-Language/ES/module-0-history' },
        { text: 'CommonJS', link: '/FE-Language/ES/module-1-commonjs' },
        {
          text: 'AMD-requirejs',
          link: '/FE-Language/ES/module-2-amd-requirejs',
        },
        { text: 'UMD', link: '/FE-Language/ES/module-3-umd' },
        { text: 'ES Module', link: '/FE-Language/ES/module-4-es-module' },
      ],
    },
    {
      text: 'ES Next',
      children: [
        { text: 'ES next 新特性', link: '/FE-Language/ES/es-next-index' },
      ],
    },
  ],
  '/FE-Language/TS/': [
    {
      text: '基础',
      children: [
        { text: 'Typescript简介', link: '/FE-Language/TS/0-introTS' },
        { text: '安装', link: '/FE-Language/TS/install' },
        { text: '配置文件', link: '/FE-Language/TS/tsconfig' },
        {
          text: '基础类型声明',
          link: '/FE-Language/TS/1-type-declaration-1.1-basic-type',
        },
        {
          text: '函数声明',
          link: '/FE-Language/TS/1-type-declaration-1.2-function',
        },
        {
          text: '类声明',
          link: '/FE-Language/TS/1-type-declaration-1.3-class',
        },
        { text: '类型推导', link: '/FE-Language/TS/2-type-inference' },
        { text: '类型检查', link: '/FE-Language/TS/3-type-checking' },
        { text: '类型编程', link: '/FE-Language/TS/4-type-programming' },
        { text: '模块', link: '/FE-Language/TS/module' },
        { text: '声明文件', link: '/FE-Language/TS/declaration' },
      ],
    },
    {
      text: '实践',
      children: [
        { text: '前端状态枚举的思考', link: '/FE-Language/TS/practice-enum' },
        { text: '初始化node+ts环境', link: '/FE-Language/TS/practice-ts-node' },
        { text: '初始化vue+ts环境', link: '/FE-Language/TS/practice-ts-vue' },
      ],
    },
  ],
  // '/Browser/DOM/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: [
  //       'Node',
  //       'Document',
  //       'Element',
  //       'Text',
  //       'Dom_Style',
  //       'Dom_Event',
  //     ],
  //   },
  // ],
  // '/Browser/Render/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: [
  //       'intro',
  //       'structure',
  //       'render',
  //       'v8',
  //       'js_execute',
  //       'stack_heap_GC',
  //       'cache',
  //     ],
  //   },
  // ],
  // '/Browser/MISC/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: ['Blob-File-ArrayBuffer-URL'],
  //   },
  // ],
  // '/FE-Framework/Vue/': [
  //   {
  //     text: 'Vue简介',
  //     collapsable: false,
  //     children: ['vue-1-whyusevue-vue-jquery'],
  //   },
  //   {
  //     text: 'Vue基础之HTML',
  //     collapsable: false,
  //     children: [
  //       'vue-2-template-directive',
  //       'vue-3-template-插值-v-html',
  //       'vue-4-template-v-if-and-v-show',
  //       'vue-5-template-v-for',
  //       'vue-6-template-v-bind',
  //       'vue-8-template-v-on-and-modifier',
  //       'vue-9-template-v-model',
  //       'vue-13-template-render-JSX',
  //     ],
  //   },
  //   {
  //     text: 'Vue基础之CSS',
  //     collapsable: false,
  //     children: ['vue-7-template-v-bind-with-class-and-style'],
  //   },
  //   {
  //     text: 'Vue基础之JS',
  //     collapsable: false,
  //     children: [
  //       'vue-14-js-vue-options',
  //       'vue-15-js-data',
  //       'vue-16-js-computed',
  //       'vue-17-js-methods',
  //       'vue-18-js-watch',
  //       'vue-19-js-filters',
  //       'vue-20-js-data-computed-watch-methods-filters',
  //       'vue-21-js-mixins',
  //       'vue-22-js-directive',
  //       'vue-23-js-lifeCycle_hooks',
  //       'vue-10-template-ref',
  //       'vue-11-vue-scope',
  //       'vue-12-js-nextTick',
  //     ],
  //   },
  //   {
  //     text: 'Vue组件',
  //     collapsable: false,
  //     children: [
  //       'vue-24-component',
  //       'vue-25-component-introduce',
  //       'vue-26-component-prop',
  //       'vue-27-component-event',
  //       'vue-28-component-.native-.sync-model',
  //       'vue-29-component-slot',
  //       'vue-30-component-组件实例的引用',
  //       'vue-31-component-组件间通信6种方法',
  //       'vue-32-component-异步组件-工厂函数',
  //       'vue-33-component-内置组件transition',
  //       'vue-34-component-内置组件keep-alive',
  //       'vue-35-component-动态组件component',
  //     ],
  //   },
  //   {
  //     text: 'Vue源码解析',
  //     collapsable: false,
  //     children: [
  //       'vue-source-code-1-reactivity-1-detection-chnage',
  //       'vue-source-code-1-reactivity-2-collect-dependency',
  //       'vue-source-code-1-reactivity-3-dispatch-update',
  //       'vue-source-code-1-reactivity-4-summary',
  //       'vue-source-code-2-compile-0.md',
  //       'vue-source-code-2-compile-1-parse.md',
  //       'vue-source-code-2-compile-2-optimize.md',
  //       'vue-source-code-2-compile-3-generate.md',
  //       'vue-source-code-3-virtual-dom-1-create-vnode',
  //       'vue-source-code-3-virtual-dom-2-patch',
  //       'vue-source-code-4-component-1-extend',
  //       'vue-source-code-4-component-2-patch',
  //       'vue-source-code-4-component-3-slot',
  //       'vue-source-code-4-component-4-async',
  //       'vue-source-code-4-component-5-keep-alive',
  //       'vue-source-code-5-initialize-1-constructor',
  //       'vue-source-code-5-initialize-2-mergeOptions',
  //       'vue-source-code-5-initialize-3-instance',
  //       'vue-source-code-6-extension-1-lifecycle',
  //       'vue-source-code-6-extension-2-event',
  //       'vue-source-code-6-extension-3-nextTick',
  //       'vue-source-code-6-extension-4-directive',
  //       'vue-source-code-6-extension-5-filter',
  //     ],
  //   },
  //   {
  //     text: 'Vue技术栈之VueRouter',
  //     collapsable: false,
  //     children: [
  //       'vue-router-1-index',
  //       'vue-router-2-evolution',
  //       'vue-router-3-usage',
  //       'vue-router-4-source-code-install',
  //       'vue-router-5-source-code-init',
  //       'vue-router-6-source-code-matcher',
  //       'vue-router-7-source-code-history',
  //       'vue-router-8-source-code-router-link',
  //       'vue-router-9-source-code-router-view',
  //     ],
  //   },
  //   {
  //     text: 'Vue技术栈之Vuex',
  //     collapsable: false,
  //     children: [
  //       'vuex-1-index',
  //       'vuex-2-usage',
  //       'vuex-3-source-code-install',
  //       'vuex-4-source-code-instance',
  //       'vuex-5-source-code-api',
  //       'vuex-6-source-code-register',
  //       'vuex-7-source-code-plugin',
  //     ],
  //   },
  //   {
  //     text: 'Vue技术栈之Axios',
  //     collapsable: false,
  //     children: ['axios-index'],
  //   },
  //   {
  //     text: 'Vue技术栈之VueCli',
  //     collapsable: false,
  //     children: ['vue-cli-1-index'],
  //   },
  //   {
  //     text: 'Vue工程实践',
  //     collapsable: false,
  //     children: ['vue-practice-1-setenv', 'vue-practice-2-jsx'],
  //   },
  //   {
  //     text: '其它杂项',
  //     collapsable: false,
  //     children: [
  //       'compare-vue2-vue3',
  //       'HTML5_template',
  //       'outerHTML-innerTHML-outerText-innerText-textContent',
  //       'JS-callback-Promise-Generator-Async',
  //     ],
  //   },
  // ],
  // '/FE-Framework/React/': [
  //   {
  //     text: 'React 基础',
  //     collapsable: false,
  //     children: [
  //       'react-01-what_is_react',
  //       'react-02-React.createElement',
  //       'react-03-组件类 class Name extends React.Component',
  //       'react-04-组件属性传递props',
  //       'react-05-组件嵌套props.children',
  //       'react-06-组件属性默认值defaultProps',
  //       'react-07-组件属性值类型校验propsTypes',
  //       'react-08-组件状态state',
  //       'react-09-有状态组件和无状态组件',
  //       'react-10-组件的事件',
  //       'react-11-react事件内幕SyntheticEvent',
  //       'react-12-组件生命周期lifycycle',
  //       'react-13-JSX体验',
  //       'react-14-JSX语法',
  //       'react-15-React使用表单',
  //       'react-16-高阶组件HOC',
  //       'react-17-创建React项目的三种方法',
  //     ],
  //   },
  //   {
  //     text: 'React 技术栈',
  //     collapsable: false,
  //     children: [
  //       'react-cli',
  //       'react-router-01-路由react-router原理',
  //       'react-router-02-React-Router-v4',
  //       'react-router-03-路由react-router的API',
  //       'react-redux-01-what_is_Redux',
  //       'react-redux-02-React-Redux',
  //     ],
  //   },
  //   {
  //     text: 'React Hooks',
  //     collapsable: false,
  //     children: ['react-hooks'],
  //   },
  // ],
  // '/FE-Engineering/Webpack/': [
  //   {
  //     text: '基础入门',
  //     collapsable: false,
  //     children: ['Intro', 'Module', 'InstallAndUsage'],
  //   },
  //   {
  //     text: '配置项',
  //     collapsable: false,
  //     children: ['Entry', 'Output'],
  //   },
  //   {
  //     text: '项目构建实践',
  //     collapsable: false,
  //     children: ['Html'],
  //   },
  //   {
  //     text: '进阶深入源码',
  //     collapsable: false,
  //     children: ['ResourceCode'],
  //   },
  // ],
  // '/FE-Engineering/Lint/': [
  //   {
  //     text: '编码规范',
  //     collapsable: false,
  //     children: [
  //       'EditorConfig',
  //       'Eslint',
  //       'Prettier',
  //       'Stylelint',
  //       'Husky',
  //       'lint-staged',
  //     ],
  //   },
  // ],
  // '/FE-Engineering/Git/': [
  //   {
  //     text: '源代码管理',
  //     collapsable: false,
  //     children: ['GitInstall', 'GitUse', 'GitFlow', 'GitCommit'],
  //   },
  // ],
  // '/FE-Engineering/Doc/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: ['Vuepress'],
  //   },
  // ],
  // "/FE-Engineering/Api/": [
  //   {
  //     text: "",
  //     collapsable: false,
  //     children: ["Restful"],
  //   },
  // ],
  // '/Network/Ajax/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: ['XMLHttpRequest', 'Fetch', 'WebSocket', 'EventSource'],
  //   },
  // ],
  // '/Network/Axios/': [
  //   {
  //     text: '源码解析',
  //     collapsable: false,
  //     children: [
  //       'source-code-1-instance',
  //       'source-code-2-request-promise',
  //       'source-code-3-adapter',
  //       'source-code-4-interceptor',
  //       'source-code-5-cancel-token',
  //       'source-code-6-transform-data',
  //     ],
  //   },
  // ],
  // '/Network/HTTP/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: [
  //       'introduce',
  //       'URI_MIME',
  //       'session_connect_message',
  //       'httpCache',
  //       'httpCookie',
  //       'httpCORS',
  //       'httpAuth',
  //     ],
  //   },
  // ],
  // '/Backend/Node/': [
  // {
  //   text: '认识Node',
  //   collapsable: false,
  //   children: ['introduce', 'nvm', 'npm-yarn', 'npx'],
  // },
  // {
  //   text: '核心概念',
  //   collapsable: false,
  //   children: ['eventloop', 'global', 'module', 'concept'],
  // },
  // {
  //   text: '文件和数据操作',
  //   collapsable: false,
  //   children: ['buffer', 'stream', 'path', 'fs', 'bit-byte-stream-buffer'],
  // },
  // {
  //   text: '网络管理',
  //   collapsable: false,
  //   children: ['http', 'url', 'querystring'],
  // },
  // {
  // 	text: '进程管理',
  // 	collapsable: false,
  // 	children: ['process', 'child-process', 'cluster', 'worker_threads']
  // },
  // {
  // 	text: '工具模块',
  // 	collapsable: false,
  // 	children: ['util', 'timer', 'crypto', 'zlib']
  // },
  // {
  // 	text: '调试',
  // 	collapsable: false,
  // 	children: ['erros', 'console', 'debugger', 'repl']
  // },
  // {
  // 	text: '系统',
  // 	collapsable: false,
  // 	children: ['os', 'v8', 'vm']
  // },
  // ],
  // '/Misc/': [
  //   {
  //     text: '',
  //     collapsable: false,
  //     children: ['InitDevEnv', 'tree-node-cli'],
  //   },
  // ],
  '/Tools/vim/': [
    {
      text: 'vim',
      children: [
        { text: '安装', link: '/Tools/vim/install' },
        { text: '概念', link: '/Tools/vim/concept' },
        { text: '快捷键', link: '/Tools/vim/shortcuts' },
      ],
    },
  ],
  '/Books/': [
    {
      text: 'JavaScript',
      children: [
        { text: '《JavaScript 学习指南》', link: '/Books/js_xuexizhinan' },
        { text: '《JavaScript 启示录》', link: '/Books/js_qishilv' },
        { text: '《JavaScript 语言精粹》', link: '/Books/js_yuyanjingcui' },
        { text: '《JavaScript 编程精粹》', link: '/Books/js_bianchengjingcui' },
        {
          text: '《JavaScript 专家编程》',
          link: '/Books/js_zhuangjiabiancheng',
        },
        {
          text: '《JavaScript 面向对象编程指南》',
          link: '/Books/js_object_oriented',
        },
        { text: '《JavaScript 忍者秘籍》', link: '/Books/js_ninja_secret' },
      ],
    },
    {
      text: 'CSS',
      children: [],
    },
  ],
}
