---
title: 如何搭建一个简单的 Blog
date: 2019-03-14 18:02:40
tags: 指南
categories: 指南类
---

## 如何搭建一个简单的 Blog

1. 创建一个属于自己的 github 账户，github 网站 号称 全球最大的基佬程序员网站

2. 进入 github 在Github首页右上角头像左侧加号点选择 New repositor(新存储库)或点击这里进行创建一个仓库.

<img src="https://s2.ax1x.com/2019/03/14/AAWJ1O.png" alt="AAWJ1O.png" border="0" />

3. 下载 node 和 git 命令行工具  一路点击Next就行了.
4. 安装Hexo
<!--more-->
```
在你需要安装Hexo的目录下(新建一个文件夹)右键选择 Git Bash

npm install hexo-cli -g   
hexo init #初始化网站   
npm install   
hexo g #生成或 hexo generate   
hexo s #启动本地服务器 或者 hexo server,这一步之后就可以通过 http://localhost:4000  查看了
```
通过以下代码
```
hexo new "文章名" #新建文章
hexo new page "页面名" #新建页面   
```
```
以下为简写
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```
新建一篇文章后就可以预览了,在hexo new之后执行一次生成hexo g再执行hexo s启动本地服务器,如果之前还在hexo s 按Ctrl + C 结束.

5. 添加主题
hexo 网站中有很多 主题模板，根据个人喜欢挑选，
```
本站采用star最多的 next主题 
hexo clean
git clone https://github.com/iissnan/hexo-theme-next themes/next 
```

6. 更新主题
```
cd themes/next
git pull
hexo g
hexo s
```
7. 使用Hexo deploy部署到github
还是编辑根目录下_config.yml文件 （是根目录下的这个文件，在themes文件夹中有个同名的文件，那个是修改主题配置的不要搞混了）

deploy:
    type: git
    repo: git@github.com:cczeng/cczeng.github.io.git  #这里的网址填你自己的
    branch: master  

保存后需要提前安装一个扩展：
npm install hexo-deployer-git --save 

8. 部署到 github  检查SSH keys的设置
```
以下命令均是在Git bash里输入
cd ~/.ssh
ls
#此时会显示一些文件
mkdir key_backup
cp id_rsa* key_backup
rm id_rsa*  
#以上三步为备份和移除原来的SSH key设置
ssh-keygen -t rsa -C "邮件地址@youremail.com" #生成新的key文件,邮箱地址填你的Github地址
#Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa):<回车就好>
#接下来会让你输入密码
```
之后就可以看到成功的界面。
9. 添加SSH Key到Github

<img src="https://s2.ax1x.com/2019/03/14/AAhMJx.png" alt="AAhMJx.png" border="0" />
<img src="https://s2.ax1x.com/2019/03/14/AAhQW6.png" alt="AAhQW6.png" border="0" />
<img src="https://s2.ax1x.com/2019/03/14/AAhKF1.png" alt="AAhKF1.png" border="0" />
<img src="https://s2.ax1x.com/2019/03/14/AAh1SK.png" alt="AAh1SK.png" border="0" />

10. 到了这就可以测试一下是否成功了:

ssh -T git@github.com
#之后会要你输入yes/no,输入yes就好了。
11. 设置你的账号信息:
```
git config --global user.name "你的名字"     #真实名字不是github用户名
git config --global user.email "邮箱@邮箱.com"    #github邮箱
```
12. 完成部署到github
hexo d
这时再刷新 username.github.io 就可以看到你的博客了。

ps：还有很多坑要填，这文章漏洞很大，主要为了方便我自己看，以免以后忘记如何搭建。
