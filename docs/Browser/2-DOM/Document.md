# Document 文档接口

> 接口、构造函数、类在这里可以理解同一种东西

`Document`接口用来描述了任何类型的文档的通用属性与方法。根据不同的文档类型（例如HTML、XML、SVG，...），还能派生出对应类型的文档接口，比如 HTML 文档，派生了 `HTMLDocument` 接口，针对XML 和 SVG 文档则实现了 `XMLDocument` 接口。

`Document`接口向网页文档本身提供了全局性的操作功能，比如获取页面的 URL ，在文档中创建一个新的元素等属性和方法。

`Document`类作为`Node`类的派生类，继承了`Node`文档基类的属性和方法外，还拥有以下属性和方法。
```js
Object <- Node <- Document <- HTMLDocument

// `window.document`对象是`HTMLDocument`类的实例对象，所以`document`对象继承了类`HTMLDocument` / `Document` / `Node`的所有属性和方法。
```

属性中大部分是提供了访问文档特定类型节点的入口，如doctype body form元素节点等。

## 属性和方法

> 这里只是列举相关的属性和方法，部分属性或方法是HTML5新增的，更多的属性和方法见[MDN Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)

属性 | 描述
--|--
contentType | 返回文档 MIME 类型，HTML文档为 text/html
characterSet | 返回文档正在使用的字符集，比如'utf-8'
documentURI | 以字符串的类型，返回当前文档的路径，即地址栏的URL。
all | 返回一个以文档节点为根节点的 HTMLAllCollection 集合。换句话说，它能返回页面的完整内容（换行符或回车将作为文本节点）。
doctype | 返回当前文档的文档类型定义，比如'html5'
documentElement | 对于 HTML 文档返回的是文档的根元素`<html>`。
scripts | 返回文档的`script`元素
styleSheetSets | 返回文档所有的样式表`styleSheetList`对象
head | 返回文档的`head`元素
body | 返回文档的`body`元素
anchors | 返回文档中所有链接元素的列表。
images | 返回当前文档中所包含的图片的列表。
forms | 包含当前文档中所有表单元素 `<form>` 的列表
links | 返回文档中所有具有href属性的元素列表


方法 | 描述
--|--
createElement() | 创建一个元素Element节点
createTextNode() | 创建一个文本Text节点
createAttribute() | 创建一个attr节点
createComment() | 创建一个注释comment节点
getElementsByClassName() | 通过class类名选择元素，返回HTMLAllCollection集合
getElementsByTagName() | 通过标签名选择元素，返回HTMLAllCollection集合
getElementById() | 通过元素ID选择元素，返回HTMLAllCollection集合
querySelectorAll() | 通过CSS选择器选择元素（多个选中返回HTMLAllCollection集合），HTML5新增
querySelector() | 通过CSS选择器选择元素（多个选中只返回第一个元素），HTML新增

## HTMLDocument接口的属性和方法

派生的HTMLDocument接口除了拥有上面Document接口的属性和方法外，还具有下列属性和方法

属性 | 描述
--|--
defaultView | 返回一个对（当前） window 对象的引用。
cookie | 返回一个使用分号分隔的 cookie 列表，或设置（写入）一个 cookie。
domain | 获取或设置当前文档的域名。
location | 返回当前文档的 URI
URL | 以字符串形式返回文档的地址栏链接。
title | 获取或设置当前文档的标题。
readyState | 返回当前文档的加载状态。
lastModified  | 返回文档上次改动时间

方法 | 描述
--|--
open() | 打开一个准备写入的文档
write() | 将传入的文本写入文档
writeln() | 向文档中写入文本，并紧接着一个换行符
close() | 关闭一个结束写入的文档
execCommand() | 使用命令操作文档元素
queryCommandEnabled() | 查询指定的命令当前是否可用
queryCommandState() | 查询指令在对象内的状态码（-1 表示指令不可用；0 表示指令等待执行；1 表示指令已执行）
queryCommandSupported() | 查询指令在浏览器是否支持
getElementsByName() | 通过元素名称查询获取元素列表
hasFocus() | 检测当前元素是否获得焦点



