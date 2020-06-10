## tui-ediotr2.0第六部分（鸣谢及其他）

### 特别鸣谢
特别鸣谢wiki小组成员（4人）、前端团队、研发中心对我们的大力支持以及问题出现的反馈

### 记忆尤新的帮助
* 光宇哥对输入法遮挡bug的帮助
* 光宇哥对于附件下载bug的提醒
* 亚辉兄对load中change的提醒帮助
* 梦晓姐对顶部toolbar的优化提议
* 志超哥（基础数据部）对上传图片的提议
* 以洋兄对于评论通知的提议
* 佳鑫对于文字大小的提议
* 佳鑫对于字体的提议
* 佳鑫对于编号的提议
* 焦妈妈对于收起左侧列表的提议
* 威哥对于匿名评论的提议
* 威哥对于分享页加密的提议
* 魏哥对于移动文件夹的提议
* 彬哥对于图片与正文预览的提议
* 可能还有很多提议或帮助，我一时半会儿想不起来了。。。不过还是非常感谢大家的支持

### 结构

```mindmap
# tui-editor2.0
## 第一部分构造函数参数
- 持续更新
- 传参文档
## 第二部分实例方法
## 第三部分衍生实例方法
## 第四部分拓展插件
## 第五部分1.x到2.0的过度
## 第六部分鸣谢及其他
```

### 思考与推翻

#### `----2020年6月9日更新----`

##### 文章太长导致render过长
考虑截断文章，懒加载，但是存在一个技术难点：从何处截断。截断的算法问题导致这里无法继续修复这个问题，与此同时，文章的左侧目录需要大改，（现在是直接渲染完成后取得h标签）

##### xss
`useDefaultHTMLSanitizer ` 清理HTML并防止XSS攻击,默认是`true`，如果设置为`false`，会遭到xss攻击！与此同时设置`customHTMLSanitizer`属性，便会让`useDefaultHTMLSanitizer `自动变为`false`,遭到xss攻击，下图为使用了 `customHTMLSanitizer` 或 `useDefaultHTMLSanitizer `为 `false`时的alert。

![](https://fe.che300.com/easymock/upload/2020/06/09/a33ee10fbc13fad1c83a882e4c69bc9b.png)
官方文档示例在最近的文档中（5月中旬后）给出了解决方案，若是该库无法满足的，比如这[issue](https://github.com/nhn/tui.editor/issues/703)，
```javascript
<HEAD></HEAD></xss:xss><svg/onload=alert(1)><svg/onload=alert(/123/)//element[attribute='<img src=x onerror=alert('XSS');>
```
可以使用第三方库实现。这里的例子用了 [DOMPurify](https://github.com/cure53/DOMPurify)
```javascript
      const content = [
        '<img src=x onerror=alert(1)//>',
        '<svg><g/onload=alert(2)//<p>',
        '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'
      ].join('\n');

      const editor = new toastui.Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        height: '500px',
        initialValue: content,
        customHTMLSanitizer: html => {
          return DOMPurify.sanitize(html);
        }
      });
```

#### `----2020年6月5日更新----`
作者给我了回复，终于，我知道如何使用图表了。
![](https://fe.che300.com/easymock/upload/2020/06/05/942c975680f563256b2f27bad889fd73.png)
下面是五个例子
  ```chart
  ,category1,category2
  Jan,21,23
  Feb,31,17

  type: area
  title: Monthly Revenue
  x.title: Amount
  y.title: Month
  y.min: 1
  y.max: 40
  y.suffix: $
  series.showLabel: true
  series.showLegend: true
 ```
  ```chart
  ,category1,category2,category3
  Jan,21,23,15
  Feb,31,17,15
  Sat,30,10,15

  type: line
  title: Monthly Revenue
  x.title: Amount
  y.title: Month
  y.min: 1
  y.max: 40
  y.suffix: $
  series.showLabel: true
  series.showLegend: true
 ```
  ```chart
  ,category1,category2
  Jan,21,23
  Feb,31,17

  type: bar
  title: Monthly Revenue
  x.title: Amount
  y.title: Month
  y.min: 1
  y.max: 40
  y.suffix: $
  series.showLabel: true
  series.showLegend: true
 ```
 
   ```chart
  ,category1,category2
  Jan,21,23
  Feb,31,17

  type: column
  title: Monthly Revenue
  x.title: Amount
  y.title: Month
  y.min: 1
  y.max: 40
  y.suffix: $
  series.showLabel: true
  series.showLegend: true
 ```
 ```chart
Chrome,IE,Firefox,Safari,Opera,Etc
46.02,20.47,17.71,5.45,3.1,7.25

type: pie
width: 410
title: Usage share of web browsers
legend.visible: false
series.showLabel: true
series.showLegend: true
series.radiusRange: ["40%", "100%"]
```
这是五种支持的样式，存在一些隐藏配置项，需要我慢慢的区探索

#### `----2020年6月3日更新----`
3.3版本我们上线了一个新的功能 图表，支持五种图标类型：bar column pie line area
前三种可以正常使用，后两种我在反复查看源码后还是一头雾水，并且官网也没有有力的例子说明，于是我鼓起勇气提了issues，希望作者给点启发。
![](https://fe.che300.com/easymock/upload/2020/06/03/7bf080db553bec26d41c572020b6b596.png)

#### `----2020年5月14日更新----`
编辑器页面过快滚动时，会报错
![](https://fe.che300.com/easymock/upload/2020/05/14/3ae510198ca11928c459d11e14a4d835.png)
找到了这段源码并进行了滚动过快保护
![](https://fe.che300.com/easymock/upload/2020/05/14/6b7a5a14ab7df9f7f9dbef4fb51a240d.png)

#### `----2020年5月6日更新----`
在我孜孜不倦地研究之中，发现tui-editor库其核心是codemirror库，但是针对下面的输入法遮挡问题，codemirror库源码中居然写死了，这让我十分为难，但最终还是可以自己控制不遮挡。由于核心是他其他的库，有部分api借用了其他的库，这就解释了我之前的一些疑问，为什么有些api并没有呈现在tui-editor文档中，而我却在源码中发现可以使用。
下图为codemirror库中的文档api --- setCursor,但tui-editor却没有，而我偏偏却十分需要这个api呢！
![](https://fe.che300.com/easymock/upload/2020/05/06/9c7ec14f6f9840cc8441da46b1ef7633.png)
这是一个反复反思自己，反复推翻自己，反复重写的过程。。。

#### `----2020年4月16日更新----`
不得不吐槽了，所谓免费的东西坑绝对多，首先由于这是外国人的杰作，他们没有输入法的概念，因此也不会出现我们这里遇到的问题，如下图：（这里感谢光宇老哥的大力支持）
![](https://fe.che300.com/easymock/upload/2020/04/16/db95cf824a8fea00d06e81ce9b21163f.png)
![](https://fe.che300.com/easymock/upload/2020/04/16/868e7923fba7d11ab521921183e29499.png)
输入法居然遮挡了输入内容！！！，还好机智过人的我们找到了问题所在，并把隐藏的输入框定位往下方设置一些，便可以了，但这却不得不又去修改源码，着实让人烦躁，issues提起来了！

#### `----2020年4月6日更新----`
不断地有人给我们提出问题，主要是wiki中正文文字大小间距和样式的问题，这或许是外国人审美和我们有一定差异的原因吧，好吧源码已经被我们改的面目全`废`了。
