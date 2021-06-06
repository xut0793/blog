# Module 前端模块化演进

[[toc]]

新入门的前端开发者一开始就接触着成熟的模块化语法，并且一开始项目开发都是集成 webpack 模块化打包工具的脚手架构建的工程中开发，习以为常，似乎离开了这些配套工具都无从下手一个简单的项目开发。回到最初原始的 web 三件套来开发都不知道如何组织代码。这是我目前的困扰，只有梳理前端模块化发展的历史，明白这些工具在演进的过程中扮演的角色，解决的问题，才更好地理解现在前端项目工程中出现的配套工具使用的初衷。

> 以下内容总结都来源于网络文章的汇总，具体请查看链接

## 前端发展中出现的问题

Brendan Eich 用了10天就创造了 JavaScript，因为当时的需求定位，导致了 JS 在设计之初，就不是一种模块化编程语言，在语言层就没有包含很多高级语言的特性，比如不支持"类"（class），更遑论"模块"（module）了。

JS 最初只是为了实现网页上简单的交互特效，几十行 js 代码，我们最常用的就是直接嵌套在 html 结构的 `<script>`标签内：

> 当您仅将脚本语言用于页面上飘落的雪花的动画或用于表单验证时，而所有内容都可以在同一全局范围内生活和交互时，为什么还要关心代码和依赖项的隔离。

- script 标签内写代码

```js
<!DOCTYPE html>
<html>
<head>
	<title></title>
  <link rel="dns-prefetch" href="xxx.css">
</head>
<body>

</body>
<script>
  /* 如果只是非常简单的代码就可以完成的功能时，最常见的就是把代码直接组织在 html 文件的 script标签内执行*/
  // do some simple things
</script>
</html>
```

- `.js` 文件组织代码

如果项目需求变得复杂，单独一个 html 文件再也不适合组织项目代码，此时我们会利用目录文件来组织项目代码，包括 CSS / JS 抽离到单独的文件，然后在 HTML 文件中引入。

当然使用 script 标签直接写脚本代码和引入 js 文件并不冲突，两者可以同时使用。
```js
<!DOCTYPE html>
<html>
<head>
	<title></title>
  <link rel="dns-prefetch" href="xxx.css">
	<script type="text/javascript" src="xxx.js"></script>
</head>
<body>

</body>
</html>
```

- 需要管理`.js`文件顺序

随着前端的发展，web技术日趋成熟，js 功能越来越多，代码量也越来越大。之前一个项目通常各个页面公用一个 js 即可，但是随着项目复杂度增加，js 文件逐渐拆分，项目中引入的js 越来越多，包括引用外部的工具库和项目内自定义的模块文件。

```js
<script src="zepto.js"></script>
<script src="jhash.js"></script>
<script src="fastClick.js"></script>
<script src="iScroll.js"></script>
<script src="underscore.js"></script>
<script src="handlebar.js"></script>
<script src="datacenter.js"></script>
<script src="util/wxbridge.js"></script>
<script src="util/login.js"></script>
<script src="util/base.js"></script>
```

随着JavaScript逐渐转变为通用语言，它开始被用于在各种环境（浏览器，移动设备，服务器，IoT）中构建复杂的应用程序。通过全局范围进行程序组件交互的旧方法变得不可靠，因为代码量的增加往往会使您的应用程序过于脆弱。因此，为简化JavaScript应用程序的创建，创建了各种模块化的实现。

这个时间，项目开发中暴露的问题也越来越多：

- 变量重名：不同文件中的变量如果重名，后面的会覆盖前面的，造成程序运行错误。
- 全局变量污染：各个文件的变量都是挂载到window对象上，污染全局变量。
- 文件依赖顺序：多个文件之间存在依赖关系，需要保证一定加载顺序问题严重。
- 请求过多：嵌入多个 script 标签，意味着网页加载时需要请求多个 js 文件，影响项目性能。

所以，这些问题可以通过现代模块化编码和项目构建来解决，但这个发展是经过一代一代方案改善和创新演化过来的。

