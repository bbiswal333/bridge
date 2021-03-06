angular.module('app.linklist').appLinkListSettings =
    ['app.linklist.configservice', '$scope', '$log', '$timeout',
        function (appLinklistConfig, $scope, $log, $timeout) {

    var linklistConfig = appLinklistConfig.getInstanceForAppId($scope.boxScope.metadata.guid);
	$scope.config  = linklistConfig;
	$scope.selectedIndex = 0;

	$scope.addForm = [];
	for (var u = linklistConfig.data.listCollection.length - 1; u >= 0; u--) {
		$scope.addForm.push('');
	}

	$scope.currentConfigValues = {};

	this.calculateIDsForSortable = function () {
		for (var i = 0; i < linklistConfig.data.listCollection.length; i++)
		{
		    var currentList = linklistConfig.data.listCollection[i];
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

        var regex = /(.*:)\/\/([a-z\-.]+)(:[0-9]+)?(.*)/g;
		var urlArray = regex.exec($scope.currentConfigValues.url);

        $scope.currentConfigValues.name = urlArray[2];

        angular.element(event.target).removeClass("app-linklist-dragEnter");
    };

    $scope.addLinkList = function()
    {
        linklistConfig.data.listCollection.push([]);
    };

    $scope.isLinkListEmpty = function(colNo)
    {
        if (linklistConfig.data.listCollection[colNo].length === 0)
    	{
    		return true;
    	}
    };

	$scope.deleteEntry = function(colNo,entry)
	{
	    var linkList = linklistConfig.data.listCollection[colNo];

		if(linkList.length > 0)
		{
			for (var i = 0; i < linkList.length; i++)
			{
				var link = linkList[i];

				if(!entry && !link) {
					linklistConfig.data.listCollection[colNo].splice(i, 1);
					break;
				}
				if(link.type === "saplink")
				{
					if(entry && link &&
						link.name === entry.name &&
						link.sid === entry.sid &&
						link.transaction === entry.transaction)
					{
					    linklistConfig.data.listCollection[colNo].splice(i, 1);
						break;
					}
				}
				else if(link.type === "hyperlink")
				{
					if(entry && link && link.name === entry.name && link.url === entry.url)
					{
						linklistConfig.data.listCollection[colNo].splice(i, 1);
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
		    $scope.currentConfigValues.id = 'ID' + colNo + linklistConfig.data.listCollection[colNo].length + $scope.currentConfigValues.name;
			$scope.currentConfigValues.type = 'hyperlink';
		}
		else if($scope.addForm[colNo] === "gui")
		{
			    $scope.currentConfigValues.id = 'ID' + colNo + linklistConfig.data.listCollection[colNo].length + $scope.currentConfigValues.sapLinkName;
				$scope.currentConfigValues.type = 'saplink';
		}
	}

	$scope.newEntry = function(colNo)
	{
		$scope.editLink = false;
		updateEntry(colNo);
		linklistConfig.data.listCollection[colNo].push($scope.currentConfigValues);
	};

	$scope.setAddForm = function(col,value)
	{
		$scope.addForm[col] = value;
		updateEntry(col);
	};

	function validateLink(){
		if ($scope.currentConfigValues.id && !$scope.currentConfigValues.name) {
			$scope.deleteEntry($scope.selectedIndex, $scope.currentConfigValues);
			$log.log('link deleted ', $scope.currentConfigValues.id);
		}
	}

	var oldValue;

	$scope.selectLink = function(col, link){
		$scope.editLink = true;
		validateLink();
		$scope.selectedIndex = col;
		oldValue = angular.copy(link);
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
		$timeout(function() {
			var container = $("#scrollList" + col)[0];
			if(container) {
				container.scrollTop = container.scrollHeight;
			}
		}, 500);
	};

	$scope.cancelAdd = function() {
		$scope.setAddForm($scope.selectedIndex,'');
		var index = linklistConfig.data.listCollection[$scope.selectedIndex].indexOf($scope.currentConfigValues);
		linklistConfig.data.listCollection[$scope.selectedIndex].splice(index, 1);
	};

	$scope.cancelEdit = function() {
		$scope.setAddForm($scope.selectedIndex,'');
		var index = linklistConfig.data.listCollection[$scope.selectedIndex].indexOf($scope.currentConfigValues);
		linklistConfig.data.listCollection[$scope.selectedIndex][index] = oldValue;
	};
}];
