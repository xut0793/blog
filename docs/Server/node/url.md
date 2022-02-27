# 网址解析 url

[[toc]]

url 模块用于处理与解析 URL。

## URL 基本结构

URL 字符串是结构化的字符串，包含多个含义不同的组成部分。 解析字符串后返回的 URL 对象，每个属性对应字符串的各个组成部分。

```
┌─旧版本的url模块─────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │

"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "

│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└─新版本的 URL类实例，实现WHATWG标准───────────────────────────────────────────────────────────────┘
```

## new URL() 和 url.parse()

url 模块提供了两套 API 来处理 URL：一个是旧版本遗留的 API，一个是实现了 WHATWG 标准的新 API。

目前建议采用最新的 API，增加了`origin`字段，并且对查询参数部分实现了 URLSearchParams 类，实现了对查询参数的获取、追加、设置、删除的接口方法，更加方便。

对比两者返回的参数结构：

新的 API 中 URL 为全局变量，不需要引入可直接使用。

语法：

```js
new URL(input[, base])
```

示例：

```js
const newURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash')
console.log(newURL)
console.log(newURL.searchParams.get('query'))
```

输出：

```js
// 输出
{
    href: 'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash',
    origin: 'https://sub.host.com:8080',
    protocol: 'https:',
    username: 'user',
    password: 'pass',
    host: 'sub.host.com:8080',
    hostname: 'sub.host.com',
    port: '8080',
    pathname: '/p/a/t/h',
    search: '?query=string',
    searchParams: URLSearchParams { 'query' => 'string' },
    hash: '#hash'
}
string
```

旧 API 需要引入`url`模块

引入：

```js
const url = require('url')
```

示例：

```js
const oldURL = url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash', true)
console.log(oldURL)
console.log(oldURL.query.query)
```

输出：

```js
// 输出
{
    href:'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
    protocol: 'https:',
    auth: 'user:pass',
    host: 'sub.host.com:8080',
    hostname: 'sub.host.com',
    port: '8080',
    pathname: '/p/a/t/h',
    search: '?query=string',
    query: { query: 'string' },
    path: '/p/a/t/h?query=string',
    hash: '#hash',
    slashes: true,
}
string
```

对比可以看到，新 API 增加`origin`, 将原来的 auth 字段拆成`username`和`password`，以及增加 searchParams 对象可以追加修改等操作查询参数，旧版本做不到。

解析完成之后新旧的操作基本一样，对返回的对象按 URL 对应部分的属性名调用即可：

```js
url.origin // 新API
url.username // 新API
url.password // 新API
url.auth // 旧API
url.href
url.protocol
url.host
url.hostname
url.port
url.path // 旧API
url.pathname
url.search
url.hash
url.query // 旧API，且 url(url,true)第二个参数为true才返回对象形式
url.searchParams // 新API，URLSearchParams类的实例对象
```

## 注意区别：

使用`new URL(input[,baseurl])`时：

-   如果 input 是相对路径，则需要 base。 如果 input 是绝对路径，则忽略 base。
-   如果 input 是相对路径，又没有提供 base，则视为无效 URL，则将会抛出 TypeError。

即一句话，new URL()解析的必须是绝对 URL。

但是旧`url = require('url')`则无此限制，见如下示例：

```js
const url = require('url')
let BASE_URL = 'http://localhost:3000'
let str = '/users?uid=123'

// 直接解析url, new URL()方法将报错，但url不会
console.log(url.parse(str, true)) // 正常返回对象
console.log(new URL(str)) // 报错

// 加上BASE_URL,不会报错
console.log(url.parse(BASE_URL + str, true))
console.log(new URL(BASE_URL + str))
```

## URLSearchParams 类的方法：

