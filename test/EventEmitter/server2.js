/**
 * Created by CCNC on 2018/4/25.
 * 用事件发射器来实现简单的发布、订阅系统
 */
var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};//存放访客客户端id
channel.subscriptions = {};//存放响应id的socket处理函数

var server = net.createServer(function (socket) {
  var id = socket.remoteAddress + ':' + socket.remotePort;
  //console.log(socket.remoteAddress);//::ffff:127.0.0.1
  //console.log(socket.remotePort);//50935，下线会重新分配
  channel.emit('join', id, socket);//触发join时间，并传入两个参数
  socket.on('data', function (data) {//监听data变化
    data = data.toString();
    channel.emit('broadcast', id, data);//数据变化后，触发广播事件
  })
});

channel.on('join', function (id, client) {//绑定join事件
  var that = this;console.log('join'+id);
  that.clients[id] = client;
  that.subscriptions[id] = function(senderId, message){//给每个id下存放socket处理函数
    console.log('broadcast'+senderId);
    console.log('notSame'+id);
    if(id != senderId){//对id不等的一端更新。发信端，不需更新当前发起消息
      that.clients[id].write(message);
    }
  };
  that.on('broadcast', that.subscriptions[id]);
});

server.listen(6666);