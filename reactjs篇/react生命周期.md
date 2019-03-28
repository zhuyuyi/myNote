---
title: react生命周期
date: 2019-03-28 15:06:00
tags: react
categories: react
---

## react 生命周期

### 组件创建阶段

组件创建阶段的生命周期函数，有一个显著的特点：创建阶段的生命周期函数，在组件的一辈子中只执行一次；

componentWillMount：组件将要被挂载，此时还没有开始渲染虚拟DOM 

render：第一次开始渲染真正的虚拟DOM，当render执行完，内存中就有了完整的虚拟DOM了。

componentDidMount：组件完成了挂载，此时，组件已经显示到页面上，当这个方法执行完，组件就进入到 运行中 的状态。

### 组件运行中阶段

componentWillReceiveProps:组件将要接受新属性，此时，只要这个方法被触发，就证明父组件为当前子组件传递了新的属性值；
shouldComponentUpdate:组件是否需要更新，此时，组件尚未被更新，但是，state 和 props 肯定是最新的
componentWillUpdate：组件将要被更新，此时，内存中的虚拟DOM树还是旧的，此时又要重新根据新的 state 和 props 重新渲染一棵内存中的 虚拟 DOM 树 ，当render调用完毕，内存中的 旧DOM 树已经被 新 DOM 树 替换了，此时页面还是旧的
componentDidUpdate：此时页面被重新渲染了，state 和 虚拟 DOM 和 页面已经完全保持同步。
