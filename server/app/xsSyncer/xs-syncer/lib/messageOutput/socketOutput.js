var app = require('express')();

var logLevel = "info";

var SocketOutput = (function() {
    return function(options) {
        var history = [];
        var http;
        if(options && options.https == true) {
            http = require('https');
        } else {
            http = require('http');
        }
        
        var serverOptions;
        if(options && options.options) {
            serverOptions = options.options;
        }
        var server = http.createServer(serverOptions, app);
        var io = require('socket.io').listen(server, {origins: '*:*'});
        server.listen(10291);

        io.configure(function () {
            io.set('transports', ['polling', 'websocket']);
        });

        function flushHistory() {
            for(var i = 0; i < history.length; i++) {
                sendToSockets(history[i].type, history[i].data);
            }
            history.length = 0;
        }

        io.sockets.on('connection', function (socket) {
            flushHistory();
            console.log("Incoming socket connection");
        });

        function logPrio(level) {
            if ( level.toLowerCase() === 'error' ) return 2;
            if ( level.toLowerCase() === 'info' )  return 1;
            if ( level.toLowerCase() === 'debug' ) return 0;
            return -1;
        }

        function sendToSockets(type, data) {
            var args = [type].concat(Array.prototype.slice.call(data));
            io.sockets.emit('output', args);
        }

        function doLog(type, data) {
            history.push({type: type, data: data});
            console.log.apply(null, [type].concat(Array.prototype.slice.call(data)))
            sendToSockets(type, data);
        }

        this.debug = function() {
            if ( logPrio(logLevel) <= logPrio('debug') )
                doLog('DEBUG', arguments);
        }

        this.info = function() {
            if ( logPrio(logLevel) <= logPrio('info') )
                doLog('INFO', arguments);
        }

        this.error = function() {
            if ( logPrio(logLevel) <= logPrio('error') )
                doLog('ERROR', arguments);
        }

        this.requestInput = function(question, callback) {
            throw new Error("Not yet implemented");
        }
    }
})();



module.exports = {
    logLevel : logLevel,
    createInstance: function(options) { return new SocketOutput(options); }
};
