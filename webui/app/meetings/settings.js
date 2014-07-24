angular.module('app.meetings').appMeetingsSettings =
['$scope', "app.meetings.configservice", function ($scope, meetingsConfigService) {    
	$scope.currentConfigValues = meetingsConfigService.configItem;

    $scope.save_click = function () {
        $scope.$emit('closeSettingsScreen');
    };
}];