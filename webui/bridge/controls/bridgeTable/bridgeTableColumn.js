angular.module('bridge.controls').directive('bridge.tableColumn', function() {
    function columnSizeClassToWidth() {

    }

    return {
        restrict: "E",
        templateUrl: 'bridge/controls/bridgeTable/bridgeTableColumn.html',
        require: "^bridge.table",
        transclude: true,
        replace: true,
        scope: {
            header: '&',
            columnId: '&',
            columnWidth: '=',
            orderBy:  '@',
            visible: '=?',
            customStyle: '@',
            columnOrder: '=',
            groupTemplate: '@'
        },
        controller: function($scope) {
        },
        link: function ($scope, element, attrs, tableController) {
            if ($scope.visible === undefined || $scope.visible === "true"){
                $scope.visible = true;
            } else if ($scope.visible === "false"){
                $scope.visible = false;
            }

            $scope.columnData = {
                /*id: $scope.columnId(),*/
                name: $scope.header(),
                width: $scope.columnWidth,
                cellTemplate: element.html() ? '<div><div ng-if="col.grouping.groupPriority >= 0 && col.grouping.groupPriority === row.treeLevel">' + ($scope.groupTemplate ? $scope.groupTemplate : '{{MODEL_COL_FIELD CUSTOM_FILTERS}}') + '</div><div ng-if="col.grouping.groupPriority === undefined && row.groupHeader !== true">' + element.html() + "</div></div>" : undefined,
                cellClass: "bridgeTableCell",
                groupingShowAggregationMenu: false,
                field: $scope.orderBy,
                customTreeAggregationFinalizerFn: function( aggregation, row ) {
                    row.groupHeaderField = $scope.orderBy;
                    if(aggregation.type === "count" && aggregation.groupVal) {
                        row.groupCount = aggregation.value;
                        row.groupVal = aggregation.groupVal;
                        aggregation.rendered = aggregation.groupVal + " (" + aggregation.value + ")";
                    }
                },
                /*orderBy: $scope.orderBy(),*/
                visible: $scope.visible
                /*columnOrder: $scope.columnOrder*/
            };

            $scope.columnData = tableController.registerColumn($scope.columnData);
        }
    };
});
