# Element 元素节点

`Element`接口描述了所有相同种类的元素所普遍具有的方法和属性，是一个通用性非常强的文档元素的基类。

同样根据文档类型的不同，派生出一些对应文档的接口来描述对应文档中元素具体的行为。比如HTML文档的 `HTMLElement` 接口，是HTML元素接口的基础，而 `SVGElement` 接口是所有 SVG 元素的基础。在 Web 平台的领域以外的语言，比如 XUL，通过 XULElement 接口，同样也实现了 Element 接口。这些接口功能是在`Element`类作了更深层级的定制化接口。

同`Document`类一样，`Element`类作为`Node`类的派生类，继承了`Node`文档基类的属性和方法外，还拥有以下属性和方法。
```js
Object <- Node <- Element <- HTMLElement <- HTMLBodyElement / HTMLFormElement 等等
```
## 属性和方法

属性 | 描述
--|--
tagName | 元素标签名
id | id特性
attributes | 特性列表
classList | 
className | 
innerHTML | 
outerHTML | 
previousElementSibling | 
nextElementSibling | 
clientWidth | 
clientHeight | 
clientLeft | 
clientTop | 
scrollWidth |
scrollHeight | 
scrollLeft | 
scrollTop | 



方法 | 描述
--|--
hasAttribute() | 判断是否含有该特性
hasAttributes() | 
getAttributeNames() |
getAttribute() | 获取特性值
setAttribute() | 设置特性值
toggleAttribute() | 切换特性
removeAttribute() | 移除特性
getElementsByClassName() | 通过类名获取元素
getElementsByTagName() | 通过标签名获取元素
querySelector() | 通过选择器获取元素，返回单个
querySelectorAll() | 通过选择器获取元素，返回列表
matches() | 
insertAdjacentElement() | 
insertAdjacentHTML()  | 
insertAdjacentText() | 
getBoundingClientRect() | 
scroll() | 
scrollBy() | 
scrollTo() | 
addEventListener() | 为元素添加事件监听
removeEventListener() | 移除元素的事件监听


## HTMLDocument接口的属性和方法

属性 | 描述
--|--
style | 	获取/设置元素的style属性
dataset | 获取元素的自定义属性，是一个对象（key-value，只读）
title | 获取/设置元素的title属性
tabIndex | 获取/设置元素的tab键控制次序
hidden | 	获取/设置元素是否隐藏
offsetWidth | 元素自身可视宽度加上左右border的宽度
offsetHeight | 元素自身可视高度加上上下border的宽度
offsetLeft | 元素自己border左边距离父元素border左边或者body元素border左边的距离
offsetTop | 元素自己border顶部距离父元素顶部或者body元素border顶部的距离
offsetParent | 元素的父元素，如果没有就是body元素


方法 | 描述
--|--
HTMLElement.blur() | 使元素失去焦点
HTMLElement.click() | 触发元素的点击事件
HTMLElement.focus() | 使元素获得焦点

