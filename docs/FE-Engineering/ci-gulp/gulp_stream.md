# Gulp 流

`Gulp`是一个基于流`Stream`的自动化构建工具，其中的流`Stream`也就是`node stream`。

**流 Stream 是什么？**

流不是 Node.js 特有的概念。 它们是几十年前在 Unix 操作系统中引入的，程序可以通过管道运算符（`|`）对流进行交互，而 node.js 可以通过 `.pipe()`方法对流进行交互。

```js
// unix 常见于命令行操作中
a | b | c

// node stream
a.pipe(b).pipe(c)

// gulp stream
gulp.src('source.path').pipe(gulp.dest('destination.path'));
```

**流解决了什么问题？**

如果不用流，在传统的方式中，当告诉程序读取文件时，会将文件从头到尾读入内存，然后进行处理。

但如果使用流，则可以逐个片段地读取并处理，而无需将全部内容全部保存在内存中后，再处理。

一个典型的例子是从磁盘读取文件：

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
  /**
   * 一、传统方式：readFile() 读取文件的全部内容，并在完成时调用回调函数,将文件内容响应给客户端
   * 如果文件很大，则该操作会花费较多的时间
   */
  fs.readFile(__dirname + '/data.txt', (err, data) => {
    res.end(data)
  })
  
  /**
   * 二、使用 stream
   * 当要发送的数据块已获得时就立即开始将其流式传输到 HTTP 客户端，而不是等待直到文件被完全读取。
   */
  const stream = fs.createReadStream(__dirname + '/data.txt')
  stream.pipe(res)
})
server.listen(3000)
```

所以，流 Stream 为 node 应用程序了一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换的解决方案。

使用流处理数据的两个优点：

- **内存效率**: 无需加载大量的数据到内存中即可进行处理。
- **时间效率**: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。

**理解流 Stream 和缓冲区 Buffer**

[流 Stream 和缓冲区 Buffer**](http://fer123.gitee.io/Backend/Node/bit-byte-stream-buffer.html#%E6%B5%81-stream)

`Stream`

在计算机存储的数据并不是死的，固定的，我们始终会频繁地对其进行操作，比如读取写入、存储位置的复制、剪粘等，本质上都是将某个位置的一堆二进制数据移动到另一个位置。好比我们把水从一个杯子倒到另一个杯子，就会形成水流一样，移动二进制数据从一个地方到另一个地方就会形成一个数据流动的过程，形象地比喻为二进制数据流。实际上，巨型数据会被分割成一小块一小块地(chunks)进行传输，也就形成了流 Stream。

`Buffer`

在计算机各个部件的处理速度是不一样的，核心CPU计算是最快，内存中数据的读取和写入速度比硬盘快，硬盘的读取和写入速度比U盘快。那这个写入和读取时好比水管的两端，当水流出的速度比水注入的速度快，那水管中间肯定有一裁空了，水流出端就要等待。当水注入的速度比水流出的速度快，那水肯定会在入口溢出，这时必须减慢水注入的速度。在计算机中当两端速度不匹配时，无效的等待是浪费性能，我本可以在等待时间内处理更多事，而现在闲下来，这是要优化的地方。

那优化的方案就是设置一个缓存冲来匹配两端的速度。比如注水和接水中间设一个一定容量的水槽来缓冲，我可以保持高速迅速把水槽装满，但水槽的水流出速度可以匹配水管流出的速度。这样两端都不耽误时间。

这个水槽就是个水流的缓冲区，而Buffer就是Stream流传输过程的缓冲区。Buffer就是你电脑上的一个很小的物理内存，一般在RAM中，在这里数据暂时的存储、等待，最后发送过去并处理，node中默认大小是8kb，但一般创建一个buffer会指定大小，或根据传入字符匹配大小，当超出8kb会报错。

一个关于buffer很典型的例子，就是你在线看视频的时候。如果你的网络足够快，数据流(stream)就可以足够快，可以让buffer迅速填满然后发送和处理，然后处理另一个，再发送，再另一个，再发送，然后整个stream完成。

但是当你网络连接很慢，当处理完当前的数据后，你的播放器就会暂停，或出现”缓冲”(buffer)字样，意思是正在收集更多的数据，或者等待更多的数据到来，才能下一步处理。当buffer装满并处理好，播放器就会显示数据，也就是播放视频了。在播放当前内容的时候，更多的数据也会源源不断的传输、到达和在buffer等待。

如果播放器已经处理完或播放完前一个数据，buffer仍然没有填满，”buffering”(缓冲)字符就会再次出现，等待和收集更多的数据。

这就是**Buffer！**

> 在 node 中当开启一个流 stream 时，node会自动创建 buffer 。Buffer 里装着二进制数据，所以在 node 中也为Buffer 提供了 API 来与缓冲区 Buffer 中二进制数据进行交互和操作。毕竟 buffer 就是一小块内存空间嘛。

### 参考链接

- [Node Stream](http://nodejs.cn/learn/nodejs-streams)
- [stream-handbook 中文手册](https://github.com/jabez128/stream-handbook)
- [gulp源码解析（一）—— Stream详解](https://www.cnblogs.com/vajoy/p/6349817.html)
- [fer123 blog: node stream](http://fer123.gitee.io/Backend/Node/stream.html#%E6%B5%81%E7%9A%84%E7%B1%BB%E5%9E%8B)

