angular.module('app.jira').controller('app.jira.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'JiraBox', 'app.jira.configservice',
    function Controller($scope, $http, $filter, $route, $routeParams, ngTableParams, JiraBox, JiraConfig) {

        $scope.$watch('JiraConfig.query', function() {
        	$scope.config = JiraConfig;
            JiraBox.getIssuesforQuery($scope);            
        },true);

        $scope.data = {};
        $scope.data.filteredJiraData = [];
        $scope.data.status = [];

        $scope.$watch('data.jiraData', function()
        {
            var status_filter = $routeParams['status'].split('|');
        	if($scope.data && $scope.data.jiraData)
        	{
	        	//get status values and selected ones
                var all_status = [];
                var status = [];
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
                    {
                        status.push({"name":all_status[i],"active":true});
                    }
                    else
                    {
                        status.push({"name":all_status[i],"active":false});   
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
                for(var i = 0; i < $scope.data.jiraData.length; i++ )
                {
                    for(var j = 0; j < $scope.data.status.length; j++)
                    {
                        if($scope.data.jiraData[i].status == $scope.data.status[j].name && $scope.data.status[j].active)
                        {
                            $scope.data.filteredJiraData.push($scope.data.jiraData[i]);
                        }
                    }
                }
            }
        }, true);


        $scope.$parent.titleExtension = " - Jira Details"; 

        var cellTemplate = '<div class="ngCellText table-cell" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>';
        var issuecellTemplate = 
            '<div class="ngCellText table-cell" ng-class="col.colIndex()"><a target="_blank" href="https://sapjira.wdf.sap.corp/browse/{{row.entity.key}}">{{row.entity.summary}}</a></div>';


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