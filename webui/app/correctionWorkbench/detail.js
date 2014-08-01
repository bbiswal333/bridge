angular.module('app.correctionWorkbench').controller('app.correctionWorkbench.detailController', ['$scope', '$http','$templateCache', 'app.correctionWorkbench.workbenchData','$routeParams', 'bridgeDataService', 'bridgeConfig', function Controller($scope, $http, $templateCache, workbenchData, $routeParams, bridgeDataService, bridgeConfig) {

        $scope.$parent.titleExtension = " - Details";   
        $scope.filterText = '';
        $scope.categories = workbenchData.categories;
        $scope.workbenchData = workbenchData.workbenchData;
        $scope.categoryMap = {};  
        $scope.zoomIndex = -1;
        $scope.zoomImg = null;


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

            $scope.categories.forEach(function(category) {
                if($scope.categoryMap[category.name] && $scope.categoryMap[category.name].active) {
                    workbenchData.workbenchData[category.targetArray].forEach(function(workbenchItem) {
                        $scope.tableData.push(workbenchItem);
                    });
                }
            });
        }

        $scope.$watch('categories', function () 
        {                        
            update_table();            
        }, true);

        $scope.$watch('categoryMap', function()
        {
            update_table();
        }, true);


        function enhanceMessage(workbenchItem) 
        {
            if(workbenchItem.reporter._alternateId !== "")
            {
                $http.get('https://ifp.wdf.sap.corp:443/sap/bc/zxa/FIND_EMPLOYEE_JSON?id=' + workbenchItem.reporter._alternateId + '&origin=' + location.origin).then(function (response) {
                    workbenchItem.reporterEnhanced = response.data.DATA;
                    if(workbenchItem.reporterEnhanced.BNAME !== "")
                    {
                        workbenchItem.reporterEnhanced.TELNR = workbenchItem.reporterEnhanced.TELNR_DEF.replace(/ /g, '').replace(/-/g, '');
                        workbenchItem.reporterEnhanced.url = 'https://people.wdf.sap.corp/profiles/' + workbenchItem.reporterEnhanced.BNAME;    
                        workbenchItem.reporterEnhanced.username = workbenchItem.reporterEnhanced.VORNA + ' ' + workbenchItem.reporterEnhanced.NACHN;
                    }
                });
            }
        }

        function enhanceAllMessages() 
        {
            angular.forEach(workbenchData.workbenchData.correctionRequestsPlannedForTesting, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsInProcess, function (workbenchItem) { enhanceMessage(workbenchItem); });  
            angular.forEach(workbenchData.workbenchData.correctionRequestsTesting, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctionRequestsTestedOk, function (workbenchItem) { enhanceMessage(workbenchItem); });          
        }

        $scope.getCategoryArray = function(){
            return Object.keys($scope.categoryMap);
        };

        $scope.zoom = function(index, event){
            $scope.zoomIndex = index;
            if (event) {
                $scope.zoomImg = event.currentTarget;
            };
        }
        if (workbenchData.isInitialized.value === false) {
            var promise = workbenchData.initialize();

            promise.then(function success() {
                enhanceAllMessages();
            });
        } else {
            enhanceAllMessages();
        }
}]);

