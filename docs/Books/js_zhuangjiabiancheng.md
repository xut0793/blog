# 《JavaScript 专家编程》

![js_05.jpg](./images/js_05.jpg)
2015年8月第1版

这本书带给自己更多的还是视野上的扩宽，主要是最后几章关于编程风格、代码质量、工作流和测试的整体介绍。另外一点，书中对很多概念都有一个完整的定义，让自己对以前一些能理解更不能准确描述的概念有了更深的理解和阐述。

[[toc]]

## P3：对象

对象只是用于编程建模的多种隐喻之一。隐喻通常是晦涩难懂，是编程建模中概念上的一层抽象。
> 编程中的抽象，是把真实世界的事物或过程转为可计算的模型，也称为解耦。抽象给程序员提供了一种将复杂的大问题，拆解成小的离散的问题的机制。

在JS中，对象仅仅是属性（properties）的容器，每个对象容器可以包含零个或多个属性，属性的值可以是基本类型值（primitive），也可以指向一个复杂类型值。

**控制对象属性的操作**

在 JS 中，每个属性都有对应的属性描述符，用来控制单个属性的行为：
- 可写特性 writable
- 可检举特性 emumberable
- 可配置特性 configurable

**控制整个对象的操作**

JS 的构造器函数 Object() 提供了几个静态方法，用于控制整个对象的行为：
- Obejct.freeze()  / Object.isFrozen()  冻结对象，此时对象不能加入新的属性、不能删除已有属性、属性值不能被修改。后一个函数用于判断当前对象是否已被冻结，返回 true / false
- Object.seal() / Object.isSeal() 密封对象，此时对象不能加入新的属性，不能删除已有属性，不能配置属性描述符，但值仍然可以被修改。
- Object.preventExtensions() / Object.isExtensions()  阻止对象扩展，即对象不能添加新的属性，但属性仍然可以被删除或修改值

```js
/**
 * 正常一个对象字面量创建的对象属性，其属性描述符都是true
 * let obj = {
 *  name: 'tom'
 * }
 * console.log(Object.getOwnPropertyDescriptors(freezeObj));
 * name: {  value: 'tom', writable: true, enumerable: true, configurable: true  }
 * 
*/
let freezeObj = {
  name: 'tom'
}
Object.freeze(freezeObj)
console.log(Object.isFrozen(freezeObj)) // true
console.log(Object.getOwnPropertyDescriptors(freezeObj));
// name: {  value: 'tom', writable: false, enumerable: true, configurable: false  }

let sealObj = {
  name: 'tom'
}
Object.seal(sealObj)
console.log(Object.getOwnPropertyDescriptors(sealObj));
// name: {  value: 'tom', writable: true, enumerable: true, configurable: false  }

let preventExtensionObj = {
  name: 'tom'
}
Object.preventExtensions(preventExtensionObj)
console.log(Object.getOwnPropertyDescriptors(preventExtensionObj));
// name: {  value: 'tom', writable: true, enumerable: true, configurable: true  }
```

## P20: 封装的作用

在软件设计中，封装有三个目的：
- 隐藏实现，只暴露公共接口
- 保护私有逻辑，避免被外部直接访问或修改
- 提升模块化

## P22：运行时多态

多态，顾名思义，多种状态。“运行时多态”在 JS 中特别普遍和有用。

- 函数重载

在其它静态类型语言中，如 C++，JAVA等，函数重载指的是开发者可以定义相同名称，但方法签名（指函数参数）不同的多个函数，这些函数的差别在于参数数量不同，或参数类型不同而已，在编译时，编译器基于提供的参数数量和类型选择正确的函数。

但在 JS 函数对不进行强制类型检查，也不限制参数数量和类型。这种灵活性使得 JS 天然可以实现函数重载，而不需要对同一函数声明多个。
1. 已声明但未传入的参数，默认 undefined
2. 传入的实参都可以在默认实现的参数 arguments 中获取或修改。也可以使用 ES6 的 rest 形式的参数定义。

- 运算符重载

在 JS 中运算符重载主要针对 ` + ` 运算符，在实现运行时依据两边的运算子类型动态切换实现功能
1. 当任一运算子为 Sting 字符串类型时，作为字符拼接
2. 其它情况，作为加法实现

## P24：JS 原型继承

JS 基于原型继承，所有对象都从一个基本对象继承（ Object.prototype)。对 JS 中原型概念的理解，简单总结为就三点：
- 任何构造器函数都有一个固定的 `prototype` 属性，指向一个原型对象
- 任何实例对象都有一个固定的`[[prototype]]`内部属性，指向其构造函数的同一个原型对象。即 `obj.__proto__ = Fn.prototype`
- `Object()`构造函数指向的 `Object.prototype`为最终原型

