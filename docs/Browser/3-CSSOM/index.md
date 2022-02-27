# CSSOM

一个网页引入CSS样式有三种方式：

```html
内联式：在元素开始标签中直接定义 `<div style="color:pink">`
内嵌式：使用 style 元素嵌入：`<style> div {color: pink;} </style>`
引入式：使用 link 标签引入外部定义的样式表：`<link rel="stylesheet" type="text/css" href="theme.css" />`
```

- CSSOM（CSS文档对象模型）定义了描述样式表的接口：`styleSheet / CSSStyleSheet`。
- 一个样式表是由很多规则集合组成的（规则=选择器+样式声明）。所以CSSOM也定义了描述样式规则的接口：`CSSRule / CSSStyleRule`
- 一个规则中包含着很多CSS样式声明（声明=属性：属性值）。所以CSSOM也定义了描述样式声明的接口：`CSSStyleDeclaration`

接下来，看下这些接口都提供了哪些属性或方法来操作样式。

## StyleSheet <- CSSStyleSheet

控制台输入`styleSheet.prototype`

```
type：值是'text/css'
href: 样式表引用地址
title: 当前样式表的title特性值
disabled：返回Boolean表示当前样式表是否可用
media: 此样式表包含的媒体查询样式对象mediaList
ownerNode: 此样式表与之相关联的文档，即当前文档document
parentStyleSheet: 返回 StyleSheet 如果有的话; 返回 null 如果没有
```

`CSSStyleSheet`是专门针对CSS样式表的接口，表示一个单一样式表对象，继承于`styleSheet`接口，所以输入`CSSStyleSheet.prototype`，除了返回上述列出的继承属性外，还定义以下属性和方法：
```
cssRules: 返回样式表中CSS规则的CSSRuleList（CSSRule对象集合）
rules:
insertRule()
deleteRule()
replace()
addRule()
removeRule()
```
文档实例对象doucment的属性styleSheets返回的样式列表集合中的元素就是`CSSStyleSheet`类的实例。以及通过定义在`HTMLLinkElement`和`HTMLStyleElement`接口的sheet属性获取样式表也是`CSSStyleSheet`类的实例。
```js
let sheet = document.styleSheets[0]; // document.styleSheets会返回包含`<style>`元素和`rel="stylesheet"`的`<link>`元素引入的样式表。
let linkSheet = document.querySelectorAll('link')[0].sheet
let styleSheet = document.querySelectorAll('style')[0].sheet
```
以上`sheet / linkSheet / sytleSheet`都是单个样式表，都是`CSSStyleSheet`类的实例，拥有上述的列出的属性和方法。

## cssRule <- CSSStyleRule

CSSRule 接口描述了单一的CSS规则。
```
type: 规则类型，表示CSS规则类型，即`text/css`
cssText: 返回规则的文本表示. 例如 "h1,h2 { font-size: 16pt }"
parentRule: 返回包含规则，否则返回 null。例如：如果此规则是 @media 块中的样式规则, 则其父规则将是该 CSSMediaRule
parentStyleSheet: 返回包含此规则的样式表的 CSSStyleSheet 对象

/**
* CSS样式表的规则有多种类型：常规下是正常的CSS样式规则（CSSStyleRule)，其它类型包括@inport 、@media、 @font-face、@page、@charset
* 但这些规则很少通过脚本来访问，所以我们主要关注STYLE_RULE: 1类型，对应的就是CSSStyleRule接口。
*/
STYLE_RULE: 1
CHARSET_RULE: 2
IMPORT_RULE: 3
MEDIA_RULE: 4
FONT_FACE_RULE: 5
PAGE_RULE: 6
NAMESPACE_RULE: 10
KEYFRAMES_RULE: 7
KEYFRAME_RULE: 8
```
CSSStyleRule接口继承于CSSRule接口，表示常规下写入的CSS样式（即STYLE_RULE===1），除了继承上述4个属性外，还另外定义了下列属性（无方法）：
```
selectorText: 声明的选择器文本，如`.some-class`
style: 返回一个CSSStyleDeclaration接口实例，表示当前元素的所有样式声明，如{fontSize:'20px',backgroundColor:'red'}
```

## CSSStyleDeclaration

CSSStyleDeclaration接口描述了CSS样式声明的属性和方法，表示一个CSS属性和属性值的键值对的集合。

```
cssText: 声明块的文本内容。也可以设置这个属性来改变样式。区别规则中的cssText，不会包括选择器字符，例如："background-color:red;font-size:20px;"
parentRule: 包含的 CssRule接口实例
length: 正文获取属性item()返回的属性数量

getPropertyPriority(): 返回样式优先级。例如：priString= styleObj.getPropertyPriority('color')
item(): 返回属性名
getPropertyValue(): 返回属性值。例如: valString= styleObj.getPropertyValue('color')
removeProperty(): 返回被删除的属性。例如: valString= styleObj.removeProperty('color')
setProperty():  设置属性值，方法没有返回值。例如: styleObj.setProperty('color', 'red', 'important')
```

以下这个API实现了CSSStyleDeclaration类：
- HTMLElement.style
- CSSStyleRule.style
- document.defaultView.getComputedStyle() (浏览器环境中document.dafultView === window)

例子：操作内联样式（style属性）

在`HMTLElement`接口定义了一个style属性，可以获取元素实例对象的当前样式，和设置元素的内联样式
```js
/**
* 元素样式属性只能一个一个设置
*/
let oDiv = document.querySelector('div'); // oDiv 是 HTMLElement类的实例
let divStyle = oDiv.style; // GET:通过实例继承的属性style获取样式，style获取到的样式对象就是CSSStyleDeclaration类的实例对象
let divStyle.backgroundColor = 'red'; // SET: 设置的样式将以行内样式体现
let divStyle.fontSize = '20px'; // SET: 设置的样式将以行内样式体现
let divStyle.backgroundColor = ''; // remove：移除样式

/**
* 元素样式批量获取或设置
* 因为HTMLElement.style是CSSStyleDeclaration类的实例对象，所以也可以使用cssText批量获取或设置样式
*/
let divStyle = oDiv.style.cssText
oDiv.style.cssText = "background-color:red;font-size:20px;"
oDiv.style.cssText = ""
```
- 内嵌样式表和外部样式表的操作

```js
let firstSheet = document.styleSheets[0]
let firstCSSRule = firstSheet.cssRules[0]
var styleObj= firstCSSRule.style

console.log(styleObj.cssText);

for (var i = styleObj.length-1; i >= 0; i--) {
   var nameString = styleObj[i];
   styleObj.removeProperty(nameString);
}

console.log(styleObj.cssText);
```

## window.getComputedStyle()

虽然style对象能够提供元素的样式信息，但返回的只是定义在该元素上的样式（通过行内sytle或类等定义在自身上的样式），并不包含从其它样式表层叠而来的样式信息。所以DOM 2级增加了`document.defaultView`对象，增加了`getComputedStyle()`方法来获取元素实际生效的样式。

```
// 语法：
getComputedStyle(目标元素, 伪元素信息 )，伪元素信息是:after / :before，如果没有就 null

返回的是一个只读的CSSStyleDeclaration接口实例。
```

## 参考链接

[CSS-API(CSS 编程接口),CSSOM(css 对象模型)](https://blog.csdn.net/u014711690/article/details/82346584)<br>
[CSSOM w3c 官方规范](https://www.w3.org/html/ig/zh/wiki/Cssom)