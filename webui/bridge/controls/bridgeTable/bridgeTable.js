angular.module('bridge.controls', ["mgcrea.ngStrap.tooltip", "bridge.service"]);
angular.module('bridge.controls').directive('bridge.table', ["$window", "$timeout", "$compile", "$rootScope", "bridgeConfig", "bridgeDataService", "uiGridConstants", "$filter", function($window, $timeout, $compile, $rootScope, bridgeConfig, bridgeDataService, uiGridConstants, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTable/bridgeTable.html',
        transclude: true,
        scope: {
            tableData: "=",
            filter: "=",
            defaultSortBy: "&?",
            tableSettings: "="
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
                    $scope.gridApi.grid.registerRowsProcessor($scope.filterFn, 200);

                    if($scope.tableSettings) {
                        $scope.gridApi.saveState.restore($scope, $scope.tableSettings.state);
                    }
                },
                saveOrder: true,
                saveWidth: true,
                saveVisible: true,
                saveGrouping: false,
                saveGroupingExpandedStates: false,
                savePinning: true,
                saveScroll: false,
                saveSelection: false,
                saveSort: true,
                saveTreeView: false,
                saveFocus: false,
                saveFilter: false
            };

            var initialWatchCalled = false;
            $scope.$watch("gridOptions.columnDefs", function(newValue, oldValue) {
                if(!initialWatchCalled){
                    initialWatchCalled = true;
                    return;
                }

                if(newValue !== oldValue) {
                    $scope.tableSettings.state = $scope.gridApi.saveState.save();

                    bridgeConfig.store(bridgeDataService);
                    //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }
            }, true);

            $scope.filterFn = function(renderableRows){
                var matcher = new RegExp($scope.filter, "gi");
                renderableRows.forEach(function(row) {
                    var match = false;
                    for(var attr in row.entity) {
                        if (row.entity[attr].toString().match(matcher)){
                            match = true;
                        }
                    }
                    if (!match){
                        row.visible = false;
                    }
                });
                return renderableRows;
            };

            $scope.$watch("filter", function() {
                $scope.gridApi.grid.refresh();

                //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            });

            angular.element($window).bind('resize', function() {
                $("#bridgeTable").css({height: $window.innerHeight - $("#bridgeTable").getRect().y - 120});
            });

            $timeout(function() {
                $("#bridgeTable").css({height: $window.innerHeight - $("#bridgeTable").getRect().y - 120});
            });

            this.registerColumn = function(column){
                if(!column.columnOrder) {
                    column.columnOrder = $scope.gridOptions.columnDefs.length + 1;
                }

                $scope.gridOptions.columnDefs.push(column);
                $scope.gridOptions.columnDefs.sort(function(a, b) {
                    if(a.columnOrder > b.columnOrder) {
                        return 1;
                    } else if(a.columnOrder < b.columnOrder) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            };
        }]
    };
}]);
