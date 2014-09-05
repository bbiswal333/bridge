"use strict";
/* global require, module, console */


// This package provides basic pluming for calling the Orion file api

var _           = require('underscore'),
    request     = require('request'),
    querystring = require('querystring'),
    assert      = require('assert'),
    fs          = require('fs'),
    mime        = require('mime');

// /**** Example xsConfig object ****/
//
// var xsConfig = {
    //   target: 'mo-xxxxxxx.mo.sap.corp:8000',
    //   user: 'SYSTEM',
    //   password: 'Initial1'
    // };
//
//
// /**** Example options ****/
//
// opts = {
    //   autoLogin : 120 //seconds
    // }
//
module.exports = function (xsConfig, userOpts, output) {
    assert( xsConfig, 'No valid xs config given' );
    assert( xsConfig.target && typeof xsConfig.target === 'string', 'No valid host name given');
    assert( xsConfig.user && typeof xsConfig.user === 'string', 'No valid user name given');
    if(!xsConfig.ssl) {
        assert( xsConfig.password && typeof xsConfig.password === 'string', 'No valid password given');
    }

    userOpts = userOpts || {};

    // default values are set here
    var defaultOpts = {
        autoLogin : true
    };

    var opts = _.defaults(userOpts, defaultOpts);
    var repo = new Repo(xsConfig, opts, output);

    return repo;
};



function Repo(xsConfig, opts, output) {
    this.output = output;
    var baseUrl; 
    if(xsConfig.ssl) { 
        baseUrl = 'https://' + xsConfig.target;
    } else {
        baseUrl = 'http://' + xsConfig.target;
    }

    this.ssl = xsConfig.ssl;
    this.user = xsConfig.user;
    this.password = xsConfig.password;

    this.queryEndpoint = baseUrl + '/sap/hana/xs/dt/base/file';
    this.loginEndpoint = baseUrl + '/sap/hana/xs/formLogin/login.xscfunc';
    this.csrfEndpoint  = baseUrl + '/sap/hana/xs/dt/base/server/csrf.xsjs';
    this.hostHeader = xsConfig.target;
    this.autoLogin = opts.autoLogin;

    this.authCookie = null;
    this.csrfToken = null;
    this.numLogins = 0;
    this.loginPending = false;
    this.failedRequests = [];
}


Repo.prototype.refreshLogin = function (cb) {
    if ( ! this.autoLogin ) {
        throw new Error("Not logged in and autoLogin is set to false.");
    }
    var self = this;
    this.output.debug("Repo", "Refreshing login");
    self.loginPending = true;

    self.login(function (error) {
        if ( error ) {
            self.loginPending = false;
            if ( cb ) { cb(error); }
            return;
        }

        self.fetchCsrfToken(function (error) {
            self.loginPending = false;

            if (error) {
                if ( cb ) { cb(error); }
                return;
            }

            self.output.debug("Repo", "refreshLogin success");
            self.numLogins++;

            self.output.debug("Repo", "Number of waiting requests:", self.failedRequests.length);
            _.each(self.failedRequests, function (failedReq) {
                failedReq.numLogins = self.numLogins;
                failedReq.call(self);
            });

            self.failedRequests = [];

            if ( cb ) { cb(); }
        });
    });
};

Repo.prototype.appendSSOOptionsIfNecessary = function(options) {
    if(this.ssl) {
        if(!options.agentOptions) {
            options.agentOptions = {};
        }

        if(this.ssl.pfx) {
            options.agentOptions.pfx = this.ssl.pfx;
        } else {
            options.agentOptions.key = this.ssl.key;
            options.agentOptions.cert = this.ssl.certificate;
        }
        options.agentOptions.passphrase = this.ssl.passphrase;
        options.agentOptions.ca = [this.ssl.caCertificate];
    }
};

Repo.prototype.login = function (cb) {
    var self = this;
    var postData = {};

    if(this.user) {
        postData["xs-username"] = this.user;
    }
    if(this.password){
        postData["xs-password"] = this.password;
    }
    
    var body = querystring.stringify(postData);


    var options = {
        url     : this.loginEndpoint,
        body    : body,
        headers : {
            'x-csrf-token'     : 'unsafe',
            'Content-Type'     : 'application/x-www-form-urlencoded',
            'Content-Length'   : body.length
        }
    };

    this.appendSSOOptionsIfNecessary(options);


    this.output.debug("Repo", "starting login");
    request.post(options, function (error, response, body) {
        if (error) {
            self.output.error("Repo", "login failed", error);
            return cb(error);
        }

        response.setEncoding("utf8");

        if ( response.statusCode !== 200 && !response.headers['set-cookie']) {
            self.output.error("Repo", "login failed, statusCode = ", response.statusCode, response.body);
            return cb(new Error("StatusCode " + response.statusCode));
        }

        self.output.debug("Repo", "login success");
        var authCookie = response.headers['set-cookie'];
        self.authCookie = authCookie;

        return cb(error, authCookie);
    });
};


Repo.prototype.fetchCsrfToken = function(cb) {
    var self = this;

    var options = {
        url: this.csrfEndpoint,
        method: 'HEAD',
        headers: {
            'x-csrf-token': 'Fetch',
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: self.authCookie
        }
    };

    this.appendSSOOptionsIfNecessary(options);

    this.output.debug("Repo", "fetching csrf-token");

    request(options, function(error, response, body) {
        if (error) {
            self.output.error("Repo", "failed to fetch csrf-token");
            self.output.error(error.message);
            return cb(error);
        }

        response.setEncoding("utf8");

        if ( response.statusCode !== 200 ) {
            self.output.error("Repo", "failed to fetch csrf-token. statusCode = " + response.statusCode);
            return cb(new Error("StatusCode " + response.statusCode));
        }


        self.output.debug("Repo", "success fetching csrf-token ");

        var token = response.headers['x-csrf-token'];
        self.csrfToken = token;
        cb(error, token);
    });
};

