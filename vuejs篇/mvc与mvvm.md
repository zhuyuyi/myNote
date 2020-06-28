---
title: mvc 与 mvvm 
date: 2019-04-19 15:11:00
tags: mvvm
categories: mvvm
---

## mvc 与 mvvm 

<!--more-->
### MVVM
`Mvvm`定义`MVVM`是`Model-View-ViewModel`的简写。即模型-视图-视图模型。
`【模型】`指的是后端传递的数据。
`【视图】`指的是所看到的页面。
`【视图模型】`mvvm模式的核心，它是连接`view`和`model`的桥梁。
它有两个方向：
一是将`【模型】`转化成`【视图】`，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。
二是将`【视图】`转化成`【模型】`，即将所看到的页面转化成后端的数据。实现的方式是：`DOM` 事件监听。这两个方向都实现的，我们称之为数据的双向绑定。
总结：在`MVVM`的框架下视图和模型是不能直接通信的。它们通过`ViewModel`来通信，`ViewModel`通常要实现一个`observer`观察者，当数据发生变化，`ViewModel`能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，`ViewModel`也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且`MVVM`中的`View` 和 `ViewModel`可以互相通信。`MVVM`流程图如下：
<img src="https://s2.ax1x.com/2019/04/19/EpXCwt.png" alt="EpXCwt.png" border="0" />

### MVC

`MVC`是`Model-View-Controller`的简写。
即模型-视图-控制器。`M`和`V`指的意思和`MVVM`中的`M`和`V`意思一样。`C`即`Controller`指的是页面业务逻辑。使用`MVC`的目的就是将`M`和`V`的代码分离。
`MVC`是单向通信。也就是`View`跟`Model`，必须通过`Controller`来承上启下。
`MVC`和`MVVM`的区别并不是`VM`完全取代了`C`，`ViewModel`存在目的在于抽离`Controller`中展示的业务逻辑，而不是替代`Controller`，其它视图操作业务等还是应该放在`Controller`中实现。也就是说`MVVM`实现的是业务逻辑组件的重用。
由于`mvc`出现的时间比较早，前端并不那么成熟，很多业务逻辑也是在后端实现，所以前端并没有真正意义上的`MVC`模式。而我们今天再次提起MVC，是因为大前端的来到，出现了`MVVM`模式的框架，我们需要了解一下`MVVM`这种设计模式是如何一步步演变过来的。

