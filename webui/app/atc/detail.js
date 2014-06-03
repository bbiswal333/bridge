angular.module('app.atc').controller('app.atc.detailcontroller', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.atc.configservice', 'app.atc.dataservice', 
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, appAtcConfig, appAtcData) {
    
    var atcConfig = appAtcConfig;
    $scope.$parent.titleExtension = " - ATC Details";

    $scope.atcData = appAtcData;    
    $scope.atcData.getDetailsForConfig(atcConfig, $scope);

    $scope.$watch('atcData.detailsData', function () {
        if ($scope.atcData !== undefined && $scope.atcData.detailsData.length > 0) {            
            //$scope.tableParams.total($scope.atcData.detailsData.length);
            console.log($scope.atcData.detailsData);
            $scope.tableParams.reload();
        }
    });

    /*$scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            CHECK_MSG_PRIO: 'asc'     // initial sorting
        },
    }, {
        total: $scope.atcDetails == undefined ? 0 : $scope.atcDetails.length, // length of data
        getData: function ($defer, params) {
            var orderedData = params.sorting() ?
                                $filter('orderBy')($scope.atcData.detailsData, params.orderBy()) :
                                $scope.atcData.detailsData;

            if (orderedData != undefined) {
                orderedData = params.filter() ?
                                $filter('filter')(orderedData, params.filter()) :
                                orderedData;

                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    });*/

    //$scope.data = {};
    //$scope.data.filteredJiraData = [];

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
            {field:'summary', displayName:'Issue', width:'20%', cellTemplate: issuecellTemplate},                
            {field:'description', displayName:'Description', width:'70%', cellTemplate: cellTemplate},
            {field:'status', displayName:'Status', width:'10%', cellTemplate: cellTemplate}                      
        ],
        plugins: [new ngGridFlexibleHeightPlugin()]
    }       
}]);