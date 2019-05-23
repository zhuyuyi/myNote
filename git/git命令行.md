---
title: git 命令行
date: 2019-05-23 10:12:00
tags: git
categories: git
---

## git 命令行

### 回忆录

我马上毕业了，回首一下时间真快，2018年10月8日来到这里的，已经大半年了，我记得当时彬哥跟我介绍公司的时候，滔滔不绝。
然后给我介绍了 两篇关于 `git` 用法的文档，应该是中文官网，找不到了。
之前一直是处于只知道用，并不知道原理是什么，可能现在也不确定哈，没理解透彻。
韬哥告诉我，不能只会用，要知道它的原理。可能原话不是这样的哈。
有人问我为什么不用可视化工具，然后我很单纯地告诉他：“因为我能！”（卡特）

### 分布式管理系统

对立面集中式管理系统———— `svn`，可以认为是一个中央服务器，中央服务器就好比是一个图书馆，你要改一本书，必须先从图书馆借出来，然后回到家自己改，改完了，再放回图书馆。
可以理解为，`git` 多一步 `commit` ，保存在本地仓库，并且记录每一次的 `commit_id` ，用来以后回滚。

### 创建版本库

#### git init 

创建本地项目时，使用 `git init` 命令，主要用来初始化一个空的 `git` 本地仓库。执行完上面的命令，当前目录下会自动生成 `.git` 隐藏文件夹，该隐藏文件夹就是 `git` 版本库

<img src="https://s2.ax1x.com/2019/05/23/VCgISg.png" alt="VCgISg.png" border="0" />

<!--more-->

##### .git 文件夹介绍(了解一下，没有深挖，好多二进制数据...)

名称 | 作用、功能
-|-
hooks（钩） | 存放一些shell脚本 
`*` info：exclude | 需要忽略的文件类似 `.gitignore`
`*` logs | 保存所有更新的引用记录，日志
objects | 存放所有的 `git` 对象
refs | 保存当前最新的一次提交的哈希值
COMMIT_EDITMSG | 最新提交的一次 `Commit Message`
description | 仓库的描述信息
`*` config | `git` 仓库的配置文件
`*` index | 暂存区（stage），一个二进制文件
FETCH_HEAD | 是一个版本链接，指向着目前已经从远程仓库取下来的分支的末端版本
HEAD | 映射到ref引用，能够找到下一次 `commit` 的前一次哈希值
ORIG_HEAD:HEAD | 指针的前一个状态

##### .gitignore

忽略不想提交的文件，但是这个文件会被提交上去。

#### git clone 

`git clone [url]` 表示从远端仓库拉取代码，它会自动执行 `git init`。

#### git remote

我理解的是与远程仓库建立关联的一些操作。

直接 `git remote` 会打印出 已经存在的远程仓库，`origin` 是默认远程仓库的意思对吧，既然是默认，那当然你可以自定义。
`git remote -v | --verbose` 列出详细信息，在每一个名字后面列出其远程url。

通常在本地创建的时候 是 `git remote add [shortname] [url]`。

作用：一个本地仓库可以对应多个远端仓库

#### git add 

参数不一样，结果不一样，
`git add .` 使用它会把工作时的所有变化提交到暂存区，包括文件内容修改(modified)以及新文件(new)

`git add -u` ：仅监控已经被add的文件（即tracked file），他会将被修改的文件提交到暂存区。add -u 不会提交新文件（untracked file）。（git add --update的缩写）

`git add -A`: 表示把所有tracked文件中被修改过或已删除文件和所有untracted的文件信息添加到暂存区。

#### git pull 与 git fetch


