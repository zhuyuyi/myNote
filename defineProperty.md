### Object.defineProperty

四个默认属性，configurable、enumerable、writeable、value
```
var person = {};
Object.defineProperty(person,'name',{
    configurable:false, // 无法修改属性值,默认为false,如果第一次设置为false，之后再怎么设置它都会报错。
    value:'zyy'
});
delete person.name;
alert(person.name); // zyy 
// writable 是否为只读属性
// enumerable 属性特性 enumerable 定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举。
```
非严格模式下，不会产生任何结果，严格模式下报错。Object.defineProperty 如果不指定是什么，默认就是false

在读取访问器属性时，会调用 getter 函数，在写入访问器属性时，会调用 setter 函数，

```

```
未完待续



