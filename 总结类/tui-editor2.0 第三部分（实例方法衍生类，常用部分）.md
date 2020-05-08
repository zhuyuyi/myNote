## 实例方法衍生类
```mindmap
# Editor构造函数
## factory() Viewer实例
## getUI() UI实例
- getModeSwitch() 模式切换实例
- getToolbar() 顶部toolbar选项实例
## getTextObject() 文字对象实例
## getCodeMirror() 光标对象实例
```
### new CodeMirrorExt
含义：返回一个编辑器中关于输入内容的对象，即（光标）
用法：
```javascript
let getCodeMirror = this.editor.getCodeMirror();
this.editor.insertText('```\n\n```');
getCodeMirror.setCursor(getCodeMirror.getCursor().line - 1, 0);
```
上面代码是在wiki中摸索出来的代码，重点在于`insertText()`、`getCursor()`、`setCursor()`。

#### blur() focus()
含义：光标的失焦聚焦事件

#### getCaretPosition()
含义：获取当前的光标的位置
<mark>return</mark> Object

#### getCurrentRange()
含义：获取当前选中的内容
<mark>return</mark> Object

#### getCursor(start)
含义：获取光标的位置
名称|类型|含义
-|-|-
start|String='head'|从哪里开始计数'from'|'to'|'head'|'anchor'
![](https://fe.che300.com/easymock/upload/2020/05/03/8841b083d7a4fd808292da6900d0b752.png)

`from`：永远都是从左到右计数
`to`：永远都是从右到左计数
`head`：光标选中的文字后的结束位置
![](https://fe.che300.com/easymock/upload/2020/05/03/3e1a377fcba04e60c85b9fbe471e7c4c.png)
`anchor`：光标选中的文字后的开始位置与head正好相反
![](https://fe.che300.com/easymock/upload/2020/05/03/6f93a1cc0666bd2a6b718fcf15ee0e8a.png)
![](https://fe.che300.com/easymock/upload/2020/05/03/b39d929846c0068c2eb305a24e7a2506.png)

#### setCursor(line,ch)
含义：设置光标的位置
名称|类型|含义
-|-|-
line|Number|第几行
ch|Number|第几个字符位置

#### replaceSelection(content, selection)
含义：替换选择的内容
名称|类型|含义
-|-|-
content|String|选择的值
selection|Object|选择的js对象

#### 还有一些方法实现方式和tui-editor类似或一样

##### getValue() setValue() moveCursorToEnd() moveCursorToStart() off() on() remove() reset() scrollTop() setHeight() setMinHeight() setPlaceholder()


#### replaceRelativeOffset()、addWidget()
这两个不知道怎么用，issues里也没有，貌似全网只有作者知道这是啥，其他人都不懂......

### MdTextObject
```javascript
let MdTextObject = this.editor.getTextObject();
```

#### deleteContent()
含义：删除选中的内容

#### getTextContent()
含义：获取选中的文字
<mark>return</mark> String 

#### replaceContent()
含义：替换选择的文字

#### setRange(range)
含义：将选中的文字对象，替换成你想要的文字对象
名称|类型|含义
-|-|-
range|Object|文字范围对象

#### 未知方法
peekStartBeforeOffset() 
setEndBeforeRange()
expandEndOffset()
expandStartOffset()


### new DefaultUI
含义：所有的ui部分

#### getEditorHeight() getEditorSectionHeight()
含义：获取整个编辑器高度/获取除去ui部分的高度
<mark>return</mark> Number

#### hide() show() remove()
含义：隐藏/显示/移出 整个编辑器

#### getToolbar() 
含义：获取当前的顶部选项
<mark>return</mark> Object

#### setToolbar(toolbar)
含义：设置顶部选项
名称|类型|含义
-|-|-
toolbar|Object|可以通过`getToolbar`方法先获取值再设置

#### getPopupTableUtils()
含义：获取表格弹出框对象
<mark>return</mark> Object

针对 popup 弹框 部分的研究还不够深入，需要再接再厉。

#### getModeSwitch()
含义：获取模式切换实例
<mark>return</mark> Object
![](https://fe.che300.com/easymock/upload/2020/05/03/a6bde6bd9ba174f0a589925f2aaf047b.png)


### new Toolbar()

#### disableAllButton() enableAllButton()
含义：禁用和启用 所有的按钮
`注意：`该禁用按钮时 也会禁用自定义的按钮们

#### addItem(item)
含义：在末尾位置加入一个 `<toolbarItems />`
名称|类型|含义
-|-|-
item|DOM|htmldom

#### getItem(index)
含义：获取指定位置的 `<toolbarItems />`
名称|类型|含义
-|-|-
index|Number|位置索引

#### getItems()
含义：获取所有位置的 `<toolbarItems />`
![](https://fe.che300.com/easymock/upload/2020/05/03/34ee8ccb9c3b379299edb3f504e9179c.png)

#### indexOfItem(item)
含义：获取指定 `<toolbarItems />` 的 索引
名称|类型|含义
-|-|-
item|DOM|htmldom

#### insertItem(index, item)
含义：在指定位置加入一个 `<toolbarItems />`
名称|类型|含义
-|-|-
index|Number|位置索引
item|DOM|htmldom

```javascript
        function createLastButton() {
            const button = document.createElement('button');

            button.className = 'last';
            button.innerHTML = `<i>B</i>`;

            return button;
        }

      const editor = new toastui.Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        height: '500px',
        initialValue: 'The first and last buttons are customized.',
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'indent',
          'outdent',
          'divider',
          'table',
          'image',
          'link',
          'divider',
          'code',
          'codeblock',
          'divider',
          // Using Option: Customize the last button
          {
            type: 'button',
            options: {
              el: createLastButton(),
              command: 'Bold',
              tooltip: 'Custom Bold'
            }
          }
        ]
      });

      // Using Method: Customize the first button
      const toolbar = editor.getUI().getToolbar();

      editor.eventManager.addEventType('clickCustomButton');
      editor.eventManager.listen('clickCustomButton', function() {
        alert('Click!');
      });

      toolbar.insertItem(0, {
        type: 'button',
        options: {
          className: 'first',
          event: 'clickCustomButton',
          tooltip: 'Custom Button',
          text: '@',
          style: 'background:none;border-color:lime;'
        }
      });
```

#### removeAllItems()
含义：移除所有的 `<toolbarItems />`

#### removeItem(item/number, destroy)
含义：移除指定的 `<toolbarItems />`
名称|类型|含义
-|-|-
item/number|Object/Number| 要删除的`<toolbarItems />`对象 或者 索引
destroy|Boolean = true| 是否直接删除dom而不是 `display:none`

#### setItems(items)
含义：一次插入多个 `<toolbarItems />`
名称|类型|含义
-|-|-
item|DOM|htmldom

### new ModeSwitch

#### show() isShown() hide()
含义：显示/是否显示状态/隐藏 模式切换

### 其他衍生构造函数
[文档](https://nhn.github.io/tui.editor/latest/)

