angular.module('bridge.controls', ["mgcrea.ngStrap.tooltip", "bridge.service"]);
angular.module('bridge.controls').directive('bridge.table', ["$window", "$timeout", "$compile", "$rootScope", "bridgeConfig", "bridgeDataService", "uiGridConstants", "$filter", function($window, $timeout, $compile, $rootScope, bridgeConfig, bridgeDataService, uiGridConstants, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTable/bridgeTable.html',
        transclude: true,
        scope: {
            tableData: "=",
            filter: "=",
            defaultSortBy: "&?"
        },
        controller: ["$scope", function($scope){
            $scope.gridOptions = {
                columnDefs: [],
                data: 'tableData',
                paginationPageSizes: [25, 50, 75, 100],
                paginationPageSize: 50,
                rowHeight: 44,
                enableFiltering: false,
                enableGridMenu: true,
                flatEntityAccess: true,
                fastWatch: true,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.$watch("gridOptions.columnDefs", function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    bridgeConfig.store(bridgeDataService);
                    //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }
            }, true);

            function fnMatcher(actual, expected) {
                if(actual && actual.toString().toUpperCase().indexOf(expected.toUpperCase()) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.$watch("filter", function() {
                if($scope.filter !== "") {
                    $scope.filteredTableData = $filter('filter')($scope.tableData, $scope.filter, fnMatcher);
                    $scope.gridOptions.data = "filteredTableData";
                } else {
                    $scope.gridOptions.data = "tableData";
                    $scope.filteredTableData.length = 0;
                }

                //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            });

            angular.element($window).bind('resize', function() {
                $("#bridgeTable").css({height: $window.innerHeight - $("#bridgeTable").getRect().y - 120});
            });

            $timeout(function() {
                $("#bridgeTable").css({height: $window.innerHeight - $("#bridgeTable").getRect().y - 120});
            });

            this.registerColumn = function(column){
                $scope.gridOptions.columnDefs.push(column);
            };
        }]
    };
}]);
