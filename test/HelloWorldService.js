/**
 * Created by zjc on 2018/4/22.
 */
/*var http = require ('http');
http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('Hello World\n');
}).listen(3000);
console.log('Server running at http://localhost:3000/');*/
/*等价于*/
var http = require('http');
var server = http.createServer();
server.on('request',function(req,res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('Hello World\n');
});
server.listen(3000);
console.log('Server running at http://localhost:3000/');
