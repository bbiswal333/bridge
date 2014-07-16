angular.module('app.jira').controller('app.jira.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'JiraBox', 'app.jira.configservice',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, JiraBox, JiraConfig) {

        $scope.$watch('JiraConfig.query', function (newVal, oldVal) {
            
            $scope.data.jira_url = 'https://sapjira.wdf.sap.corp/browse/';
             if(JiraConfig.jira === 'issuemanagement')
             {
                    $scope.data.jira_url = 'https://issuemanagement.wdf.sap.corp/browse/';
             }

            if (newVal != oldVal) { // this avoids the call of our change listener for the initial watch setup
                $scope.config = JiraConfig;               
                JiraBox.getIssuesforQuery(JiraConfig.query, JiraConfig.jira);
            }
        },true);

        $scope.filterText = '';

        $scope.data = {};
        $scope.data.filteredJiraData = [];
        $scope.data.jiraData = JiraBox.data;
        $scope.data.status = {};        

        $scope.$watch('data.jiraData', function()
        {
            var status_filter = $routeParams['status'].split('|');
        	if($scope.data && $scope.data.jiraData)
        	{
	        	//get status values and selected ones
                var all_status = [];
                var status = {};
	        	for(var i = 0; i < $scope.data.jiraData.length; i++ )
	        	{
                    if( !(all_status.indexOf($scope.data.jiraData[i].status) > -1 ))
                    {
                        all_status.push($scope.data.jiraData[i].status);
                    }
	        	}

                all_status.sort();
                
                for(var i = 0; i < all_status.length; i++ )
                {
                    if(status_filter.indexOf(all_status[i]) > -1)
                        status[all_status[i]] = {"active":true};
                    else
                        status[all_status[i]] = {"active":false};
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
        }

        $scope.$parent.titleExtension = " - Jira Details";

        if (JiraConfig.isInitialized == false) {
            JiraConfig.initialize($routeParams['appId']);
            JiraBox.getIssuesforQuery(JiraConfig.query);
        }

}]);