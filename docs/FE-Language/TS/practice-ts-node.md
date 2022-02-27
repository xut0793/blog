# TS + Node 环境初始化

[[toc]]

依赖：
-   typescript
-   @types/node
-   tsconfig.json
-   ts-node
-   ts-node-dev
-   tslint
-   jest
-   vscode

## 1. 新建项目

```bash
mkdir ts-node-project
cd ts-node-project
npm init -y
mkdir src
cd src
touch index.ts
cd ..
```

上面命令运行后，项目的目录结构如下：

```
ts-node-project
├── src
│   └── index.ts
└── package.json
```

## 2. 安装 `typescript` 及 `@types/node`

```bash
cnpm i -D typescript
cnpm i -D  @types/node
```

将`typescript`安装到本地开发依赖。另外，安装 node 的声明文件到本地开发依赖中`@types/node`

## 3. 新建并配置 `tsconfig.json`

```bash
touch tsconfig.json
```

配置内容如下代码，配置 tsconfig.json 教程见上一篇。具体配置选项见[官网-配置选项](https://www.tslang.cn/docs/handbook/compiler-options.html)

```json
{
	"compilerOptions": {
		"strict": true,
		"outDir": "./dist/",
		"rootDir": "./src/",
		"target": "ES6",
		"module": "commonjs",
		"moduleResolution": "node",
		"esModuleInterop": true,
		"noEmitOnError": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"sourceMap": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules"]
}
```

## 4. 创建 httpServer 代码并运行

在`index.ts`中写入以下代码：

```ts
import http, { IncomingMessage, ServerResponse } from 'http'

const HOST: string = 'localhost'
const PORT: number = 3000

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
	res.end('Hello World from Typescript')
})

server.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`)
})
```

在命令行中运行以下命令：

```bash
tsc
```

```bash
node dist/index.js
```

项目正常运行，可在浏览器中输入`localhost:3000`查看输出。

将上面命令写进项目配置文件`package.json`的`script`字段：

```js
"start": "tsc && node dist/index.js",
```

重新输入以下命令，一样可以启动服务器。

```bash
npm start
```

但是像上面这两种，每次开启服务，都要先经 tsc 命令将 ts 编码成 js 代码（生成 dist 文件夹，并生成 index.js 文件），然后执行编译后的 js 代码，在实际开发中这是非常麻烦不理想的方法。所以我们还要进行如下配置。

## 5. 安装 `ts-node`

因为 ts 是建立在 js 的基础之上的，但是 node 又不能直接运行 ts 代码，实际使用是往往需要使用 tsc 将 ts 代码编译成 js 代码，这无疑是很麻烦的。

而 ts-node 则包装了 node，它可以直接的运行 ts 代码，在项目开发中可以不将 ts 编译成 js，而直接将 ts 代码在其内置环境中运行。使用起来很方便，具体命令行选项见它的[官方仓库](https://github.com/TypeStrong/ts-node)

我们选要安装它：

```bash
cnpm i -D ts-node
```

完成后直接使用：（先将项目中`dist`文件夹删掉）

```bash
npx ts-node src/index.ts
```

可以看到，我们的服务器也可以正常运行，并且没有生成新的`dist`文件夹及`index.js`文件。

修改 index.ts 内容中输出内容：

```ts
res.end('Hello World start ts-node')
```

使用`ctrl + c`两次，中断服务器运行，输入`npx ts-node src/index.ts`，重新开启服务器，刷新浏览器可以看到内容更新。

但又出现的新问题是，我们不希望在开发中每次修改了代码都要断开服务器然后重新开启服务器。我们希望像 node 开发的插件包`nodemon`一样，运行的服务器自动更新修改的内容。

## 6. 安装 `ts-node-dev`

`ts-node-dev`是同`nodemon`一样的功能。安装它为本地开发依赖：

```bash
cnpm i -D ts-node-dev
```

使用它：

```
npx ts-node-dev src/index.ts
```

此时服务器重新启动，我们修改下 index.ts 的内容后保存，可以看到终端命令行，做到了自动重新编译。

最终我们修改`package.json`的启动内容：

```json
"start": "ts-node-dev src/index.ts",
```

## 7、总结

```bash
# 初始化项目
mkdir ts-node-project
cd ts-node-project
mkdir src
cd src
touch index.ts
cd ..
npm init -y

# 安装依赖
cnpm i -D typescript @types/node ts-node ts-node-dev

# 添加tsconfig.json
touch tsconfig.json

# 添加启动命令
"start": "ts-node-dev scr/index.ts"
```

后续其它的配置工作参照正常工程：

-   测试： 安装 jest @types/jest，配置 jest.config.js
-   格式： 安装 tslint，配置 tslint.json
