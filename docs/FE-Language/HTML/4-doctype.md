# 文档声明 doctype

文档类型声明（DTD: Document Type Definition) 置于页面文档首行，类似于链接，告诉浏览器解析时HTML页面必须遵从哪种规则。最新的HTML5规则声明为`<!DOCTYPE html>`。

这是一个历史遗留问题。在早期的HTML(大约1991年2月)，网页通常有两种版本：一个是为网景(Netscape)的Navigator浏览器准备的版本和为微软(Microsoft)的Internet Explorer浏览器准备的版本。当W3C创立网络标准后，为了不破坏当时已经存在的网站，浏览器不能直接起用最新W3C标准。

因此对HTML文档来说，浏览器使用在文档开头的DOCTYPE来决定用怪异模式（即使用模拟Navigator4与Internet Explorer 5浏览器自身的非标准行为解析文档）还是使用标准模式（W3C标准)处理。

添加DOCTYPE声明即按标准模式处理，在早期HTML标记语言借鉴于SGML标记语言，使用DTD来定义所有HTML的标签和属性规范。所以在页面文档开头需要声明当前页面基于哪个HTML规范来解析。

并且规范中定义了三种类型：严格型strict、过渡型transitional、框架frameset。严格型DTD包含所有HTML元素和属性，但不包含展示性的和弃用的元素(如font)；而过渡型或宽松型(loose)则包含展示性和启用的元素。
```hmtl
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">　
```
但HTML发展到HTML5的时候，HTML5不基于SGML，所以不需要引用DTD。但仍然需要一个doctype来声明启用HTML5的标准模式。也就是目前最短的文档类型声明`<!DOCTYPE html>`。

> 关于早期W3C对HTML的发展方向偏离到XHMTL技术上，HTML5规范由新组织 WHATWG制定，以及现在 W3C 与 WHATWG 合作的发展背景可自行查阅资料