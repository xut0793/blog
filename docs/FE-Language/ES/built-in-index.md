# 内置对象分类

[[toc]]

在基础的Object对象的基础上，衍生了很多实现特定功能的对象，包含语言规范定义的内置对象和语言宿主定义的对象。

## 对象分类

- 全局对象 globalThis
  - 值属性：NaN Infinity undefined
  - 函数属性：parseInt() parseFloat() isNaN() isFinite()
  - 处理URI的函数属性：decodeURI() encodeURI() decodeURIComponent() encodeURIComponent()
  - 特殊的对象属性：Math / JSON / Reflect / Intl
  - 作为构造器的函数属性： 
    - 创建基本类型包装对象的构造函数：Boolean() / Number() / String() 
    - 创建引用类型实例对象的构造函数：Object() / Function() / Array() / Date() / RegExp() / Error() 
    - ES next新增的构造函数：Set() / WeakSet() / Map() / WeakMap() / Promise() / Proxy() / ArrayBuffer() / TypeArray / DataView()
- 宿主对象
  - Window全局对象
  - DOM类型的对象
  - BOM类型的对象等。

## 理解构造函数

理解一个构造函数的四个维度
1. 作为纯函数：有些可以有特殊作用，如 `Object() / Number()`；有些不能这样调用，如`Date() / Math()`
1. 作为构造函数创建实例对象，使用new调用： `new Object()`，有些不能，如`new Symbol() / new Math()`
1. 作为函数对象，有自己的静态属性和方法： `Object / Math / Json`
1. 原型对象，实例可调用的方法基本都定义在原型对象上： `Object.prototype / Date.prototype`

后面讲解内置对象的内容也基于上述四个维度解读。