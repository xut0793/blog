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
  '/FE-Framework/Element-UI/': [
    // { text: 'el-form', link: '/FE-Framework/Element-UI/el-form' },
    // { text: 'el-upload', link: '/FE-Framework/Element-UI/el-upload' },
  ],
  '/FE-Framework/Vue/': [
    {
      text: 'vue简介',
      children: [
        {
          text: 'vue',
          link: '/FE-Framework/Vue/vue-tutorial/vue-1-why-use-vue',
        },
      ],
    },
    {
      text: 'vue基础之HTML',
      children: [
        {
          text: '2指令directive',
          link: '/FE-Framework/Vue/vue-tutorial/vue-2-template-directive',
        },
        {
          text: '3插值和v-html',
          link: '/FE-Framework/Vue/vue-tutorial/vue-3-template-插值-v-html',
        },
        {
          text: '4元素可见性v-if和v-show',
          link: '/FE-Framework/Vue/vue-tutorial/ue-4-template-v-if-and-v-show',
        },
        {
          text: '5列表渲染v-for',
          link: '/FE-Framework/Vue/vue-tutorial/vue-5-template-v-for',
        },
        {
          text: '6绑定属性v-bind',
          link: '/FE-Framework/Vue/vue-tutorial/vue-6-template-v-bind',
        },
        {
          text: '7绑定事件v-on',
          link: '/FE-Framework/Vue/vue-tutorial/vue-7-template-v-on-and-modifier',
        },
        {
          text: '8表单元素双向绑定v-model',
          link: '/FE-Framework/Vue/vue-tutorial/vue-8-template-v-model',
        },
        {
          text: '9模板内容的多种写法',
          link: '/FE-Framework/Vue/vue-tutorial/vue-9-template-render-jsx',
        },
        { text: '', link: '/FE-Framework/Vue/vue-tutorial/' },
      ],
    },
    {
      text: 'vue基础之CSS',
      collapsable: false,
      children: [
        {
          text: '10绑定样式',
          link: '/FE-Framework/Vue/vue-tutorial/vue-10-template-v-bind-with-class-and-style',
        },
      ],
    },
    {
      text: 'vue基础之JS',
      children: [
        {
          text: '11配置项options',
          link: '/FE-Framework/Vue/vue-tutorial/vue-11-js-vue-options',
        },
        {
          text: '12数据data',
          link: '/FE-Framework/Vue/vue-tutorial/vue-12-js-data',
        },
        {
          text: '13计算属性computed',
          link: '/FE-Framework/Vue/vue-tutorial/vue-13-js-computed',
        },
        {
          text: '14方法methods',
          link: '/FE-Framework/Vue/vue-tutorial/vue-14-js-methods',
        },
        {
          text: '15监听watch',
          link: '/FE-Framework/Vue/vue-tutorial/vue-15-js-watch',
        },
        {
          text: '16过滤器filter',
          link: '/FE-Framework/Vue/vue-tutorial/vue-16-js-filters',
        },
        {
          text: '17混入mixins',
          link: '/FE-Framework/Vue/vue-tutorial/vue-17-js-mixins',
        },
        {
          text: '18自定义指令directive',
          link: '/FE-Framework/Vue/vue-tutorial/vue-18-js-directive',
        },
        {
          text: '19生命周期lifecycle',
          link: '/FE-Framework/Vue/vue-tutorial/vue-19-js-lifecycle',
        },
        {
          text: '20获取DOM元素',
          link: '/FE-Framework/Vue/vue-tutorial/vue-20-js-ref',
        },
        {
          text: '21配置项对比',
          link: '/FE-Framework/Vue/vue-tutorial/vue-21-js-data-computed-watch-methods-filters',
        },
        {
          text: '22vue作用域',
          link: '/FE-Framework/Vue/vue-tutorial/vue-22-vue-scope',
        },
        {
          text: '23异步nextTick',
          link: '/FE-Framework/Vue/vue-tutorial/vue-23-js-nextTick',
        },
      ],
    },
    {
      text: 'vue组件',
      children: [
        {
          text: '24组件内容目录',
          link: '/FE-Framework/Vue/vue-tutorial/vue-24-component',
        },
        {
          text: '25组件概念',
          link: '/FE-Framework/Vue/vue-tutorial/vue-25-component-introduce',
        },
        {
          text: '26组件api之prop',
          link: '/FE-Framework/Vue/vue-tutorial/vue-26-component-prop',
        },
        {
          text: '27组件api之event',
          link: '/FE-Framework/Vue/vue-tutorial/vue-27-component-event',
        },
        {
          text: '28组件api之slot',
          link: '/FE-Framework/Vue/vue-tutorial/vue-28-component-slot',
        },
        {
          text: '29组件实例引用ref',
          link: '/FE-Framework/Vue/vue-tutorial/vue-29-component-ref',
        },
        {
          text: '30组件通信6种方法',
          link: '/FE-Framework/Vue/vue-tutorial/vue-30-component-组件间通信6种方法',
        },
        {
          text: '31异步组件',
          link: '/FE-Framework/Vue/vue-tutorial/vue-31-component-异步组件-工厂函数',
        },
        {
          text: '32内置组件transition',
          link: '/FE-Framework/Vue/vue-tutorial/vue-32-component-transition',
        },
        {
          text: '33内置组件keep-alive',
          link: '/FE-Framework/Vue/vue-tutorial/vue-33-component-keep-alive',
        },
        {
          text: '34动态组件component',
          link: '/FE-Framework/Vue/vue-tutorial/vue-35-component-is',
        },
      ],
    },
    {
      text: 'vue技术栈之vue-router',
      children: [
        {
          text: '内容目录',
          link: '/FE-Framework/Vue/vue-router/vue-router-1-index',
        },
        {
          text: '前端路由的发展',
          link: '/FE-Framework/Vue/vue-router/vue-router-2-evolution',
        },
        {
          text: 'vue-router使用',
          link: '/FE-Framework/Vue/vue-router/vue-router-3-usage',
        },
      ],
    },
    {
      text: 'vue技术栈之vuex',
      children: [
        { text: '内容目录', link: '/FE-Framework/Vue/vue-router/vuex-1-index' },
        { text: 'vuex使用', link: '/FE-Framework/Vue/vue-router/vuex-2-usage' },
      ],
    },
    {
      text: 'vue技术栈之ssr',
      children: [
        { text: '内容目录', link: '/FE-Framework/Vue/vue-ssr/vue-ssr-index' },
        { text: 'ssr简介', link: '/FE-Framework/Vue/vue-ssr/vue-ssr-intro' },
        { text: 'ssr实现', link: '/FE-Framework/Vue/vue-ssr/vue-ssr-demo' },
      ],
    },
    { text: 'vue技术栈之axios', link: 'https://www.axios-http.cn/' },
    { text: 'vue技术栈之vue-cli', link: 'https://cli.vuejs.org/zh/' },
    { text: 'vue技术栈之vue-loader', link: 'https://vue-loader.vuejs.org/zh/' },
    { text: 'vue技术栈之vite', link: '/FE-Framework/Vue/vite/' },
    {
      text: 'Vue实践总结',
      children: [
        {
          text: '环境变量',
          link: '/FE-Framework/Vue/vue-tutorial/vue-practice-1-setenv',
        },
        {
          text: 'jsx总结',
          link: '/FE-Framework/Vue/vue-tutorial/vue-practice-2-jsx',
        },
        {
          text: 'vue异步队伍',
          link: '/FE-Framework/Vue/vue-tutorial/vue-practice-3-watch-selector',
        },
      ],
    },
  ],
  '/FE-Framework/vue-technology-source-code': [
    {
      text: '源码vue',
      children: [
        {
          text: '内容目录',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-0-index',
        },
        {
          text: '响应式原理1：侦测数据变化',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-1-reactivity-1-detection-chnage',
        },
        {
          text: '响应式原理2：收集依赖',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-1-reactivity-2-collect-dependency',
        },
        {
          text: '响应式原理3：源发更新',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-1-reactivity-3-dispatch-update',
        },
        {
          text: '响应式原理4：总结',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-1-reactivity-4-summary',
        },
        {
          text: '模板编译1：模板内容的几种形式',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-2-compile-0.md',
        },
        {
          text: '模板编译2：解析器parse',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-2-compile-1-parse.md',
        },
        {
          text: '模板编译3：优化器optimize',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-2-compile-2-optimize.md',
        },
        {
          text: '模板编译4：生成器generate',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-2-compile-3-generate.md',
        },
        {
          text: '视图渲染1：virtual dom 和 vnode',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-3-virtual-dom-1-create-vnode',
        },
        {
          text: '视图渲染2：diff算法',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-3-virtual-dom-2-diff',
        },
        {
          text: '组件1：继承extend',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-4-component-1-extend',
        },
        {
          text: '组件2：实例化',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-4-component-2-createComponent',
        },
        {
          text: '组件3：插槽slot',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-4-component-3-slot',
        },
        {
          text: '组件4：异步组件',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-4-component-4-async',
        },
        {
          text: '组件5：内部组件keep-alive',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-4-component-5-keep-alive',
        },
        {
          text: 'Vue构造函数及实例化',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-5-initialize-1-constructor',
        },
        {
          text: '选项合并mergeOptions',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-5-initialize-2-mergeOptions',
        },
        {
          text: '选项处理options',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-5-initialize-3-options',
        },
        {
          text: '生命周期lifecycle',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-6-extension-1-lifecycle',
        },
        {
          text: '事件中心event',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-6-extension-2-event',
        },
        {
          text: '异步任务nextTick',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-6-extension-3-nextTick',
        },
        {
          text: '指令directive',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-6-extension-4-directive',
        },
        {
          text: '过滤器filter',
          link: '/FE-Framework/vue-technology-source-code/vue-source-code-6-extension-5-filter',
        },
      ],
    },
    {
      text: '源码vue-router',
      children: [
        {
          text: '1安装install',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-1-install',
        },
        {
          text: '2初始化init',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-2-init',
        },
        {
          text: '3匹配路由matcher',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-3-matcher',
        },
        {
          text: '路由对象',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-4-history',
        },
        {
          text: '导航router-link',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-5-router-link',
        },
        {
          text: '视图router-view',
          link: '/FE-Framework/vue-technology-source-code/vue-router-source-code-6-router-view',
        },
      ],
    },
    {
      text: '源码vuex',
      children: [
        {
          text: '1注册',
          link: '/FE-Framework/vue-technology-source-code/vuex-source-code-1-install',
        },
        {
          text: '2实例化instance',
          link: '/FE-Framework/vue-technology-source-code/vuex-source-code-2-instance',
        },
        {
          text: '3接口api',
          link: '/FE-Framework/vue-technology-source-code/vuex-source-code-3-api',
        },
        {
          text: '4路由注册register',
          link: '/FE-Framework/vue-technology-source-code/vuex-source-code-4-register',
        },
        {
          text: '5插件实现plugin',
          link: '/FE-Framework/vue-technology-source-code/vuex-source-code-5-plugin',
        },
      ],
    },
    // {
    //   text: '源码vue-cli',
    //   children: [
    //     { text: '', link: '/FE-Framework/vue-technology-source-code/' },
    //   ]
    // },
    // {
    //   text: '源码vue-loader',
    //   children: [
    //     { text: '', link: '/FE-Framework/vue-technology-source-code/' },
    //   ]
    // },
    {
      text: '源码vue-server-render',
      children: [
        {
          text: 'vue-ssr',
          link: '/FE-Framework/vue-technology-source-code/vue-ssr-source-code',
        },
      ],
    },
  ],
  '/FE-Framework/React/': [
    {
      text: 'React基础',
      children: [
        {
          text: 'react-01-what_is_react',
          link: '/FE-Framework/React/react-01-what_is_react',
        },
        {
          text: 'react-02-React-createElement',
          link: '/FE-Framework/React/react-02-React-createElement',
        },
        {
          text: 'react-03-创建组件',
          link: '/FE-Framework/React/react-03-组件类',
        },
        {
          text: 'react-04-组件属性传递props',
          link: '/FE-Framework/React/react-04-组件属性传递props',
        },
        {
          text: 'react-05-组件嵌套props.children',
          link: '/FE-Framework/React/react-05-组件嵌套props.children',
        },
        {
          text: 'react-06-组件属性默认值defaultProps',
          link: '/FE-Framework/React/react-06-组件属性默认值defaultProps',
        },
        {
          text: 'react-07-组件属性值类型校验propsTypes',
          link: '/FE-Framework/React/react-07-组件属性值类型校验propsTypes',
        },
        {
          text: 'react-08-组件状态state',
          link: '/FE-Framework/React/react-08-组件状态state',
        },
        {
          text: 'react-09-有状态组件和无状态组件',
          link: '/FE-Framework/React/react-09-有状态组件和无状态组件',
        },
        {
          text: 'react-10-组件的事件',
          link: '/FE-Framework/React/react-10-组件的事件',
        },
        {
          text: 'react-11-react事件内幕SyntheticEvent',
          link: '/FE-Framework/React/react-11-react事件内幕SyntheticEvent',
        },
        {
          text: 'react-12-组件生命周期lifycycle',
          link: '/FE-Framework/React/react-12-组件生命周期lifycycle',
        },
        {
          text: 'react-13-JSX体验',
          link: '/FE-Framework/React/react-13-JSX体验',
        },
        {
          text: 'react-14-JSX语法',
          link: '/FE-Framework/React/react-14-JSX语法',
        },
        {
          text: 'react-15-React使用表单',
          link: '/FE-Framework/React/react-15-React使用表单',
        },
        {
          text: 'react-16-高阶组件HOC',
          link: '/FE-Framework/React/react-16-高阶组件HOC',
        },
        {
          text: 'react-17-创建React项目的三种方法',
          link: '/FE-Framework/React/react-17-创建React项目的三种方法',
        },
      ],
    },
    {
      text: 'React技术栈',
      children: [
        {
          text: 'create-react-app',
          link: '/FE-Framework/React/create-react-app',
        },
        {
          text: 'react-router-01-路由react-router原理',
          link: '/FE-Framework/React/react-router-01-路由react-router原理',
        },
        {
          text: 'react-router-02-React-Router-v4',
          link: '/FE-Framework/React/react-router-02-React-Router-v4',
        },
        {
          text: 'react-router-03-路由react-router的API',
          link: '/FE-Framework/React/react-router-03-路由react-router的API',
        },
        {
          text: 'react-redux-01-what_is_Redux',
          link: '/FE-Framework/React/react-redux-01-what_is_Redux',
        },
      ],
    },
    {
      text: 'React Hooks',
      link: '/FE-Framework/React/react-hooks',
    },
  ],
  '/FE-Engineering/dev-linter/': [
    { text: '概述', link: '/FE-Engineering/dev-linter/index' },
    { text: 'Eslint', link: '/FE-Engineering/dev-linter/Eslint' },
    { text: 'Stylelint', link: '/FE-Engineering/dev-linter/Stylelint' },
    { text: 'Prettier', link: '/FE-Engineering/dev-linter/Prettier' },
    { text: 'Husky', link: '/FE-Engineering/dev-linter/Husky' },
    { text: 'lint-staged', link: '/FE-Engineering/dev-linter/lint-staged' },
    { text: 'EditorConfig', link: '/FE-Engineering/dev-linter/EditorConfig' },
    { text: 'git-commit', link: '/FE-Engineering/dev-linter/git-commit' },
    { text: '整合实践', link: '/FE-Engineering/dev-linter/practice' },
  ],
  '/FE-Engineering/dev-test/': [
    { text: '概述', link: '/FE-Engineering/dev-test/index' },
    { text: 'Jest', link: '/FE-Engineering/dev-test/1-jest' },
    { text: 'vue项目集成jest', link: '/FE-Engineering/dev-test/2-jest-config' },
    { text: '测试vue组件', link: '/FE-Engineering/dev-test/3-vue-test' },
    {
      text: '测试vue-router',
      link: '/FE-Engineering/dev-test/4-vue-router-test',
    },
    { text: '测试vuex', link: '/FE-Engineering/dev-test/5-vuex-test' },
    { text: '测试vue-ssr', link: '/FE-Engineering/dev-test/6-vue-ssr-test' },
    { text: '快照测试', link: '/FE-Engineering/dev-test/7-snapshot-test' },
  ],
  '/FE-Engineering/ci-webpack/': [
    { text: '介绍', link: '/FE-Engineering/ci-webpack/intro' },
    { text: '配置', link: '/FE-Engineering/ci-webpack/config' },
    { text: '入口', link: '/FE-Engineering/ci-webpack/entry' },
    { text: 'HTML', link: '/FE-Engineering/ci-webpack/html' },
    { text: 'Assets', link: '/FE-Engineering/ci-webpack/asset' },
    { text: 'CSS', link: '/FE-Engineering/ci-webpack/css' },
    { text: 'js', link: '/FE-Engineering/ci-webpack/js' },
    { text: '开发', link: '/FE-Engineering/ci-webpack/dev' },
    { text: '生产', link: '/FE-Engineering/ci-webpack/prod' },
    { text: '优化', link: '/FE-Engineering/ci-webpack/perf' },
    { text: '环境变量', link: '/FE-Engineering/ci-webpack/env' },
    { text: 'webpack chain', link: '/FE-Engineering/ci-webpack/webpack-chain' },
    { text: '热更新源理', link: '/FE-Engineering/ci-webpack/hmr' },
  ],
  '/FE-Engineering/ci-gulp/': [
    { text: '前端工作流', link: '/FE-Engineering/ci-gulp/workflow' },
    { text: 'gulp 任务', link: '/FE-Engineering/ci-gulp/gulp_task' },
    { text: 'gulp 流', link: '/FE-Engineering/ci-gulp/gulp_stream' },
    { text: 'gulp 虚拟文件vinyl', link: '/FE-Engineering/ci-gulp/gulp_vinyl' },
  ],
  '/FE-Engineering/ci-vite/': [
    { text: '使用', link: '/FE-Engineering/ci-vite/usage' },
    { text: 'CLI', link: '/FE-Engineering/ci-vite/cli' },
    { text: '开发服务', link: '/FE-Engineering/ci-vite/server' },
    { text: '静态资源处理', link: '/FE-Engineering/ci-vite/assets' },
    { text: '预构建', link: '/FE-Engineering/ci-vite/optimize' },
    { text: '插件', link: '/FE-Engineering/ci-vite/plugin' },
    { text: 'Connect.js', link: '/FE-Engineering/ci-vite/connect' },
  ],
  '/FE-Engineering/cd-deploy/': [
    { text: 'FTP文件上传', link: '/FE-Engineering/cd-deploy/ftp' },
    { text: 'Github Actons', link: '/FE-Engineering/cd-deploy/github-actions' },
  ],
  '/Browser/2-DOM/': [
    {
      text: '',
      children: [
        { text: 'Node节点基类', link: '/Browser/2-DOM/Node' },
        { text: 'Document文档对象', link: '/Browser/2-DOM/Document' },
        { text: 'Element元素节点', link: '/Browser/2-DOM/Element' },
        { text: 'Text文本节点', link: '/Browser/2-DOM/Text' },
        { text: 'DOM Event 事件', link: '/Browser/2-DOM/Dom_Event' },
      ],
    },
  ],
  '/Browser/4-render/': [
    {
      text: '',
      children: [
        { text: '浏览器历史', link: '/Browser/4-render/history' },
        { text: '浏览器架构演化', link: '/Browser/4-render/architecture' },
        { text: '浏览器渲染机制', link: '/Browser/4-render/render' },
        { text: '浏览器事件循环', link: '/Browser/4-render/event-loop' },
        { text: 'v8执行机制', link: '/Browser/4-render/v8/' },
        { text: 'v8内存管理', link: '/Browser/4-render/stack-eap-GC' },
        { text: 'js执行上下文', link: '/Browser/4-render/js-execute' },
      ],
    },
  ],
  '/Browser/8-new-api/': [
    { text: '概念理解', link: '/Browser/8-new-api/Blob-File-ArrayBuffer-URL' },
  ],
  '/Network/protocol/': [
    { text: 'TCP/UDP', link: '/Network/protocol/tcp-udp' },
    {
      text: 'HTTP',
      children: [
        { text: '概述', link: '/Network/protocol/introduce' },
        { text: 'uri和mime', link: '/Network/protocol/uri-mime' },
        {
          text: '传话-连接-消息',
          link: '/Network/protocol/session-connect-message',
        },
        { text: '缓存cache-control', link: '/Network/protocol/http-cache' },
        { text: '会话cookie', link: '/Network/protocol/http-cookie' },
        { text: '跨域cors', link: '/Network/protocol/http-cors' },
        {
          text: '授权authorization',
          link: '/Network/protocol/http-authorization',
        },
        {
          text: '认证authentication',
          link: '/Network/protocol/http-authentication',
        },
      ],
    },
  ],
  '/Network/ajax/': [
    { text: 'XMLHttpRequest', link: '/Network/ajax/XMLHttpRequest' },
  ],
  '/Network/axios/': [
    {
      text: '源码解析',
      children: [
        { text: '1-实例化axios', link: '/Network/axios/1-instance' },
        { text: '2-请求实现promise', link: '/Network/axios/2-request-promise' },
        { text: '3-适配器adapter', link: '/Network/axios/3-adapter' },
        { text: '4-拦截器interceptor', link: '/Network/axios/4-interceptor' },
        {
          text: '5-数据转换器transformData',
          link: '/Network/axios/5-transform-data',
        },
        {
          text: '6-取消请求CancelToken',
          link: '/Network/axios/6-cancel-token',
        },
      ],
    },
  ],
  '/Network/duplex-service/': [
    { text: 'EventSource', link: '/Network/duplex-service/EventSource' },
    { text: 'WebSocket', link: '/Network/duplex-service/WebSocket' },
  ],
  '/Server/node/': [
    { text: '认识node', link: '/Server/node/introduce' },
    {
      text: '包管理器',
      children: [
        { text: 'npm', link: '/Server/node/npm' },
        { text: 'npx', link: '/Server/node/npx' },
        { text: 'nvm', link: '/Server/node/nvm' },
        { text: 'nrm', link: '/Server/node/nrm' },
        { text: 'yarn', link: '/Server/node/yarn' },
        { text: 'pnpm', link: '/Server/node/pnpm' },
      ],
    },
    {
      text: '核心概念',
      children: [
        { text: '事件循环机制', link: '/Server/node/eventloop' },
        { text: '全局变量', link: '/Server/node/global' },
        { text: '模块', link: '/Server/node/module' },
        { text: '其它概念', link: '/Server/node/concept' },
      ],
    },
    {
      text: '文件和数据操作',
      children: [
        { text: '缓冲器buffer', link: '/Server/node/buffer' },
        { text: '流stream', link: '/Server/node/stream' },
        { text: '文件操作fs', link: '/Server/node/fs' },
        { text: '路径path', link: '/Server/node/path' },
        {
          text: '计算机数据的理解',
          link: '/Server/node/bit-byte-stream-buffer',
        },
      ],
    },
    {
      text: '网络',
      children: [
        { text: 'http', link: '/Server/node/http' },
        { text: '网址解析url', link: '/Server/node/url' },
        { text: '查询字符串解析querystring', link: '/Server/node/querystring' },
      ],
    },
    // {
    // 	text: '进程管理',
    // 	children: ['process', 'child-process', 'cluster', 'worker_threads']
    // },
    // {
    // 	text: '工具模块',
    // 	children: ['util', 'timer', 'crypto', 'zlib']
    // },
    // {
    // 	text: '调试',
    // 	children: ['erros', 'console', 'debugger', 'repl']
    // },
    // {
    // 	text: '系统',
    // 	children: ['os', 'v8', 'vm']
    // },
  ],
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
  '/Tools/git/': [
    {
      text: 'git',
      children: [
        { text: '安装', link: '/Tools/git/install' },
        { text: '使用', link: '/Tools/git/usage' },
        { text: '工作流', link: '/Tools/git/git-flow' },
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
