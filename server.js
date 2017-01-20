//webchat服务入口
var http = require('http');
var mime = require('mime');
var path = require('path');
var fs	 = require('fs');

var cache = {};


//http服务逻辑
var server = http.createServer(function(req, res){
	//简易的路由分发
	var router = false;

	//构造路由
	if(req.url == '/'){
		router = 'public/index.html';
	}else{	
		//现在默认url必须是html结尾，后期可以拓展为兼容restful风格的，/list即将匹配list.html
		router = 'public'+req.url;
	}
	var absPath = './'+router;
	serveStatic(res, absPath);
});

server.listen(3333,console.log('server listening on port 3333'));




/*---------------辅助函数---------------*/

//404响应
function send404(res){
	res.writeHead(404);
	res.write('Error 404:resource not found');
	res.end();
}

//发送http body，此处为文件内容
function sendFile(res, filepath, filecontents){
	res.writeHead(200, {'Content-Type':mime.lookup(path.basename(filepath))});
	res.end(filecontents);
};

//缓存文件到内存
function serveStatic(res, absPath){
	if(cache[absPath]){
		sendFile(res, absPath, cache[absPath]);
	}else{
		fs.exists(absPath, function(exists){
			if(exists){
				fs.readFile(absPath, function(err, data){
					if(err){
						send404(res);
					}else{
						cache[absPath] = data;
						sendFile(res, absPath, cache[absPath]);
					}
				})
			}else{
				send404(res);
			}
		})
	}
};







