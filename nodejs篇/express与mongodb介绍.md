---
title: express 与 mongodb
date: 2019-05-23 19:08:00
tags: nodejs
categories: nodejs
---

## express 与 mongodb

### mongodb 介绍

mongodb 官网 ：https://www.mongodb.com/

1.安装 mongodb

2.安装 可视化插件 campass ，官方推荐的，我也用过其他的，这个最好。

4.一些小小的介绍，更多的内容还要后续挖掘

schema：模式
model：模型

以巧克力为例：
巧克力加工厂要生产一系列巧克力产品（爱心形、三角形、六边形），这些形状被称为模型，要制作这些模型就需要一定的模式（比如：三角形的三条线的长度、线与线之间的夹角）

5.自带_id,唯一标识，无法修改

6.一些命令行，
命令 | 作用
-|-
show dbs|显示所有的数据库
use zyy | 使用哪个数据库
show collections|看所有的集合
db.zyy.drop()|删除 zyy 集合

我个人觉得 mongodb 与 传统关系型数据库最大的区别是 数据的格式，mongodb 数据存储 形式 类似于 json，对前端开发者更友好，而 mysql 表 则 规规矩矩的。

### express

基于 Node.js 平台，快速、开放、极简的 Web 开发框架
``` javascript
npm install express --save
```
中文文档：http://www.expressjs.com.cn/

#### Express 应用程序生成器

通过应用生成器工具 express-generator 可以快速创建一个应用的骨架。
```javascript
$ npm install express-generator -g
```
#### express 与 koa2

框架名 | 说明 | 对应 | 经典
- | - | - | -
express | web框架 |	es5	| 回调嵌套
koa	| web框架 | es6 | Generator函数+yield语句+Promise
koa2 | web框架 | es7 | async/await+Promise

#### express 主要模块

express用四个主要模块：
模块 | 说明
- | - 
Application | web服务器模块
Request | 请求
Response | 响应
Router | 路由（接口）

#### 跨域的问题与headers

待研究

### mongoose API 简单介绍

mongoose 中文文档：http://mongoosejs.net/docs/guide.html#definition

API | 说明
- | -
save() | 保存到数据库
find() | 查找所有的
findById() | 通过 _id 查找
findOne() | 查找所有的，如果有相同的返回第一个
count() | 数个数
findOneAndUpdate() | 找到第一个然后更新
updateOne() | 更新第一个
where() | 查找在哪儿的意思
gte()\lte | 大于小于

还有更多的 api 请关注：
http://mongoosejs.net/docs/api.html#Model