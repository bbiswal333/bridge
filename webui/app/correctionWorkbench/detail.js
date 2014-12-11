angular.module('app.correctionWorkbench').controller('app.correctionWorkbench.detailController', ['$scope', '$http', '$window', '$templateCache', 'app.correctionWorkbench.workbenchData','$routeParams', 'employeeService',
        function Controller($scope, $http, $window, $templateCache, workbenchData, $routeParams, employeeService) {

        $scope.filterText = '';
        $scope.categories = workbenchData.categories;
        $scope.workbenchData = workbenchData.workbenchData;
        $scope.categoryMap = {};
        $scope.detailForNotifications = ($routeParams.calledFromNotification === 'true');

        function update_table()
        {
            $scope.tableData = [];

            if(!$scope.getCategoryArray().length) {
                var category_filter = $routeParams.category.split('|');

                $scope.categories.forEach(function (category){
                    if(category_filter.indexOf(category.name) > -1)
                    {
                        $scope.categoryMap[category.name] = {"active":true};
                    }
                    else
                    {
                        $scope.categoryMap[category.name] = {"active":false};
                    }
                });
            }

            if ($scope.detailForNotifications === false) {
                $scope.categories.forEach(function (category) {
                    if ($scope.categoryMap[category.name] && $scope.categoryMap[category.name].active) {
                        workbenchData.workbenchData[category.targetArray].forEach(function (workbenchItem) {
                            $scope.tableData.push(workbenchItem);
                        });
                    }
                });
            } else {
                workbenchData.correctionRequestsFromNotifications.forEach(function (workbenchItem) {
                    $scope.tableData.push(workbenchItem);
                });
            }
        }

        $scope.$watch('categories', function ()
        {
            update_table();
        }, true);

        $scope.$watch('categoryMap', function()
        {
            update_table();
        }, true);

        $scope.userClick = function(employeeDetails){
            employeeService.showEmployeeModal(employeeDetails);
        };

        function enhanceMessage(workbenchItem)
        {
            if(workbenchItem.reporter._alternateId !== "")
            {
                employeeService.getData(workbenchItem.reporter._alternateId).then(function(employee){
                    workbenchItem.reporterEnhanced = employee;
                });
            }
        }

        function enhanceAllMessages()
        {
            angular.forEach(workbenchData.workbenchData.correctionRequestsPlannedForTesting, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsInProcess, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsTesting, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsTestedOk, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsFromNotifications, function (workbenchItem) { enhanceMessage(workbenchItem); });
        }

        $scope.getCategoryArray = function(){
            return Object.keys($scope.categoryMap);
        };

        $scope.zoom = function(index, event){
            $scope.zoomIndex = index;
            if (event) {
                $scope.zoomImg = event.currentTarget;
            }
        };
        if (workbenchData.isInitialized.value === false && $scope.detailForNotifications === false) {
            var promise = workbenchData.initialize();

            promise.then(function success() {
                enhanceAllMessages();
            });
        } else {
            enhanceAllMessages();
        }
}]);
