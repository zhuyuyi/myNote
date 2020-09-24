## elasticsearch小白入门

### 自行去官网下载 win linux 及其他版本安装包
链接：
[elasticsearch下载](https://www.elastic.co/cn/downloads/elasticsearch)
[ik分词器是一个github项目，可以选择git clone 或者 直接download zip](https://github.com/medcl/elasticsearch-analysis-ik/archive/master.zip)
[kibana下载](https://www.elastic.co/cn/downloads/kibana)

为了方便演示，这边是windows系统下的教程，linux基本类似

### 熟悉es目录
![](https://fe.che300.com/easymock/upload/2020/09/21/d5193d8855be77fc1d484bf12d20e8be.png)

```js
bin 是启动目录
config 配置文件
--- log4j2 日志配置文件
--- jvm.options java虚拟机相关配置
--- elasticsearch.yml elasticsearch配置文件，默认 9200 端口！
lib 相关jar包
logs 日志
modules 相关模块
plugins 插件如ik
```

### 启动
直接访问 `bin` 目录下 `elasticsearch.bat`
![](https://fe.che300.com/easymock/upload/2020/09/21/7250ecd0ee9a9a6161b08b79ec0428be.png)


### 安装可视化插件 elasticsearch-head
```js
git clone https://github.com/mobz/elasticsearch-head.git
```
进入目录后 
```js
cnpm install 
```
访问 `localhost:9100`, 发现跨域问题

去es `config`目录 的 `elasticsearch.yml` 添加跨域配置
```js
http.cors.enabled: true 
http.cors.allow-origin: "*" 
```
`*`代表所有人都可以访问，实际正式环境不可以这样配置

重启 `elasticsearch` 
这时再访问 访问 `localhost:9100` 即可

![](https://fe.che300.com/easymock/upload/2020/09/21/665104f1f3ae773b5465c18d06581d03.png)

### kibana的安装与使用

#### 了解 ELK
> 了解ELK工程师   ELK是 Elasticsearch Logstash Kibana 三大开源库的简称，市面上也称为 Elastic Stack。其中Elasticsearch是一个基于Lucene、分布式、通过Restful方式进行交互的近实时搜索平台框架。像百度、谷歌这种大数据全文搜索引擎的场景都可以使用es这作为底层支持框架，可见es提供的搜索能力确实强大，Logstash 是中央数据流引擎，用于从不同目标（文件/数据存储/MQ）收集的不同格式数据，经过过滤后只支持输出到不同目的地（文件/MQ/redis/es等）。Kibana是一个es可视化工具，提供了实时分析的能力。

收集清洗数据 ---> 搜索，存储 --->Kibana
![](https://fe.che300.com/easymock/upload/2020/09/21/4f832993c183da1352649005c4082799.png)

`要保证Kibana版本和es保持一致`

[kibana的windows下载地址，点击即可下载](https://artifacts.elastic.co/downloads/kibana/kibana-7.9.1-windows-x86_64.zip)

#### 启动
`kibana-7.9.1-windows-x86_64\bin` 目录下的 `kibana.bat`

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/64a8d5d4abfb5c69f375dc282bdd75fd.png)
|_
```
访问 5601端口即可访问

ps:开发工具！（postman等等其他的）

#### 修改汉化
去配置文件`D:\tools\kibana-7.9.1-windows-x86_64\config\kibana.yml`中修改
```
i18n.locale: "zh-CN"
```

### 核心概念
es是面向文档的非关系数据库

| 关系型数据库 | es |
| --- | --- |
| 数据库 | 索引 |
| 表 | types（慢慢被弃用了，7.x.x版本使用统一的_doc,并在查询命令中可以省略） |
| 行 | documents（文档） |
| 字段 | fields |

#### 文档
es是面向文档的，意味着索引和搜索数据的最小单位是文档，es中文档有几个重要属性：

* 自我包含，一篇文档同时包含字段和对应的值，也就是包含key和value
* 可以是有层次的，一个文档中包含自文档，复杂的逻辑实体就是这么来的！
* 灵活的结构，文档不依赖预先定义的模式，我们知道关系型数据库中，要提前定义字段才能使用，在es中，对于字段是非常灵活的，有时候，我们可以忽略该字段，或者动态的添加一个新的字段。

尽管我们可以随意新增忽略某个字段，但是每个字段的类型非常重要，比如一个年龄类型字段，可以是字符串也可以是整数，因为es中会保存字段和类型之间的映射以及其他的设置，这种映射具体到每个映射的每种类型，这也是为什么在es中，类型有时候也称为映射类型。
```
user
1  zhuyuyi 24
2  zyy 24
3  xn  23
```
#### 类型
类型是文档的逻辑容器，就像关系型数据库一样，表格是行的容器。

#### 索引
就是数据库！
`索引`是映射类型的容器，es中的索引是一个非常大的文档集合。索引存储了映射类型的字段和其他设置。然后它们被存储到各个分片上。

##### 节点和集群如何工作
一个集群至少有一个节点，而一个节点就是一个es进程，节点可以有多个索引（默认的），如果你创建索引，那么索引将会有5个分片（primary shard，又称主分片，民间称为倒排索引）构成的，每一个主分片会有一个副本（replica shard，又称复制分片）
![](https://fe.che300.com/easymock/upload/2020/09/22/febc7f7ba987657861e4368c42f3d5da.png)
![](https://fe.che300.com/easymock/upload/2020/09/22/36dd3d88b6fee66f1d3007f8be694e7d.png)

##### 倒排索引
es使用的是一种称为倒排索引的结构，采用Lucene倒排索引作为底层，这种结构适用于快速的全文索引，一个索引由文档中所有的不重复的列表构成，对于每一个词，都有一个包含它的文档列表。例如，现在有两个文档，每个文档包含如下内容：
```
Study every day, good good up, to forever # 文档一
To forever, Study every day, good good up # 文档二
```
为了创建倒排索引，我们要将每个文档拆分成独立的词（词条），然后创建一个包含所有不重复词条的排序列表，然后列出每个词条出现在哪个文档
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/d178d189647d828c99249cf5f1e6104c.png)
|_
```
现在我们要去搜索 to forever 只需要查看包含每个词条的文档

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/e367bf9220d4091f448394347b9c8b4f.png)
|_
```
这里产生了权重！

总结：倒排索引帮我们完全过滤掉了一些无用的数据，帮我们提高了效率

1、索引（数据库）
2、字段类型（mapping）
3、文档
4、分片（了解，Lucene索引）

### IK分词器
分词就是把一段中文或者英文划分为一个个关键字，我们在搜索的时候会把自己的信息进行分词，会把数据库中的或者索引库中的数据进行分词，然后进行一个匹配操作做，默认的中文分词是将每一个字看成一个词，比如“我爱育仪”会被分成“我”“爱”“育”“仪”，这里显然是不合理的，所以我们需要安装中文的分词器。
IK提供了两个分词算法：`ik_smart` 和 `ik_max_word`，其中 `ik_smart`是最少切分，`ik_max_word`是最细粒度划分！

附件中有IK分词器的安装包
1、安装
2、直接解压到es安装目录的`plugin`目录中命名为`ik`
3、重启`es`

验证 分词器是否安装完成，
4、使用 `elasticsearch-plugin`
![](https://fe.che300.com/easymock/upload/2020/09/22/195518bb9c6de7defead03a5daab3e62.png)

5、用kibana测试！

>ik_smart 最少划分
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/7850f03993d8beae7787d60cd4d168b1.png)
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/47633a0138cecfb103ad32dacc8d464a.png)
|_
```

>ik_max_word 最多划分
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/6a8f851fe3f31a9ad72635a0d61671c8.png)
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/66e266cf3796b2f3631b87629ba7197f.png)
|_
```

#### 发现问题
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/62aa35d79509b67763285e5e8e94364d.png)
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/bc4561666926bd2ce4f4dfee95bb68d8.png)
|_
```
这种自己需要的词，需要我们自己加上我们的分词器中，才会实现真正的分词

#### 自己添加词典
`D:\tools\elasticsearch-7.9.1\plugins\ik\config\IKAnalyzer.cfg.xml`
在这个目录下修改

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/94b72e0a58ac77eec8dc4ae38da4b2e2.png)
|_
```
在`elasticsearch-7.9.1\plugins\ik\config` 目录下新建 自定义的词典例如：
1、新建`yuyi.dic`
2、在 该文件中写入
![](https://fe.che300.com/easymock/upload/2020/09/22/07b410e98529a5b6a27b679d43439f50.png)
3、在下图位置加上自己的配置文件名
![](https://fe.che300.com/easymock/upload/2020/09/22/9d6e4d74985b33a5358566aa3ab9655d.png)
4、重启es
5、再次测试
```
GET _analyze
{
  "analyzer": "ik_smart",
  "text": "超级喜欢育仪讲"
}
```
返回值发生了变化
```
{
  "tokens" : [
    {
      "token" : "超级",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "喜欢",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "育仪",
      "start_offset" : 4,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "讲",
      "start_offset" : 6,
      "end_offset" : 7,
      "type" : "CN_CHAR",
      "position" : 3
    }
  ]
}
```
以后需要自己配置，就需要自己在分词中设置即可

### Rest 风格说明
这是一种架构风格而不是标准，他用于客户端与服务器交互 类的软件，基于这个风格设计软件可以更简洁、更有层次等。


| method | url地址 | 描述 |
| --- | --- | --- |
| PUT | localhost:9200/索引名称/类型名称/文档id | 创建文档（指定文档id） |
| POST | localhost:9200/索引名称/类型名称 | 创建文档（随机文档id） |
| POST | localhost:9200/索引名称/类型名称/文档id/_update | 修改文档 |
| DELETE | localhost:9200/索引名称/类型名称/文档id | 删除文档 |
| GET | localhost:9200/索引名称/类型名称/文档id | 通过文档id查询文档 |
| POST | localhost:9200/索引名称/类型名称/_search | 查询所有数据 |


#### 创建文档
##### 示例1
```js
PUT /test1/type1/1
{
  "name":"育仪",
  "age":24
}
```
类型名未来在 8版本中会被删除
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/a6e7b806699a88d9a1b5e10e698e8bf6.png)
|  ![](https://fe.che300.com/easymock/upload/2020/09/22/a87e54c98a5ec7d2cde0d26ebc9250c6.png)
|_
```
##### 示例2
```js
PUT /test3/_doc/1
{
  "name":"育仪分享会",
  "age":24,
  "birth":"1996-09-12"
}
```
<mark>这里的_doc是未来es官方指定的类型，未来将去掉类型名称，统一为一个系统指定的_doc</mark>

如果我们没有指定 文档类型，es默认会帮我们指定类型

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/5020b6707a3472be543935d1b562d608.png)
|_
```

#### 字段指定类型
* 字符串类型：text、keyword
* 数值类型：long、integer、short、byte、double、float、half float、scaled float
* 日期类型：date
* te布尔类型：boolean
* 二进制类型：binary
* 等等......

测试
```js
PUT /test2
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "age":{
        "type": "long"
      },
      "birthday":{
        "type": "date"
      }
    }
  }
}
```
![](https://fe.che300.com/easymock/upload/2020/09/23/7baecdb6617df769fcee927c6b984c7d.png)
返回上图则成功

mappings、properties为指定字段类型的必须格式，内部的name、age、birthday为用户想要的类型，类似mysql的建表。 

#### 通过get请求获取信息
```js
GET /test2
```
可以通过get请求，直接获取test2索引的全部信息

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/999729c77f76915d202e092b98014990.png)
|_
```

