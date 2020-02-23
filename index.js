var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res) {
    res.json({"message": "hello world"});
});

http.listen(3000, function() {
    console.log('listening on port 3000');
});