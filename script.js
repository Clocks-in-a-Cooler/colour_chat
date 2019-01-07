//i am *not* messing with jquery
function position_elements() {
    //main panel first
    main_panel.style.top  = "0px";
    main_panel.style.left = (window.innerWidth * 0.3 - 1) + "px";
    
    var main_panel_width    = window.innerWidth * 0.4 -2;
    main_panel.style.height = (window.innerHeight - 3) + "px"; //border on the top and bottom
    main_panel.style.width  = (main_panel_width) + "px";
    
    //name input will take up abut 25%
    name_input.style.bottom = "5px";
    name_input.style.left   = "5px";
    name_input.style.width  = (main_panel_width * 0.25 - 10) + "px";
    
    message_input.style.bottom = "5px";
    message_input.style.right  = "5px";
    message_input.style.width  = (main_panel_width * 0.75) + "px";
    
    messages_panel.style.height = main_panel.offsetHeight - form.offsetHeight - 2 + "px";
}

function init() {
    position_elements();
}

var colour = null;
var socket = io();

console.log("adding event listeners...");
form.submit = function(event) {
    var message = message_input.childNodes[0].value.trim();
    var user    = name_input.childNodes[0].value.trim();
    
    console.log("name: " + user);
    console.log("message: " + message);
    
    if (user == "") {
        //warn the user
        alert("please enter your name.");
        message_input.value = message;
        return;
    }
    
    if (message == "") {
        return;
    }
    
    socket.emit("chat message", JSON.stringify({
        content: user + ": " + message,
        colour: colour,
    }));
    
    message_input.childNodes[0].value = "";
    
    event.preventDefault();
};

addEventListener("keypress", function(e) {
    if (e.key == "Enter") {
        form.submit(e);
    }
});

socket.on("chat message", function(msg) {
    var msg_content = JSON.parse(msg).content;
    var msg_colour  = JSON.parse(msg).colour;
    messages_panel.appendChild(create_element("message", msg_content, "background-color: " + msg_colour + "; color: white;"));
    messages_panel.scrollTo(0, messages_panel.scrollHeight);
    messages_panel.appendChild(document.createElement("br"));
});

socket.on("notification", function(notif) {
    messages_panel.appendChild(create_element("message", notif, "background-color: darkslategray; color: white;"));
    messages_panel.scrollTo(0, messages_panel.scrollHeight);
    messages_panel.appendChild(document.createElement("br"));
});

socket.on("colour", function(c) {
    if (colour == null) {
        colour = c;
        console.log("colour set to :" + c);
    }
    //ignore otherwise
});

function create_element(type, content, style) {
    var elt         = document.createElement("div");
    var class_att   = document.createAttribute("class");
    class_att.value = type;
    
    elt.setAttributeNode(class_att);
    
    elt.appendChild(document.createTextNode(content));
    
    if (style) {
        var style_att   = document.createAttribute("style");
        style_att.value = style;
        elt.setAttributeNode(style_att);
    }
    
    return elt;
}