---
title: chrome浏览器中查看闭包
date: 2019-03-18 18:23:32
tags: javascript原理
categories: js
---
## chrome浏览器中查看闭包

### 例子1

```javascript
// demo01
var fn;
function foo() {
    var a = 2;
    function baz() {
        console.log( a );
    }
    fn = baz;
}
function bar() {
    fn();
}
foo();
bar(); // 2
```
第一步：设置断点，然后刷新页面。
<img src="https://s2.ax1x.com/2019/03/18/AmI2RJ.png" alt="AmI2RJ.png" border="0" />

第二步：点击上图红色箭头指向的按钮（step into），该按钮的作用会根据代码执行顺序，一步一步向下执行。在点击的过程中，我们要注意观察下方call stack 与 scope的变化，以及函数执行位置的变化。

<img src="https://s2.ax1x.com/2019/03/18/AmIgG4.png" alt="AmIgG4.png" border="0" />

我们可以看到，在chrome工具的理解中，由于在foo内部声明的baz函数在调用时访问了它的变量a，因此foo成为了闭包。这好像和我们学习到的知识不太一样。我们来看看在《你不知道的js》这本书中的例子中的理解。

<img src="https://s2.ax1x.com/2019/03/18/AmIRz9.png" alt="AmIRz9.png" border="0" />

你不知道的js中的例子
书中的注释可以明显的看出，作者认为fn为闭包。即baz，这和chrome工具中明显是不一样的。
而在备受大家推崇的《JavaScript高级编程》一书中，是这样定义闭包。

<img src="https://s2.ax1x.com/2019/03/18/AmIhs1.png" alt="AmIhs1.png" border="0" />

书中作者将自己理解的闭包与包含函数所区分
这里chrome中理解的闭包，与我所阅读的这几本书中的理解的闭包不一样。具体这里我先不下结论，但是我心中更加偏向于相信chrome浏览器。

### 例子2

我们修改一下demo01中的例子，来看看一个非常有意思的变化。

```javascript
// demo02
var fn;
var m = 20;
function foo() {
    var a = 2;
    function baz(a) {
        console.log(a);
    }
    fn = baz;
}
function bar() {
    fn(m);
}
foo();
bar(); // 20
```
<img src="https://s2.ax1x.com/2019/03/18/AmI4qx.png" alt="AmI4qx.png" border="0" />

闭包没了，作用域链中没有包含foo了。
是不是结果有点意外，闭包没了，作用域链中没有包含foo了。我靠，跟我们理解的好像又有点不一样。所以通过这个对比，我们可以确定闭包的形成需要两个条件。

在函数内部创建新的函数；
新的函数在执行时，访问了函数的变量对象；
还有更有意思的。

### 例子3

我们继续来看看一个例子。

```javascript
// demo03
function foo() {
    var a = 2;
    return function bar() {
        var b = 9;
        return function fn() {
            console.log(a);
        }
    }
}
 
var bar = foo();
var fn = bar();
fn();
```
在这个例子中，fn只访问了foo中的a变量，因此它的闭包只有foo。

<img src="https://s2.ax1x.com/2019/03/18/AmIodK.png" alt="AmIodK.png" border="0" />

闭包只有foo
修改一下demo03，我们在fn中也访问bar中b变量试试看。

### 例子4

```javascript
// demo04
function foo() {
    var a = 2;
    return function bar() {
        var b = 9;
        return function fn() {
            console.log(a, b);
        }
    }
}
 
var bar = foo();
var fn = bar();
fn();
```
<img src="https://s2.ax1x.com/2019/03/18/AmIIZ6.png" alt="AmIIZ6.png" border="0" />

这个时候闭包变成了两个
这个时候，闭包变成了两个。分别是bar，foo。

### 个人性总结

1. 闭包是在函数被调用执行的时候才被确认创建的。
2. 闭包的形成，与作用域链的访问顺序有直接关系。
3. 只有内部函数访问了上层作用域链中的变量对象时，才会形成闭包，因此，我们可以利用闭包来访问函数内部的变量。

