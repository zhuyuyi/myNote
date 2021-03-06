---
title: js单线程与异步
date: 2019-02-03 18:08:40
tags: javascript原理
categories: js
---
## js单线程与异步

js单线程却能实现多线程的异步操作，这归功于js的运行环境，即宿主环境如：浏览器、node他们能实现异步,他们是多线程的。
浏览器只分给 js 一个主线程，来执行函数，在这个主线程任务队列中，每一个任务排列好顺序依次执行。但由于 js 中有许多任务十分耗时，如：http请求、定时器、浏览器事件触发线程。
<img src="https://s2.ax1x.com/2019/03/13/Ak50XD.png" alt="Ak50XD.png" border="0" class="full-image" />
<!--more-->

### 浏览器 线程

用户界面(User Interface) - 包括地址栏、前进/后退按钮、书签菜单等。除了浏览器主窗口显示的您请求的页面外，其他显示的各个部分都属于用户界面。

浏览器引擎(Browser engine) - 在用户界面和呈现引擎之间传送指令。

呈现引擎(Rendering engine) - 负责显示请求的内容。如果请求的内容是 HTML，它就负责解析 HTML 和 CSS 内容，并将解析后的内容显示在屏幕上。

网络(Networking) - 用于网络调用，比如 HTTP 请求。其接口与平台无关，并为所有平台提供底层实现。

用户界面后端(UI Backend) - 用于绘制基本的窗口小部件，比如组合框和窗口。其公开了与平台无关的通用接口，而在底层使用操作系统的用户界面方法。

JavaScript 解释器(JavaScript Interpreter)。用于解析和执行 JavaScript 代码。

数据存储(Data Persistence)。这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie。新的 HTML 规范 (HTML5) 定义了“网络数据库”，这是一个完整（但是轻便）的浏览器内数据库。

### 浏览器引擎

Trident：俗称 IE 内核，也被叫做 MSHTML 引擎，目前在使用的浏览器有 IE11 -，以及各种国产多核浏览器中的 IE 兼容模块。另外微软的 Edge 浏览器不再使用 MSHTML 引擎，而是使用类全新的引擎 EdgeHTML。

Gecko：俗称 Firefox 内核，Netscape6 开始采用的内核，后来的 Mozilla FireFox（火狐浏览器）也采用了该内核，Gecko 的特点是代码完全公开，因此，其可开发程度很高，全世界的程序员都可以为其编写代码，增加功能。因为这是个开源内核，因此受到许多人的青睐，Gecko 内核的浏览器也很多，这也是 Gecko 内核虽然年轻但市场占有率能够迅速提高的重要原因。

Presto：Presto 是挪威产浏览器 opera 的 “前任” 内核，最新的 opera 浏览器内核现为 Blink。

Webkit：Safari 内核，也是 Chrome 内核原型，主要是 Safari 浏览器在使用的内核，也是特性上表现较好的浏览器内核。也被大量使用在移动端浏览器上。

Blink： 由 Google 和 Opera Software 开发，在Chrome（28及往后版本）、Opera（15及往后版本）和Yandex浏览器中使用。Blink 其实是 Webkit 的一个分支，添加了一些优化的新特性，例如跨进程的 iframe，将 DOM 移入 JavaScript 中来提高 JavaScript 对 DOM 的访问速度等，目前较多的移动端应用内嵌的浏览器内核也渐渐开始采用 Blink。

### javascript 解析器

用来解析 javascript 代码，对于静态语言来说（如Java、C++、C），处理上述这些事情的叫编译器（Compiler），相应地对于 JavaScript 这样的动态语言则叫解释器（Interpreter）。这两者的区别用一句话来概括就是：编译器是将源代码编译为另外一种代码（比如机器码，或者字节码），而解释器是直接解析并将代码运行结果输出。 

为了利用多核 CPU 的计算能力，在 HTML5 中引入的工作线程使得浏览器端的 JavaScript 引擎可以并发地执行 JavaScript 代码，从而实现了对浏览器端多线程编程的良好支持。Web Worker 允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM 。所以，这个新标准并没有改变 JavaScript 单线程的本质。

由于 JavaScript 是可操纵 DOM 的，如果在修改这些元素属性同时渲染界面（即 JavaScript 线程和 UI 线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。为了防止渲染出现不可预期的结果，浏览器设置 UI 渲染线程与 JavaScript 引擎线程为互斥的关系，当 JavaScript 引擎线程执行时 UI 渲染线程会被挂起，UI 更新会被保存在一个队列中等到 JavaScript 引擎线程空闲时立即被执行。

### 其他线程

浏览器事件触发线程：当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理。这些事件可以是当前执行的代码块如定时任务、也可来自浏览器内核的其他线程如鼠标点击、AJAX 异步请求等，但由于 JavaScript 的单线程关系所有这些事件都得排队等待 JavaScript 引擎处理；

定时触发器线程：浏览器定时计数器并不是由 JavaScript 引擎计数的, 因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确, 因此通过单独线程来计时并触发定时是更为合理的方案；

异步 HTTP 请求线程：在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求， 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件放到 JavaScript 引擎的处理队列中等待处理；

JavaScript 引擎的工作机制是当线程中没有执行任何同步代码的前提下才会执行异步代码，setTimeout 是异步代码，所以 setTimeout 只能等 JavaScript 引擎空闲才会执行


