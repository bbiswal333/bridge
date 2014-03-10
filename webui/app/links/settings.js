angular.module('app.links').appLinksSettings = 
    ['app.links.linkData', '$scope', 'bridgeConfig', 
        function (appLinkData, $scope,  bridgeConfig) {

	$scope.links= appLinkData;

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
		console.log($scope.currentConfigValues.linkName);

		var entry = {
			'name': 'la',
			'url':  $scope.currentConfigValues.url,
			'cat':'General'
		}
		
	}
    
    
    
}];

