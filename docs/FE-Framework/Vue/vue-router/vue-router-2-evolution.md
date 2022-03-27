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

> veu-router 源码核心是：<br />1. 将路由配置 routes 生成路由映射关系，用于match 函数匹配当前 url，生成路由记录 route；<br />2. 路径跳转 transitionTo 和 comfirmTransition 方法，执行路由钩子函数和更新。

根据前端路由的定义，有两点关键：
- 能够捕获到url变化的事件
- url的更新不会触发页面刷新，即不会向服务器发起请求。

而刚好BOM中的 location 对象的 hash 属性满足以上两点。

```
// 符号#紧接着的就是hash值
https://segmentfault.com/a#article
```
1. hash值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。
1. 另外每次 hash 值的变化，还会触发 hashchange 这个事件，通过监听这个事件我们就可以知道 hash 值发生了哪些变化。

所以前端路由的一种实现方式就是**hash模式**

### hash 模式的 Location 对象

location 是浏览器提供的 Web API 之一，表示浏览器当前页面路径 URL 的对象信息。

可以直接在浏览器控制台 console 面板上输入 location 显示该对象信息

> Window 和 document 对象上都实现了 location 属性，所以可以直接通过 window.location（简写 location) 或 document.loaction 访问。

```js
// 假设当前页面 url = https://developer.mozilla.org:80/en-US/search?q=word#search-results-close-container
console.log(url.href);      // https://developer.mozilla.org:80/en-US/search?q=word#search-results-close-container
console.log(url.origin);    // https://developer.mozilla.org:80
console.log(url.protocol);  // https:
console.log(url.host);      // developer.mozilla.org:80
console.log(url.hostname);  // developer.mozilla.org
console.log(url.port);      // 80
console.log(url.pathname);  // /en-US/search
console.log(url.search);    // ?q=word
console.log(url.hash);      // #search-results-close-container

// 操作
1. 直接设置 `location.href = 'url'`，会更改浏览器地址栏 url，并以此加载页面，并且当前新加的 url 也会被添加到 history 历史之中，可以点击前进和回退页面，同 location.assign(url)一样。
2. location.reload(isRefresh)，重新加载当前URL的资源，即刷新页面。可选参数 isRefresh 是 Boolean，为 true 时表示从服务器重新获取页面数据来刷新，默认 false，从缓存当中刷新页面资源。
3. location.assign(url)，用给定的 url 替换掉当前 url，并加载给定 url 的资源，并记录到 history 历史记录中，可以后退和前进页面。
4. location.replace(url)，用给定的 url 替换掉当前 url，并加载给定 url 的资源。但与 assign() 方法不同的是用 replace()替换的新页面不会被保存在会话的历史 History中，这意味着用户将不能用后退按钮转到该页面

// 事件 
// hashChange 当URL的片段标识符更改时，将触发hashchange事件 (跟在＃符号后面的URL部分，包括＃符号)
window.addEventListener('hashchange', function() {
  console.log('The hash has changed!' + location.hash)
}, false);

location.href = 'http://127.0.0.1:5500/vue.html#/test'  // The hash has changed! #/test
location.href = 'http://www.baidu.com#/test' // 不会触发，因为 hash 值未变
```
注意：search 部分(?开头）一定要在 hash 部分（#开头）前面。如果是 `http://127.0.0.1:5500/vue.html#/info/13?q=keyword`，则 location.hash 的值是`#/info/13?q=keyword`，所以 vue-router 在 hash 模式下，需要手动解析 hash 部分（`#/info/13`）和模拟的 search 部分 (`?q=keyword`)。


## history 模式的 History 对象

在HTML5标准发布，对BOM中的 History 对象新增了两个API：`pushState`,`replaceState`，以及一个事件`onpopstate`。

`pushState`和`replaceState`会创建新的历史记录，并显示在url地址栏中，但并不会导致浏览器请求加载并刷新此时的页面显示。
同时，浏览器中点击后退或前进，或者在js中直接调用history对象的其它几个API`istory.back()、history.forward()、history.go()`都会触发`popstate`事件。

调用history.pushState()或者history.replaceState()不会触发popstate事件. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法).

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate)

所以前端路由的另一种实现方式就是**history模式**

history 是浏览器提供的 Web API 之一，操作浏览器的曾经在标签页或者框架里访问的会话历史记录。

```js
// 属性
history.length    // 返回一个整数，该整数表示会话历史中元素的数目，包括当前加载的页。
history.state     //  返回一个表示历史堆栈顶部的状态的值。

// 方法
history.go(n)       // 通过当前页面的相对位置从浏览器历史记录( 会话记录 )加载页面。参数为-1的时候为上一页，参数为1的时候为下一页。当不传参数、不是整数参数、整数参数超出前后界限时都没有效果。
history.forward()   // 在浏览器历史记录里前往下一页，用户可点击浏览器左上角的前进按钮模拟此方法. 等价于 history.go(1)，超出界限没有效果。
history.back()      // 前往上一页, 用户可点击浏览器左上角的返回按钮模拟此方法. 等价于 history.go(-1)，超出界限没有效果。
history.pushState(state, title[, url])  // 向当前浏览器会话的历史堆栈中添加一个状态（state），如果有提供 url，则会尝试加载 url 资源。但新网址必须与当前网址相同 origin。如果未指定url参数，则将当前设置state为文档的当前URL。目前当前大多数浏览器都忽略 title 参数，可以传入空字符串。
history.replaceState(stateObj, title[, url])  // 使用传入的参数替换当前 history 记录的信息。新的URL跟当前的URL必须是同源; 否则 replaceState 抛出一个异常。

// 事件
// popState  当活动历史记录条目更改时，将触发popstate事件。

// 需要注意的是单纯调用history.pushState() 或 history.replaceState() 不会触发 popstate 事件。
// 只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮，或者在Javascript代码中调用 history.back() /forward() / go(n) 方法。

// 例子
window.addEventListener('popstate', (event) => {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
});
history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); // Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // Logs "location: http://example.com/example.html, state: null
history.go(2);  // Logs "location: http://example.com/example.html?page=3, state: {"page":3}
```

### pushState 和 location = url 的区别

从某种程度来说, 调用 pushState() 和 window.location = url 基本上一样, 他们都会在当前的 history 中创建和激活一个新的历史记录。但是 pushState() 有以下优势：
- 新的URL可以是任何和当前URL同源的URL。但是 window.location 只会在你只设置锚 hash 值的时候才会使当前源的URL。比如 window.location = "#foo"。如果赋值一个绝对地址，如window.location.href = url 可以是非同源的 url。
- 非强制修改URL。相反，如果通过 window.location = "#foo" 仅设置 hash 锚部分，不会创建一条新的历史记录，只会修改当前 url 中的 hash 值。
- 可以通过 state 对象在新的历史记录中关联数据。window.location = url  形式的操作，只可以将url写入锚的字符串中。
- pushState 会触发 popState 事件，window.location 赋值会触发 hashChange 事件。

## 参考链接

- [造轮子参考](https://www.cnblogs.com/dashnowords/p/9671213.html)