angular.module('app.imtps', ['ngTable']);

angular.module('app.imtps').directive('app.imtps', ['app.imtps.configservice', function (appimtpsConfig) {
    return {
        restrict: 'E',
        templateUrl: 'app/imtps/overview.html',
        link: function ($scope) 
        {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.data !== undefined) 
            {
            	appimtpsConfig.data = $scope.appConfig.data;
            }            
        }
    };
}]);

angular.module('app.imtps').controller('app.imtps.directiveController', ['$scope', '$http', 'app.imtps.configservice', 'app.imtps.msgReaderData','bridgeDataService', 'bridgeConfig',
    function Controller($scope, $http, configService, msgReaderData, bridgeDataService, bridgeConfig) {
	    
        $scope.box.boxSize = "1";      
        $scope.box.settingScreenData = {
            templatePath: "imtps/settings.html",
            controller: angular.module('app.imtps').appimtpsSettings,
            id: $scope.boxId
        };          

        $scope.box.returnConfig = function()
        {
            return configService;
        };
        
        $scope.$watch('config', function (newVal, oldVal) {
            if($scope.config !== undefined && newVal !== oldVal)
            {                
                // oldval is undefined for the first call of this watcher, i.e. the initial setup of the config. We do not have to save the config in this case
                if (oldVal !== undefined) {
                    bridgeConfig.persistInBackend(bridgeDataService);
                }
            }
        },true);
	
        $scope.prioarray = [0,0,0,0];
        $scope.prionr = [1,2,3,4];
		
		msgReaderData.initService( function(messages){
			if( messages ){
				$scope.prioarray = [0,0,0,0];
				angular.forEach(messages["_-QBE_-S_MESSAGES"], function (n) {
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
			}
            if ( ($scope.prioarray[0] + $scope.prioarray[1] + $scope.prioarray[2] + $scope.prioarray[3]) == 0) {
                $scope.lastElement="You have no internal messages to display!";
                $scope.displayChart = false;
            }                
            else
            {
                $scope.displayChart = true;
            }
		});

}]);
    
