/**
 * Created by zjc on 2018/4/22.
 */
/*
* 变量声明
* */
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};
/*
* 启动Socket.IO服务器
* */
exports.listen = function(server){
  io = socketio.listen(server);//启动Socket.IO服务，并搭建在已有http服务上
  io.set('log level', 1);//限定Socket.IO向控制台输出日志的详细程度

  io.sockets.on('connection', function (socket){//定义每个用户链接的处理逻辑
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);//在用户连接上时，赋予其一个访客名
    joinRoom(socket, 'Lobby');//在用户连接上来时把他放入Lobby聊天室

    handleMessageBroadcasting(socket, nickNames);//处理用户的消息
    handleNameChangeAttempts(socket, nickNames, namesUsed);//处理用户的更名
    handleRoomJoining(socket);//处理聊天室的创建和变更

    socket.on('rooms', function(){//用户发出请求时，像其提供已经被占用的聊天室的列表
      socket.emit('rooms', io.sockets.adapter.rooms);
    });

    handleClientDisconnection(socket, nickNames, namesUsed);//定义用户断开连接后的清除逻辑
  })
};
/*
* 分配用户昵称
* */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber;//生成新的昵称
  nickNames[socket.id] = name;//把用户昵称跟客户端连接ID关联上
  socket.emit('nameResult', {//让用户知道他们的昵称
    success: true,
    name: name
  });
  namesUsed.push(name);//存放已经被占用的昵称
  return guestNumber + 1;//增加用来生成昵称的计数器
}
/*
* 进入聊天室
* */
function joinRoom(socket, room) {
  socket.join(room);//让用户进入房间
  currentRoom[socket.id] = room;//记录用户的当前房间
  socket.emit('joinResult', {room: room});//让用户知道他们进入了新的房间
  socket.broadcast.to(room).emit('message', {//让房间的其他用户知道新用户进入了房间
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  var usersInRoom = io.sockets.clients(room);//确定有哪些用户在这个房间里
  if (usersInRoom.length > 1) {//如果不止一个用户在这个房间里，汇总下都是谁
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary});//将房间的其他用户汇总发送给这个用户
  }
}
/*
* 更名请求的处理逻辑
* */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) {//添加nameAttempt事件监听器
    if (name.indexOf('Guest') == 0) {//昵称不能以Guest开头
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) == -1) {//如果昵称还没注册，就注册使用
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];//删除之前的昵称，使其他用户可用
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', {//如果昵称已经被占用，给客户端发送错误消息
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}
/*
* 发送聊天消息。broadcast函数用来转发消息。
* 用户发射一个事件，表明消息是从哪个房间发出来的，以及消息的内容是什么；然后服务器将这条消息转发给同一房间的所有用户。
* */
function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}
/*
* 创建房间。更换房间功能。
* */
function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}
/*
* 用户断开连接
* 当用户离开聊天程序时，从nickNames和namesUsed中移除用户昵称
* */
function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}