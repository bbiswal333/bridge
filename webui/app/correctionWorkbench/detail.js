angular.module('app.correctionWorkbench').controller('app.correctionWorkbench.detailController', ['$scope', '$http','$templateCache', 'app.correctionWorkbench.workbenchData','$routeParams', 'app.correctionWorkbench.configservice', 'bridgeDataService', 'bridgeConfig', function Controller($scope, $http, $templateCache, workbenchData, $routeParams, configservice, bridgeDataService, bridgeConfig) {

        $scope.$parent.titleExtension = " - Details";   
        $scope.filterText = '';
        $scope.workbechItems = [];
        $scope.prios = workbenchData.prios;
        $scope.statusMap = {};  
        $scope.zoomIndex = -1;
        $scope.zoomImg = null;


        function update_table()
        {
            $scope.tableData = [];
            if($scope.workbechItems && $scope.workbechItems.length > 0)
            {
                if(!$scope.getStatusArray().length)
                {
                    var status_filter = $routeParams.prio.split('|'); 

                    $scope.prios.forEach(function (prio){
                        if(status_filter.indexOf(prio.name) > -1)
                        {
                            $scope.statusMap[prio.name] = {"active":true};
                        }
                        else
                        {
                            $scope.statusMap[prio.name] = {"active":false};
                        }
                    });
                }                
                $scope.workbechItems.forEach(function (workbechItem){
                    if ($scope.statusMap[workbechItem.priority.__text].active) {
                        $scope.tableData.push(workbechItem);
                    }
                });                               
            }                      
        }

        $scope.$watch('workbechItems', function () 
        {                        
            update_table();            
        }, true);

        $scope.$watch('statusMap', function()
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
            angular.forEach(workbenchData.workbenchData.correctionRequestsForTesting, function (workbenchItem) { enhanceMessage(workbenchItem); });
            angular.forEach(workbenchData.workbenchData.correctiveMeasures, function (workbenchItem) { enhanceMessage(workbenchItem); });          
        }

        $scope.getStatusArray = function(){
            return Object.keys($scope.statusMap);
        };

        $scope.$watch('config', function() {      
            if($scope.config !== undefined)
            {
                var selected_messages = [];                
                if($scope.config.data.selection.correctionRequestsForTesting) { angular.forEach(workbenchData.workbenchData.correctionRequestsForTesting, function (workbenchItem) { selected_messages.push(workbenchItem); }); }
                if($scope.config.data.selection.correctiveMeasures)     { angular.forEach(workbenchData.workbenchData.correctiveMeasures, function (workbenchItem) { selected_messages.push(workbenchItem); }); }                                     
                $scope.workbechItems = selected_messages;
                bridgeConfig.persistInBackend(bridgeDataService);                
            }
        },true);  

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
                $scope.config = configservice;
            });
        } else {
            enhanceAllMessages();
            $scope.config = configservice;
        }
}]);


