# 目录


[[toc]]

构成程序最基本的三个部分分别是：

- 表达式
- 变量
- 语句

### 表达式

[表达式与操作符](./base-1-expression-operators)

表达式是包含着值和运算的代码，表达最终会产生一个值。表达式中也包含一个概念是运算符（操作符）。

下面示例都是表达式的形式，通过计算并返回一个值。
```js
2                                   // 2
12,23                               // 23
2 + 2 * 2                           // 6
(2 + 2) * 2                         // 8
9 > 5                               // true
'a' === 'a'                         // true
'123' == 123                        // true
true == 1                           // true
true == 2                           // true
true === !false                     // false
'123' + 4                           // 1234
'hello'.length                      // 5
'Hello'.replace('e','u')            // Hullo
[1,2,3].join('+')                   // 1+2+3
(function(x){return x * 3}(2))      // 8
void function(x){return x * 2}(2)   // undefined
```

## 变量

[变量](./base-2-variant)

对表达式得到的值，可能需要将来使用，所以在JS中通过变量将这些值存储起来。

变量就是一个带有名字的容器，里面存放着值。更准确说，变量代表一段存放着值的内存空间，变量的使用指向着内存中存储的值。

变量包含的内容：
```
- 变量的命名规范
- 变量的声明方式
- 变量的初始值
- 变量的生命周期
- 变量的作用域范围
- 变量提升
- 全局变量
- 常量
```

## 语句

[语句](./base-3-statement)
要构成完整的脚本代码，必须将表达式和变量连在一起构成语句。表达式产生一个值，语句代表一个操作。
```js
// 声明语句：声明一个变量
var name

// 声明语句：变量和赋值表达一起，即声明一个变量并初始化
var name = 'tom'

// 流程控制语句
if (1 < 3) {
  console.log('condition true')
} else {
  console.log('condition false')
}
```

## 其它概念

### 标识符

标识符代表语言中各种语法的名称，包括：
- 变量名
- 函数名
- 属性和方法名称
- 保留字

标识符命名规则

标识符命名需要遵循以下规范：
- 可以是任意Unicode字符、美元符号$、下划线_、数字
- 但标识符首字符不能是数字，即不能以数字开头
- 严格区分大小写，即大小写视为两个不同的标识符

### 保留字（关键字）

有一部分字符标识被语法的一部分，仅限语言内部使用，开发者不能再使用。这部分称为语言的保留字，或叫关键字。

比如以下这些：
var let const function export import class break case 等等
Infinity NaN undefined

更具体的所有保留字可以查看

### 字面量

字面量是由表达式定义的常量，其值是固定的，而且在程序脚本运行中不可更改。

```js
// Null类型的字面量就是null
null

// Undefined类型的字面量就是undefined
undefined

// 布尔值类型的字面量就是 true和 false
true
false

// 数值类型字面量可以是二进制、八进制、十进制、十六进制
0, -345 // (十进制, 基数为10)
015, -077 // (八进制, 基数为8，以0开头) 
0x1123, -0xF1A7 // (十六进制, 基数为16，以0x开头)
0b11, -0b11 // (二进制, 基数为2，以0b开头)

// 数值也可以是整数形式、小数形式、指数形式、正负数形式
3
3.14      
-.2345789 // -0.23456789
-3.12e+12  // -3.12*1012
.1e-23    // 0.1*10-23=10-24=1e-24

// 数值也可以特定的保留字
Infinity , -Infinity
NaN

// 字符串字面量是由双引号（"）对或单引号（'）括起来的零个或多个字符。
"foo"
"1234"
"one line \n another line"
"John's cat"

// 正则字面量：被斜线（译注：正斜杠“/”）围成的一个或多个字符组合。
var re = /ab+c/;
```

## 其它语法规则

### 分号

分号用于结束语句。

两个特性：
- 块语句结束不需要分号`{}`
- 在JS中分号`;`是可选的。

JS内部会通过自动插入机制（ASI）添加分号。但有时不正常的写法可能导致JS引擎自动判断出错，所以建议一直带上。关于最佳实践中是不添加分号，也是有争论的，具体视个人行为。

### 注释

在JS中有两个类型的注释：
- 多行注释：` /* 这是多行注释 */`
- 单行注释：`// 这是单行注释`