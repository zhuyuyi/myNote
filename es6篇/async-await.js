function promise1() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('1')
            resolve('promise1')
        }, 2000)
    })
}

function promise2() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('2')
            resolve('promise2')
        }, 1000)
    })
}

async function async1() {
    await promise1();
    await promise2();
}

async1()