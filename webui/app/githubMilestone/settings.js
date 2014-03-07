angular.module('app.githubMilestone').appGithubMilestoneSettings = ['app.githubMilestone.configservice', '$scope', '$http', 'bridgeConfig', function (appGithubMilestoneConfig, $scope, $http, bridgeConfig) {

	 $scope.currentConfigValues = angular.copy(appGithubMilestoneConfig);
	 $scope.error = {inputUrl:"has-success", display: "none", msg: "" };
	 $scope.searchResults = new Array;
	 
	 $scope.save_click = function () {  

	 	var copiedConfigItem = angular.copy($scope.currentConfigValues);        			//Copy the Current input values
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

        bridgeConfig.modalInstance.close();
    };//$scope.save_click

    $scope.getTypeaheadData =_.throttle(function() {
        var copiedConfigItem = angular.copy($scope.currentConfigValues); 
        //$scope.searchResults = [];
        if(copiedConfigItem.repo.html_url != undefined && copiedConfigItem.repo.html_url != null && copiedConfigItem.repo.html_url != '')
        {
             //console.log(copiedConfigItem.repo.html_url);
        return parseInput(copiedConfigItem.repo.html_url);
      
        }
    },250) //$scope.getTypeaheadData



	function parseInput(input)
	{
		if(input != undefined && input != null && input != '') 
		{
			if(input.indexOf("github.wdf.sap.corp") == 0)
			{
				input = 'https://'+input;
			}
			else if( input.search(/^http[^s].*/) > -1) 
			{
				input = [input.slice(0, 4), 's', input.slice(4)].join('');
			}
			if (input.indexOf("https://github.wdf.sap.corp/") == 0)
			{
				var html_url = input.slice(0,28);
	        	var full_name = input.slice(28,input.length);
	        	if(full_name.indexOf("/") > 0)
	        	{
	        		var parts =full_name.split("/");
	        		if (parts.length > 1)
	        		{    
	        			return search_repo(12,parts[0],parts[1]);
	        		}
	        	}
	        	else if(full_name.length > 0)
	        	{
	        		return search_repo(12,full_name);  
	        	}	
		    }
			else if( input.indexOf("https://") == -1 || input.indexOf("http://") == -1)
			{
				if(input.indexOf("/") > 0)
				{
					var parts =input.split("/");
	        		if (parts.length > 1)
	        		{
	        			return search_repo(12,parts[0],parts[1]);
	        		}    
				}
				else if(input.length > 0 )
	        	{
	        		return search_repo(12,input); 
	        	} 
			}
		}
	};//parseInput

    
   function search_repo(limit) {
   switch (arguments.length){
        case  2:
            repo = arguments[1];
                    return $http({
                    method: 'GET',
                    url: 'https://github.wdf.sap.corp/api/v3/search/repositories?q='+repo+'fork:'+$scope.currentConfigValues.fork+'+in:name&per_page='+limit,
                    withCredentials: false
                    //https://github.wdf.sap.corp/api/v3/search/repositories?q=bridge&per_page=5
                        }).then(function(res){
                             var results = [];
                                angular.forEach(res.data.items, function(item){
                                        results.push(item.html_url);
                                });

                        return results;
                        });
            break;

        case 3:
            var user = arguments[1];
            var repo = arguments[2];

            return $http({
                            method: 'GET',
                            url: 'https://github.wdf.sap.corp/api/v3/users/'+user,
                            withCredentials: false
                        }).then(function(res) { 
                                if(res.status == 200)
                                {
                                    return $http({
                                                method: 'GET',
                                                url: 'https://github.wdf.sap.corp/api/v3/search/repositories?q='+repo+'+user:'+user+'+fork:'+$scope.currentConfigValues.fork+'+in:name&per_page='+limit,
                                                withCredentials: false
                                                }).then(function(res){
                                                                        var results = [];
                                                                        angular.forEach(res.data.items, function(item){
                                                                        results.push(item.html_url);
                                                                                                                    });
                                                        return results;
                                                    });
                                }
                                                })
            break;
            }
   
    };//$scope.search_repo 
    
    
}];

// /* Workaround */
// angular.module('app.githubMilestone').factory("testGithubSettings", function () {
//     return angular.module('app.githubMilestone').appGithubMilestoneSettings;
// });
