'use strict';

var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
var debug = false;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', routes.index);
app.get('/graph', routes.graph);
app.get('/alarm', routes.alarm);
app.get('/refresh', function createRefreshPage(req, res) {
  routes.refresh(req, res, io);
});
app.get('/refresh-alarm', function createRefreshAlarmPage(req, res) {
  routes.refreshAlarm(req, res, io);
});

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  // app.use(errorHandler());
}

io.on('connection', function onConnection(socket) {
  if (debug) {
    console.log('a user connected');

    socket.on('disconnect', function onDisconnect() {
      console.log('user disconnected');
    });
  }

  socket.on('change', function onChange(msg) {
    if (debug) {console.log('message: ' + msg); }
    io.sockets.emit('server-change', {temp: msg.temp, hum: msg.hum});
    // socket.emit('users_count', clients); => current socket
    // io.sockets.emit('users_count', clients); => ALL sockets
    // socket.broadcast.emit('users_count', clients); => all, except current
  });
});

server.listen(app.get('port'), function startApp() {
  console.log('Express server listening on port ' + app.get('port'));
});
