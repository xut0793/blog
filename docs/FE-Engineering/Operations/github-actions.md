# Github Actions

WWHD

## What: GitHub Actions 是什么

GitHub Actions 是 GitHub 于 2018 年 10 月推出的一个 CI\CD 服务。之前一直都是 Beta 版本，正式版于 2019 年 11 月正式推出。

> CI\CD 其实说的是三件事情：「持续集成（Continuous Integration）」、「持续交付（Continuous Delivery）」、「持续部署（Continuous Deployment）」。因为「持续交付」和「持续部署」的英文缩写是一样的，所以这三件事情缩写成了 CI\CD 。

在现代前端工程中，我们完成一个 web 应用，在开发阶段之后，还需要经过测试、打包构建、部署、发布等流程。将这些在软件开发周期内的工作流程利用脚本进行自动化操作，这就是 CI/CD 流程。

GitHub 以前更多的是作为管理代码的仓库，以 GitHub 仓库为基础进行 CI/CD 流程的工具一般要用第三方的应用，如 `Travis-CI`、`Circle-CI`、`Jeskins`等，不像 `GitLab`很早就有 `GitLab-CI` 服务。现在 GitHub 终于推出了自己的集成服务 `GitHub Actions`。

并且它的一个亮点，关键在于可以共享集成过程中的 `Action`，也就是某一流程阶段中具体执行的操作。

接着以上面前端工程开发流程举例，在进行项目 CI/CD 过程中，有一些共性的操作步骤，如:
- 使用密钥登录远程服务器
- 从指定的远程仓库中检出代码到本地服务器
- 设置本地服务器的构建环境，如前端工程必须的 Node 环境
- 运行构建命令后，部署指定服务器等

像类似上面这种操作在不同项目工程中都是类似且必须的，完全可以复用。GitHub 注意到了这一点，想出了一个很妙的点子，利用它拥有代码仓库的优势，允许开发者把每一个这种操作写成独立的脚本文件，存放到代码仓库，然后其他开发者就可以引用指定仓库来完成同种操作，就不必自己再写一遍脚本文件。这就是 GitHub Actions 最特别的地方。

- GitHub 建立了一个名叫 `actions` 的官方仓库，提供了一些常用的共性的官方 action 脚本文件，供开发者使用
- GitHub 做了一个 `acions` 的官方市场，可以搜索查找到他人提交的 action。
- 另外，还有一个 awesome actions 的仓库，也可以找到不少 action。

## Why: 为什么使用

软件开发周期内都需要经过测试、编译、打包、部署等流程，用脚本将这些流程进行自动化管理是最高效的做法，而 `GitHub` 在基于代码仓库管理的能力上提供了内置的 CI/CD 服务，使得我们不需要再使用第三方的集成服务。并且`GitHub Actions`更易于学习和操作。

## How: 如何使用 

一个简单的打印 Hello World 的自动化执行例子：

1. 在 GitHub 上新建一个 demo 仓库
2. 在仓库的根目录下新建目录 `.github/workflows`，并创建一个 `hello-action.yml` 文件。
```yml
name: Hello GitHub Actions
on: push
jobs:
  greet_action:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello GitHub Actions"
```
3. 向仓库主分支推送 push 该文件内容，就会触发 `GitHub Actions` 的自动执行
4. 在 GitHub 上，导航到仓库的主页面，切换到 Actions 的 tab 页面，选择 `Hello GitHub Actions` 工作流程，单击查看运行详情。

这里需要学习两部分知识：`Yaml` 文件格式 和 `GitHub Actions` 语法格式

## Yaml 文件格式

参考链接[阮一峰：YAML 语言教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)

### What: Yaml 是什么
YAML 是专门用来写配置文件的语言，非常简洁和强大，远比 JSON 格式方便。

### Why: 为什么用 Yaml
YAML 的语法规则比 JSON 更简洁，使用空格缩进表示层级关系。书写更方便。

### How：如何使用

YAML 文件以`.yml`或`.yaml`结尾，支持的数据结构有三种：
- 对象：键值对的集合，使用 `key: value` 形式表示
- 数组：一组按次序排列的值，以短横线`-`开头的行，构成一个数组项
- 纯量值（scalars）：单个的、不可再分的值，如 Boolean / Number / String / Date / Null
- 注释：使用`#`表示

