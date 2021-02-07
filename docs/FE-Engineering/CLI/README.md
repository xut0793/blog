# 脚手架 CLI

现在前端工程化的基建工具都是运行在 Node.js 中使用。所以基于 node 很多便利的库来方便在 node 命令行中进行交互。

现在前端项目基本使用 CLI (Command Line Interface: 命令行界面)来自动完成，俗称“脚手架”。
> 借鉴建筑工程中的脚手架概念：脚手架(scaffold) 指保证各施工过程顺利进行而搭设的各种支架平台，主要方便施工现场的工人操作。

与 CLI 命令行操作，主要就是 I/O 功能，即输入输出。
- 输入：主要关注两个方面：
  1. 输入交互；
  2. 解析输入的内容，主要输入了什么命令，该命令附带输入哪些参数。
- 输出: 主要关注输出样式：console  chalk.js color.js

所以来看下 Node 为命令行提供的 I/O 功能如何操作

## 输出：Node

我们先看较为简单的输出功能。在 Node 中主要依赖于 `console` API。它基本上与浏览器中的 `console` 对象相同，但存在细微差别，刚好就是这里要提的输出着色。

作为输出内容最基础和最常用的就是 `console.log()`，默认输出字符串，但是可以通过传入占位符进行参数替换。

> 这些点位符在其它 API 也是通用的。console.log / info / debug / warn / error
- %s 会格式化变量为字符串
- %d 会格式化变量为数字
- %i 会格式化变量为其整数部分，可以限制输出位数，使用先导0填充。
- %f 会格式化变量为浮点数，支持限制输出小数位数。
- %o 会格式化变量为对象，在审阅器点击对象名字可展开更多对象的信息（浏览器）

```js
var obj = { str: "Some text", id: 5 };
console.log(obj); // {str:"Some text", id:5}
console.log("Foo %.2d", 1.1) // Foo 01
console.log("Foo %.2f", 1.1) // Foo 1.10
```
### 输出内容着色

