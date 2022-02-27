# Buffer 缓冲器

[[toc]]

具体Buffer的概念见上一节，这节主要讲Buffer操作的主要API

## 创建
```js
Buffer.alloc(size[, fill[, encoding]])
```
```js
Buffer.allocUnsafe(size)
```
```js
Buffer.from(array)
Buffer.from(buffer)
Buffer.from(string[, encoding])
```
示例：
```js
let buf1 = Buffer.alloc(5)
let buf2 = Buffer.alloc(5, 'a')
let buf3 = Buffer.alloc(5, 'a', 'utf8')
```
```js
// alloc申请内存缓冲时会对这段缓冲区进行内容清除，即结果是这个buffer是空白的。
// allocUnsafe 申请时只会保证大小符合，但内容不会去清除，所以这个内存缓存冲有可能是有历史内容的，那toString能把内容读出来，所以不安全，以unsafe命名
let buf4 = Buffer.allocUnsafe(5)
console.log('buf4', buf4.toString('utf8')); 
// 没有写入过内容，但输出是有内容的Տ�
```

```js
let buf5 = Buffer.from([0xe8,0xbf,0x9e])
console.log('buf5',buf5.toString('utf8')); // 连

let buf6 = Buffer.from(buf5)
console.log('buf6', buf6.toString('utf8')); // 连

let buf7 = Buffer.from('hello')
console.log('buf7', buf7.toString('utf8')); // hello
```

## 写入
```js
buf.write(string[, offset[, length]][, encoding])
buf.fill(value[, offset[, end]][, encoding])
```
示例：
```js
let buf8 = Buffer.alloc(6)
buf8.fill('b',0,6,'utf8')
// 等同于
// let buf8 = Buffer.alloc(6,'b','utf8')

let buf9 = Buffer.alloc(6)
buf9.fill('b',2,4,'utf8')
console.log('buf9', buf9.toJSON()); 
// { type: 'Buffer', data: [ 0, 0, 98, 98, 0, 0 ] }

let buf10 = Buffer.alloc(11)
buf10.write('hello world')
console.log('buf10', buf10.toString('utf8')); 
// hello world

// 重复写会覆盖，超出申请的缓存区大小会溢出截断
buf10.write('this is buffer')
console.log('buf10', buf10.toString('utf8')); // this is buf
```
## 读取
```js
buf.toString([encoding[, start[, end]]])
buf.toJSON() 
// {type:'Buffer', data: [116,104]}
// data数组内字节输出为10进制数
```
注意：`toJSON()`输出的data数据项是十进制数值


## 类数组操作
Buffer 类的实例是一个类数组，每个数组元素即其中一个字节数据。所以数组相关方法在Buffer上也有对应的实现。
```js
Buffer.isBuffer(obj)
buf[index] // 返回的该位置字节的十进制数值 0 - 255
buf.length
Buffer.byteLength(string[, encoding])
buf.keys()
buf.values()
buf.entries() 
buf.equals(otherBuffer) // 存储的字节数值完全相同才相等
buf.indexOf(value[, byteOffset][, encoding]) // 从前往后找第一次匹配value值的索引号
buf.lastIndexOf(value[, byteOffset][, encoding]) // 从后往前每一次匹配value值的索引号，即value最后一次出现的索引号
buf.includes(value[, byteOffset][, encoding])
buf.slice([start[, end]])
buf.subarray([start[, end]])
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]]) // target为想要的新值
Buffer.concat(list[, totalLength])
buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]]) // 对比是基于各自 Buffer 实际的字节序列。 buf在target的前、相同、后 分别对应 -1 0 1
```
示例见最下面。

## 相关常量
```js
Buffer.poolSize  // 默认值: 8192 用于缓冲池的预分配的内部 Buffer 实例的大小（以字节为单位） 8192 B = 8KB
buffer.constants.MAX_LENGTH  // 2147483647 B = 2GB  在 32 位的架构上，该值是 (2^30)-1 (~1GB)。 在 64 位的架构上，该值是 (2^31)-1 (~2GB)。
buffer.constants.MAX_STRING_LENGTH // 单个 string 实例允许的最大长度,取决于使用的 JS 引擎
```
示例：
```js
let buffer = require('buffer')
console.log(buffer.constants.MAX_LENGTH);
console.log(buffer.constants.MAX_STRING_LENGTH);
```

```js
Buffer.isEncoding(encoding) //检测是否是Buffer支持的字符编码格式
```
```js
console.log(Buffer.isEncoding('hex')) // true
console.log(Buffer.isEncoding('utf8')) // true
```
node支持的储存编码方案包括： 前四种较常用
- **ascii** - 仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位。

- **utf8** - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。

- **base64** - Base64 编码。当从字符串创建 Buffer 时，此编码也会正确地接受 RFC 4648 第 5 节中指定的 “URL 和文件名安全字母”。

- **hex** - 将每个字节编码成两个十六进制的字符。

- **utf16le** - 2 或 4 个字节，小端序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。

- **ucs2** - 'utf16le' 的别名。

- **latin1** - 一种将 Buffer 编码成单字节编码字符串的方法（由 RFC 1345 中的 IANA 定义，第 63 页，作为 Latin-1 的补充块和 C0/C1 控制码）。
- **binary** - 'latin1' 的别名。

### 数组相关操作示例：

```js
let buf11 = Buffer.from('node buffer')
console.log('buf11 keys', buf11.keys());
for (let i of buf11.keys()) {
    console.log(i);
}
console.log('buf11 values', buf11.values());
for (let j of buf11.values()) {
    console.log(j);
}
console.log('buf11 entries', buf11.entries());
for (let k of buf11.entries()) {
    console.log(k);
}

let buf12 = Buffer.from('AB')
let buf13 = Buffer.from('4142','hex')
let buf14 = Buffer.from('ABC')
console.log(buf12.equals(buf13)); // true
console.log(buf13.equals(buf12)); // true
console.log(buf12.equals(buf14)); // false
console.log(buf14.equals(buf12)); // false

console.log(buf12.indexOf('A')); // 0
console.log(buf12.indexOf('42', 'hex')); // 1

let buf15 = Buffer.from('ABAC')
console.log(buf15.indexOf('A')); // 0
console.log(buf15.lastIndexOf('A')); // 2
console.log(buf15.includes('A')); // true
console.log(buf15.includes('a')); // false

let buf16 = buf15.slice(2)
console.log('buf16', buf16.toString()); // AC
let buf17 = buf15.subarray(2)
console.log('buf17', buf17.toString()); // AC

// slice subarray裁切出来的buffer与源buffer共用相同的内存，所以修改会相互影响
buf16[0]++
buf17[1]--
console.log('buf15', buf15.toString()); // ABBB
console.log('buf16', buf16.toString()); // BB
console.log('buf17', buf17.toString()); // BB

let buf18 = Buffer.from('welcome')
let buf19 = Buffer.alloc(4)
buf18.copy(buf19, 0, 3)
console.log('buf19',buf19.toString()); // come

let buf20 = Buffer.from('wel')
let buf21 = Buffer.from('come')
let buf22 = Buffer.concat([buf20,buf21], buf20.length + buf21.length)
console.log('buf22', buf22.toString()); // welcome

// compare 对比是基于各自 Buffer 实际的字节序列。
let buf23 = Buffer.from('ABCD')
let buf24 = Buffer.from('AB')
let buf25 = Buffer.from('CD')

console.log(buf24.compare(buf23)); // -1 ,即buf24在buf23前面
console.log(buf25.compare(buf23)); // 1 ， 即buf25在buf23后面
console.log(buf23.compare(buf25)); // -1 ， 即buf23在buf25后面
```