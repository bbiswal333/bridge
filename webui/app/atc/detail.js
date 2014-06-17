angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice', 
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {
    
    $scope.$parent.titleExtension = " - ATC Details";

    $scope.atcData = {};
    $scope.atcData.detailsData = [];    
    $scope.data = {};
    $scope.data.status = [];     

    $scope.atcData = appAtcData;          
    $scope.atcData.tableData = [];

    if (appAtcConfig.isInitialized == false) {
        appAtcConfig.initialize($routeParams['appId']);
    }
    $scope.atcData.getDetailsForConfig(appAtcConfig, $scope);

    $scope.$watch('atcData.detailsData', function () 
    {            
        if($scope.atcData.detailsData.length > 0)
        {
            var status_filter = $routeParams['prio'].split('|'); 
            var status = [];
            $scope.data.status = [];  
            for(var i = 1; i <= 4; i++)
            {
                if(status_filter.indexOf(i + "") > -1)
                {
                    status.push({"name":i,"active":true});   
                }
                else
                {
                    status.push({"name":i,"active":false});   
                }    
            }
            $scope.data.status = status;         
        }
        
    }, true);

    $scope.$watch('data.status', function()
    {
        $scope.atcData.tableData = [];
        if($scope.atcData && $scope.atcData.detailsData)
        {
            for(var i = 0; i < $scope.atcData.detailsData.length; i++ )
            {
                for(var j = 0; j < $scope.data.status.length; j++)
                {
                    if($scope.atcData.detailsData[i].CHECK_MSG_PRIO == $scope.data.status[j].name && $scope.data.status[j].active)
                    {
                        $scope.atcData.tableData.push($scope.atcData.detailsData[i]);
                    }
                }
            }
        }
    }, true);


    var cellTemplate = '<div class="ngCellText table-cell" ng-class="col.colIndex()" >{{row.getProperty(col.field)}}</div>';    

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
            {field:'CHECK_MSG_PRIO', displayName:'Prio', width:'20%', cellTemplate: cellTemplate},                
            {field:'CHECK_SYSTEM', displayName:'System', width:'20%', cellTemplate: cellTemplate},
            {field:'CHECK_DESCRIPTION', displayName:'Check', width:'20%', cellTemplate: cellTemplate},
            {field:'CHECK_MESSAGE', displayName:'Check Message', width:'20%', cellTemplate: cellTemplate},
            {field:'OBJ_NAME', displayName:'Object', width:'20%', cellTemplate: cellTemplate},
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    }       
}]);