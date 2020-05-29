## tui-editor2.0 第二部分（实例方法）

### 构造函数属性与方法

#### isViewer
含义：是否仅是视图
<mark>return</mark> Boolean

```javascript
Editor.isViewer // false
```

#### factory(options)
含义：构造函数工厂方式，类似与直接实例化调用的方式。
options：`Object`，和与直接实例化调用的方式传参一样。
```javascript
Editor.factory({
   el:document.querySelector('#editor'),
})
```
#### getInstances()
含义：获取所有的实例化后的对象
<mark>return</mark> Array

```javascript
let a = Editor.factory({
    el:document.querySelector('#editor'),
})
let b = Editor.factory({
    el:document.querySelector('#editor2'),
})
console.log(Editor.getInstances())
```
#### setLanguage(code, data)
含义：设置语言
名称|类型|含义
-|-|-
code|String|语言名称
data|Object|语言设置的对象
`注意`：需要同时拥有 data语言对象和 在实例化时添加属性language才会奏效。不理解可以直接在该文章下方评论区留言。

### 实例钩子函数与事件监听相关

#### addHook(type, callback)
含义：新增钩子函数
```javascript
this.editor.addHook('previewRenderAfter',()=>{
     console.log(1)
})
```
名称|类型|含义
-|-|-
type|String|钩子函数名称
callback|Function|回调函数

具体钩子函数名称，见第一部分 ---> 钩子函数

#### removeHook(type)
含义：去除某个 type 钩子函数
名称|类型|含义
-|-|-
type|String|钩子函数名称


#### off(event)
含义：关闭 某个 event 事件监听
`注意`：event 为 编辑器内部定义的 event 事件，具体见第一部分构造函数传参
名称|类型|含义
-|-|-
event|String|事件名称

#### on(event, handler)
含义：绑定某个 event 事件
注意：event 为 编辑器内部定义的 event 事件，具体见第一部分构造函数传参
名称|类型|含义
-|-|-
event|String|事件名称
handler|Function|回调函数


### 实例获取输入文本内容对象相关

#### getCodeMirror()
<mark>return</mark> Object
含义：返回一个编辑器中关于输入内容的对象。
```javascript
let getCodeMirror = this.editor.getCodeMirror();
this.editor.insertText('```\n\n```');
getCodeMirror.setCursor(getCodeMirror.getCursor().line - 1, 0);
```
如图：及这一块红框中的内容的对象

![](https://fe.che300.com/easymock/upload/2020/05/06/8ab30d81c55a685233d26c2c6d410a93.png)

#### getRange()
<mark>return</mark> Object
含义：可以获取用户选中的区域，或者指定选中区域，得到Range的起点和终点、修改或者复制里边的文本

#### getSelectedText()
<mark>return</mark> String
含义：获取选中的文字

#### getTextObject(range)
含义：获取编辑器中的文字对象
<mark>return</mark> Object
名称|类型|含义
-|-|-
range|Object|用户选中的区域



### 实例获取并设置文本相关

#### getHtml()
<mark>return</mark> String
含义：获取编辑器 渲染到页面上的 html string
如图：
![](https://fe.che300.com/easymock/upload/2020/04/23/b14d5f8c9b0c40ab9ba497a217d293d6.png)
![](https://fe.che300.com/easymock/upload/2020/04/23/0465fc91048104be46c6e72304799e60.png)

#### setHtml(html, cursorToEnd)
含义：设置html值
`注意`：会覆盖之前设置的值 类似 `getMarkdown` 触发时机不同
名称|类型|含义
-|-|-
html|string|文本
cursorToEnd|boolean = true|是否将光标移到文章末尾


#### getMarkdown()
<mark>return</mark> String
含义：获取 MarkdownEditor 编辑器 中返回的 String 值

#### setMarkdown(markdown, cursorToEnd)
含义：设置markdown 值
`注意`：会覆盖之前设置的值 类似`setHtml` 触发时机不同
名称|类型|含义
-|-|-
markdown|string|文本
cursorToEnd|boolean = true|是否将光标移到文章末尾


#### insertText(text)
含义：插入文本
`注意`：会自动锁定在光标位置插入，初始化后未指定光标位置时，是在首位直接插入文本
名称|类型|含义
-|-|-
text|String|文本内容


#### setPlaceholder(placeholder)
含义：设置placeholder
名称|类型|含义
-|-|-
placeholder|String|设置placeholder


#### moveCursorToEnd() moveCursorToStart()
含义：移动光标到文档末尾位置、移动光标到文档起始位置



### 实例操作自身相关


#### height(height)
含义：设置并返回编辑器的高度
<mark>return</mark> String
名称|类型|含义
-|-|-
height|String|设置高度
```javascript
this.editor.height('2000px') // 要加 像素单位 不然无效
```

#### minHeight(minHeight)
含义：设置并返回编辑器的最小高度
<mark>return</mark> String
名称|类型|含义
-|-|-
minHeight|String|设置最小高度


#### isViewer()
含义：是否仅是视图
<mark>return</mark> Boolean

```javascript
console.log(this.editor.isViewer()) // false
```


#### hide()
含义：隐藏编辑器，并不杀掉dom元素，只是简单的display：none

#### show()
含义：显示编辑器

#### remove()
含义：删除 编辑器dom

#### reset()
含义：清空编辑器值

#### blur() focus()
含义：光标失焦事件 光标聚焦事件

#### scrollTop(value)
含义：滚动到编辑器某个部位
名称|类型|含义
-|-|-
value|Number|滚动距离
`注意:`该方法名称命名并不完美


#### isMarkdownMode() isWysiwygMode()
含义：是否是markdown编辑器or富文本编辑器
<mark>return</mark> Boolean


#### getCurrentModeEditor()
<mark>return</mark> Object  MarkdownEditor or WysiwygEditor

#### changeMode(mode,isWithoutFocus)
名称|类型|含义
-|-|-
mode|String|切换编辑器模式，'markdown'、'wysiwyg'
isWithoutFocus|Boolean|是否处于聚焦状态


#### getCurrentPreviewStyle()
<mark>return</mark> String
含义：获取 MarkdownEditor 编辑器的当前使用的样式

#### changePreviewStyle(style)
名称|类型|含义
-|-|-
style|String|显示类型支持两类（'tab'、'vertical'）



### 实例获取UI相关

#### getUI()
含义：获得编辑器UI

#### setUI(UI)
含义：设置UI
名称|类型|含义
-|-|-
UI|UI|设置UI