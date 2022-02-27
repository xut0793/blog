# EcmaScript历史

[[toc]]


EcmaScript（ES）是一种语言规范，定义了语言的基本语法规则和实现规则。由Netscape网景公司（Mozilla的前身）将应用在Netscape浏览器上的脚本语言Javascript推荐到ECMA，并确定为标准，ECMA将其改名为ECMAScript。

> 2020-05-28 补充: 关于 JavaScript 和 EcmaScript 更为详细的演化历史，摘自公众号《前端早读课》

**JavaScript 20 年记念的系列文章（中文版）**[github链接](https://github.com/doodlewind/js-20-years-cn)

这个故事相当漫长而复杂。全文分为四个部分，每部分都对应 JavaScript 演化历程中的一个主要阶段。各部分之间还有一段简短的插曲，介绍彼时的开发者们是如何看待与使用 JavaScript 的。

这四个部分依次如下：

1. [语言诞生（The Origins of JavaScript）](https://mp.weixin.qq.com/s/eRne5EIQGDbE0-JclAzNAA)，介绍了 JavaScript 的创建与早期发展，包括语言的诞生背景、命名方式、原始功能及其设计理念等。这一节还追溯了它在 Netscape 与其他公司最初的演化，例如微软的 JScript。
2. [合纵连横（Creating a Standard）](https://mp.weixin.qq.com/s/qMtm6VlryP44REArCkR6yA)，介绍了从 JavaScript 到 ECMAScript 标准的历程。这主要涵盖 JavaScript 标准化工作的启动、规范的创建、相关贡献者以及决策方式等。
3. [改革遗恨（Failed Reformations）](https://mp.weixin.qq.com/s/h3uvL-L1SKuSx17QG7M0cg)，介绍了在 Eich 离开后，缺乏「仁慈独裁者」的 ECMAScript 委员会修改语言的失败尝试。这主要涉及委员会的分裂、对 ES4 的两轮投入，以及 Flash 与 ActionScript 在其中的渊源等。
4. [继往开来（Modernizing JavaScript）]()，介绍了 2009 年 ES5 与 2015 年 ES6 这两个成功标准背后的故事，主要包括对 ES5 与 ES6 的目标、重大基础更改以及重要新功能的介绍与回顾。

## 创造JavaScript

了解为什么要创造JavaScript 以及它是如何创建出来的，会帮助我们理解为什么它的现状是这样的，为什么语言设计上会出现一些奇怪的“BUG”。

1993年，NCSA（国家计算机安全协会）的Mosaic是最早发行的浏览器。（具体浏览器历史可以查看Browser章节）

1994年，网景公司成立，创造了Netscape Navigator（网景领航者）浏览器，并一度主导了整个90年代的互联网市场。

最初的浏览器都是静态页面，与用户的所有交互都需要请求服务器。比如如果想校验用户输入表单的值的正确性，都需要先将数据发送到服务器校验，然后将结果返回在另一个网页显示。网景公司很快意识到市场需要一个更加动感的web。

1995年网景聘请 Brendan Eich （布兰登.艾奇）来解决这个问题，起初是承诺让他在浏览器中实现 Scheme 语言。但在Eich开始之前，网景与Sun公司（被Oracle收购）已经展开合作，计划将Sun公司的静态编程语言Java植入Navigator浏览器。因此此时，在网景内部出现了激烈的争论：

为什么Web需要两种编程语言：Java 和 即将开发的脚本语言？

脚本语言的支持者们提到了如下解释：

>我们的目标是给设计师和那些将图片、插件和Java小应用等组件生成Web内容的兼职程序员提供一种“胶水”语言。我们将Java作为一种被高薪程序员使用的“组件语言”，而“胶水程序员”（业余程序员，Web设计者）可以通过一种脚本语言来封装组件和实现动态交互。

可能是为了平息争论，当时网景公司的管理者决定人创造一个类似Java语法的脚本语言。这样就排队了当时市场上已有的脚本语言，比如Perl / Python / TCL / Scheme。为了保护JavaScript的思想免受竞争提案的影响，网景需要尽快有一个原型。所以在1995年5月，Eich在10天内就写出了第一版本JavaScript。

JavaScript的第一版本代码是Mocha（Marc Andressen起的这个名字）。但由于当时网景公司的商标和许多产品已经用了Live前缀，网景公司市场部将它改名为LiveScript，并在1995年11月底，Navigator 2.0B3版本上发行了。

在1995年12月初，SUN公司的JAVA语言发展日益壮大，因为网景与SUN之前就存在合作关系，SUN把JAVA的商标授权给了网景使用。因此LiveScript再次改名，变成了JavaScript。

在JavaScript推出之后不久，网景当时最主要的竞争对手微软在IE3.0版本（1996年8月）推出了一个不同名的类似语言JScript。部分出于遏制微软的考量，网景公司决定规范JavaScript，向标准化组织 Ecma International推荐将JS作为脚本语言标准。

1996年11月，Ecma实施了一个叫ECMA-262规范。因为SUN公司注册了Java的商标，网景是得到了授权，但ECMA组织却不能使用，所以ECMA将JavaScript 与 Ecma 组合成 EcmaScript。但这个名字一般只是用来指语言规范，大家仍然称呼为JavaScript。

ECMA-262规范，即EcmaScript规范，由ECMA的第39个技术委员会（TC39）来管理与发展，其成员公司包括微软、Mozilla、Google等公司雇员，也包括Brendan Eich。

Brendan Eich在设计JavaScript语言时，也受到一些其它编程语言的影响和参考：

- Java 是 JavaScript 语法的参考模型，它影响 JS将值分为原始类型和对象类型，以及日期构造函数Date。
- AWK给了JS函数的灵感，实际上关键字 function 就来自AWK。
- Scheme 给了JS将函数是一等公民的思想，函数可以作为值一样传递和闭包。
- 向 Self 借鉴了基于原型的面向对象风格。
- Perl和Python影响了JS对字符串、数组和正则表达式的处理方式。
- HyperTalk启发了JS如何集成到浏览器中，使得HTML标签拥有事件处理属性。

> 英文好的可以阅读《深入理解JavaScript》第4章给出的文献链接，包括Eich本人发表的关于JS文章链接。需要翻墙

<img src="./images/es_history.png" width="400">

## 组织介绍
- ECMA 全称 European Computer Manufacturers Association（欧洲计算机制造商协会），是一个制定计算机各种标准的非营利性国际组织，维护各种计算机相关的标准。
- ECMA-262是ECMA各种标准中的第262号标准，这个标准就是ECMAScript语法标准。
- TC39是ECMA下属的第39个技术委员会，由各个主流浏览器厂商的代表构成，负责制定ECMAScript标准，并推动浏览器实现。
- ECMAScript：由Netscape网景公司（Mozilla的前身）将应用在Netscape浏览器上的脚本语言Javascript推荐到ECMA，并确定为标准，ECMA将其改名为ECMAScript。
- Javascript：早期就是指Netscape开发的脚本语言，现在主要指ECMAScript语言在浏览器端的实现，通过浏览器提供的DOM/BOM等web API实现网页交互。

[TC39,ECMA-262,ECMAScript,Javascript,它们之间是什么关系?](https://www.zhihu.com/question/63085873)

## ES版本时间轴

- 1997.1 ES1
- 1998.8 ES2，只是修改了部分标准，使其符合ISO/IEC 162632。
- 1999.12 ES3，增加了do-while、正则、错误处理、字符串新方法（concat / match / replace / slice / split等）
- 2008.7 ES4废弃，语法改变过于激进被废弃，部分特性作为Harmony版本（最终大部分特性在ES6中实现）
- 2009.12 ES5，作为ES4废弃的替代版本，增加了严格模式、、getter和setter、数组新方法、JSON
- 2011.6 ES5.1，只是修订了部分标准，使其符合ISO/IEC 16262:2011第三版
- 2015 ES2016（ES6），实现了很多ES4废弃版本中的特性。此后以年度发布特性版本

## JS的里程碑

- 1997年，DHTML（动态HTML），即实现DOM
- 1999年，XMLHttpRequest 作为浏览器API实现使用JS脚本请求HTTP，在IE5中被引入。
- 2001年，JSON作为数据交换格式，基于JavaScript实现。后来逐步代替了XML数据格式
- 2005年，Ajax实现，基于两个技术：XMLHttpRequest和DHTML实现异步加载并更新内容
- 2006年，jQuery出现，实现了强大的兼容性的DOM操作
- 2007年，WebKit作为HTML引擎，让移动Web成为主流。2003年被苹果引进，在2005由苹果开源
- 2008年，V8作为JS引擎出现，由Google创造并致于提供高效快速的JS解析编译，并在后续开源
- 2009年，Node.js出现，实现了JS在服务器端运行。Nodejs创造者 Ryan Dahl，选择了开源的V8作为JS引擎
- 2009年之后，HTML5成为主流技术，应用于开发移动端类Native应用

## ES特性

1. 它是动态的：许多东西可以被改变，包括动态类型，如声明的变量类型，和动态操作，如对象创建后可以自由添加和删除属性。
1. 它是多范式编程：支持函数式编程（函数是一等公民、闭包等功能），也支持面向对象编程（基于原型的面向对象对象）
1. 它是静默操作：类型隐式转换，错误修复等
1. 它是开源的：基于开源的JS引擎解释和编译
1. 它是开放的：最广泛的宿主环境是Web浏览器，它是一个开放的网络平台。

## ES优雅的语法

> Brendan Eich 表达过最喜欢的部分语法

- 函数是一等公民，可以像值一样传递
- 闭包
- 原型
- 字面量操作：字面量定义对象、字面量定义数组



## 参考书籍

- [JavaScript 20 年中文版 - 语言诞生](https://github.com/doodlewind/js-20-years-cn/blob/master/part-1.md)
- [JavaScript 20 年中文版 - 合纵连横](https://github.com/doodlewind/js-20-years-cn/blob/master/part-2.md)
- [JavaScript 20 年中文版 - 维新遗恨](https://github.com/doodlewind/js-20-years-cn/blob/master/part-3.md)
- [JavaScript 20 年中文版 - 继往开来](https://github.com/doodlewind/js-20-years-cn/blob/master/part-4.md)
-《深入理解JavaScript》第二部分第2章到第6章 P35-P46<br>



