---
title: vue 响应式基本原理
date: 2019-05-17 17:56:00
tags: vue
categories: vue
---

## vue 响应式基本原理

在 Vue 中，我们可以使用 $watch 观测一个字段，当字段的值发生变化的时候执行指定的观察者，如下：
```javascript
const ins = new Vue({
  data: {
    a: 1
  }
})
ins.$watch('a', () => {
  console.log('修改了 a')
})
```
这样当我们试图修改 a 的值时：ins.a = 2，在控制台将会打印 '修改了 a'。

### 自己动手

首先我们想到的是 
```javascript
Object.defineProperty(data, 'a', {
  set () {
    console.log('设置了属性 a')
  },
  get () {
    console.log('读取了属性 a')
  }
})
```
能不能在获取属性 a 的时候收集依赖，然后在设置属性 a 的时候触发之前收集的依赖呢？
```javascript
// dep 数组就是我们所谓的“筐”
const dep = []
Object.defineProperty(data, 'a', {
  set () {
    // 当属性被设置的时候，将“筐”里的依赖都执行一次
    dep.forEach(fn => fn())
  },
  get () {
    // 当属性被获取的时候，把依赖放到“筐”里
    dep.push(fn)
  }
})
```
常量 `dep`，它是一个数组，这个数组就是我们所说的“筐”，当获取属性 `a` 的值时将触发 get 函数，在 get 函数中，我们将收集到的依赖放入“筐”内，当设置属性 `a` 的值时将触发 set 函数，在 set 函数内我们将“筐”里的依赖全部拿出来执行。

我们知道 $watch 函数接收两个参数，第一个参数是一个字符串，即数据字段名,比如 'a'，第二个参数是依赖该字段的函数

```javascript
$watch('a', () => {
  console.log('设置了 a')
})
```

重点在于 $watch 函数是知道当前正在观测的是哪一个字段的，所以在 $watch 函数中读取该字段的值，从而触发字段的 get 函数，同时将依赖收集，如下代码：

```javascript
const data = {
  a: 1
}
const dep = []
Object.defineProperty(data, 'a', {
  set () {
    dep.forEach(fn => fn())
  },
  get () {
    // 此时 Target 变量中保存的就是依赖函数
    dep.push(Target)
  }
})
// Target 是全局变量
let Target = null
function $watch (exp, fn) {
  // 将 Target 的值设置为 fn
  Target = fn
  // 读取字段值，触发 get 函数
  data[exp]
}
// 调用 $watch
$watch('a', () => {
  console.log('第一个依赖')
})
$watch('a', () => {
  console.log('第二个依赖')
})

// 尝试
data.a = 3 
// 打印控制台
```

当然这里面还存在一些问题，首先 get 函数 没有 return ，其次，我们这边只能访问 a ，没有其他属性，我们进行修改

