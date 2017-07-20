var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./config.json');

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

//Start http server
http.listen(config.httpport, function () {
    console.log('Listening on *:' + config.httpport);
});

new SocketServer.Server(5000);