- 直接定义模块依赖关系 1999
- 命名空间模式 2000
- 模块模式(IIFE模式) 2003
- 模板定义的依赖关系（2006）
- 评论定义的依存关系（2006）
- 外部定义的依存关系（2007）
- 沙盒模式（2009）
- 依赖注入（2009）
- CommonJS模块（2009）
- AMD（2009年）
- UMD（2011）
- 标记模块（2012）
- YModules（2013）
- ES2015模块（2015）

## 什么是模块化

![module-lego.png](./images/module-lego.png)

我觉得用乐高积木来比喻模块化再好不过了。

1. 每个积木都是固定的结构：凸起和凹陷的部分。
1. 想要组合积木必须使用积木凸起和凹陷的部分进行连接
1. 最后多个积木累积成你想要的形状。

同样的道理，在一个庞大复杂的项目，我们将复杂逻辑拆分成一个个简单逻辑的功能块，这些功能块的简单逻辑可以通过抽象成一个函数来实现，也可以一个或多个函数组织成一个单独的js文件来管理代码。

所以模块化，我的理解也是一种设计模式或是最佳实践，将复杂逻辑抽离成一个个简单逻辑单元，使用时再组合拼装简单逻辑单元实现复杂功能。

> 模块化是一种分治的思想，将复杂系统分解成离散功能块(discrete chunks of functionality)。所以模块应该保持职责单一、相互独立、低耦合的、高度内聚且可替换的离散功能块。

> 模块化也是组件化的基石，是构成现在色彩斑斓的前端世界的前提条件。实际上中间件也可以理解为是一个功能逻辑独立的模块。

## 理解模块化规范

但是项目不是一个人在开发，是很多人协作。并且通用的功能模块应该可以跨项目通用。所以要让不同的人抽离出的模块能被拼装，和相同功能的模块能够在不同项目中通用，就需要大家像乐高积木一样对模块实现相同的 “凸起和凹陷的部分”。

如果项目成员 A 使用 namespace 模式来实现模块，成员 B 采用 IIFE 模式构建自己的模块，那同个项目中不同的模块组织方式会让项目建构没有统一的标准。

所以对模块暴露的导出和导入接口的约定就是模块规范。

大家使用统一的模块规范组织模块文件，并可以实现模块的拼装和通用性。

> 规范就是一种大家都认同并实践的约定。 --- 我的理解

目前最广泛使用的模块规范就是 `CommonJS 规范`、`AMD 规范`、`ES Module 规范`

总结：

模块化规范要解决的最主要的问题是：统一模块的接口，包括导出和导入接口，然后通过模块构建工具解决模块文件间依赖顺序的问题，即实现管理依赖。然后实现中使用 IIFE 模式实现变量隔离，解决变量重名冲突和全局变量污染的问题。


## 模块化的演进

### 直接定义依赖

在1999年的时候，绝大部分工程师做JS开发的时候就直接将变量定义在全局，做的好一些的或许会做一些文件目录规划，将资源归类整理，这种方式被称为直接定义依赖。

```js
// greeting.js
var helloInLang = {
  en: 'Hello world!',
  es: '¡Hola mundo!',
  ru: 'Привет мир!'
};
function writeHello(lang) {
  document.write(helloInLang[lang]);
}

// third_party_script.js 引入一个第三方库，可能存在同名的方法
function writeHello() {
  document.write('The script is broken');
}

// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Basic example</title>
  <script src="./greeting.js"></script>
  <script src="./third_party_script.js"></script>
</head>
<body onLoad="writeHello('ru')">
</body>
</html>
```
即使有规范的目录结构，也不能避免由此而产生的大量全局变量。上述例子中的变量： `helloInLang / writeHello`，都是全局变量，这就导致了一不小心就会有变量重名冲突的问题，就greeting.js中的方法`writeHello` 和 模拟的一个 third_party_script.js文件中方法`writeHello`重名，由于 third_party_script.js 引用靠后，所以它的方法被最终执行。

### namespace 模式 : 简单对象封装

于是在2002年左右，有人提出了命名空间模式的思路，用于解决遍地的全局变量，将需要定义的部分归属到一个对象的属性上，简单修改上面的例子，就能实现这种模式：

