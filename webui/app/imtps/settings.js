angular.module('app.imtps').appimtpsSettings = ['app.imtps.configservice', '$scope', function (appimtpsConfig, $scope) {
	$scope.data = { tcQuery : appimtpsConfig.data.tcQuery };

	$scope.save_click = function () {  
        appimtpsConfig.data.tcQuery = $scope.data.tcQuery;
        $scope.$emit('closeSettingsScreen');
    };
}];