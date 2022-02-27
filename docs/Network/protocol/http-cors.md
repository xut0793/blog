# HTTP CORS 跨域资源共享

HTTP访问控制

- 浏览器的同源机制
- 跨域资源共享(CORS)机制
    - 用于CORS的HTTP headers
    - 简单请求
    - 预检请求
    - 附带凭证的跨域请求
    - 跨域请求响应头的获取限制

## 同源机制

同源机制指的是客户端和服务端地址符合相同的协议、相同的域名、相同的端口。

浏览器对同源的请求没有限制，如果一个HTTP请求的发起方（origin）和目标对象（host）的协议、域名、端口都相同，即为同源请求，请求的返回的响应可以正常被浏览器处理显示。

但出于安全原因，**浏览器限制从脚本内发起的跨源HTTP请求**。

注意这句话，关键字是“从脚本发起的”,也就是说HTML文档中像`<link>`标签链接的css文件，或者`src`带的链接请求如图片，`<script src=xxx.js>`等请求没有跨域的限制，所以像布置在CDN上的css、js、图片资源，即使与HTML文档不在一个地址也可以获取资源。

所以，引出来一个问题，哪些情况下浏览器发起跨域请求限制呢？

## 发生跨域请求的类型

- 在脚本中，即js文件中通过 `XMLHttpRequest` 或 `Fetch` 发起的跨域 HTTP 请求
- CSS 文件中通过 `@font-face` 使用跨域字体资源请求
- WebGL 贴图
- 使用 drawImage 将 Images/video 画面绘制到 canvas

常见的情况就是第1，2条。浏览器对跨域的请求要么阻止跨域请求的发起，要么是跨域请求可以正常发起，但是返回结果会被浏览器拦截不进行处理显示。从chrome浏览器的表现来看，大部分情况是后者，即跨站请求可以正常发起，但响应数据不会被浏览器处理，并且会在控制台显示跨域错误信息。

## 跨域资源共享(CORS)机制

但是实际情况中，需要在脚本发起跨域请求的情况越来越多，必须要能放开浏览器同源策略的限制。所以w3c制定了跨域资源共享标准（CORS），新增了一组 HTTP 首部字段，允许在服务器响应的头信息中设置当前资源是不是可以通过浏览器发起跨源请求。

![cors.png](../image/cors.png)

### 用于CORS的HTTP headers

![cors headers](../image/cors_headers.png)

另外，CORS标准规范中也规定：对那些可能对服务器数据产生副作用的 HTTP 请求方法，浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），将可能会产生副作用的请求方式或头信息通过options请求携带过去，从而获知服务端是否允许这样跨域请求。服务器确认允许之后，才发起实际的 HTTP 请求。

好比说，客户端先跟服务器端提前打个招呼，嗨，哥们，我想这样操作，你看下行不行，等你回复我再做。

所以，对CORS跨域的请求可以分类两类：简单请求和非简单请求

不会触发 CORS 预检的请求称为 “**简单请求**”，除此之外的称为 “非简单请求”, 非简单请求在请求前浏览器都会自动发起一次“预检请求”

这里又引出一个问题，哪些HTTP 请求会触发CORS机制的预检请求呢？

主要判断条件是请求方式Method和请求头字段，符合发下所有条件的请求，则为简单请求，除此之外的请求都会发起预检请求：

- 请求方式是下面之一的：`GET` `HEAD` `POST`
- 请求头字段在 **CORS安全首部字段**集合内，包括：
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type 的值只为：text/plain multipart/form-data application/x-www-form-urlencoded

### 简单请求的跨域设置

对于简单请求的跨域设置很简单，只需要在服务器返回的响应头增加` Access-Control-Allow-Origin`头字段即可。

```js
//  Access-Control-Allow-Origin的值可以是 星号*，代表任何源都可以，也可以指定具体的请求源地址。
// 对于需要携带凭证（比如携带cookie）的跨域请求，Access-Control-Allow-Origin不能是星号，必须是具体的源
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Origin', 'localhost:3000')
```

`Access-Control-Allow-Origin`只允许设置一个源，如果开发调试中，需要允许多个源跨域请求，怎么写？
```js
// 后端可以使用拦截判断的方法。
// 原理就是只要是跨域的请求，浏览器会自动添加请求头origin，表示当前的请求源
if( req.headers.origin == 'https://localhost:3000' || req.headers.origin == 'https://localhost:8000' ){
    res.header("Access-Control-Allow-Origin", req.headers.origin);
}
```
实际开发时可以把允许访问的域名写成一个数组，这样使用会更方便了。

```js
const ALLOW_REQUEST_ORIGIN_LIST = [
    'https://localhost:3000',
    'https://localhost:8000',
]
if( ALLOW_REQUEST_ORIGIN_LIST.includes(req.header.origin) ){
    res.header("Access-Control-Allow-Origin", req.headers.origin);
}
```
![cors_simple_req.png](../image/cors_simple_req.png)


### 预检请求

当跨域请求是非简单请求时，浏览器会自动发起一起预检请求，请求方式是OPTIONS。这个请求会携带两个特定的请求头字段：

- `Access-Control-Request-Method`: 表明非简单请求的方法
- `Access-Control-Request-Headers`: 表明非简单请求的头字段，比如`Content-Type: Application/json`

```
OPTIONS /example HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```
此时，服务器设置跨域请求响应的方法和头字段必须包含OPTIONS请求带过来的方法（method中还必须包括OPTIONS)和头字段，否则OPTIONS预检请求失败，不能发起此次非简单请求。

![cors_preflight_correct.png](../image/cors_preflight_correct.png)

默认每次非简单请求时都会发起一次预检请求，但也可以设置一段有效时间内，不需要再次发起预检请求来验证，可以通过响应头`Access-Control-Max-Age`来设置间隔时间

```
Access-Control-Max-Age: <delta-seconds>
```


### 附带凭证的跨域请求

在XMLHttpRequest的同域请求下，只要有cookie，每次请求默认都会携带请求头`Cookie`。但是当跨域请求时，默认是不会携带当前页面域下的cookie数据发送到另一个请求域的服务器。

如果要实现跨域请求携带cookie，需要客户端和服务端同时配置一些头字段。（前提是已经允许跨域访问了）

在客户端请求时，设置请求头
```js
// 原生 XMLHttpRequest
const xhr = new XMLHttpRequest()
xhr.withCredentials = true

// 原生Fetch
fetch(url, {
    method: 'GET',
    credentials: "include"
})

// 如果是jQuery的AJAX请求
 $.ajax({
    type: "POST",
    url: "http://xxx.com/api/test",
    dataType: 'jsonp', // jsonp跨域
    xhrFields: {withCredentials: true}, // 携带凭证
    crossDomain: true, // 跨域
})

// axios
axios.defaults.withCredentials=true;
```
服务端设置响应头：
```js
// 与允许携带凭证进行跨域请求相关的头字段
// 当Access-Control-Allow-Credentials=true时，Access-Control-Allow-Origin值必须明确哪个域。如果设置 * 仍然会报错
response.setHeader("Access-Control-Allow-Credentials", true)
response.setHeader("Access-Control-Allow-Origin", "http://www.xxx.com") 
```

### 跨域请求响应头的获取限制

在跨域请求返回的响应数据中，对操作响应头字段是有限制的，XMLHttpRequest对象的getResponseHeader()方法只能拿到一些最基本的响应头，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。

如果要访问其他响应头字段，需要服务器将这些头字段设置成白名单，即在响应头`Access-Control-Expose-Headers`中声明允许被客户端访问的响应头字段。

```
Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header
```



