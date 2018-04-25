/**
 * Created by CCNC on 2018/4/25.
 * 用once方法响应单次事件
 */
var net = require('net');
var server = net.createServer(function(socket){
  socket.once('data', function(data){//用once方法响应单次事件
    socket.write(data);//显示在telnet服务器端
    console.log(data.toString());//显示在node服务器端
  })
});
server.listen(8848);
