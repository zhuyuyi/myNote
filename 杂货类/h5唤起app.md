---
title: H5 唤起 App
date: 2019-03-14 18:02:40
tags: 杂货
categories: 杂货类
---

## H5 唤起 App

### 测试机 iphone 7 plus ios 12+

| |chrome|safari|qq浏览器|uc|qq自带
-|-|-|-|-|-
a标签 点击|✔|✔|×|✔|✔
a标签 自动|✔|✔|×|✔|✔
window.location.href 点击|✔|✔|×|✔|×
window.location.href 自动|✔|✔|×|×|×
iframe|×|×|×|×|×|×

在`ios12`环境测试下`iframe`并不如网上所说的可以自动跳转。
`qq浏览器`不支持 URL Scheme 的方式跳转，
`qq自带浏览器`只支持 `a标签` 形式的 `URL Scheme` 的跳转方式。
在支持的浏览器中，其中`safari`浏览器每次都会弹框提示 “是否要打开应用？”，
而`chrome` `uc` 则一旦点击取消除，除非再次打开浏览器，否则无法跳转。在点击确认打开后，再次回到页面，点击打开应用，则不会弹框提示“是否要打开应用？”而是直接跳转打开应用。


### 测试机 魅族 Pro 6 、华为荣耀 v10

安卓机检测 自带浏览器 以及 qq自带浏览器

| |自带浏览器|qq自带浏览器|uc|qq浏览器
-|-|-|-|-
a标签点击|✔|✔|✔|✔
a标签自动|✔|×|×|✔
window.location.href 点击|✔|✔|✔|✔
window.location.href 自动|✔|×|×|✔
iframe|✔|×|×|✔

`iframe`方式依然不理想，同时我测试了` Android Intent`的方式，只有`qq浏览器`是正常打开`App`的