angular.module('bridge.controls').directive('bridge.tableColumn', [function() {
    function stringComparison(a, b) {
        if(a.toUpperCase() > b.toUpperCase()) {
            return 1;
        } else if(a.toUpperCase() < b.toUpperCase()) {
            return -1;
        } else {
            return 0;
        }
    }

    function comparison(a, b) {
        if(a > b) {
            return 1;
        } else if(a < b) {
            return -1;
        } else {
            return 0;
        }
    }

    function getValue(oObject, sProp) {
        if(sProp.indexOf("()") === sProp.length - 2) { //Will become an issue when we start to pass in parameters... need to handle when it becomes urgent
            return oObject[sProp.replace("()", "")].call();
        } else {
            return oObject[sProp];
        }
    }

    function getValueAlongPath(sPath, oObject) {
        var aPath = sPath.split(".");
        var currentValue = oObject;
        for(var i = 0, length = aPath.length; i < length; i++) {
            try {
                if(i === length - 1) {
                    currentValue = getValue(currentValue, aPath[i]);
                } else {
                    currentValue = getValue(currentValue, aPath[i]);
                }
            } catch(e) {
                return undefined;
            }
        }
        return currentValue;
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
            groupTemplate: '@',
            field: '@'
        },
        controller: function() {
        },
        link: function ($scope, element, attrs, tableController) {
            if ($scope.visible === undefined || $scope.visible === "true"){
                $scope.visible = true;
            } else if ($scope.visible === "false"){
                $scope.visible = false;
            }

            $scope.columnData = {
                name: $scope.header().replace(/ /g,''),
                displayName: $scope.header(),
                width: $scope.columnWidth,
                cellTemplate: element.html() ? '<div><div ng-if="col.grouping.groupPriority >= 0 && col.grouping.groupPriority === row.treeLevel">' + ($scope.groupTemplate ? $scope.groupTemplate : '{{MODEL_COL_FIELD CUSTOM_FILTERS}}') + '</div><div ng-if="col.grouping.groupPriority === undefined && row.groupHeader !== true">' + element.html() + "</div></div>" : undefined,
                cellClass: "bridgeTableCell",
                groupingShowAggregationMenu: false,
                field: $scope.field,
                customTreeAggregationFinalizerFn: function( aggregation, row ) {
                    row.groupHeaderField = $scope.orderBy;
                    if(aggregation.type === "count" && aggregation.groupVal) {
                        row.groupCount = aggregation.value;
                        row.groupVal = aggregation.groupVal;
                        aggregation.rendered = aggregation.groupVal + " (" + aggregation.value + ")";
                    }
                },
                sortingAlgorithm: $scope.orderBy ? function(a, b, rowA, rowB) {
                    var originalA = a, originalB = b;
                    if(rowA && rowB) {
                        a = getValueAlongPath($scope.orderBy, rowA.entity);
                        b = getValueAlongPath($scope.orderBy, rowB.entity);
                    }
                    if(!a && !b) {
                        a = originalA;
                        b = originalB;
                    }
                    if(typeof a === "string" && typeof b === "string") {
                        return stringComparison(a, b);
                    } else {
                        return comparison(a, b);
                    }
                } : undefined,
                visible: $scope.visible,
                columnOrder: $scope.columnOrder
            };

            $scope.columnData = tableController.registerColumn($scope.columnData);
        }
    };
}]);
