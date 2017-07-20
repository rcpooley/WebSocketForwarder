var net = require('net');

var Server = function (port) {
    var _this = this;
    _this.listening = true;
    _this.onSocket = undefined;
    _this.port = port;

    _this.server = net.createServer(function (socket) {
        _this.onSocket(socket);
    });

    _this.server.on('error', function (err) {
        _this.listening = false;
        console.log('Port ' + port + ' is already in use!');
    });

    _this.start = function () {
        _this.server.listen(port, function () {
            if (_this.listening) {
                console.log('New server on ' + port);
            }
        });
    };

    _this.close = function () {
        if (!_this.listening) return;
        _this.server.close();
        console.log('Shutdown on ' + port);
    };
};

module.exports = {
    Server: Server
};