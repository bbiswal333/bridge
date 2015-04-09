var fs = require('fs'),
    Q = require('q'),
    async = require('async');


module.exports = function (grunt) {
    var utils = require('./utils')(grunt);

    var webkitVersion = "0.12.0";
    var webkitInfo = {
        winFilename: "nwjs-v" + webkitVersion + "-win-x64.zip",
        macFilename: "nwjs-v" + webkitVersion + "-osx-x64.zip",
        winUnzipFolder: "nwjs-v" + webkitVersion + "-win-x64",
        macUnzipFolder: "nwjs-v" + webkitVersion + "-osx-x64",
        source: "http://dl.nwjs.io/v" + webkitVersion + "/",
        destination: "webkit_download/",
    };

    grunt.initConfig({

        shell: {
            copy:{
                command: function(file_from, file_to){          
                    return 'cp -Rf "' + file_from + '" "' + file_to + '"';
                },                
                options:{
                    stdout:true
                }
            }
        },
        pkg: grunt.file.readJSON('./package.json'),
        copy: {
            win: {
                files: [
                  { expand: true, cwd: 'app/', src: ['**'], dest: 'build/win' },
                  { expand: true, cwd: webkitInfo.destination + 'win/unzip/' + webkitInfo.winUnzipFolder, src: ['nw.exe', 'nw.pak', 'icudtl.dat', ' libEGL.dll', ' libGLESv2.dll', 'credits.html'], dest: 'build/win' },
                ]
            },
            mac: {
                files: [
                  { expand: true, cwd: webkitInfo.destination + 'mac/unzip/' + webkitInfo.macUnzipFolder, src: ['nwjs.app/**', 'credits.html'], dest: 'build/mac' },
                  { expand: true, src: ['app/**'], dest: 'build/mac/nwjs.app/Contents/Resources' },
                ],
                options: {
                    mode: '777',
                    noProcess: 'true',
                }
            },
            src_only_win: {
                files: [
                    { expand: true, cwd: 'app/', src: ['**'], dest: 'build/win' },
                ]
            },
            src_only_mac: {
                files: [
                    { expand: true, cwd: 'app/', src: ['**'], dest: 'build/mac/bridge.app/Contents/Resources/app.nw' },
                ],
                options: {
                    mode: '777',
                    noProcess: 'true',
                }
            },
        },
        clean: {
            build: ["build"],
            package: ["build/win/package.json", "build/mac/bridge.app/Contents/Resources/app.nw/package.json"],
        },
        rename: {
            mac_rename: {
                files: [
                    { src: ['build/mac/nwjs.app'], dest: 'build/mac/bridge.app' },
                    { src: ['build/mac/bridge.app/Contents/Resources/app'], dest: 'build/mac/bridge.app/Contents/Resources/app.nw' }
                ]
            },
            package_rename: {
                files: [
                    { src: ['build/win/package_build.json'], dest: 'build/win/package.json' },
                    { src: ['build/mac/bridge.app/Contents/Resources/app.nw/package_build.json'], dest: 'build/mac/bridge.app/Contents/Resources/app.nw/package.json' },
                ]
            },
        }
    });

    grunt.registerTask('createDownloadFolder', 'Create the download folder for node and webkit', function () {
        grunt.file.mkdir(webkitInfo.destination + 'win');
        grunt.file.mkdir(webkitInfo.destination + 'mac');
    });

    grunt.registerTask('downloadResources', 'Download Node and node-webkit for Mac and Win', function () {
        var done = this.async();
        var downloadFinished = [];

        var checkAndDownload = function (sourcePath, destinationFolder, filename, platform) {
            if (!grunt.file.exists(destinationFolder + platform + '/', filename)) {
                downloadFinished.push(utils.download(sourcePath + filename, destinationFolder + platform));
            } else {
                grunt.log.writeln(filename + ' already exists, skipping download.');
            }
        };

        checkAndDownload(webkitInfo.source, webkitInfo.destination, webkitInfo.winFilename, 'win');
        checkAndDownload(webkitInfo.source, webkitInfo.destination, webkitInfo.macFilename, 'mac');

        Q.all(downloadFinished).done(function () {
            var unzipFinished = [];

            // untar seems to be non-blocking (in contrary to unzipping), so do this first
            unzipFinished.push(utils.unzipFile(webkitInfo.destination + 'win/' + webkitInfo.winFilename, webkitInfo.destination + 'win/unzip'));
            unzipFinished.push(utils.unzipFile(webkitInfo.destination + 'mac/' + webkitInfo.macFilename, webkitInfo.destination + 'mac/unzip'));

            Q.all(unzipFinished).done(function () {
                done();
            });
        });
    });

    grunt.registerTask('setRights', 'Set file access rights for mac', function () {
        var oldRights = fs.lstatSync(webkitInfo.destination + 'mac/unzip/' + webkitInfo.macUnzipFolder + '/nwjs.app');
        fs.chmodSync('build/mac/nwjs.app', oldRights.mode);
    });

    grunt.registerTask('npmInstall', 'Run npm install in mac and win build folder', function() {

    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['clean:build', 'createDownloadFolder', 'downloadResources', 'copy:win', 'copy:mac', 'setRights', 'rename:mac_rename', 'npmInstall']);
    grunt.registerTask('src', ['copy:src_only_win', 'copy:src_only_mac']);
    grunt.registerTask('deploy', ['default', 'clean:package', 'rename:package_rename']);
};