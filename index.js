var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket){
    console.log('a user connected');
    console.log('>>>>> socket.id: ' + socket.id);

    socket.emit('start message', 'Please enter your name');

    // socket.broadcast.emit('hi');

    socket.on('chat message', function(msg){
        var userName;
        getUser(socket.id, function(error, user) {
            if (error) {
                console.log(error);
            } 
            else {
                userName = user;
            }
        });
        
      //  io.emit('chat message', JSON.stringify(userName) + ':  '+ msg);
        io.emit('chat message', userName.name + ':  '+ msg);
    });

    socket.on('user name', function(user){
        users.push( {name:user, id:socket.id} );
        console.log('users ' + JSON.stringify(users));
    });

});
function findUser(userID) {
    var user = users.find(u => u.id === userID);
    return user
}

function getUser(id, callback) {
    callback(null, findUser(id));
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});
