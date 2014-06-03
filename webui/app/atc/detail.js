angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice', 
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {
    
    var atcConfig = appAtcConfig;
    $scope.$parent.titleExtension = " - ATC Details";

    $scope.atcData = {};
    $scope.atcData.detailsData = [];
    $scope.atcData.tableData = [];   

    $scope.atcData = appAtcData;    
    $scope.atcData.getDetailsForConfig(atcConfig, $scope);    

    $scope.$watch('atcData.detailsData', function () 
    {
        if ($scope.atcData !== undefined) 
        {       
            $scope.atcData.tableData = [];     
            for(var i = 0; i < $scope.atcData.detailsData.length; i++)
            {
                if($routeParams['prio'] == $scope.atcData.detailsData[i].CHECK_MSG_PRIO && $scope.atcData.tableData.length < 50)
                {
                    $scope.atcData.tableData.push($scope.atcData.detailsData[i]);
                }
            }            
        }
    });


    var cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" style="border:2px solid white;height:40px">{{row.getProperty(col.field)}}</div>';    

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