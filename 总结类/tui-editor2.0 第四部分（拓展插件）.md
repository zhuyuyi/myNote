## tui-editor2.0 第四部分（拓展插件）
家里没法翻墙，节后翻墙后 切图去
### 自定义拓展
```javascript
initEditor(){
   function youtubePlugin() {
       Editor.codeBlockManager.setReplacer('youtube1', function(youtubeId) {
          debugger
          return `<iframe width="100%" height="500px" src="${youtubeId}"></iframe>`
       });
   }

   // https://www.baidu.com/
   const content = ['```youtube1','http://localhost:8000/#/orderManage/checkOrderList/checkStep/1', '```'].join('\n');
   // const content = ['```youtube1', 'https://ssl-img.che300.com/pro/202004/2310/1Ovu8m5h3mKqHEbiR2.mp4', '```'].join('\n');

   const editor = new Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        height: '900px',
        initialValue: content,
        // Step 2: Set the defined plugin function as an option value
        plugins: [youtubePlugin]
   });
}
```

### chart

```javascript
import chart from @toast-ui/editor-plugin-chart

const chartOptions = {
    minWidth: 100,
    maxWidth: 600,
    minHeight: 100,
    maxHeight: 300
};

const editor = new Editor({
    el: document.querySelector('#editor'),
    previewStyle: 'vertical',
    height: '500px',
    initialValue: chartContent,
    plugins: [chart, chartOptions]
});
```
![](https://fe.che300.com/easymock/upload/2020/05/07/1981df0359811ef8ebd8b0bed48d3106.png)

### 语法高亮突出
```javascript
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import hljs from 'highlight.js';

const editor = new Editor({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```


### 这里只是列出了一小部分

第一部分构造函数>>>使用手册>>>对于1.0与2.0差异分析部分提到了一些关于插件的问题。[入口](https://fe.che300.com/easymock/wikiCatalog/5eb2179c327f8a0a2a075c75)

其余的例子实例这里提供一个官方[入口](https://nhn.github.io/tui.editor/latest/tutorial-example15-editor-with-all-plugins)


### 后续

* 后续会继续完善文档，目的是为了更完美的 升级 wiki 中的 tui-editor 编辑器，防止因漏掉知识点而认为无法实现或难以实现问题的出现。
* 该四部分文档从 4月中旬开始编写，6月初终于定稿，非常耗时耗力，嘤嘤嘤。
* 针对插件部分，会陆续在wiki中实现，并尝试一些自定义的拓展插件，如：可以直接在wiki中播放视频、嵌入代码编辑器、嵌入一些用于展示的网站等等内容。