// 'use strict'

// class Base {
//     success() {
//         console.log(this, 'this-2')
//     }
// }

// class SubBase extends Base {
//     click() {
//         debugger
//         const { success } = this;
//         console.dir(success)
//         success();
//     }
// }
// let a = new SubBase;
// a.click();


function Base() { }
Base.prototype.click = function () {
    function success() {
        console.log(this, 'es5') // es5写法挂载到 window 对象下
    }
    success()
}
let base = new Base();
base.click()
