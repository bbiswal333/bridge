angular.module('app.customerMessages').appImSettings = ['$scope','app.customerMessages.configservice', function ($scope, configservice) {  
	$scope.config = configservice;         

     $scope.save_click = function () {  
        //JiraConfig.query = $scope.data.query;        
        $scope.$emit('closeSettingsScreen');
    };
    
}];