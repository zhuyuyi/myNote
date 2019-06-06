var fs = require('fs');

// 这是第一种方式
fs.readFile('fileES7.js', (err,data)=>{
	if(err){
		console.log(err);
		return;
	}
	// 这是一个 Buffer 对象
	console.log(data);
	// 通过 toString() 转为 字符串
	console.log(data.toString())

});

// 这是第二种方式

fs.readFile('fileES7.js', 'utf-8', (err,data)=>{
	if(err){
		console.log(err);
		return;
	}
	console.log(data);
});
