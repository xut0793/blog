# 安装 Typescript

使用 cmd 命令行工具安装：

```bash
npm i -g typescript
```

前提是你本地得装有 node。安装完成后，就可以在全局使用`tsc`命令来执行编译`.ts`文件啦。

**Hello Typescript 示例**

TypeScript 最大的优势便是增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等。主流的编辑器都支持 TypeScript，这里我使用 Visual Studio Code。

选择一个目录，新建一个`Hello.ts`文件,输入以下内容：

```ts
// Hello.ts
console.log('Hello Typescript')
```

执行编译，自动在同级目录生成一个同名的`.js`文件

```bash
tsc Hello.ts
```

更详细的简单上手例子，可以转到官网[5 分钟上手 Typescript](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)

从官网这个简单上手的教程中，我们了解到两个陌生的概念：

-   类型注解
    类型注解是 TS 中一种轻量级的为函数或变量添加约束的方式。
-   接口
    接口可以为 js 的引用类型(Object 类型)添加类型约束。

下一篇，我们学习 TS 中具体如何进行类型注解。
