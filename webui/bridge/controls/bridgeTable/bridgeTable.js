angular.module('bridge.controls', [ "mgcrea.ngStrap.tooltip", "bridge.service", "ui.grid", "ui.grid.pagination", "ui.grid.cellNav", "ui.grid.resizeColumns",
                                    "ui.grid.pinning", "ui.grid.selection", "ui.grid.moveColumns", "ui.grid.grouping", "ui.grid.saveState"]);
angular.module('bridge.controls').directive('bridge.table', ["$window", "$timeout", "$compile", "$rootScope", "bridgeConfig", "bridgeDataService", function($window, $timeout, $compile, $rootScope, bridgeConfig, bridgeDataService) {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTable/bridgeTable.html',
        transclude: true,
        scope: {
            tableData: "=",
            defaultSortBy: "&?",
            tableSettings: "="
        },
        controller: ["$scope", function($scope){
            if($scope.tableSettings && $scope.tableSettings.state) {
                var initialTableSettings = $scope.tableSettings.state;
            }

            function persistGridOptions() {
                $timeout(function() {
                    $scope.tableSettings.state = $scope.gridApi.saveState.save();
                    bridgeConfig.store(bridgeDataService);
                });
            }

            $scope.gridOptions = {
                columnDefs: [],
                data: 'tableData',
                paginationPageSizes: [25, 50, 75, 100],
                paginationPageSize: 50,
                rowHeight: 44,
                enableFiltering: false,
                enableGridMenu: true,
                flatEntityAccess: false,
                fastWatch: true,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.grid.registerRowsProcessor($scope.filterFn, 200);

                    $timeout(function() {
                        if(initialTableSettings) {
                            $scope.tableSettings.state = initialTableSettings;
                            $scope.gridApi.saveState.restore($scope, initialTableSettings);
                        }
                        $timeout(function() {
                            $scope.gridApi.grouping.on.groupingChanged($scope, persistGridOptions);
                            $scope.gridApi.core.on.columnVisibilityChanged($scope, persistGridOptions);
                            $scope.gridApi.colMovable.on.columnPositionChanged($scope, persistGridOptions);
                            $scope.gridApi.pinning.on.columnPinned($scope, persistGridOptions);
                        });
                    });
                },
                saveOrder: true,
                saveWidth: true,
                saveVisible: true,
                saveGrouping: true,
                saveGroupingExpandedStates: false,
                savePinning: true,
                saveScroll: false,
                saveSelection: false,
                saveSort: true,
                saveTreeView: false,
                saveFocus: false,
                saveFilter: false
            };

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
            });

            function resizeTable(){
                var tableRect = $("#bridgeTable").getRect();

                if (tableRect !== null) {
                    $("#bridgeTable").css({height: $window.innerHeight - tableRect.y - 120});
                }
            }

            angular.element($window).bind('resize', function() {
                resizeTable();
            });

            $timeout(function() {
                resizeTable();
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
