/*global io*/
angular.module('app.xsSyncer', []);
angular.module('app.xsSyncer').directive('app.xsSyncer', function () {

    var directiveController = ['$scope', '$http', 'app.xsSyncer.dataService','$window', '$log', function ($scope, $http, dataService, $window, $log)
    {
        $scope.box.boxSize = 2;

        $scope.box.settingScreenData = {
            templatePath: "xsSyncer/settings.html",
            controller: angular.module('app.xsSyncer').appXsSyncerSettings
        };

        var requests = {};
        $scope.outputArray = [];
        $scope.socketConnected = false;
        $scope.dataService = dataService.getData();

        var socket;

        function connectToSocket() {
            socket = io.connect('https://localhost:10291', {transports: ['websocket'], 'reconnect': true, 'reconnection delay': 500, 'max reconnection attempts': Infinity, 'reconnection limit': 100});
            socket.on('connect_error', function() {
                $scope.$apply(function() {
                    $scope.socketConnected = false;
                });
            });
            socket.on('disconnect', function() {
                $scope.$apply(function() {
                    $scope.socketConnected = false;
                });
            });
            socket.on('connect', function() {
                $scope.$apply(function() {
                    $scope.socketConnected = true;
                });
            });
            socket.on('output', function (data) {
                var messageObject = {date: new Date(), status: ""};
                messageObject.type = data[0];
                if (messageObject.type === "ERROR") {
                    //messageObject.message = data[1];
                    return;
                } else {
                    var sender = data[1];
                    var action = data[2];
                    var message = data[3];
                    var requestId = data[5];
                    if(sender === "FileSyncWatcher" && action === "change") {
                        messageObject.icon = "fa-edit";
                        messageObject.message = "local change in " + message;
                    }
                    if(sender === "FileSyncWatcher" && action === "add") {
                        messageObject.icon = "fa-plus-circle";
                        messageObject.message = "locally created " + message;
                    }
                    if(sender === "FileSyncWatcher" && action === "unlink") {
                        messageObject.icon = "fa-minus-circle";
                        messageObject.message = "locally removed " + message;
                    }
                    if(sender === "FileSyncWatcher" && action === "addDir") {
                        messageObject.icon = "fa-folder";
                        messageObject.message = "local folder " + message + " created";
                    }
                    if(sender === "FileSyncWatcher" && action === "unlinkDir") {
                        messageObject.icon = "fa-minus-circle";
                        messageObject.message = "local folder " + message + " removed";
                    }
                    if(sender === "Repo" && action === "uploading") {
                        messageObject.icon = "fa-upload";
                        messageObject.message = "uploading <a href='" + dataService.getData().proxy + message + "' target='_blank'>" + message.substring(message.lastIndexOf('/') + 1) + "</a> to server";
                        requests[requestId] = messageObject;
                    }
                    if(sender === "Repo" && action.indexOf(" finished") > 0) {
                        if(requests[requestId]) { $scope.$apply(function() { requests[requestId].status = "finished"; }); }
                        return;
                    }
                    if(sender === "Repo" && action.indexOf(" failed") > 0) {
                        if(requests[requestId]) { $scope.$apply(function() { requests[requestId].status = "failed"; }); }
                        return;
                    }
                    if(sender === "Repo" && action === "deleting") {
                        messageObject.icon = "fa-upload";
                        messageObject.message = "deleting " + message + " on server";
                        requests[requestId] = messageObject;
                    }

                    if(messageObject.message === undefined) {
                        messageObject.message = action + " " + message;
                    }
                }
                $scope.$apply(function() {
                    $scope.outputArray.unshift(messageObject);
                });
            });

            $scope.box.returnConfig = function () {
            return dataService.getConfig();
        };
        }

        connectToSocket();

        $scope.startServer = function() {
            $http.post($window.client.origin + '/api/xsSyncer/start/?origin=' + $window.location.origin, dataService.getConfig(), {'headers':{'Content-Type':'application/json'}}
            ).success(function (response) {
                $scope.dataService.restartNeeded = false;
                if(response.error) {
                    $log(response.message);
                }
                for(var prop in io.sockets) { io.sockets[prop].connect(); io.sockets[prop].reconnect(); }
            }).error(function () {

            });
        };

        $scope.stopServer = function() {
            $http.get($window.client.origin + '/api/xsSyncer/stop/?origin=' + $window.location.origin).success(function() {
                $scope.dataService.restartNeeded = false;
                $scope.socketConnected = false;
            });
        };

        $scope.formatDate = function(timestamp) {
            if(new Date().toDateString() === timestamp.toDateString()) {
                return timestamp.toTimeString().substring(0, 5);
            } else if(timestamp.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
                return "yesterday";
            } else {
                return "long ago";
            }
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/xsSyncer/overview.html',
        controller: directiveController
    };
});
