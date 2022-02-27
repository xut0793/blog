# 资源位置URI 和 资源类型MIME

## URI 标识资源位置

HTTP 请求的内容通称为"资源"。”资源“这一概念非常宽泛，它可以是一份文档，一张图片，或所有其他你能够想到的格式。

资源的名称和位置需要一种格式来标识，这就是URI，统一资源标识符（Uniform Resource Identifier)。

在1990年，Tim Berners-Lee在发布万维网报告中关于超文本（HTML）的提案中，间接地引入了使用URL作为一个表示超链接目标资源的短字符串的概念。当时，人们称之为“超文本名”或“文档名”。

在之后的三年半中，由于万维网的核心技术：HTML（超文本标记语言）、HTTP（超文本传输协议）与浏览器都得到了发展，区别 提供资源访问 和 资源标记 的两种字符串的必要性开始显现。所以“统一资源定位符 URL”这一术语开始被用于资源的访问，而“统一资源标记符 URI”用于资源标记。

URL作为URI的一个子集，URL字符串指定对资源访问的协议、域（IP地址）、路径等信息。

目前最大的缺点是当资源的存放地点发生变化时，必须对URL作相应的改变。因此人们正在研究新的信息资源表示方法，例如：URN（Uniform Resource Name）即"统一资源名"，通过特定命名空间中的唯一名称来标识资源。

**URI URL URN**

URI可被视为定位符（URL）和 名称（URN）的集合。统一资源名（URN）如同一个人的名称，而统一资源定位符（URL）代表一个人的住址。换言之，URN定义某事物的身份，而URL提供查找该事物的方法。

用于标识唯一书目的ISBN系统是一个典型的URN使用范例。例如，ISBN 0486275574(urn:isbn:0-486-27557-4)无二义性地标识出莎士比亚的戏剧《罗密欧与朱丽叶》的某一特定版本。为获得该资源并阅读该书，人们需要它的位置，也就是一个URL地址。在类Unix操作系统中，一个典型的URL地址可能是一个文件目录，例如file:///home/username/RomeoAndJuliet.pdf。该URL标识出存储于本地硬盘中的电子书文件。因此，URL和URN有着互补的作用。

示例：

URI 的最常见形式是统一资源定位符 (URL)，它也被称为 Web 地址。
```
http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument
```
URN 是另一种形式的 URI，它通过特定命名空间中的唯一名称来标识资源。
```
urn:isbn:9780141036144
urn:ietf:rfc:7230
```
上面两个 URN 标识了下面的资源：

乔治·奥威尔所著的《1984》

IETF规范7230，超文本传输​​协议 (HTTP/1.1)：Message Syntax and Routing.

**URL语法结构**

```
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "

│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└─新版本的 URL实例，实现WHATWG标准─────────────────────────────────────────────────────────────────┘

1. protocol: https:// 协议名，告诉浏览器使用何种协议。除https外，还有http / ws / ftp / mailto / urn等
2. hostname: sub.example.com 主机名，或叫域名，需要转化IP地址，表明了向网络上哪台主机发起请求。也可以直接使用 IP 地址来表示，但不好识别。
3. port: 8080 端口号，表示用于访问 Web 服务器上资源的技术“门”。常用协议都有默认端口号，如HTTP为80，HTTPS为443，省略端口号则根据协议采用默认端口号。
4. path：/p/a/t/h 路径，表示 Web 服务器上的文件的物理位置。通常还会接文件名，如果省略则默认文件名为index.html。
5. search: ?  query=string 查询字符串，提供给 Web 服务器的额外参数。这些参数是用 & 符号分隔的键/值对列表。Web 服务器可以在将资源返回给用户之前使用这些参数来执行额外的操作。
6. hash: #hash 片段或叫哈希值，资源本身的某一部分的一个锚点。锚点代表资源内的一种“书签”，它给予浏览器显示位于该“书签”点的内容的指示。 例如，在HTML文档上，浏览器将滚动到定义锚点的那个位置上；在视频或音频文档上，浏览器将转到锚点代表的那个时间。

# 号称为片段标识符，#号后面的内容永远不会与请求一起发送到服务器，它只是提供给浏览器处理。
```

## MIME 标识资源类型

媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。互联网号码分配机构（IANA）是负责跟踪所有官方MIME类型的官方机构。

**MIME语法结构**

通用结构
```
type/subtype
```
由类型type与子类型subtype两个字符串，中间用'/'分隔而组成。不允许空格存在。

type 表示可以被分多个子类的独立类别。subtype 表示细分后的每个类型。MIME类型对大小写不敏感，但是传统写法都是小写。

**type 独立类型**：

类型 | 描述 | 示例
:--|:--|:--
text | 表明文件是普通文本，理论上是人类可读的 | text/plain, text/html, text/css, text/javascript
image | 表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型 | image/gif, image/png, image/jpeg, image/webp, image/x-icon,
audio | 表明是某种音频文件 | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav
video | 表明是某种视频文件 | video/webm, video/ogg
application | 表明是某种二进制数据 | application/octet-stream, application/json, application/x-www-form-urlencoded, application/xhtml+xml, application/xml,  application/pdf

对于text文件类型若没有特定的subtype，就使用 text/plain。类似的，二进制文件没有特定或已知的 subtype，即使用 application/octet-stream。

**Multipart 复合类型**

```
multipart/form-data
multipart/byteranges
```
Multipart 类型表示细分领域的文件类型的种类，经常对应不同的 MIME 类型。这是复合文件的一种表现方式。multipart/form-data 可用于联系 HTML Forms 和 POST 方法，

**multipart/form-data**

multipart/form-data 可用于HTML表单从浏览器发送信息给服务器。作为多部分文档格式，它由边界线（一个由'--'开始的字符串）划分出的不同部分组成。每一部分有自己的实体，以及自己的 HTTP 请求头，Content-Disposition和 Content-Type 用于文件上传领域，最常用的 (Content-Length 因为边界线作为分隔符而被忽略）。

如下所示的表单:

```html
<form action="http://localhost:8000/" method="post" enctype="multipart/form-data">
    <input type="text" name="myTextField">
    <input type="checkbox" name="myCheckBox">Check</input>
    <input type="file" name="myFile">
    <button>Send the file</button>
</form>
```
```
POST / HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=---------------------------8721656041911415653955004498
Content-Length: 465

-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myTextField"

Test
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myCheckBox"

on
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

Simple file.
-----------------------------8721656041911415653955004498--
```

[常见 MIME 类型列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)<br>
[MDN MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)



