angular.module('app.getHome').appGetHomeSettings = 
    ['app.getHome.configservice', '$scope',  
        function (appGetHomeConfig, $scope) {

	$scope.config  = appGetHomeConfig;


}];