```yml
# 对象 {name: 'tom'}
name: tom
# 数组 pets: ['dog', 'cat', 'goldfish']
pets:
  - dog
  - cat
  - goldfish
# 纯量值 {age: 18, gender: 'male', birthday: '1990-10-15', isStudent: true, self_introduction: 'xxx'}
age: 18
gender: male
birthday: 1990-10-15
isStudent: true
children: ~ # null 用 ~ 表示 children: null
# 字符串的复杂之处在于如何处理换行符
self_introduction: 单行字符串，直接写 # 直接一行写
self_introduction: 这是一段  # 多行字符串可以直接断行，以空格缩进，换行符被替代成空格：这是一段 多行 字符串
  多行
  字符串
self_introduction: | # | 符号表示保留换行符，家庭住址\n教育信息\n
  家庭住址
  教育信息
self_introduction: |+ # |+ 符号表示在 | 语法的基础上还保留未尾的换行符：家庭住址\n教育信息\n
  家庭住址
  教育信息
self_introduction: |- # |- 符号表示在 | 语法的基础上删除未尾的换行符：家庭住址\n教育信息
  家庭住址
  教育信息
self_introduction: > # > 符号表示折叠换行，即在多行字符串的基础上，保留未尾的换行符，其余换行符替代为空格：家庭住址 教育信息\n
  家庭住址
  教育信息
```

## GitHub Actions 语法规则

GitHub Actions 有一些自己的术语。
- workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。
- on（开关）：触发执行工作流程的条件，可以是 git hooks、定时时间等
- job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
- step（步骤）：每个 job 由多个 step 构成，一步步完成。
- action （动作）：每个 step 可以依次执行一个或多个命令（action）

> 整个流程好比一条工厂流水线，有一个控制流水运行与否的电源开头，流水线分成几个阶段的任务，每个阶段任务有自己规范的装配步骤，每个步骤都需要工人特定的动作来完成。

### 基本语法

代码仓库下的 `.github/workflows` 目录每个 yaml 文件都是代表一个工作流
```yml
name: Hello GitHub Actions #  workflow 名称
# 触发事件可以是 web hooks 、定时事件 schedule（cron 语法）、手动事件，具体查看 https://docs.github.com/cn/actions/reference/events-that-trigger-workflows
on: push # 触发 workflow 的条件，这里指该仓库的 git push 事件
on: # 也可以限定 git push 的具体分支或标签事件
  push:
    branches:
      - master # 向主分支 git push 时触发
      - 'releases/**' # 向 release 的任意子分支 git push 时触发
    tags:        
      - v1             # git push origin v1 时触发
      - v1.*           # 推送匹配任意 v1. 开头的标签时触发，git push origin v1.1
# 每个 job 必须具有一个 id 与之关联
jobs:
  greet_actions: # job id 必须以字母或 _ 开头，并且只能包含字母数字字符、- 或 _
    name: greet actions # job name
    runs-on: ubuntu-latest # 指定运行该 job 的系统环境
    env: # 定义该任务下所有步骤可用的环境变量
      FIRST_NAME: Mona
    # 定义该作业任务下的一系列步骤
    steps:
      - id: step1
        name: Print a greeting
        run: echo Hello $name
        with:  # 定义 run 执行命令的参数
          name: Tom # 这里的变量，同时也会被定义为以 INPUT_ 开头的转为大写的环境变量，可以在脚本程序内部引用。INPUT_NAME
        env:
          FIRST_NAME: jerry # 也可以定义该步骤范围使用的环境变量，优先级大于 job ，同名会覆盖 job 中环境变量
```
### 任务编排

像上述定义的流程中：
- 多个任务，默认是并行运行
- 多个步骤，默认按顺序串行执行

```yml
name: parallel task
on: push
jobs:
  job1:
    name: job 1
    run-on: ubuntu-latest
    steps:
      - id: step1
        name: step 1
        run: echo step 1
      - id: step2
        name: step 2
        run: echo step 2
  job2:
    name: job 2
    ....
```
如果任务前后有依赖关系，需要串行执行，要使用 `job.needs` 属性
```yml
name: serial task
on: push
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]
```
在上述示例中，job2 必须等待 job1 **成功**完成后运行，而 job3 要等待 job1 和 job2 **成功**完成后运行。如果中间某个任务报错，则后续任务不执行。

