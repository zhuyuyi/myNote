---
title: canvas基础
date: 2020-01-15 14:15:00
tags: canvas
categories: canvas
---

## canvas基础

### 简介
`Canvas`是 `HTML5` 新增的，一个可以使用脚本(通常为`JavaScript`)在其中绘制图像的 `HTML` 元素。它可以用来制作照片集或者制作简单(也不是那么简单)的动画，甚至可以进行实时视频处理和渲染。
`Canvas`是由`HTML`代码配合高度和宽度属性而定义出的可绘制区域。`JavaScript`代码可以访问该区域，类似于其他通用的二维API，通过一套完整的绘图函数来动态生成图形。

### canvas 可以做什么
绘制图表、小游戏、活动页面、小特效、炫酷背景

### canvas 与 svg 之间的比较
canvas|svg
-|-
依赖分辨率（位图）|不依赖分辨率（矢量图）
单个 HTML 元素|每一个图形都是一个 DOM 元素
只能通过脚本语言绘制图形|可以通过 CSS 也可以通过脚本语言绘制
不支持事件处理程序|支持事件处理程序
对象数量较大（>10k）时性能最佳|对象数量较小 (<10k)、图面更大时性能更佳

### canvas 元素节点api
let ctx = canvas.getContent('2d');
canvas.toBlob();
canvas.toDataURL();

### 矩形
```javascript 
ctx.fillRect( x , y , width , height)  // 填充以(x,y)为起点宽高分别为width、height的矩形 默认为黑色

stokeRect( x , y , width , height) // 绘制一个空心以(x,y)为起点宽高分别为width、height的矩形

clearRect( x, y , width , height ) // 清除以(x,y)为起点宽高分别为width、height的矩形 为透明
```

### 路径
```javascript
beginPath() // 新建一条路径一旦创建成功 绘制命令将转移到新建的路径上

moveTo( x, y ) // 移动画笔到(x , y) 点开始后面的绘制工作

lineTo( x, y ) // 从起始点绘画至(x , y)

closePath() // 关闭该路径 将绘制指令重新转移到上下文

stroke() // 将绘制的路径进行描边

fill() // 将绘制的封闭区域进行填充
```

### 圆弧
```javascript
arc( x , y , r , startAngle , endAngle ,  anticlosewise ) // 以(x,y)为圆心 r为半径的圆  绘制startAngle弧度 到endAngle弧度的圆弧 anticlosewise默认为false 即顺时针方向 true为逆时针方向

arcTo( x1 , y1 , x2 , y2 , radius ) // 根据 两个控制点 (x1,y1) 和 (x2, y2)以及半径绘制弧线 同时连接两个控制点
```

### 贝塞尔曲线
```javascript
quadraticCurveTo( cp1x, cp1y , x ,y )   // (cp1x,cp1y) 控制点    (x,y)结束点   二次曲线

bezierCurveTo( cp1x, cp1y ,cp2x , cp2y ,x , y )//（cp1x,cp1y）控制点1   (cp2x,cp2y) 控制点2  (x,y)结束点   三次曲线
```

### 样式添加
```javascript
fillStyle = color

strokeStyle = color // color 可以为颜色值、渐变对象(并非样式！！！！)

lineWidth  = value  // 线宽 number

lineCap = type //（butt 、 round 、square）线条末端样式   依次是方形、圆形&突出、方形&突出

lineJoin = type //（round 、bevel 、 miter）线条交汇处样式 依次是圆形、平角 、 三角形

ctx.setLineDash([ 实际长度 , 间隙长度 ]) // 虚线 setLineDash接受数组

ctx.lineDashOffet  // 设置偏移量

```
### 渐变
```javascript
var gradient = ctx.createLinearGradient( x1 ,y1 ,x2 ,y2); // 线性渐变 x1 y1 渐变开始点   x2 y2 渐变结束点

var gradient = ctx.createRadialGradient(x1 ,y1 ,r1 ,x2 ,y2 ,r2);//径向渐变

gradient.addColorStop( position , color )// position:相对位置0~1    color:该位置下的颜色
```

### 透明度
```javascript
ctx.globalAlpha = value (0~1)
```

### 文本
```javascript
fillText( text , x , y , [,maxWidth])  // 在(x,y)位置绘制text文本  最大宽度为maxWidth(可选)

strokeText( text ,x ,y ,[,maxWidth])  // 在(x,y)位置绘制text文本边框  最大宽度为maxWidth(可选)

font = value               // eg:"100px sans-serif"
```

### 图片
```javascript
drawImage( image , x , y , width , height ) // image为图片对象、从(x,y)处放置宽高分别为width height的图片

drawImage( image , sx , sy , swidth , sheight ,dx ,dy ,dwidth ,dheight) // 切片前四个是定义图像源的切片位置和大小   后四个是定期切片的目标显示位置大小
```

### 状态保存 恢复
```javascript
save()

restore()
```

### 动作
```javascript
translate( x , y )  // 将canvas原点的移动到 (x,y)     （save&restore保存初始状态！！！）

rotate( angle )   // 顺时针方向旋转坐标轴 angle弧度

scale(x,y)   // 将图形横向缩放x倍、纵向缩放y倍   （ x、y大于1是放大  小于1为缩放！！！）
```



1、我们常用的
2、我们难以理解的
3、神奇的

问题：
1、算法
2、报错

建议：
1、多看
2、自己慢慢尝试