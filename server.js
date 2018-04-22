/**
 * Created by zjc on 2018/4/22.
 * 程序主文件
 */
/*
* 变量声明
* */
var http = require('http');//内置的http模块，提供http服务和客户端功能
var fs = require('fs');//文件系统模块
var path = require('path');//内置的path模块，提供了与文件系统路径相关的功能
var mime = require('mime');//附加的mime模块，有根据文件扩展名得出MIME类型的能力
var cache = {};//cache是用来缓存文件内容的对象

/*文件不存在时，发送404错误*/
function send404(response){
  response.writeHead(404,{'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}
/*文件数据服务*/
function sendFile(response, filePath, filecontents) {
  response.writeHead(
    200,
    {'Content-Type': mime.lookup(path.basename(filePath))}
  );
  response.end(filecontents);
}
/*
* 提供静态文件服务
* 确定文件是否缓存，如果缓存了，返回它；如果没有缓存，从硬盘中读取并返回它；如果文件不存在，返回一个404错误
* */
function serveStatic(response, cache, absPath) {
  if(cache[absPath]){//检查文件是否存在内存中
    sendFile(response, absPath, cache[absPath]);//如果存在，返回文件
  }else{//如果不存在
    fs.exists(absPath, function (exists) {//检查文件是否存在硬盘中
      if(exists){//如果存在
        fs.readFile(absPath, function (err, data) {//读取这个文件
          if(err){//如果读取失败
            send404(response);//返回错误信息
          }else{//如果读取成功
            cache[absPath] = data;//缓存这个文件
            sendFile(response, absPath, data);//并且返回这个文件
          }
        })
      }else{//如果文件不存在硬盘中
        send404(response);//返回错误信息
      }
    })
  }
}
/*
* 创建http服务器的逻辑
* */
var server = http.createServer(function (request, response) {//创建http服务，并处理每个请求
  var filePath = false;

  if(request.url == '/'){
    filePath = 'public/index.html';//返回默认的html文件
  }else{
    filePath = 'public' + request.url;//将url路径转化为文件的相对路径
  }

  var absPath = './' + filePath;//得到绝对路径
  serveStatic(response, cache, absPath);//返回静态文件
});
/*
* 启动http服务器
* */
server.listen(3000, function () {
  console.log("Server listening on port 3000.");
});