# DOM

[[toc]]

## DOM 简介

DOM：Document Object Model（文档对象模型）。

将用于页面显示的标记语言（XML/HTML/SVG等）进行建模，用一颗逻辑树的对象形式来表示文档，文档的每一个标记都是一个节点，每一个节点都是一个对象结构。通过建模的对象来提供操作页面的API接口给编程语言，让开发者通过DOM提供的API获得控制页面内容和结构的主动权。

DOM是一种与平台和编程语言无关的应用程序接口(API)，不仅可以被javascript语言调用，还可以被其它语言（如Python等）调用。

DOM Core 核心定义了基础了Node对象及相关节点对象（如Document/Element等)，然后不同的文档类型（如XML/HTML/SVG）基于Node对象及子对象进行扩展，实现了针对自身文档特征的对象，如HTML文档实现了HTMLDocument 或 HTMLElement等对象，这个对象继承了Node对象属性和方法，也拥有自身的属性和方法。

同样还有针对SVG（可伸缩矢量标记语言） / MathML(数学标识语言) / SML(同步多媒体集成语言) / XUL （XML用户界面语言）等标记语言的DOM实现。

## DOM 发展

在早期，微软的Internet Explorer 4和网景公司的Netscape Navigator 4 浏览器上分别实现了DHMTL（Dynamic HTML 动态HTML)技术，允许开发人员无需重新加载网页，就可以使用脚本语言修改页面外观和内容。但同一种技术在两家公司的实现方式相差很大，同样这变成了新一个浏览器兼容性的问题，使得开发者无法通过一个HTML页面能运行在当时两个主流的浏览器中。负责web标准制定的组织W3C开始着手制定统一标准。

> DOM统一标准之前这段时间，常称为DOM 0级标准，实际上不存在的，只是依据后面DOM级别划分的时间点作为参照一种普遍说法而已，并不是真的标准。

### DOM 1级
1998年10月，W3C组织发布了DOM的首个标准规范。DOM 1级由两个模块组成：

- DOM Core 和 DOM HTML。其中DOM Core定义了映射文档的基础结构，其中最主要的是根节点Node对象和文档各种节点类型对象。
- DOM HTML则在DOM Core基础上加以扩展，添加了针对HTML的HTMLDocument 、HTMLElement等对象，以及各类元素对象。

### DOM 2级

DOM 2级增加了新的模块，其中最主要的针对元素样式（**DOM Style**）的接口CSSStyleSheet，以及定义了元素事件（**DOM Event**）及相关接口，如`addEventLister()`方法。

### DOM 3级

DOM 3级继续新增了加载和保存文档的方法的 DOM Load and Save模块，以及DOM验证（DOM Validation）模块。对DOM Core对象的扩展了一些针对XML新特性的扩展。

这里我们主要关注和学习的是DOM Core核心中的Node对象、针对HTML文档的HTMLElement对象、针对HTML文档样式的DOM Style模块和针对元素事件的DOM Event模块。掌握其对象的属性和方法，以及扩展的相关子对象的属性和方法。

## DOM Core 核心

DOM建模是将HTML或XML描绘的页面绘制成一个由多层节点构成的树状结构，依据文档中不同类型的内容划分为不同的节点类型。

这里依据HTML类型文档为例，以下面这段HTML代码生成DOM树状结构：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body class="test_class">
    <!-- 这是一段注释 -->
    <p id="test_id">Hello World</p>
  </body>
