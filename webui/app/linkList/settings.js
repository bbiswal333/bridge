angular.module('app.linkList').appLinkListSettings = 
    ['app.linkList.configservice', '$scope', 'bridgeConfig',  
        function (appLinklistConfig, $scope,  bridgeConfig) {

	$scope.config = appLinklistConfig;
	
	$scope.currentConfigValues = {};

	$scope.sortableOptions = {
            //placeholder: "sortable-placeholder",
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            //helper: "clone",
            delay: 250,
            scroll: false,
            tolerance: "intersect",
            disabled: false
          };

	$scope.deleteEntry = function(entry)
	{
		linkList = appLinklistConfig.linkList;
		for (var i=0; i<linkList.length; i++) 
		{
			link = linkList[i];
			if(link.name == entry.name && link.url == entry.url && link.cat == entry.cat)
			{
				appLinklistConfig.linkList.splice(i,1);
				break;
			}
		}
	}

	$scope.activateEdit = function(entry)
	{
		entry.editable = true;
		entry.old = angular.copy(entry);
	}
	$scope.undoEdit = function(entry)
	{
		entry.name = angular.copy(entry.old.name);
		entry.url = angular.copy(entry.old.url);
		//entry.cat = angular.copy(entry.old.cat);
		entry.editable = false;
	}
	$scope.saveEdit = function(entry)
	{
		entry.editable = false;	
	}

	$scope.newEntry = function()
	{
		entry = {
			'name': $scope.currentConfigValues.linkName,
			'url':  $scope.currentConfigValues.url,
			'cat':'General'
		}
		$scope.currentConfigValues = '';
		appLinklistConfig.linkList.push(entry);
		//appLinklistConfig.linkList.push(angular.copy(entry));
	} 
}];

