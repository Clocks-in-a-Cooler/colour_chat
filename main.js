//chat server
var app     = require("express")();
var express = require("express");
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var fs      = require("fs");

var hostname = "192.168.0.14";
var port     = 3000;

var users = {
    //empty object
    
    add_user: function(id, name, colour) {
        this[id] = new User(name, colour);
        
        log("[notification] a new user created: \n    id: " + id + "\n    name: " + name + "\n    colour: " + colour);
    },
    
    get_user: function(id) {
        return this[id];
    },
    
    remove_user: function(id) {
        delete this[id];
    },
};

app.get('/', function(req, res){
    log("[notification] incoming connection from: " + (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress));
    
    res.sendFile(__dirname + '/index.html');
});

//so that the resources can be loaded.
app.use(express.static(__dirname));

io.on('connection', function(socket) {
    //login event
    socket.on('login', function(name) {
        var new_colour = get_colour();
        
        users.add_user(socket.id, name, new_colour);
    
        log("[notification] " + name + " has connected to the chat server from " + socket.handshake.address + "\n    socket_id: " + socket.id);
        io.emit('colour', new_colour);
        io.emit('notification', name + " has connected to this server. welcome!");
    });

    socket.on('chat message', function(msg) {
        //processing
        var message = JSON.parse(msg);
        log("[message] " + message.name + ": " + message.content);
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        var user = users.get_user(socket.id);
        
        if (user) {
            log("[notification] " + user.name + " has disconnected.");
            io.emit('notification', user.name + " has disconnected.");
            
            chat_colours[user.colour] = true; //free up that precious colour!
        } else {
            log("[notification] " + socket.id + " has disconnected.");
        }
        //more processing after. you'd think we'd be done, but no
        
        users.remove_user(socket.id);
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

/* ------------------------------------------------------------------------------------------------------- */
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
    
    //log("[notification] colour chosen: " + colour);
    
    chat_colours[colour] = false;
    
    return colour;
}

/* ------------------------------------------------------------------------------------------------------------ */
//user type

function User(name, colour) {
    this.colour = colour;
    this.name   = name;
}