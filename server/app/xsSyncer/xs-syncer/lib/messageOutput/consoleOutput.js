var logLevel = "info";
var readline        = require('readline');

var ConsoleOutput = (function() {
    return function() {
        var rl;

        function logPrio(level) {
            if ( level.toLowerCase() === 'error' ) return 2;
            if ( level.toLowerCase() === 'info' )  return 1;
            if ( level.toLowerCase() === 'debug' ) return 0;
            return -1;
        }

        function doLog(type, data) {
            var args = [type, ':'].concat(Array.prototype.slice.call(data));
            console.log.apply(null, args);
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
            if(!rl) {
                rl = readline.createInterface({
                    input:  process.stdin,
                    output: process.stdout
                });
            }

            rl.question(question, function(answer) { callback(answer); });
        }
    }
})();



module.exports = {
    logLevel : logLevel,
    createInstance: function() { return new ConsoleOutput(); }
};
