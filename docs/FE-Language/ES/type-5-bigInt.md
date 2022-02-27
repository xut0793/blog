# BigInt 类型

[[toc]]

## 问题

通过数据类型[Number](/ES/type-2-number)章节讲解，我们知道在ES中数值是有最大安全范围的: 2<sup>53</sup>-1

这个数字用十进制表示是`9007199254740991`（大约900万亿，即约为9*10<sup>15</sup>）

```js
// ES定义了两个表示安全整数范围的常量
Number.MAX_SAFE_INTEGER = 9007199254740991
Number.MIN_SAFE_INTEGER = -9007199254740991
```
在这个范围内的整数都可以精确地表示，对于超过这个范围的整数，JavaScript 依旧可以进行运算，但却不保证运算结果的精度，因为存储超出内存空间会被舍去，就这就整数精度丢失的问题。

```js
let n = Number.MAX_SAFE_INTEGER
console.log(n)      // 9007199254740991
console.log(n + 1)  // 9007199254740992
console.log(n + 2)  // 9007199254740992   不对
console.log(n + 3)  // 9007199254740994

// 使用BigInt
let m = BigInt(Number.MAX_SAFE_INTEGER)
console.log(m)      // 9007199254740991n
console.log(m+1n)   // 9007199254740992n
console.log(m+2n)   // 9007199254740993n
console.log(m * 50n) // 450359962737049550n
```

在大多数情况下，这个限制不是问题，但有时我们需要很大的数字，例如用于加密或微秒精度的时间戳。

所以ES2019规范新增了`BigInt`类型，用于表示任意长度的整数。

## BigInt 值的创建

有两种方式：
- 字面量方式： 直接在数字后面加n，代表BigInt类型值
- 使用BigInt()函数

```js
123n
9007199254740991n

let num = BigInt(123) // 123n
let hex = BigInt("0x1fffffffffffff") // 9007199254740991n
```


## BigInt 类型的特征

### 1. BigInt类型属于基本类型 typeof 12n === 'bigint'
```js
typeof 12n  // bigint
```

### 2. BigInt() 只能纯函数调用，不能使用 new 调用

同Symbol()函数一样，BigInt()函数对象在语言内部并没有实现内部属性`[[Constructor]]`，所以使用new调用会报错。但仍可以使用`Object()`方法来创建类型的包装对象，以实现属性调用。

### 3. 在安全整数范围内，BigInt 和 Number 不是严格相等的，但是宽松相等的。
```js
0n === 0 // false

0n == 0 // true
```

### 4. 默认情况下 BigInt 值不能使用JSON.stringify()序列化。但可以自定义toJSON方法实现

```js
BigInt.prototype.toJSON = function() { return this.toString(); }
```

## 总结

由于在 Number 与 BigInt 之间进行转换会损失精度，因而建议仅在值可能大于 2<sup>53</sup> 时使用 BigInt 类型，并且不在两种类型之间进行相互转换。
