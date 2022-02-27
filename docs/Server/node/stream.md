# 流 Stream

[[toc]]

## 流的类型
Node.js 中有四种基本的流类型：

- Writable - 可写入数据的流（例如 fs.createWriteStream()）。
- Readable - 可读取数据的流（例如 fs.createReadStream()）。
- Duplex - 可读又可写的流（例如 net.Socket）。
- Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。

## 流的特征
- Node.js 创建的流都是运作在字符串和 Buffer上的，所以可以用Buffer相关的API操作数据流
- 可写流和可读流都会在内部的缓冲器中存储数据，可以分别使用的 writable.writableBuffer 或 readable.readableBuffer 来获取。
- Duplex 和 Transform 都是可读又可写的，所以它们各自维护着两个相互独立的内部缓冲器用于读取和写入， 这使得它们在维护数据流时，读取和写入两边可以各自独立地运作。
- 为了限制数据的缓冲到可接受的程度，也就是读写速度不一致的源头与目的地不会压垮内存，使用流的构造函数时都会传入一个highWaterMark（水槽阀值，即缓冲区大小） 指定了字节的总数。

## 常见的流

能创建流的常见的操作包括：

- 客户端的HTTP： 请求服务器会产生可写流，接收服务器响应产生可读流
- 服务器的HTTP： 接受客户的请求是可读流，响应客户端是可写流
- 文件操作fs： 创建可写流fs.createWriteStream()，创建可读流fs.createReadStream()
- node的输入输出： 输入为可读流process.stdin，输出为可写流process.stdout 或 process.stderr
- 还有其它 crypto、zlib、TCP socket、子进程操作等

## 可写流的API

```js
// 可写流的事件监听

writable.on('error', (err)=>{}) // 在写入或管道数据时发生错误，则会触发 'error' 事件
writable.on('finish', ()=>{}) // 调用 writable.end()且缓冲数据都已传给底层系统之后触发。
writable.on('close', ()=>{}) // 当流被关闭或底层文件被关闭时触发
writable.on('drain', ()=>{}) // 调用 stream.write(chunk) 返回 false，则当可以继续写入数据到流时会触发 'drain' 事件。
writable.on('pipe', (src)=>{}) // 在可读流上调用 readStream.pipe() 方法时会发出 'pipe' 事件，并将此可写流添加到其目标集。
writable.on('unpipe', (src)=>{}) // 可读流上调用 readStream.unpipe() 方法时会发出 'unpipe'事件，从其目标集中移除此可写流。

// 可写流对象的属性
writable.writableLength // 包含准备写入的队列中的字节数（或对象）
writable.writableHighWaterMark // 返回构造可写流时传入的 highWaterMark 的阀值。
writable.writable  // 如果调用 writable.write() 是安全的，则为 true。
writable.writableEnded // 在调用了 writable.end() 之后为 true
writable.writableFinished // 在准备触发 'finish' 事件之前立即设置为 true。

// 可写流的操作
writable.write(chunk[, encoding][, callback])
// 在接收了 chunk 后，如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true 。 
// 如果返回 false ，则应该停止向流写入数据，直到 'drain' 事件被触发。
// 所以使用write，要考虑一个防止背压与避免内存问题，可以配合’drain'封装一次write,或使用readStream.pipe(writeStream)

writable.end([chunk[, encoding]][, callback])
// 调用 writable.end() 表明已没有数据要被写入可写流。
// 可选的 chunk 和 encoding 参数可以在关闭流之前再写入最后一块数据。 
// 如果传入了 callback 函数，则会做为监听器添加到 'finish' 事件。
// 调用 stream.end() 之后再调用 stream.write() 会导致错误

writable.setDefaultEncoding(encoding)
// 为可写流writeable对象全局设置默认的编码规则。
// 也可以在调用write()或end()方法时传入第二个参数单独设置，覆盖全局设置。

writable.destroy([error])
// 销毁流。 可选地触发 'error'，并且触发 'close' 事件（除非将 emitClose 设置为 false）。 
// 调用该方法后，可写流就结束了，之后再调用 write() 或 end() 都会导致 ERR_STREAM_DESTROYED 错误。 这是销毁流的最直接的方式。

```

## 可读流
只有提供了流的消费者，可读流才会产生数据。 如果消费的机制被禁用或移除，则可读流会停止产生数据。

### 可读流的模式：流动和暂停
可读流运作于两种模式之一：流动模式（flowing）或暂停模式（paused）。
- 在流动模式中，数据自动从底层系统读取，并通过 EventEmitter 接口的事件尽可能快地被提供给应用程序。如监听data事件获取数据块
- 在暂停模式中，必须显式调用 stream.read() 读取数据块。

### 可读流的模式切换
所有可读流都开始于暂停模式，可以通过以下方式切换到流动模式：
- 添加 'data' 事件句柄。
- 调用 stream.resume() 方法。
- 调用 stream.pipe() 方法将数据发送到可写流。

可读流可以通过以下方式切换回暂停模式：
- 如果没有管道目标，则调用 stream.pause()。
- 如果有管道目标，则移除所有管道目标。即调用 stream.unpipe() 可以移除多个管道目标。

### 可读流的状态
因为可读流存在两种模式，所以流会存在三种状态：
```js
readable.readableFlowing === null 
// 没有提供消费流数据的机制，所以流不会产生数据。
// 上面会使流切换到流动模式的三种操作（data事件监听、pipe()、resume())都会使状态变为true,可读流开始主动地产生数据并触发事件。

readable.readableFlowing === true
// 当前流处于流动模式

readable.readableFlowing === false
// 暂时停止事件流动但不会停止数据的生成。
// 调用 pause()、unpipe()、或接收到背压，则 readableFlowing 会被设为 false。
```

