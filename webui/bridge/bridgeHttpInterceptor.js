angular.module('bridge.app').factory('bridge.app.httpInterceptor', ['$q', '$rootScope', '$injector', '$location', '$timeout', function ($q, $rootScope, $injector, $location, $timeout) {

    var $http;
    var bridgeDataService;
    var rProtocol = /^http|^https/i;
    var rLocalhost = /^https:\/\/localhost/i;

    function checkResponse(response) {
        $timeout.cancel(response.config.timer);

        // inject $http object manually, see: http://stackoverflow.com/questions/20647483/angularjs-injecting-service-into-a-http-interceptor-circular-dependency
        // for the same reason we need to inject the bridgeDataService manually (as it needs the $https service)
        $http = $http || $injector.get('$http');
        if ($http.pendingRequests.length < 1) {
            $rootScope.showLoadingBar = false;
            response.config.timer = undefined;
        }
    }

    function rerouteCall(oConfig) {
        var sNewUrl = "";
        var sEncodedUrl = "";

        if (oConfig.method === "GET") {
            //oConfig.url = oConfig.url.replace(/\?/, "&");
            sEncodedUrl = encodeURIComponent(oConfig.url);
            sNewUrl = "https://localhost:1972/api/get?url=" + sEncodedUrl;
        } else {
            sNewUrl = oConfig.url;
        }

        return sNewUrl;
    }

    function uncachifyUrl(url) {
        var resultUrl = url + "?" + new Date().getTime();
        if (url.indexOf("?") >= 0) {
            resultUrl = url + "&" + new Date().getTime();
        }
        return resultUrl;
    }

    return {
        'request': function (config) {
            bridgeDataService = bridgeDataService || $injector.get('bridgeDataService');
            // if we have an external call (starting with http/https) and we are in client mode, then route all calls via the client
            if (bridgeDataService.getClientMode() === true && rProtocol.test(config.url)) {
                // if the call already targets to localhost, don't modify it
                if (!rLocalhost.test(config.url)) {
                    var sNewUrl = rerouteCall(config);
                    config.url = sNewUrl;
                }
            }

            //IE wants to cache everything so all external https calls are uncached here
            if (config.url.indexOf("https://") !== -1) {
                config.url = uncachifyUrl(config.url);
            }

            config.timer = $timeout(function () {
                $rootScope.showLoadingBar = true;
            }, 500, true);

            return config || $q.when(config);
        },
        'response': function (response) {
            checkResponse(response);
            return response || $q.when(response);
        },
        'responseError': function (response) {
            checkResponse(response);
            return $q.reject(response);
        }
    };

}]);
