const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage} = require('./util/message');
const {isRealString} = require('./util/validation');
const {Users} = require('./util/users');

var app = new express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');


    socket.on('join', (params, callback)=>{

        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('input required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin','Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined`));
        callback();
    })

    socket.on('createMessage', (message, callback)=>{
        console.log(message);

        io.emit('newMessage', generateMessage(message.from,message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} leaves`));
        }
    })
});


server.listen(port, ()=>{
    console.log(`server is up on ${port}`);
})


