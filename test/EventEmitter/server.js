/**
 * Created by CCNC on 2018/4/25.
 */
var EventEmitter = require('events').EventEmitter;//事件发射器
var channel = new EventEmitter();//channel事件发射器
channel.on('join', function(){//设置join事件监听
  console.log('Welcome');
});
/*
* emit函数触发join事件
* */
channel.emit('join');