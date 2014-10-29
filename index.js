var app = require('express')();
var express = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var io2 = require('socket.io')();
var fakevar = null;
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/user', function(req, res, next) {
    var store = '';
    req.on('data', function (data) {
        store = JSON.parse(data);
    });
    req.on('end', function () {
        res.send('{"msg":"Data Sent to Socket: '+store.ID+'"}');
        console.log(store.ID);
        io.sockets.to(store.ID).emit('chat message', 'Sent to Socket: ' + store.ID +' '+ store.data);
    });
    
});
app.get('/user/:id', function (req, res) {
    var id = req.params.id;
    app.set('socketid', id.substring(3,id.length));
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.join(app.get('socketid'));

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
        

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
