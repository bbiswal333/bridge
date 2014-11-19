"use strict";
/* global require, console, __dirname, module */

var _         = require('underscore'),
    fs        = require('fs'),
    path      = require('path'),
    assert    = require('assert'),
    JaySchema = require('jayschema');


// JSON Schema validation http://json-schema.org
var SCHEMA = require(__dirname + '/config_schema.json');
var DEFAULT_CONFIG = require(__dirname + '/default_config.json');

function validateSchema(data) {
    var jay = new JaySchema();

    var errors = jay.validate(data, SCHEMA);
    if ( errors.length > 0 ) {
        // var errorInfo = errors.map(function (error) { return error.desc; }).join('\n');
        console.error(errors);
        throw new Error("Configuarion file contains errors");
    }
}


function makeLocalPathNormalizer(basePath) {
    function normalizeLocalPath(p) {
        p = path.normalize(p);
        var normalizedPath;
        if ( p[0] === '/' ) {
            normalizedPath = p;
        }
        else {
            normalizedPath = path.normalize(path.resolve(basePath, p));
        }
        assert(fs.existsSync(normalizedPath), "Cannot find local path " + p);
        assert(fs.lstatSync(normalizedPath).isDirectory(), "Not a valid local directory " + p);

        return normalizedPath;
    }

    normalizeLocalPath.key = 'localPath';

    return normalizeLocalPath;
}

function repoPathNormalizer(p) {
    assert( p.length > 0, "Invalid package name");
    assert( p[0] === '/', "Package has to be given as an absolute location.");
    assert( p.search(/\/\//g) === -1, "Invalid package name");
    var i = p.length - 1;

    if ( i > 1 && p[i] === '/' ) {
        return p.substr(0, i);
    }
    return p;
}

repoPathNormalizer.key = 'remotePath';


var validHostRegexp = /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?(\:[0-9]+)?$/;


function hanaHostNameNormalizer(p) {
    if (p.slice(0, 7) === 'http://') {
        p = p.slice(7);
    }
    else if (p.slice(0, 8) === 'https://') {
        p = p.slice(8);
    }

    assert(p.split(':').length === 2, "No valid port specified in target hostname: " + p);
    assert(p.split(':').slice(-1)[0].match(/[0-9]+/), "No valid port specified in target hostname: " + p);

    assert(p.match(validHostRegexp), "Invalid hostname `" + p + "` given as target");
    return p;
}

hanaHostNameNormalizer.key = '/hanaInstance/target';


function proxyRemoteTargetNormalizer(p) {
    if (p.slice(0, 7) === 'http://') {
        p = p.slice(7);
    }
    else if (p.slice(0, 8) === 'https://') {
        p = p.slice(8);
    }

    assert(p.match(validHostRegexp), "Invalid hostname `" + p + "` given as target");
    return p;
}

proxyRemoteTargetNormalizer.key = '/proxySettings/target';


function doesKeyMatchContext(key, context) {
    assert ( key && key.length > 0, 'no valid key for normalizer function');
    var contextSplit = context.split('/');
    var keySplit = key.split('/');


    // match absolute context
    if ( key[0] === '/' ) {
        if ( keySplit.length !== contextSplit.length ) {
            return false;
        }
    }
    else {
        // match relativ context
        if ( contextSplit.length < keySplit.length) {
            return false;
        }
        contextSplit = contextSplit.slice(-keySplit.length);
    }

    for ( var i = 0; i < keySplit.length; i++) {
        if ( keySplit[i] !== contextSplit[i] ) {
            return false;
        }
    }

    return true;
}

// Normalize the configuration object recursively by applying a list of
// normalizer functions. These functions need to have a `key` attribute.
//
// Each sub-object in the configuration json is described by its `context`
// which is just a sequence of keys to reach this object separated by `/`.
// For example in the json
//
// {
//    "hanaInstance" : {
//      "user" : "Frankenstein"
//    }
// }
//
// the value "Frankenstein" has the context '/hanaInstance/user'.
//
// The key attribute of the normalizers is then compared with the context to
// decide whether the normalizer should be applied to a certain value or not.
//
// The key can be an absolute path e.g. '/hanaInstance' which means everything has
// to match starting from the root.
// The key can also be a relative path e.g. 'blabl/user' which would match for example
// a context '/root/blabl/user'.

// When a normalizer is applied to an object it can change the object (e.g. normalizing it)
// or just do a validation by simply throwing an exception when a value is incorrect.
// If a normalizer does not want to modify anything. It should return the
// original value.
//
// Note that if multiple normalizers change the object the order may be important...
//

function normalizeConfiguration(x, normalizerList, context) {
    context = context || '';
    if ( _.isArray(x) ) {
        _.each(x, function (xi) {
            normalizeConfiguration(xi, normalizerList, context);
        });
    }
    else if ( _.isObject(x) ) {
        _.each(x, function (value, key) {
            var newContext = context + '/' + key;
            var haveDoneNormalized = _.some(normalizerList, function (normalizer) {
                if ( doesKeyMatchContext(normalizer.key, newContext) ) {
                    x[key] = normalizer(x[key]);
                    return true;
                }
                return false;
            });

            if ( ! haveDoneNormalized) {
                normalizeConfiguration(x[key], normalizerList, newContext);
            }
        });
    }
}


function getSettingsFromFile(configFileName) {
    var basePath = path.dirname(path.resolve(configFileName));
    return getSettingsFromJSON(JSON.parse(fs.readFileSync(configFileName)), basePath);
}

function getSettingsFromJSON(settingsJSON, basePath) {
    var settingsData = _.defaults(settingsJSON, DEFAULT_CONFIG);

    validateSchema(settingsData);
    var normalizers = [makeLocalPathNormalizer(basePath), repoPathNormalizer, hanaHostNameNormalizer, proxyRemoteTargetNormalizer];
    normalizeConfiguration(settingsData, normalizers);
    return settingsData;
}

module.exports.getSettingsFromFile = getSettingsFromFile;
module.exports.getSettingsFromJSON = getSettingsFromJSON;


