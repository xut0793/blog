# 异步编程方式的演进

JavaScript 语言从早期开始就有一套自己的异步执行方法：回调 ( callback )。不过，随着 JS 的普及，它所构建的软件也越来越复杂，一些管理异步编程的新理念被吸收进来。就目前而言，JS 对异步编程的支持有三个不同的阶段：
- 回调 Callback
- 承诺 Promise
- 生成器 Generator
> async / await 语法只是对生成器语法的封装实现。

每个阶段的发展也不是孤立的，而是相互促进融合。像 Promise 会依赖于回调（如 resolve, reject）。另外，生成器本身并不提供任何对异步的支持，它依赖于 Promise 或特定类型的回调来提供异步支持。

> Callback 和 Promise 的比喻：<br>在一个人满为患且没有预定的餐厅里就餐。你点餐时给了餐厅一个电话号码（传入回函数），此时不需要排队等待，当有位子的时候餐厅就会给你打电话。这就类似回调。这样一来，餐厅可以忙自己的事，客户也可以做别的事情，没有人等待。<br>另一种是，你点餐时，餐厅给你一个传呼机，当有位子时它就会响。这就像一个承诺 Promise：餐厅给客户一个承诺，有位子时就会通知你。

关于 JS 异步编程可能结合下面两篇文章理解：

[浅析JavaScript异步](https://mp.weixin.qq.com/s/Ek5ONtorGbDtgvcPkivVVA) --- JS 单线程决定了JS采用异步处理；回调与异步；有哪些回调形式<br>
[拆解 JavaScript 中的异步模式](https://mp.weixin.qq.com/s/6OxtIrwF8kRqlh1dddUbQg) --- JS 中各种异步模式：callback; thunk; promise; generator; async-await
