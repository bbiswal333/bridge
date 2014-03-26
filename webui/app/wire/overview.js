angular.module('app.wire', []);

angular.module('app.wire').directive('app.wire', function () {

    var directiveController = ['$scope', '$http', 'bridgeCounter', function ($scope, $http, bridgeCounter) {
        $scope.boxTitle = "Wire";
        $scope.initialized = true;
        $scope.boxIcon = '&#xe0d3;';
        bridgeCounter.CollectWebStats('WIRE', 'APPLOAD');      
        //$scope.boxNeedsClient = true;

        $http.get('https://sapwire.hana.ondemand.com/api/1?json={%22function%22:%22getmessages%22,%22chatroom%22:%2287873%22,%22lastmessageid%22:%220%22,%22limit%22:%225%22,%22previous%22:%22false%22,%22source%22:%22web%22}'
        ).success(function(data) {
            $scope.messages = data;
        }).error(function(data) {
        });

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