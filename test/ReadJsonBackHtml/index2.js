/**
 * Created by CCNC on 2018/4/25.
 * 通过创建中间函数减少嵌套
 */
var http = require('http');//引入http模块，提供http服务
var fs = require('fs');//引入文件操作模块

var server = http.createServer(function(req, res){//创建http服务，并用回调定义响应逻辑
  console.log(req.url);
  if(req.url == '/'){//判断请求路径
    getJsonData(res);
  }else{
    res.end('path is wrong');
  }
});
function getJsonData(res){//读取json数据并做处理
 fs.readFile('./titles.json',function(error, data){
   if(error){
     handleError(error, res);
   }else{
     getTemplate(JSON.parse(data.toString()), res);//JSON.pare()将json字符串转换为对象
   }
 })
}
function handleError(error, res){//错误处理函数
  console.log(error);
  res.end('Server Error');
}
function getTemplate(obj, res){//获取html模板数据
  fs.readFile('./template.html', function(error, data){
    if(error){
      handleError(error, res);
    }else{
      formatHtml(obj, data.toString(), res);
    }
  })
}
function formatHtml(obj, html, res){//组合新html模板并返回，实际是字符串的操作
  var newHtml = html.replace('%', obj.join('</li><li>'));
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(newHtml);
}
server.listen(3000);
