# 查询字符串解析 querystring

[[toc]]

`querystring` 模块是用于解析和格式化 URL 查询字符串的实用工具。

[MDN 参考链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)

先看一下一个完整的 URI 是怎么样格式：

```js
http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor
```

这里面包括 URI 规范中保留字符、非转义字符、及哈希字符

| 类型       | 包含                                                        |
| ---------- | ----------------------------------------------------------- |
| 保留字符   | `;` `,` `/` `?` `:` `@` `&` `=` `+` `$`                     |
| 非转义字符 | 正常大小写字母 数字 0-9 `-` `_` `.` `!` `~` `*` `'` `(` `)` |
| 哈希符号   | `#`                                                         |

## JS 原生全局 API 实现编码解码

### `encodeURI` `decodeURI`

`encodeURI`会对不是以上三类的字符进行编码转义成`%`+数字的形式。

`decodeURI` 会使用同样规则对 `encodeURI` 编码过的转义字符串进行解码成原来的样子。

示例：

```js
let uri = 'http://www.jxbh.cn/illegal value.htm#start' // 其中包含空格
console.log(encodeURI(uri)) // http: //www.jxbh.cn/illegal%20value.htm#start
console.log(decodeURI(encodeURI(uri)) === uri) // true
```

### `encodeURIComponent` `decodeURIComponent`

`encodeURIComponent` 则会转义除 **非转义字符** 外的所有字符。

`decodeURIComponent` 则对`encodeURIComponent`编码的字符进行解码成原来的样子。

示例：

```js
let uri = 'http://www.jxbh.cn/illegal value.htm#start' // 跟上例一样，对比结果
console.log(encodeURIComponent(uri)) // http%3A%2F%2Fwww.jxbh.cn%2Fillegal%20value.htm%23start
console.log(decodeURIComponent(encodeURIComponent(uri)) === uri) // true
```

## Node 的 querystring 模块实现编码解码

**引入模块：**

```js
const querystring = require('querystring')
```

**API：**

```js
// 给定的 str 上执行 URL 百分比编码。 效果跟JS的encodeURIComponent一样。
querystring.escape(str):string
// 解码，效果跟JS的decodeURIComponent一样。
querystring.unescape(str)

// 将 URL 查询字符串 str 解析为键值对的集合
querystring.parse(str[, sep[, eq[, options]]])
// 将一个对象转换生成 URL 查询字符串
querystring.stringify(obj[, sep[, eq[, options]]])

querystring.decode() // 是 querystring.parse() 的别名。
querystring.encode() // 是 querystring.stringify() 的别名。
```

**参数说明：**

-   sep : 用于分隔键值对的字符串，默认`&`
-   eq : 用于分隔键 key 和值 value 的字符串，默认`=`
-   obj : stringify 能序列化的对象的值类型为 字符串、数字、布尔值，或由这三种类型值组成的数组，其它类型的值都会被强制转为空字符串。`<string> | <number> | <boolean> | <string[]> | <number[]> | <boolean[]>`

**示例说明：**

```js
const qs = require('querystring')
let s = 'foo=bar&abc=xyz&abc=123'
console.log(encodeURIComponent(s)) //foo%3Dbar%26abc%3Dxyz%26abc%3D123
console.log(qs.escape(s)) // foo%3Dbar%26abc%3Dxyz%26abc%3D123
console.log(decodeURIComponent(encodeURIComponent(s)) === s) // true
console.log(qs.unescape(qs.escape(s)) === s) // true
```

```js
let obj = { foo: 'bar', baz: ['qux', 'quux'], corge: '' }
let qs1 = querystring.encode(obj)
let qs2 = querystring.stringify(obj)
// 一样的结果：'foo=bar&baz=qux&baz=quux&corge='

let qobj1 = querystring.decode(qs1)
let qobj2 = querystring.parse(qs2)
// 一样的结果： {foo:'bar',baz: ['qux', 'quux'],corge:''}
```

```js
// 指定其它分隔符
let qs = querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':') // foo:bar;baz:qux
let qobj = querystring.parse(qs, ';', ':') // { foo: 'bar', baz: 'qux' }
```

## stringify parse 的实现

[链接](https://github.com/Gozala/querystring)

**`stringify`**

```js
'use strict'

var stringifyPrimitive = function(v) {
	switch (typeof v) {
		case 'string':
			return v

		case 'boolean':
			return v ? 'true' : 'false'

		case 'number':
			return isFinite(v) ? v : ''

		default:
			return ''
	}
}

module.exports = function(obj, sep, eq, name) {
	sep = sep || '&'
	eq = eq || '='
	if (obj === null) {
		obj = undefined
	}

	if (typeof obj === 'object') {
		return Object.keys(obj)
			.map(function(k) {
				var ks = encodeURIComponent(stringifyPrimitive(k)) + eq
				if (Array.isArray(obj[k])) {
					return obj[k]
						.map(function(v) {
							return ks + encodeURIComponent(stringifyPrimitive(v))
						})
						.join(sep)
				} else {
					return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
				}
			})
			.filter(Boolean)
			.join(sep)
	}

	if (!name) return ''
	return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj))
}
```

在 node 项目中经常使用`querystring.parse`对表单`post`提交的 body 中的数据进行解析。在处理`get`请求中 url 附带的查询字符串解析则主要使用 url 模块`url.parse(url,true)`,指定第二个参数`true`获取。

**parse**

```js
'use strict'
function hasOwnProperty(obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop)
}

module.exports = function(qs, sep, eq, options) {
	sep = sep || '&'
	eq = eq || '='
	var obj = {}

	if (typeof qs !== 'string' || qs.length === 0) {
		return obj
	}

	var regexp = /\+/g
	qs = qs.split(sep)

	var maxKeys = 1000
	if (options && typeof options.maxKeys === 'number') {
		maxKeys = options.maxKeys
	}

	var len = qs.length
	// maxKeys <= 0 means that we should not limit keys count
	if (maxKeys > 0 && len > maxKeys) {
		len = maxKeys
	}

	for (var i = 0; i < len; ++i) {
		var x = qs[i].replace(regexp, '%20'),
			idx = x.indexOf(eq),
			kstr,
			vstr,
			k,
			v

		if (idx >= 0) {
			kstr = x.substr(0, idx)
			vstr = x.substr(idx + 1)
		} else {
			kstr = x
			vstr = ''
		}

		k = decodeURIComponent(kstr)
		v = decodeURIComponent(vstr)

		if (!hasOwnProperty(obj, k)) {
			obj[k] = v
		} else if (Array.isArray(obj[k])) {
			obj[k].push(v)
		} else {
			obj[k] = [obj[k], v]
		}
	}

	return obj
}
```
