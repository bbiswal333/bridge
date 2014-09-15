angular.module('app.customerMessages').appImSettings = ['$scope','app.customerMessages.configservice', function ($scope, configservice) {
	$scope.config = configservice;

     $scope.save_click = function () {
        //JiraConfig.query = $scope.data.query;
        $scope.$emit('closeSettingsScreen');
    };

    $scope.toggleNotificationDuration = function () {
    	if (!configservice.data.settings.notificationDuration || configservice.data.settings.notificationDuration >= 0){
    		configservice.data.settings.notificationDuration = -1;
    	} else
    	{
    		configservice.data.settings.notificationDuration = null;
    	}
    };

}];
