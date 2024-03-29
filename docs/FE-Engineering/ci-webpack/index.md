# Webpack 手册

1. 基础入门 `intro.md`
    1. 什么是 webpack？webpack 用来解决什么问题？
    2. 前端模块化发展简史
    3. webpack 历史
    4. webpack 安装和基本使用
    5. webpack 世界一切皆模块
2. webpack 配置项 `config.md`
    1. context 配置全局上下文路径
    2. entry 配置模块打包的入口
    3. targets 配置最终构建目标环境
    4. output 配置模块打包结果出口
    5.  resolve 配置查找模块的规则
    6.  module 配置模块转换的 loader
    7.  plugin 配置插件，对编译完成后的内容进行二度加工
    8.  performance 配置构建时如何控制预设的性能阀值
    9.  stats 配置如何显示构建信息
    10. externals 配置不需要进行打包的外部扩展
    11. optimization 构建优化的选项，压缩、分片等
    12. devtool 配置 js 文件的 source-map
    13. devServer 配置本地开发服务器
    14. 整体配置文件
3. webpack 进阶配置，实现目标：代码转化、模块合并、代码分割、代码压缩、摇树优化、作用域提升、文件指纹、持久缓存、性能优化
    1.  html: HtmlWebpackPlugin 插件使用
    2.  asset
        - webpack@4.x: `file-loader`、`url-loader`、`raw-loader`
         - webpack@5.x：`asset/source`、`asset/resource`、`asset/inline`、`asset`
    3.  css
      1. CSS 原生处理的四种方式: 行内样式、内嵌样式标签`<style></style>`、链接外部样式`<link rel="stylesheet" href="" />`、导入样式`@import`
      2. css-loader
      3. style-loader
      4. mini-css-extract-plugin
      5. css-minimizer-webpack-plugin
      6. purgecss-webpack-plugin
      7. css 预处理器 scss / less /stylus
      8. postcss
    4.  js
        1. 常规静态导入模块打包构建
        2.  动态导入实现懒加载、预加载、预请求，及其魔法注释(Magic Comment)
        3.  代码提取：
          1. 在入口 `entry` 中配置，分离 bundle
          2.  `import()`动态懒加载也会打包成独立的 bundle
          3.  `externals`阻止将某些依赖包打包进 bundle 中，而是通过应用运行时从外部获取这些*扩展依赖(external dependencies)*
          4.  `optimization.splitChunks` 配置缓存组*cacheGroup*，主动切割 bundle
          5.  `DllPlugin` 和 `DllReferencePlugin` 实现了拆分 bundle。`DLL` 一词代表微软最初使用的技术**动态链接库**。
          6.  `runtimeChunk` 运行时代码抽离
          7.  `IgnorePlugin`忽略第三方依赖包中部分指定目录的代码
        4.  代码压缩 `terser-webpack-plugin`
    5.  development
         1.  watch 配置
         2.  webpack-dev-server 配置
         3.  DefinePlugin 插件
         4.  env 环境区分
    6.  production
         - DCE(Dead Code Elimination) 死代码消除
         - Tree Shaking 的实现
          - babel-loader 配置项 module: false
          - optimization.usedExports：开启对 exports 有用和无用导入的标识
          - sideEffects 副作用及相关的 optimization.sideEffects, package.json.sideEffects
         - scope hoisting 作用域提升
         - 文件哈希指纹 `hash / chunkhash / comtenthash`
         - 持久缓存策略
          - 生成稳定的模块 ID：webpack@4.x 中可以使用`NamedModulesPlugin` 或 `HashedModuleIdsPlugin` 插件来稳定 moduleId；在webpack@5.x 中可以设置 `optimization.moduleIds / optimization.chunkIds`
    7.  performance
        - 量化
          - 速度量化：speed-measure-webpack-plugin
          - 体积量化
              1. 生成 stat.json 在线分析
              2. webpack-bundle-analyzer 图表视图
              3. webpack-visualizer-plugin 饼状视图
        - 速度优化
          1. 缩小文件的搜索范围
            1. `exclude / include`
            2. `resolve`: modules / mainFields / extensions / alias
            3. `noParse`
          2. 利用计算机能力优化速度（多核、多进程、多线程、内存空间等）
            4. 使用缓存，加快二次构建速度
              1. babel-loader 开启缓存: `cacheDirectory: true`
              2. terser-webpack-plugin 开启缓存: `cache: true`
              3. 使用 hard-source-webpack-plugin 插件
              4. 稳定 moduleId 和 chunkId，利用 webpack 自身的构建缓存
            5. 并行操作
              5. thread-loader 多线程处理
              6. parallel-webpack 多进程处理
              7. terser-webpack-plugin 开启 parallel 属性
          3. 预构建 `autodll-webpack-plugin`
          4. 预加载 `webpackPrefetch`
          5. 合理使用 `sourceMap`
        - 体积优化
          - css 提取独立文件、文件压缩、无用代码删除 --- 见 **css.md**
          - js 文件拆分 `optimization.splitChunks`、异步代码加载、webpack 运行时代码 runtime 提取复用、externals 配置、文件压缩、Tree Shaking、scope hosting --- 见 **js.md**
          - image 图片压缩、转成 base64 嵌入代码
          - icon 类图片使用 css Sprite 来合并图片成一张雪碧图，或者使用字体文件 iconfont。
          - Gzip 压缩
          - IgnorePlugin 插件
        - 升级最新版本：`node / npm / webpack`
4. webpack-chain 使用
  - [webpack-chain项目中文翻译](https://segmentfault.com/a/1190000017547171)
  - [为配置 Webpack 感到痛不欲生，直到我遇到了这个流式配置方案](https://mp.weixin.qq.com/s/99XZLeYh_tejNe713Q_14w)
5. webpack 原理浅析
   1. 打包文件 bundle 中模块加载机制原理 `__wepback_require__`
   2. 异步加载的原理 `import()`，包括魔法注释实现预加载、预请求的原理
   3. tapable 源码
   4. webpack 源码
   5. webpack-dev-server 源码
   6. webpack-HMR 源码
   7. http-proxy
   8. 编写 loader
   9.  编写 plugin
6. 项目实践
   1. 环境变量
   2.  vue 项目 `vue.config.js` 配置实践
   3.  vue 项目优化实践