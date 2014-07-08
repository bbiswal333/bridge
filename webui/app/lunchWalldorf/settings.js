angular.module('app.lunchWalldorf').applunchWalldorfSettings = ['$scope', "app.lunchWalldorf.configservice", function ($scope, lunchConfigService) {    
	$scope.configService = lunchConfigService;
	$scope.currentConfigValues = lunchConfigService.configItem;
    // $scope.data.query = JiraConfig.query;

    $scope.save_click = function () {  
        // JiraConfig.query = $scope.data.query;        
        $scope.configService.configItem = $scope.currentConfigValues;
        $scope.$emit('closeSettingsScreen');
    };

    // $scope.applyAssignedToMeTemplate = function() {
    // 	$scope.data.query = "assignee = currentUser()";
    // };

    // $scope.applyIssuesOfProjectTemplate = function() {
    // 	$scope.data.query = "project = '...' AND status = Open ORDER BY priority DESC";
    // };
}];