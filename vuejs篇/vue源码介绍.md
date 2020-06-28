---
title: vue 源码介绍
date: 2019-07-05 10:24:00
tags: vue
categories: vue
---

## vue 源码介绍（2.6.10）

### 目录结构

```
├── scripts ------------------------------- 构建相关的文件，一般情况下我们不需要动
│   ├── git-hooks ------------------------- 存放git钩子的目录
│   ├── alias.js -------------------------- 别名配置
│   ├── config.js ------------------------- 生成rollup配置的文件
│   ├── build.js -------------------------- 对 config.js 中所有的rollup配置进行构建
│   ├── ci.sh ----------------------------- 持续集成运行的脚本
│   ├── release.sh ------------------------ 用于自动发布新版本的脚本
├── *dist ---------------------------------- 构建后文件的输出目录
├── examples ------------------------------ 存放一些使用Vue开发的应用案例
├── flow ---------------------------------- 类型声明，使用开源项目 [Flow](https://flowtype.org/)
├── packages ------------------------------ 存放独立发布的包的目录
├── test ---------------------------------- 包含所有测试文件
├── *src ----------------------------------- 这个是我们最应该关注的目录，包含了源码
│   ├── compiler -------------------------- 编译器代码的存放目录，将 template 编译为 render 函数
│   ├── *core ------------------------------ 存放通用的，与平台无关的代码
│   │   ├── observer ---------------------- 响应系统，包含数据观测的核心代码
│   │   ├── vdom -------------------------- 包含虚拟DOM创建(creation)和打补丁(patching)的代码
│   │   ├── instance ---------------------- 包含Vue构造函数设计相关的代码
│   │   ├── global-api -------------------- 包含给Vue构造函数挂载全局方法(静态方法)或属性的代码
│   │   ├── components -------------------- 包含抽象出来的通用组件
│   ├── server ---------------------------- 包含服务端渲染(server-side rendering)的相关代码
│   ├── platforms ------------------------- 包含平台特有的相关代码，不同平台的不同构建的入口文件也在这里
│   │   ├── web --------------------------- web平台
│   │   │   ├── entry-runtime.js ---------- 运行时构建的入口，不包含模板(template)到render函数的编译器，所以不支持 `template` 选项，我们使用vue默认导出的就是这个运行时的版本。大家使用的时候要注意
│   │   │   ├── entry-runtime-with-compiler.js -- 独立构建版本的入口，它在 entry-runtime 的基础上添加了模板(template)到render函数的编译器
│   │   │   ├── entry-compiler.js --------- vue-template-compiler 包的入口文件
│   │   │   ├── entry-server-renderer.js -- vue-server-renderer 包的入口文件
│   │   │   ├── entry-server-basic-renderer.js -- 输出 packages/vue-server-renderer/basic.js 文件
│   │   ├── weex -------------------------- 混合应用
│   ├── sfc ------------------------------- 包含单文件组件(.vue文件)的解析逻辑，用于vue-template-compiler包
│   ├── shared ---------------------------- 包含整个代码库通用的代码
├── package.json -------------------------- 不解释
├── yarn.lock ----------------------------- yarn 锁定文件
├── .editorconfig ------------------------- 针对编辑器的编码风格配置文件
├── .flowconfig --------------------------- flow 的配置文件
├── .babelrc ------------------------------ babel 配置文件
├── .eslintrc ----------------------------- eslint 配置文件
├── .eslintignore ------------------------- eslint 忽略配置
├── .gitignore ---------------------------- git 忽略配置
```
### 不同构建输出的区别与作用

`运行时版` 与 `完整版`。一个将字符串模板编译为 `render` 函数的家伙，将字符串模板编译为 `render` 函数的这个过程，是不是一定要在代码运行的时候再去做？当然不是，实际上这个过程在构建的时候就可以完成，这样真正运行的代码就免去了这样一个步骤，提升了性能。同时，将 `Compiler` 抽离为单独的包，还减小了库的体积。
那么为什么需要完整版呢？说白了就是允许你在代码运行的时候去现场编译模板，在不配合构建工具的情况下可以直接使用，但是更多的时候推荐你配合构建工具使用运行时版本。
除了运行时版与完整版之外，为什么还要输出不同形式的模块的包？比如 `cjs`、`es` 和 `umd`？其中 `umd` 是使得你可以直接使用 <script> 标签引用 `Vue`的模块形式。但我们使用 `Vue` 的时候更多的是结合构建工具，比如 `webpack` 之类的，而 `cjs` 形式的模块就是为 `browserify` 和 `webpack 1` 提供的，他们在加载模块的时候不能直接加载 `ES Module`。而 `webpack2+` 以及 `Rollup` 是可以直接加载 `ES Module` 的，所以就有了 `es` 形式的模块输出

### 如何启动源码

报错参考
https://www.cnblogs.com/waihoyu/p/9141370.html

问题发生在 rollup-plugin-alias 这个插件，里面有一个 bug 是 win10 下生成的 alias 在最后一个路径的/会变成\

#### 解决

