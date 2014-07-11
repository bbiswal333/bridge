angular.module('app.imtps', []);

angular.module('app.imtps').directive('app.imtps', ['app.imtps.configservice', function (appimtpsConfig) {

    var directiveController = ['$scope' , function ($scope) {
		
//        $scope.settingsTitle = "Configure Traffic Light";
//        $scope.settingScreenData = {
//            templatePath: "imtps/settings.html",
//			controller: angular.module('app.imtps').appimtpsSettings,
//        };
		
		$scope.returnConfig = function(){
            return appimtpsConfig.trafficlightquery;
        }
		
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imtps/overview.html',
        controller: directiveController
    };
}]);

    angular.module('app.imtps').run(function ($rootScope) {
});

angular.module('app.imtps').controller('app.imtps.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarray = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
		
		var updateTrafficLight = function ($scope) {
			if( $scope.prioarray[0] ){
				$http.get('/api/trafficLight?color=r');
			}else if( $scope.prioarray[1] ){
				$http.get('/api/trafficLight?color=y');
			}else{
				$http.get('/api/trafficLight?color=g');
			}
		}	
		
        $http.get('https://gtpmain.wdf.sap.corp/sap/bc/devdb/msgsfrommytps?testplans=GS_BNK_LA_FIT_T08S01_*&origin=' + location.origin ).success(function(data) {
                data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];
				
                _.each($scope.imData["TC_MESSAGES"]["_-QBE_-S_MESSAGES"], function (n) {
                	console.log(n["MSG_PRIO"]);
					if( n["MSG_PRIO"] == 1 ){
						$scope.prioarray[0] = $scope.prioarray[0] + 1;
					}else if( n["MSG_PRIO"] == 2 ){
						$scope.prioarray[1] = $scope.prioarray[1] + 1;
					}else if( n["MSG_PRIO"] == 3 ){
						$scope.prioarray[2] = $scope.prioarray[2] + 1;
					}else{
						$scope.prioarray[3] = $scope.prioarray[3] + 1;
					}					
                });
				
                if ( ($scope.prioarray[0] + $scope.prioarray[1] + $scope.prioarray[2] + $scope.prioarray[3]) == 0) {
                    $scope.lastElement="You have no internal messages to display!";
                    $scope.displayChart = false;
                }                
                else
                {
                    $scope.displayChart = true;
                }
				updateTrafficLight($scope);
            }).error(function(data) {
            	console.log("error");
                $scope.imData = [];                
            });
}]);
    
