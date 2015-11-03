angular.module('bridge.controls').directive('bridge.tableColumn', function() {
    return {
        restrict: "E",
        templateUrl: 'bridge/controls/bridgeTable/bridgeTableColumn.html',
        require: "^bridge.table",
        transclude: true,
        scope: {
            header: '&',
            columnId: '&',
            columnSizeClass: '&',
            orderBy:  '&?',
            visible: '=?',
            customStyle: '@'
        },
        link: function ($scope, element, attrs, tableController) {
            if ($scope.visible === undefined || $scope.visible === "true"){
                $scope.visible = true;
            } else if ($scope.visible === "false"){
                $scope.visible = false;
            }

            $scope.$watch("columnData", function(){
                $scope.visible = $scope.columnData.visible;
            }, true);

            $scope.columnData = {
                id: $scope.columnId(),
                header: $scope.header(),
                columnSizeClass: $scope.columnSizeClass(),
                orderBy: $scope.orderBy(),
                visible: $scope.visible
            };

            $scope.columnData = tableController.registerColumn($scope.columnData);
        }
    };
});