</html>
```
使用[Live DOM Viewer](https://software.hixie.ch/utilities/js/live-dom-viewer/)展示的DOM树结构如下：

![node.png](../images/node.png)

> HTML文档中换行符与空白符也是文本字符，也会生成节点树节点。

### 节点类型

DOM Core中定义了一个Node接口（也就是Node的构造函数，或者说Node类），DOM树中的所有节点类型都从这个接口继承一组通用的属性和方法。

通过以下方式可以在控制台输出所有的节点类型编码。
```js
for (let key in Node) {
  console.log(key, ' = '+Node[key])
}
```
```js
ELEMENT_NODE  = 1
ATTRIBUTE_NODE  = 2
TEXT_NODE  = 3
CDATA_SECTION_NODE  = 4
ENTITY_REFERENCE_NODE  = 5
ENTITY_NODE  = 6
PROCESSING_INSTRUCTION_NODE  = 7
COMMENT_NODE  = 8
DOCUMENT_NODE  = 9
DOCUMENT_TYPE_NODE  = 10
DOCUMENT_FRAGMENT_NODE  = 11
NOTATION_NODE  = 12
// Node.compareDocumentPosition(otherNode)返回节点位置的常量
DOCUMENT_POSITION_DISCONNECTED  = 1 // 不在同一文档中
DOCUMENT_POSITION_PRECEDING  = 2 // otherNode在node之前
DOCUMENT_POSITION_FOLLOWING  = 4 // otherNode在node之后
DOCUMENT_POSITION_CONTAINS  = 8 // otherNode包含node
DOCUMENT_POSITION_CONTAINED_BY  = 16 // otherNode被node包含
DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC  = 32 // 待定
```
对应HTML文档节点类型，我们需要关注的是：
```js
ELEMENT_NODE  = 1  // 元素节点
ATTRIBUTE_NODE  = 2  // 特性节点
TEXT_NODE  = 3      //  文本节点
COMMENT_NODE  = 8   // 注释节点
DOCUMENT_NODE  = 9  // 文档节点
```
其中我们最频繁接触的节点类型就三类：
```js
ELEMENT_NODE  = 1  // 元素节点
TEXT_NODE  = 3      //  文本节点
DOCUMENT_NODE  = 9  // 文档节点
```
这三类节点类型对应的接口分别是
- Element
- Text
- Document

## DOM HTML

在HTML文档形成DOM树中，上述三类接口在浏览器的JS中继承关系如下（<-表示从左侧继承）
- Object <- Node <- Document <- HTMLDocument
- Object <- Node <- Element <- HTMLElement
- Object <- Node <- Text

`Document`接口用来描述了任何类型的文档的通用属性与方法。根据不同的文档类型（例如HTML、XML、SVG，...），还能派生出对应类型的文档接口，比如 HTML 文档，派生了 `HTMLDocument` 接口，针对XML 和 SVG 文档则实现了 `XMLDocument` 接口。

`HTMLDocument`类是`Document`类的派生类，继承了Document类的属性和方法，还增加了HTML特有属性方法和，如cookie属性和文档打开`open()/close()/wirte()`等方法。具体见后面。

`Element`接口描述了所有相同种类的元素所普遍具有的方法和属性，是一个通用性非常强的文档元素的基类。

同样根据文档类型的不同，派生出一些对应文档的接口来描述对应文档中元素具体的行为。比如HTML文档的 `HTMLElement` 接口，是HTML元素接口的基础类， HTML文档中的所有元素节点都继承至HTMLElement，如 HTMLBodyElement / HTMLFormElement等。

当然DOM节点操作的大部分属性和方法都是定义在通用的`Doucment`类和`Element`类的原型对象上。下表是一个API的总结，具体应用示例见下章。

### 节点API总结

**属性**

Node | Document | HTMLDocument | Element | HTMLElement |
--|--|--|--|--
nodeType | contentType | defaultView | tagName | style
nodeName | characterSet | cookie | id | dataset
nodeValue | documentURI | domain | attributes |title
textContent | all |       location | classList |tabIndex
ownerDocument | doctype | URL |       className |hidden
parentNode | documentElement | title | innerHTML |offsetWidth
childNodes | scripts |         readyState | outerHTML |offsetHeight
firstChild | styleSheetSets | lastModified |  previousElementSibling |offsetLeft
lastChild | head |                          | nextElementSibling |offsetTop
previousSibling | body |                    | clientWidth |offsetParent
nextSibling | forms |                       | clientHeight |
| | table |                       | clientLeft |
| | images |                      | clientTop |
| | anchors |                     | scrollWidth |
| | links |                       | scrollHeight |
| |     |                       | scrollLeft |
| |     |                       | scrollTop |

**方法**

Node | Document | HTMLDocument | Element | HTMLElement |
--|--|--|--|--
getRootNode() | createElement() |open() |hasAttribute() | HTMLElement.blur()
hasChildNodes() | createTextNode() |write() |hasAttributes() | HTMLElement.click() 
isEqualNode() | createAttribute() |writeln() |getAttributeNames() |HTMLElement.focus()
contains() | createComment() |close() |getAttribute() | 
compareDocumentPosition() | getElementsByClassName() | execCommand() |setAttribute() | 
cloneNode() | getElementsByTagName() |queryCommandEnabled() | toggleAttribute() | 
appendChild() | getElementById() |queryCommandState() |removeAttribute() | 
insertBefore() | querySelectorAll() |queryCommandSupported() | getElementsByClassName() | 
replaceChild() | querySelector() |hasFocus() | getElementsByName() |  
removeChild() | |  |getElementsByTagName() |
normalize()  | |  |querySelectorAll() |
|              | |            |querySelector() | 
|              | |             |matches() | 
|              | |             |insertAdjacentElement() | 
|              | |             |insertAdjacentHTML()  | 
|              | |             |insertAdjacentText() | 
|              | |             |getBoundingClientRect() | 
|              | |             |scroll() | 
|              | |             |scrollBy() | 
|              | |             |scrollTo() |
|              | |             |addEventListener() |
|              | |             |removeEventListener() | 

可以看到`Document`接口和`Element`接口都实现了选择元素的几个方法：

`getElementsByClassName()` / `getElementsByTagName()` / `getElementById()` / `querySelectorAll()` / `querySelector()`

## DOM Style (CSSOM)

一个文档引入CSS样式有三种方式：
- 内联式：在元素开始标签中定义sytle特性；
- 内嵌式：在head元素中使用`<style>`标签；
- 引入式：在head元素中通过`<link>`标签引入外部定义的样式表。

在DOM 2级加入了“DOM 2级样式”模块，围绕这三种定义样式的机制提供了一套API。提供了以下API接口（样式操作的构造函数或叫样式基类）
- StyleSheet <- CSSStyleSheet
- cssRule <- CSSStyleRule
- CSSStyleDeclaration

另外一种是通过操作元素class特性来改变元素样式，主要是通过`Element`接口的方法：`getAttribute() / setAttribute() / toggleAttribute() / removeAttribute()`。

## DOM Event

元素事件（**DOM Event**）及相关接口是在DOM 2级增加的新模块，主要是在`Element`接口方法中增加了`addEventLister() / removeEventListener()`方法和定义了DOM的事件流。

- 事件流
- 事件处理程序
- 事件对象
- 事件类型：焦点事件、鼠标事件、文本事件、键盘事件、HTML5新增事件等。
- 事件委托
- 跨浏览器事件：主要是解决特殊的IE事件

一段代码感觉下各个阶段DOM事件处理程序的写法：
> 事件的处理程序有时也叫句柄、事件回调等
```html
<!-- HTML事件处理程序,写在HTML元素上 -->
<input type="button" value="点击" onclick="fun(event)">
```
```js
// DOM 0级事件处理程序
var oDiv = document.getElementById('test');
oDiv.onclick = function(event){ alert(this.tagName);  
oDiv.onclick = null; // 解除事件监听
```
```js
// DOM 2级事件处理程序
var oDiv = document.getElementById('test');

function handler = function(event){ alert(this.tagName); 
oDiv.addEventListener('click', handler, false); 
oDiv.removeEventListener('click', handler, false); // 移除事件监听
```