```js
// 新建一个查询参数对象
new URLSearchParams() // 实例化空对象
new URLSearchParams(string) // 基于字符串格式：
new URLSearchParams(object) // 基于对象的k-v形式
new URLSearchParams(iterable) // 可以是一个 Array 或者任何迭代对象,但每个键值对必须有两个元素。

// 输出字符串的查询参数
urlSearchParams.toString()

// 字符串对象的增删改查
urlSearchParams.append(name,value)
urlSearchParams.delete(name)
urlSearchParams.set(name,value)
urlSearchParams.get(name)
urlSearchParams.getAll(name)
urlSearchParams.has(name)

// 对象相关的方法
urlSearchParams.keys()
urlSearchParams.values()
urlSearchParams.entries()
urlSearchParams.forEach(fn[,thisArg])
urlSearchParams.sort()
```

示例：

#### 创建 URLSearchParams

```js
// 创建：
let paramsObj1 = new URLSearchParams()
console.log(paramsObj1.toString())

let paramsObj2 = new URLSearchParams('user=a&pwd=b')
console.log('string >>', paramsObj2.toString()) // user=a&pwd=b

let paramsObj3 = new URLSearchParams('?user=a&pwd=b')
console.log('?string >>', paramsObj3.toString()) // user=a&pwd=b

let paramsObj4 = new URLSearchParams({
	user: 'a',
	pwd: 'b',
	hobby: ['coding', 'runnig']
})
console.log('object >>', paramsObj4.toString()) // user=a&pwd=b&hobby=coding%2Crunnig

// 使用数组。
let paramsObj5 = new URLSearchParams([['user', 'abc'], ['query', 'first'], ['query', 'second']])
console.log('array >>', paramsObj5.toString()) // 打印 'user=abc&query=first&query=second'

// 使用 Map 对象。
const map = new Map()
map.set('user', 'abc')
map.set('query', 'xyz')

let paramsObj6 = new URLSearchParams(map)
console.log('map >>', paramsObj6.toString()) // 打印 'user=abc&query=xyz'

// 使用 generator 函数。
function* getQueryPairs() {
	yield ['user', 'abc']
	yield ['query', 'first']
	yield ['query', 'second']
}
let paramsObj7 = new URLSearchParams(getQueryPairs())
console.log('generator >>', paramsObj7.toString())
// 打印 'user=abc&query=first&query=second'

// 每个键值对必须有两个元素。
new URLSearchParams([['user', 'abc', 'error']])
// 抛出 TypeError [ERR_INVALID_TUPLE]: Each query pair must be an iterable [name, value] tuple
```

#### 操作 URLSearchParams

```js
// 操作：
const newURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?user=tom&age=18')
let params = newURL.searchParams
console.log(params.toString()) // user=tom&age=18

console.log(params.get('user')) // tom
console.log(params.getAll('user')) // ['tom']

params.append('user', 'jerry')
console.log(params.getAll('user')) // [ 'tom', 'jerry' ]
console.log(params.toString()) // user=tom&age=18&user=jerry

console.log(params.has('age')) // true
params.delete('age')
console.log(params.has('age')) // false
console.log(params.toString()) // user=tom&user=jerry

params.set('hobby', 'coding')
params.set('hobby', 'running') // 覆盖前一个coding
params.set('sex', 'boy')
console.log(params.toString()) // user=tom&user=jerry&hobby=running&sex=boy

console.log(params.keys()) // URLSearchParams Iterator { 'user', 'user', 'hobby', 'sex' }
console.log(params.values()) // URLSearchParams Iterator { 'tom', 'jerry', 'running', 'boy' }
console.log(params.entries())
/**
URLSearchParams Iterator {
  [ 'user', 'tom' ],
  [ 'user', 'jerry' ],
  [ 'hobby', 'running' ],
  [ 'sex', 'boy' ]
}
 */
console.log(params.sort()) // 按key的字母顺序排序，保留同名的k-v之间顺序

params.forEach((v, k) => {
	console.log(`value is ${v}, key is ${k}`)
})
```

参考链接：

[Node 官网 - 中文](http://nodejs.cn/api/url.html)
