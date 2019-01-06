//chat server
var app     = require("express")();
var express = require("express");
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var fs      = require("fs");

var hostname = "192.168.0.14";
var port     = 3000;

app.get('/', function(req, res){
    console.log("incoming connection from: " + (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress));
    
    //if (!req.secure) {res.redirect('https://' + req.headers.host + req.url);}
    res.sendFile(__dirname + '/index.html');
    //res.sendFile(__dirname + '/styles.css');
    //res.sendFile(__dirname + '/script.js');
});

app.use(express.static(__dirname));

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    //processing
    console.log(msg);
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});


/* ----------------- for reference -------------------------------
var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var port = process.env.PORT || 3000;
var fs   = require('fs');

app.get('/', function(req, res){
  console.log("incoming connection from: " + (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress));

  //if (!req.secure) {res.redirect('https://' + req.headers.host + req.url);}
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log("message: " + msg);
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

*/