> [原型和原型链](/FE-Language/ES/oop-3-prototype.html)

## P54: JS 中的编程俚语

也是指 JS 中的一些俚语

- 数据类型相关：类型强制转换（类型强转）、包装对象、装箱操作
- 逻辑运算符： 短路运算

> [数据类型详解](/FE-Language/ES/type-9-conversion.html)

## P75：理解并发

并发是指在共享资源的情况下，使两个或多个计算程序同时执行的能力。

并发只应用于那些对计算顺序不重要的情形。并发的程序间通信是显式的，要么通过消息传递，要么共享变量。

并发的优势是可以同时运行多个程序，应用程序不用等待耗时的任务而无法响应。

并发的劣势中常见的两个概念：
- 死锁：指两个互为先决条件的并发程序会无限制的互相等待，称为互锁
- 竞争条件：并发的执行不能保证执行顺序和返回时机，所以如果程序执行结果依赖于特定的执行顺序或时机时，将引发竞争条件。

另外，并发往往会比同步执行消耗更多资源。

## P76：JS 没有真正的并发

JS 没有真正的并发，因为它是单线程执行的。单线程的缺点是：
- 程序处理能力依赖计算机单个核心资源，即使其它核心资源处于空闲状态也无法利用
- 在浏览器宿主环境中，脚本在单线程中运行，还必须定期将单核心的资源让位给浏览器的界面渲染以维持页面的响应。

虽然 JS 没有真正的并发，但借助于宿主环境提供的能力，可以通过一些策略来模拟并发的效果。在 JS 编程术语中称为异步。

> JS 语言创建者 Brendan Eich 说过：“我绝不会把共享可变状态的抢占式调度线程加入到 JS 中”。某种情况下，鉴于当时的目标，就是要让 JS 保持简单，让非专业程序员快速上手，而不用面对死锁和竞争条件的问题。<br>注意异步、并发是不同的概念。

## P77：JS 事件循环

JS 语言用异步来模拟并发的效果，能让异步功能的实现核心就是 JS 采用了一种事件循环的策略。事件循环策略中有两上核心概念：
- 运行至完成 ( run-to-completion )
- 非阻塞输入/输出 (Non-blocking I/o)

**运行至完成**

运行至完成( run-to-completion )：指的是一旦 JS 开始执行一个任务，在这个任务完成前都不会被中断。新的任务必须是在上一个任务被完成后开始。这样的好处是可以完全确定每个任务运行结束后状态，这对有依赖关系的任务执行或程序分析很有帮助。

比如 JS 开始执行一个函数运行时永远不会被其它代码抢占，直到运行完成或中止（报错中止或主动退出return等）。这跟 C 有很大不同，C 语言中一个线程里运行的函数可能在任意时间点被暂停，然后运行另外一个线程的代码。

**非阻塞 I/O**

JS 实现非阻塞 I/O 的办法是使用 事件和回调。
- JS 使用一系列监听器来监听事件，这意味着输入的来源可以从很多地方同时到达。监听器允许事件平行展开。
- 事件完成后将之前注入的回调作为消息被放进一个消息队列排队等待 JS 依次执行。

所以JS 的非阻塞 I/O，简单说：通过监听器允许事件平行展开（同时触发），但是事件完成的消息通知（回调）需要排队等待执行，并且在执行某个回调过程中还不能被其它代码抢占，必须运行至完成才开始下一个回调。

> 事件循环中关于调用栈、执行桢、消息队列、宏任务、微任务的概念点击查看[深入事件循环]

强调：事件循环是一种让 JS 能模拟并发的策略，是由宿主环境提供资源让 JS 拥有异步执行的能力。并不是 JS 语言本身的语法特性。好比说是宿主环境搭建好了调用栈、执行桢、消息队列、宏任务、微任务等设施，并且要求 JS 代码要用回调的形式书写，异步流程才跑得起来。

但是到了现代 ES6 语法中，在语言语法层面实现了部分异步特性：Promise函数、Generator生成器函数、Async-await语法

## P85：生成器和协程

看完上面 JS 事件循环的介绍，你可能已经意识到了 早期 JS 事件循环的实现，存在两个问题，这两个问题刚好对应着它的两个核心概念：

- 运行至完成，导致的问题之一：当一个执行桢即一个任务执行时，无法在中途中断，只能等待完全完成或报错中止。
- 非阻塞 I/O，导致的问题之一：事件可以平等展开，但基于回调的方法无法预知回调何时被执行，或者说无法主动控制回调执行的先后。

所以在现代 ES6 语法中先是增加了Promise语法，从把回调函数放在宏任务，变成放在微任务，算是一个进步，但并没有很好解决上述两个问题。在后续的 Generator 生成函数语法引入后，才算解决了上述两个问题，让异步的执行顺序变得更可控。

