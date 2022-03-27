# vite

Vite 是一种新型前端构建工具，能够显著提升前端开发体验。最初是为 vue@3.x 设计的开发和构建工具，vite@2.x 开始作为一种通用型的前端构建工具，除了vue，还适用于 react / svelte 等前端框架。

## vite 主要由两部分组成：
- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
- 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

## CLI 命令

vite 完全可以替代 vue-cli 来创建本地项目，并进行开发和构建。

### 创建项目

```sh
npm create vite
yarn create vite
pnpm create vite
```
然后按照提示进行操作即可。

也可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。

```sh
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

提供的项目模板包括：

```
vanilla: 原生js项目
vanilla-ts： 原生TS项目
vue: vue 项目
vue-ts：vue + Tyscript 项目，以下同理
react
react-ts
preact
preact-ts
svelte
svelte-ts
lit
lit-ts
```

### 运行项目

配置 `package.json` 中 `script` 命令：
```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```
可以指定额外的命令行选项，如 --port 或 --https。运行 npx vite --help 获得完整的命令行选项列表。

## vite 主要功能

1. NPM 依赖解析和预构建，即支持 npm 裸模块的导入：`import { someMethod } from 'my-dep'` 解析为：`import { someMethod } from '/node_modules/.vite/my-dep.js?v=f3sf2ebd'`
2. 一套原生 ESM 的 HMR API
3. 天然支持 typescript，使用 esbuilt 编译 ts 到 js，但ts的类型校验和提示仍依靠编译器
4. jsx 和 tsx 同样开箱即用
5. 通过 `postcss-import` 预配置支持了 CSS @import 内联，同样支持 CSS Modules CSS 预处理器
6. JSON 导入如同 js 对象一样，支持具名导入
7. `import.meta.glob` 函数支持从文件系统导入多个模块，类似 webpack 中的 `require.context` 函数

## 插件系统

### 安装插件
```sh
# 查找插件可以在 awesoe-vite 中搜索，vite 或 rollup 插件
pnpm add -D @vitejs/plugin-legacy
```

### 配置文件`vite.config.js` 中 plugins 数组中添加插件
```js
plugins: [
	legacy(options)
]
```

### 指定插件应用的顺序
可以使用 `enforce` 修饰符来强制插件的位置，此时 plugins 中使用对象形式：
```js
// pre：在 Vite 核心插件之前调用该插件
// 默认：在 Vite 核心插件之后调用该插件
// post：在 Vite 构建插件之后调用该插件

