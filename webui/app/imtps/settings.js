angular.module('app.imtps').appimtpsSettings = ['app.imtps.configservice', '$scope', function (appimtpsConfig, $scope) {
	$scope.data = { };
	$scope.data.tlquery = '';
	
	$scope.data.tlquery = appimtpsConfig.trafficlightquery;

	$scope.save_click = function () {  
        appimtpsConfig.trafficlightquery = $scope.data.tlquery;
        $scope.$emit('closeSettingsScreen');
    };
}];