1. 在浏览器开发者工具终端输出可以使用 `%c` 来点位颜色内容，其中的 `c` 可以理解为 `css` 或 `color`。
> [MDN console](https://developer.mozilla.org/zh-CN/docs/Web/API/Console#Outputting_text_to_the_console)
```js
// %c 指令前的文本不会受到影响，但指令后的文本将会使用参数中声明的 CSS 样式。
console.log("This is %cMy stylish message", "color: red; font-style: italic; background-color: blue;padding: 2px")
```

2. 在 Node 的终端下输出颜色不支持使用 `%c`，而是通过使用[ANSI转义代码(一组标识颜色的字符)]()来为文本着色。
> [<计算机知识>：ANSI转义序列以及输出颜色字符详解](https://www.cnblogs.com/xiaoqiangink/p/12718524.html),ANSI转义代码是标准的，在不同平台下都可以使用。
```js
console.log('\x1b[33m%s\x1b[0m', '你好') // 输出黄色的字体，这个在浏览器端也生效。
```
```sh
# ANSI 颜色转义字符
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
```

可以看出在 NODE 中输出进行着色是比较底层的方法，实际使用不方便。所以常见的作法是使用封装后的专用库：
- chalk 15k stars
- colors 2.9k stars
- cli-color 500 stars

```js
// Chalk
const chalk = require('chalk');
console.log(chalk.red('Text in red'));

// Colors
const colors = require('colors');
console.log('Text in red'.red);

// cli-color
const clc = require('cli-color');
console.log(clc.red('Text in red'));
```

因为 vue-cli 使用 `Chalk` 库，所以了解下它的用法

3. Chalk

Chalk 主要支持为文本设置： 样式、颜色、背景色 三部分，支持链式设置。
> [github Chalk](https://github.com/chalk/chalk)

语法：`chalk.<style>[.<style>...](string, [string...])`

```js
const chalk = require('chalk');
const log = console.log;

// 字体颜色
log( chalk.red("红色") ) 
​
// 字体背景色
log( chalk.bgBlue("蓝色背景") )  
​
// 字体样式
log( chalk.bold("加粗") )
​
// 传入多参数
log( chalk.blue("name", "age", "job") )
​
// 样式组合
log(` colors: ${chalk.blue('blue')}, ${chalk.red('red')} `) // 拼接
​
log(chalk.red.bold.underline('Hello', 'world');) // 链式组合
​
log( chalk.bgYellow(` error: ${chalk.red(" chalk is undefined ")} `) ) // 嵌套

// 其他颜色设置方式
log(chalk.keyword("orange")(' keyword ')) // 关键字
log(chalk.rgb(100, 100, 100)(' rgb ')) // rgb
log(chalk.hex('#ffffff')(' hex ')) // hex


// ES6 多行文本形式，多行文本将保留缩进格式
log(
 chalk.blue(`
  name: Rogan
  age: ${25}
  job: ${ 'IT' }
 `)
)
​
// 自定义组合
const error = chalk.bgRed;
const warning = chalk.yellow.bold;
console.log(error('Error!'));
console.log(warning('Warning!'));

// 利用 console 占位符
const name = 'Sindre';
console.log(chalk.green('Hello %s'), name);
//=> 'Hello Sindre'
```
## 输入：1.交互式输入

从版本 7 开始，Node.js 提供了 `readline` 模块来执行以下交互输入操作：每次一行地从可读流获取输入，例如 process.stdin 流，在 Node.js 程序执行期间该流就是终端输入。
> [node readline](http://nodejs.cn/api/readline.html)
```js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`你叫什么名字?`, name => {
  console.log(`你好 ${name}!`)
  readline.close()
})
```
`readline` 一旦调用，Node.js 应用程序将不会终止，直到显式执行关闭readline.close() 或程序引起 readline.Interface 关闭，如报错，Ctrl+c 等，因为接口在 input 流上等待接收数据。

### readline.interface 对象

1. 主要事件
  - line: 每当 input 流接收到行尾输入（\n、 \r 或 \r\n）时就会触发 'line' 事件。 这种情况通常发生在当用户按下 Enter 或 Return。监听回调函数入参是接收到的那一行输入的字符串。
  - close: 监听停止事件。以下任一情况会导致停止：
    1. 调用 rl.close() 执行时；
    2. 收到 Ctrl+C 以发信号 SIGINT，并且 readline.Interface 实例上没有注册 'SIGINT' 事件监听器时；
    3.接收到 Ctrl+D 以发信号传输结束（EOT）；
    4. input 流接收到其 'end' 事件。
  - pause: 监听暂停事件。1. 调用 rl.pause() 方法时；2. 接收到 'SIGCONT' 事件时。
  - resume: 每当 input 流恢复时，就会触发 'resume' 事件
  - SIGCONT： Windows 上不支持 'SIGCONT' 事件。
  - SIGINT：接收到 Ctrl+C 输入（通常称为 SIGINT）时，就会触发 'SIGINT' 事件。
  - SIGTSTP：接收到 Ctrl+Z 输入（通常称为 SIGTSTP）时，就会触发 'SIGTSTP' 事件。
1. 主要方法
  - rl.prompt(): 方法将 readline.Interface 实例配置的提示写入 output 中的新一行，以便为用户提供一个可供输入的新位置。
  - rl.setPrompt([string])： 设置每当调用 rl.prompt() 时将写入 output 的提示符。
  - rl.question(query:string, callback:(input)=>{}): 通过将 query 写入 output 来显示它，并等待用户在 input 上提供输入，然后调用 callback 函数将提供的输入作为第一个参数传入
  - rl.close()：关闭 readline.Interface 实例，并放弃对 input 和 output 流的控制。 当调用时，将触发 'close' 事件。
  - rl.pause()：暂停 input 流。
  - rl.resume(): 方法将恢复已暂停的 input 流。


实现一个微型 CLI：输入原样输出，遇到 hello 加 world 输出。
```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '请输入> '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`你输入的是：'${line.trim()}'`);
      break;
  }
  rl.prompt();
})

rl.on('close', () => {
  console.log('再见!');
  process.exit(0);
});
```

### Inquirer.js

使用原生 readline 模块交互输入对复杂场景使用不方便，所以在开发 cli 时常使用第三方库，提供更为友好的 API，和更强大的功能。

[inquirer.js](https://github.com/SBoudrias/Inquirer.js) 就是一个比较流行的替换 `readline` 功能的库。提供了一个漂亮的界面和提出问题流的方式。

- 提供错误回调
- 询问操作者问题
- 获取并解析用户输入
- 检测用户回答是否合法
- 管理多层级的提示

语法：`inquirer.prompt(questions) -> promise`
```js
var inquirer = require('inquirer');
inquirer
  .prompt([
    /* Pass your questions in here 预设的问题列表 */
  ])
  .then(answers => {
    // Use user feedback for... whatever!! 用户输入的回答内容
  })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment 提示符无法在当前环境中呈现
    } else {
      // Something else went wrong 其它错误捕获
    }
  });
```
一个简单的例子：
```js
var inquirer = require('inquirer')
inquirer.prompt([
  { 
    type: 'confirm', 
    name: 'test', 
    message: '你觉得自己是帅哥嘛?', 
    default: true 
  }
]).then((answers) => { console.log('结果为:') console.log(answers)})
```

1. Questions —— 问题

问题的标题和默认结果值都是可以预设的。而在回答完成后会返回一个Promise对象，在其then方法中可以获取到用户输入的所有回答。

其中传递给 prompt 方法的参数为一个 question 问题数组，数组中的每个元素都是一个问题对象。其包含的属性共有以下几种：

```js
// 问题对象
{ 
  type: String,                             // 表示提问的类型，可选的值: input, number, confirm, list, rawlist, expand, checkbox, password, editor
  name: String,                             // 在最后获取到的 answers 回答对象中，作为当前这个问题的键
  message: String|Function,                 // 打印出来的问题标题，如果为函数的话 
  default: String|Number|Array|Function,    // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。 
  choices: Array|Function,                  // 给出一个选择的列表，假如是一个函数的话，第一个参数为当前问题的输入答案。为数组时，数组的每个元素可以为基本类型中的值。 
  validate: Function,                       // 接受用户输入，并且当值合法时，函数返回true。当函数返回false时，一个默认的错误信息会被提供给用户。 
  filter: Function,                         // 接受用户输入并且将值转化后返回填充入最后的 answers 对象内。
  transformer: Function,                    // 接受用户输入并返回一个转换后的值显示给用户。与 filter 不同，转换只影响显示内容，不会修改 answers 对象的值。
  when: Function|Boolean,                   // 接受当前用户输入的 answers 对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。 
  pageSize: Number,                         // 改变渲染list,rawlist,expand或者checkbox时的行数的长度。
  prefix: (String),                         // 更改默认 message 输出的前缀。
  suffix: (String),                         // 更改默认 message 输出的后缀。
  loop: (Boolean),                          // 是否开启列表循环. 默认值: true。
}
```
2. Answers —— 回答

Answers是一个包含用户客户端输入的每一个问题答案的对象： k-v 键值对。
- key: 键是问题对象的 name 属性值
- value: 值是取决于问题的类型，confirm类型为Boolean，Input类型为用户输入的字符串，rawlist和list类型为选中的值，也为字符串类型。

3. Separator —— 分隔

可以为任意的 choices 数组选项添加分隔，方便在多选项时划分选项类别。

`inquirer.Separator()` 构建函数接受传入一个字符串作为分隔符，缺省时默认 -------
```js
// In the question object
choices: [ "Choice A", new inquirer.Separator(), "choice B" ]

// Which'll be displayed this way
[?] What do you want to do?
 > Order a pizza
   Make a reservation
   --------
   Ask opening hours
   Talk to the receptionist
```

4. Prompt types —— 问题类型

- List：{type: 'list'}，属性：`type, name, message, choices[, default, filter, loop]` ，即问题对象中必须有 type, name, message, choices 等属性，其它可选。同时，default选项必须为默认值在choices数组中的位置索引(Boolean)
- Raw list：{type: 'rawlist'}，与List类型类似，不同在于，list 打印出来为无序列表，而 rawlist 打印为有序列表
- Expand：{type: 'expand'}，属性：`type, name, message, choices[, default]`，同样是生成列表，但是在 choices 属性中需要增加一个属性：key，这个属性用于快速选择问题的答案。类似于 alias 或者 shorthand 的东西。同时这个属性值必须为一个小写字母
- Checkbox：{type: 'checkbox'}，属性：`type, name, message, choices[, filter, validate, default, loop]`，其余诸项与 list 类似，区别在于，是以一个 checkbox 的形式进行选择。同时在 choices 数组中，带有 checked: true 属性的选项为默认值。
- Confirm：{type: 'confirm'}，属性：`type, name, message, [default]`，提问，回答为 Y/N。若有 default 属性，则属性值应为 Boolean 类型
- Input：{type: 'input'}，属性：`type, name, message[, default, filter, validate, transformer]`，获取用户输入字符串
- Number: {type: 'number'}，属性：`type, name, message[, default, filter, validate, transformer]`，获取用户输入字符串
- Password：{type: 'password'}，属性：`type, name, message, mask,[, default, filter, validate]` ，与input类型类似，只是用户输入在命令行中呈现为 XXXX
- Editor：{type: 'editor'}，属性：`type, name, message[, default, filter, validate] `终端打开用户默认编辑器，如vim，notepad。并将用户输入的文本传回

例子参考：[交互式命令行美化工具——inquirer.js](https://www.jianshu.com/p/0409cdf0e396)
## 输入：2.解析命令行输入内容

在 Node 中使用命令行命令时，可以传入任意数量的参数，参数可以是独立的，也可以具有键和值。

```sh
node app.js a b=value c
```
那在应用程序内如何获取命令行提供的参数呢？

使用 Node.js 中内置的 `process.argv` 对象属性可以获取参数值，返回一个数组中包含传入的参数。

```js
// argstest.js
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
```sh
node test.js a=1 b=2 c d
```
```js
// 输出
0: D:\nodejs\node.exe
1: E:\develop\test\argstest.js
2: a=1
3: b=2
4: c
5: d
```
其中 ：
- `process.argv[0]` 表示当前 node 可执行文件(node.exe) 所在路径，通常情况下，也要以使用 `process.execPath`和`process.argv0`获取。但注意`process.argv0`稍有差异。
- `process.argv[1]` 表示正被执行的 JavaScript 文件的路径。
- 其余为传入的参数，以空格为边界输出。

`process.argv` 要特别区分`process.execArgv`：
`process.execArgv` 属性返回当 Node.js 进程被启动时，Node.js 特定的命令行选项。 这些特定的选项不会在 `process.argv` 返回的数组中出现。
同样的，`process.execArgv` 也不会包含 Node.js 的可执行脚本名称后面出现的非特定选项。
```sh
node --harmony script.js --version
```
```js
console.log(process.execArgv) // 输出 ['--harmony']
consoe.log(process.argv) // 输出 ['D:\nodejs\node.exe', 'E:\develop\test\argstest.js', '--version']
```

总结：
- node 命令行输入参数会存入 `process.argv` 数组中，且从数组第三项开始。第一项为node可执行文件路径，第二项为当前被执行文件的路径。
- node 命令行上特定命令参数和自定义命令参数区别：`process.execArgv` 和 `process.argv`。

所以可以看到，应用程序中对传入命令行参数使用时还需要进行解析。比如接受到的 `a=1`，需要转换成对象键值对 `{a:1}`。如果不想自己实现参数解析，也可以使用第三方库。

- minimist: 由 James Halliday 于2013年6月开发，功能极简的解析参数的库，适合用于应用程序内部
- optimist：由James Halliday 于2010年12月 撰写的，模仿 Python 的 optimist 项目
- commander.js： 由 TJ Holowaychuk 于2011年8月开发，tj 是 Node.js 大神，co 的作者, commander.js 源自 ruby 的 commander 项目，作者也是 tj
- nopt： npm 项目中使用
- nomnom：由Heather Arthur 于2011年4月开发，不再维护，不建议使用
- yargs：2013年11月，更为现代的主流库，optimist 的继承者。

除 `minimist` 外，其它几个功能较为全面，除解析参数功能外，都自带 cli，提供自建命令、命令解析器等功能。一般应用程序内仅是处理输入参数可以使用 `minimist` 库，如果开发独立 cli 脚手架可以使用 commander.js 或 yargs.js 库。
> [Comparing commander vs. minimist vs. nomnom vs. optimist vs. yargs](https://npmcompare.com/compare/commander,minimist,nomnom,optimist,yargs)

```js
const args = require('minimist')(process.argv.slice(2))
args['name'] //joe
```
此类库都是一个约定成俗的规则，每个参数名称之前使用双破折号：
```sh
node app.js --name=joe
```

因为 vue-cli 内部使用 commander.js ，所以这里介绍 commander.js 用法。
> 关于 yargs 可以参考：[从零开始打造个人专属命令行工具集——yargs 完全指南](https://linux.cn/article-7725-1.html)

### commander.js

> [Commander.js 中文](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)

```sh
# 安装
npm install --save commander
```
使用时，`Commander` 提供了一个全局对象 `program` 来调用各种 API。
```js
const { program } = require('commander');
program.version('0.0.1');

// 如果程序较为复杂，用户需要以多个独立实例对象来使用 Commander，如单元测试等。可以创建本地 Command 对象：
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');
```
1. 解析参数： `parse()`

`program.parse(argArr, from)` 第一个参数是要解析的字符串数组，第二个参数中传递 from 选项，主要用于解析自定义参数时。

如果参数遵循与 node 不同的约定时，可以传入第二个参数来指定参数解析规则：
- 'node': 默认值，`argv[0]`是 node 应用路径，`argv[1]`是要跑的脚本文件路径，后续为用户参数，与 process.argv 返回组件一致。
- 'electron': `argv[1]`根据 electron 应用是否打包而变化；
- 'user': 来自用户的所有参数。

```js
program.parse(); // 全都省略时，第一个参数是 process.argv, 第二个参数是 node
program.parse(process.argv); // 此时第二个参数是 node
program.parse(['-f', 'filename'], { from: 'user' }); // 自定义参数解析
```
解析参数完成后，如果获取参数的值呢？


2. 获取参数

Commander 默认将选项挂载在 program 对象对应的同名属性上。

```js
// cmd-demo.js
program
 .option('-s, --small', 'small pizza size')
 .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(); // 要在 option 定义之后调用

if (program.small) console.log('pizza size: ', program.small);
if (program.pizzaType) console.log(`pizza type: ${program.pizzaType}`); // 短横线连接的多个单词参数，key 使用小驼峰获取。
```
此时在 node 终端上执行
```sh
node cmd-demo.js -s -p=cheese
```
如果想像独立命令那样调用，可以在项目根目录建立 package.json 文件，添加 bin 字段：`bin: './cmd-demo.js'`，然后在项目根目录下执行 `npm link`之后，可以像下面这样执行：
```sh
cmd-demo -s -p=cheese
```

#### commander.js 的 API

- `version('x.y.z')`: 用于设置命令程序的版本号 
- `option('-n, --name <name>', 'your name', fn, 'GK')`: 参数选项定义：
  - 第一个参数是选项定义，分为短定义和长定义。用`| , 空格` 连接
  - 选项参数可以用`<>`必填参数，或者`[]`可选参数，或者 `...` 变长参数 来修饰。变长参数可以在命令行输入多少参数，并用数组形式存储为值，通过`--`标记当前变长参数的结束。
  - 第二个参数是选项参数的描述
  - 第三个参数如果是函数，则作为自定义选项函数，该函数接收两个参数：用户新输入的参数和当前已有的参数（即上一次调用自定义处理函数后的返回值），返回新的选项参数。
  - 第四个参数：可以是选项参数的默认值，如果第三个选项参数作为最后一个参数，且是字符串且，则作为默认值。
- `requiredOption('-c, --cheese <type>', 'pizza must have cheese')`：必填选项。必填选项要么设有默认值，要么必须在命令行中输入，对应的属性字段在解析时必定会有赋值。该方法其余参数与.option一致。
- `command('init <path>', 'description')`: command 的用法稍微复杂，原则上他可以接受三个参数，第一个为命令定义，第二个命令描述，第三个为命令辅助修饰对象。
  - 第一个参数中定义子命令名称和参数，参数可以使用`<>`或者`[]`修饰
  - 第二个参数可选。
    - 当没有第二个参数时，commander.js将返回Command对象，若有第二个参数，将返回原型对象。
    - 当带有第二个参数，并且没有显示调用action(fn)时，则将会使用子命令模式。（所谓子命令模式即，./pm，./pm-install，./pm-search等。这些子命令跟主命令在不同的文件中）
  - 第三个参数一般不用，它可以设置是否显示的使用子命令模式。
- `description('command description')`: 设置命令描述，写入一段描述字符串。
- `action(fn)`: 设置命令执行的相关回调。
  - fn 函数接受的参数为命令定义时所声明的所有参数，顺序与`command()`中定义的顺序一致，并且最后还会附加一个额外参数：该命令自身实例对象。

```js
const program = require('commander');

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmdObj) { 
    // dir 为 <dir> 声明的参数， cmdObj 即 rm 命令对象, 即 program，可以对象上获取自身的选项参数 cmdObj.recursive
    console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''))
  })

program.parse(process.argv)
```
正常定义了命令的之后，`-h --help`是会默认添加的参数，并且有默认的帮助信息输出格式。

如果需要自定义输出信息相关的内容，可以使用以下 API 定义：

- `name("my-command")`: 定义命令调用名称，主要用于输出帮助信息时首行显示，name 属性也可以从参数中推导出来。
- `usage("[global options] command")`: 输入一个字符串，简要说明命令使用方式，会在打印命令帮助信息时首行输出。
- `helpOption(flags, description)`：自定义帮助选项和描述。

#### 避免选项命名冲突

Commander 默认将选项存储在 program 的对应的同名属性上，自定义处理函数也支持传递一个将选项值作为属性存储的 command 对象。这样的方式带来了极大的方便，但可能会导致与 Command 对象的属性冲突。

有两种方法可以修改这种方式，并且在未来我们有可能会调整这个默认的方式：

- storeOptionsAsProperties: 是否将选项值作为 command 对象的属性来存储，或分别存储（设为false）并使用.opts()来获取；
- passCommandToAction: 是否把 command 对象传递给操作处理程序，或仅仅传递这些选项（设为false）。

```js
program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false);

program
  .name('my-program-name')
  .option('-n,--name <name>');

program
  .command('show')
  .option('-a,--action <action>')
  .action((options) => {
    console.log(options.action);
  });

program.parse(process.argv);

const programOptions = program.opts();
console.log(programOptions.name);
```

#### 事件监听

你可以通过监听 --help 来控制 -h, --help 显示任何信息。一旦调用完成， Commander 将自动退出，你的程序的其余部分不会展示。例如在下面的 “stuff” 将不会在执行 --help 时输出。
```js
program.on('--help', function(){
  console.log('');
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});

program.parse(process.argv);

console.log('stuff');
```
要想代码调用显示帮助信息，而不是通过监听，可以使用 `help(cb)`，但该方法和 `--help`事件监听一样，回调执行完毕后退出进程
```js
if (!process.argv.slice(2).length) {
  program.help(make_red);
}

function make_red(txt) {
  return colors.red(txt); // 在控制台上显示红色的帮助文本
}
```
要想不退出显示帮助信息，可以使用 `outputHelp(cb)`
```js
if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
  }

function make_red(txt) {
  return colors.red(txt); // 在控制台上显示红色的帮助文本
}
```

另外还可以监听未定义命令的捕获：
```js
// 未知命令会报错
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});
```
也可以对某个命令的选项参数进行监听，执行相应的回调
```js
// 当有选项verbose时会执行函数，比如：cmd --verbose
program.on('option:verbose', function () {
  process.env.VERBOSE = this.verbose;
});
```


## 总结

- 解析输出: console.log =>  chalk.js
- 解析输入：readline => inquirer.js
- 解析输入的命令行参数: process.argv => commander.js

## 参考链接

- [npm脚手架开发学习](https://www.jianshu.com/p/dec0eefa0e07)
- [基于node.js的脚手架工具开发经历](https://juejin.im/post/6844903526947110919)