// 这是 myVue 构造函数
function myVue(obj){
    this._init(obj);
}
// 初始化 myVue 构造函数
myVue.prototype._init = function(obj){
    this.$obj = obj;                             // obj 为 用户定义时 的 el、data、methods等
    this.$el = document.querySelector(obj.el);   // #app
    this.$data = obj.data;                       // data 
    this.$methods = obj.methods;                 // methods 
    this._binding = {};                          // binding 保存着 model 与 view 的映射关系，Watcher实例
    this._obverse(this.$data);                   // 调用 _obverse 方法
    this._complie(this.$el);                     // 将 view 与 model 绑定
}
// 实现 obverse 对 data 中的 set get 函数处理
myVue.prototype._obverse = function(myData){
    Object.keys(myData).forEach((key)=> {
        this._binding[key] = {
            _arr:[]
        };
        console.log(this._binding);
        var value = myData[key];
        typeof value === 'object' ? this._observe(value) : ''  // 先只考虑object 不考虑数组
        var binding = this._binding[key];
        Object.defineProperty(this.$data,key,{
            enumerable:true,
            configurable:true,
            get:function(){
                console.log(`获取了${value}`);
                return value;
            },
            set:function(newValue){
                console.log(`更新了${newValue}`);
                if(value !== newValue){
                    value = newValue;
                    binding._arr.forEach((item)=>{
                        item.update();
                    })
                }
            }
        })
    })
}
// _complie
myVue.prototype._complie = function(ele){
    var nodes = ele.children;
    for(const node of nodes){
        if(node.children.length){
            this._complie(node);   // 对元素循环处理
        } else if(node.hasAttribute('v-click')){
            node.onclick = (()=>{
                var method = node.getAttribute('v-click');
                // return _this.$methods[attrVal].bind(_this.$data);    // this指向
                return this.$methods[method].bind(this.$data);
            })()
        } else if(node.hasAttribute('v-model') && (node.tagName === 'INPUT')){
            node.addEventListener('input',(()=>{
                let attrVal = node.getAttribute('v-model');
                this._binding[attrVal]._arr.push(new Watcher(
                    'input',
                    node,
                    this,
                    attrVal,
                    'value'
                ));
                return ()=>{
                    this.$data[attrVal] = node.value;
                }
            })())
        } else if(node.hasAttribute('v-bind')){
            var attrVal = node.getAttribute('v-bind');
            this._binding[attrVal]._arr.push(new Watcher(
                'text',
                node,
                this,
                attrVal,
                'innerHTML'
            ))
        }
    }

}
// 指令类 Watcher 绑定更新函数，实现对 DOM 元素的更新
function Watcher(name,el,vm,val,attr){
    this.name = name;    // 节点名称 如 input 
    this.el = el;        // DOM节点
    this.vm = vm;        // myVue 实例
    this.val = val;      // 节点值，data中的自定义的属性
    this.attr = attr;    // 需要绑定的属性名称
    this.update();
}
Watcher.prototype.update = function(){
    this.el[this.attr] = this.vm.$data[this.val];  // div1.innerHTML = this.data.zyy
}

