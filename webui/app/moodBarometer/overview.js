angular.module('app.moodBarometer', ['app.moodBarometer.data','ui.bootstrap.modal', 'ui.bootstrap.tpls', 'bridge.service']);
angular.module('app.moodBarometer').directive('app.moodBarometer', ['app.moodBarometer.configService', 'app.moodBarometer.dataService', '$modal', function (configService, dataService, $modal) {
    var directiveController = ['$scope', '$http', '$window', 'notifier','$location', function ($scope, $http, $window, notifier,$location) {
        $scope.box.boxSize = 2;

        $scope.box.headerIcons = [{
            iconCss: "fa fa-bar-chart",
            title: "View charts",

            callback: function(){
                $location.path("/detail/moodBarometer");
            }
        }];

        $scope.open = function(){
            $modal.open({
                templateUrl: 'app/moodBarometer/beHappy.html',
                windowClass: 'settings-dialog',
                controller: 'app.MoodBarometer.ModalCtrl'
            });
        };


                $scope.many = dataService.getReloadCounter();

        $scope.getMood = function(){
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GETMOOD' + '?origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                $scope.mood = data.USERINFO.MOOD;
            });

        };
        $scope.getMood();


        $scope.getData = function() {
            dataService.reload();
            $scope.many = dataService.getReloadCounter();
        };

        $scope.getMoodInARow = function(){
            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/GET_MOOD_IN_A_ROW' + '?mood=' + $scope.mood + '&origin=' + encodeURIComponent($window.location.origin),
                method: "GET"
            }).success(function (data) {
                if(data.row){
                    $scope.open();
                }
            });

        };

        $scope.setMood = function(mood){
                var sConfigPayload = mood;
                $scope.mood = mood;

            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/SETMOOD' + '?origin=' + encodeURIComponent($window.location.origin),
                method: "POST",
                data: sConfigPayload,
                headers: { 'Content-Type': 'text/plain' }
            }).success(function () {
                if(sConfigPayload === 'SAD') {
                    $scope.getMoodInARow();
                }
            }).error(function () {
                //console.log("Error when saving mood!");
            });


        };

        $scope.deleteMood = function(){
            $scope.mood = '';

            $http({
                url: 'https://ifp.wdf.sap.corp/sap/bc/bridge/DELETEMOOD' + '?origin=' + encodeURIComponent($window.location.origin),
                method: "POST",

                headers: { 'Content-Type': 'text/plain' }
            }).success(function () {
                //console.log("Your mood was deleted successfully");
            }).error(function () {
                //console.log("Error when deleting mood!");
            });

        };

        // Bridge framework function to take care of refresh
        $scope.box.reloadApp($scope.getData,60);

        // Example function for notifications
        $scope.moodBarometerNotification = function() {
            notifier.showInfo("This is just a test",
                "As the title says: nothing to do here :-)",
                $scope.$parent.module_name,
                function() {},
                7000, null); // duration: -1 -> no timout; undefined -> 5000 ms as default
        };
    }];

    var linkFn = function ($scope) {

        // get own instance of config service, $scope.appConfig contains the configuration from the backend
        configService.initialize($scope.appConfig);

        //// watch on any changes in the settings screen
        //$scope.$watch("appConfig.values.boxSize", function () {
        //    $scope.box.boxSize = $scope.appConfig.values.boxSize;
        //}, true);
    };

    return {
        restrict: 'E',
        templateUrl: 'app/moodBarometer/overview.html',
        controller: directiveController,
        link: linkFn
    };
}]);
