import express = require('express');
import path = require('path');
import { User } from './models/User.model';

const app: express.Application = express();
let http = require('http').createServer(app);
let io = require("socket.io")(http);

let onlineUsers: User[] = [];

app.get('/', function(req, res) {
    let reqPath = path.join(__dirname, '../');
    res.sendFile(reqPath + '/pages/index.html');
});

io.on('connection', function(socket: any) {
    let userName = 'Ralph';
    io.emit('new user', userName);
    onlineUsers.push(userName);

    socket.on('chat message', function(msg: string) {
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(4200, function() {
    console.log('listening on port 4200');
});