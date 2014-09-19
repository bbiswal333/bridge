angular.module('app.linklist').appLinkListSettings =
    ['app.linklist.configservice', '$scope',
        function (appLinklistConfig, $scope) {

	$scope.config  = appLinklistConfig;
	$scope.selectedIndex = 0;

	$scope.addForm = [];
	for (var i = appLinklistConfig.data.listCollection.length - 1; i >= 0; i--) {
		$scope.addForm.push('');
	}

	$scope.currentConfigValues = {};

	this.calculateIDsForSortable = function () {
		for (var i = 0; i < appLinklistConfig.data.listCollection.length; i++)
		{
		    var currentList = appLinklistConfig.data.listCollection[i];
			for (var j = 0; j < currentList.length; j++)
			{
				currentList[j].id = 'ID' + i + j; // ID based on position
			}
		}
	};

	this.calculateIDsForSortable();

	$scope.closeForm = function () {
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
        disabled: false
    };

    $scope.handleDrop = function(event, colNo){
        event.preventDefault();
        event.stopPropagation();

        $scope.toggleAddForm(colNo);
        $scope.currentConfigValues.url = event.dataTransfer.getData('text');
        // $scope.currentConfigValues.url = event.dataTransfer.getData('text/plain');

        var regex = /(.*:)\/\/([a-z\-.]+)(:[0-9]+)?(.*)/g;
		var urlArray = regex.exec($scope.currentConfigValues.url);

        $scope.currentConfigValues.name = urlArray[2];

        angular.element(event.target).removeClass("app-linklist-dragEnter");
    };

    $scope.addLinkList = function()
    {
        appLinklistConfig.data.listCollection.push([]);
    };

    $scope.isLinkListEmpty = function(colNo)
    {
        if (appLinklistConfig.data.listCollection[colNo].length === 0)
    	{
    		return true;
    	}
    };

	$scope.deleteEntry = function(colNo,entry)
	{
	    var linkList = appLinklistConfig.data.listCollection[colNo];

		if(linkList.length > 0)
		{
			for (var i = 0; i < linkList.length; i++)
			{
				var link = linkList[i];

				if(!entry && !link) {
					appLinklistConfig.data.listCollection[colNo].splice(i, 1);
					break;
				}
				if(link.type === "saplink")
				{
					if(entry && link &&
						link.name === entry.name &&
						link.sid === entry.sid &&
						link.transaction === entry.transaction)
					{
					    appLinklistConfig.data.listCollection[colNo].splice(i, 1);
						break;
					}
				}
				else if(link.type === "hyperlink")
				{
					if(entry && link && link.name === entry.name && link.url === entry.url)
					{
						appLinklistConfig.data.listCollection[colNo].splice(i, 1);
						break;
					}
				}
			}
		}
		if (entry.id === $scope.currentConfigValues.id) {
			$scope.currentConfigValues = {};
			$scope.addForm = [];
		}
	};

	function updateEntry (colNo){
		if($scope.addForm[colNo] === "web")
		{
			if(!$scope.currentConfigValues.url){
                $scope.currentConfigValues.url = "http://";
			}
			else if( $scope.currentConfigValues.url.indexOf("http") === -1){
                $scope.currentConfigValues.url = "http://" + $scope.currentConfigValues.url;
            }
		    $scope.currentConfigValues.id = 'ID' + colNo + appLinklistConfig.data.listCollection[colNo].length + $scope.currentConfigValues.name;
			$scope.currentConfigValues.type = 'hyperlink';
		}
		else if($scope.addForm[colNo] === "gui")
		{
			    $scope.currentConfigValues.id = 'ID' + colNo + appLinklistConfig.data.listCollection[colNo].length + $scope.currentConfigValues.sapLinkName;
				$scope.currentConfigValues.type = 'saplink';
		}
	}

	$scope.newEntry = function(colNo)
	{
		updateEntry(colNo);
		appLinklistConfig.data.listCollection[colNo].push($scope.currentConfigValues);
	};

	$scope.setAddForm = function(col,value)
	{
		$scope.addForm[col] = value;
		updateEntry(col);
	};

	function validateLink(){
		if ($scope.currentConfigValues.id && !$scope.currentConfigValues.name) {
			$scope.deleteEntry($scope.selectedIndex, $scope.currentConfigValues);
			console.log('link deleted ', $scope.currentConfigValues.id);
		}
	}

	$scope.selectLink = function(col, link){
		validateLink();
		$scope.selectedIndex = col;
		$scope.currentConfigValues = link;
		if ($scope.currentConfigValues.type === 'hyperlink') {
			$scope.addForm[col] = 'web';
		} else if ($scope.currentConfigValues.type === 'saplink'){
			$scope.addForm[col] = 'gui';
		}
	};

	$scope.toggleAddForm = function(col)
	{
		validateLink();
		$scope.selectedIndex = col;
		$scope.currentConfigValues = {};
		$scope.addForm[col] = 'web';
		$scope.newEntry(col);
	};
}];
