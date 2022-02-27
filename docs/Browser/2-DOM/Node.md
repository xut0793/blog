# Node 节点基类

[[toc]]

DOM 1级在DOM Core中定义了一个Node接口（也就是Node的构造函数，或者说Node类），DOM树中的所有节点类型都从这个接口继承一组通用的属性和方法。
> 在Javscript语言实现的DOM接口中，Node对象是从Ojbect接口（Object是JS中的基类）继承来的，所有也拥有JS中对象的基本属性和方法。

```js
typeof Node  // 'function'
Node instanceof Object // true
Object.isProtoTypeOf(Node) // true
```
## 属性和方法


DOM的目的就是为编程语言操作文档提供编程接口。而在脚本语言中对文档的操作无非就是增删改查（创建节点、添加节点、删除节点、替换或移动节点、选中节点等）。

现在我们来看下Node接口提供的通用的属性和方法，这些属性和方法都挂载在原型`Node.prototype`上。

从浏览器console面板上输入`Node.prototype`回车即可看到

属性 | 说明
--|--
节点本身信息相关|
nodeType | 只读，返回数字代表节点类型，如元素节点 1，文本节点 3
nodeName | 只读，依节点类型返回，如果是元素节点则始终返回标签名（大写），文本节点为'#text'，文档节点为'#document'
nodeValue | 可读写，如果是元素节点则为null，如果文本节点则返回节点内容
textContent | 可读写，返回或设置一个元素内所有子结点及其后代的文本内容
节点关系相关|
ownerDocument | 返回这个节点的根节点，即 Document对象
parentNode | 返回一个当前结点的父节点，如果没有或当前结点已经是根节点则为null
parentElement | 返回一个当前节点的父元素节点 。 如果当前节点没有父节点或者说父节点不是一个元素(Element), 这个属性返回null
childNodes | 返回一个包含了所有子节点的实时的NodeList类数组对象
firstChild | 返回该节点的第一个子节点，如果该节点没有子节点则返回null。
lastChild | 返回该节点的最后一个子节点，如果该节点没有子节点则返回null。
previousSibling | 返回一个当前节点同辈的前一个结点，如果没有返回null
nextSibling | 返回与该节点同级的下一个节点，如果没有返回null。


方法 | 说明
--|--
查询节点相关方法 |
getRootNode() | 返回上下文对象的根结点
hasChildNodes() | 布尔值，来表示该元素是否包含有子节点。
isEqualNode() | 布尔值，表示两个节点是否严格相等（有多个满足条件才完全相等，见下面)
contains() | 布尔值，表示传入的节点是否为该节点的后代节点
compareDocumentPosition() | 比较当前节点与文档中的另一节点的位置。具体见最上面节点类型的打印值
操作节点相关方法 |
cloneNode() | 参数为布尔值，true时选择克隆这个节点下的所有内容。默认情况下，false，当前节点下被克隆。
appendChild() | 将作为参数的节点作为最后一个子节点添加到当前节点。
insertBefore() | 传入两个节点作为两个参数，将第一个参数节点插入到第二个参数节点之前
replaceChild() | 使用传入的节点替换当前节点
removeChild() | 删除当前节点
normalize() | 合并该元素下的所有文本节点为一个文本节点

## NodeList 类数组

NodeList是一个节点集合的类数组，有点类似函数中的arguments对象。有长度值length属性。

对于NodeList最重要是的要理解一点：当查询得到一个NodeList集合，它里的节点对象都是动态的，也就是说每当文档结构有变化，已经获取到NodeList集合内的节点对象也是会更新的。因此它始终都会保存着最新的、最准确的节点信息。

在JS中引用NodeList对象都会实时进行一次文档查询，所以在实际中会考虑到这段代码运行性能问题和会导致死循环的问题。正常操作应该尽量减少访问NodeList的次数，或者获取的集合对象用变量缓存起来。


