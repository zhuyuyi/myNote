---
title: koa 介绍
date: 2019-07-08 14:52:00
tags: koa
categories: koa
---

## koa 介绍

写在前面：https://www.itying.com/koa/article-index-id-80.html（参考文献）
https://www.cnblogs.com/SamWeb/p/8417940.html（参考文献）
https://www.itying.com/koa/（教学视频）

### 简介

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

### async await

`async` 是“异步”（asynchronization）的简写，而 `await` 可以认为是 `async wait` 的简写。所以应该很好理解 `async` 用于申明一个 `function` 是异步的，而 `await` 用于等待一个异步方法执行完成。

简单理解：
`async`是让方法变成异步。
`await`是等待异步方法执行完成。

`async` 会将其后的函数（函数表达式或 Lambda）的返回值封装成一个 `Promise` 对象，而 `await` 会等待这个 `Promise` 完成，并将其 `resolve` 的结果返回出来。

 异步函数也就意味着该函数的执行不会阻塞后面代码的执行

```javascript
async function timeout() {
    return 'hello world'
}
timeout();
console.log('虽然在后面，但是我先执行');

/*
* 虽然在后面，但是我先执行
* undefined
*/
 ```
async 函数返回的是一个promise 对象，如果要获取到promise 返回值，我们应该用then 方法， 继续修改代码

```javascript
async function timeout() {
    return 'hello world'
}
timeout().then(result => {
    console.log(result);
})
console.log('虽然在后面，但是我先执行');

/*
* 虽然在后面，但是我先执行
* hello world
*/
```

```javascript
// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    })
}

async function testResult() {
    let result = await doubleAfter2seconds(30);
    console.log(result);
}

testResult();
```
打开控制台，2s 之后，输出了60. 
调用`testResult` 函数，它里面遇到了`await`, `await` 表示等一下，代码就暂停到这里，不再向下执行了，它等什么呢？等后面的`promise`对象执行完毕，然后拿到`promise resolve` 的值并进行返回，返回值拿到之后，它继续向下执行。具体到 代码 遇到`await` 之后，代码就暂停执行了， 等待`doubleAfter2seconds(30)` 执行完毕，`doubleAfter2seconds(30)` 返回的`promise` 开始执行，2秒 之后，`promise resolve` 了， 并返回了值为60， 这时`await` 才拿到返回值60， 然后赋值给`result`， 暂停结束，代码才开始继续执行，执行 `console.log`语句。

就这一个函数，我们可能看不出async/await 的作用，如果我们要计算3个数的值，然后把得到的值进行输出呢？

```javascript
async function testResult() {
    let first = await doubleAfter2seconds(30);
    let second = await doubleAfter2seconds(50);
    let third = await doubleAfter2seconds(30);
    console.log(first + second + third);
}
```
6秒后，控制台输出220, 我们可以看到，写异步代码就像写同步代码一样了，再也没有回调地域了。

### koa 中间件

通俗的讲：中间件就是匹配路由之前或者匹配路由完成做的一系列的操作，我们就可以把它叫做中间件。

在`express`中间件（Middleware） 是一个函数，它可以访问请求对象`（request object (req)）`, 响应对象`（response object (res)）`, 和 `web` 应用中处理请求-响应循环流程中的中间件，一般被命名为 `next` 的变量。在`Koa`中 中间件和`express`有点类似。

中间件的功能包括：
* 执行任何代码。
* 修改请求和响应对象。
* 终结请求-响应循环。
* 调用堆栈中的下一个中间件。

如果我的`get、post`回调函数中，没有`next`参数，那么就匹配上第一个路由，就不会往下匹配了。如果想往下匹配的话，那么需要写`next()`


