var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/pages/index.html');
});

io.on('connection', function(socket) {
    io.emit('new user', 'Ralph');

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(4200, function() {
    console.log('listening on port 4200');
});