如果 job3 不管 job1 和 job2 成功与否，都需要在他们完成后运行，则可以使用 job.if 属性定义执行条件
```yml
jobs:
  job1:
  job2:
    needs: job1
  job3:
    if: always()
    needs: [job1, job2] # job3 始终在 job1 和 job2 完成后运行，不管它们是否成功
```

### 输入输出

如果任务需要串行执行，前后有依赖关系，那这种依赖很多时候是依赖任务的输入输出结果。即当前任务的运行依赖于上一个任务的输出参数，将作为当前任务的输入

```yml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs: # 定义任务的输出
      output1: ${{ steps.step1.outputs.test }} # 引用 step 输出的变量 test 值
      output2: ${{ steps.step2.outputs.test }}
    steps:
      - id: step1
        run: echo "::set-output name=test::hello" # 定义 test 变量值
      - id: step2
        run: echo "::set-output name=test::world"
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - run: echo ${{needs.job1.outputs.output1}} ${{needs.job1.outputs.output2}} # 通过 needs 中获取依赖任务的输出
```
### 使用 action 模板

就像上面 GitHub Actions 概念解说中提到的一样，step 中定义的操作，很多是可以复用的，我们可以直接使用已定义的 action，省得重复编码。

使用 `step.uses` 属性.

```yml
jobs:
  job1:
    run-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: setup node v12
        uses: actions/setup-node@main
        with: # 有些操作要求必须通过 with 关键词设置输入，具体可以查看该代码的 README.md
          node-version: '12'
```

### 表达式、上下文环境、环境变量

#### 表达式
在 GitHub Actions 中 `job.if` `step.if` 输入和输出中都可以定义任务或步骤执行的条件语句，只有返回 true，才可继续执行。

表达式语法：`${{ <expression> }}`

其中 expression 中可以直接使用纯量值 、简单的运算符和平台特定的函数方法

- 纯量值：`Boolean/number/string/null`
- 运算符：`() [] . / > >= < <= == != && ||`
- 特定的函数方法，都以函数调用 `fn()`:
  - `contains( search, item )`
  - `startsWith( searchString, searchValue )`
  - `endsWith( searchString, searchValue )`
  - `format( string, replaceValue0, replaceValue1, ..., replaceValueN)`
  - `join( array, optionalSeparator )`
  - `toJSON(value)`
  - `fromJSON(value)`
  - `hashFiles(path)`
  - `always`
  - `cancelled`
  - `failure`

