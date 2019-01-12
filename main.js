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

io.on('connection', function(socket) {
    //give the new person their colour
    io.emit('colour', get_colour());

    //notify everyone
    io.emit('notification', "somebody has entered this chatroom.");

    socket.on('chat message', function(msg){
        //processing
        var message = JSON.parse(msg).content;
        log("[message] " + message);
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        log("[notification] somebody has disconnected.");
        io.emit('chat message', "somebody has disconnected.");
    });
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

/*------------------------------------------------------------------------------------------*/
//the colour part of this
//colours for the chat box
var chat_colours = {
    "mediumvioletred": true,
    "crimson": true,
    "orangered": true,
    "darkorange": true,
    "gold": true,
    "darkkhaki": true,
    "sienna": true,
    "chocolate": true,
    "limegreen": true,
    "forestgreen": true,
    "lightseagreen": true,
    "steelblue": true,
    "royalblue": true,
    "plum": true,
    "orchid": true,
    "darkslateblue": true,
};

function get_colour() {
    var colours = Object.getOwnPropertyNames(chat_colours).filter(function(c) {return chat_colours[c]});
    
    if (colours.length == 0) {
        colours = Object.getOwnPropertyNames(chat_colours);
    }
    
    var colour = colours[Math.floor(Math.random() * colours.length)];
    
    log("[notification] colour chosen: " + colour);
    
    chat_colours[colour] = false;
    
    return colour;
}