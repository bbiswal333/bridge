angular.module('bridge.app').directive('bridge.table', function() {
    return {
        restrict: 'E',
        templateUrl: 'bridge/controls/bridgeTable/bridgeTable.html',
        transclude: true,
        scope: {
            tableData: "=",
            filter: "&"
        },
        controller: ["$scope", function($scope){
            var infinityLimitStep = 50;
            $scope.infinityLimit = infinityLimitStep;
            $scope.reverse = true;
            $scope.predicate = null;

            $scope.zebraCell = function (index) {
                return 'row' + index % 2;
            };
            $scope.increaseInfinityLimit = function () {
                $scope.infinityLimit += infinityLimitStep;
            };
            $scope.sort = function (selector) {
                if (selector !== undefined) {
                    $scope.predicate = selector;
                    $scope.reverse = !$scope.reverse;
                }
            };

            $scope.parentScope = $scope.$parent;

            $scope.getColumnHeaderClasses = function(column){
                var classesString = column.columnSizeClass;
                if (column.orderBy !== undefined) {
                    classesString += " clickable";
                }

                return classesString;
            };

            $scope.columns = [];

            this.registerColumn = function(column){
                var existingColumn = _.find($scope.columns, {"id": column.id});
                if (existingColumn === undefined) {
                    $scope.columns.push(column);
                    return column;
                } else {
                    return existingColumn;
                }
            };
        }]
    };
});
