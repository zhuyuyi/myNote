## tui-editor2.0第一部分

### 特别鸣谢
特别鸣谢光宇老哥、亚辉、以洋同学、wiki小组成员（4人）、前端团队对我的大力支持以及问题暴露的反馈

### 结构

```mindmap
# tui-editor2.0
## 第一部分构造函数参数
- 特别鸣谢
- 持续更新
- 传参文档
## 第二部分实例方法- 特别鸣谢
## 第三部分衍生实例方法
## 第四部分拓展插件
## 第五部分1.x到2.0的过度
```

### 学而不思则罔，思而不学则殆

`----2020年5月6日更新----`
在我孜孜不倦地研究之中，发现tui-editor库其核心是codemirror库，但是针对下面的输入法遮挡问题，codemirror库源码中居然写死了，这让我十分为难，但最终还是可以自己控制不遮挡。由于核心是他其他的库，有部分api借用了其他的库，这就解释了我之前的一些疑问，为什么有些api并没有呈现在tui-editor文档中，而我却在源码中发现可以使用。
下图为codemirror库中的文档api --- setCursor,但tui-editor却没有，而我偏偏却十分需要这个api呢！
![](https://fe.che300.com/easymock/upload/2020/05/06/9c7ec14f6f9840cc8441da46b1ef7633.png)
这是一个反复反思自己，反复推翻自己，反复重写的过程。。。

`----2020年4月16日更新----`
不得不吐槽了，所谓免费的东西坑绝对多，首先由于这是外国人的杰作，他们没有输入法的概念，因此也不会出现我们这里遇到的问题，如下图：（这里感谢光宇老哥的大力支持和给我们wiki团队的鼓励并与我们一起找寻bug所在）
![](https://fe.che300.com/easymock/upload/2020/04/16/db95cf824a8fea00d06e81ce9b21163f.png)
![](https://fe.che300.com/easymock/upload/2020/04/16/868e7923fba7d11ab521921183e29499.png)
输入法居然遮挡了输入内容！！！，还好机智过人的我们找到了问题所在，并把隐藏的输入框定位往下方设置一些，便可以了，但这却不得不又去修改源码，着实让人烦躁，issues提起来了！

`----2020年4月6日更新----`
不断地有人给我们提出问题，主要是wiki中正文文字大小间距和样式的问题，这或许是外国人审美和我们有一定差异的原因吧，好吧源码已经被我们改的面目全`废`了。

### 官网文档

[文档地址](https://nhn.github.io/tui.editor/latest/)
[github地址](https://github.com/nhn/tui.editor)





### 文档

#### new ToastUIEditor(options)
构造函数参数 options {Object}
名称|类型|描述|默认值
-|-|-|-
el|`HTMLElement`|dom元素|
height|`String or Number`|编辑器的高度"300px"，"100％"，"auto","window.innerHeight{Number}","800{Number}"|"300px"
minHeight|`String or Number`|同上height|"200px"
initialValue|`String`|编辑器的初始值|
previewStyle|`String`|编辑器支持两种样式风格,(tab, vertical)|'tab'
initialEditType|`String`|初始化时有先展示哪种编辑器 (markdown, wysiwyg)|'markdown'
hideModeSwitch|`Boolean`|隐藏模式切换标签栏|false
placeholder|`String`|占位符文本|
useCommandShortcut|`Boolean`|是否使用键盘快捷命令|true
toolbarItems|`Array`|顶部导航（可用于自定义导航）|
plugins|`Array`|额外的插件|
linkAttribute|`Object`|a标签超链接的跳转方式（无法实现自动检测是页面内锚点还是跳转链接，所以不建议使用）[写法issues链接](https://github.com/nhn/tui.editor/issues/527)|
events|`Object`|事件|
hooks|`Object`|生命周期钩子函数(previewBeforeHook\addImageBlobHook)|

##### hooks 
官方文档上只列出两个钩子函数，但是我在源码中发现有`49`个钩子函数
![](https://fe.che300.com/easymock/upload/2020/04/17/6fad0e13a3ed3f2a94acc86fa3acaf2f.png)

###### 使用方法
```javascript
this.editor = new Editor({
     el:document.querySelector('#editor'),
     // ...
     hooks:{
        previewRenderAfter:(type)=>{
           debugger
           console.log(type)
        },
        addImageBlobHook:(file)=>{
           console.log(file)
        }
     }
})
```

###### 文档中存在却无法使用的 previewBeforeHook(无法使用)

文档上存在，却无法使用的奇怪钩子函数 previewBeforeHook 
看这个名字是 视图加载前的钩子函数
但我使用时无法触发。
```javascript
let event = document.createEvent("HTMLEvents");
event.initEvent("previewBeforeHook", false, true);
window.addEventListener("previewBeforeHook", function(obj){
  console.log(111111111111111)
})
```
顺便了解了一下自定义事^_^件

##### wiki项目中用到的钩子函数 addImageBlobHook

含义：上传图片后的回调
参数：file
![](https://fe.che300.com/easymock/upload/2020/04/17/325c1c62d651cc4fce9f4f4686203973.png)
在不写该钩子函数时，若是本地图片，则编辑器自动转为base64格式，却会引起大面积base64问题，影响用户体验。如图：
![](https://fe.che300.com/easymock/upload/2020/04/17/27b0aabe050e1b59b073b1e7287bab0a.png)
所以我们最终重写了顶部的tab，改为addImageBlobHook获取文件再上传服务器插入链接的形式。

##### 钩子函数
名称|含义
-|-
copyBefore|在编辑器中 复制before 时触发
copy|在编辑器中 复制ing 时触发
copyAfter|在编辑器中 复制ed 时触发
cut|在编辑器中 剪切ing 时触发
cutAfter|在编辑器中 剪切ed 时触发
willPaste|粘贴触发无法捕捉debugger 只知道粘贴才触发
paste|粘贴ing触发
pasteBefore|before粘贴触发
addImageBlobHook|上传图片后的回调
keyMap|键盘事件(使用后就需要手动插入值)
previewRenderAfter|视图重绘后的回调（每次输入值重绘都会走回调）
change|编辑器值发生变化的回调
stateChange|当光标位置改变格式时会发出
hide|编辑器隐藏事件回调
show|编辑器显示事件回调
changePreviewTabPreview|当`previewStyle`值为`tab`时切换到视图tab触发
changePreviewTabWrite|当`previewStyle`值为`tab`时切换到编辑tab触发
changeMode|当`hideModeSwitch`为`true`时，切换`markdown`编辑方式与`wysiwyg`方式触发
focus|光标锁定时触发
closeAllPopup|`打开``打开``打开`任意一个该库自带toolbarItem弹框时触发，没错是打开
openPopupAddLink|该库自带的打开超链接弹框触发
openPopupAddImage|该库自带的打开图片上传弹框触发
openPopupAddTable|该库自带的打开表格弹框触发
openHeadingSelect|该库自带的打开选择标题弹框触发
scroll|滚动触发
changePreviewStyle|改变样式时触发
contentChangedFromMarkdown|markdown值发生变化时触发
contentChangedFromWysiwyg|富文本编辑值发生变化时触发
wysiwygKeyEvent|富文本编辑模式键盘事件触发
wysiwygRangeChangeAfter|富文本模式下选择文字复制`ctrl+c`时触发
wysiwygSetValueBefore|富文本设值前触发
wysiwygSetValueAfter|富文本设值后触发

`ps`:剩余一些我实在没法知道啥意思的钩子函数，需要后面慢慢研究了
"command"、"convertorAfterMarkdownToHtmlConverted"、"openDropdownToolbar"、"contextmenu"、"openPopupTableUtils"、"openPopupCodeBlockLanguages"、"closePopupCodeBlockLanguages"、"setCodeBlockLanguages"、"requireScrollIntoView"、"requireScrollSync"、"openPopupCodeBlockEditor"、"closePopupCodeBlockEditor"、"wysiwygProcessHTMLText"、"convertorBeforeHtmlToMarkdownConverted"

##### events
类似于钩子函数
名称|功能
-|-
load|编辑器完全加载时会发出
change|编辑器值发生变化时触发
stateChange|当光标位置改变格式时触发
focus|光标获取焦点时触发
blur|光标失去焦点时触发