```javascript
const data = {
  a: 1,
  b: 1
}
for (let key in data) {
  const dep = []
  let val = data[key] // 缓存字段原有的值
  Object.defineProperty(data, key, {
    set (newVal) {
      // 如果值没有变什么都不做
      if (newVal === val) return
      // 使用新值替换旧值
      val = newVal
      dep.forEach(fn => fn())
    },
    get () {
      dep.push(Target)
      return val  // 将该值返回
    }
  })
}
```
对于以上对象结构，我们的程序只能把 data.a 字段转换成响应式属性，而 data.a.b 依然不是响应式属性，但是这个问题还是比较容易解决的，只需要递归定义即可：
```javascript
const data = {
  a: {
    b: 1
  }
}
function walk (data) {
  for (let key in data) {
    const dep = []
    let val = data[key]
    // 如果 val 是对象，递归调用 walk 函数将其转为访问器属性
    const nativeString = Object.prototype.toString.call(val)
    if (nativeString === '[object Object]') {
      walk(val)
    }
    Object.defineProperty(data, key, {
      set (newVal) {
        if (newVal === val) return
        val = newVal
        dep.forEach(fn => fn())
      },
      get () {
        dep.push(Target)
        return val
      }
    })
  }
}
// 调用 walk 函数
walk(data)

function $watch (exp, fn) {
  // 将 Target 的值设置为 fn
  Target = fn
  // 读取字段值，触发 get 函数
  data[exp]
}

$watch('a.b', () => {
  console.log('修改了字段 a.b')
})
```
上面代码 我们 通过 nativeString 对 data数据进行 检测 ，如果是 对象，则递归调用。
但上面的代码还是无法执行 如果按照 $watch('a.b', fn) 这样调用 $watch 函数，那么 data[exp] 等价于 data['a.b']
正确的读取字段值的方式应该是 data['a']['b']。所以我们需要稍微做一点小小的改造：
```javascript
const data = {
  a: {
    b: 1
  }
}
function $watch (exp, fn) {
  Target = fn
  let pathArr,
      obj = data
  // 检查 exp 中是否包含 .
  if (/\./.test(exp)) {
    // 将字符串转为数组，例：'a.b' => ['a', 'b']
    pathArr = exp.split('.')
    // 使用循环读取到 data.a.b
    pathArr.forEach(p => {
      obj = obj[p]
    })
    return
  }
  data[exp]
}
```
对 $watch 函数做了一些改造，首先检查要读取的字段是否包含 .，如果包含 . 说明读取嵌套对象的字段，这时候我们使用字符串的 split('.') 函数将字符串转为数组，所以如果访问的路径是 a.b 那么转换后的数组就是 ['a', 'b']

然后使用一个循环从而读取到嵌套对象的属性值，不过需要注意的是读取到嵌套对象的属性值之后应该立即 return，不需要再执行后面的代码。

如果 watch 第一个参数是函数呢 
```javascript
const data = {
  name: '朱育仪',
  age: 23
}
function render () {
  return document.write(`姓名：${data.name}; 年龄：${data.age}`)
}
$watch(render, render)
```
对 watch 进行更改
```javascript
function $watch (exp, fn) {
  Target = fn
  let pathArr,
      obj = data
  // 如果 exp 是函数，直接执行该函数
  if (typeof exp === 'function') {
    exp()
    return
  }
  if (/\./.test(exp)) {
    pathArr = exp.split('.')
    pathArr.forEach(p => {
      obj = obj[p]
    })
    return
  }
  data[exp]
}
```
检测了 exp 的类型，如果是函数则直接执行之，由于 render 函数的执行会触发数据字段的 get 拦截器，所以依赖会被收集。同时我们要注意传递给 $watch 函数的第二个参数：

```javascript
$watch(render, render)
```
最终完整的代码
```javascript
const data = {
  name: '朱育仪',
  age: 23
}
function render () {
  return document.write(`姓名：${data.name}; 年龄：${data.age}`)
}
function walk (data) {
  for (let key in data) {
    const dep = []
    let val = data[key]
    // 如果 val 是对象，递归调用 walk 函数将其转为访问器属性
    const nativeString = Object.prototype.toString.call(val)
    if (nativeString === '[object Object]') {
      walk(val)
    }
    Object.defineProperty(data, key, {
      set (newVal) {
        if (newVal === val) return
        val = newVal
        dep.forEach(fn => fn())
      },
      get () {
        dep.push(Target)
        return val
      }
    })
  }
}
// 调用 walk 函数
walk(data)

function $watch (exp, fn) {
  Target = fn
  let pathArr,
      obj = data
  // 如果 exp 是函数，直接执行该函数
  if (typeof exp === 'function') {
    exp()
    return
  }
  if (/\./.test(exp)) {
    pathArr = exp.split('.')
    pathArr.forEach(p => {
      obj = obj[p]
    })
    return
  }
  data[exp]
}

$watch(render, render)
```
