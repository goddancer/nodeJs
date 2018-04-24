/**
 * Created by CCNC on 2018/4/24.
 * 读取Json文件，返回一个Html
 */
var http = require('http');//引入http内置模块，提供http服务
var fs = require('fs');//引入文件系统内置模块

http.createServer(function(req,res){
  if(req.url == '/'){
    fs.readFile('./title.json',function(err, data){
      if(err){
        console.error(err);
        res.end('Server Error');
      }else{
        var titles = JSON.parse(data.toString());

        fs.readFile('./template.html',function(err, data){
          if(err){
            console.error(err);
            res.end('Server Error');
          }else{
            var tmpl = data.toString();

            var html = tmpl.replace('%', titles.join('</li><li>'));
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
          }
        })
      }
    })
  }
}).listen(8000, "127.0.0.1");
