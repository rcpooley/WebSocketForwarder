var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./config.json');

//Our current port data
var portData = {conns: []};
var servers = {};

//Util module
var util = require('./util').util;

//SocketServer module
var SocketServer = require('./socketserver');

//Setup middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Handle get requests
app.get('*', function (req, res) {
    var url = req.url.split('?')[0];
    if (url === '/')url += 'index.html';
    var path = __dirname + '/public/' + url;
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        path = __dirname + '/public/err404.html';
    }

    res.sendFile(path);
});

//Start socket server
io.on('connection', function (socket) {
    socket.emit('update', portData);

    socket.on('add', function (conn) {
        conn.id = util.randomStr(20);
        var s = {
            externalServer: new SocketServer.Server(conn.externalPort),
            connectorServer: new SocketServer.Server(conn.connectorPort)
        };
        setTimeout(function () {
            if (!s.externalServer.listening || !s.connectorServer.listening) {
                s.externalServer.close();
                s.connectorServer.close();
            } else {
                servers[conn.id] = s;
                portData.conns.push(conn);
                socket.emit('update', portData);
            }
        }, 500);
    });

    socket.on('rm', function (id) {
        for (var i = portData.conns.length - 1; i >= 0; i--) {
            var conn = portData.conns[i];
            if (conn.id == id) {
                servers[conn.id].externalServer.close();
                servers[conn.id].connectorServer.close();
                delete servers[conn.id];
                portData.conns.splice(i, 1);
            }
        }
        socket.emit('update', portData);
    });
});

//Start http server
http.listen(config.port, function () {
    console.log('Listening on *:' + config.port);
});