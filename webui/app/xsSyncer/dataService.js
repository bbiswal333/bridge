angular.module('app.xsSyncer').service("app.xsSyncer.dataService", ['bridgeDataService', '$http', '$window', function (bridgeDataService, $http, $window) 
{
    var data = {noConfig: true};
    function _setConfig(config) {
        data.config = config;
        
        if(data.noConfig) {
            data.proxy = 'http://localhost:' + data.config.serverPort;
        }
        
        $http.post($window.client.origin + '/api/xsSyncer/setConfig?origin=' + $window.location.origin, config, {'headers':{'Content-Type':'application/json'}}
            ).success(function () {
                data.noConfig = false;
                data.restartNeeded = true;
            }).error(function () {
        });
    }

    function _getConfig() {
        return data.config;
    }

    function _getData() {
        return data;
    }

    var initialConfig = {
        "serverPort"          : 8090,
        "usePolling"          : true,
        "liveReload"          : false,

        "hanaInstance": {
            "workspaceId"   : "",
            "ssl"           : true,
            "target"        : "",
            "user"          : bridgeDataService.getUserInfo().BNAME,
            "password"      : ""
        },
        "synchronizationSettings": [
        {
            "localPath"     : "",
            "remotePath"    : ""
        }
    ]
    };

    $http.get($window.client.origin + '/api/xsSyncer/getConfig?origin=' + $window.location.origin).success(function(response) {
        if(response.error) {
            data.noConfig = true;
            data.config = initialConfig;
        } else {
            data.config = response;
            data.noConfig = false;
            data.proxy = 'http://localhost:' + data.config.serverPort;
        }
    });

    return {
        setConfig: _setConfig,
        getConfig: _getConfig,
        getData: _getData
    };
}]);