1. 下载 此版本的 rollup-plugin-alias  并进行覆盖原文件。
下载地址：`https://github.com/ideayuye/rollup-plugin-alias`
2. 并把rollup-plugin-alias重新单独编译一次，就能正常使用了。
进入`rollup-plugin-alias`目录，先执行 `npm install`  再执行 `npm run build`。
3. 找到 \build\config.js 文件
把 `genConfig` 函数的 `config` 变量加一个属性 `sourceMap: true` 如图:

### Vue 构造函数

从五个入口文件入手
```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
```

#### initMixin
initMixin 定义_init
```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // ... _init 方法的函数体，此处省略
  }
}
```

#### stateMixin 
如果 我们通过 this.$data.xxx 实际上访问的是 this._data.xxx
```javascript
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  // .....
  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
  	// ...
  }
```

#### renderMixin 
在原型上定义很多很多方法，不讲了

#### eventsMixin 
```javascript
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {}
Vue.prototype.$once = function (event: string, fn: Function): Component {}
Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {}
Vue.prototype.$emit = function (event: string): Component {}
```

#### lifecycleMixin
```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
Vue.prototype.$forceUpdate = function () {}
Vue.prototype.$destroy = function () {}
```

### 全局API

我们打开 `core/index.js` 文件
```javascript
initGlobalAPI(Vue)
```
打开 `src/core/global-api/index.js` 文件找到 `initGlobalAPI` 方法
```javascript
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)
```

在 Vue 上添加了四个属性分别是 set、delete、nextTick 以及 options
```javascript
Vue.set = set
Vue.delete = del
Vue.nextTick = nextTick
Vue.options = Object.create(null)
```

```javascript

ASSET_TYPES.forEach(type => {
	Vue.options[type + 's'] = Object.create(null)
})
Vue.options._base = Vue

extend(Vue.options.components, builtInComponents);

// shared/constants.js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

// Vue.options 将变成这样：
Vue.options = {
	components: Object.create(null),
	directives: Object.create(null),
	filters: Object.create(null),
	_base: Vue
}

// 紧接着，是这句代码：
extend(Vue.options.components, builtInComponents)

// extend 来自于 `shared/util.js` 文件，
// 这句代码的意思就是将 builtInComponents 的属性混合到 Vue.options.components 中，
// 其中 builtInComponents 来自于 core/components/index.js 文件，该文件如下：
import KeepAlive from './keep-alive'
export default {
  KeepAlive
}

// 最后变成这样
Vue.options = {
	components: {
		KeepAlive
	},
	directives: Object.create(null),
	filters: Object.create(null),
	_base: Vue
}

// 在 initGlobalAPI 方法的最后部分，以 Vue 为参数调用了四个 init* 方法，作用依然是添加相对应的api
initUse(Vue)
initMixin(Vue)
initExtend(Vue)
initAssetRegisters(Vue)
```

### 开始
```html
<div id="app">{{test}}</div>
```
```javascript
var vm = new Vue({
    el: '#app',
    data: {
        test: 1
    }
})
```
_init 方法的一开始，是这两句代码：
```javascript
const vm: Component = this
// a uid
vm._uid = uid++
```

```javascript
// a flag to avoid this being observed
vm._isVue = true
// merge options
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    // 有 写组件的时候走这边
    initInternalComponent(vm, options)
} else {
    vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
    )
}
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
} else {
    vm._renderProxy = vm
}
// expose real self
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```
首先在 `Vue` 实例上添加 `_isVue` 属性，并设置其值为 `true`。目的是用来标识一个对象是 `Vue` 实例，即如果发现一个对象拥有 `_isVue` 属性并且其值为 `true`，那么就代表该对象是 `Vue` 实例。这样可以避免该对象被响应系统观测（其实在其他地方也有用到，但是宗旨都是一样的，这个属性就是用来告诉你：我不是普通的对象，我是 `Vue` 实例）。

```javascript
// merge options
if (options && options._isComponent) {
    initInternalComponent(vm, options)
} else {
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
    )
}
```
### vue选项的规范化

接着上节，其中第一个参数是通过调用一个函数得到的，这个函数叫做 `resolveConstructorOptions`，并将 `vm.constructor` 作为参数传递进去。第二个参数 `options` 就是我们调用 `Vue` 构造函数时透传进来的对象，第三个参数是当前 `Vue` 实例，现在我们逐一去看。

打开 core/util/options.js 文件，找到 mergeOptions 方法

校验组件名是否合法
```javascript
if (process.env.NODE_ENV !== 'production') {
  checkComponents(child)
}
// ...
function checkComponents (options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
// ...
export function validateComponentName (name: string) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    )
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
```

#### props 规范化

```javascript
normalizeProps(child, vm)
normalizeInject(child, vm)
normalizeDirectives(child)
```
这里主要看 `normalizeProps` 方法
```javascript
// props 写法
const ChildComponent = {
  props: ['someData']
}
const ChildComponent = {
  props: {
    someData1:Number,
    someData2: {
      type: Number,
      default: 0
    }
  }
}

/*
* 下面是源代码
* 下面是源代码
* 下面是源代码
*/ 

function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    // 判断是否是数组形式
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        // camelize 改写成驼峰
        name = camelize(val)
        // 最终变为这种格式
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    // 判断是否是纯对象
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
//   其中 res 变量是用来保存规范化后的结果的，我们可以发现 normalizeProps 函数的最后一行代码使用 res 变量覆盖了原有的 options.props
  options.props = res
}
```