### 统一可读流读取的接口风格
可读流的 API 贯穿了多个 Node.js 版本，且提供了多种方法来消费流数据。 开发者通常应该选择其中一种方法来消费数据，不要在单个流使用多种方法来消费数据。 混合使用 `on('data')`、 `on('readable')`、 `pipe()` 或异步迭代器，会导致不明确的行为。

建议使用 **readable.pipe()**，因为它是消费流数据最简单的方式。
```js
const fs = require('fs');
const r1 = fs.createReadStream('foo1.txt');
const w1 = fs.createWriteStream('bar1.txt');
r1.pipe(w1); // 结束后会自动关闭可写流
```
**readable.on('readable') / readable.read()**

```js
const fs = require('fs');
const r2 = fs.createReadStream('foo2.txt');
const w2 = fs.createWriteStream('bar2.txt');
r2.on('readable', () => {
    // 有数据可读取。
    let chunk;
    while (null !== (chunk = readable.read())) {
        w2.wirte(chunk)
    }
});
r1.on('end', () => {
    w2.end('结束')
});
```

**readable.pause() / readable.resume()**
```js
const fs = require('fs');
const r3 = fs.createReadStream('foo3.txt');
const w3 = fs.createWriteStream('bar3.txt');
r3.on('data', (chunk) => {
    r3.pause();
    w3.write(chunk)
    r3.resume();
});
```

### 可读流的API
```js
// 可读流监听的事件
readable.on('readable', () => {}); // 'readable' 事件表明流有新的动态：要么有新的数据，要么到达流的尽头。处理 'readable' 事件可能造成吞吐量升高，所以较少用。
readable.on('data', (chunk) => {}); // 当流中有数据可供消费时触发
readable.on('end', () => {}); // 当流中没有数据可供消费时触发。
readable.on('error', (error) => {}); // 当读取流中数据发生错误时触发。
readable.on('pause', () => {}); // 当调用 stream.pause() 并且 readsFlowing 不为 false 时，就会触发 'pause' 事件。
readable.on('resume', () => {}); // 当调用 stream.resume() 并且 readsFlowing 不为 true 时，将会触发 'resume' 事件。

// 可读流的属性
readable.readableEncoding // 返回可读流设置的 encoding 属性
readable.readableFlowing // 设置当前可读流的状态
readable.readableHighWaterMark // 返回构造可读流时传入的 highWaterMark 的值。
readable.readableLength // 包含准备读取的队列中的字节数（或对象数）

readable.readable // 如果可以安全地调用 readable.read()，则为 true。
readable.isPaused() // 返回可读流当前的操作状态,在调用 readable.pause() 之后为 true。
readable.readableEnded // end事件触发时为true
readable.destroyed // 在调用 readable.destroy() 之后为 true。

// 可读流的操作
readable.setEncoding(encoding)
// 为从可读流读取的数据设置字符编码。
// 默认情况下没有设置字符编码，流数据返回的是 Buffer 对象。 如果设置了字符编码，则流数据返回指定编码的字符串。

readable.read([size])
// 从内部缓冲拉取并返回数据。 如果没有可读的数据，则返回 null。
// 如果没有指定 size 参数，则返回内部缓冲中的所有数据。
// 在 readable事件监听器中调用，建议readable.read() 应该只对处于暂停模式的可读流调用。 在流动模式中， readable.read() 会自动调用直到内部缓冲的数据完全耗尽，所以在流动模式中使用意义不大。

readable.pipe(writable[, options])
// 绑定可写流到可读流，将可读流自动切换到流动模式，并将可读流的所有数据推送到绑定的可写流。 数据流会被自动管理，所以即使可读流更快，目标可写流也不会超负荷。
// 引方法返回目标流的引用，这样就可以对流进行链式地管道操作，正常结束自动会关闭流
// 如果可读流在处理期间发送错误，则可写流目标不会自动关闭。 如果发生错误，则需要手动关闭每个可写流以防止内存泄漏。(调用writable.end())

readable.unpipe([destination])
// 解绑之前使用 stream.pipe() 方法绑定的可写流。
// 如果没有指定 destination, 则解绑所有管道.
// 如果指定了 destination, 但它没有建立管道，则不起作用.
// 解除绑定记得手动关闭目标流。(调用writable.end())


readable.pause()
// 使流动模式的流停止触发 'data' 事件，并切换到暂停模式。 任何可用的数据都会保留在内部缓存中。

readable.resume()
// 将被暂停的可读流恢复(resume)触发 'data' 事件，并将流切换到流动模式。

readable.destroy([error])
// 销毁流。 可选地触发 'error' 事件，并触发 'close' 事件。
// 在此调用之后，可读流将会释放所有内部的资源
```
```js
stream.pipeline(...streams, callback)
// Stream模块方法，使用管道传送多个流，并转发错误和正确地清理，当管道完成时提供回调。
// 使用 pipeline API 轻松地将一系列的流通过管道一起传送，并在管道完全地完成时获得通知。

// 例子：
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');
pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    (err) => {
        if (err) {
        console.error('管道传送失败', err);
        } else {
        console.log('管道传送成功');
        }
    }
);
```
```js
stream.Readable.from(iterable, [options])
// 使用一个实现了可迭代协议的对象来创建可读流的实用方法。

// 示例：
const { Readable } = require('stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```