异步和并发两种形式的关键之处在于控制流的执行。目前JS中已有的控制流机制有：
- 当前提条件满足时执行语句： while do-while
- 语句之间的条件分支： if-else
- 有条件的从一条语句继续到下一条语句：break continue
- **将执行流程移出一个上下文，稍后在预期的位置继续执行**： yeld

协程和生成器允许代码在执行过程中以指定的出入口暂停或恢复，这一概念在 ES6 语法中被引入。

- 生成器是可以允许遍历集合并保持集合内部状态不变的一种函数，主要用于简化迭代器的书写，在生成器中的 yield 语句中指定跳转到哪个协程，而是传递一个对象`{value,done}`返回给父程序。
- 协程可以暂停和恢复执行上下文的对象，通过协程可以控制暂停当前执行上下文，并让位给其它指定的执行上下文。所有协程有时被归为能协同调度的线程，因为它们可以共享单个线程执行。（进程 -> 线程 -> 协程）。

在许多语言中，协程和生成器是分开显式定义的。但在 JS 中，协程并没有成为语言的一个语法特性，而是被实现为一种模式，整合在了生成器语法中。 在 JS 中，协程是用于控制流的生成程，通过使用 yield 操作符暂停和恢复执行上下文的对象。


这样的结合，就让生成器和协程可以实现以下功能：
- 共享多个任务
- 任务的顺序处理
- 简单的状态机

1. 多个异步任务的顺序处理
```js
// 待补充
```


2. 简单的状态机
```js
const toggle = (function* () {
  while (true) {
    yield true
    yield false
  }
}())

for (let i = 0; i < 5; i++) {
  console.log(toggle.next().value)   // true false true false true
}
```

## P91：Web Worker

Web Worker 是可以在浏览器后台运行的 JS 进程。 Web Worker 是由浏览器创建，被浏览器上下文所控制。

Web Worker 适合解决不需要频繁从 UI 层获取消息的，计算密集的任务。

- 优势： 因为独立于UI层的线程运行，所以不占用UI层资源，让程序在响应上更快
- 劣势：因正因为独立于UI层，所以它们没有权限访问DOM或全局变量。

Web Worker 的两种形式：
- 专用型 ( dedicated Worker )
- 共享型 ( shared worker )

两者区别：
- 专用型只能访问它的创建者，而共享型没有这个限制
- 专用型的生命周期随创建者结束而结束，而共享型必须显式终止。

## P124：编程风格

> 你是为人编写代码，而不是为编译器编写 -- P126<br>

风格经常被用来作为质量的度量。好的编程风格必不可少的品质：

- 一致性

一致性能减少代码的噪声，一致性除了体现在命名约定、函数签名等如何编写上，也体现在个人编码习惯上前后的一致性。

- 表达能力

代码本质上是一种符号语言，其中可变性和抽象性是隐含的。所以你必须找到一种方法让通过代码将隐含的概念表现出来，而不是让读者通过注释去理解。比如可以通过表意的命名变量和函数来实现。

- 简洁

力争做到简洁就好了。好的编程就像好的写作一样，对目的明确表示，而不仅仅是紧凑。减少一个函数的复杂度，但不减少它的可用性。

- 约束性

在编程中，聪明致死，程序员必须约束自己，不要过分追求极致而留下难以理解和维护的源代码。

## P126：风格指南

编程风格应该从以下两方面去指导实践：视觉清晰度规则和计算有效性规则

- 视觉清晰度规则

  - 书写清晰并且表达力强：当命名变量、函数或组织代码的时候，记住要表达能力的品质，选择有意义的、表意的、描述性的名称。
  - 遵从语言惯例：在个人编码时应该让你的代码符合社区主流规范，在团队中遵从团队代码规范，但前提是不牺牲质量。
  - 清晰的代码强制关注点分离：比如函数单一职责原则等

  后面是书中列举的一些视觉一致性的规则，有些并不一定对，但要找到适合自己的，并长期遵从。

  - 变量统一声明在作用域顶部，或者声明在使用的位置，最后声明没有赋值的变量等。
  - 空白行：注释开始前留一个空白行，相关代码块之间留空白行
  - 空格：
  - 逗号
  - 分号
  - 方括号和大括号
  - 注释

