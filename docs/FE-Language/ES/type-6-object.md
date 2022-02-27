# Object V8 对象模型

> 在 V8 里，一切看似匪夷所思的设计，最根本的原因就是为了更快。—— 引自网络

问题：
1. JavaScript V8 引擎是如何实现 JavaScript 对象模型的
1. 使用了哪些技巧来加快获取对象属性 
1. delete 操作对对象内存结构的影响
1. 函数、数组、集合（set/map)如何在对象基础上实现的

在 V8 中，对象模型主要由三个指针构成，分别是隐藏类（Hidden Class），Property 还有 Element。

- 隐藏类（Hidden Class）: 描述对象结构
- 序列属性 elements
  - FastElements
  - SlowElements
- 命名属性 properties
  - 对象内属性（in-object properties）
  - 快属性（fast properties）
  - 慢属性（slow properties）

首先，ECMAScript 规范对对象的描述有两点：
1. 定义为由字符串键key映射到 property属性的字典。
1. 可索引的属性应该按照索引值大小升序排列，而命名属性根据创建的顺序升序排列。

- 对于第一点：在 V8 引擎实现中，使用 隐藏类（Hidden Class）结构来管理分离出来的属性特性。
- 对于第二点：在 V8 引擎实现中，将可索引属性会被存储到 Elements 指针指向的内存区域，命名属性会被存储到 Properties 指针指向的内存区域。


> 学术论文称它们为 Hidden Classes（容易与 JavaScript 中的类概念混淆）<br>
> V8 将它们称为 Maps（容易与 JavaScript 中的 Map 概念混淆）<br>
> Chakra 将它们称为 Types（容易与 JavaScript 中的动态类型和关键字 typeof 混淆）<br>
> JavaScriptCore 称它们为 Structures<br>
> SpiderMonkey 称他们为 Shapes

既然对象是键值k-v结构，**为什么不直接用字典结构存储，还要拆成序列属性和命名属性，又再次分成使用数组结构的快属性和哈希结构的慢属性？**

答案都是为了加快对象属性调用时的查找速度 和 节省内存空间。

- 对序列属性（对象的键是数值或数值型字符串）存在 elements 结构中
  - 如果序列属性是连续的紧密数组，则 elements 采用数组 Array 结构存储
  - 如果序列属性是含有空洞 hole 的稀疏数组，则 elements 采用哈希结构 hashMap
- 对命名属性（以字符串或symbol作为键key的属性）存在 properties
  - 对数量较小的（V8是10个（含）以内）命名属性直接保存在对象结构内，称对象内属性（in-object properties）
  - 如果数量中等（具体视引擎实现），则超出的剩余命名属性保存在 properties 中，并以 Array 结构保存其值value在 FixedArray 中内存地址，依次属性创建时的顺序，读属性时值的偏移量保存在隐藏类中。称为快属性，因为是通过 array 结构保存，读取速度较快
  - 如果数量较大，则剩余命名属性还是保存在 properties 中，但结构采用了 hashMap 存储，并且其属性的键和值都被存储。


**为什么要使用数组结构的快属性和哈希结构的慢属性？**

因为少量数据时线性的数组结构查找更优，而大量数据时非线性的哈希表查找更优。另外对更多空洞的稀疏数组采用哈希结构也节省了内存空间。

**为什么要添加隐藏类呢？**

在 ECMAScript 中，对象属性的 Attribute 被描述为以下结构。
- `[[Value]]`：属性的值 
- `[[Writable]]`：定义属性是否可写（即是否能被重新分配） 
- `[[Enumerable]]`：定义属性是否可枚举 
- `[[Configurable]]`：定义属性是否可配置（删除）

大多数情况下，除了对象属性的 `[[Value]]` 经常会发生变动的，而 其它 Attribute 是几乎不怎么会变的。那对同一个对象的多个属性，甚至对具有相同属性结构的不同对象，都要各自维护一份几乎不会改变的 `[[Writable]] / [[Enumerable]] / [[Configurable]]`呢？显然这是一种内存浪费。

所以大多数引擎都对此抽象了 隐藏类（Hidden Class）来描述这部分结构，并且也作了优化处理，使用 [Transition 链与树](https://zhuanlan.zhihu.com/p/38202123)来描述。

**delete 操作对象属性的影响**

delete 操作可能会改变对象的结构，导致引擎将对象命名属性 properties 的存储方式由线性的数组降级为非线性的哈希表存储的方式，即将快属性降为慢属性存储，并且也会导致隐藏类不同，不能复用其它同结构对象的 shape 实例，不利于 V8 的优化，应尽可能避免使用（当沿着属性添加的反方向删除属性时，对象不会退化为哈希存储）。

上述内容是一个自我记忆的总结，主要参考以下两篇文章，并且都有更详细的配图

[V8 是怎么跑起来的 —— V8 中的对象表示](https://www.cnblogs.com/chargeworld/p/12236848.html#top)<br>
[JavaScript 引擎基础：Shapes 和 Inline Caches](https://zhuanlan.zhihu.com/p/38202123)<br>
[快属性和慢属性：V8采用了哪些策略提升了对象属性的访问速度？](https://time.geekbang.org/column/article/213250)

更多参考资料：

关于对象类型的值如何在内存中存储，比较底层，涉及 JS V8引擎的实现，可以参考以下文章：

[从Chrome源码看系列](https://zhuanlan.zhihu.com/p/26169639)<br>
[V8 Object 内存结构与属性访问详解](https://zhuanlan.zhihu.com/p/24982678)<br>
[JS 类型对象的内存布局总结](https://www.anquanke.com/post/id/185339)<br>
[再谈js对象数据结构底层实现原理-object array map set](https://www.cnblogs.com/zhoulujun/p/10881639.html)<br>
[探究JS V8引擎下的“数组”底层实现](https://mp.weixin.qq.com/s/np9Yoo02pEv9n_LCusZn3Q)<br>
[数组在 V8 中的元素种类及性能优化](https://zhuanlan.zhihu.com/p/29638866)--避免空洞数组（稀疏数组）和 类数组转为数组操作更优

