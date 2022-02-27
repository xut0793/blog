# 严格模式 'use strict'

[[toc]]

ES有两种代码执行模式：严格模式和宽松模式。

默认为宽松模式，使用严格模式需要手动开启。

严格模式有更多的警告和更加合理的代码，一些不安全特性变得更少。

## 开启严格模式： use strict

```js
'use strict';
```
可以在一个JS文件，ES模块文件、script标签内的第一行、函数体的第一行来开启严格模式。不同的位置代表严格模式的作用范围。

## 严格模式下的特性

1. 变量必须被显式声明，这样就避免了宽松模式下未声明变量直接使用时会成为全局变量
1. 函数必须在全局作用域或函数作用域内声明才可以使用，不能在块作用域内声明函数。但可以换成函数表达式的写法。
1. 无对象绑定的this将指向undefined，而不是宽松模式下的全局对象。
1. 函数内的arguments对象不能调用arguments.callee和arguments.caller方法。
1. 严格模式下禁用八进制数。
1. 严格模式下禁用with语句
1. 严格模式下eval()更加简洁

```html
<script> 
'use strict';

a = 10;  // Uncaught ReferenceError: a is not defined

{
    function text(x) {
        alert(x * 100)
    }
}
text(10); // Uncaught ReferenceError: text is not defined

var obj = {
    name: 'tom',
    say() {
        alert(this.name)
    }
}
obj.say();  // 正常，this === obj
var s = obj.say;
s() // Uncaught TypeError: Cannot read property 'name' of undefined

var num = 012
console.log(num); // Uncaught SyntaxError: Octal literals are not allowed in strict mode.

function sum(x,y) {
  console.log(arguments);
  console.log(arguments.callee);
  console.log(arguments.caller);
}
sum(1,2) // Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
</script>
```
其中严格模式下的this指向限制，对于构造函数来说很有用，在严格模式下，对于不小心忘记对new去调用构造函数时将会看到警告信息。

```js
function Car(color) {
  'use strict';
  this.color = color;
}

var blackCar = new Car('black')
console.log(blackCar.color); // black
var redCar = Car('red') // Uncaught TypeError: Cannot set property 'color' of undefined
```

当然上面这种限制构造函数不能用作普通函数调用，也可以通过`new.target`属性达到目的

new.target属性允许你检测函数或构造方法是否是通过new运算符被调用的。

- 在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。
- 在普通的函数调用中，new.target 的值是undefined。

```js
function Car(color) {
  if (!new.target) {
    throw "Car() must be called with new";
  }
  this.color = color
}

var blackCar = new Car('black')
console.log(blackCar.color); // black
var redCar = Car('red') // Uncaught Car() must be called with new
```