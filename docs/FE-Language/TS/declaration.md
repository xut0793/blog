# 声明文件 Declaration

[[toc]]

当我们使用外部第三方库时，由于外部 JavaScript 库不是使用 TypeScript 所编写，所以也就不具有类型，那么我们又该如何在 TypeScript 里结合两者呢？

1. 现在大部分库都已经支持 TS，即库本身就带有`d.ts`文件，此类库我们直接使用即可
1. 类没有用 TS 实现，此时可以去`@Types`下载对应库的声明文件，例如 jquery 库的声明文件：`npm install @types/jquery --save-dev`
   与普通的 npm 模块不同，@types 是统一由 DefinitelyTyped 管理的。库的声明文件可以在这个[页面搜索](https://microsoft.github.io/TypeSearch/)
1. 以上都没有，可能就要自己实现一个声明文件了。
   一个声明文件以`.d.ts`后缀结尾，文件内用`declare`关键字声明。

部分语法如下：

-   `declare var` 声明全局变量，也可以是`let` `const`
-   `declare function` 声明全局方法
-   `declare class` 声明全局类
-   `declare enum` 声明全局枚举类型
-   `declare namespace` 声明（含有子属性的）全局对象
-   `declare global` 扩展全局变量
-   `declare module` 扩展模块
-   `interface 和 type` 声明全局类型
-   `export` 导出变量
-   `export namespace` 导出（含有子属性的）对象
-   `export default` ES6 默认导出
-   `export =` commonjs 导出模块
-   `export as namespace` UMD 库声明全局变量

简单的声明语句可以直接放在文件开头

```ts
declare const jQuery: (selector: string) => any // jQuery全局变量的声明

jQuery('#foo')
```

使用声明文件

```ts
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any
```

```ts
// src/index.ts
jQuery('#foo')
```

通常 package.json 文件内会有 types 或 typing 字段来指定一个类型声明文件位置。

```json
{
	"name": "foo",
	"version": "1.0.0",
	"main": "lib/index.js",
	"types": "foo.d.ts"
}
```

导入库时会按如下顺序解析路径:

1. 查找库自带的`package.json`中`types`或`typeings`字段指定的文件路径
1. 如果没有，在根目录下寻找`index.d.ts`文件
1. 如果没有，查找`package.json`中`main`字段文件同名`+d.ts`后缀的文件
1. 如果没有，就会寻找是否存在`lib/index.d.ts`文件
1. 如果仍没有，那会认为这个库没有提供类型声明文件。

具体如何创建一个声明文件，如何发布声明文件？感兴趣可能按下面顺序查阅：

[Tyscript 入门教程 -- 声明文件](https://ts.xcatliu.com/basics/declaration-files)
[Typescript 中文官网 -- 声明文件](https://www.tslang.cn/docs/handbook/declaration-files/introduction.html)
