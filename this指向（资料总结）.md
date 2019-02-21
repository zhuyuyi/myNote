### this 指向问题

this指向问题可以归结为四类

###### 默认绑定

默认绑定--函数调用类型：独立函数调用，this指向全局对象。
```
var a = "foo";  
function foo(){  
    console.log(this.a);  
}  
foo();  // "foo"  
```
在严格模式下，全局对象将无法使用默认绑定，因此this会绑定到undefined。
```
var a = "foo";  
function foo(){  
    "use strict";  
    console.log(this.a);  
}  
foo();  // TypeError：this is undefined  
```

###### 隐式绑定

1. 调用位置是否有上下文对象，或者说被某个对象拥有或者包含

```
function foo(){  
    console.log(this.a);  
}  
var obj1 = {  
    a : 2,  
    foo : foo  
}  
var obj2 = {  
    a : 1,  
    obj1 : obj1  
}  
obj2.obj1.foo();    //结果：2  
```
2. 隐式丢失
```
var a = "foo";  
function foo(){  
    console.log(this.a);  
}  
var obj = {  
    a : 2,  
    foo : foo  
}  
var bar = obj.foo;  
bar();  //"foo"  
```
虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是不带任何修饰的函数调用，因此应用了默认绑定。

###### 显示绑定

call()、apply()、bind(),详情请见同级目录下 call 与 aplly html 以及 this指向问题（个人总结）.md

###### new绑定

1. 函数是否是new绑定？如果是，this绑定的是新创建的对象。
```
var bar = new Foo();  
```
2. 函数是否通过call、apply显示绑定或硬绑定？如果是，this绑定的是指定的对象。
```
var bar = foo.call(obj);  
```
3. 函数是否在某个上下文对象中隐式调用？如果是，this绑定的是那个上下文对象。
```
var bar = obj.foo();
```
4. 上述全不是，则使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局window对象。
```
var bar = foo(); 
```

###### 注意点

把null或undefined作为this的绑定对象传入call、apply、bind，调用时会被忽略，实际应用的是默认绑定规则！
```
function foo(){  
    console.log(this.a);  
}  
var a = 1;  
foo.call(null, 2);          //1  
foo.apply(undefined, [3]);  //1  
```
###### es6箭头函数

箭头函数不使用this的四种标准规则，而是根据外层（函数或者全局）作用域来决定this。
箭头函数的绑定无法被修改。常用于回调函数中，如事件处理器或定时器。和ES6之前代码中的this = self机制一样。
```
function foo(){  
    setTimeout(()=>{  
        console.log(this.a);  
    },100);  
}  
var obj = { a : 2};  
foo.call(obj);  
```

###### this 如何确定 详解

1. （隐式绑定）如果某个对象中某个成员是个function，当从 这个对象 上调用这个方法 时 this 指向 当前对象。
```
var myObj = {  
    firstname:"li",  
    lastname:"gang",  
    timeTravel:function(year){  
        console.log(this.firstname + " " + this.lastname + " is time traveling to " + year);  
    }  
}  
myObj.timeTravel(2014);    //li gang is time traveling to 2014（父/拥有者对象：myObj）  
```
2. （隐私绑定）可以通过创建一个新的对象，来引用FenFei对象上的timeTravel方法。
```
var Camile = {  
    firstname:"li",  
    lastname:"yunxia"  
}
Camile.timeTravel = myObj.timeTravel;  
Camile.timeTravel(2014);    //li yunxia is time traveling to 2014（父/拥有者对象：Camile）  
```
3. （隐式丢失）使用变量保存FenFei.timeTravel方法的引用
```
var getTimeTravel = myObj.timeTravel;  
getTimeTravel(2014);    //undefined undefined is time traveling to 2014（父/拥有者对象：Window；window对象里并没有firstName和lastName属性）  
```
4. 异步调用的方法内部的this
```
var btnDom = document.getElementById("zyy");  
btnDom.addEventListener('click',myObj.timeTravel);//undefined undefined is time traveling to [object MouseEvent]（父/拥有者对象：button）  
  
btnDom.addEventListener('click',function(e){  
    myObj.timeTravel(2014);//li gang is time traveling to 2014（父/拥有者对象：myObj）  
});  
```
5. （new绑定）构造函数里的this
当使用构造函数创建一个对象的实例时，构造函数里的this就是新建的实例。
```
var TimeTravel = function(fName, lName){  
    this.firstname = fName;  
    this.lastname = lName;  
}  
var myObj = new TimeTravel("li", "gang");  
console.log(myObj.firstname + " " + myObj.lastname);      //li gang  
```
6. （显示绑定）call和apply方法设定this值
```
var Camile = {  
    firstname:"li",  
    lastname:"yunxia"  
}  
myObj.timeTravel.call(Camile,2014);        //li yunxia is time traveling to 2014（指定this对象为Camile）  
myObj.timeTravel.apply(Camile,[2014]); //li yunxia is time traveling to 2014（指定this对象为Camile）  
```
7. （显示绑定）bind将函数绑定至某个对象（ES5）
```
function f(y){  
    return this.x + y;  
}  
var o = {x:1};  
/* f.bind(o)返回一个新函数，调用g(2)会把原始的函数f()当作o的方法来调用 */  
var g = f.bind(o);    
g(2);   // 3  
```


