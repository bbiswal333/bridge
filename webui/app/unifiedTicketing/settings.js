angular.module('app.unifiedticketing')
    .controller('app.unifiedticketing.settingsController', ["$scope", "$http", "app.unifiedticketing.config", function($scope, $http, configService){

        $scope.config = configService.getConfigForAppId($scope.boxScope.metadata.guid);
        
        $scope.savedSearches = [];
        

    $scope.getSyncHistory = function(syncDays) {
       
            var days = parseInt(syncDays);
             $scope.config.syncDays =syncDays;
            if(syncDays=='null' || syncDays==''){
                $scope.config.syncHistory = '';
              
           } else{
            var date = new Date();
            date.setDate(date.getDate() - days);
            var month = (date.getMonth() + 1).toString();
            if (month.length == 1) month = "0" + month;
            var day = (date.getDate()).toString();
            if (day.length == 1) day = "0" + day;
            var dateString = date.getFullYear().toString() + month + day + "0001";
            $scope.config.syncHistory = dateString;
          }

        
    };


    $scope.getStatus = function(Status) {

                $scope.config.Status =Status;
                
        
    };

        $scope.save_click = function () {
          
            $scope.$emit('closeSettingsScreen', {app: 'unifiedticketing'});
        };
}]);