#### 拓展：通过命令 查看 es 索引情况
> 查看数据库健康值
```js
GET _cat/health
```
![](https://fe.che300.com/easymock/upload/2020/09/23/b670fe8844de72807ece8f8f88cbcc1a.png)

>查看es很多信息
```js
GET _cat/indices?v
```
![](https://fe.che300.com/easymock/upload/2020/09/23/93d5b1c50ae2eec6246c75adbb440679.png)

等等还有很多

#### 修改

> 修改提交还是使用PUT 然后覆盖即可！(<mark>曾经的方法</mark>)
```js
PUT /test3/_doc/1
{
  "name":"育仪分享会20200921",
  "age":24,
  "birth":"1996-09-12"
}
```
![](https://fe.che300.com/easymock/upload/2020/09/23/7891d3565820b90c072ebad64975a462.png)
这种修改更新方式是整体修改，一旦丢掉数据则会产生修改错误的字段


> 更新的方法（新的）
```js
POST /test3/_doc/1/_update
{
  "doc":{
    "name":"育仪大魔王"
  }
}
```
![](https://fe.che300.com/easymock/upload/2020/09/23/ae46266a4f835264b8138201bcb7c48a.png)
更新成功，再调用查看方法即可发现就`name`字段发生了变化。
值得注意的是 `doc`是固定写法

#### 删除
> 删除整个索引
```js
DELETE /test1
```
返回值：![](https://fe.che300.com/easymock/upload/2020/09/23/af4f622e8035f562bb2e691face43ee4.png)

> 删除一条数据
```js
Delete /test3/_doc/1
```
使用RESTFUL风格是我们ES推荐大家使用的！

### 关于文档的基本操作
#### 基本操作
1、先创建一个索引并加入数据
```js
PUT /yuyi/_doc/1
{
  "name":"朱育仪",
  "age":24,
  "desc":"我明天就要分享了，我慌的一批",
  "tags":["技术宅","温暖","直男"]
}

PUT /yuyi/_doc/2
{
  "name":"张三",
  "age":24,
  "desc":"我是张三",
  "tags":["傻叉","旅游","渣男"]
}

PUT /yuyi/_doc/3
{
  "name":"李四",
  "age":30,
  "desc":"我是李四",
  "tags":["靓女","旅游","唱歌"]
}
```
2、查询
查询yuyi索引下的  1号人物
```js
GET /yuyi/_doc/1
```

3、搜索
条件查询
获取一号用户的
```js
GET /yuyi/_doc/_search?q=name:朱育仪
```
![](https://fe.che300.com/easymock/upload/2020/09/23/a4fb386cc417012ba40676de4cff4b80.png)

我们发现 上图中有一个 _score这个字段，如果有多条数据，匹配度越高则分值越高


略复杂的查询方式
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match":{
      "name":"朱育仪"
    }
  }
}
```
还是一样返回上文图片的返回值

#### 通过 _source 指定返回值
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match":{
      "name":"朱育仪"
    }
  },
  "_source":["name","age"]
}
```
![](https://fe.che300.com/easymock/upload/2020/09/23/162ea65cc76b2d572f3fad9019698abd.png)![](https://fe.che300.com/easymock/upload/2020/09/23/9a3224c0f5c5820889823c11ef6779d3.png)

我们之后使用nodejs 操作es，所有的方法和对象就是这里面的key！

#### 排序
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match_all":{}
  },
  "sort":[
    {
      "age":{
        "order":"desc"
      }
    }
  ]
}
```
`match_all`代表全文匹配  `sort` 字段是个数组里面传递对象用来排序，上面的语句是对`age`进行排序，`order`代表排序规则“`desc`降序 `asc`升序”
有了固定的排序后，`_score`分值就没了。

#### 分页
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match_all":{
    }
  },
  "sort":[
    {
      "age":{
        "order":"desc"
      }
    }
  ],
  "from":0,
  "size":2
}
```
`from`代表了从第几个开始，`size`表示每页多少个

#### 布尔值查询
```js
GET /yuyi/_doc/_search
{
  "query":{
    "bool":{
      "must":[
        {
          "match":{
            "name":"育仪"
          }
        },
        {
          "match":{
            "age":24
          }
        }
      ]
    }
  }
}
```
采用 bool字段， 内部可选参数：must（必须包含）must_not（必须不包含）should（有一个就可以了）（minimum_should_match: 用来控制至少匹配多少个should匹配的）
上面匹配的是 `name`包含 `育仪`字段 `age` 是 `24`的数据
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/7cbffaea6243cd05f550be53222f6115.png)
|_
```

should查询测试
```
GET /yuyi/_doc/_search
{
  "query":{
    "bool":{
      "should":[
        {
          "match":{
            "name":"育仪"
          }
        },
        {
          "match":{
            "age":24
          }
        }
      ]
    }
  },
  "from":0,
  "size":2
}
```
会返回只要符合name 是育仪 或者 age是 24的就可以了。

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/7fa52b183a130a332d41d621a98566b2.png)
|_
```
#### 过滤查询
```js
GET /yuyi/_doc/_search
{
  "query":{
    "bool":{
      "must":[
        {
          "match":{
            "name":"育仪"
          }
        }
      ],
      "filter":{
        "range":{
          "age":{
            "gte":10,
            "lte":30
          }
        }
      }
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/e5455756cab135251d85eda6ba1e8db0.png)
|_
```
通过 `filter`查询过滤数据，将过滤`age`大于等于10小于等于30的
`gt`大于 `lt`小于  `gte`大于等于   `lte`小于等于

#### 匹配多个条件
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match":{
      "tags":"男"
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/dcf4e337f1bcf845e807d987cf1560d6.png)
|_
```
想要匹配多个条件直接空格隔开即可
```js
GET /yuyi/_doc/_search
{
  "query":{
    "match":{
      "tags":"男 技术"
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/00cbeb26f978ae58f64dd774fcc62cd4.png)
|_
```
我们发现只要匹配到了这两个词中的任意一个，就会被返回，然而第二条数据并不太符合`技术`这个关键词。
这个时候可以通过返回值中的分值进行基本的判断，匹配程度。

#### 精确查询

term 直接通过倒排索引精确查找的

关于分词，term会直接查询精确值，match会使用分词器解析，再通过分析的文档查询

**两个类型 text keyword**
text类型会被分词器进行解析
keyword不会被分割解析

测试代码一个一个请求
```js
PUT testdb
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "desc":{
        "type": "keyword"
      }
    }
  }
}

