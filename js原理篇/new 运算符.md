---
title: new 运算符
date: 2019-02-06 13:08:40
tags: javascript语法
categories: js
---

## new 运算符

<img src="https://s2.ax1x.com/2019/03/14/AAiNlT.md.jpg" alt="AAiJf0.jpg" border="0" class="full-image" />
<!--more-->

```javascript
var obj  = {};
obj.__proto__ = F.prototype;
F.call(obj);
```
第一行，我们创建了一个空对象obj;

第二行，我们将这个空对象的__proto__成员指向了F函数对象prototype成员对象;

第三行，我们将F函数对象的this指针替换成obj，然后再调用F函数.

总结上面的例子

1、创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。

2、属性和方法被加入到 this 引用的对象中。

3、新创建的对象由 this 所引用，并且最后隐式的返回 this.