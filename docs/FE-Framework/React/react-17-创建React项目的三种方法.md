# react-17: 如何从零开始创建 React 项目
<!--
 * @Author: Tom xu
 * @LastEditors: Tom xu
 * @createTime: 2019-09-25 08:40:38
 * @LastEditTime: 2019-09-27 08:35:11
 * @Description:
 -->


参考链接
[如何从零开始创建 React 项目（三种方式）](https://www.jianshu.com/p/68e849768d8e)
[阮一峰：npx 使用教程](http://www.ruanyifeng.com/blog/2019/02/npx.html)

本章之前的所有学习`Demo`都是在 HTML 中演示的。这种形式只适合于刚学习`React`的基本语法。在实际项目开发中，往往需要配合前端工程化的各种工具来进行搭建项目框架。

-   使用`webpack`来组织并管理资源模块
-   使用`React Router`来管理页面路由
-   使用`Redux`来管理页面数据状态
-   使用`Axios`和`GraphQL`来请求后端数据接口
-   使用`Jest`来进行单元测试
-   使用`node` `Express`等在服务端同构`React`应用。

上面一起构成了`React`技术栈（`React`全家桶）。

现在的前端工程化使得前端项目的创建也变得越来越复杂，在项目开始前最关键的当然是项目如何创建？

在这里介绍三种从零开始创建 React 项目的方式，分别是：

-   在浏览器中直接引入`CDN`文件或本地`js`文件
-   使用`Webpack`创建。
-   使用官方脚手架`create-react-app`

## 浏览器中通过标签直接引入

`React`框架有两个核心的包，分别是`react`以及浏览器端的`react-dom`，如何想直接在浏览器中使用`React`，那么把这两个包直接引入就可以了。

```html
<!-- 引入react -->
<script
    src="https://unpkg.com/react@16/umd/react.development.js"
    crossorigin
></script>
<!-- 引入react-dom -->
<script
    src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    crossorigin
></script>
```

如果想要使用 JSX 语法和 ES6 及 ES next 语法，那么必须引入`Babel`转译器。

```html
<!-- 引入Babel,使浏览器可以识别JSX语法，如果不使用JSX语法，可以不引入 -->
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

如果引入了`Babel`，那么在`script`的类型需要标注为`type="text/babel"`

```html
<script type="text/babel">
// 必须添加type="text/babel",否则不识别JSX语法
// 自定义代码逻辑
</script
```

当然你也可以将以上`react` `react-dom` `babel`的代码下载下来，存在本地的 js 文件中导入项目。

```
|- project_name
   |- index.html
   |- jsx
      |- HelloReact.jsx
   |- lib
      |- babel.js
      |- react.js
      |- react-dom.js
```

```html
<!-- 引入react -->
<script src="./lib/react.js"></script>
<!-- 引入react-dom -->
<script src="./lib/react-dom.js"></script>
<!-- 引入Babel,使浏览器可以识别JSX语法，如果不使用JSX语法，可以不引入 -->
<script src="./lib/babel.js"></script>
```

完整的示例：HelloReact

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Hello React</title>
        <!-- 引入react -->
        <script
            src="https://unpkg.com/react@16/umd/react.development.js"
            crossorigin
        ></script>
        <!-- 引入react-dom -->
        <script
            src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
            crossorigin
        ></script>
        <!-- 引入Babel,使浏览器可以识别JSX语法，如果不使用JSX语法，可以不引入 -->
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>

    <body>
        <div id="app"></div>
        <script type="text/babel">
            // 必须添加type="text/babel",否则不识别JSX语法
            class App extends React.Component {
                render() {
                    return (
                        <div>
                            <h1>Hello World</h1>
                        </div>
                    )
                }
            }
            ReactDOM.render(<App />, document.getElementById('app'))
        </script>
    </body>
</html>
```

浏览器引入的方式在刚开始学习`React`基本概念的时候可以使用这种方式，方便我们快速演示`React`示例。在实践项目开发中是不会使用这种方式的。

## 使用`Webpack`从零搭建项目。

`node`和`npm`是前端工程化的基石,一般安装`node`会自带安装`npm`，所以首先要确保电脑上安装有`node`，主要两步骤：

-   `node`官网下载稳定版，运行安装程序
-   配置环境变量

具体查看如下参考资料：
[Node.js 安装及环境配置之 Windows 篇](https://www.cnblogs.com/xinaixia/p/8279015.html)

### 1.初始化项目

```js
// 1. 选择一个项目存放路径，然后新建项目文件react-project
mkdir react-project
// 2. 进入项目文件夹
cd react-project
// 3. 初始化项目信息npm init 如果都默认则 npm init -y。会产生一个package.json项目文件
npm init
```

此时项目目录

```
|- react-project
    |- package.json
```

### 2.安装项目依赖

#### 1. 安装 React 核心包作为项目生产依赖`react` `react-dom`

```js
npm install react react-dom -S
```

此时项目文件中会自动创建一个`node-modules`的文件夹，用来存放项目安装的所有包文件

> **npm install 命令的参数区别：**
> 不加参数：直接`npm install <pkg>`会将包安装在本地项目中，但包的相关信息不会被写入 package.json 配置文件中，所以后续别人重写启动项目，会提示未安装对应的依赖包。
> ---save-dev(-D)： 安装的 npm 包仅作为开发依赖。在最终打包的时候不会被包括到源码里去，包的版本号信息会写在 package.json 文件的 devDependencies 中。所以类似 bebel 和 webpack 这种进行项目工程构建或者代码编译的库应该用--save-dev 来安装。
> --save(-S)： 则是安装代码运行必须的库,即生产依赖包，包的版本号会写在 package.json 文件中的 dependencies 中在最终打包的时候会被包括到源码中，比如 react 等。

#### 2. 安装 Babel 转译 ES 语法和 JSX 语法

最开始的 babel 是用来把 es6 的代码编译成 es5 的代码，让前端开发者在使用新的特性的同时不必考虑浏览器兼容问题。虽然现在的主流浏览器已经支持大部分的 es6 的新特性，但是因为 JavaScript 每年都会有一些新的特性被提出，而浏览器不一定能在特性推出后及时实现，或者是有一些还在实验中的语法。使用来 babel 后可以忽略新语法在浏览器的兼容问题，可以放心使用新的 JavaScript 语法，甚至是实验性的语法。

另外，Babel 被设计成可扩展的，安装预设对应的插件就可以转译对应语法，所以在 React 中使用 JSX，也需要 Babel 及相关 JSX 语法的预设插件。

```
- @babel/core                // babel的核心库，必须安装
- @babel/preset-env         // 帮助我们把es next的语法编译成es5的语法
- @babel/preset-react       // 帮我们转译JSX语法
- babel-loader              // 将我们的经过babel处理后的代码进行输出成浏览器可以识别的文件。
```

```js
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```

在安装成功后必须进行 babel 的配置，在根目录 React-project 建立 `.babelrc` 文件，然后写入以下配置:

```js
{
    "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

#### 3. 安装 webpack 进行模块引用管理

```js
npm install webpack webpack-cli webapck-dev-server --save-dev
```

同样，我们需要进行 webpack 配置，在项目根目录下 React-project 新建 webpack.config.js 文件，然后写入以下配置：

```js
const path = require('path')

module.exports = {
    entry: './src/index',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}
```

配置完之后，我们需要在根目录下新建 index.html，在./src 目录下新建 index.js、App.js,此时我们的项目的所有文件都创建完毕，项目结构应该如下所示：

```
|- project_name
    |- node-modules
    |- src
        |- main.js
        |- App.js
    |- index.html
    |- babel.config.js
    |- webpack.config.js
    |- package.json
```

#### 4. 启动项目

```
// 在项目根目录下，启动cmd，输入
webpack-dev-server --open
```

一般都是在 package.json 配置启动命令

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --open"
},
```

> 在这里如果使用`start`，则可以直接运行`npm start`命令启动项目。但也有人喜欢用`dev`命名，此时需要运行`npm run dev`命令。

上面是一个练习配置，实际项目的配置可以在此基础上扩展，比如对 webapck 的配置会更复杂，以及安装其它辅助的开发依赖插件等。

## 使用`React`官方脚手架`create-react-app`，开箱即用。

1. 第一步，先全局安装`create-react-app`

```js
npm i -g create-react-app
```

2. 第二步，使用脚手架创建项目

```js
create-react-app react-demo
```

3. 第三步，启动项目

```js
// 项目创建结束，按提示进入项目根路径，启动项目
cd create-demo
npm start
```
