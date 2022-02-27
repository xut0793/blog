# 配置文件 tsconfig.josn

[[toc]]

首先明确一点：命令行直接输入的选项权重最大：

比如如果命令行中指定了编译的文件，则会忽略 tsconfig.json 文件：`bash tsc file.ts`

如果命令行指定了编译选项，则会覆盖 tsconfig.json 文件中 compilerOptions 选项对应的配置项。比如： 在 package.json 中配置 script 选项：

```json
"script": {
    "ts:build": "tsc --noEmit"
}
```

## 使用 tsconfig.json

tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项。tsconfig.json 所在目录即是这个 ts 项目的根目录。

一般下面情况下会寻找 tsconfig.json 文件来编译项目

-   不带任何输入文件选项的情况下调用 tsc 命令，编译器会从当前目录开始去查找 tsconfig.json 文件，如果没有逐级向上搜索父目录。
-   使用`tsc --project（或 -p）`指定一个项目目录时，会查找指定目录下的 tsconfig.json 文件。

## tsconfig.json 文件结构

tsconfig.json 所包含的属性并不多，只有 6 个：

```json
{
	"extends": "./configs/baseConfig.json", // 用于继承的外部ts配置文件
	"compileOnSave": true, // Boolean类型，用于IDE保存时是否重新编译并生成编译后文件
	"compilerOptions": {}, // 编译选项配置
	"files": ["core.ts"], // 包含要由 ts 管理编译的文件的具体文件路径
	"include": ["scr/**/**"], // 使用glob匹配模式，指明ts管理编译的文件
	"exclude": ["node_modules", "**/**.spec.ts"] // 使用glob匹配模式，指明ts管理编译时要排除的文件
}
```

**1. extends**

拆分 tsconfig.json 文件，使用`extends`引用。可用于大项目中配置文件的组织，类似 webpack.config.js 文件拆分 base/dev/prod/test 等。

**2. files include exclude**

`files`指定一个包含相对或绝对文件路径的列表，在 TS 编译 files 指定文件。

也可以命名使`include`选项，指定一个使用 glob 匹配模式的列表文件。

支持的 glob 通配符有：

-   -   匹配 0 或多个字符（不包括目录分隔符）
-   ? 匹配一个任意字符（不包括目录分隔符）
-   \*\*/ 递归匹配任意子目录

如 `files` 和 `include` 都没有指定，ts 默认是排除 `exclude` 以外的所有的以 `.ts` 和 `.tsx` 结尾的文件。如果，同时设置 files 的优先级最高，exclude 次之，include 最低。

**3. compilerOptions**

`compilerOptions`配置编译选项，官网可查看完整的[选项列表](https://www.tslang.cn/docs/handbook/compiler-options.html)

其中

-   **paths**选项：可配置模块引用时模块名基于 baseUrl 路径的映射列表，提供了 TS 项目中模块路径解析的查找规则。类似 webapck 中`resolve`选项中配置路径别名一样效果,但是区别是 ts 中不用书写别名，而是自动按配置的 paths 选项路径去查找。具体规则解析请查看官网[模块解析 --路径映射](https://www.tslang.cn/docs/handbook/module-resolution.html)

-   **typeRoots**和**types**选项：默认所有可见的`node_modules/@types`文件夹下及子文件夹下的`@types`包会在编译过程中被包含进来，但如果指定了`"typeRoots":[]`，指定了 type 文件的目录路径，只有 typeRoots 指定的目录下的包才会被包含进来。如果指定了`"types":[]`，只有其中被列出来的包才会被包含进来。

    ```json
    {
    	"compilerOptions": {
    		"typeRoots": ["./typings"]
    	}
    }
    ```

    上面的这个配置会包含所有./typings 下面的包，而不包含./node_modules/@types 里面的包。

    ```json
    {
    	"compilerOptions": {
    		"types": ["node", "lodash", "express"]
    	}
    }
    ```

    上面指定了 types，只有被列出来的包才会被包含进来。这个配置将仅会包含 `./node_modules/@types/node`，`./node_modules/@types/lodash`和`./node_modules/@types/express`。 `node_modules/@types/*`里面的其它包不会被引入进来。

-   **target**选项：指定了 TS 编译后输出文件代码的类型，比如`"target":"es5"`编译输出文件的代码是 es5 语法。
-   **lib**选项： 指定了编译过程中需要引入的库文件列表。一般有默认值：如果编译目标是 ES5：`"target":"es5"`，则默认引入`DOM`,`ES5`,`ScriptHost`库文件。如果编译目标是 ES6：`"target":"es6"`，则默认引入`DOM`,`ES6`,`DOM.Iterable`,`ScriptHost`。具体包含哪些库文件，见官网[编译选项 --库文件列表](https://www.tslang.cn/docs/handbook/compiler-options.html)
-   **rootDir**选项：就是我们的源代码目录
-   **outDir**选项：就是我们的编译后代码的目录
-   **esModuleInterop** 和 **allowSyntheticDefaultImports**选项： 暂时也还没明白，你可以看这两篇自己理解下：[esModuleInterop 和 allowSyntheticDefaultImports 探究](http://www.xunart.com/h820729.html) [Typescript 2.7 版本记录 - 添加 --esModuleInterop 对 ES 模块和老式代码更好的互通](https://segmentfault.com/a/1190000014913104#articleHeader6)

**参考 tsconfig.json**

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
		"sourceMap": true, // 生产中去掉
		"strictNullChecks": true
	},
	"include": ["scr/**/**"],
	"exclude": ["node_modules", "./test"]
}
```

**官网参考内容：**

[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)<br>
[编译选项](https://www.tslang.cn/docs/handbook/compiler-options.html)<br>
[模块解析](https://www.tslang.cn/docs/handbook/module-resolution.html)<br>
