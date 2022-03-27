# 学习 Gulp

1. 软件工作流
2. gulp 基本概念
   1. 构成：gulp-cli / gulp / gulpfile / gulp-plugin(插件)
   2. 任务的概念 task
   3. 流的概念：可读流  src、可写流 dest
   4. 虚拟文件格式：Vinyl 对象
3. gulp 配置本地开发环境
   1. 清理构建输出目录，删除上一次构建遗留文件 del
   2. 初次构建 script css
   3. 开启本地服务器，浏览器实时预览 browser-sync watcher
   4. 开启 sourcemaps
   5. 增量构建 since gulp.lastRun()
   6. 构建缓存 gulp-cached gulp-remember unlink
   7. 环境切换 minimist
   8. 文件指纹 hash
   9. 自动注入 html
   10. 代码规范 Eslint stylelint
   11. 出错信息处理
4. 任务编排
   1. 串行 series
   2. 并行 parallel
   3. 文件合并 gulp-concat
   4. 排除过滤 gulp-filter
   5. 流穿插 {passthrough:true}
   6. 流合并 merge2
   7. 流队列 streamqueue
5. gulpfile.js 文件的组织
6. 参考链接
   1. [来自 Gulp 的难题引出 gulp 的核心概念：stream/ vinyl](http://acgtofe.com/posts/2015/09/dive-into-gulp-stream)
   2. [Gulp 资料集](https://github.com/Platform-CUF/use-gulp)
   3. [gulp源码解析（一）— Stream 详解](https://www.cnblogs.com/vajoy/p/6349817.html)
   4. [gulp源码解析（二）— vinyl-fs](https://www.cnblogs.com/vajoy/p/6357476.html)
   5. [gulp源码解析（二）— task 任务管理](https://www.cnblogs.com/vajoy/p/6359950.html)
   6. [stream-handbook 中文手册](https://github.com/jabez128/stream-handbook)

