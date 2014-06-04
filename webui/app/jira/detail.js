angular.module('app.jira').controller('app.jira.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'JiraBox', 'app.jira.configservice',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, JiraBox, JiraConfig) {

        $scope.$watch('JiraConfig.query', function() {
        	$scope.config = JiraConfig;
            JiraBox.getIssuesforQuery($scope);            
        },true);

        $scope.$watch('data.jiraData', function()
        {
            var status_filter = $routeParams['status'].split('|');
        	if($scope.data && $scope.data.jiraData)
        	{
	        	$scope.data.filteredJiraData = [];
	        	for(var i = 0; i < $scope.data.jiraData.length; i++ )
	        	{
	        		if(status_filter.indexOf($scope.data.jiraData[i].status) > -1)
	        		{
	        			$scope.data.filteredJiraData.push($scope.data.jiraData[i]);
	        		}
	        	}
        	}
        },true);

        $scope.$parent.titleExtension = " - Jira Details"; 

        $scope.data = {};
        $scope.data.filteredJiraData = [];

        var cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" style="border:2px solid white;height:40px">{{row.getProperty(col.field)}}</div>';
        var issuecellTemplate = 
            '<div class="ngCellText" ng-class="col.colIndex()" style="border:2px solid white;height:40px"><a target="_blank" href="https://sapjira.wdf.sap.corp/browse/{{row.entity.key}}">{{row.entity.summary}}</a></div>';


        $scope.filterOptions = {
            filterText: ''
        };

        $scope.gridOptions = {                        
            enableColumnReordering:true,
            enableRowSelection:false,            
            rowHeight: 40,
            showFilter:false,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {field:'summary', displayName:'Summary', width:'20%', cellTemplate: issuecellTemplate},                
                {field:'description', displayName:'Description', width:'70%', cellTemplate: cellTemplate},
                {field:'status', displayName:'Status', width:'10%', cellTemplate: cellTemplate}                      
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
        }       
}]);