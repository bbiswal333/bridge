"use strict";
/* global require, console, process, module */

var repo            = require('./repo.js'),
    settingsParser  = require('./settings_parser.js'),
    FileSyncWatcher = require('./ChangeNotifier.js'),
    runProxy        = require('./ProxyService.js'),
    tinylr          = require('tiny-lr'),
    request         = require('request');

var output;

// This port should not be changed, because it is the default livereload port, where 
// all livereload clients connect to
var liveReloadPort = 35729;
var tinylrAddr = 'http://localhost:' + liveReloadPort + '/changed?files=*';

var maybeReload;

function afterSync (error, data) {
    if ( error ) {
        output.error(error.message);
    }
    else {
        maybeReload();
    }
}

function doLiveReload () {
    output.debug("signaling tiny-lr server");

    request.get(tinylrAddr, function(error, response, body) {
        output.debug('tinylr response:', body);
    });
}

function main(argv) {
    var settings, xsRepo;

    if(!argv.output) {
        output = require('./messageOutput/consoleOutput.js').createInstance();
    } else {
        output = argv.output;
    }

    if(argv.settings) {
        settings = settingsParser.getSettingsFromJSON(argv.settings, require('path').dirname(__dirname));
    } else {
        settings = settingsParser.getSettingsFromFile(argv.conf);
    }

    function startFileWatcher() {
        var sWorkspaceId = settings.hanaInstance.workspaceId || "";
        var oFileWatcher = new FileSyncWatcher(settings.synchronizationSettings, settings.usePolling, output);

        oFileWatcher.on('add', function (eventData) {
            xsRepo.putFile(eventData.localPath, eventData.remotePath, sWorkspaceId, afterSync);
        });
        oFileWatcher.on('change', function (eventData) {
            xsRepo.putFile(eventData.localPath, eventData.remotePath, sWorkspaceId, afterSync);
        });
        oFileWatcher.on('unlink', function (eventData) {
            xsRepo.unlinkFile(eventData.localPath, eventData.remotePath, sWorkspaceId, afterSync);
        });
    }



    function doIt() {
        if ( settings.liveReload ) {
            runTinylr();
            maybeReload = doLiveReload;
        }
        else {
            maybeReload = function () {};
        }

        if(settings.hanaInstance.ssl) {
            require('../node-sso/sso.js').execute(function(sso) {
                settings.hanaInstance.ssl = sso;
                xsRepo = repo(settings.hanaInstance, null, output);
                startFileWatcher();
                runProxy(settings, output);
            });
        } else {
            xsRepo = repo(settings.hanaInstance, null, output);
            startFileWatcher();
            runProxy(settings, output);
        }

        
    }

    if ( argv.dontask ) {
        doIt();
    }
    else {
        output.info("Synchronize to hana repository");
        output.info("Hana Instance: '" + settings.hanaInstance.target + "'");
        output.info("User: '" + settings.hanaInstance.user + "'");
        output.info("Workspace: '" + settings.hanaInstance.workspaceId + "'");
        output.info("The following directories will be synced\n");

        settings.synchronizationSettings.forEach(function (syncSetting) {
            output.info(syncSetting.localPath + "   -->   " + syncSetting.remotePath);
        });

        output.requestInput("\nCorrect ? (y/n): ", function(answer) {
            if ( answer !== 'y' ) {
                output.info("aborted");
                process.exit();
            }

            doIt();
        });
    }
}


function runTinylr() {
    var tinylr = require('tiny-lr');

    var lrServer = tinylr();
    lrServer.listen(liveReloadPort, function(err, data) {
        if(err) {
            output.error(err);
            return;
        }
        output.debug(data);

        output.info('Livereload Listening on', liveReloadPort);
    });

    process.on('uncaughtException', lrServer.close);
    process.on('SIGTERM', lrServer.close);
}

module.exports = main;