```js
// greeting.js
var app = {};
app.helloInLang = {
  en: 'Hello world!',
  es: '¡Hola mundo!',
  ru: 'Привет мир!'
};
app.writeHello = function (lang) {
  document.write(helloInLang[lang]);
}

// third_party_script.js
function writeHello() {
  document.write('The script is broken');
}

// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Basic example</title>
  <script src="./greeting.js"></script>
  <script src="./third_party_script.js"></script>
</head>
<body onLoad="app.writeHello('ru')">
</body>
</html>
```
不过这种方式虽然修复了变量重名被覆盖的问题，但毫无隐私可言，本质上仍然都是全局对象，谁都可以来访问并且操作，被重新赋值改变，一点都不安全。这就是全局变量污染的问题。

### IIFE 模式：IIFE结合Closures特性（函数自调用结合闭包特性）

所以在2003年左右就有人提出利用IIFE结合Closures特性，以此解决全局变量的问题，这种模式被称为闭包模块化模式：
```js
// greeting.js
var greeting = (function() {
  var module = {};
  var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!',
  };

  module.getHello = function(lang) {
    return helloInLang[lang];
  };

  module.writeHello = function(lang) {
    document.write(module.getHello(lang));
  };

  return module;
})();
```
- 利用函数作用域隔离变量，通过IIFE可以形成一个独立的作用域，其中声明的变量，仅存在于该作用域下，从而达到实现私有变量的目的。就如上面例子中的helloInLang，在该IIFE外是不能直接访问和操作的。
- 利用闭包暴露对外访问接口，通过暴露一些方法来访问和操作私有变量，比如说上面例子里面的 getHello 和 writeHello 两上方法，这就是 Closures 闭包的特性之一。

### 放大模式：IIFE模式的增强（引入依赖）

如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，这时就有必要采用"放大模式"（augmentation）即通过传递参数的形式实现不同模块之间的引用。

简单理解，通过传参的 IIFE 模式为某个包增强功能，即功能放大。

```js
// greeting.js
var greeting = (function() {
  var module = {};
  var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!',
  };

  module.getHello = function(lang) {
    return helloInLang[lang];
  };

  return module;
})();

// enhance-greenting.js
var enhanceGreenting = (function(greeting) {
  var module = {};

  module.writeHello = function(lang) {
    document.write(greeting.getHello(lang));
  };

  return module;
})(greeting); // @require greeting.js

// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Basic example</title>
  <script src="./greeting.js"></script>
  <script src="./enhance-greenting.js"></script>
</head>
<body onLoad="module.writeHello('ru')">
</body>
</html>
```

### 宽放大模式："立即执行函数"的参数可以是空对象。
在浏览器环境中，script 标签引入的各个模块通常都是从网上获取的，有时无法知道哪个部分会先请求加载完成。如果采用上一节的写法，如果 greeting.js 晚于 enhance-greenting.js 加载完成，或者 greeting.js 加载出错，那` document.write(greeting.getHello(lang));`会调用出错，因为入参 greeting 是 undefined， `undefined.getHello()`调用报错。

这个时就要采用"宽放大模式"。与"放大模式"相比，＂宽放大模式＂就是"立即执行函数"的参数缺省时可以是空对象。

```js
// enhance-greenting.js
var enhanceGreenting = (function(greeting) {
  var module = {};

  module.writeHello = function(lang) {
    document.write(greeting.getHello(lang));
  };

  return module;
})(greeting || {}); 
```

### 沙箱模式 Sandbox Pattern

结合命名空间模式，将模块挂载在一个统一的实例对象上。
```js
// file sandbox.js
function Sandbox(callback) {
    var modules = [];

    for (var i in Sandbox.modules) {
        modules.push(i);
    }

    for (var i = 0; i < modules.length; i++) {
        this[modules[i]] = Sandbox.modules[modules[i]]();
    }
    
    callback(this);
}

// file greeting.js
Sandbox.modules = Sandbox.modules || {};

Sandbox.modules.greeting = function () {
    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    return {
        sayHello: function (lang) {
            return helloInLang[lang];
        }
    };
};

// file app.js
new Sandbox(function(box) {
    document.write(box.greeting.sayHello('es'));
});
```
### YUI 方式

