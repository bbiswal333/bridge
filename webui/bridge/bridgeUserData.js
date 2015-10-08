angular.module('bridge.service').service('bridgeUserData', ['$q', '$http', '$window', '$timeout',
    function ($q, $http, $window, $timeout) {
    	var userInfo;

    	function _fetchUserInfo() {
            var defer = $q.defer();

            $http({
                url: 'https://ifd.wdf.sap.corp/sap/bc/bridge/GET_MY_DATA?origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                userInfo = data.USERINFO;
                defer.resolve(data.USERINFO);
            }).error(function(){
                defer.reject();
            });

            return defer.promise;
        }

        this.getUserData = function() {
        	if(!userInfo) {
        		return _fetchUserInfo();
        	} else {
        		var deferred = $q.defer();
        		$timeout(function() {
        			deferred.resolve(userInfo);
        		}, 10);
        		return deferred.promise;
        	}
        };

        this.getUserDataSynchronous = function() {
            return userInfo;
        };
    }
]);
