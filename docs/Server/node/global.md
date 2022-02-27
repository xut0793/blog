# global 全局变量

在我们开发node应用时，可以全局使用的全局变量，要注意区分三种类型：

- node 本身实现的全局变量
    node实现全局可调用的变量。

- js语言本身内置的全局变量
    比如常见的Promise,JSON,Object内置对象等。具体见MDN[JavaScript 标准内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

- node模块系统提供的变量
    这部分变量虽然使用起来像全局变量，但其实并不是，它们是由node模块的模块包装机制产生的。


    **常用的全局变量：**

    node实现 | JS实现 | node模块包装机制提供
    ---|---|--
    `global`<br>`process`<br>`URL`<br>`URLSearchParams`<br>`console`<br>**定时器相关**<br>`setImmediate`<br>`setTimeout`<br>`setInterval`<br>`clearImmediate`<br>`clearTimeout`<br>`clearInterval`|[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)|`__dirname`<br>`__filename`<br>`module`<br>`exports`<br>`require()`

其中：
- global变量存在，使得实现了递归的引用，如`global.global.global`，类似浏览器端`window.window.window`等。
- URL： 与浏览器兼容的 URL 类，根据 WHATWG URL 标准实现。通过`new URL()`实例调用，基本可以替代`url=require('url')`包的引用。
- URLSearchParams：也是根据 WHATWG URL 标准实现，专门为 URL 查询字符串而设计的，提供了对 URL 查询参数的读写功能。 和querystring 模块有相似的功能，但querystring只提供了解析和格式化查询字符串功能，即读取功能。所以URLSearchParams有写/删等更全功能。
- console：功能基本同JS表现一样。

具体URL 、定时器、模块内容见具体章节。

