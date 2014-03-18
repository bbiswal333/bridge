angular.module('app.linkList').appLinkListSettings = 
    ['app.linkList.configservice', '$scope', 'bridgeConfig',  
        function (appLinklistConfig, $scope,  bridgeConfig) {

	$scope.config = appLinklistConfig;

	$scope.addForm = [];
	
		for (var i = appLinklistConfig.listCollection.length - 1; i >= 0; i--) {
			$scope.addForm.push('');
		};

	$scope.currentConfigValues = {};

	$scope.sortableOptions = {
            //placeholder: "sortable-placeholder",
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            //helper: "clone",
            connectWith: '.sortableConnect',
            delay: 250,
            scroll: false,
            tolerance: "intersect",
            disabled: false,
            receive: function(event, ui) {
            	console.log(event.target.childElementCount);
	            if (event.target.childElementCount >= 6) {
	            	console.log(ui);

	                 ui.item.sortable.cancel();
	            }
        	}
       
          };

    $scope.setBoxSize = function(size,col)
    {
    	//SET BOX SIZE!!!
    	//CHECK IF LISTS EMPTY??

    	if(col > appLinklistConfig.listCollection.length)
    	{
    		for (var i = col-appLinklistConfig.listCollection.length -1; i >= 0; i--) {
    			appLinklistConfig.listCollection.push([]);
    		};
    		console.log(col-appLinklistConfig.listCollection.length);
    	}
    	else if(col < appLinklistConfig.listCollection.length)
    	{
    		appLinklistConfig.listCollection.splice(col);
    		console.log(Math.abs(col-appLinklistConfig.listCollection.length));
    	}


    }      
	$scope.deleteEntry = function(colNo,entry)
	{
		linkList = appLinklistConfig.listCollection[colNo];

		console.log("Delete colNo:" +colNo);
		console.log(linkList);
		console.log(entry);

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
	}

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
	}

	$scope.inEditMode = function()
	{
		for (var i = $scope.config.linkList.length - 1; i >= 0; i--) {
			if ($scope.config.linkList[i].editable == true) 
				{
					return true;
				}
		}
		return false;
	}

	$scope.undoEdit = function(entry)
	{	console.log(entry);
		if (arguments.length==0)
		{
			for (var i = $scope.config.linkList.length - 1; i >= 0; i--) {
				
				entryOld = angular.copy($scope.config.linkList[i].old);
				entry = 	$scope.config.linkList[i];
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
		}
		else
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
		
		}
	}
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
				 = appLinklistConfig.generateBlob(entry.name, entry.sid, entry.transaction,'');
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
		
	} 
	$scope.setAddForm = function(col,value)
	{
		$scope.addForm[col] = value;
	}
}];

