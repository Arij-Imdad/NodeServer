console.log('yes')
var socket = require('socket.io');
var express = require('express');
var http = require('http');
var app = express();
var mysql = require('mysql');

var server=http.Server(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Node.js\n');
    console.log('waeawe')
}).listen(3000, "192.168.10.42");

console.log('Server running at http://192.168.10.42:3000/');

var io = socket.listen(server);
var clients = [];

io.on('connection', function(socket) {

    // Log whenever a user connects
 console.log('user connected');
    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(){
        // console.log('user disconnected');
        for (var i in clients) {
            for(var j=0;j < clients[i].length;j++)
             {
                if(clients[i][j].socket == socket.id){
                    clients[i].splice(j,1);
                    // clients[i]['status'] = false;
                    // socket.broadcast.emit('offline',i);
                }
            }
        }
    });
    // io.sockets.connected[clients[clients.length-1]].emit("default", {'socketId':socket.id});
    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('addUser', function(data){
        // clients[data.username] = {
        //   "socket": socket.id
        // };
        console.log('send to ');
        console.log(' sentt ');
        if(typeof clients[data.username] == 'undefined')
        clients[data.username] = [];

        socket.emit('onlineUsers',getConnectedUsers(clients));

        for(var j=0;j < clients[data.username].length;j++)
        {
            if(clients[data.username][j].socket == socket.id)
                clients[data.username].splice(j,1);
        }
        clients[data.username].push({"socket":socket.id});
        clients[data.username]['status'] = false;

        // socket.broadcast.emit('online',data.username);

        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {
                socket.broadcast.to(clients[data.username][i].socket).emit('useradded', data);
            }
        }
       console.log(clients);
       console.log(getConnectedUsers(clients));
    });
    socket.on('SendRequest', function(data){



        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('receiveRequest', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('receiveRequest', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });

    socket.on('confirmRequest', function(data){


        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('confirmed', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('confirmed', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });
    // servcie providr accepted the request
    socket.on('confirmRequestService', function(data){


        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('confirmedService', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('confirmedService', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });
    socket.on('startBookingRequest', function(data){


        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('RequestStarted', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('RequestStarted', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });
    socket.on('EndTrip', function(data){


        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('onEndTrip', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('onEndTrip', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });
    socket.on('sendLiveLocation', function(data){


        if(typeof clients[data.username] != 'undefined'){
            for(var i=0;i < clients[data.username].length;i++)
            {

                socket.broadcast.to(clients[data.username][i].socket).emit('receiveLiveLocation', data);
            }
            if(typeof clients[data.from] != 'undefined'){
                for(var i=0;i < clients[data.from].length;i++)
                {
                    if(clients[data.from][i].socket != socket.id){
                        socket.broadcast.to(clients[data.from][i].socket).emit('receiveLiveLocation', data);
                    }
                }
            }
            // socket.broadcast.to(clients[data.username].socket).emit('message', data);
        }
    });


//  token.passvalue("c43b5d0a362e2db43d2c24f9a747a94c1188ee61c9cb008c49db024265bada08");

});
function getConnectedUsers(clients){
    connectedUsers = [];
    count = 0;
    for (var i in clients) {
        if(clients[i]['status'] === true){
            connectedUsers[count] = i;
            ++count;
        }
    }
    return connectedUsers;
}



