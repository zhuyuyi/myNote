---
title: vue部分源码解析
date: 2019-05-07 19:43:00
tags: vue
categories: vue
---

## vue 部分源码解析

`vue`是一个`MVVM`框架
数据代理、模板解析、数据绑定

（1）数据代理：通过一个对象对另一个对象中属性的操作。
（2）vue数据代理：通过`vm`对象来代理`data`对象中所有属性的操作

##### 一、为什么最终 strats.data 会被处理成一个函数？
这是因为，通过函数返回数据对象，保证了每个组件实例都有一个唯一的数据副本，避免了组件间数据互相影响。后面讲到 Vue 的初始化的时候大家会看到，在初始化数据状态的时候，就是通过执行 strats.data 函数来获取数据并对其进行处理的。

##### 二、为什么不在合并阶段就把数据合并好，而是要等到初始化的时候再合并数据？
这个问题是什么意思呢？我们知道在合并阶段 strats.data 将被处理成一个函数，但是这个函数并没有被执行，而是到了后面初始化的阶段才执行的，这个时候才会调用 mergeData 对数据进行合并处理，那这么做的目的是什么呢？

其实这么做是有原因的，后面讲到 Vue 的初始化的时候，大家就会发现 inject 和 props 这两个选项的初始化是先于 data 选项的，这就保证了我们能够使用 props 初始化 data 中的数据，如下：
``` javascript
// 子组件：使用 props 初始化子组件的 childData 
const Child = {
  template: '<span></span>',
  data () {
    return {
      childData: this.parentData
    }
  },
  props: ['parentData'],
  created () {
    // 这里将输出 parent
    console.log(this.childData)
  }
}

var vm = new Vue({
    el: '#app',
    // 通过 props 向子组件传递数据
    template: '<child parent-data="parent" />',
    components: {
      Child
    }
})
```
* 1、由于 props 的初始化先于 data 选项的初始化
* 2、data 选项是在初始化的时候才求值的，你也可以理解为在初始化的时候才使用 mergeData 进行数据合并。
