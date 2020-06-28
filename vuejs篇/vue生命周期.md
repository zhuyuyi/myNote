---
title: vue生命周期
date: 2019-03-28 11:55:00
tags: vue
categories: vue
---

## vue 生命周期
<img src="https://s2.ax1x.com/2019/03/28/AdXXLT.png" alt="AdXXLT.png" border="0" />
<!--more-->
八个生命周期

beforeCreate
created
beforeMount
mounted
beforeUpdate
updated
beforeDestroy
destroyed

生命周期钩子 | 组件状态 | 最佳实践  
-|-|-
beforeCreate | 实例初始化之后，this指向创建的实例，不能访问到data、computed、watch、methods上的方法和数据 | 常用于初始化非响应式变量 |
created | 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到$el属性，$ref属性内容为空数组 | 常用于简单的ajax请求，页面的初始化 |
beforeMount | 在挂载开始之前被调用，beforeMount之前，会找到对应的template，并编译成render函数 | – |
mounted | 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，$ref属性可以访问 | 常用于获取VNode信息和操作，ajax请求 |
beforeupdate | 响应式数据更新时调用，发生在虚拟DOM打补丁之前 | 适合在更新之前访问现有的DOM，比如手动移除已添加的事件监听器 |
updated | 虚拟 DOM 重新渲染和打补丁之后调用，组件DOM已经更新，可执行依赖于DOM的操作 | 避免在这个钩子函数中操作数据，可能陷入死循环 |
beforeDestroy | 实例销毁之前调用。这一步，实例仍然完全可用，this仍能获取到实例 | 常用于销毁定时器、解绑全局事件、销毁插件对象等操作 |
destroyed | 实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁 | – |


### beforeCreate 和 created 之间的生命周期

在beforeCreate和created钩子函数之间的生命周期
在这个生命周期之间，进行初始化事件，进行数据的观测，可以看到在created的时候数据已经和data属性进行绑定（放在data中的属性当值发生改变的同时，视图也会改变）。
此时，还没有初始化 el 虚拟 DOM 和 DOM 都没有绑定

### created 钩子函数和 beforeMount 间的生命周期

首先会判断对象是否有el选项。如果有的话就继续向下编译，如果没有el选项，则停止编译，也就意味着停止了生命周期，直到在该vue实例上调用vm.$mount(el)

（1）.如果vue实例对象中有template参数选项，则将其作为模板编译成render函数。
（2）.如果没有template选项，则将外部HTML作为模板编译。
（3）.可以看到template中的模板优先级要高于outer HTML的优先级。

### beforeMount 和 mounted 钩子函数间的生命周期

可以看到此时是给vue实例对象添加$el成员，并且替换掉挂在的DOM元素。因为在之前console中打印的结果可以看到beforeMount之前el上还是undefined。

### mounted

在mounted之前，比如：h1中还是通过{{message}}进行占位的，因为此时还有挂在到页面上，还是JavaScript中的虚拟DOM形式存在的。在mounted之后可以看到h1中的内容发生了变化。

### beforeUpdate 钩子函数和 updated 钩子函数间的生命周期

当vue发现data中的数据发生了改变，会触发对应组件的重新渲染，先后调用beforeUpdate和updated钩子函数

### beforeDestroy 和 destroyed 钩子函数间的生命周期

beforeDestroy钩子函数在实例销毁之前调用。在这一步，实例仍然完全可用。
destroyed钩子函数在Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