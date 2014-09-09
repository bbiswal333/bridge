"use strict";
/* global require, module, console */

var express   = require('express'),
    httpProxy = require('http-proxy'),
    exphbs    = require('express-handlebars');

function setWorkspaceId(req, workspaceId) {
    req.headers.cookie = req.headers.cookie || '';
    req.headers.cookie += '; sapXsDevWorkspace=' + workspaceId;
}

function getFileType(reqPath) {
    var lastPathSegment = reqPath.split('/').slice(-1)[0];
    var x = lastPathSegment.split('.');
    if ( x.length === 1 ) {
        return null;
    }
    return x.slice(-1)[0];
}


function wrapFiletypeMatcher(fn, matchFileTypes, output) {
    if ( ! matchFileTypes ) { return fn; }

    return function (req, res, next) {
        var fileType = getFileType(req.path);
        if ( matchFileTypes.indexOf(fileType) !== -1 ) {
            output.debug("file type matched:", fileType);
            fn.apply(this, arguments);
        }
        else {
            output.debug("file type not matched:", fileType);
            next();
        }
    };
}

function runProxy(oSettings, output) {
    var app = express();

    app.engine('handlebars', exphbs({
        defaultLayout : 'main',
        layoutsDir    : __dirname + '/views/layouts'
    }));
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views');

    var hanaInstance  = oSettings.hanaInstance,
        proxySettings = oSettings.proxySettings;

    var protocol = "http://";
    var securitySettings = {};
    if(oSettings.hanaInstance.ssl)
    {
        securitySettings.ssl = {};
		if(oSettings.hanaInstance.ssl.pfx) {
			securitySettings.ssl.pfx = oSettings.hanaInstance.ssl.pfx;
		} else {
			securitySettings.ssl.key = oSettings.hanaInstance.ssl.key;
			securitySettings.ssl.cert = oSettings.hanaInstance.ssl.certificate;
		}
        securitySettings.ssl.passphrase = oSettings.hanaInstance.ssl.passphrase;
        securitySettings.secure = false; //Don't verify certs
        protocol = "https://";
    }
    var theProxy = httpProxy.createProxyServer(securitySettings);

    app.use(function(req, res, next){
        output.debug('%s %s', req.method, req.url);
        next();
    });

    proxySettings.forEach(function (proxySet) {
        var handleFn;
        if (proxySet.localPath) {
            handleFn = express.static(proxySet.localPath);
        }
        else {
            var target = proxySet.target || hanaInstance.target;
            var remotePath = proxySet.remotePath === '/' ? '' : proxySet.remotePath;

            handleFn = function (req, res) {
                setWorkspaceId(req, hanaInstance.workspaceId);
                req.url = remotePath + req.url;
                theProxy.web(req, res, { target: protocol + target });
            };
        }

        app.use(proxySet.url, wrapFiletypeMatcher(handleFn, proxySet.fileTypes));
    });

    app.use("", function(req, res) {
        res.render('proxy_no_matching_route', { reqUrl: req.url, proxySettings: JSON.stringify(proxySettings, null, 4) });
        output.error("No matching proxy settings for url:", req.url);
    });

    app.listen(oSettings.serverPort);
    output.info("ProxyService", "Server listening on localhost:", oSettings.serverPort);
}

module.exports = runProxy;

