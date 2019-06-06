const http = require('http');
const fs = require('fs');

const server = http.createServer();

server.on('request', (req, res) => {

	// currentUrl获取当前请求地址
	const currentUrl = req.url;
	if (currentUrl === '/') {
		fs.readFile('./view/index.html', 'utf8', (err, data) => {
			readHtml(err, data, res)
		});
	} else if (currentUrl === '/add') {
		fs.readFile('./view/add.html', 'utf8', (err, data) => {
			readHtml(err, data, res)
		});
	} else if (currentUrl.indexOf('/public') === 0) {
		// 判断是否是静态文件
		fs.readFile('./' + currentUrl, 'utf8', (err, data) => {
			readCss(err, data, res)
		});
	} else {
		res.write('404');
		res.end();
	}
})

server.listen(8080, () => {
	console.log('正在监听 8080 端口')
})



function readHtml(err, data, res) {
	if (err) {
		res.end('404 Not Found');
	}
	res.setHeader('Content-Type', 'text/html;charset=utf-8');
	res.write(data);
	res.end();
}

function readCss(err, data, res) {
	if (err) {
		res.end('404 Not Found');
	}
	// res.setHeader('Content-Type', 'text/css;charset=utf-8');
	res.write(data);
	res.end();
}