// 注意区分上面 核心插件和构建插件 
plugins: [
	{
		...legacy(options),
		enforce: 'pre',
	}
]
```

### 指定插件生效环境
可以指定插件的应用范围是在开发环境还是生产环境使用，默认插件在开发和生产模式中都会调用。可以使用 `apply` 属性指明它们仅在 'build' 或 'serve' 模式时调用。
plugins: [
	{
		...legacy(options),
		enforce: 'pre',
		apply: 'build',
	}
]

### 如何开发一个 vite 插件

待更新，可以参考官方文档[插件API](https://cn.vitejs.dev/guide/api-plugin.html)

## 静态资源的处理

pubilc 目录的处理：
1. 打包时会被完整复制到目标目录的根目录下。
2. 在开发环境中引用其中的资源必须以根路径启始的绝对路径访问：`/img.png` 在生产构建后会 `public/img.png`。
3. 相对路径的静态资源引用默认返回解析后的路径
```js
import imgUrl from './img.png'
imgEl.src = imgUrl  // 在生产时会被构建为：imgEL.src = /assets/img.xxx.png
```
4. 通过特殊的查询参数，指定静态资源导入的形式
```
?url 后缀显式导入为一个 URL
?raw 后缀声明作为字符串引入
?worker 或 ?sharedworker 后缀导入为 web worker 脚本
```

## 环境变量

1. Vite 在一个特殊的 `import.meta.env` 对象上暴露环境变量。
默认支持的环境变量：
```
import.meta.env.MODE: {string}       应用运行的模式。
import.meta.env.BASE_URL: {string}   部署应用时的基本 URL。他由base 配置项决定。
import.meta.env.PROD: {boolean}      应用是否运行在生产环境。
import.meta.env.DEV: {boolean}       应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)
```
2. 自定义环境变量
Vite 使用 dotenv 从你项目根目录中的`.env`文件加载额外的环境变量。其中只有以 `VITE_` 为前缀的变量才会暴露给经过 vite 处理的代码。如 `VITE_SOME_KEY=123` 暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码。
如果需要自定义一个模式的环境文件，首选需要明确该模式是类开发环境还是类生产环境，然后在其中明确 `NODE_ENV` 环境变量的值，让 vite 实现生产或开发相关优化，比如 `vite build --mode qa`
```sh
# .env.qa
NODE_ENV=production
VITE_QA_URL=xxxx
```

## npm 依赖预构建
1. Vite 的开发服务器将所有代码视为原生 ES 模块，如果导入的第三方依赖是 CommonJS 或 UMD 规范，则Vite 会执行智能导入分析，将依赖项转换为 ESM 规范。
2. 配置NPM依赖是否添加到预构建中，`vite.config.js` 中的  `optimizeDeps.include` 和 `optimizeDeps.exclude`
3. Vite 会将预构建的依赖缓存到 `node_modules/.vite` 目录中，并且采用强缓存，即在首次请求加载预构建的依赖文件后，设置 HTTP 响应头 `cache-control:max-age=31536000,immutable`。预构建依赖请求url上会添加一个时间戳作为 query 参数t，用来更新已缓存的预构建依赖方式。
4. 如果需要更新预构建的依赖，分自动和手动两种方式：
   1. 以下其中一项发生更改时，都会自动重新运行预构建：
     -  `package.json` 中的 `dependencies `列表
     - 包管理器的 lockfile，例如 `package-lock.json`, `yarn.lock`，或者 `pnpm-lock.yaml`
     - 其它在 `vite.config.js` 相关字段中配置过的
    2. 手动更新预构建依赖：
       1. 手动删除 node_modules/.vite 目录
       2. 关闭开发服务，再使用添加了 `--force` 参数的命令重启服务：`npm run dev --force`

## vite 配置文件 `vite.config.js`

### 配置的三种形式：
```js
// vite.config.js
export default {
  // 配置选项
}
```
如果需要通过 IDE 实现 TS 类型的智能提示，则如下使用：
```ts
// vite.config.ts
import { defineConfig } from 'vite'
export default defineConfig({
  // ...
})
```
如果需要根据环境实现不同的配置，则传入一个函数导出配置对象
```js
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // serve 独有配置
    }
  } else {
    return {
      // build 独有配置
    }
  }
})
```
### 配置选项
配置选项基本划分为：
- 共同配置
- css
- resolve
- server
- build
- optimizeDeps
- ssr

```js
mport { defineConfig } from 'vite'
export default defineConfig({
	mode：‘development', // 'development'（开发模式），'production'（生产模式），在配置中指明模式，将会把 serve 和 build 模式下都覆盖掉。也可以通过命令行 --mode 选项来覆盖配置文件中的值。
	root: process.cwd(), // 项目根目录（index.html 文件所在的位置）
	base: '/', // 基础路径
	publicDir: 'public', // 作为静态资源服务的文件夹，在开发时直接使用 / 绝对路径，生成构建时会替换为 pbulic/xx 
	cacheDir: "node_modules/.vite", // 存储缓存文件的目录，包括预构建依赖缓存目录和vite其它某些缓存文件
	envDir：'root', // 指定用于加载 .env 文件的目录
	logLevel：’info', // 调整控制台输出日志的级别，'info' | 'warn' | 'error' | 'silent'
	resolve: {
		alias: [],
		mainFields: ['module', 'jsnext:main', 'jsnext'], // 解析包的入口点时尝试的字段列表
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 导入时想要省略的扩展名列表, 不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
	},
	css: {
		modules: {}, // 配置 CSS modules 的行为，传入 postcss-modules
		postcss：{}, // 内联的 PostCSS 配置，或者指定一个 postcss.config.js 的路径。如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源。
		preprocessorOptions：{}, // 指定传递给 CSS 预处理器的选项
	},
	json: {
		namedExports: true, // 是否支持从 .json 文件中进行按名导入，默认 true，即实现 import { field } from '/path/xx.json'
		stringify: false, // 开启此项，则会禁用按名导入。
	},
	esbuild: {}, // 配置 ESbuild 转换选项
	optimizeDeps: {
		entries：string | string[],
		exclude: string[],
		include: string[],
		keepNames: false,
	},
  plugins: [],
  server: {
	host: '127.0.0.1', // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 将监听所有地址，包括局域网和公网地址。
	port: number, // 指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口
	strictPort: false, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。
	open: boolean | string, // 在开发服务器启动时自动在浏览器中打开应用程序。
	https: ,
	proxy: {}, // 开发服务器配置自定义代理规则, 传入 http-proxy
  },
  build: {
	target: 'modules', // 设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——'modules'，这是指 支持原生 ES 模块的浏览器。另一个特殊值是 “esnext”
	outDir: 'dist', // 指定输出路径（相对于 项目根目录).
	emptyOutDir: true, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。若 outDir 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。
	
	assetsDir: 'assets', // 指定生成静态资源的存放路径（相对于 build.outDir）。
	assetsInlineLimit: 4096，// 4kb, 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
	
	cssCodeSplit: true, // 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
	cleanCssOptions: {}, // 传递给 clean-css 的构造器选项
	
	sourcemap: false, // 构建后是否生成 source map 文件
	minify: 'terser', // 指定使用哪种混淆器 boolean | 'terser' | 'esbuild'
	terserOptions: {}, // 传递给 Terser 的更多 minify 选项
	chunkSizeWarningLimit: 500, // chunk 大小警告的限制（以 kbs 为单位）
	brotliSize: true, // 启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
	
	lib: '', // 构建为库
	rollupOptions: {}, // 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并
  },
})
```
