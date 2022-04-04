# HTTP Authentication 认证

- 基本认证（basic authentication）：http 1.0提出的认证方案，客户端通过明文（Base64编码格式）传输用户名和密码到服务端进行认证，其消息传输不经过加密转换，因此存在严重的安全隐患，通常需要配合HTTPS来保证信息传输的安全。
- 摘要认证（digest authentication）：http 1.1提出的基本认证的替代方案，是为了修复基本认证协议的严重缺陷而设计的，其消息经过MD5哈希转换因此具有更高的安全性。

- [HTTP协议之基本认证](https://kb.cnblogs.com/page/158829/)
- [Form表单认证](https://www.cnblogs.com/qtiger/p/14866727.html)
- [HTTP Basic 基础认证](https://www.cnblogs.com/qtiger/p/14867023.html)
- [HTTP Digest 摘要认证](https://www.cnblogs.com/qtiger/p/14867614.html)
- [HTTP Bearer 认证和 JWT](https://www.cnblogs.com/qtiger/p/14868110.html)
- [Node.js 使用 express-jwt 解析 JWT](https://zhuanlan.zhihu.com/p/90625780)
- [HTTP认证之基本认证——Basic（一）](https://www.cnblogs.com/xiaoxiaotank/p/11009796.html)
- [HTTP认证之摘要认证——Digest（一）](https://www.cnblogs.com/xiaoxiaotank/p/11078571.html)
