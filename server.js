'use strict';

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
var websocket = require('./controllers/socket.js');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// import routes
require('./routes/routes.js')(app);

app.get('/refresh', function createRefreshPage(req, res) {
  websocket.refresh(req, res, io);
});

app.get('/refresh-alarm', function createRefreshAlarmPage(req, res) {
  websocket.refreshAlarm(req, res, io);
});

io.on('connection', function onConnection(socket) {

  socket.on('disconnect', function onDisconnect() {
    console.log('user disconnected');
  });

  socket.on('change', function onChange(msg) {
    console.log('message: ' + msg);
    io.sockets.emit('server-change', {temp: msg.temp, hum: msg.hum});
  });
});

server.listen(app.get('port'), function startApp() {
  console.log('Express server listening on port ' + app.get('port'));
});
