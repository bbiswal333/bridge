angular.module('app.meetings').appMeetingsSettings =
['$scope', "app.meetings.configservice", "$window", function ($scope, meetingsConfigService, $window) {
	$scope.currentConfigValues = meetingsConfigService.configItem;
	$scope.client = $window.client;

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
}];
