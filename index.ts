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
    style: 'capital',
    separator: ' ',
    length: 2
};

let previousMessages: Message[] = [];
let onlineUsers: User[] = [];
let connections: any[] = [];


app.get('/', (req: express.Request, res: express.Response) => {
    let reqPath = path.join(__dirname, '../');

    const userName: string = uniqueNamesGenerator(randomNameConfig);
    res.cookie('nick-name', userName);

    res.sendFile(reqPath + '/pages/index.html');
});

io.on('connection', (socket: any) => {
    connections.push(socket);
    // io.emit('users', onlineUsers);
    // io.emit('messages', previousMessages);

    socket.on('cookie', (cookie: string) => {
        onlineUsers.push(new User(cookie, '#000'));
        io.emit('users', onlineUsers);
        io.emit('messages', previousMessages);
    });

    socket.on('chat message', (msg: {author: string, message: string}) => {
        const index = onlineUsers.findIndex(i => i.nickName === msg.author);
        const user = onlineUsers[index];
        if (user) {   
            const date =  new Date();
            const tokens = msg.message.split(' ');
            if (tokens[0] === '/nickcolor') {
                user.color = '#' + tokens[1];
                onlineUsers[index] = user;
            } else if (tokens[0] === '/nick') {
                tokens.shift();
                if (isNickUnique(tokens.join(' '))) {
                    user.nickName = tokens.join(' ');
                    onlineUsers[index] = user;
                    io.emit('users', onlineUsers);
                }
            } else {
                const message = new Message(user.nickName, msg.message, date.getHours() + ':' + date.getMinutes(), user.color);
                addMessage(message);
                io.emit('chat message', message);
            }
        }
    });
    socket.on('users', (users: User[]) => {
        io.emit('users', users);
    });
    socket.on('messages', (messages: Message[]) => {
        io.emit('messages', messages);
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

function addMessage(msg: Message) {
    if (previousMessages.length === 200) {
        previousMessages.shift();
    }
    previousMessages.push(msg);
}

function isNickUnique(name: string): boolean {
    const exists = onlineUsers.find(i => i.nickName === name);
    if (exists) {
        return false;
    } else {
        return true;
    }
}