YUI 是雅虎出品的一个具有JS压缩、混淆、请求合并（合并资源需要server端配合）等性能优化的工具。模块化管理只是其功能的一部分。

通过YUI全局对象去管理不同模块，所有模块都只是对象上的不同属性。YUI 模块化的实现糅合了命名空间模式及沙箱模式。

```js
// YUI - 添加并编写模块
YUI.add('dom', function(Y) {
  Y.DOM = { ... }
})

// YUI - 使用模块
YUI().use('dom', function(Y) {
  Y.DOM.doSomeThing();
  // use some methods DOM attach to Y
})

// hello.js 引用其它模块
YUI.add(
  'hello', 
  function(Y){
    Y.sayHello = function(msg){
        Y.DOM.set(el, 'innerHTML', 'Hello!');
    }
  },
  '3.0.0',
  {
    requires:['dom']
  }
)

// main.js
YUI().use('hello', function(Y){
    Y.sayHello("hey yui loader");
})
```

随着Node.js的到来，CommonJS规范的落地以及各种前端工具、解决方案的出现，很快，YUI3就被湮没在了历史的长流里面，这样成为了JS模块化开发的一个分水岭。

> 从 1999 年开始，模块化探索都是基于语言层面的优化，真正的革命从 2009 年 CommonJS 的引入开始，前端开始大量使用预编译和工程构建。

### CommonJS / Node / Browserify.js

2009年Nodejs发布，其中Commonjs是作为Node中模块化规范以及原生模块面世的。Node中提出的Commonjs规范具有以下特点：

- 原生Module对象，每个文件都是一个Module实例
- 文件内通过require对象引入指定模块
- 所有文件加载均是同步完成
- 通过module.exports暴露内容
- 每个模块加载一次之后就会被缓存
- 模块编译本质上是**沙箱编译**
- 由于使用了Node的api，只能在服务端环境上运行

基本上Commonjs发布之后，就成了Node里面标准的模块化管理工具。同时Node还推出了npm包管理工具，npm平台上的包均满足Commonjs规范，随着Node与npm的发展，Commonjs影响力也越来越大，并且促进了后面模块化工具的发展，具有里程碑意义的模块化工具。

之前的例子我们这样改写：

```js
// file greeting.js
var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

var sayHello = function (lang) {
    return helloInLang[lang];
}

module.exports.sayHello = sayHello;

// file hello.js
var sayHello = require('./lib/greeting').sayHello;
var phrase = sayHello('en');
console.log(phrase);
```
补充一点沙箱编译：require进来的js模块会被Module模块注入一些变量，使用立即执行函数编译，看起来就好像：
```js
(function (exports, require, module, __filename, __dirname) {
    //原始文件内容
})();
```
看起来require和module好像是全局对象，其实只是闭包中的入参，并不是真正的全局对象。

CommonJS 服务器和浏览端通用的模块规范（同步加载）
- Node内部提供一个Module构建函数。所有模块都是Module的实例。
- 每个模块内部，都有一个module对象，代表当前模块。
- module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。
- Node为每个模块提供一个exports变量，指向module.exports。
- 如果一个模块的对外接口，就是一个单一的值，不能使用exports输出，只能使用module.exports输出。

Modules/1.0规范包含内容：

- 模块的标识应遵循的规则（书写规范）
- 定义全局函数require，通过传入模块标识来引入其他模块，执行的结果即为模块暴露出来的API；
- 如果被require函数引入的模块中也包含依赖，那么依次加载这些依赖；
- 如果引入模块失败，那么require函数应该报一个异常；
- 模块通过变量exports来向外暴露API，exports赋值暴露的只能是一个对象 `exports = {Obj}`，暴露的API须作为此对象的属性。exports本质是引入了module.exports的对象。不能直接将exports变量指向一个值，因为这样等于切断了exports与module.exports的联系。
- 如果暴露的不是变量exports，而是module.exports。module变量代表当前模块，这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。`exports=module.exports={Obj}`

