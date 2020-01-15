---
title: beginPath、closePath
date: 2020-01-15 16:22:00
tags: canvas
categories: canvas
---

## beginPath、closePath


### 例子

```javascript
    ctx.beginPath();
    ctx.moveTo(100.5,20.5);
    ctx.lineTo(200.5,20.5);
    ctx.strokeStyle = 'black';//默认strokeStyle='black', lineWidth=1, 此处可省略
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100.5,40.5);
    ctx.lineTo(200.5,40.5);
    ctx.strokeStyle = 'red';
    ctx.stroke();
```
结果：<img src="https://s2.ax1x.com/2020/01/15/lOX8DP.png" alt="lOX8DP.png" border="0" />

### 去掉第2个beginPath()
```javascript
    ctx.beginPath();
    ctx.moveTo(100.5,20.5);
    ctx.lineTo(200.5,20.5);
    ctx.strokeStyle = 'black';//默认strokeStyle='black', lineWidth=1, 此处可省略
    ctx.stroke();

    // ctx.beginPath();
    ctx.moveTo(100.5,40.5);
    ctx.lineTo(200.5,40.5);
    ctx.strokeStyle = 'red';
    ctx.stroke();
```
结果：<img src="https://s2.ax1x.com/2020/01/15/lXiKds.png" alt="lXiKds.png" border="0" />

1. beginPath

* `canvas`中的绘制方法（如`stroke`, `fill`），都会以“上一次`beginPath`”之后的所有路径为基础进行绘制。
* 这里`stroke`了两次，都是以第一次`beginPath`后的所有路径为基础画的。
* 不管你用`moveTo`把画笔移动到哪里，只要不`beginPath`，那你一直都是在画一条路径（注：此处『一条路径』并非指连在一起）
`fillRect`与`strokeRect`这种直接画出独立区域的函数，也不会打断当前的`path`.

2. closePath

* `closePath`的意思不是结束路径，而是关闭路径，它会试图从当前路径的终点连一条路径到起点，让整个路径闭合起来。
* 但是，这并不意味着它之后的路径就是新路径了。
* 与`beginPath`几乎没有关系：不要企图通过闭合现有路径来开始一条新路径，而开始一条新路径，以前的路径也不会闭合。

### 圆弧例子
```javascript
ctx.strokeStyle = "#005588";
for (var i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(50 + i * 100, 60, 40, 0, 2 * Math.PI * (i + 1) / 10);
    ctx.closePath();
    ctx.stroke();
}
```
结果：

### 去掉 closePath()

结果：

### 同时去掉beginPath()和closePath()

结果：
可见，在这种情况下，每个弧画完都会连到下一个弧的起点

### 只去掉beginPath()

结果：
在这种情况下，每个弧画完都会先回到第一个弧的起点，然后再连到下一个弧的起点

### stroke()改为fill()
结果：

#### 去掉closePath()

结果：
无论是否closePath()，结果都一样。
因为closePath()对于fill()是没有用的：无论是否closePath()，调用fill()时，canvas会自动把没有封闭的路径首尾相连，之后进行填充

