const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage} = require('./util/message');

var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin','Welcome to chat app'));

    // everyone except self
    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

    socket.on('createMessage', (message, callback)=>{
        console.log(message);

        io.emit('newMessage', generateMessage(message.from,message.text));
        callback('this is from server');
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect', ()=>{
        console.log('user was disconnected');
    })
});


server.listen(port, ()=>{
    console.log(`server is up on ${port}`);
})


