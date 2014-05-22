angular.module('app.linklist').appLinkListSettings = 
    ['app.linklist.configservice', '$scope', '$rootScope',  
        function (appLinklistConfig, $scope, $rootScope) {

	$scope.config  = appLinklistConfig;

	$scope.addForm = [];
	for (var i = appLinklistConfig.listCollection.length - 1; i >= 0; i--) {
		$scope.addForm.push('');
	};

	$scope.currentConfigValues = {};

	calculateIDsForSortable = function () {
		for (var i=0; i<appLinklistConfig.listCollection.length; i++)
		{
			var currentList = appLinklistConfig.listCollection[i];
			for (var j=0; j<currentList.length; j++)
			{
				currentList[j].id = 'ID' + i + j; // ID based on position
			};
		};
	};
	calculateIDsForSortable();

	$scope.closeForm = function () {
		$scope.setBoxSize(appLinklistConfig.listCollection);
		$scope.$emit('closeSettingsScreen');
	};

	$scope.sortableOptions = {
        placeholder: "app-linklist-placeholder",
        dropOnEmpty: true,
        forcePlaceholderSize: true,
        connectWith: '.sortableConnect',
        delay: 250,
        scroll: false,
        tolerance: "intersect",
        disabled: false,

        receive: function(event, ui)
        {
        	// cancel does not work properly
            //if (event.target.childElementCount >= 6) {
                //ui.item.sortable.cancel();
            //}
			$scope.setBoxSize(appLinklistConfig.listCollection);
    	}
    };

    $scope.setBoxSize = function(listCollection)
    {
    	if(listCollection.length > 1) {
	        $scope.boxScope.box.boxSize = 2;
    	} else {
	        $scope.boxScope.box.boxSize = 1;
    	}
    };

    $scope.addLinkList = function()
    {
    	appLinklistConfig.listCollection.push([]);
    };

    $scope.removeLinkList = function(colNo)
    {
    	appLinklistConfig.listCollection.splice(colNo,1);
    };

    $scope.isLinkListEmpty = function(colNo)
    {
    	if(appLinklistConfig.listCollection[colNo].length == 0)
    	{
    		return true;
    	}
    };

	$scope.deleteEntry = function(colNo,entry)
	{
		linkList = appLinklistConfig.listCollection[colNo];

		if(linkList.length > 0)
		{
			for (var i=0; i<linkList.length; i++) 
			{
				link = linkList[i];

				if(!entry && !link) {
					appLinklistConfig.listCollection[colNo].splice(i,1);
					break;
				}
				if(link.type=="saplink")
				{
					if(entry && link && link.name == entry.name && link.sid == entry.sid && link.transaction == entry.transaction)
					{
						appLinklistConfig.listCollection[colNo].splice(i,1);
						break;
					}
				}
				else if(link.type=="hyperlink")
				{
					if(entry && link && link.name == entry.name && link.url == entry.url)
					{
						appLinklistConfig.listCollection[colNo].splice(i,1);
						break;
					}
				}
			}
		}
		if(linkList.length == 0 && colNo != 0)
		{	
			$scope.removeLinkList(colNo);
		}
	};

	$scope.newEntry = function(colNo)
	{
		if(appLinklistConfig.listCollection[colNo].length <= 6)
		{
			if($scope.addForm[colNo] == "web")
			{
				if(!$scope.currentConfigValues.url || !$scope.currentConfigValues.linkName) {
					return;
				};
				if($scope.currentConfigValues.url.indexOf("http") == -1){
                    $scope.currentConfigValues.url = "http://" + $scope.currentConfigValues.url;
                };
				entry = {
					'id': 'ID' + colNo + appLinklistConfig.listCollection[colNo].length + $scope.currentConfigValues.linkName,
					'name': $scope.currentConfigValues.linkName,
					'url':  $scope.currentConfigValues.url,
					'type': 'hyperlink'
				}
			}
			else if($scope.addForm[colNo] == "gui")
			{
				if(!$scope.currentConfigValues.sapLinkSID || !$scope.currentConfigValues.sapLinkName) {
					return;
				};
				entry = {
					'id': 'ID' + colNo + appLinklistConfig.listCollection[colNo].length + $scope.currentConfigValues.sapLinkName,
					'name': $scope.currentConfigValues.sapLinkName,
					'sid':  $scope.currentConfigValues.sapLinkSID,
					'transaction': $scope.currentConfigValues.sapLinkTransaction,
					'parameters': $scope.currentConfigValues.sapLinkParameters,
					'type': 'saplink'
				}
				entry.sapGuiFile = appLinklistConfig.generateBlob(entry.name, entry.sid, entry.transaction,entry.parameters);
			}
			$scope.currentConfigValues = {};
			$scope.setAddForm(colNo,'');
			appLinklistConfig.listCollection[colNo].push(entry);
		}
	};

	$scope.setAddForm = function(col,value)
	{
		$scope.addForm[col] = value;
	};

	$scope.isAddFormPossible = function()
	{
		for (var i=0; i<$scope.addForm.length; i++)
		{
			if ($scope.addForm[i] != '')
			{
				return false;
			}
		}
		return true;
	}

	$scope.toggleAddForm = function(col)
	{
		if($scope.addForm[col] == '' || $scope.addForm[col] == undefined)
		{
			$scope.addForm[col] = 'web';
		}
		else if($scope.addForm[col] != '')
		{
			$scope.addForm[col] = '';
		}
	};
}];
