angular.module('app.wire', []);

angular.module('app.wire').directive('app.wire', function () {

    var directiveController = ['$scope', '$http', 'bridgeCounter', function ($scope, $http, bridgeCounter) {
        $scope.boxTitle = "Wire";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d3;';
        bridgeCounter.CollectWebStats('WIRE', 'APPLOAD');

        /*$http.get('http://localhost:8000/api/wire?url=https://sapwire.hana.ondemand.com:443/api/1?json={"function":"getmessages","chatroom":"87873","lastmessageid":"0","limit":"5","previous":"false","source":"web"}'
        ).success(function(data) {
            $scope.messages = data;
        }).error(function(data) {
        });*/

        /*$http.get('https://mymailwdfvip.global.corp.sap/ews/Services.wsdl').success(function(data)
        {            
            console.log(data);
        }
        ).error(function(data) {
            //console.log(data);   
        });*/
    }];
    

    return {
        restrict: 'E',
        templateUrl: 'app/wire/overview.html',
        controller: directiveController
    };
});