前端说过，规范是一种约定，约定了导入和导出的拼装接口，具体如何把多个模块拼装组合在一起，还需要工具的实现。Node 是 CommonJS 规范在服务器实现的载体，而 Browserify 是 CommonJS可以在浏览器端实现。

Commonjs的诞生给js模块化发展有了重要的启发，Commonjs非常受欢迎，但是局限性很明显：Commonjs基于Node原生api在服务端可以实现模块同步加载，但是仅仅局限于服务端，客户端如果同步加载依赖的话时间消耗非常大，所以需要一个在客户端上基于Commonjs但是对于加载模块做改进的方案，于是AMD规范诞生了。

### AMD / RequireJS

AMD与Commonjs一样都是js模块化规范，是一套抽象的约束，与2009年诞生。[AMD (中文版)文档](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))

该约束规定采用 require 语句加载模块，但是不同于CommonJS，它要求两个参数：

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数callback，则是加载成功之后的回调函数。
```js
require([module], callback);
```

另外约束采用 defined 导出模块：id是定义模块的名字，仍然会在所有依赖加载完毕之后执行factory。
```js
define(id?, dependencies?, factory);
/** id：指定义中模块的名字，可选；如果没有提供该参数，模块的名字应该默认为模块加载器请求的指定脚本的名字。如果提供了该参数，模块名必须是“顶级”的和绝对的（不允许相对名字）。
dependencies：是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。依赖参数是可选的
factory：工厂函数，模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值。
*/
```
```js
// file lib/greeting.js
define(function() {
    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    return {
        sayHello: function (lang) {
            return helloInLang[lang];
        }
    };
});

// file hello.js
require(['./lib/greeting'], function(greeting) {
    var phrase = greeting.sayHello('en');
    document.write(phrase);
});
```

#### RequireJS

RequireJs是js模块化的工具框架，是AMD规范的具体实现。

RequireJs有两个最鲜明的特点：

- 依赖前置：动态创建`<script>`引入依赖，在`<script>`标签的onload事件监听文件加载完毕；一个模块的回调函数必须得等到所有依赖都加载完毕之后，才可执行，类似Promise.all。
- 配置文件：有一个main文件，配置不同模块的路径，以及shim不满足AMD规范的js文件。

```js
// main.js 入口文件
requirejs.config({
    shim: {
        // ...
    },
    paths: {
        a: '/a.js',
        b: '/b.js',
        c: '/c.js',
        index: '/index.js'
    }
});

require(['index'], function(index){
    index();
});

// 定义模块 a.js
define('a', ['c'], function(c){
    return {
        aStr: 'aa',
        aNum: c.cNum + 1
    }
});

// b.js
define('b', ['a'], function(a){
    return {
        bStr = a.aStr + ' bb';
    }
});

// c.js
define('c', function(){
    return {
        cNum: 0
    }
});

// index.js
define('index', ['a', 'b'], function(a, b){
    return function(){
        console.log(a.aNum, b.bStr);
    }
});
```

在 HTML 页面嵌入
```html
<!-- data-main 是 Require.js 引用入口文件的自定义 data-* -->
<script src="/require.js" data-main="/main" async="async" defer></script>
```
RequireJs当年在国内非常受欢迎，主要是以下优点：

- 动态并行加载js，依赖前置，无需再考虑js加载顺序问题。
- 核心还是注入变量的沙箱编译，解决模块化问题。
- 规范化输入输出，使用起来方便。
- 对于不满足AMD规范的文件可以很好地兼容。
 
### CMD / Sea.js

同样是受到Commonjs的启发，国内（阿里）诞生了一个CMD（Common Module Definition）规范。该规范借鉴了Commonjs的规范与AMD规范，在两者基础上做了改进。

与AMD相比非常类似，CMD规范（2011）具有以下特点：

- 不同于AMD的依赖前置，CMD推崇依赖就近（需要的时候再加载）
- define定义模块，require加载模块，exports暴露变量。
- 推崇api功能单一，一个模块干一件事。

