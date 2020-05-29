## tui-editor2.0第一部分

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
language|`String`|语言，需要特别引入国际化语言包，使用方式见本文章最下方。|'en-US'
extendedAutolinks|`Boolean`|自动识别用户写的内容是否时链接，可以直接跳转（不建议）|false
customHTMLRenderer|`Object`|自定义渲染|

```javascript
// 关于自定义渲染的部分示例代码
const editor = new toastui.Editor({
  el: document.querySelector('#editor'),
  customHTMLRenderer: {
    paragraph(node, context) {
      const { entering, origin } = context;
      const result = origin();
      if (entering) {
        result.attributes = { 'data-my-attr': 'custom-attr' };
        result.classNames = ['custom-class1', 'custom-class2'];
      }
      return result;
    },
    heading(node, { entering }): {
      const tagName = `h${node.level}`;
      if (entering) {
        return {
          type: 'openTag',
          tagName,
          classNames: ['my-heading']
        }
      }
      return {
        type: 'closeTag',
        tagName
      }
    }
  }
});
```
useDefaultHTMLSanitizer（[开发者没有提供示例](https://github.com/nhn/tui.editor/pull/945)）、customHTMLSanitizer、customConvertor（[开发者没有提供有效的例子](https://github.com/nhn/tui.editor/pull/236)）暂时没有好的例子解释

[customHTMLRenderer](https://github.com/nhn/tui.editor/pull/894)  这里有个 issue ，并不知道干什么用的。

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

### 其他

#### 语言包
```javascript
const interText = {
    Markdown: 'Markdown',
    WYSIWYG: '所见即所得',
    Write: '编辑',
    Preview: '预览',
    'Headings': '标题',
    Paragraph: '文本',
    'Bold': '加粗',
    Italic: '斜体字',
    Strike: '删除线',
    Code: '内嵌代码',
    Line: '水平线',
    Blockquote: '引用块',
    'Unordered list': '无序列表',
    'Ordered list': '有序列表',
    Task: '任务',
    Indent: '缩进',
    Outdent: '减少缩进',
    'Insert link': '插入链接',
    'Insert CodeBlock': '插入代码块',
    'Insert table': '插入表格',
    'Insert image': '插入图片',
    Heading: '标题',
    'Image URL': '图片网址',
    'Select image file': '选择图片文件',
    Description: '说明',
    OK: '确认',
    More: '更多',
    Cancel: '取消',
    File: '文件',
    URL: 'URL',
    'Link text': '链接文本',
    'Add row': '添加行',
    'Add col': '添加列',
    'Remove row': '删除行',
    'Remove col': '删除列',
    'Align left': '左对齐',
    'Align center': '居中对齐',
    'Align right': '右对齐',
    'Remove table': '删除表格',
    'Would you like to paste as table?': '需要粘贴为表格吗?',
    'Text color': '文字颜色',
    'Auto scroll enabled': '自动滚动已启用',
    'Auto scroll disabled': '自动滚动已禁用',
    'Choose language': '选择语言'
}
Editor.setLanguage('zh-CN',interText ); // 实例化之前先设置语言
this.editor = new Editor({
    el: document.querySelector('#editorSection'),
    language:'zh-CN', // 设置中文
});
```








