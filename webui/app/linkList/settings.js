angular.module('app.linkList').appLinkListSettings = 
    ['app.linkList.configservice', '$scope', '$rootScope',  
        function (appLinklistConfig, $scope, $rootScope) {

	$scope.config = appLinklistConfig;

	$scope.addForm = [];
	
	for (var i = appLinklistConfig.listCollection.length - 1; i >= 0; i--) {
		$scope.addForm.push('');
	};

	$scope.currentConfigValues = {};

	$scope.closeForm = function () {
		$scope.$emit('closeSettingsScreen');
	}

	$scope.sortableOptions = {
            placeholder: "app-linklist-placeholder",
            //forceHelperSize: true,
            forcePlaceholderSize: true,
            //helper: "clone",
            connectWith: '.sortableConnect',
            delay: 250,
            scroll: false,
            tolerance: "intersect",
            disabled: false,         

            receive: function(event, ui) {
	            if (event.target.childElementCount >= 6) {
	                ui.item.sortable.cancel();
	            }
	            else
	            {
	            	if (ui.sender.context.childElementCount == 0)
	            		{
	            			$scope.setBoxSize(appLinklistConfig.listCollection.length-1)	
	            		}
	            }
        	}      
          };

    $scope.setBoxSize = function(size)
    {
        $scope.boxScope.boxSize = size;
    };
    $scope.addLinkList = function()
    {
    	appLinklistConfig.listCollection.push([]);
    	if(appLinklistConfig.listCollection.length == 1) $scope.setBoxSize(1);
    	else if(appLinklistConfig.listCollection.length > 1) $scope.setBoxSize(2);
    };

    $scope.removeLinkList = function(linkList)
    {
    	appLinklistConfig.listCollection.splice(linkList,1);
    	if(appLinklistConfig.listCollection.length == 1) $scope.setBoxSize(1);
    	else if(appLinklistConfig.listCollection.length > 1) $scope.setBoxSize(2);
    };

	$scope.deleteEntry = function(colNo,entry)
	{
		linkList = appLinklistConfig.listCollection[colNo];

		if(linkList.length > 0)
		{
			for (var i=0; i<linkList.length; i++) 
			{
				link = linkList[i];

				if(link.type=="saplink")
				{
					if(link.name == entry.name && link.sid == entry.sid && link.transaction == entry.transaction)
					{
						appLinklistConfig.listCollection[colNo].splice(i,1);
						break;
					}
				}
				else if(link.type=="hyperlink")
				{
					if(link.name == entry.name && link.url == entry.url)
					{
						appLinklistConfig.listCollection[colNo].splice(i,1);
						break;
					}
				}
			}
		}
		if(linkList.length == 0 && appLinklistConfig.listCollection.length > 1)
		{	
			$scope.removeLinkList(colNo);
			//$scope.setBoxSize(appLinklistConfig.listCollection.length-1)
		}
	};

	$scope.activateEdit = function(entry)
	{
		if (arguments.length==0)
		{
			for (var i = $scope.config.linkList.length - 1; i >= 0; i--) {
				$scope.config.linkList[i].editable = true;
				$scope.config.linkList[i].old = angular.copy($scope.config.linkList[i]);
			};
		}
		else
		{			
		entry.editable = true;
		entry.old = angular.copy(entry);
		}
	};

	$scope.inEditMode = function()
	{
		for (var i = $scope.config.linkList.length - 1; i >= 0; i--) {
			if ($scope.config.linkList[i].editable == true) 
				{
					return true;
				}
		}
		return false;
	};

	$scope.undoEdit = function(entry)
	{	
			if(entry.type == "hyperlink")
			{
				entry.name = angular.copy(entry.old.name);
				entry.url = angular.copy(entry.old.url);
				entry.editable = false;
			}
			else if(entry.type == "saplink")
			{
				entry.name = angular.copy(entry.old.name);
				entry.sid = angular.copy(entry.old.sid);
				entry.transaction = angular.copy(entry.old.transaction);
				entry.parameters = angular.copy(entry.old.parameters);
				entry.editable = false;
			}
		
	};
	$scope.saveEdit = function(entry)
	{
		if (arguments.length==0)
		{
			for (var i = $scope.config.linkList.length - 1; i >= 0; i--) {
				$scope.config.linkList[i].editable = false;
			};
		}
		else
		{	
		entry.editable = false;	
		}
	}


	$scope.newEntry = function(colNo)
	{

		if(appLinklistConfig.listCollection[colNo].length <=5)
		{
			if($scope.addForm[colNo] == "web")
			{
				entry = {
					'name': $scope.currentConfigValues.linkName,
					'url':  $scope.currentConfigValues.url,
					'type': 'hyperlink'
				}
			}
			else if($scope.addForm[colNo] == "gui")
			{
				entry = {
					'name': $scope.currentConfigValues.sapLinkName,
					'sid':  $scope.currentConfigValues.sapLinkSID,
					'transaction': $scope.currentConfigValues.sapLinkTransaction,
					'parameters': $scope.currentConfigValues.sapLinkParameters,
					'type': 'saplink'
				}
				entry.sapGuiFile
				 = appLinklistConfig.generateBlob(entry.name, entry.sid, entry.transaction,entry.parameters);
			}
			$scope.currentConfigValues = {};
			$scope.setAddForm(colNo,'');
			appLinklistConfig.listCollection[colNo].push(entry);
		}
		else
		{
			//Error
			console.log("Max 6 Links per col")
		}
		
	};

	$scope.setAddForm = function(col,value)
	{
		$scope.addForm[col] = value;
	};
	$scope.toggleAddForm = function(col)
	{
		if($scope.addForm[col] == '' || $scope.addForm[col] == undefined) $scope.addForm[col] = 'web';
		else if($scope.addForm[col] != '') $scope.addForm[col] = '';
	};
}];

