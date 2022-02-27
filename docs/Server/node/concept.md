# 一些常见的概念理解

[[toc]]

参考[官网文档](https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/)

## 阻塞 和 非阻塞

阻塞 是指在 Node.js 程序中，其它 JavaScript 语句的执行，必须等待一个非 JavaScript 操作的完成。因此当 阻塞 发生时，事件循环无法继续运行JavaScript。

如果JavaScript 由于执行 CPU 密集型操作（循环遍历等），而表现出延迟，通常不被称为 阻塞。

在 Node.js 标准库中的所有 I/O 方法都提供异步非阻塞版本，它们接受回调函数。但某些方法也有对应的 阻塞 版本，名字以 Sync 结尾。

阻塞 方法 同步 执行，非阻塞 方法 异步 执行。
```js
// 同步阻塞
const fs = require('fs');
const data = fs.readFileSync('/file.md'); // 在这里阻塞直到文件被读取

// 异步非阻塞
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
});
```
上述fs模块的操作并不是一个js的操作，所以存在阻塞概念。

## 并发量

在 Node.js 中 JavaScript 的执行是单线程的，因此并发性是指事件循环在完成其他工作后执行 JavaScript 回调函数的能力。

例如，让我们思考这样一种情况：每个对 Web 服务器的请求需要 50 毫秒完成，而那 50 毫秒中的 45 毫秒是可以异步执行的数据库 I/O。选择 非阻塞 异步操作可以释放每个请求的 45 毫秒来处理其它请求。

## 吞吐量

单位时间的处理数量，比如每秒接受http请求个数。

## CPU 密集型

CPU 密集型通常是占用cpu和内存资源较多的任务。

## I/O 密集型

I/O 密集型任务通常包括查询外部服务提供程序（DNS、文件系统等）并等待其响应。

## 不要阻塞事件循环线程

- 注意回调代码的 "计算复杂度"。 
- 避免使用“有漏洞”的 正则表达式，因为容易面临 REDOS （正则表达式拒绝服务攻击）的风险。原因是有漏洞的正则表达式匹配时会增加时间复杂度。
- JSON.parse 以及 JSON.stringify 是其它潜在高开销的操作。 这些操作的复杂度是 O(n) ，对于大型的 n 输入，消耗的时间可能惊人的长。
- 注意使用部分核心模块，如加密和压缩等，因为涉及到复杂算法

要让业务中复杂的计算不阻塞事件循环，常用以下方法：

**任务拆分**
举个例子，假设你想计算 1 到 n 的平均值。
```js
// 不拆分算平均数，开销是 O(n)
for (let i = 0; i < n; i++)
  sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```
```js
// 分区算平均值，每个 n 的异步步骤开销为 O(1)。
function asyncAvg(n, avgCB) {
  // Save ongoing sum in JS closure.
  var sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }

    // "Asynchronous recursion".
    // Schedule next operation asynchronously.
    setImmediate(help.bind(null, i+1, cb));
  }

  // Start the helper, with CB to call avgCB.
  help(1, function(sum){
      var avg = sum/n;
      avgCB(avg);
  });
}

asyncAvg(n, function(avg){
  console.log('avg of 1-n: ' + avg);
});
```

**任务分流**

将一个复杂任务从事件循环线程转移到工作线程池上。有两种方式将任务转移到工作线程池执行：
- 通过使用 N-API开发 C++ 插件 的方式使用内置的 Node 工作池
- 创建和管理自己专用于计算的工作线程池，最直接的方法就是使用 Child Process 或者是 cluster。

转移到工作线程池的缺陷:

这种方法的缺点是它增大了 通信开销 。因为 Node 仅允许事件循环线程去查访问应用程序的“命名空间”（保存着 JavaScript 状态）。 在工作线程中是无法操作事件循环线程的命名空间中的 JavaScript 对象的。 因此，您必须序列化和反序列化任何要在线程间共享的对象。 然后，工作线程可以对属于自己的这些对象的副本进行操作，并将修改后的对象（或“补丁”） 返回到事件循环线程。

**总结：**
对于简单的任务：比如遍历任意长数组的元素，拆分可能是一个很好的选择。

如果计算更加复杂，则分流是一种更好的方法：通信成本（即在事件循环线程和工作线程之间传递序列化对象的开销）被使用多个物理内核的好处抵消。 

但是，如果你的服务器严重依赖复杂的计算，则应该重新考虑 Node 是否真的很适合该场景？Node 擅长于 I/O 密集型任务，但对于昂贵的计算的CPU密集型任务，它可能不是最好的选择。


## 不要阻塞工作线程池

- 长时间运行的文件系统读取
- 长时间运行的加密操作

解决方法：
**任务拆分：**：需要明确任务拆分的目的是尽量减少任务执行时间的动态变化。
缺点：所有这些工作池中的工作线程都将消耗空间和时间开销，并将相互竞争 CPU 时间片

**总结：**

无论您只使用 Node 工作线程池还是维护单独的工作线程池，都应着力优化线程池的任务吞吐量。