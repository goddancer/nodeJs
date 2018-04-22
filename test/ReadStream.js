/**
 * Created by zjc on 2018/4/22.
 * 将一张图片流到客户端
 * Content-Type: 1）text/plain 文本 2）image/jpg jpg格式图片 3）image/png png格式图片
 */
var http = require('http');//引入http功能组件
var fs = require('fs');//引入文件操作组件
http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'image/jpg'});//写请求头，200表示成功。设置请求头类型。image/jpg
  fs.createReadStream('../image/desert.jpg').pipe(res);//创建数据流
}).listen(3000);
console.log('Server running at http://localhost:3000/');