[表达式](https://docs.github.com/cn/actions/reference/context-and-expression-syntax-for-github-actions)


#### 上下文对象

上下文是一种访问工作流程运行 workflow、运行器环境 env、作业 job及步骤 setp 中相关信息的方式。 上下文变量在表达式语法：`${{ <context> }}`
> 简单理解上下文就是在 GitHub Actions 语法表达式 `${{ <context> }}` 中可以直接使用的全局对象

GitHub Actions 提供了可访问的上下文环境对象包括：`github / env / job / steps / runner / secrets / strategy / matrix / needs`。具体可以查看
- [上下文对象](https://docs.github.com/cn/actions/reference/context-and-expression-syntax-for-github-actions#steps-context)

#### 环境变量

在 GitHub Actions 中环境变量包括以下这些：
- 系统默认的环境变量
- `worlkflow.env` `job.env` `step.env` 属性定义的环境变量
- `step.with` 定义的参数以 `INPUT_` 开头，全部大写转为的环境变量

环境变量可以依据当前系统不同引用方式有不同，在linux 的 shell 中可以通过 `$env-varibale` 引用，并且在任何 shell 语句中都可以引用。
- [系统环境变量](https://docs.github.com/cn/actions/reference/environment-variables)

```yml
name: CI
on: push
jobs:
  prod-check:
    if: ${{ github.ref == 'refs/heads/main' }} # 使用 github 上下文对象
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production server on branch $GITHUB_REF" # 使用默认的环境变量 GITHUB_REF
```

### 加密信息

在 workflow 中定义任务或操作步骤时不可避免需要使用一些敏感的密码，这些不可能直接写在 yaml 文件中。我们可以将其定义在组织或者仓库或者仓库环境中。

- 在组织、仓库、仓库环境的页面中都有设置的 tab 页（settings)
- 进入后在侧边栏选择 Secrets，在页面中单击新建密码，为该密码定义一个名称，并输入密码值，点击添加密码即可。名称命名规则：不区分大写、不能以保留的内部变量`GITHUB`开头，不能以数字开头，以字符、数字、下划线组合命名。
- 使用：在 yml 文件中以上下文变量 secrets 接自定义的名称来调用。

```yml
steps:
  - name: Hello world action
    with: # Set the secret as an input
      GITHUB_TOKEN: ${{ secrets.GithubToken }}
    env: # Or as an environment variable
      super_secret: ${{ secrets.SuperSecret }}
```
密码的限制：
- 最多可以每个组织存储 1,000 条密码变量
- 每个仓库存储 100 条密码变量
- 每个环境存储 100 条密码变量
- 一个工作流程最多可以使用 100 条组织机密和 100 条仓库密码变量
- 引用环境的作业最多可以使用 100 条环境密码变量。
- 密码大小限于 64 KB

如果要使用大于 64 KB 的密码，则需要使用 SSH 加密，将公钥存储在GITHUB 上，将私钥存储在本地。


## Deep: 深入

### 为什么能在 GitHub 上跑 CI/CD 流程呢？

因为 GitHub 为 workflow 流程免费提供了一台虚拟机。
- Windows 和 Linux 虚拟机的硬件规格：2 核 CPU，7 GB RAM 内存，14 GB SSD 硬盘空间
- MacOS 虚拟机的硬件规格：3 核 CPU，14 GB RAM 内存，14 GB SSD 硬盘空间
  
> Windows 和 Linux 虚拟机都托管在 GibHub 位于 Microsoft Azure 的云主机上。 MacOS 虚拟机托管在 macOS Cloud 上。
  
并且都预装了可选择的虚拟系统环境：
- window: windows-2019 / Windows Server 2016，在yml 文件中可以使用 windows-latest 选择最新版本
- Linux: Ubuntu 20.04 / ubuntu-18.04，同样可用 ubuntu-latest 选择最新版本
- MacOS: macos-11.0 / macos-10.15，同样可用 macos-latest 选择最新版本
  
并且虚拟系统都预装了工具软件：除了全部都装了 `GitHub Actions` 运行器应用程序外，还有比如 Ubuntu 20.04 虚拟系统装了常用的 bash / node / npm / yarn / lerna / git / mvn / github cli / Google Chrome / MongoDB / nginx / ftp / zip / telnet / wget 等等。

> 可以在这里查看各种虚拟系统预装软件列表：[actions/virtual-environments](https://github.com/actions/virtual-environments/tree/main/images)

GitHub 在虚拟机上的特定目录中执行操作和 shell 命令。 虚拟机上的文件路径不是静态的，可以使用环境变量来引用文件路径。
- HOME	包含用户相关的数据。例如，此目录可能包含登录凭据。
- GITHUB_WORKSPACE	在此目录中执行操作和 shell 命令。 操作可以修改此目录的内容，后续操作可以访问这些修改。
- GITHUB_EVENT_PATH	触发工作流程的 web 挂钩事件的 POST 有效负载。 每当操作执行时，GitHub 都会重写此变量，以隔离操作之间的文件内容。

鉴于云服务器和虚拟机系统资源的限制，Github Action 也有一些使用限制：
- 每个 Workflow 最多可以执行 72 小时
- 每个 Workflow 中的 job 最多可以执行 6 个小时
- 每个 Workflow 中的 job 最多可以排队 24 小时
- 在一个存储库的所有 Action 中，一个小时最多可以执行 1000 个 API 请求
- 并发工作数：Linux：20，Mac：5（专业版可以最多提高到 180 / 50）


## 参考链接
- [GitHub Actions 的工作流程语法](https://docs.github.com/cn/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)
- [YAML 语言教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)
- [Github Action 精华指南](https://zhuanlan.zhihu.com/p/164744104)