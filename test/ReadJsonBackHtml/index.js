/**
 * Created by CCNC on 2018/4/24.
 * 读取Json文件，返回一个Html
 */
var http = require('http');//引入http内置模块，提供http服务
var fs = require('fs');//引入文件系统内置模块

http.createServer(function(req,res){//创建http服务，并用回调定义响应逻辑
  if(req.url == '/'){
    fs.readFile('./titles.json',function(err, data){//读取json文件，并用回调定义如何处理其中的内容
      if(err){//如果出错，输出错误日志，并给客户端返回Server Error
        console.error(err);
        res.end('Server Error');
      }else{
        var titles = JSON.parse(data.toString());
        console.log(titles);//将titles输出到控制台

        fs.readFile('./template.html',function(err, data){//读取html文件，并在加载完成后使用回调
          if(err){
            console.error(err);
            res.end('Server Error');
          }else{
            var tmpl = data.toString();
            //res.end('<code>'+tmpl+'</code>');//将tmpl输出到html

            var html = tmpl.replace('%', titles.join('</li><li>'));//组装html页面，以显示博客标题
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);//将html页面发送给用户
          }
        })
      }
    })
  }
}).listen(8000, "127.0.0.1");
console.log('Server running at http://localhost:8000/ or http://127.0.0.1:8000/');