#### SeaJs

SeaJs是CMD规范的实现，跟RequireJs类似，CMD也是SeaJs推广过程中诞生的规范。CMD借鉴了很多AMD和Commonjs优点，同样SeaJs也对AMD和Commonjs做出了很多兼容。

SeaJs核心特点：

- 需要配置模块对应的url。
- 入口文件执行之后，根据文件内的依赖关系整理出依赖树，然后通过插入`<script>`标签加载依赖。
- 依赖加载完毕之后，执行根factory。
- 在factory中遇到require，则去执行对应模块的factory，实现就近依赖。
- 类似Commonjs，对所有模块进行缓存（模块的url就是id）。
- 类似Commonjs，可以使用相对路径加载模块。
- 可以向RequireJs一样前置依赖，但是推崇就近依赖。
- exports和return都可以暴露变量。

```js
// a.js
console.log('a1');
define(function(require,exports,module){
    console.log('inner a1');
    require('./c.js')
});
console.log('a2')

// b.js
console.log('b1');
define(function(require,exports,module){
    console.log('inner b1');
});
console.log('b2')

// c.js
console.log('c1');
define(function(require,exports,module){
    console.log('inner c1');
});
console.log('c2')
```
页面引入

```html
<body>
  <script src="/sea.js"></script>
  <script>
    seajs.use(['./a.js','./b.js'],function(a,b){
        console.log('index1');
    })    
  </script>
</body>
```
对于seaJs中的就近依赖，有必要单独说一下。来看一下上面例子中的log顺序：

1. seaJs执行入口文件，入口文件依赖a和b，a内部则依赖c。
2. 依赖关系梳理完毕，开始动态script标签下载依赖，控制台输出：
```js
a1
a2
b1
b2
c1
c2
```
3. 依赖加载之后，按照依赖顺序开始解析模块内部的define：inner a1
4. 在a模块中遇到了require('./c')，就近依赖这时候才去执行c模块的factory：inner c1
5. 然后解析b模块：inner b1
6. 全部依赖加载完毕，执行最后的factory：index

完整输出顺序：
```js
a1
a2
b1
b2
c1
c2
inner a1
inner c1 
inner b1
index
```

### UMD

为了更方便兼容CommonJS和CMD规范，出现了UMD方案，严格来说UMD并不算是模块化规范，它就是AMD与CommonJS的集合体，通过IIFE的前置条件判断，使一个模块既可以在浏览器运行，也可以在Node.JS中运行。

```js
// UMD
(function(define) {
    define(function () {
        var helloInLang = {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        };

        return {
            sayHello: function (lang) {
                return helloInLang[lang];
            }
        };
    });
}(
    typeof module === 'object' && module.exports && typeof define !== 'function' ?
    function (factory) { module.exports = factory(); } :
    define
));
```

### ES Module

之前的各种方法和框架，都出自于各个大公司或者社区，都是民间出台的结局方法。

2015年6月，ECMAScript2015也就是ES6发布了，JavaScript终于在语言标准的层面上，实现了模块功能，使得在编译时就能确定模块的依赖关系，以及其输入和输出的变量，不像 CommonJS、AMD之类的需要在运行时才能确定（例如FIS这样的工具只能预处理依赖关系，本质上还是运行时解析），成为浏览器和服务器通用的模块解决方案。

**浏览器端使用**

```js
// lib/greeting.js
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

export const getHello = (lang) => (
    helloInLang[lang];
);

export const sayHello = (lang) => {
    console.log(getHello(lang));
};
```js
页面引入
```html
// 可以合钐Live Server 启动本地服务，不然报跨域错误
<script type="module">
  import { sayHello } from './lib/greeting';
  sayHello('ru');
</script>
```

**Node端使用**

Node.js 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。

```js
// lib/greeting.mjs
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

export const getHello = (lang) => (
    helloInLang[lang];
);

export const sayHello = (lang) => {
    console.log(getHello(lang));
};

// index.mjs
import { sayHello } from './lib/greeting';
sayHello('ru');
```
```js
// node version 13.2.0
node index.mjs
```

