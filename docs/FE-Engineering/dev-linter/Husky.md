# Husky

[[toc]]

> Git hooks made easy<br>Husky can prevent bad git commit, git push and more 🐶 woof! ---[Husky github](https://github.com/typicode/husky)

Husky 插件的目的是让 git hooks 操作更简单，能够帮你阻挡住不好的代码提交和推送。

> 试想如果将代码已经 push 到远程后，再进行扫描发现多了一个分号然后被打回修改后才能发布，这样是不是很崩溃，最好的方式自然是确保本地的代码已经通过检查才能 push 到远程，这样才能从一定程度上确保应用的线上质量，同时也能够避免 lint 的反馈流程过长的问题。<br>那么什么时候开始进行扫描检查呢？这个时机自然而然是本地进行 git commit 的时候，如果能在本地执行 git commit 操作时能够触发对代码检查就是最好的一种方式。这里就需要使用的 git hook。

## git hooks

git 的 hook 可以理解成当执行如 git add、git commit 等 git 操作时的回调，通过在 git hook 不同钩子里编写一些命令脚本，就可以在 git 操作时触发代码相应脚本执行。

可以查看 .git 文件下的 hooks 目录，这里存放的是 git 相关操作的一些脚本例子。

> 一般.git 为隐藏文件，可以把项目拖入 IDE 中查看, .git 文件里的内容一般不允许手动更改的。也可以在文件夹中勾选显示隐藏文件查看到。

```js
cd.git / hooks;
ls - l;
```

可以看到 pre-commit / pre-push 等脚本文件

```
-rwxr-xr-x 1 40389 197609  478 10月 13  2019 applypatch-msg.sample*
-rwxr-xr-x 1 40389 197609  896 10月 13  2019 commit-msg.sample*
-rwxr-xr-x 1 40389 197609 3327 10月 13  2019 fsmonitor-watchman.sample*
-rwxr-xr-x 1 40389 197609  189 10月 13  2019 post-update.sample*
-rwxr-xr-x 1 40389 197609  424 10月 13  2019 pre-applypatch.sample*
-rwxr-xr-x 1 40389 197609 1638 10月 13  2019 pre-commit.sample*
-rwxr-xr-x 1 40389 197609 1492 10月 13  2019 prepare-commit-msg.sample*
-rwxr-xr-x 1 40389 197609 1348 10月 13  2019 pre-push.sample*
-rwxr-xr-x 1 40389 197609 4898 10月 13  2019 pre-rebase.sample*
-rwxr-xr-x 1 40389 197609  544 10月 13  2019 pre-receive.sample*
-rwxr-xr-x 1 40389 197609 3610 10月 13  2019 update.sample*
```

上图为各个钩子的案例脚本，可以把 sample 去掉，直接编写 shell 脚本来执行。但实际项目中可以使用插件来使钩子生效。常用的插件包括 `Husky` 和 `pre-commit`，这里介绍 `Husky` 的使用。

## Husky

1. 安装

```sh
# npm
npm install husky --save-dev

# yarn
yarn add husky --dev
```

2. 在 package.json 中配置

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test", // hooks 的 key 对应相应的 git 钩子，值为 script 对应的命令，或其它字段项配置
      "pre-push": "npm test",
      "...": "..."
    }
  }
}
```

之后，对项目执行 `git commit -m 'something'`就会触发对应的命名执行。

## Husky 与 lint-staged 配合使用

```sh
# 安装
npm install lint-staged husky --save-dev
```

```js
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged" // 在代码commit前执行将加入到stage暂存区的文件进行检查，按照下面"lint-staged"中的规则进行检查
    }
  },
  // 对staged的文件进行lint，避免对整个项目进行lint代码庞大且缓慢
  "lint-staged": {
    "linters": {
      "src/**/*.js": [  // 匹配.js文件一下命令
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
      "ignore": [
        "/dist/",
        "/node_modules/",
        "/static/",
        "/public/"
      ]
    }
  },
}
```
