var net = require('net');

var Server = function (port) {
    net.createServer(function (socket) {
        console.log('socket connected from ' + socket.remoteAddress + ':' + socket.remotePort);

        socket.on('data', function (data) {
            console.log('got ' + data + ' from ' + socket.remoteAddress + ':' + socket.remotePort);
        });

        socket.on('end', function () {
            console.log('socket disconnected from ' + socket.remoteAddress + ':' + socket.remotePort);
        });
    }).listen(port);
};

module.exports = {
    Server: Server
};