Repo.prototype.retry = function (fn) {
    this.output.debug("Repo", "retry is called");
    if ( fn.numLogins === this.numLogins ) {
        this.failedRequests.push(fn);
        if ( ! this.loginPending ) {
            this.refreshLogin();
        }
    }
    else {
        fn.numLogins = this.numLogins;
        fn();
    }
};


Repo.prototype.makeRequestOptions = function (query) {

    var path = query.path || '';

    if ( path && path[0] !== '/' )
        path = '/' + path;

    var qStr = querystring.stringify(query.parameters),
    urlArgs = path + (qStr ? '?' + qStr : ''),
    url = this.queryEndpoint + urlArgs;

    var options = {
        url: url,
        headers: {
            Host:   this.hostHeader,
            Cookie: this.authCookie,
            'Content-Type': 'text/plain;charset=UTF-8'
        }
    };
    this.appendSSOOptionsIfNecessary(options);

    if ( query.SapBackPack ) {
        options.headers['SapBackPack'] = JSON.stringify(query.SapBackPack);
    }

    options.headers['Orion-Version'] = "1";

    if ( query.body ) {
        options.body = query.body;
        options['Content-Length'] = options.body.length;
        options['Content-Type'] = 'text/plain;charset=UTF-8';
    }

    var method = query.method.toLowerCase();
    options.method = method;

    if ( ['put', 'post', 'delete'].indexOf(method) !== -1 ) {
        options.headers['X-CSRF-Token'] = this.csrfToken;
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    else {
        assert(method == 'get', 'invalid method');
    }


    return options;
};


Repo.prototype.request = function(query, cb) {
    var self = this;

    this.output.debug("Repo", "initializing request");

    var theRequest = function theRequest() {
        var options = self.makeRequestOptions(query);

        self.output.debug("Repo", "theRequest is executed");
        request(options, function(error, response, body) {
            self.output.debug("Repo", "theRequest came back with statusCode " + response.statusCode);
            // log.debug("theRequest came back with body " + body);
            if (error) {
                self.output.debug("Repo", "Error executing request", request, error);
                return cb(error, body, response);
            }

            if ( response.statusCode == 401 ) {
                if ( theRequest.numTrials === 2 ) { throw new Error("Retried too many times"); }
                theRequest.numTrials++;
                return self.retry(theRequest);
            }

            response.setEncoding("utf8");
            var data;
            try {
                data = JSON.parse(body);
                if ( data && data.Severity && data.Severity === 'Error' ) {
                    error = new Error(data.Message);
                }
            }
            catch (e) {
                data = body;
            }

            if (error) {
                self.output.debug("Repo", "Error executing request", request, error);
            return cb(error, body, response);
            }

            return cb(error, data, response);
        });
    };

    theRequest.numLogins = this.numLogins;
    theRequest.numTrials = 0;

    if ( this.numLogins == 0 ) {
        this.output.debug("Repo", "no login yet, call retry with theRequest");
        self.retry(theRequest);
    }
    else {
        this.output.debug("Repo", "immediately executing query");
        theRequest();
    }
};


// upload a local file to the given (inactive) workspace under the given
// remoteFilePath
Repo.prototype.putFile = function (filePath, remoteFilePath, workspaceId, cb) {
    var self = this;

    var growable = require('growing-file').open(filePath, {timeout: 500, interval: 100 });
    growable.on('end', function() {
        fs.readFile(filePath, function (error, fileContent) {
            if (error) return cb(error);

            if(fileContent.length == 0) {
                fileContent = "";
            }

            var query = {
                method: 'PUT',
                path: remoteFilePath,
                SapBackPack: {
                    Activate       : false,
                    Workspace      : workspaceId,
                    CreatePkg      : true
                },
                'Content-Length' : fileContent.length,
                'Content-Type' : mime.lookup(filePath),
                body: fileContent
            };

            var requestId = require('randomstring').generate(20);;
            self.output.info("Repo", "uploading", query.path, "Request Id: ", requestId);
            self.request(query, function(error, data) {
                if(error) {
                    self.output.info("Repo", "uploading failed", query.path, "Request Id: ", requestId);
                } else {
                    self.output.info("Repo", "uploading finished", query.path, "Request Id: ", requestId);
                }
                cb(error, data);
            });
        });
    });
};

Repo.prototype.unlinkFile = function (filePath, remoteFilePath, workspaceId, cb) {
    var self = this;
    var query = {
        method: 'DELETE',
        path: remoteFilePath,
        SapBackPack: {
            Activate       : false,
            Workspace      : workspaceId,
            CreatePkg      : true,
            Revert         : true
        }
    };

    var requestId = require('randomstring').generate(20);;
    this.output.info("Repo", "deleting", query.path, "Request Id: ", requestId);
    this.request(query, function(error, data) {
        if(error) {
            self.output.info("Repo", "deleting failed", query.path, "Request Id: ", requestId);
        } else {
            self.output.info("Repo", "deleting finished", query.path, "Request Id: ", requestId);
        }
        cb(error, data);
    });
};

