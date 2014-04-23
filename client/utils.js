/*
download(), unzip() and untar() taken from nodewebkit-task: https://www.npmjs.org/package/grunt-node-webkit-builder
*/

var tar = require('tar'),
    zlib = require('zlib'),
    path = require('path'),
    request = require('request'),
    fs = require('fs'),
    Q = require('q'),
    async = require('async'),
    ZIP = require('zip');

module.exports = function (grunt) {
    exports.download = function (url, dest) {
        var downloadDone = Q.defer(),
            extention = (url.split('.')).slice(-1)[0],
            downloadPath = path.resolve(dest, (url.split('/')).slice(-1)[0]),
            destStream = fs.createWriteStream(downloadPath),
            downloadRequest;

        if (process.env.http_proxy) {
            downloadRequest = request({ url: url, proxy: process.env.http_proxy });
        } else {
            downloadRequest = request(url);
        }

        grunt.log.writeln('Downloading: ' + url);

        destStream.on('close', function () {
            downloadDone.resolve({ dest: downloadPath, ext: extention });
        });

        destStream.on('error', function (error) {
            grunt.log.error(error);
            grunt.fail.warn('Download write failed.');
        });

        downloadRequest.on('error', function (error) {
            grunt.log.error(error);
            grunt.fail.warn('There was an error while downloading.');
        });

        downloadRequest.pipe(destStream);

        return downloadDone.promise;
    };

    exports.unzipFile = function (file, dest, removeFromPath) {
        var _zipReader = ZIP.Reader(fs.readFileSync(file)),
            unzipDone = Q.defer();

        grunt.log.writeln('Unzipping: ' + file);

        _zipReader.forEach(function (entry) {
            var mode = entry.getMode(),
                fileName = path.resolve(dest, entry.getName());

            if (removeFromPath) {
                fileName = path.normalize(fileName.replace(removeFromPath, ''));
            }

            // Log unpacking
            grunt.verbose.writeln('Unpacking ' + entry.getName() + ' --> ' + fileName);

            if (entry.isDirectory()) {
                grunt.file.mkdir(fileName, function (err) {
                    if (mode) {
                        fs.chmodSync(fileName, mode);
                    }
                });
            } else {
                grunt.file.mkdir(path.dirname(fileName));
                fs.writeFileSync(fileName, entry.getData());
                if (mode) {
                    fs.chmodSync(fileName, mode);
                }
            }
        });

        // I know that this is blocking, the defered is just for consistency :)
        // And when node unzip supports permissions
        unzipDone.resolve();
        return unzipDone.promise;
    };

    exports.untarFile = function (file, dest) {
        var untarDone = Q.defer();

        grunt.log.writeln('Untarring: ' + file);

        fs.createReadStream(file)
            .pipe(zlib.createGunzip())
            .pipe(tar.Extract({
                path: dest,
                strip: 1
            }))
            .on('error', function (error) {
                grunt.log.error('There was an error untaring the file', error);
            })
            .on('end', untarDone.resolve)
            .on("entry", function (entry) {
                var filename = entry.path.split('/').reverse()[0];
                grunt.verbose.writeln('Unpacking ' + filename + ' --> ' + path.resolve(dest, filename));
            });

        return untarDone.promise;
    };

    return exports;
}