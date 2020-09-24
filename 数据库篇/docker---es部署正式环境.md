## docker---es部署正式环境

其他相关文章链接，
[docker入门](https://fe.che300.com/easymock/linkArticle/CHE30015998166409642248295687)

[docker进阶](https://fe.che300.com/easymock/linkArticle/CHE300159981666485679621094299)

[elasticsearch相关文章](https://fe.che300.com/easymock/linkArticle/CHE300159981661040570196128937)

[服务器配置备忘录](https://fe.che300.com/easymock/linkArticle/CHE300159981658222739698894698)


### 1、linux centos用yum安装docker
先设置 阿里云镜像，为了防止外网墙或者下载非常慢的问题，类似于npm设置淘宝镜像
```
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

直接安装
```
sudo yum install docker-ce docker-ce-cli containerd.io
```

### 2、启动docker
```
sudo systemctl start docker
```

注意：这里的docker网络使用的默认的docker0网卡，即正常情况下docker分配的ip地址是172.17.0.x，可以选择自己手动设置 docker自定义网络互联，这里并不讲述。（docker network）

### 3、下载es镜像
```
sudo docker pull docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```
通过 docker images 查看 镜像是否下载成功

### 4、新建 elasticsearch 容器
```
sudo docker run -d -e "discovery.type=single-node" -p 9200 -p 9300 --name es-wiki docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```
通过 docker ps 查看启动是否成功

### 5、进入容器修改内存占用
先进入容器
```
docker exxec -it es-wiki bash
```
再 通过 find命令找到 配置文件
```
find / -type f -name 'jvm.options'
```
`假设``假设``假设`是这个路径 ：/etc/elasticsearch/jvm.options

通过vi 命令打开后 发现默认的内存控制参数
```
-Xms1g
-Xmx1g
```
由于服务器资源有限，我们设置为 
```
-Xms512m
-Xmx512m
```
保存并 ctrl+p+q不关闭容器 的 退出容器

### 6、重启docker 容器
```
sudo docker restart es-wiki
```

### 7、进入容器下载ik分词器
先进入容器
```
sudo docker exec -it es-wiki bash
```
再进入 plugins目录下 （直接在进入的当前目录  cd plugins即可）

下载ik分词器

```
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.9.1/elasticsearch-analysis-ik-7.9.1.zip

```
退出容器 ctrl+p+q

### 8、重启容器，用curl命令测试容器是否通常
```
sudo docker restart es-wiki
```
用 docker inspect 命令查找docker分配的ip
```
docker inspect es-wiki
```
`我们正式服务器是：172.17.0.2`

测试连通性
```
sudo curl '172.17.0.2:9200'
```
若返回
![](https://fe.che300.com/easymock/upload/2020/09/16/ced2a19b24e4b1900e5128f2485ac77d.png)

则表示配置正确


### 9、通过 curl命令在服务端创建设置好的分词字段

创建索引
```
curl -X PUT '{你的docker容器ip地址}:9200/{你的索引}'
```
创建分词字段
```
curl -X POST "{你的docker容器地址}:9200/{你的索引}/_mapping" -H 'Content-Type: application/json' -d '{"properties":{"{你想要设置的值}":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"},"{你想要设置的值}":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"}}}'
```


### 10、如何将mongodb数据导入es数据库
```javascript
// 洗数据用的 导出数据
async function importData() {
    let contion = {
        isDeleted: '0'
    };
    let articles = await MdArticleProxy.getAllMarkdown(contion);
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i]._doc;
        let catlogContion = {
            _id: article.markdownId
        };
        let catlog = await CatalogProxy.getCatalogInfoById(catlogContion);
        if (catlog) {
            await axios.post(`${esUrl}/_create/${article.markdownId}`, {
                title: article.title || '错误数据',
                mdTexts: article.mdTexts || '错误数据',
                markdownId: article.markdownId,
                catalogPath: catlog._doc.catalogPath
            }).then(()=>{
                console.log(`成功${article.markdownId}`)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
}
```
洗数据导入。

