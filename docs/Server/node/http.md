# 网络操作 http

[[toc]]


node 的核心模块之一：`http`模块负责建立网络链接。

了解基本网络知识，我们就知识客户端和服务端通信处理主要两块内容：请求`request`和响应`response`。

## 请求报文和响应报文的数据结构

看下请求和响应报文的基本结构如下：

**请求报文**

![request](./img/request.png)
示例：

```bash
POST /user HTTP/1.1             //请求首行： 请求方式 请求接口 协议/版本号
Host: www.user.com
Content-Type: application/x-www-form-urlencoded
Connection: Keep-Alive
User-agent: Mozilla/5.0.        //以上是请求头
                                //此处必须有一空行,空行分割header和请求内容
name=world                      // 请求体，GET方法请求体无内容
```

**响应报文**

![request](./img/response.png)

示例：

```bash
HTTP/1.1 200 OK             // 响应首行： 协议/版本号 状态码 状态简短信息
Server: bfe/1.0.8.18
Date: Thu, 03 Nov 2016 08:30:43 GMT
Content-Type: text/html
Content-Length: 277
Last-Modified: Mon, 13 Jun 2016 02:50:03 GMT
Connection: Keep-Alive
ETag: "575e1f5b-115"
Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
Pragma: no-cache
Accept-Ranges: bytes
                            // 空行，分割响应头和响应体
响应体                       // 响应content-type格式不同，返回的响应体形式不同
```

所以`http`模块的 API 基本就是对请求报文和响应报文各部分内容的操作。`http`模块的使用分为客户端功能和服务器功能，两部分操作逻辑刚好相反。客户端是设置请求和读取响应，服务端是读取请求和设置响应。

## http 作为客户端

### 1. 建立一个客户端请求实例

```js
// 引入http模块
const http = requier('http')

// http.request返回一个http.ClientRequest类的实例，拥有操作请求报文的API
const req = http.request(options[, callback])
const req = http.request(url[, options][, callback]) // 两个API一样，只是这里把url单独作为首参

// 使用request方法每次都要手动req.end()来标识请求结束，所以node对简单的GET方法提供了一个简便的API
// 请求是通过 http.get() 发起的，则会自动调用 request.end()。
const reqGet = http.get(options[, callback])
const reqGet = http.get(url[, options][, callback])
```

下面对客户端创建并设置请求报文和接受并读取响应报文两部分内容讲解：

### 2. 设置请求报文

按上图中请求报文的结构：

```
请求行：请求方法、请求url 协议/版本号
请求头：对象键值对形式
请求体
```

其中请求行和请求头的信息可以在`options`对象中配置，然后创建请求时作为参数传入。

```js
const options = {
    method: 'POST', // node 中请求方法都是大写
    // hostname + path + port 组成请求的url。所以也可以将url提出来作为第一个参数
    hostname: 'localhost',
    path: '/index.html?page=12',
    port: 80,
    protocol: 'http:'
    // 请求头
    headers: {
        'Content-Type': 'application/json',
    }，
    timeout: 3000, // 连接超时时间（毫秒），超过还未建立连接则中断结束
}

// 另外请求头除了在创建请求时通过options设置，也可以用返回的请求实例对象提供的方法设置
request.getHeader(name)
request.setHeader(name, value)
request.removeHeader(name)
request.setTimeout(timeout[, callback])
```

```js
// 如果有请求体，通过http.get或http.request返回的客户端实例设置
request.write(chunk[, encoding][, callback])
request.end([data[, encoding]][, callback]) // 必须要用request.end()作为请求结束
```

### 3. 读取响应报文

对请求结果的响应数据会作为回调函数的参数传入，该参数是 `http.IncomingMessage` 的实例，也是一个可读流实例，用于读取响应行、响应头以及响应体数据。

对响应的数据读取还是按响应报文结构（见上图）来讲解：

```
响应行：协议/版本号 状态码 状态简短描述
响应头：对象键值对形式
响应体
```

```js
const req = http.request(options, rssponseHandler)

const responseHandler = function(res) {
	// 从响应中获取之前请求的相关信息
	res.method
	res.url
	// 响应首行
	;(res.httpVersion = 1.1), res.statusCode
	res.statusMessage
	// 响应头信息
	res.headers // 一个对象

	// 响应体：`res`返回的可读流，所以通过流stream相关事件API读取响应体的数据
	let body = []
	res.on('data', function(chunk) {
		body.push(chunk)
	})
	res.on('end', function() {
		body = Buffer.concat(body)
		console.log('请求返回的响应体数据：', body)
	})
	res.on('error', e => {
		console.log(`请求响应出错：${e.code} - ${e.message}`)
	})

	// 或者响应体直接用pipe管道对接另一处可写流
	res.pipe(writableStream)
}
```

### 综合例子

```js
const http = require('http')

const { BASE_URL } = require('./constant')
const url = 'user/v1/users'

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
}

const req = http.request(BASE_URL + url, options, function(res) {
	const { statusCode, statusMessage } = res
	let error

	if (statusCode !== 200) {
		error = new Error(`注册请求响应失败：${statusCode}:${statusMessage}`)
	}

	if (error) {
		console.error(error.message)
		// 消费响应数据来释放内存。
		res.resume()
		return
	}

	res.setEncoding('utf8')
	let body = []
	res.on('data', chunk => {
		body.push(chunk)
	})
	res.on('end', () => {
		try {
			body = Buffer.concat(body)
			console.log('response', body)
		} catch (e) {
			console.log(`${e.code}-${e.message}`)
		}
	})
})

req.on('error', e => {
	console.log(`注册请求失败${e.code}:${e.message}`)
})

let data = {
	name: 'tom',
	phone: '18070198888',
	password: 'e10adc3949ba59abbe56e057f20f883e'
}
req.write(JSON.stringify(data), 'utf8')

req.end()
```

