angular.module('app.jira').controller('app.jira.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'JiraBox', 'app.jira.configservice',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, JiraBox, JiraConfig) {
        var config = JiraConfig.getConfigInstanceForAppId("app.jira-" + $routeParams);
        var jiraBox = JiraBox.getInstanceForAppId("app.jira-" + $routeParams.instanceNumber, config.getConfig().jira);

        $scope.$watch('config.query', function (newVal, oldVal) {


            $scope.data.jira_url = 'https://sapjira.wdf.sap.corp/browse/';
             if(config.jira === 'issuemanagement')
             {
                $scope.data.jira_url = 'https://issuemanagement.wdf.sap.corp/browse/';
             }
			if(config.jira === 'jtrack')
			{
				$scope.data.jira_url = 'https://jtrack.wdf.sap.corp/browse/';
			}
            if(config.jira === 'issues')
            {
                $scope.data.jira_url = 'https://issues.wdf.sap.corp/browse/';
            }
            if(config.jira === 'successfactors')
            {
                $scope.data.jira_url = 'https://jira.successfactors.com/browse/';
            }

            if (newVal !== oldVal) { // this avoids the call of our change listener for the initial watch setup
                $scope.config = config.getConfig();
                jiraBox.getIssuesforQuery(config.getConfig().query);
            }
        },true);

        $scope.data = {};
        $scope.data.filteredJiraData = [];
        $scope.data.jiraData = jiraBox.data;
        $scope.data.status = {};

        $scope.$watch('data.jiraData', function()
        {
            var status_filter = $routeParams.status.split('|');
        	if($scope.data && $scope.data.jiraData)
        	{
	        	//get status values and selected ones
                var all_status = [];
                var status = {};
                var i = 0;
	        	for(i = 0; i < $scope.data.jiraData.length; i++ )
	        	{
                    if( !(all_status.indexOf($scope.data.jiraData[i].status) > -1 ))
                    {
                        all_status.push($scope.data.jiraData[i].status);
                    }
	        	}

                all_status.sort();

                for(i = 0; i < all_status.length; i++ )
                {
                    if(status_filter.indexOf(all_status[i]) > -1) {
                        status[all_status[i]] = {"active":true};
                    } else {
                        status[all_status[i]] = {"active":false};
                    }
                }
                $scope.data.status = status;
        	}
        },true);

        $scope.$watch('data.status', function()
        {
            $scope.data.filteredJiraData = [];
            if($scope.data && $scope.data.jiraData)
            {
                $scope.data.jiraData.forEach(function (jiraEntry){
                    if($scope.data.status[jiraEntry.status].active)
                    {
                        $scope.data.filteredJiraData.push(jiraEntry);
                    }
                });
            }
        }, true);

        $scope.getStatusArray = function(){
            return Object.keys($scope.data.status);
        };

        $scope.$parent.titleExtension = " - Jira Details";
}]);