- 计算有效性规则
  - 避免代码受操作上下文以及作用域的转变而带来破坏：比如保证源代码压缩、打包、发布时的执行结果不会带来不同
  - 让代码与浏览器无关：将业务逻辑代码和浏览器相关代码相互分离，避免浏览器升级带来的问题
  - 保持质朴的原型：避免改装内置原型的属性和方法，使得调用无法得到期望的标准值
  - 抵制 `eval() / with()`的使用。

  接着也是作者列举的一些保持计算性一致的规则
  - 严格相等和宽松相等
  - 函数声明和函数表达
  - 字量面
  - 强制转换：尽量使用显式转换，使代码更明了

  ## P139：风格的实施

  通过三层拦截实施代码检查：

  - 在 IDE 中，通过美化插件统一风格，如 EditorConfig + ESLint + prettier
  - 在本地 git hooks 中，通过 husky 与 lint-staged 
  - 在 CI 流程中，通过 npm run lint

  > [代码规范实施](https://mp.weixin.qq.com/s/xjkB2YCPl18CWVAJGSyF7A)<br>[ESLint 在中大型团队的应用实践](https://mp.weixin.qq.com/s/4l3YnI6U2iQuI_YsIr_utg

  ## P144：工作流

  1. 工作选择
  1. 脚手架生成统一的项目模板
  1. 开发
  1. 测试：单元测试、集成测试、性能测试、测试工具和套件
  1. 构建：编译、分析、打包、优化、测试、通知
  1. 部署
  1. 运维

## P167：代码质量

> 代码质量不是一利行为，而是一种习惯

对 JS 源代码的评估，体现在两种形式上：主观质量和客观质量

- 主观质量：依赖于个人的经验和技能的熟练度，比如，领域内顶尖的人总结形成的最佳实践。
- 客观质量：在一个循环回路不断应用、提炼出来的高质量指标，适合于算法、测试套件或工具类的代码。

> 蛋糕的质量不会依赖于面包师的天将，反面是成分的准确选择和计量

**质量度量的指标**

- 美观性：即前面代码风格中视觉清晰度的规则
- 完整性：即功能实现或需求是否满足
- 性能：符合性能指标
- 成本： 人效比
- 耐久性：程序运行的可靠性
- 可接受性：如何让另一个程序能快速接手代码

> 技术债务是一种隐喻，描述的是坏代码在时间、金猪和资源方面的成本增加，

**代码质量的实施**

- 静态代码分析：linter语言检测工具
- 代码复杂性：复杂性度量的指标
  - 过多的注释：源代码应该是自解释的，而不是通过注释来解释
  - 代码行数
  - 松耦合：如果一个对象很明显需要另一个对象的实现才能工作，这种现象称为紧密耦合，应该避免
  - 通过关注点分离，减少函数变量声明的混合
  - 函数参数：大于2个以上的参数，应该使用选项对象传入
  - 嵌套的深度：代码嵌套越深越复杂
  - 圈复杂度 P176
  - NPATH 复杂度 P178

**客观质量分析的工具**

- 复杂度报表 ( complex-report )
- 柏拉图 ( Plato )

## P190：测试谬论

这些部分讲解常人对测试存在的错误观念，每条更具体的的阐述见原文

> 测试可以用来表明 BUG 的存在，但不能表明不存在 BUG

1. 成功的测试证明程序中没有BUG
1. 成功的测试是那些完成的没有错误的错误
1. 测试确保程序是高质量的
1. 测试能防止未来的错误
1. 测试证明程序能像设计的那样工作

## P193: 确认偏见

确认偏见描述了这样一种现象：一个人比较喜欢和自己的世界观比较一致的信息，而选择忽视与其相反的证据信息。

关于下列每条“确认偏见”更详细的阐述见原文

1. 选择性看见：程序员和他们成果之间亲密的关系会阻碍他们对其作出诚实的评估，往往会选择看到他们打算运行的功能，而不是产品实际需要实现的功能。
1. 知识的诅咒：指程序员无力从一个不太了解的用户的角度来思考他们的软件
1. 没有错误的谬论：如果一开始你成功了，你觉得代码是健康的。但是测试没有发现BUG并不代表没有BUG，一旦一开始就成功了，你需要尝试、尝试、再尝试，排队不相关的原因导致测试通过。
1. 杀虫剂悖论：每一个你用来预防或发现 BUG 的方法都会留下微量的 BUG 残渣。就是杀虫剂杀了害虫，会留下微量的不健康的化学成分。
1. 缺陷群：BUG 就在其它 BUG 待的地方。BUG群揭示了程序员对程序这块关键区的误解
1. 框架偏见

缓解确认偏见
1. 失败的测试
1. 获取临界距离
1. 查找边界

## P195：测试覆盖率

当应用程序的所有路径被至少一个测试覆盖时，这个程序被认为是经过良好测试的。具有足够测试覆盖率的程序被认为较低可能性包含错误，通常作为 一种程序质量的度量。

测试覆盖率可以通过代码覆盖率工具自动计算，当测试运行时，覆盖率工具会追踪测试执行过程中程序的哪部分源代码被调用了，完成后会生成一份报告查看。

测试覆盖率的算法：
1. 语句覆盖
1. 函数覆盖
1. 分支覆盖
