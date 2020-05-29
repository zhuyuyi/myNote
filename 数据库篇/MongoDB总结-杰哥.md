## MongoDB常用语句
### 1、查询(find/findOne)
```javascript
    // 查询所有结果
    // query 可选,使用查询操作符指定查询条件
    // projection 可选,使用投影操作符指定返回的键.查询时返回文档中所有键值,只需省略该参数即可
    db.catalogs.find(query, projection)
    
    // 按需查找
    // 0(不查)、1(查) 且 只有对_id生效其他字段必须要设置为1
    db.catalogs.find({},{"_id":0,"parentId": 1, "catalogName": 1})
    
    // 查询所有结果分页
    //skip 略过数量 limit 10
    db.catalogs.find().skip(10).limit(10)

    // where条件
    db.catalogs.find({isDelete:1})

    // and条件
    db.catalogs.find({isDelete:0,parentId:"private"})
    
    // 比较条件
    // $gt(>)、$gte(>=)、$lt(<)、$lte(<=) $eq(=) $ne(!=) 
    db.catalogs.find({"topIndex": {"$eq": 0}})

    // or条件
    db.catalogs.find({"$or":[{isDelete:0},{parentId:"public"}]})

    // in条件
    db.catalogs.find({"parentId": {"$in": ["private", "public"]}})
    
    // all条件
    // type数组同时存在mongodb和javascript才会匹配
    db.catalogs.find({"type": {"$all": ["mongodb", "javascript"]}})

    // like 模糊查询
    // i 是忽视大小写
    db.catalogs.find({"parentId":/public/i})
    // mongoose
    let reg = new RegExp(value, 'i')
    let condition = {
       name: {
        $regex: reg
       },
    }
    catalogs.find(condition)
    

    // count 查询数量
    db.catalogs.find({"parentId":/public/}).count()

    // 排序
    // 1 降序 -1升序
    db.catalogs.find({"parentId":/public/}).sort({'catalogName':1,'create_at':1})
    db.catalogs.find({"parentId":/public/}).sort({'catalogName':-1,'create_at':-1}) 
```

### 2、聚合查询(aggregate)
```javascript
    // 聚合查询
    // $sum(求和) $avg(平均值)
    
    // 聚合管道
    // 聚合管道将MongoDB文档在一个管道处理完毕后将结果传递给下一个管道处理。管道操作是可以重复的
   
    // $match：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
    // $group：将集合中的文档分组，可用于统计结果
    // $sort：将输入文档排序后输出
    db.catalogs.aggregate([
    {$match:{catalogPath:/private/}},
    {$group:{_id:'$parentId',sum:{$sum:'$isDelete'} }},
    {$sort:{sum:-1}}
    ])
    // 类似宇mysql中的语法
    select sum(isDelete) as sum  from catalogs where catalogpath like '%private%' group by parentId     
    order by sum desc
    
    // $project：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档
    db.catalogs.aggregate({
        $project:{
            _id: 0 // 0 代表删除
            id:'$_id', // 重命名_id 为id
            parentId : 1 , // 1 代表增加
            catalogPath : 1 ,
        }
    })
    
    // $lookup: 关联查询(3.2版本以后)
    db.taskScore.aggregate([
        {
            $group: {_id: '$userId'}
        },
        {
            $lookup: {
                from: 'users', // 关联表的名称
                localField: '_id', // 对应上面的_id,
                foreignField: '_id', // 关联表的主键
                as: 'userInfo' // 重命名
            }
        }
    ]);
```

### 3、填充(populate)
```javascript
    1、catalog模型中 createUser字段需要增加ref属性
        eg {
            createUser: {
                type: Schema.Types.ObjectId,
                ref: 'User' // 这个User 是关联表的名称
            },
        }
        
    2、保存数据时createUser 需要关联对象_id的值,关联查询才能取到相应的数据
        eg {
            let uid = '5e4607d7fbaf4c12b41f23cc'
            let catalog = {
                createUser:uid
            }
        }
        
    3、被填充的路径不再是原始的_id,其值将被替换为从数据库返回的mongoose文档,
        此操作会在返回结果之前执行单独的查询.
        eg {
            Catalog.find(condition).populate({
                path: 'createUser', // path:是将关联取出来的对象放入在这个字段
                select: 'name' // 设置从其他表取出所需要的字段名称,逗号隔开取出多个字段
            })
            // 简写
            Catalog.find(condition).populate('createUser','name')
        }
        
    4、数据格式
        eg {
            createUser: {
                _id: "5c6534defc338612e20eb074", 
                name: "bge@che300.com"
            }
        }
     5、注释
        {
            1、需要填充多个路径时,只需要多次调用populate()方法即可.
            2、如果在同一个路径上多次调用populate()方法,仅最后一次调用会生效
                eg {
                     Catalog.find(condition)
                     .populate({
                        path: 'createUser', 
                        select: 'name'
                    }).
                    .populate({
                        path: 'createUser', 
                        select: 'nick_name'
                    })
                }
        }
        
```
### 4、插入(insert)
```javascript
    // insert可以插入一条数据
    db.npmmanages.insert({"name":"xiaoming"})
    
    // insert也可以插入多条数据
    db.npmmanages.insert([{"name":"xiaoming"},{"name":"test_user"}])
    
    // insertOne只能插入一条数据
    db.npmmanages.insertOne({"name":"xiaoming"})
    
    // insertMany可以插入一条或多条数据，但是必须以列表(list)的形式组织数据
    db.npmmanages.insertMany([{"name":"xiaoming"}])
    
    // 如果不指定_id，save的功能与insert一样
    db.npmmanages.save([{"name":"xiaoming"},{"name":"test_user"}])
    
    // 如果指定_id，mongodb就不为该条记录自动生成_id了，只有save可以指定_id，insert、insertOne、insertMany都不可以
    db.npmmanages.save({"_id":ObjectId("5d07461141623d5db6cd4d43"),"name":"xiaoming"})
```

### 5、更新(update)
```javascript
    // 更新设置的字段
    db.catalogs.update({"_id": 123}, { "$set": {"isDelete": 10000}})
    
    // 更新isDelete,且将其他字段全部置为空(_id) 除外
    db.catalogs.update({"_id": 123},{"isDelete":1000})
    
    // 注释
    mongoose中 上面两种方法更新都是只更新isDelete字段

```

### 6、删表(remove)
```javascript
    // 删除表
    db.catalogs.remove()

    // 删除指定文档
    db.catalogs.remove({catalogName: "111"})
```

#### 7、删库(drop)
```javascript
    // 删除库
    db.catalogs.drop()
```
## 更多相关网站

[Mongoose 中文文档](https://itbilu.com/nodejs/npm/B1FfBss6X.html)
[MongoDB 常用语句](https://laixiazheteng.com/article/page/id/Bj7qgmJ3CJUE)
[MogoDB@育仪](https://fe.che300.com/easymock/wikiCatalog/5e4e6cec85f8d31f5db78391)