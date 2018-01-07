var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const redis = {};

Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}

app.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.emit('username', 'Please choose username');

    socket.on('username',function(name) {
        if (redis[name])
            io.to(socket.id).emit('username', 'Please use another name');
        else {
            redis[name] = socket.id;
            io.emit('new user', name);
        }
    });
    
    socket.on('chat message', function (msg) {
        const username = redis.getKeyByValue(socket.id);
        io.emit('chat message', `${username}: ${msg}`);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});