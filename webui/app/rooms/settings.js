angular.module('app.rooms').appMeetingsSettings =
['$scope', "app.rooms.configservice", function ($scope, meetingsConfigService) {
	$scope.currentConfigValues = meetingsConfigService.configItem;

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
}];