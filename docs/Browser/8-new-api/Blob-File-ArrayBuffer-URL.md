# 理解 Blob、File、FileReader、ArrayBuffer、ArrayBufferView、DataURL、URL 对象

[[toc]]

## ArrayBuffer

[JavaScript ArrayBuffer 浅析](https://www.cnblogs.com/gradolabs/p/4762134.html)

ArrayBuffer 是在内存栈中定义一块用于存储原始二进制（0 和 1）数据的内存缓冲区，初始化时就定义了缓存区的大小。可以看做是存放二进制数据的容器，跟NODE中的Buffer对象类似。
ArrayBuffer 对象并没有提供任何读写内存的方法，需要使用特定的方法（TypedArray 类型数组对象和 DataView 视图对象）来读取或插入数据。

```js
/**
 * 语法
 * new ArrayBuffer(byteLength)
 * byte字节是内存计量的基本单位，1 byte = 8 bit
 */
let arrayBuffer = new ArrayBuffer(32)
// 声明一段32字节的内存缓冲区，共占用 32 * 8 = 256 bit(位)内存空间
```

## Blob

Blob 对象是一个包含只读原始二进制数据的大数据对象

Blob 对象的构造、属性、方法、数据读取

```js
/**
* 创建一个Bolb对象：Blob构造函数：
* dataArray：数组，包含了要添加到Blob对象中的数据，数据可以是Int32Array、Uint8Array、Float32Array等，或者连续内存缓冲区ArrayBuffer，ArrayBufferView， Blob，或者 DOMString对象。
* opt：对象，用于设置Blob对象的属性（如：MIME类型）
**/
var blob = new Blob(dataArr:Array<any>, opt:{type:string});


/**
* 从一个已有的Blob对象中返回指定数据长度的新Blob对象，利用此发放可以实现大文件的分片上传
* start：开始索引，默认为0
* end：截取结束索引（不包括end）
* contentType：新Blob的MIME类型，默认为空字符串
**/
Blob.slice(start:number, end:number, contentType:string)

/**canvas转为blob对象*/
Canvas.toBlob()

/**
* 读取里面的二进制数据，需要用FileReader
*/
```

## File

-   File 对象继承于 Blob，比 blob 主要多出一个 name 的属性，用于支持用户计算机上的本地文件。
    通过`<inout type="file" />`表单控件 inputElem.files 或拖放事件对象 ev.DataTansfer.files 获得 fileList 对象

Blob 和 File 都只能通过 FileReader()方法读取

### FileReader

```js
const reader = new FileReader()
reader.addEventListener('load', function() {
    console.log(reader.result)
})
reader.readerAsBinaryString(Blob | File) // 读取文件输出原始二进制数据。
reader.readerAsArrayBuffer(Blob | File) // 输出ArrayBuffer数据对象
reader.readerAsDataURL(Blob | File) // 输出一个data: URL格式的字符串，表示文件内容
reader.readerAsText(Blob | File) // 输出字字符串表示，复杂文件为字符串乱码
```

## base64
[图片 Base64 编码的利与弊分析](https://www.imooc.com/article/27804)

Base64 是一种用 64 个字符来表示任意二进制数据的方法。最初是用于邮件传输的。打开 exe、jpg、pdf 这些非文本文件时，我们都会看到一大堆乱码，因为二进制文件包含很多无法显示和打印的字符，而最早的邮件显示字符，所以让邮件页面能显示此类二进制数据而不是乱码，就需要一个二进制到字符串的转换方法。Base64 是一种最常见的二进制编码方法。

base64 是将每三个 8Bit 的字节转换为四个 6Bit 的字节（3*8 = 4*6 = 24），然后把 6Bit 再添两位高位 0，组成四个 8Bit 的字节，再对照码表得到字符，也就是说，转换后的字符串理论上将要比原来的长 1/3。

常用于在 URL、Cookie、网页中传输**少量**二进制数据。

在前端应用中的优劣：
优势： 将某些图片数据转成 base64，减少了 http 请求次数。一般小于 10kb 的图片转成 base64
劣势： base64 字符嵌入到 html 或 css 文件中，会增大文件，影响页面渲染速度。

在 JavaScript 中，有两个函数被分别用来处理解码和编码 base64 字符串：atob() btoa()
atob() 函数能够解码通过 base-64 编码的字符串数据。
相反地，btoa() 函数能够从二进制数据“字符串”创建一个 base-64 编码的 ASCII 字符串。

## Data:URL
Data URLs，即前缀为 data: 协议的的 URL，其允许内容创建者向文档中嵌入小文件。
Data URLs 由四个部分组成：前缀(data:)、指示数据类型的 MIME 类型、如果非文本则为可选的 base64 标记、数据本身：
`data:[<mediatype>][;base64],<data>`

base64 用于传输过程中，使用 Data:URL 格式。固定 MIME 标识在头部：如图片 base64 表示时，Data:URL 的头部为：data:image/jpg;base64,RIOD...
[MDN：Data URLs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs)

## URL

```js
objectURL = URL.createObjectURL(object)
```

创建一个 URL 对象指向 File 对象或 Blob 对象。
这个 URL 的生命周期和创建它的窗口中的 document 绑定。浏览器会在文档退出的时候自动释放它们。

但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。因为在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 `URL.revokeObjectURL()` 方法来释放。

## 参考链接
[详解 Blob、File、FileReader、ArrayBuffer、ArrayBufferView、DataURL、URL 对象](https://blog.csdn.net/a460550542/article/details/86646696)
[js 中 arraybuffer 与 blob 的区别](http://www.zhuyuntao.cn/js%e4%b8%adarraybuffer%e4%b8%8eblob%e7%9a%84%e5%8c%ba%e5%88%ab/)