可以看到，ES6中为模块化增加了关键字import，export，default，as，from，与CommonJS不同，不是全局对象。

两种加载模块方式也不同，在ES6中，import命令可以具体指定加载模块中用export命令暴露的接口（不指定具体的接口，默认加载export default），没有指定的是不会加载的，因此会在编译时就完成模块的加载，这种加载方式称为**编译时加载**或者**静态加载**。

CommonJS中是**运行时加载**，将整个模块作为一个对象引入，然后再获取这个对象上的某个属性。

两者最重要的不同点：

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

一个典型的例子看两者的区别：
```js
// counter.js
exports.count = 0
setTimeout(function () {
  console.log('increase count to', ++exports.count, 'in counter.js after 500ms')
}, 500)

// commonjs.js
const {count} = require('./counter')
setTimeout(function () {
  console.log('read count after 1000ms in commonjs is', count)
}, 1000)

//es6.js
import {count} from './counter'
setTimeout(function () {
  console.log('read count after 1000ms in es6 is', count)
}, 1000)
```
分别运行 commonjs.js 和 es6.js：

```
➜  test node commonjs.js
increase count to 1 in counter.js after 500ms
read count after 1000ms in commonjs is 0
➜  test babel-node es6.js
increase count to 1 in counter.js after 500ms
read count after 1000ms in es6 is 1
```

这个例子解释了CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。(注意如果输出的是对象类型，因为持有的是对象的引用，效果和ES6一样。)

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

换句话说，ES6 模块中原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

另外，ES6的编译时加载，在效率上面会提高不少，此外，还会带来一些其它的好处，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。


## 总结

写了这么多，蜻蜓点水分析了不同方法的实现。现在重新看一下当时模块化的痛点：

- 变量重名：不同文件中的变量如果重名，后面的会覆盖前面的，造成程序运行错误。
- 全局变量污染：各个文件的变量都是挂载到window对象上，污染全局变量。
- 文件依赖顺序：多个文件之间存在依赖关系，需要保证一定加载顺序问题严重。

不同的模块化手段都在致力于解决这些问题。前两个问题其实很好解决，使用闭包配合立即执行函数，高级一点使用沙箱编译，缓存输出等等。

真正的难点在于依赖关系梳理以及加载，即依赖的管理。
- Commonjs在服务端使用fs可以接近同步的读取文件
- 但是在浏览器中，不管是RequireJs还是SeaJs，都是使用动态创建script标签方式加载，依赖全部加载完毕之后执行，省去了开发手动书写加载顺序这一烦恼。
- 到了ES6，官方出台设定标准，不在需要类似RequireJs 或 SeaJs 类似的框架或者hack的方式来直接使用模块规范语法。该项已经作为标准要求各浏览器实现。


## 参考链接

[JS模块的演变：evolution_of_js_modularity](https://github.com/myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity) --- 时间轴的形式阐述<br>
[JavaScript模块化开发的演进历程](https://segmentfault.com/a/1190000011081338)<br>
[JavaScript模块化发展](https://segmentfault.com/a/1190000015302578#item-2-7)<br>
[最详细、最全面的“前端模块化方案”总结](https://zhuanlan.zhihu.com/p/134070306)--模块的定义和实现<br>
[详解JavaScript模块化开发](https://segmentfault.com/a/1190000000733959) ---例子和链接<br>
[前端工程师必备：前端的模块化](https://segmentfault.com/a/1190000018843655)--示例<br>
[各种模块化演示示例](https://github.com/ljianshu/Blog/tree/master/%E6%A8%A1%E5%9D%97%E5%8C%96)<br>
[Browserify 使用指南](https://zhaoda.net/2015/10/16/browserify-guide/)<br>
[RequireJS API中文版](https://blog.csdn.net/sanxian_li/article/details/39394097)<br>
[AMD (中文版)](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))<br>

## 前端工程中模块化构建工具关系

[Webpack、Browserify和Gulp三者之间到底是怎样的关系？](https://www.zhihu.com/question/37020798/answer/71621266)

![modlue-tools.png](./images/module-tools.jpg)