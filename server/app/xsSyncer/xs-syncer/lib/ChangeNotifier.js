"use strict";
/* global require, console, module */

var chokidar     = require('graceful-chokidar'),
    util         = require('util'),
    events       = require('events'),
    path         = require('path');


util.inherits(FileSyncWatcher, events.EventEmitter);

function FileSyncWatcher (aSyncSettings, usePolling, output) {
    var options = { ignored: /[\/\\]\./, persistent: true };

    if ( usePolling !== undefined ) {
        options.usePolling = usePolling;
    }

    var self = this;

    this.aWatchers = aSyncSettings.map(function (oSettings) {
        var oWatcher = chokidar.watch(oSettings.localPath, options);

        oWatcher.on('all', function (eventType, filePath) {
            var relPath = path.relative(oSettings.localPath, filePath);
            // replace the path separator by '/' which is necessary for windows
            var remotePath = oSettings.remotePath + '/' + relPath.split(path.sep).join('/');
            var emitData = { localPath: filePath, remotePath: remotePath , eventType: eventType};
            output.info('FileSyncWatcher', eventType, relPath);
            self.emit(eventType, emitData);
        });
    });
}

module.exports = FileSyncWatcher;
