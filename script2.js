var init = (function() {
    //do all that stuff ya need to do
    
    //variables
    var colour;
    var user_name;
    
    var logged_in = false;
    
    var socket = io();

    socket.on('colour', function(c) {
        if (logged_in && colour == null) {
            colour = c;
            
            //change the colour of the UI
            main_panel.style.borderColor = c;
            
            message_input.style.borderColor  = c;
            message_submit.style.borderColor = c;
            
            message_submit.style.backgroundColor = c;
            
            message_submit.style.color = "white";
        }
    });
    
    socket.on('notification', function(notif) {
        if (logged_in) {
            //do some notifications
            
            messages_panel.appendChild(create_notification(notif));
            messages_panel.scrollTo(0, messages_panel.scrollHeight);
        }
    });
    
    socket.on('chat message', function(msg) {
        if (logged_in) {
            //handling the message
            var message = JSON.parse(msg);
            
            messages_panel.appendChild(create_message(message.name, message.content, message.colour));
            messages_panel.scrollTo(0, messages_panel.scrollHeight);
        }
    });
    
    function login() {
        if (name_input.value == "") {
            //blank name? don't bother
            return;
        }
        
        user_name = name_input.value;
        
        logged_in = true;
        
        socket.emit('login', name_input.value);
        
        //kick start the rest of the stuff.
        
        message_form.addEventListener("submit", function(e) {
            send_message(message_input.value);
        
            message_input.value = "";
            
            e.preventDefault();
        });
        
        login_panel.style.visibility = "hidden";
        
        main_panel.style.visibility = "visible";
        
        position_message_app();
    }
    
    function position_login_form() {
        //try to get a 16:9 ratio for this...
        
        var width    = window.innerWidth / 3;
        var x_offset = window.innerWidth / 3 - 2;
        var height   = window.innerHeight / 3;
        var y_offset = window.innerHeight / 3 - 2;
        
        login_panel.style.width  = width + "px";
        login_panel.style.left   = x_offset + "px";
        login_panel.style.height = height + "px";
        login_panel.style.top    = y_offset + "px";
    }
    
    function position_message_app() {
        //positions the elements. DOM elements, that is.
        //the message app should have a 1:2 width to height ratio.
        var height   = window.innerHeight;
        var width    = height / 2;
        var x_offset = (window.innerWidth - width) / 2 - 1; //leave a pixel for the border
        
        //main panel first
        main_panel.style.top    = "0px";
        main_panel.style.left   = (window.innerWidth * 0.3 - 1) + "px";
        var main_panel_width    = window.innerWidth * 0.4 -2;
        main_panel.style.height = (window.innerHeight - 3) + "px"; //border on the top and bottom
        main_panel.style.width  = (main_panel_width) + "px";
        
        message_form.style.width = main_panel.offsetWidth - 2 + "px";
        
        message_submit.style.bottom = "5px";
        message_submit.style.right  = "5px";
        
        message_input.style.bottom = "5px";
        message_input.style.left   = "5px";
        message_input.style.width  = ((main_panel.offsetWidth - 2) - message_submit.offsetWidth - 10) + "px";
        
        messages_panel.style.width  = width - 2;
        messages_panel.style.height = main_panel.offsetHeight - message_form.offsetHeight - 2 + "px";
    }
    
    function send_message(msg) {
        if (message_input.value == "") {
            return;
        }
        
        socket.emit('chat message', JSON.stringify({
            'name': user_name,
            'colour': colour,
            'content': msg,
        }));
    }
    
    function create_message(name, content, colour) {
        var e = document.createElement('div');
        
        //class attribute: "message"
        var a   = document.createAttribute('class');
        a.value = "message";
        e.setAttributeNode(a);
        
        //styling
        //name first: if it matches the user's name, it goes on the right.
        if (name == user_name) {
            e.style.float = "right";
        }
        //colour
        e.style.backgroundColor = colour;
        
        e.style.color = "white";
        
        e.appendChild(document.createTextNode(name + ": " + content));
        
        return e;
    }
    
    function create_notification(content) {
        var e = document.createElement('div');
        
        var a   = document.createAttribute('class');
        a.value = "notification";
        e.setAttributeNode(a);
        
        //the styling is defined in the css
        
        e.appendChild(document.createTextNode(content));
        
        return e;
    }
    
    return function() {
        //to be executed when ready
        
        login_form.addEventListener("submit", function(e) {
            login();
            
            e.preventDefault();
        });
        
        main_panel.style.visibility  = "hidden";
        login_panel.style.visibility = "visible";
        
        position_login_form();
    };
})();