### class

https://mp.weixin.qq.com/s?__biz=MzI4MDYyNjQ1OA==&mid=2247483956&idx=1&sn=adc1ec7ae4cd3f01728fdcb43a38690f&chksm=ebb4d641dcc35f57cd2bf66ba9819874cf300108884700bf3d6a1410c18c0ed4ff3d90d10a8f#rd

###### 类声明和函数声明的区别和特点
1、函数声明可以被提升，类声明不能提升(与let声明类似)。
2、类声明中的代码自动强行运行在严格模式下。
3、类中的所有方法都是不可枚举的，而自定义类型中，可以通过Object.defineProperty()手工指定不可枚举属性。
4、每个类都有一个[[construct]]的方法。
5、只能使用new来调用类的构造函数。
6、不能在类中修改类名。

###### 类表达式
类有2种表现形式：声明式和表达式。
```javascript
class B {
    constructor(){}
}
let A = class {
    constructor(){}
}
// B 可以在外部使用，但是 B1 只能在内部使用
let B = class B1 {
    constructor(){}
}
```
###### 可以将类作为参数传入
```javascript
let A = class {
    sayName(){
        console.log(1);
    }
}
function test (zyy){
    retrun new zyy()
}
let As = test(A);
As.sayName(); // 1
```
###### 通过立即调用类构造函数可以创建单例。
用new调用类的表达式，紧接着通过一对小括号调用这个表达式。
```javascript
class A {
    constructor(name){
        this.name = name;
    }
    sayName(){
        console.log(this.name)
    }
}('zyy')
console.log(A.sayName());  // zyy
```
###### 访问器属性

类支持在原型上定义访问器属性。
尽管应该在类的构造函数中创建自己的属性，但是类也支持直接在原型上定义访问器属性。创建getter时，需要在关键字get 后紧跟一个空格和响应的标识符；创建setter时，只需把关键字get替换为set即可。
```javascript
class A{
    constructor(state){
        this.state = state;
    }
    get myName(){
        return this.state.name;
    }
    set myName(){
        this.state.name = name;
    }
}
let desripor = Object.getOwnPropertyDescriptor(A.prototype,'myName');
console.log('get',in desripor); // true
console.log(desripor.enumerable); // false 不可枚举
```
###### 可计算成员名称

可计算成员是指使用方括号包裹一个表达式，如下面定义了一个变量m，然后使用[m]设置为类A的原型方法。
```javascript
let m = 'zyy';
class A {
    constructor(name){
        this.name = name;
    }
    [m](){
        return this.name
    }
}
let a = new A('你好');
console.log(a.zyy()); // 你好
```
###### 生成器方法
https://mp.weixin.qq.com/s?__biz=MzI4MDYyNjQ1OA==&mid=2247483956&idx=1&sn=adc1ec7ae4cd3f01728fdcb43a38690f&chksm=ebb4d641dcc35f57cd2bf66ba9819874cf300108884700bf3d6a1410c18c0ed4ff3d90d10a8f#rd

###### 静态成员

静态成员是指在方法名或属性名前面加上static关键字，和普通方法不一样的是，static修饰的方法不能在实例中访问，只能用类名直接访问。
```javascript
class A{
    constructor(name){
        this.name = name;
    }
    static create(name){
        return new A(name)
    }
}
let A = A.create('zyy');
console.log(a.name); // zyy
let t = new A();
console.log(t.create('zyy'))'; // 报错
```
###### 继承与派生类






