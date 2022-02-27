# Ajax

[[toc]]

Ajax: Asynchronous JavaScript and XML，异步JavaScript和XML。

尽管X在Ajax中代表XML，因为最初使用XML进行打包数据，但由于JSON的许多优势，前后端数据传输基本已由JSON替代XML。

## 理解Ajax与XMLHttpRequest 和 Fetch的关系

Ajax本身不是一种新技术，甚至可以理解为Ajax不是一种具体的技术，而是一种解决方案，是用了一套技术的集合来解决某种问题的方案。

那解决的是什么问题？

在Ajax出现之前，客户端即浏览器与服务器的每一次请求响应的交互都会导致浏览器页面的重新刷新加载，这样的上网体验是什么差的。比如我们在页面填一个表单信息，输完用户名和密码，当到输入验证码的时候，因为要请求一次验证码，这个时候如果页面被重新刷新加载，那之前的用户名和密码又要重新输入，会导致这个表单功能根本没法实现。因为每次到获取验证码时就会被刷新页面，导致之前填写的用户名和密码清空。

所以在 2005年被Jesse James Garrett提出了Ajax的方案，能够使得浏览器与服务器间的数据交互增量的更新到页面中，而不会导致页面整体刷新。这套解决方案实现的技术包括： HTML, CSS, JavaScript, DOM, XML, XSLT, 以及最重要的 XMLHttpRequest object。

可见，XMLHttpRequest是Ajax技术集合的一种，并且是核心技术。所以平常经常会混淆两者概念，认识Ajax是一种建立HTTP请求的技术，跟XMLHttpRequest作用类似，特别是jQuery中用于HTTP请求的方法命名为ajax带来了更大的误导。

最终带火Ajax技术的是Google的Gmail服务、Google Suggest动态查找界面以及Google Map地理信息服务。

但 XMLHttpRequest 技术在使用时还是比较麻烦，常常需要重新进行封装便于使用，最著名的基于 XMLHttpRequest API 进行封装的请求库 Axios 就是例子。所以在现代浏览器中，实现了一个基于 Promise API 的方便使用的原生请求的 WEB API：Fetch。

不管是 XMLHttpRequest 还是 Fetch，都是实现 Ajax 方案的其中关键的网络请求技术。

## 参考链接

[网络请求：https://zh.javascript.info/network](https://zh.javascript.info/network)