PUT testdb/_doc/1
{
  "name":"育仪准备分享会",
  "desc":"育仪准备分享会"
}

PUT testdb/_doc/2
{
  "name":"育仪准备分享会 name",
  "desc":"育仪准备分享会 desc"
}
```
查看分词结果
```
GET _analyze
{
  "analyzer": "keyword",
  "text":"育仪准备分享会"
}
```
![](https://fe.che300.com/easymock/upload/2020/09/23/1f1d1449e9f68f1b11f90e047dafe1df.png)
如上图所示，keyword形式将不再进行分词

```
GET _analyze
{
  "analyzer": "ik_smart",
  "text":"育仪准备分享会"
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/5069c6480790c38c98227833cd03dfdc.png)
|_
```
使用ik分词器后是这个结果

> 精准查询的测试
```js
GET /testdb/_search
{
  "query":{
    "term":{
      "name":"育"
    }
  }
}
```
查询`name`中含有`育`的数据，由于name属性是text类型，会被分词

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/151d726bd2ae28a57d1b91755c47ea7f.png)
|_
```


```js
GET /testdb/_search
{
  "query":{
    "term":{
      "desc":"育"
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/e08c83d3ad3ec6aff881ea1af75d3184.png)
|_
```
此时我们发现 `desc`查询`育`字时无值，由于我们使用了`keyword`类型 ，所以我们必须使用`育仪准备分享会` 全部文字才能匹配到值。如下方的测试
```js
GET /testdb/_search
{
  "query":{
    "term":{
      "desc":"育仪准备分享会"
    }
  }
}
```
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/bee469ed206e1700d2af2c769e16aa2a.png)
|_
```
总结：`keyword`不会被分词器解析

#### 多个值匹配的精确查询
测试代码（插入多个数据）
```js
PUT testdb/_doc/3
{
  "t1":"22",
  "t2":"2020-09-23"
}
PUT testdb/_doc/4
{
  "t1":"33",
  "t2":"2020-09-24"
}
```
使用 `term`精确查询多个值
```js
GET /testdb/_search
{
  "query":{
    "bool":{
      "should": [
        {
          "term":{
            "t1":"22"
          }
        },
        {
          "term":{
            "t1":"33"
          }
        }
      ]
    }
  }
}
```
```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/8f25799a863ce35eec244bed1edceb18.png)
|_
```

#### 高亮查询
```js
GET /yuyi/_search
{
  "query":{
    "match":{
      "name":"育仪"
    }
  },
  "highlight": {
    "fields": {
      "name": {}
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/50cc7b8d36714e23850a7163d0c21b69.png)
|_
```
通过 上文方式可以实现高亮，`highlight``fields`为固定写法

我们这里不想用`em`标签
想用其他的
```js
GET /yuyi/_search
{
  "query":{
    "match":{
      "name":"育仪"
    }
  },
  "highlight": {
    "pre_tags": "<p class='myClassName' style='color:red'>", 
    "post_tags": "</p>", 
    "fields": {
      "name": {}
    }
  }
}
```

```tablePic
|  ![](https://fe.che300.com/easymock/upload/2020/09/23/57872b1a2fbc8468b4029340ae1a2060.png)
|_
```
这里使用 `pre_tags` `post_tags` 来自定义标签高亮

















