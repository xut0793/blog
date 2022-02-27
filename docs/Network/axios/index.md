# Axios

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。在浏览器端使用基于 XMLHttpRequest API 实现网络请求，在 node 端使用基于 http 模块实现网络请求。

特点：
- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 默认自动转换 JSON 数据
- 客户端支持防御 XSRF

## 基本使用

Axios 的使用，基本上有两种方式：
1. 直接使用导入的 axios 对象
1. 使用 `const instance = axios.create(config)` 创建一个 instance 实例对象

### 基本请求 API

API | 解释
--|--
axios(config) / axios(url[, config])| 直接可以通过向 axios 传递相关配置来发送请求
一系列请求的别名 |
axios.request(config) | 
axios.get(url[, config])<br />axios.delete(url[, config])<br />axios.head(url[, config])<br />axios.options(url[, config]) | 在使用别名方法时， url、method 这些属性可以都不必在配置中指定。
axios.post(url[, data[, config]])<br />axios.put(url[, data[, config]])<br />axios.patch(url[, data[, config]]) | 在使用别名方法时， url、method、data 这些属性可以都不必在配置中指定。
axios.all(iterable)<br />axios.spread(callback) | 处理并发请求的助手函数
创建实例使用
instance = axios.create(config) | 创建一个独立上下文环境的请求实例，继承自 axios
instance.request(config) |
instance.get(url[, config])<br />instance.delete(url[, config])<br />instance.head(url[, config])<br />instance.options(url[, config]) | 在使用别名方法时， url、method 这些属性可以都不必在配置中指定。
instance.post(url[, data[, config]])<br />instance.put(url[, data[, config]])<br />instance.patch(url[, data[, config]]) | 在使用别名方法时， url、method、data 这些属性可以都不必在配置中指定。

### 配置

**全局配置项**
axios 内部维护了一个默认的配置对象 defaults，含有很多设置了默认值的属性，即全局默认配置值。
```js
export interface AxiosRequestConfig {
  baseURL?: string
  url?: string
  method?: string // get
  params?: any // url query 查询参数对象
  paramsSerializer?: (params: any) => string // 负责 `params` 序列化的函数，借用 qs 库：（params) => {return Qs.stringify(params, {arrayFormat: 'brackets'}) }
  data?: any // 请求主体数据，只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  headers?: any // 请求头
  responseType?: XMLHttpRequestResponseType // 响应数据类型，默认 json，也可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'（node专属）
  transformRequest?: AxiosTransformer | AxiosTransformer[] // 请求数据转换器，默认有提供一个根据请求 data 类型判断修改 Content-Type 的函数：formData / isArrayBuffer / isStream / isFile / isBlob / isArrayBufferView / isURLSearchParams / isObject
  transformResponse?: AxiosTransformer | AxiosTransformer[] // 响应数据转换器，默认有提供一个将 reponse 数据转换为 json 格式的函数: (data) => { if (typeof data === 'string') { type {data = JSON.parse(data)} catch(e) {}} return data }
  validateStatus?: (status: number) => boolean // 请求响应状态校验：默认函数：（status) => {return status >= 200 && status < 300 }
  withCredentials?: boolean // 表示跨域请求时是否需要使用凭证，默认值 false
  auth?: AxiosBasicCredentials // 将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  timeout?: number // 请求超时设置，默认值0，代表无超时时间
  xsrfCookieName?: string // 默认值 'XSRF-TOKEN'
  xsrfHeaderName?: string // 默认值 'X-XSRF-TOKEN'
  adapter?: AxiosAdapter // getDefaultAdapter() 默认适配器，在浏览器环境下 XMLHttpRequest,
  proxy?: ProxyDefaultType // 定义代理服务器的主机名称和端口
  cancelToken?: CancelToken // 指定用于取消请求的 cancel token
  onUploadProgress?: (e: ProgressEvent) => void // 上传进度处理函数
  onDownloadProgress?: (e: ProgressEvent) => void // 下载进度处理函数
}
```
其中，Axios 具有默认值的配置项：
```js
const defaults:AxiosRequestConfig = {
  adapter: getDefaultAdapter(),
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  timeout: 0,
  
  transformRequest: [function transformRequest(data, headers) {
    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
  }],
  transformResponse: [function transformResponse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
	    'Accept': 'application/json, text/plain, */*'
	  },
    get: {},
    head: {},
    delete: {},
    post: {'Content-Type': 'application/x-www-form-urlencoded'},
    put: {'Content-Type': 'application/x-www-form-urlencoded'},
    patch: {'Content-Type': 'application/x-www-form-urlencoded'},
  }
}
```

