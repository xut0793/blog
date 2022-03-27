# 工程目录结构

Vue@2.x 项目工程推荐目录结构
> [生成目录树工具 tree-node-cli](../../Tools/node-tree-cli.md)
```
Vue-Project
├── public                                         // 静态资源文件夹，不经过 webpack 处理
│   ├── iconfont                                   // 字体图标 阿里 iconfont
│   ├── favicon.ico                                // 网站的 favicon 图标
│   └── index.html                                 // 网站的基本页面模板
├── src                                            // 源代码主目录
│   ├── assets                                     // 资源文件夹
│   │   ├── styles                                 // 请求接口
│   │   └── images                                 // 图片
│   ├── utils                                      // 自定义通用的工具方法
│   │   └── help.js
│   ├── constant                                   // 项目常量
│   │   └── index.js
│   ├── network                                    // 网络请求相关
│   │   ├── api                                    // 请求接口
│   │   │   ├── login.js                           // 业务模块接口
│   │   ├── test                                   // 接口调试（rest-client插件 )
│   │   │   └── login.http                         
│   │   └── axios                                  // axios 请求库
│   │       ├── index.js                           // axios 请求封装（请求拦截和响应拦截设置）
│   │       └── _axios_config.js                   // axios 请求配置文件
│   ├── components                                 // 全局公用的基础组件
│   ├── router                                     // 路由
│   │   ├── index.js                               // 路由注册和设置拦截器
│   │   └── routes.js                              // 预置的静态路由
│   ├── store                                      // vuex 数据状态
│   │   ├── login                                  // vuex modules 业务模块
│   │   │   └── index.js                           // states getters mutations actions 在一起文件
│   │   ├── productManage                          // vuex modules 业务模块
│   │   │   ├── actions.js                         // states getters mutations actions 分开
│   │   │   ├── getters.js
│   │   │   ├── index.js                           // 该模块states getters mutations actions 合并导出
│   │   │   ├── mutations.js
│   │   │   ├── states.js
│   │   │   └── types.js
│   │   └── index.js                               // vuex注册
│   ├── views                                      // 页面视图
│   │   ├── layout                                 // 布局页面
│   │   │   ├── header.vue
│   │   │   ├── index.vue
│   │   │   └── sidebar.vue
│   │   ├── login                                  // 登录页面
│   │   │   └── index.vue
│   │   └── storyManage                            // 页面模块
│   │       ├── components                         // 当前页面模块的组件
│   │       │   └── newAddStory.vue
│   │       ├── style                              // 当前页面模块及相关组件的样式
│   │       │   └── newAddStory.less
│   │       └── index.vue                          // 页面模块入口页面
│   ├── index.vue                                  // 入口页面
│   └── main.js                                    // 程序主入口
├── vue.config.js                                  // vue-cli3 的项目 webpack 配置文件
├── .editorconfig                                  // 编辑器格式配置
├── .eslintrc.js                                   
├── .eslintignore                                  
├── .prettierrc.js                                 
├── .prettierignore                                  
├── .stylelintrc.js                                  
├── .stylelintignore                                  
├── .huskyrc.js                                   
├── .lintstagedrc.js                                   
├── .gitignore                                    
├── babel.config.js                               
├── package-lock.json                             
├── package.json                                 
└── README.md   
```