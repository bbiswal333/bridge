angular.module('app.imtl', []);

angular.module('app.imtl').directive('app.imtl', ['app.imtl.configservice', function (appImtlConfig) {

    var directiveController = ['$scope' , 'bridgeCounter', function ($scope, bridgeCounter) {
        $scope.boxTitle = "Internal Messages";
        $scope.boxIcon = '&#xe81b;';
        $scope.boxIconClass = 'icon-comment-empty';
		
        bridgeCounter.CollectWebStats('INTERNAL_MESSAGES', 'APPLOAD'); 
		
        $scope.settingsTitle = "Configure Traffic Light";
        $scope.settingScreenData = {
            templatePath: "imtl/settings.html",
			controller: angular.module('app.imtl').appImtlSettings,
        };
		
		$scope.returnConfig = function(){
            return appImtlConfig.trafficlightquery;
        }
		
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/imtl/overview.html',
        controller: directiveController
    };
}]);

    angular.module('app.imtl').run(function ($rootScope) {
});

angular.module('app.imtl').controller('app.imtl.directiveController', ['$scope', '$http',
    function Controller($scope, $http) {

        $scope.prioarr = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
        $scope.$parent.titleExtension = " - Internal Messages"; 
		
		var updateTrafficLight = function ($scope) {
			if( $scope.prioarr[0] ){
				console.log( 'turn red on' );
				//window.client.origin
				$http.get('/api/trafficLight?color=r');
			}else if( $scope.prioarr[1] ){
				console.log( 'turn yellow on' );
				$http.get('/api/trafficLight?color=y');
			}else{
				console.log( 'turn green on' );
				$http.get('/api/trafficLight?color=g');
			}
		}	
		
		//Ask about frequency of refresh interval
        $http.get('https://gte.wdf.sap.corp/sap/bc/devdb/MSGSFROMMYTPS?user=D055469&origin=' + location.origin
            ).success(function(data) {
                data = new X2JS().xml_str2json(data);
                $scope.imData = data["abap"];
                $scope.imData = $scope.imData["values"];
				
                _.each($scope.imData["TC_MESSAGES"]["_-QBE_-S_MESSAGES"], function (n) {
					if( n["MSG_PRIO"] == 1 ){
						$scope.prioarr[0] = $scope.prioarr[0] + 1;
					}else if( n["MSG_PRIO"] == 2 ){
						$scope.prioarr[1] = $scope.prioarr[1] + 1;
					}else if( n["MSG_PRIO"] == 3 ){
						$scope.prioarr[2] = $scope.prioarr[2] + 1;
					}else{
						$scope.prioarr[3] = $scope.prioarr[3] + 1;
					}					
                });
				
                if ( ($scope.prioarr[0] + $scope.prioarr[1] + $scope.prioarr[2] + $scope.prioarr[3]) == 0) {
                    $scope.lastElement="You have no internal messages to display!";
                    $scope.displayChart = false;
                }                
                else
                {
                    $scope.displayChart = true;
                }
				updateTrafficLight($scope);
            }).error(function(data) {
                $scope.imData = [];                
            });
}]);
    
