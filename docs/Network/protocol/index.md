
## TCP/IP协议
- 协议
- TCP/IP协议族
  - 协议的分层
  - 各层的功能
  - 各层的通信
  - 通信方法的分类
  - 通信的数据单位：报文、帧、数据包
- IP协议
- UDP协议
- TCP协议
  - 三次握手 建立连接
  - 四次挥手 断开连接
  - 挥手断开连接为什么要等待呢？
  - 为什么连接的时候是三次握手，关闭的时候却是四次握手？
- HTTP协议

## HTTP
- HTTP 概述
- HTTP 演变
- HTTP 资源
    - 标记资源位置：URI / URL / URN / Data URI
    - 标记资源类型：MIME
- HTTP 会话
    - HTTP 连接：http1.0的短连接、http1.1的长连接和流水线连接、http2的多路复用
    - HTTP 消息（报文）：请求报文、响应报文
        - HTTP Protocol：http1.0  http1.1 https
        - HTTP request methods: GET POST PUT PATCH DELETE HEAD OPTION
        - HTTP response StatusCode: 1XX 2XX 3XX 4XX 5XX
        - HTTP Headers: request_header response_header
- HTTP 控制了什么？
    - HTTP Cache 缓存
    - HTTP Cookie and Session 有状态会话
    - HTTP CORS 跨域资源共享
    - HTTP Authenticate 认证 token
    - HTTP Proxy 代理
- 延伸
    - 选择 www 或非 www URL 作为域名哪个更好？

参考链接
- [HTTP 历史](https://thehistoryoftheweb.com/complete-history/)
- [MDN HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP)

