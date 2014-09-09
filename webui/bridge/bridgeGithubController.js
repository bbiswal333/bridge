angular.module('bridge.app').
	controller('mainGithubController',['$http', '$log', '$scope', '$window',
	function ($http, $log, $scope, $window) {

        $http.get('https://github.wdf.sap.corp/api/v3/repos/bridge/bridge/contributors',{withCredentials:false}
        ).success(function(data) {
            $scope.contributors = data;

            angular.forEach($scope.contributors, function (contributor) {
                var user = contributor.login.toUpperCase();
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + user + '&origin=' + $window.location.origin).then(function (response) {
                    contributor.name = response.data.DATA.VORNA + ' ' + response.data.DATA.NACHN;
                    contributor.department = response.data.DATA.KOSTX;
                    if (contributor.department.length > 20) {
                        contributor.department = contributor.department.substring(0, 18) + '..';
                    }
                });
            });


        }).error(function(data) {
            $log.log('ERR' + data);
        });
}]);
