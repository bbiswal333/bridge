angular.module('app.githubMilestone').appGithubMilestoneSettings = ['app.githubMilestone.configservice', '$scope', '$http', function (appGithubMilestoneConfig, $scope, $http) {
     var config = appGithubMilestoneConfig.getConfigInstanceForAppId($scope.boxScope.metadata.guid);
	 $scope.currentConfigValues = angular.copy(config);
	 $scope.error = {inputUrl:"has-success", display: false, msg: "" };
	 $scope.searchResults = [];


    function isWeekDuration(sMilestoneDuration){
        /*eslint-disable eqeqeq*/
        if (sMilestoneDuration == "7" ||
            sMilestoneDuration == "14" ||
            sMilestoneDuration == "21" ||
            sMilestoneDuration == "28") {

            return true;
        }
        /*eslint-enable eqeqeq*/

        return false;
    }
    $scope.customSelected = !isWeekDuration($scope.currentConfigValues.milestoneDuration);


     function search_repo(limit)
     {
        var repo = "";
        switch (arguments.length){
        case  2:
            repo = arguments[1];
                    return $http({
                    method: 'GET',
                    url: 'https://github.wdf.sap.corp/api/v3/search/repositories?q=' + repo + 'fork:' + $scope.currentConfigValues.fork + '+in:name&per_page=' + limit,
                    headers: {'Accept': 'application/vnd.github.preview+json'},
                    withCredentials: false
                        }).then(function(res){
                             var results = [];
                                angular.forEach(res.data.items, function(item){
                                        results.push(item.html_url);
                                });

                        return results;
                        });
        case 3:
            var user = arguments[1];
            repo = arguments[2];

            return $http({
                method: 'GET',
                url: 'https://github.wdf.sap.corp/api/v3/users/' + user,
                withCredentials: false
            }).then(function(res) {
                if(res.status === 200) {
                    return $http({
                        method: 'GET',
                        url: 'https://github.wdf.sap.corp/api/v3/search/repositories?q=' + repo + '+user:' + user + '+fork:' + $scope.currentConfigValues.fork + '+in:name&per_page=' + limit,
                        headers: {'Accept': 'application/vnd.github.preview+json'},
                        withCredentials: false
                    }).then(function(response){
                        var results = [];
                        angular.forEach(response.data.items, function(item){
                            results.push(item.html_url);
                        });
                        return results;
                    });
                }
            });
        }
    }

    function parseInput(input)
    {
        if(input !== undefined && input !== null && input !== '')
        {
            var parts = [];
            if(input.indexOf("github.wdf.sap.corp") === 0)
            {
                input = 'https://' + input;
            }
            else if( input.search(/^http[^s].*/) > -1)
            {
                input = [input.slice(0, 4), 's', input.slice(4)].join('');
            }
            if (input.indexOf("https://github.wdf.sap.corp/") === 0)
            {
                //var html_url = input.slice(0,28);
                var full_name = input.slice(28,input.length);
                if(full_name.indexOf("/") > 0)
                {
                    parts = full_name.split("/");
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
            else if( input.indexOf("https://") === -1 || input.indexOf("http://") === -1)
            {
                if(input.indexOf("/") > 0)
                {
                    parts = input.split("/");
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
    }

	 $scope.save_click = function () {

	 	var copiedConfigItem = angular.copy($scope.currentConfigValues);        			//Copy the Current input values
        var api = "api/v3/";
        var html_url = copiedConfigItem.repo.html_url.slice(0,28);
        var full_name = copiedConfigItem.repo.html_url.slice(28,copiedConfigItem.repo.html_url.length);
        var api_url = html_url + api;
        config.html_url = html_url;								//Set the Config Item
        config.api_url = api_url;
        config.repo.full_name = full_name;
        config.repo.api_url = api_url + '/' + full_name;
        config.repo.html_url = copiedConfigItem.repo.html_url;
        config.milestoneDuration = copiedConfigItem.milestoneDuration;
        config.fork = copiedConfigItem.fork;

        $scope.$emit('closeSettingsScreen');
    };//$scope.save_click

    $scope.getTypeaheadData = function() { /* eslint no_undef */
        var copiedConfigItem = angular.copy($scope.currentConfigValues);
        //$scope.searchResults = [];
        if(copiedConfigItem.repo.html_url !== undefined && copiedConfigItem.repo.html_url !== null && copiedConfigItem.repo.html_url !== '')
        {
            return parseInput(copiedConfigItem.repo.html_url);
        }
    };
}];
