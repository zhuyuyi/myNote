var http = require('http');

const server = http.createServer();

server.on('request',(req,res)=>{

	console.log('收到用户请求' + req.url);

	// console.log(req.headers); // 请求 头
	// console.log(req.rawHeaders); // 请求头部信息
	// console.log(req.httpVersion); // 获取 HTTP 版本
	// console.log(req.method); // 获取请求方法
	// console.log(req.url); // 获取请求路径


	let msg = '';

	if(req.url === '/'){
		msg = '这是首页'
	} else if(req.url === '/index'){
		msg = '这是index页面'
	} 


	res.statusCode = 404;
	res.statusMessage = 'Not Found2';
	res.setHeader('Content-Type','text/html;charset=utf-8');

	res.write(`<h1>${msg}</h1>`);
	res.end(' zyy')
});

server.listen(8080,()=>{
	console.log('服务启动成功，端口号为8080')
});

