# 前端工程化

说到工程，脑海先想到的是建筑行业的项目工程，它们的流程包括最开始的项目立项，了解客户需求，预算，建设，工程质量控制，各工种协作，盖好后还要验收等等流程。

对应到软件工程，也有一系列流程，包括项目立项，需求分析，代码开发，质量控制，团队协作，持续集成，上线后还要运维监控，性能优化等等。

最后具体到前端项目工程，常规流程包括项目工程初始化、开发、构建、部署、运维。并以此流程展开前端工程化内容的学习和总结。

## 工程化的目标
前端工程也属于软件工程范畴，软件工程化所关注的目标就是应用的性能、稳定性、可用性、可维护性、协作效率，同样是前端工程化的目标。所以一切能提升前端开发效率，提高前端应用质量的手段和工具都是前端工程化内容。

总结
- 概念：一切能提升前端开发效率，提高前端应用质量的手段和工具都是前端工程化内容。
- 目标（道）：工程化关注的是性能、稳定性、可用性、可维护性、协作效率等内容。
- 实践（术）：各类工具和各种模式(模块化、组件化、规范化、自动化)。

> - [谁能介绍下 web 前端工程化？](https://www.zhihu.com/question/24558375)
> - [前端工程化该怎么理解？](https://mp.weixin.qq.com/s/XwK9J1OD5SfjbBwKYA-cpA)

## 前端工作流
### 工程初始化
- 了解 package.json 中各字段的意义和作用
- 如何建立规范的工程目录结构，实现的工具包括Vue工程(vue-cli/create-vue/vite)、monorepo工程(lerna/wokspace)等。
- 如何沉淀符合项目需求的脚手架，实现的工具包括(commander/yargs/chalk/iquirer/ora/cosmiconfig/dotenv等)

### 开发阶段
- 本地开发服务 dev server
- api接口：接口测试工具(postman/rest-client)、mock服务(yapi/rar2/)、综合化工具(apifox/apipost)
- 代码规范: 约束工具(htmllint+stylelint+ eslint + Prettier+ editorconfig)、以及(commitlint + commitizen + cz-conventional-changelog + husky + lint-staged)
- 代码测试: jest/cypress
- 代码调试：sourcemap / DevTools / vscode

> [JavaScript 单元测试框架：Jasmine, Mocha, AVA, Tape 和 Jest 的比较](https://blog.csdn.net/weixin_34332905/article/details/87942007)

### 构建

构建是指一系列的处理，不同的语言构建会有不通的处理步骤，构建结果一般生成为一个或多个文件（制品），里面包括可以直接部署在线上环境中的所有内容。

前端构建的常见处理步骤包括：
- 代码编译：babel/postcss/esbuild
- 模块打包: webapck/rollup/parcel
- 代码优化: 压缩混淆(uglify/terser)、去除无用代码(DCE/treeshaking/purge-css)、代码分割(提取依赖库、提取框架运行时、公共代码、懒加载代码)


##### 编译
编译是指将源代码变为目标代码的过程，从源代码的语言转变为另外一种计算机语言（一般为比源代码语言更为低层级的语言）。

前端开发时，为了更好的编程体验和更高的可维护性，会在开发时使用一些超集的语言，最后转译为浏览器可以识别的 HTML/CSS/JS。例如：
- 对 es5/6/7 等语法的转译为对应环境支持的代码；
- less、sass 等转译为 css；
- typescript 等转译 javascript 。

##### 制品 Artifact

每一次成功构建后产出的结果，被称为 Artifacts，比如 html/css/js/images 等等。Artifacts 可以直接部署到特定环境中并正常运行。

在后端都会有一个 Artifacts 制品库。而早期时代的前端项目对制品 Artifacts 的概念比较弱，甚至更早的前端项目都没有构建的概念，直接会把源码文件部署到指定的环境，但是现在前端项目复杂度上升，对每次的构建产物也需要进行版本标识，方便后续的部署和回滚。

### 部署/发布

部署（deploy）是指把构建后新版本的应用或服务“安装”到目标环境（开发、测试或者生产）中。这时候部署好的应用或服务应该是在目标环境中正常运行着（或者待着），但是不会有任何访问的流量。

发布（release）则是把新版本应用或者服务交付给最终用户使用的过程。相当于把流量切到部署好的新版本的过程。

前端项目部署一般是指文件的增量替换或全量替换。根据项目按需决定，部署和发布可以同时进行，也可以分开进行，前提是在不影响用户访问的同时，把前端的代码更新到相应的版本。

##### CI/CD 概念
- CI，Continuous Integration，持续集成。指代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。目的就是让产品可以快速迭代，同时还能保持高质量。
- CD 对应有两个意思：
  - CD，Continuous Delivery，持续交付。指的是任何的修改都经过验证，可以随时实施部署到生产环境。
  - CD，Continuous Deployment，持续部署。持续部署是持续交付的更高阶段，指的是任何修改后的内容都经过验证，自动化的部署到生产环境。
  - 两者的区别，在于是否自动部署到生产环境。持续交付，需要用户手动点击“部署”按钮才能部署到生产环境。

建立CI/CD自动流程的的关键在于提交代码或者合并分支，触发git hook，执行预设好的 CI/CD 流程。常用工具有 Jenkins、Travis、Gitlab-CI 等。

> [Jenkins，Travis CI，Circle CI，TeamCity，Codeship，GitLab CI，Bamboo 介绍](https://blog.csdn.net/danpu0978/article/details/106768483)
> [前端工程化：构建、部署、灰度](https://zhuanlan.zhihu.com/p/71562853)

### 运维
主要包括三块内容
- web 安全：XSS/XSRF
- 数据监控系统，包括前端埋点的实现
- 性能优化

>- [2020 前端性能优化清单之一](https://mp.weixin.qq.com/s/iIbm1pVPYsOvpAeAjVziiQ)
>- [2020 前端性能优化清单之二](https://mp.weixin.qq.com/s/Y2osbl9CZggA0poci9rv3w)
>- [2020 前端性能优化清单之三](https://mp.weixin.qq.com/s/ohCDUyo8xqtKhYfbSs5wuQ)
>- [2020 前端性能优化清单之四](https://mp.weixin.qq.com/s/i5fNnTnmfAx7CufC00oaKQ)
>- [2020 前端性能优化清单之五](https://mp.weixin.qq.com/s/VDARTCShm0KivV_ouYvVGA)
>- [2020 前端性能优化清单之六](https://mp.weixin.qq.com/s/GHUMw2RFK-sXklJTPqoMdg)

## 前端工程范式

### 模块化
模块化按照逻辑和功能拆分成独立的模块文件。
- JS 模块按照独立的算法和数据单元，拆分成网络请求、应用配置、工具函数等
- CSS 模块按照功能性拆分成重置 CSS、通用 CSS、字体图标、动画、以及各组件 CSS 单元。

模块化的文件拆分只在开发阶段，在项目发布上线前，在构建阶段，又需要将模块进行打包构建，输出浏览器可识别的文件：HTML 文件、JS 文件、CSS 文件等静态资源。

### 组件化
从 UI 视图角度考虑，抽离独立的功能完备的结构单元，我们称之为组件。组件化实际上是一种按照模板(HTML)+样式(CSS)+逻辑(JS)于一体的形式对面向对象的进一步抽象。

组件化实现和规范依赖所选择的前端框架，如VUE、REACT。
> [聊聊 vue 组件开发的“边界把握”和“状态驱动”](https://www.cnblogs.com/lvdabao/p/vue-component.html)

##### 两者的区别
很多人会混淆模块化开发和组件化开发。但是严格来讲，组件（component）和模块（module）应该是两个不同的概念。两者的区别主要在颗粒度方面。
- 模块：侧重的是对属性的封装，不关注运行时 runtime 的逻辑。在具体实践中，主要是在文件层面上，对代码和资源的拆分，比如 js 模块，css 模块。模块化能很大程度上提高了代码的**可维护性**。
- 组件：面向的是 runtime，侧重于产品的功能性，是一个可以独立部署的软件单元。在具体实践中，主要是在 UI 层面上的拆分，比如页头，页脚，评论区等。组件化提高前端代码的**可复用性**。

### 自动化
任何简单机械的重复劳动都应该让机器去完成

### 规范化
规范化其实是工程化中很重要的一个部分，项目初期规范制定的好坏会直接影响到后期的开发质量。规范的目的是统一团队成员的编码规范，便于团队协作和代码维护。规范化的落地要依赖于工具来约束。

规范化的内容，主要有以下主题：
- 项目结构规范
- 编码规范
- 源代码管理规范
- 接口规范
- 文档规范
- CodeReview




