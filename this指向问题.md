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
这篇文章的网址 https://juejin.im/post/59bfe84351882531b730bac2 未完待续
