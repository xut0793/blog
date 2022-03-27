# lint-staged

[lint-staged github](https://github.com/okonet/lint-staged)

> Run linters against staged git files and don't let 💩 slip into your code base!<br>针对暂存的 git 文件运行 linters，不要让 💩 进入您的代码库！

lint-staged 从名字可以看区，只校验 lint 提交到暂存区 staged 的代码。即每次只对当前修改后进行 git add 加入到 stage 区的文件进行扫描校验，避免对项目中进行全项目扫描所会增加了检查复杂度和时长，我们只需要检查我们要提交的代码就可以了。

避免的另一个问题是，当针对以前的未严格进行代码规范化的历史代码时，如果提交代码时，未做 lint-staged 限制，对包括其他未修改文件在内的全项目代码都进行检查，一下出现成百上千个错误，估计会吓得立马删掉管理 eslint 的配置，冒出一身冷汗。所以我们需要使用 lint-staged 工具只校验当前被加入到 stage 区的文件。

```js
// 安装
npm install lint-staged --save-dev
```

```json
// package.json
{
  // 对staged的文件进行lint，避免对整个项目进行lint代码庞大且缓慢
  "lint-staged": {
    "src/**/*.js": [
      // 匹配.js文件一下命令
      "eslint --fix", // 执行eslint进行扫描进行fix
      "prettier --write", //执行prettier脚本,对代码镜像格式化
      "git add" //上述两项任务完成后对代码重新add。
    ],
    "src/**/*.vue": [
      "eslint --fix",
      "stylelint --fix",
      "prettier --write",
      "git add"
    ],
    "src/**/*.scss": [
      "stylelint --syntax=scss --fix",
      "prettier --write",
      "git add"
    ],
    "ignore": ["/dist/", "/node_modules/", "/static/", "/public/"]
  }
}
```

从 v3.1 开始，您现在可以使用不同的方式进行配置：

- lint-staged 在你的对象 package.json
- .lintstagedrc JSON 或 YML 格式的文件
- lint-staged.config.js JS 格式的文件

```json
// package.json
{
  "lint-staged": {
    "*": "your-cmd"
  }
}
```

```json
// .lintstagedrc.json
{
  "*": "your-cmd"
}
```

关于 lint-staged 与 husky 集成使用，参考 [Husky](/FE-Engineering/Lint/Husky.html)