## http 作为服务端

### 1. 建立一个服务端实例

```js
// 引入http模块
const http = require('http')

const server = http.createServer([options][, requestListener])
// 返回http.Server实例，该实例继承至net.Server，所以net.Server相关接口也可用。
server.listen([port[, host[, backlog]]][, callback])
```

下面对服务端生成的服务器实例分接收读取的请求报文和设置发送响应报文两部分讲解：

### 2. 接受并读取请求报文

创建服务器传入的`requestListener`函数接受两个参数：`reuqest:IncomingMessage`, `response:ServerResponse`

```js
const requestListener = funciton(req, res) {
    // 从request中读取请求报文
    // request是http.IncomingMessage类实例，也是一个可读流实例，用于访问请求行、请求头、以及请求体数据。
    // 具体API同http.clientRequest中的响应结果一样（见上）
    req.method
    req.url // 可使用 new URL(req.url)解析请求路径参数
    req.headers
    let body = []
    req.on('data', (chunk)=>{
        body.push(chunk)
    })
    req.on('end', ()=>{
        body = Buffer.concat(body)
        console.log(`请求体数据：${body}`)
    })
    req.on('error',e => {
        console.log(`请求接收错误：${e.code}:${e.message}`)
    })
    // 或者用可读流的API：管道pipe直接将请求体数据接入另一可写流
    req.pipe(writableStream)
}
```

### 3. 设置并发送响应报文

同上，`requestListener`第二个数据`response:ServerResponse`

```js
const requestListener = function(req, res) {
    // request 相关处理
    // response是http.ServerResponse类的实例，也是一个可写流，用于设置响应数据，传给客户端的http.clientRequest的回调函数的参数。

    // 设置响应行：状态码 状态简短描述
    res.statusCode = 400
    res.statusMessage = 'ok'
    // 设置响应关：
    res.getHeader(name)
    res.getHeaderNames()
    res.getHeaders()
    res.hasHeaders(name)
    res.setHeader(name,value)
    res.setTimeout(msecs[,callback])
    // 或者响应行和响应头一起设置
    res.writeHead(statusCode[,statusMessage][,headers])

    // 写入响应体数据
    res.write(chunk[, encoding][, callback])
    res.end([data[, encoding]][, callback]) // 必须传入res.end()不能不能响应
}
```

### 4. 综合示例

**server**

```js
const http = require('http')

const PORT = 3000
const HOST = 'localhost'

const srv = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'application/json')

	const { method, url } = req
	const { pathname, searchParams } = new URL(url, `http://${HOST}:${PORT}`)

	if (url === 'favicon.ico') {
		return
	}

	if (method === 'GET' && pathname === '/users') {
		let uid = searchParams.get('uid')
		console.log('uid', uid)
		let resData = {
			uid: uid,
			name: 'tom',
			age: 20,
			sex: 'boy'
		}
		res.write(JSON.stringify(resData), 'utf8')
		res.end()
		return
	} else {
		req.pipe(res)
	}
})
srv.listen(PORT, HOST, () => {
	console.log(`server is runnig at http://${HOST}:${PORT}`)
})
```

**client**

```js
const http = require('http')
const querystring = require('querystring')

const BASE_URL = 'http://localhost:3000/'

const options = {
	headers: {
		'Content-Type': 'application/json'
	}
}

const req = http.get(`${BASE_URL}users?uid=123`, options, res => {
	const { statusCode, statusMessage } = res

	let error
	if (statusCode !== 200) {
		error = new Error(`查询失败：${statusCode}:${statusMessage}`)
	}
	if (error) {
		console.error(error.message)
		return
	}

	res.setEncoding('utf8')
	let body = ''
	res.on('data', chunk => {
		body += chunk
	})
	res.on('end', () => {
		try {
			console.log('body:', JSON.parse(body))
		} catch (error) {
			console.log(`${error.code}-${error.message}`)
		}
	})
})

req.on('error', e => {
	console.log('req请求错误：', e)
})
```

## 总结

http 可作为客户端和服务器端使用，能够进行流处理和消息解析。

`http.createServer((request,response)=>{})`创建服务器，返回`http.Server`类的实例，该实例继承至`net.Server`类。其中的 request 是一个`http.IncomingRequest`类的实例，并且也是一个可读流实例。其中`response`是一个`http.ServerResponse`类的实例，并且也是一个可写流的实例。所有即有`http`相关类的接口，也有`stream`流相关的接口可用。

`http.request(options,response=>{})`或`http.get(options,response=>{})`创建客户端，返回`http.ClientRequest`类的实例。其中回调函数传入的参数`response`是`http.IncomingMessage`类的实例，并且也是一个可读流实例。同服务器端的`request`是一个类型。并且数据是由服务器端的`response`返回的。

```
    --http.ClientRequest-------------                       --http.Server--------------------
    |                               |                       |   srv = http.createServer     |
    |               http.request    |                       |                               |
    |                   http.get    |-------------------------> request:IncomingRequest     |
    |                               |                       |                               |
    |   response:IncomingRequest  <-------------------------|   response:ServerResponse     |
    |                               |                       |                               |
    ---------------------------------                       ---------------------------------
```
