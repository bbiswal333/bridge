angular.module('app.linkList').appLinkListSettings = 
    ['app.linkList.configservice', '$scope', 'bridgeConfig', 
        function (appLinklistConfig, $scope,  bridgeConfig) {

	$scope.config = appLinklistConfig;
	$scope.currentConfigValues = {};

	$scope.currentConfigValues.linkName = "yahoo";
	$scope.currentConfigValues.url = "http://yahoo.de";

	$scope.deleteEntry = function(entry)
	{
		console.log("DEL");
		console.log(entry);
	}
	$scope.editEntry = function(entry)
	{
		console.log("EDIT");
		console.log(entry);
	}
	$scope.newEntry = function()
	{
		entry = {
			'name': $scope.currentConfigValues.linkName,
			'url':  $scope.currentConfigValues.url,
			'cat':'General'
		}
		appLinklistConfig.linkList.push(entry);

		//appLinklistConfig.linkList.push(entry);
		console.log(appLinklistConfig);

	}
    
    
    
}];

