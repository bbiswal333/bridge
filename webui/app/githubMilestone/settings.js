angular.module('app.githubMilestone').appGithubMilestoneSettings = ['app.githubMilestone.configservice', '$scope', '$http', function (appGithubMilestoneConfig, $scope, $http) {

	 $scope.currentConfigValues = angular.copy(appGithubMilestoneConfig);
	 $scope.error = {inputUrl:"has-success", display: "none", msg: "" };
	 $scope.searchResults = new Array;
	 

	 $scope.save_click = function () {  
	 	var copiedConfigItem = angular.copy($scope.currentConfigValues);        			//Copy the Current input values

//TODO: check internal github

	 	/*Only works with internal github!!!*/
        var api = "api/v3/";
        var html_url = copiedConfigItem.repo.html_url.slice(0,28);
        var full_name = copiedConfigItem.repo.html_url.slice(28,copiedConfigItem.repo.html_url.length);
        var api_url = html_url+api;
        appGithubMilestoneConfig.html_url = html_url;								//Set the Config Item
        appGithubMilestoneConfig.api_url = api_url;
        appGithubMilestoneConfig.repo.full_name = full_name;
        appGithubMilestoneConfig.repo.api_url = api_url +'/'+full_name;
        appGithubMilestoneConfig.repo.html_url = copiedConfigItem.repo.html_url;
        appGithubMilestoneConfig.milestoneDuration = copiedConfigItem.milestoneDuration;

    };//$scope.save_click


    $scope.show_details = _.debounce(function(){
    	
    	var copiedConfigItem = angular.copy($scope.currentConfigValues); 
    	$scope.searchResults = [];
    	parseInput(copiedConfigItem.repo.html_url);
		
    	/*
    	
    	console.log(checkURL(copiedConfigItem.repo.html_url));
    if( checkURL(copiedConfigItem.repo.html_url) ) 
    {
    	var api = "api/v3/";
        var html_url = copiedConfigItem.repo.html_url.slice(0,28);
        var full_name = copiedConfigItem.repo.html_url.slice(28,copiedConfigItem.repo.html_url.length);

    $http({
                    method: 'GET',
                    url: html_url+api+'repos/'+full_name 
                    //https://github.wdf.sap.corp/api/v3/search/repositories?q=bridge&per_page=5

        }).success(function(data, status, headers, config) {
        	$scope.repoDetails = data;
        	console.log(data);
        	$scope.error = {inputUrl:"has-success",display: "none", msg: "" };
        }).error(function(data, status, headers, config) {
        	switch (status) 
                    { 
                        case 404:                          
                            $scope.error = {inputUrl:"has-error", display: "block", msg: "Repository doesn't exist" };
                            break;
                    }
        }) */
    },50)//show_details

	function parseInput(input)
	{

		if(input != undefined || input != null || input != '') 
		{

			if(input.indexOf("github.wdf.sap.corp") == 0)
			{
				input = 'https://'+input 
			
			}

			else if( input.search(/^http[^s].*/) > -1) 
			{
				input = [input.slice(0, 4), 's', input.slice(4)].join('');
		
			}


			if (input.indexOf("https://github.wdf.sap.corp/") == 0)
			{
				var html_url = input.slice(0,28);
	        	var full_name = input.slice(28,input.length);

	        	if(full_name.indexOf("/") > 0 && full_name.indexOf("/") != full_name.length)
	        	{
	        		var parts =full_name.split("/");
		
	        		if (parts.length > 1)
	        		{
	        			search_repo(parts[0],parts[1],true);
	        		}

	        	}
	        	else if(full_name.length > 0)
	        	{
	        		search_repo('*',full_name,true );
	        		search_repo(full_name,'',true);  
	        	}
	  			
			}

			else if( input.indexOf("https://") == -1 || input.indexOf("http://") == -1)
			{
				if(input.indexOf("/") > 0 && input.indexOf("/") != input.length)
				{
					var parts =input.split("/");
		
	        		if (parts.length > 1)
	        		{
	        			search_repo(parts[0],parts[1],true);
	        		}
				}
				else if(input.length > 0)
	        	{
	        		search_repo('*',input,true );
	        		search_repo(input,'',true);  
	        	} 

			}
		}
		
	}

    function checkURL(url)
    {

    	if(url == undefined || url == null || url == '') 
    		{
    			$scope.error = {inputUrl:"has-error",display: "block", msg: "Please enter a valid" };
    			return false;
    		}
    	else if( url.indexOf("https://github.wdf.sap.corp/") != 0 && url.indexOf("https://github.com") != 0 )
    		{
    			$scope.error = {inputUrl:"has-error", display: "block", msg: "No valid Github url" };
    			return false;
    		}
    	else if( url.indexOf("https://github.com") == 0)
    		{
    			$scope.error = {inputUrl:"has-error", display: "block", msg: "Please choose a internal Github project" };
    			return false;
    		}

    	else
    	{
    		return true;
    	}
    };//checkURL



    

    
   function search_repo(user, repo, fork) {

   	//https://github.wdf.sap.corp/api/v3/search/repositories?q=+fork:true+user:Tools&per_page=8
   	var result = '';
    	$http({
                    method: 'GET',
                    url: 'https://github.wdf.sap.corp/api/v3/search/repositories?q='+repo+'+user:'+user+'+fork:'+fork+'+in:name&per_page=5'
                    //https://github.wdf.sap.corp/api/v3/search/repositories?q=bridge&per_page=5
        }).success(function(data, status, headers, config) { 
        	$scope.searchResults = _.union($scope.searchResults,data.items)
			//$scope.searchResults.push(data.items);
        }).error(function(data, status, headers, config) {});
    };//$scope.search_repo 
    
    
    $scope.show_details();
}];