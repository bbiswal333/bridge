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
            columnOrder: '='
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
                cellTemplate: element.html() ? "<div>" + element.html() + "</div>" : undefined,
                cellClass: "bridgeTableCell",
                field: $scope.orderBy,
                /*orderBy: $scope.orderBy(),*/
                visible: $scope.visible
                /*columnOrder: $scope.columnOrder*/
            };

            $scope.columnData = tableController.registerColumn($scope.columnData);
        }
    };
});
