angular.module('bridge.controls', ["mgcrea.ngStrap.tooltip", "bridge.service"]);
angular.module('bridge.controls').directive('bridge.table', ["$window", "$timeout", "$compile", "$rootScope", "bridgeConfig", "bridgeDataService", "uiGridConstants", function($window, $timeout, $compile, $rootScope, bridgeConfig, bridgeDataService, uiGridConstants) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTable/bridgeTable.html',
        transclude: true,
        scope: {
            tableData: "=",
            filter: "&",
            defaultSortBy: "&?"
        },
        controller: ["$scope", function($scope){
            $scope.gridOptions = {
                columnDefs: [],
                data: 'tableData',
                paginationPageSizes: [25, 50, 75, 100],
                paginationPageSize: 50,
                rowHeight: 44,
                enableFiltering: true,
                enableGridMenu: true,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.$watch("gridOptions", function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    bridgeConfig.store(bridgeDataService);
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }
            }, true);

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
