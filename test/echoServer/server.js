/**
 * Created by CCNC on 2018/4/25.
 * echo服务器是一个处理重复性事件的简单例子，当你给它发送数据时，它会把这个数据返回回来。
 * telnet设置，参考https://blog.csdn.net/zryxh1/article/details/18951613
 */
var net = require('net');
var server = net.createServer(function(socket){
  socket.on('data', function(data){//用on方法响应事件
    console.log(data.toString());//显示在node控制台
    socket.write(data);//显示在telnet控制台
  })
});
server.listen(8888);