---
title: vue 响应式
date: 2019-05-21 13:34:00
tags: vue
categories: vue
---

## vue 响应式

响应式更新主要涉及到Watcher，Dep，Observer这几个主要类。

### 提出的问题

* Watcher，Dep，Observer这几个类之间的关系？
* Dep中的 subs 存储的是什么？
* Watcher中的 deps 存储的是什么？
* Dep.target 是什么，该值是何处赋值的？

### 从实例入手

```javascript
var vue = new Vue({
    el: "#app",
    data: {
        counter: 1
    }
})
```
instance/index.js this._init() --> instance/init.js --> initState()

```javascript
initLifecycle(vm) // vm生命周期相关变量初始化操作
initEvents(vm) // vm事件相关初始化
initRender(vm) // 模板解析相关初始化
callHook(vm, 'beforeCreate') // 调用beforeCreate钩子函数
initInjections(vm) // resolve injections before data/props 
initState(vm) // vm状态初始化(重点在这里)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created') // 调用created钩子函数
```
instance/state.js 这个文件 主要 实现了 props methods data watch computed 的初始化，
--> instance/state.js initState() --> initData() --> getData() 这是一条路子
这里把所有的 data 函数 ，全部转回纯对象

initData()最后 执行 observe(data,true) 
此时的 data 已经是 纯对象了

--> observer/index.js observe(data,true) --> new Observer(value)

每个 Observer 实例 都有 三个 私有属性：
* value   存放 __ob__ 属性,值为 this 即 Observer 的实例,
* dep   Dep 实例对象
* vmCount   一个计数

同时 这个 __ob__ 中 存放 this ，this 即  Observer 的实例 中又有 value、dep、vmcount。

Observer 类中最核心的调用时 `walk` 方法和 `observeArray` 方法,

--> defineReactive(obj,keys[i])

最终将对应数据转为getter/setter的方法就是defineReactive()方法

内有一个私有变量 dep 为 Dep 实例，每一个 data 中的属性，都有与之对应的唯一的 dep

而 dep 是 Watcher 实例的框子

<img src="https://s2.ax1x.com/2019/05/21/EzIlCT.png" alt="EzIlCT.png" border="0" />

### Watcher

instance/state.js initWatch(vm,watch) --> createWatcher(vm,key,handler) --> instance/state.js vm.$watch(...) --> observer/watcher.js new Watcher(...)

<img src="https://s2.ax1x.com/2019/05/21/EzODu8.png" alt="EzODu8.png" border="0" />

### Dep

`Dep`可以比喻为出版社，`Watcher`好比读者，`Observer`好比相关书籍。
比如读者`w1`对一本书(即一个Observer)感兴趣，读者`w1`一旦要买这本书，（心愿单中）（`Dep`实例）里面就有`w1`信息，一旦该出版社有了这本书最新消息（比如优惠折扣）就会通知`w1`。

Dep类比较简单，对应方法也非常直观，这里最主要的就是维护了保存有观察者实例watcher的一个数组subs。

### 总结

* Watcher，Dep，Observer这几个类之间的关系？
`Watcher`是观察者,观察经过`Observer`封装过的数据，`Dep`是`Watcher`和观察数据间的纽带，主要起到依赖收集和通知更新的作用。

* Dep中的subs存储的是什么？
`subs`存储的是观察者`Watcher`实例。

* Watcher中的deps存储的是什么？
`deps`存储的是观察数据闭包中的`dep`实例。

* Dep.target是什么， 该值是何处赋值的？
`Dep.target`是全局变量，保存当前的`watcher`实例，在`new Watcher()`的时候进行赋值，赋值为当前`Watcher`实例。

<img src="https://s2.ax1x.com/2019/05/22/V9aPDe.png" alt="V9aPDe.png" border="0" />
 