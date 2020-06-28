## Markdown编辑器
1.x版本 估计没有人会用了，现在主要说的是 2.1 版本的内容

下面这个视频是 easymock3.3版本新加的自定义插件
```iframe
https://assets.che300.com/feimg/wiki/video/showvideo.mp4
```

### 吐槽以及持续更新
[第六部分](https://fe.che300.com/easymock/wikiCatalog/5ec4a83d81b5545d3d2cbf46)

### 场景
有md文档编辑需求的时候可以使用，并且可拓展性较强，在wiki项目中我们后来又引入了诸如流程图之类的基于该库的延生产物

[文档地址](https://nhn.github.io/tui.editor/latest/)
[github地址](https://github.com/nhn/tui.editor)

### 例子
[车300 wiki 项目](https://fe.che300.com/easymock/wikiCatalog)

### 六部分文档结构
* tui-editor2.1
* 第一部分构造函数参数
* 第二部分实例方法
* 第三部分衍生实例方法
* 第四部分拓展插件
* 第五部分1.x到2.1的过度
* 第六部分鸣谢及其他

### 使用介绍

#### 安装
```
$ npm install @toast-ui/editor 存在一定的被墙风险
$ npm install @toast-ui/editor @<版本> 存在一定的被墙风险
```
cdn引入:推荐该方式
```html
<link rel="stylesheet" type="text/css" href="https://fezz.che300.com/libs/tui-editor/css/code-mirror.min.css" />
<link rel="stylesheet" type="text/css" href="https://fezz.che300.com/libs/tui-editor/css/toastui-editor-2-1-0-1.min.css" />
<!-- js -->
<script src="https://fezz.che300.com/libs/tui-editor/js/toastui-editor-all-2-1-0-1.min.js"></script>
```

### 如何使用
首先在html中加入需要tui-editor绑定的元素节点
```html
<div id="editorSection"></div>
```
<div style="color:red">接着 引入，这是 yarn npm install 的形式</div>

```javascript
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Editor from '@toast-ui/editor';

const editor = new Editor({
  el: document.querySelector('#editorSection'),
  initialEditType: 'markdown', // 默认编辑模式，还支持富文本编辑模式
  previewStyle: 'vertical', / 编辑样式，还支持tab切换的形式
  height: '300px'
});
```
<div style="color:red">这是 cdn 格式使用方式，且带编辑器</div>

```javascript
let editor = new toastui.Editor({
   el: document.querySelector('#editorSection'),
   initialEditType: 'markdown', // 编辑器markdown 还是 其他形式
   previewStyle: 'vertical', // 是否是切一半的页面，另外参数 tab
   height: window.innerHeight, // 高度
   hideModeSwitch: true, // 不展示底部tab切换
   placeholder: '请输入正文...', 
});
```
<div style="color:red">只引入 视图 这是 cdn 格式使用方式，只展示正文</div>
使用 npm 包引入时只需把 toastui 去掉即可

```javascript
this.viewer = new toastui.Editor.factory({
       el: document.querySelector('#viewerSection'),
       height: window.innerHeight + 'px',
       viewer: true,
       initialValue: '11111'
});
```
详情参数见 toastUIEditor 第一部分


### 一些重要的api讲解

#### 钩子函数
##### addImageBlobHook
初始化时定义 ，用于监听编辑器中文件的变化，从而自定义方法，如：图片上传服务器
```javascript
this.editor = new tui.Editor({
   el: document.querySelector('#editorSection'),
   height: window.innerHeight, // 高度
   hooks: { // 钩子函数
       addImageBlobHook: fileOrBlob => {
           // 该钩子函数会监听 文件变化
           this.uploadImgApi(fileOrBlob); // 自定义的上传方法
       }
   },
});
```
`fileOrBlob` 返回一个文件对象
详细内容请阅读 第一部分 钩子函数中对于 该钩子函数的解析

#### 编辑器对象api ToastUIEditor

##### getCodeMirror
由于编辑器闪烁光标 是 自定义的 div，库提供获取光标位置对象的方法，在后续源码的挖掘中发现，CodeMirror是另一个代码段的库，它融入了toastUiEditor中。
```javascript
let getCodeMirror = this.editor.getCodeMirror();
```
##### getMarkdown()
获取markdown中的数据

##### setMarkdown()
插入文本，光标会被默认锁定到 文章末尾

##### insertText(text)
插入文本，注意，这里他会记录上一次的光标位置插入。

```javascript
this.editor.insertText('```\n\n```');
```

#### CodeMirrorExt 光标对象

详情见 toastUIEditor 第三部分

通过`getCodeMirror`获取

重点强调两个
##### getCursor(start) 
获取光标位置 start ： 'from'|'to'|'head'|'anchor'
##### setCursor()
该方法并非文档中暴露方法，而是阅读源码后知晓的方法。该方法可以更好地控制 光标的位置

```javascript
let getCodeMirror = this.editor.getCodeMirror();
this.editor.insertText('```\n\n```');
getCodeMirror.setCursor(getCodeMirror.getCursor().line - 1, 0);
```
上面代码先获取光标对象，在指定位置插入代码段，由于插入后 ，光标会移动到代码段末尾，影响用户体验，于是这里提供了一个 setCursor ，设置光标的位置，达到效果。

#### Toolbar 顶部快捷菜单 api

详情见 toastUIEditor 第三部分

获取 顶部 ui 实例的方法
```javascript
const toolbarArr = [
    {
        name: 'uploadQiniu',
        tooltip: '选择图片',
        el: () => {
            const button = document.createElement('button');
            button.className = 'tui-image tui-toolbar-icons';
            return button;
        },
        index: 14,
        callback: (_this, callback) => {
            _this.uploadImg();
            if (callback) {
                callback();
            }
        }
    },
    {
        name: 'code',
        tooltip: '代码段',
        el: () => {
            const button = document.createElement('button');
            button.className = 'tui-codeblock tui-toolbar-icons';
            return button;
        },
        index: 15,
        callback: (_this, callback) => {
            let getCodeMirror = _this.editor.getCodeMirror();
            _this.editor.insertText('```\n\n```');
            getCodeMirror.setCursor(getCodeMirror.getCursor().line - 1, 0);
            if (callback) {
                callback();
            }
        }
    },
]

this.toolbar = this.editor.getUI().getToolbar();
     toolbarArr.forEach(toolbar => {
     this.editor.eventManager.addEventType(toolbar.name);
     this.editor.eventManager.listen(toolbar.name, () => {
          toolbar.callback(this);
     });
     this.toolbar.insertItem(toolbar.index, {
          type: 'button',
          options: {
               name: toolbar.name,
               className: '',
               event: toolbar.name,
               tooltip: toolbar.tooltip,
               el: toolbar.el()
          }
     });
});
```
这是推荐的写法，因为项目到后期，新增的toolbar会很多，这里直接把它抽出去，通过数组循环的形式简化了代码。

#### 自定义插件

详情见 toasUIEditor 第四部分

#### 源码项目

[源码](http://182.254.153.226/fe/fe-labs/tui-editor)