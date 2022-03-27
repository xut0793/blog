# Git 常用操作命令

Git 的操作指令非常多，此处仅选一些简单的日常操作。

安利一篇非常好的教程,特别是图解 Git 命令部分。[文档链接](https://github.com/geeeeeeeeek/git-recipes/wiki) [图解 Git 命令](https://github.com/geeeeeeeeek/git-recipes/wiki/4.1-%E5%9B%BE%E8%A7%A3-Git-%E5%91%BD%E4%BB%A4)

## 创建代码仓库

一般两种方式：

- 本地初始化仓库，然后再关联到远程仓库
- 直接克隆远程仓库

先讲简单的：

### `git clone` 克隆远程仓库

```bash
git clone https://github.com/geeeeeeeeek/git-recipes.git
```

克隆的项目会自动与远程仓库关联。这样我们编辑修改提交后可以直接推送远程仓库。

### `git init` 初始化本地仓库

```bash
# 新建一个项目目录
mkdir git-projecct
# 进入项目
cd git-project
# 初始化本地git仓库
git init
```

`git init`操作后会在当前的目录下增加了一个 .git 目录，现在在仓库的任何操作就可以正常使用 git 相关命令记录了。

如果需要拉取远程代码仓库的代码来工作，则需要先关联远程仓库。

```bash
# 添加一个远程仓库跟踪
git remote add 远程仓库名（一般写为origin）url
```

```bash
# 查看本也仓库已关联的所有远程仓库
git remote -v

# 查看所有指定远程仓库的详细信息
git remote show 仓库名
```

关联完成之后就可以拉取远程仓库代码对应主分支到本地仓库进行编辑了，并且自动建立本地仓库分支与该远程仓库分支的追踪关系。

```bash
git pull <远程主机名> <远程分支名>:<本地分支名>
```

## `git branch` 分支管理

### 分支创建

有两种方式：

- 基于本地分支新建
- 基于远程分支新建

**基于本地分支创建新分支**

```bash
# 基于当前分支新建本地分支
git branch <branch_name>
# 切换到新分支
git checkout <branch_name>

# 或者一步到位，新建并切换到新分支
git checkout -b <branch_name>
```

此种方式新建的分支如果需要关联到远程仓库对应的分支时，还需要建立新分支与远程对应分支的跟踪关系

```bash
# 本地分支与远程分支建立跟踪关系track
git branch --set-upstream-to origin/<origin_branch_name> <local_branch_name></local_branch_name>

# 解除本地分支与远程分支的跟踪关系，这样之后可以与其它远程分支建立追踪关系
git branch --unset-upstream
```

**基于远程分支创建新分支**

这种方式创建的新分支自动与远程分支建立追踪关系

```bash
# 基于远程分支新建本地分支
git fetch origin <origin_branch_name> : <local_branch_name>
# 切换到新分支
git checkout <local_branch_name>

# 或者一步到位，新建并切换
git checkout -b <local_branch_name> <origin/origin_branch_name>
```

### 分支常用操作命令

```bash
# 查看本地分支情况：
git branch -v

#查看远程分支情况：
git branch -r

#查看所有本地分支和远程分支：
git branch -a

#查看本地分支与远程分支的跟踪关系：
git branch -vv

# 删除本地分支：
git branch -d <branch_name>

# 删除远程分支：
git push origin -d <branch_name>

# 修剪远程已删除的分支：
git remote prune origin

# 新分支首次推送，并建立跟踪关系 -u
git push -u origin <branch_name>
```

## `git status` `git add` `git commit` 文件编辑

```bash
git status
```

```
git status 展示信息的三种分类：
1、Untracked files: (没有tracked过的文件, 即从没有add过的文件)
2、Changes not staged for commit: (有修改, 但是没有被添加到stage区的文件)
3、Changes to be committed: (已经在stage区, 等待添加到git本地仓库中的文件)
```

```bash
git add
```

```
# 将所有修改添加到暂存区
git add .

# 把<path>中所有跟踪文件中被修改过或已删除文件的信息添加到索引库。它不会处理那些不被跟踪的文件。省略<path>表示 . ,即当前目录。
git add -u [<path>]

# 表示把中所有跟踪文件中被修改过或已删除文件和所有未跟踪的文件信息添加到索引库。省略<path>表示 . ,即当前目录。
git add -A: [<path>]

# 我们可以通过git add -i 命令查看中被所有修改过或已删除文件但没有提交的文件，并通过其revert子命令可以查看<path>中所有未跟踪的文件，同时进入一个子命令系统。
git add -i [<path>]
```

```bash
git commit
```

```bash
# 信息备注最好符合一定约定，能变更的类型，影响范围，备注说明
git commit -m "fix<all> the commit message"

# 会先把所有已经track的文件的改动`git add`进来，然后提交(有点像svn的一次提交,不用先暂存)。对于没有track的文件,还是需要执行`git add <file>` 命令。
git commit -a

# 增补提交，会使用与当前提交节点相同的父节点进行一次新的提交，旧的提交将会被取消。
git commit --amend
```

## `git rm` 文件删除

```bash
# 物理删除电脑文件，shell命令： rm
rm file_name
rm -r dir_name

# 删除git本地仓库的文件
git rm file_name

# 删除文件夹
git rm -r dir_name

# 查看要删除的文件信息，并没有执行删除
git rm -n file_name

# 删除暂存区文件
git rm --cache

# 将删除文件信息提交git commit才算完整删除
git commit

# 使用 git rm 删除文件了但还没补git commit 时,想恢复可以使用git add -i 选择revert, 再git checkout -- filename
```

## `git remote` 远程仓库管理

```bash
# 添加一个远程仓库跟踪：
git remote add <远程主机名 (默认origin)> url

# 查看本地已跟踪的所有远程仓库：
# 只显示远程仓库名
git remote
# 需要显示url信息
git remote -v

# 查看所有指定远程仓库的详细信息,包括所有分支
git remote show <仓库名>

# 重命名本地已跟踪的远程仓库：
git remote rename <old_name> <new_name>

# 删除一个已跟踪的远程仓库：
git remote rm <仓库名>

# 远程仓库的url改变后需要在本地更换
# （常见的情形是远程仓库变更了项目所有者时，url会改变，此时本地需要重新更改url）
git remote set-url <仓库名> <new_url>
# 查看远程仓库的url
git remote get-url <仓库名>
```

### 实践案例

**实践 1：删除远程仓库的文件或目录，几个步骤:**

```bash
# 1、先执行拉取最新代码
git pull

#2、在本地git仓库执行删除，如果是目录添加 -r
rm name
git rm name

# 3、提交删除操作
git commit -m 'delete name'

# 4、推送到远程仓库才能将远程仓库文件夹删除
git push
```

**实践 2：远程仓库的 url 变更，需要重新绑定**

有两种方法：

```
1. 直接修改 url 命令： git remote set-url origin new_url 此时分支的远程跟踪关系会自动更新追踪关系

2. 先直接删除跟踪的远程仓库，再重新绑定一个新 url：
    git remote rm origin git remote add origin new_url 此时引用分支的关系需要重新绑定跟踪关系
    git branch --set-upstream-to=origin/origin_branch_name
```

**实践 3：将远程仓库 old_origin 的分支单独拆出来，到一个新的远程仓库 new_origin**

1. 远程新建一个仓库，并初始化 master 分支
1. 本地新建一文件夹，并初始化为新的本地仓库： git init
1. 将 old_origin 的目标分支 target 检出到本地仓库作为 master 分支：git fetch old_origin target 然后 git merge target
1. git add . 然后 git commit -m 'fetch target' 提交本次拉取和全并的修改，git status 查看保证清空暂区
1. git remote set-url origin new_url 将远程仓库重新绑定到新仓库的 url
1. git fetch origin master
1. git merge --allow-unrelated-histories origin/master 此时 merge 因为旧仓库的 commit 记录与新仓库的 commit 来源不同，所以需要带上--allow-unrelated-histories 参数允许合并两者的提交记录。
1. git push -u origin master 首次提交到远程仓库。如果 merge 步骤有冲突需要手动解决冲突后推送。此步骤也可以分为两步：先绑定分支跟踪关系：git branch --set-upstream-to=origin/master 然后 git push

**实践 4：修剪远程分支**

在多个协作过程中，如果成员 A 删除了远程分支 branch_A, 在人员 B 中查看时`git branch -a`，branch_A 分支会仍然显示，要不显示，需要修剪在本地的远程分支数据。

1. `git branch -a` 或 `git branch -r` 时，往往显示的分支比实际远程代码库的分支更多，这是因为本地存在远程已经删除的废弃分支
1. `git remote show origin` 可以显示本地远程仓库的所有信息，包括所有分支，其中废弃分支会标识为**stale**，表明该分支在远程仓库已经不存在。
1. `git remote prune origin` 可以删除掉标识为**stale**的分支，使本地仓库分支与远程仓库分支一致。

## git log

[git log 的使用](https://www.jianshu.com/p/0805b5d5d893)

```bash
git log --pretty=oneline
git log --pretty=short
git log --pretty=full
git log --pretty=fuller
```

## git stash

[git切换到别的分支,要暂时保存当前分支的修改(不想进行add 和commit)的方法 git stash](https://blog.csdn.net/anhenzhufeng/article/details/78052418)
[Git（2）-暂存区的作用（idea版本解决暂存区存在文件时pull和merge问题](https://www.jianshu.com/p/a4603dcffbad)

## Git配置credential helper

[Git配置credential helper](https://blog.csdn.net/wzy901213/article/details/84334163)

当修改 gitlab 用户名或密码后再使用会报错：

```js

```
此时，可以有两种方式解决：

1. 第一种，windows 搜索 凭据，打开凭据管理查找到 gitlab 凭证进行修改
1. 第二种：先清除凭证，再存储凭证：
```bash
# 重置用户名+密码
git config --system --unset credential.helper

# 存储用户名+密码，会在 $HOME 目录生成 .git-credential 文件明文存储 gitlab 含有用户名和密码的地址
git config --global credential.helper store

# 之后，手动输入一次，后面就不需要再输入。
```
