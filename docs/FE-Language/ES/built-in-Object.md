# Object

- 作为纯函数 `Object()`
- 作为构造函数创建实例对象 `new Object()`
- 作为函数对象 `Object`
- 原型对象 `Object.prototype`

## 对象API

| 方法                                        | 作用                                                          | 备注                                                                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Object.defineProperty(obj,prop)`           | 定义属性                                                      |
| `Object.defineProperties(obj,props)`        | 批量定义属性                                                  | `props`是对象形式                                                                                                                                                   |
| `Object.getOwnPropertyDescriptor(obj,prop)` | 获取对象指定属性的描述符                                      |
| `Object.getOwnPropertyDescriptors()`        | 获取对象所有属性的描述符                                      | 返回值是嵌套对象                                                                                                                                                    |
| `Object.preventExtensions(obj)`             | 对象不可扩展,即对象自身不能添加属性了,                        | 但属性仍可以删除,对象原型上可以添加属性                                                                                                                             |
| `Object.isExtensible(obj)`                  | 判断对象是否可添加属性                                        |
| `Object.seal()`                             | 封闭对象,即对象变得不可扩展且不可配置                         | 实际上会在一个现有对象上调用 object.preventExtensions(),并且把对象所有现有属性标记为`[[configurable]] = false`.密封对象主要表现为不能添加属性,原有属性也不可删除了. |
| `Object.isSealed(obj)`                      | 判断对象是否是封闭的                                          |
| `Object.freeze(obj)`                        | 冻结对象                                                      | 即`[[writable]]` `[[configurable]]`为`false`,表现为属性值不能修改,删除,不能添加属性,不能重写属性描述符等,但原有属性可以检举遍历,但不能修改`[[enumerable]]`的值了    |
| `Object.isFrozen(obj)`                      | 判断对象是否冻结的                                            |
| `Object.prototype.hasOwnProperty(obj,prop)` | 判断该属性是否是对象自身属性                                  | 常用于区别属性是对象的还是对象原型的                                                                                                                                |
| **属性与属性值相关(key-value)**             |                                                               |
| `Object.getOwnPropertyNames(obj)`           | 自身可枚举和不可枚举属性，但不包括 Symbol 类型的属性          | 返回值是属性的数组                                                                                                                                                  |
| `Object.getOwnPropertySymbols(obj)`         | 自身 Symbol 类型的属性                                        | Symbol 类型属性的数组                                                                                                                                               |
| `Object.keys(obj)`                          | 自身可枚举的属性和 symbol 类型属性,不包括不可枚举的属性       | 区别于 for-in 可遍历对象原型上的属性                                                                                                                                |
| `Object.values(obj)`                        | 自身可枚举的属性值和 symbol 类型属性值,不包括不可枚举的属性值 |
| `Object.entries(obj)`                       | 自身属性以[k,v]嵌套数组返回                                   |
| `Object.assign(target_obj, ...source)`      | 自身属性合并,同名的会被覆盖                                   | 返回全并后目标对象                                                                                                                                                  |
| `Object.is(val1,val2)`                      | 判断两个值是否相等                                            | 不进行隐式转换,深度相等, `==`会做隐式转换后才比较, `===`会对`+0`等于`-0`, `NaN`不等于`NaN`                                                                          |
| **原型 prototype 操作相关**                 |                                                               |
| `Object.create(proto)`                      | 创建一个新对象,以`proto`作为它的原型对象                      |
| `Object.getPrototypeOf(obj)`                | 返回给定对象的原型对象                                        |
| `Object.setPrototypeOf(obj, prototype)`     | 将`obj`的原型对象设置为`prototype`                            |
| `Object.prototype.isPrototypeOf(object)`    | 检查对象`object`是否存在于另一个对象的原型链上。              | `prototypeObj.isPrototypeOf(object)`                                                                                                                                |