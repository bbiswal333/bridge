var fs = require('fs'),
    Q = require('q'),
    async = require('async');


module.exports = function (grunt) {
    var utils = require('./utils')(grunt);

    var webkitVersion = "0.9.2";
    var webkitInfo = {
        winFilename: "node-webkit-v" + webkitVersion + "-win-ia32.zip",
        macFilename: "node-webkit-v" + webkitVersion + "-osx-ia32.zip",
        source: "http://dl.node-webkit.org/v" + webkitVersion + "/",
        destination: "webkit_download/",
    };

    var nodeVersion = "0.10.26";
    var nodeInfo = {
        winFilename: "node.exe",
        macFilename: "node-v" + nodeVersion + "-darwin-x86.tar.gz",
        source: "http://nodejs.org/dist/v" + nodeVersion + "/",
        destination: "node_download/",
    };

    var npmVersion = "1.4.6";
    var npmInfo = {
        winFilename: "npm-" + npmVersion + ".zip",
        source: "http://nodejs.org/dist/npm/",
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
                  { expand: true, cwd: 'node_download/win', src: ['**', '!*.zip'], dest: 'build/win/node' },
                  { expand: true, cwd: 'webkit_download/win/unzip', src: ['nw.exe', 'nw.pak', 'icudt.dll', ' libEGL.dll', ' libGLESv2.dll', 'credits.html'], dest: 'build/win' },
                ]
            },
            mac: {
                files: [
                  { expand: true, cwd: 'webkit_download/mac/unzip/', src: ['node-webkit.app/**', 'credits.html'], dest: 'build/mac' },
                  { expand: true, src: ['app/**'], dest: 'build/mac/node-webkit.app/Contents/Resources' },
                  { expand: true, cwd: 'node_download/mac/unzip', src: ['**'], dest: 'build/mac/node-webkit.app/Contents/Resources/app/node' },
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
                    { src: ['build/mac/node-webkit.app'], dest: 'build/mac/bridge.app' },
                    { src: ['build/mac/bridge.app/Contents/Resources/app'], dest: 'build/mac/bridge.app/Contents/Resources/app.nw' }
                ]
            },
            package_rename: {
                files: [
                    { src: ['build/win/package_build.json'], dest: 'build/win/package.json' },
                    { src: ['build/mac/bridge.app/Contents/Resources/app.nw/package_build.json'], dest: 'build/mac/bridge.app/Contents/Resources/app.nw/package.json' },
                ]
            },
        },
        chmod: {
            options: {
              mode: '777'
            },
            yourTarget1: {
              src: ['build/mac/**/*']
            }
          }
    });

    grunt.registerTask('copynpm', function(){
        grunt.task.run('shell:copy:' + nodeInfo.destination + 'mac/unzip/bin/npm:' + 'build/mac/bridge.app/Contents/Resources/app.nw/node/bin');
    });

    grunt.registerTask('createDownloadFolder', 'Create the download folder for node and webkit', function () {
        grunt.file.mkdir(webkitInfo.destination + 'win');
        grunt.file.mkdir(webkitInfo.destination + 'mac');
        grunt.file.mkdir(nodeInfo.destination + 'win');
        grunt.file.mkdir(nodeInfo.destination + 'mac');
    });

    grunt.registerTask('downloadResources', 'Download Node and node-webkit for Mac and Win', function () {
        done = this.async();
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
        checkAndDownload(nodeInfo.source, nodeInfo.destination, nodeInfo.winFilename, 'win');
        checkAndDownload(npmInfo.source, nodeInfo.destination, npmInfo.winFilename, 'win'); // download into node folder
        checkAndDownload(nodeInfo.source, nodeInfo.destination, nodeInfo.macFilename, 'mac');

        Q.all(downloadFinished).done(function () {
            var unzipFinished = [];

            // untar seems to be non-blocking (in contrary to unzipping), so do this first
            unzipFinished.push(utils.untarFile(nodeInfo.destination + 'mac/' + nodeInfo.macFilename, nodeInfo.destination + 'mac/unzip'));
            unzipFinished.push(utils.unzipFile(webkitInfo.destination + 'win/' + webkitInfo.winFilename, webkitInfo.destination + 'win/unzip'));
            unzipFinished.push(utils.unzipFile(webkitInfo.destination + 'mac/' + webkitInfo.macFilename, webkitInfo.destination + 'mac/unzip'));
            unzipFinished.push(utils.unzipFile(nodeInfo.destination + 'win/' + npmInfo.winFilename, nodeInfo.destination + 'win')); // unzip npm directly into the win/node folder

            Q.all(unzipFinished).done(function () {
                done();
            });
        });
    });

    grunt.registerTask('setRights', 'Set file access rights for mac', function () {
        var oldRights = fs.lstatSync(webkitInfo.destination + 'mac/unzip/node-webkit.app');
        fs.chmodSync('build/mac/node-webkit.app', oldRights.mode);
    });

    grunt.registerTask('copyAlias', 'bla', function () {
        grunt.file.copy("node_download/mac/unzip/bin/npm", "npmCopy", { noProcess: "true" });
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-chmod');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['clean:build', 'createDownloadFolder', 'downloadResources', 'copy:win', 'copy:mac', 'setRights', 'rename:mac_rename', 'chmod', 'copynpm']);
    grunt.registerTask('src', ['copy:src_only_win', 'copy:src_only_mac']);
    grunt.registerTask('deploy', ['default', 'clean:package', 'rename:package_rename']);
};