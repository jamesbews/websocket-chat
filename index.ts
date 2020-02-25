import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import { User } from './models/User.model';
import { uniqueNamesGenerator, adjectives, Config, animals } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import uuid = require('uuid');
import { Message } from './models/Message.model';

const app: express.Application = express();
let http = require('http').createServer(app);
let io = require("socket.io")(http);

const randomNameConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2
};

let onlineUsers: User[] = [];
let connections: any[] = [];


app.get('/', (req, res) => {
    let reqPath = path.join(__dirname, '../');

    const userName: string = uniqueNamesGenerator(randomNameConfig);
    const userId = uuidv4();
    const user = new User(userId, userName, 'grey');
    onlineUsers.push(user);
    res.cookie('chat-user', userId);

    res.sendFile(reqPath + '/pages/index.html');
});

io.on('connection', (socket: any) => {
    connections.push(socket);
    io.emit('users', onlineUsers);

    socket.on('chat message', (msg: {id: string, message: string}) => {
        const user = onlineUsers.find(i => i.id === msg.id);
        const date =  new Date();
        if (user) {
            const message = new Message(user.nickName, msg.message, date.getHours() + ':' + date.getMinutes());
            io.emit('chat message', message);
        }
    });
    socket.on('users', (users: User[]) => {
        io.emit('users', users);
    });
    socket.on('disconnect', () => {
        const i = connections.indexOf(socket);
        connections.splice(i, 1);
        onlineUsers.splice(i, 1);
        io.emit('users', onlineUsers);
        console.log('user disconnected');
    });
});

http.listen(4200, () => {
    console.log('listening on port 4200');
});