如果是直接使用 axios 发起请求，可以通过 `axios.defaluts` 对象修改全局的默认配置值。比如：
```js
axios.defaults.baseURL = 'https://api.example.com'; // 默认是 /
axios.defaults.auth = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json'; // 默认 application/x-www-form-urlencoded
```
**自定义实例配置**
创建一个独立的上下文环境的请求实例时，可以传入当前实例自定义的配置，会与全局配置对象 defaults 合并。

```js
// Set config defaults when creating the instance
// 在创建实例时传入配置
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// Alter defaults after instance has been created
// 实例创建后更改配置
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```
**针对单个请求配置**
```js
axios.post(url, data, {'Content-Type': 'application/json'})
instance.post(url, data, {'Content-Type': 'application/json'})
```
**配置优先级**
请求的 config 参数 > 实例的 config 参数 > 默认的 defaults 对象属性值

```js
// 使用由库提供的配置的默认值来创建实例，此时超时配置的默认值是 `0`
var instance = axios.create();

// 覆写库的超时默认值，现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
  timeout: 5000
});
```

### 拦截器 interceptors

拦截器的作用是在请求或响应被 then 或 catch 处理前拦截它们。

拦截器 interceptors 对象分为请求拦截器 interceptors.request 和 响应拦截器 interceptors.reponse，它们分别提供了添加拦截器操作方法的 use 方法和取消某个拦截器的 eject 方法。
```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

// 如果是创建了自定义的请求实例，则：
const instance = axios.create();
instance.interceptors.request.use(function (config) {/*...*/}, function (error) {/*...*/});
instance.interceptors.response.use(function (response) {/*...*/}, function (error) {/*...*/});
```
不管请求拦截器还是如果你想在稍后移除拦截器，注册后都会返回一个当前拦截处理器序列，类似注册定时器后返回的 timer 用于取消定时器一样。比如：
```js
const myRequestInterceptor = axios.interceptors.request.use(function (config) {/*...*/}, function (error) {/*...*/});
axios.interceptors.request.eject(myRequestInterceptor);
```

### 请求取消

axios 的每个请求在以下阶段中会判断当前请求是否已取消：
1. dispatchRequest 函数中执行的第一行语句：`throwIfCancellationRequested(config); 返回取消原因 throw this.reason`
1. Adapter 函数中， `xhr.send()` 执行前：`if (config.cancelToken) {/*已执行请求则调用 request.abort()，否则直接 return*/}，然后执行 onAdapterRejection 函数`
1. Adapter 函数请求成功后，then 函数 onAdapterResolution 中返回业务响应数据前，执行：`throwIfCancellationRequested(config); 返回取消原因 throw this.reason`
1. Adapter 函数请求失败后，catch 函数 onAdapterRejection 中返回业务错误响应数据前，执行：`throwIfCancellationRequested(config); 返回取消原因 throw this.reason`

```js
// 第一种取消方法
axios.get(url, {
  cancelToken: new axios.CancelToken(cancel => {
    if (/* 取消条件 */) {
      cancel('取消请求');
    }
  })
});

// 第二种取消方法
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios.get(url, {
  cancelToken: source.token
});
source.cancel('取消请求');
```

## 源码分析

基于 Axios 的特性，从以下问题来分析源码：
- axios 如何实现即可当函数调用，又可以当对象调用。如：`axios(config) / axios.request(config)`
- 如何使用 Promise 封装 XMLHttpRequest 或 http 实现 API
- Adapter 适配器的实现：并根据环境自动选择，还可根据用户自行配置，降低耦合，且给用户留了口子，很人性化。
- config 配置项优先级的合并策略。内部定义 defaults 对象包含着默认配置项，在其它地方通过 config 传入自定义配置项，与 defaults 对象合并。
- interceptor 拦截器的实现：将请求拦截器 interceptor.request 和响应拦截器 interceptor.response 分别放在chain数组的两端，中间是发送请求的方法，一步一步成对执行，将这么多promise进行串联，非常巧妙。
- transformData 数据转换器：分请求转换器 transformRequest 和响应转换器 transformResponse，自动根据数据类型转换数据，不用用户手动转换，用户自行也可以在配置中自定义设置，很人性化。
- CancelToken 取消请求：在取消HTTP请求的逻辑中，axios巧妙的使用了一个Promise来作为触发器，将resolve函数通过callback中参数的形式传递到了外部。这样既能够保证内部逻辑的连贯性，也能够保证在需要进行取消请求时，不需要直接进行相关类的示例数据改动，最大程度上避免了侵入其他的模块。

## 实践总结
[vue中Axios的封装和API接口的管理](https://juejin.im/post/6844903652881072141#heading-9)---实践最后更新方案
[记一次封装Axios的经历](https://juejin.im/post/6844903545641271310)---主要是演变的思想和基于class的封装

## 参考链接

[使用Typescript重构axios--文字版](https://www.cnblogs.com/wangjiachen666/p/11234163.html)
[使用Typescript重构axios--视频版]()