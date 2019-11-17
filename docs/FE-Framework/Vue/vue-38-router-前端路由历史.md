# 38 前端路由的发展

[[toc]]

参考博客
[前端路由是什么东西？](https://blog.csdn.net/weixin_39717076/article/details/80650506)


## 什么是路由
在jQuery时代，我们使用`<a href="https://www.example.com/example/home.html">`实现页面切换。

其响应过程是这样的
1.浏览器发出请求
2.服务器监听到指定端口的请求，并解析url路径
3.浏览器根据数据包的Content-Type来决定如何解析数据
4.根据服务器的路由配置，返回相应信息（比如返回html文件的字串，也可以是 json 数据，图片等）
5.浏览器接收html文件并渲染出页面显示

就是所谓的SSR(Server Side Render)，通过服务端渲染，直接返回页面。

简单来说路由就是用来跟后端服务器进行交互的一种方式，通过不同的路径，来请求不同的资源。其中请求不同的页面只是路由的其中一种功能。

## 前端路由的诞生

前端路由的出现要从 ajax 开始，为什么？且听下面分析：

Ajax，全称 Asynchronous JavaScript And XML，是浏览器用来实现异步加载的一种技术方案。在 90s 年代初，大多数的网页都是通过直接返回 HTML 的，用户的每次更新操作都需要重新刷新页面。及其影响交互体验，随着网络的发展，迫切需要一种方案来改善这种情况。

1996，微软首先提出 iframe 标签，iframe 带来了异步加载和请求元素的概念，随后在 1998 年，微软的 Outloook Web App 团队提出 Ajax 的基本概念（XMLHttpRequest的前身），并在 IE5 通过 ActiveX 来实现了这项技术。在微软实现这个概念后，其他浏览器比如 Mozilia，Safari，Opera 相继以 XMLHttpRequest 来实现 Ajax。（sob 兼容问题从此出现，话说微软命名真喜欢用X，MFC源码一大堆。。）不过在 IE7 发布时，微软选择了妥协，兼容了 XMLHttpRequest 的实现。

**有了 Ajax 后，用户交互就不用每次都刷新页面，体验带来了极大的提升。**

但真正让这项技术发扬光大的，(｡･∀･)ﾉﾞ还是后来的 Google Map，它的出现向人们展现了 Ajax 的真正魅力，释放了众多开发人员的想象力，让其不仅仅局限于简单的数据和页面交互，为后来异步交互体验方式的繁荣发展带来了根基。

而异步交互体验的更高级版本就是 SPA—单页应用。单页应用的概念是伴随着 MVVM 出现的。最早由微软提出，然后他们在浏览器端用 Knockoutjs 实现。但这项技术的强大之处并未当时的开发者体会到，可能是因为 Knockoutjs 实现过于复杂，导致没有大面积的扩散。

同样，这次接力的选手依然是 Google。Google 通过 Angularjs 将 MVVM 及单页应用发扬光大，让前端开发者能够开发出更加大型的应用，职能变得更大了。（不得不感慨，微软 跟 Google 都是伟大的公司）。随后都是大家都知道的故事，前端圈开始得到了爆发式的发展，陆续出现了很多优秀的框架。

前端三驾马车Angular,Vue,React均基于此模型来运行的。

**单页面应用指的是应用只有一个主页面，通过动态替换DOM内容并同步修改url地址，来模拟多页应用的效果，切换页面的功能直接由前台脚本来完成，不再是由后端渲染完毕后传给前端显示。**

单页应用不仅仅是在页面交互是无刷新的，连页面跳转都是无刷新的，为了在单页应用中实现多页面的切换，所以就有了前端路由，也叫客户端路由(client side routing)。

**前端路由，顾名思义就是前端不同页面的状态管理器,可以不向后台发送请求而直接通过前端技术实现多个页面的效果。**

## 前端路由实现的原理
前端路由的实现其实很简单：
本质上就是捕获 url 的变化， 然后解析当前url地址，匹配定义的路由规则，更新相应的DOM内容。

根据前端路由的定义，有两点关键：
- 能够捕获到url变化的事件
- url的更新不会触发页面刷新，即不会向服务器发起请求。

而刚好BOM中的location对象的hash属性满足以上两点。
```
// 符号#紧接着的就是hash值
https://segmentfault.com/a#article
```
> hash值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。
> 另外每次 hash 值的变化，还会触发 hashchange 这个事件，通过监听这个事件我们就可以知道 hash 值发生了哪些变化。

所以前端路由的一种实现方式就是**hash模式**

在HTML5标准发布，对BOM中的history对象新增了两个API：`pushState`,`replaceState`，以及一个事件`onpopstate`。

`pushState`和`replaceState`会创建新的历史记录，并显示在url地址栏中，但并不会导致浏览器请求加载并刷新此时的页面显示。
同时，浏览器中点击后退或前进，或者在js中直接调用history对象的其它几个API`istory.back()、history.forward()、history.go()`都会触发`popstate`事件。

> 调用history.pushState()或者history.replaceState()不会触发popstate事件. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法).
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate)

所以前端路由的另一种实现方式就是**history模式**

[造轮子参考](https://www.cnblogs.com/dashnowords/p/9671213.html)