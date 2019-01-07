//chat server
var app     = require("express")();
var express = require("express");
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var fs      = require("fs");

var hostname = "192.168.0.14";
var port     = 3000;

app.get('/', function(req, res){
    log("[notification] incoming connection from: " + (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress));
    
    res.sendFile(__dirname + '/index.html');
});

//so that the resources can be loaded.
app.use(express.static(__dirname));

io.on('connection', function(socket){
    //notify everyone
    io.emit('notification', "somebody has entered this chatroom.");

    socket.on('chat message', function(msg){
    //processing
    log("[message] " + msg);
    io.emit('chat message', msg);
  });
});

io.on('disconnect', function() {
    log("[notification] somebody has disconnected.");
    io.emit('chat message', "somebody has disconnected.");
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});

//custom log function
function log(msg) {
    msg = msg.trim();
    if (msg == "") {
        return;
    }
    
    console.log(get_date_time() + " " + msg);
}

//helper, courtesy of Stack Overflow
function get_date_time() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}