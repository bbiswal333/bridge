angular.module('app.imtl').appImtlSettings = ['app.imtl.configservice', '$scope', function (appImtlConfig, $scope) {
	$scope.data = { };
	$scope.data.tlquery = '';
	
	$scope.data.tlquery = appImtlConfig.trafficlightquery;

	$scope.save_click = function () {  
        appImtlConfig.trafficlightquery = $scope.data.tlquery;
        $scope.$emit('closeSettingsScreen');
    };
}];