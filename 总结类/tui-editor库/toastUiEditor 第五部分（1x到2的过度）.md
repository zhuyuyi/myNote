### 1.x例子
[车300 wiki 项目](https://fe.che300.com/easymock/wikiCatalog)


### 使用手册
* 这里会稍微比较一下1.x与2.0的差异。

* 更新主要包含引入方式、一些api的弃用、删除内部需要依赖jquery的头部，如下图。等等。

#### 引入方式差异
##### 1.x
```
$ npm install tui-editor
$ npm install tui-editor @ <版本>
```
##### 2.0
```
$ npm install @ toast-ui / editor
$ npm install @ toast-ui / editor @ <版本>
```
由于该editor被融入了toast-ui框架库中，所以引入方式也发生了变化，作者和他的团队，打算把他们之前做过的ui库整理为toast-ui，故进行了迁移。
```json
{
  "dependencies": {
-  "tui-editor": "^1.4.10",
+  "@toast-ui/editor": "^2.0.0"
  }
}
```
`随着软件包名称的更改，导入模块也将受到影响。新更改的程序包名称必须用于导入编辑器模块。`

#### 使用方式差异
##### 1.x
```javascript
const Editor = require('tui-editor');
// or
import Editor from 'tui-editor';
```
##### 2.0
```javascript
const Editor = require('@toast-ui/editor');
// or
import Editor from '@toast-ui/editor';
```
`cdn引入方式`的差异
* `1.x`
```javascript
const editor = new tui.Editor(/* */);
```
* `2.0`
```javascript
const editor = new toastui.Editor(/* */);
```
#### 捆绑的css
##### 1.x
```javascript
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
```
##### 2.0
```javascript
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
```
依赖性模块已在Editor 2.0中进行了重组。现在，编辑器2.0所需的唯一外部依赖项模块是CodeMirror。
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css" />
```
#### 拓展修改
##### 1.x
```javascript
import 'tui-editor/dist/tui-editor-extChart';

const editor = new Editor({
  // ...
  exts: ['chart']
});
```
##### 2.0
```
$ npm install @toast-ui/editor-plugin-chart
```
```javascript
import chart from '@toast-ui/editor-plugin-chart';

const editor = new Editor({
  // ...
  plugins: [chart]
});
```
差异在于1.x版本，额外插件挂在于exts属性下，而2.0在plugins下。并且2.0需要单独再次引入。

`对于拓展选项也存在一些差异`
##### 1.x
```javascript
import 'tui-editor/dist/tui-editor-extChart';
const options = {
  // ...
};
const editor = new Editor({
  // ...
  exts: [
    {
      name: 'chart',
      ...options
    }
  ]
});
```
是一个对象
##### 2.0
```javascript
import chart from '@toast-ui/editor-plugin-chart';
const options = {
  // ...
};
const editor = new Editor({
  // ...
  plugins: [[chart, options]]
});
```
是一个数组

##### cdn的差异
```html
<script src="https://uicdn.toast.com/tui-editor/latest/tui-editor-extChart.js"></script><!-- 1.x -->
<script src="https://uicdn.toast.com/editor-plugin-chart/latest/toastui-editor-plugin-chart.js"></script><!-- 2.0 -->
```
`1.x`杂糅正在项目源码中，`2.0`则分散在源码的各个整理好的文件夹中,切不同的插件将通过`（editor-plugin-${pluginName}）`后面的路径位于不同的文件夹下。

#### 语法突出显示功能用法
编辑器提供了语法突出显示功能，并且从`2.0`开始，其用法已更新。语法突出显示功能是通过来实现的`highlight.js`，并且由于它是默认设置，因此增加了包的大小。为了解决此问题，从`2.0`开始，此功能已成为可选功能。(有些人不想用代码段高亮呢)
```
$ npm install @toast-ui/editor-plugin-code-syntax-highlight
```
```javascript
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import hljs from 'highlight.js';

const editor = new Editor({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```
若想指定特殊某个语言的高亮
```javascript
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// 1. 引入高亮语法
import hljs from 'highlight.js/lib/highlight';

// 2. 引入需要高亮的语言
import javascript from 'highlight.js/lib/languages/javascript';
import clojure from 'highlight.js/lib/languages/clojure';

// 3. 注册高亮语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('clojure', clojure);

const editor = new Editor({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```

##### cdn引入方式
全局高亮
```html
<!--Editor Bundle File-->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
<!-- code-syntax-highlight Plugin File-->
<script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js"></script>
```
特定语言的高亮
```html
<!--Editor Bundle File-->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
<!--highlight.js Language File-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js"></script>
<!-- code-syntax-highlight Plugin File-->
<script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight.min.js"></script>
```
#### 值得注意
##### 移出jquery
从Editor v2.0开始，删除了jQuery依赖模块。主要针对用户的自定义toolbar部分
##### 1.x
```javascript
const editor = new Editor({
  // ...
  toolbarItems: [
    {
      type: 'button',
      options: {
        $el: $('<button class="my-custom-button"></button>')
        // ...
      }
    }
  ]
});
toolbar.insertItem(0, {
  type: 'button',
  options: {
    $el: $('<button class="your-custom-button"></button>')
    // ...
  }
});
```
##### 2.0
```javascript
const editor = new Editor({
  // ...
  toolbarItems: [
    {
      type: 'button',
      options: {
        el: document.querySelector('.my-custom-button')
        // ...
      }
    }
  ]
});

toolbar.insertItem(0, {
  type: 'button',
  options: {
    el: document.querySelector('.your-custom-button')
    // ...
  }
});
```

#### 其余的变更
如：国际化、以及一些api的变更，请阅读官方文档。
https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/v2.0-migration-guide.md