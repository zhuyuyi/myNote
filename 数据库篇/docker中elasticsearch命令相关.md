## elasticsearch
安装
```
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```
启动
```
sudo docker run -d -e "discovery.type=single-node" -p 9100:9100 -p 9200:9200 -p 9300:9300 --name elasticsearch-beta docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```


[es elasticsearch 6/7 设置内存方法](https://www.cnblogs.com/noah-luo/p/11643361.html)

[ElasticSearch提供跨域访问的配置方法](https://blog.csdn.net/yiifaa/article/details/74531976)

[安装启动教程](https://www.cnblogs.com/taopanfeng/p/11684442.html)

~~wget https://npm.taobao.org/mirrors/node/v14.10.0/node-v14.10.0-linux-x64.tar.xz
tar -xvf node-v14.10.0-linux-x64.tar.xz   解压~~

### ik分词
ik分词器安装地址 https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.9.1/elasticsearch-analysis-ik-7.9.1.zip
```
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.9.1/elasticsearch-analysis-ik-7.9.1.zip
```

#### 通过 curl命令在服务端创建设置好的分词字段
该方法用于服务端直接设置分词，可用于上线前。
```
curl -X POST "192.168.0.11:9200/article-ceshi/_mapping" -H 'Content-Type: application/json' -d '{"properties":{"title":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"},"mdTexts":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"}}}'
```



### 暂时不用
~~pm2启动es-head可视化插件~~

>      pm2 --name admin-es-head start npm -- start

### 如何增删改查
#### 创建索引
```
PUT
创建索引
http://fe.ceshi.che300.com:5004/article-ceshi
```
#### 设置分词

```
设置 分词

POST
http://fe.ceshi.che300.com:5004/article-ceshi/_mapping
```
```
{
  "properties": {
    "title": {
      "type": "text",
      "analyzer": "ik_max_word",
      "search_analyzer": "ik_smart"
    },
    "mdTexts": {
      "type": "text",
      "analyzer": "ik_max_word",
      "search_analyzer": "ik_smart"
    }
  }
}
```

[增删改查](https://blog.csdn.net/weixin_38932035/article/details/105703539?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~top_click~default-1-105703539.nonecase&utm_term=es%E6%A0%B9%E6%8D%AEid%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE)


#### 查询 
```
POST
http://fe.ceshi.che300.com:5004/article-ceshi/_doc/_search

{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": "中国"
          }
        },
        {
          "match": {
            "mdTexts": "中国"
          }
        }
      ]
    }
  }
}
```

#### 删除所有
```
POST
http://fe.ceshi.che300.com:5004/article-ceshi/_doc/_delete_by_query?pretty

{"query":{"match_all":{}}}
```

#### 根据筛选条件，删除一条记录
```
POST http://fe.ceshi.che300.com:5004/索引名称/文档名称/_delete_by_query

{
  "query":{
    "term":{
      "_id":100000100
    }
  }
}
```

#### 删除一条记录
```
DELETE http://fe.ceshi.che300.com:5004/索引名称/文档名
```

#### 创建数据
```
POST
http://fe.ceshi.che300.com:5004/article-ceshi/_create/${article.markdownId}

{
    title: article.title,
    mdTexts: article.mdTexts,
    markdownId: article.markdownId,
}
```

#### 更新字段
```
POST
/article-ceshi/_doc/${markdownId}/_update

{
    "doc":{
        "mdTexts":"你的新内容"
    }
}
```

#### 查询总数
```
GET
curl 'http://192.168.0.11:9200/article-ceshi/_doc/_count'
```

返回值
```
{
    "count": 0,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    }
}
```