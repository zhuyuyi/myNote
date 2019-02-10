### this指向

this 指向 可以 定义为 this 永远指向最后调用它的那个对象。

```
    var name = "windowsName";
    function a() {
        var name = "Cherry";

        console.log(this.name);          // windowsName

        console.log("inner:" + this);    // inner: Window
    }
    a();
    console.log("outer:" + this)         // outer: Window
```
上面的例子中 先声明并赋值了一个 全局 name 变量 和 函数 a，当执行函数 a 时，由于函数 a 在 全局作用域下执行，相当于 window.a(),所以 this.name 值为 "windowsName"，this 指向 window。
```
    var name = "windowsName";
    var a = {
        name: "Cherry",
        fn : function () {
            console.log(this.name);      // Cherry
        }
    }
    a.fn();
```
和上面不同的是 定义了一个 对象 a ，调用时 a.fn(); 根据 this 永远指向最后调用它的那个对象，所以 this 指向 对象 a, 事实上，对象a，可以看做 window 对象的一个属性，所以可以这样调用 window.a.fn()
```
    var name = "windowsName";
    var a = {
        // name: "Cherry",
        fn : function () {
            console.log(this.name);      // undefined
        }
    }
    a.fn();
```
这里，我把 对象 a 中的 name 注掉，此时 a.fn(),为 undefined。

###### 改变 this 指向

使用 ES6 的箭头函数
在函数内部使用 _this = this
使用 apply、call、bind
new 实例化一个对象
```
    var name = "windowsName";

    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name);    
        },

        func2: function () {
            setTimeout(  function () {
                console.log(this);     // window
            },100);
        }

    };

    a.func2()  
```
在执行 a.func2()时，setTimeout函数进入异步任务队列，系统准备压栈处理，100ms后，开始执行，此时this 无法找到正确的指向，所以 在非严格模式下，this 指向 window ，严格模式下，报错。

在es6箭头函数情况下，箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined”。

###### apply call bind
```
    var a = {
        name : "Cherry",
        func1: function () {
            console.log(this.name)
        },
        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.apply(a),100);
        }
    };
    a.func2()            // Cherry
```
通过 apply 强行改变了 this 指向
```
    var a = {
        name : "Cherry",
        func1: function () {
            console.log(this.name)
        },
        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.call(a),100);
        }
    };
    a.func2()            // Cherry
```
通过 call
```
    var a = {
        name : "Cherry",
        func1: function () {
            console.log(this.name)
        },
        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.bind(a)(),100);
        }
    };
    a.func2()            // Cherry
```
通过 bind

fun.apply(thisArg, [argsArray]);
thisArg 是 this 指向，在浏览器中如果没有找到 this ，最终会把 this 指向 全局对象 window，argsArray 是传的参数
fun.call(thisArg[, arg1[, arg2[, ...]]]); 
call 接受的是若干个参数列表， apply 是接受一个数组，而bind 方法会创建一个新的函数
###### js函数调用
1. 作为一个函数调用
```
    var name = "windowsName";
    function a() {
        var name = "Cherry";
        console.log(this.name);          // windowsName
        console.log("inner:" + this);    // inner: Window
    }
    a();
    console.log("outer:" + this)         // outer: Window
```
a函数不属于任何一个 常规变量，就是一个函数。在这种情况下，调用函数时，this在非严格模式下，指向 window ，严格模式下 为 undefined

2. 使用构造函数
```
function myFunction(arg1, arg2) {
    this.firstName = arg1;
    this.lastName  = arg2;
}
// This    creates a new object
var a = new myFunction("Li","Cherry");
a.lastName;    
```
下面是 new 过程的伪代码
```
var a = new myFunction("Li","Cherry");
new myFunction{
    var obj = {};
    obj.__proto__ = myFunction.prototype;
    var result = myFunction.call(obj,"Li","Cherry");
    return typeof result === 'obj'? result : obj;
}
```
1.创建一个新的空对象obj
2.把这个obj的原型指向构造函数 myFunction 的原型
3.改变 this 指向，变为 new 出来的新对象 使用的 call
4.如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接直接返回该对象。

