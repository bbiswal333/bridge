angular.module('app.im', ['ngTable']);

angular.module('app.im').directive('app.im', function () {

    var directiveController = ['$scope' ,'app.im.configservice', function ($scope, appimconfigservice) {        
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/im/overview.html',
        controller: directiveController
    };
});

    angular.module('app.im').run(function ($rootScope) {
});

angular.module('app.im').controller('app.im.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarr = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
        $scope.$parent.titleExtension = " - Internal Messages"; 
        $http.get('https://css.wdf.sap.corp:443/sap/bc/devdb/MYINTERNALMESS?origin=' + location.origin
            ).success(function(data) {
                data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];

                _.each($scope.imData.INTCOMP_LONG.DEVDB_MESSAGE_OUT, function (n) {
                    _.each($scope.prionr, function (u,i) {
                        i = i + 1;
                        if(n.PRIO == i.toString())
                            $scope.prioarr[i-1] ++;
                    });
                });
                if ( ($scope.prioarr[0] + $scope.prioarr[1] + $scope.prioarr[2] + $scope.prioarr[3]) == 0) {
                    $scope.lastElement="You have no internal messages to display!";
                    $scope.displayChart = false;
                }                
                else 
                {
                    $scope.displayChart = true;
                }

            }).error(function(data) {
                $scope.imData = [];                
            });
}]);
    
