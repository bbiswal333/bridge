angular.module('app.jenkins', []);
angular.module('app.jenkins').directive('app.jenkins', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {

        $scope.box.boxSize = '2'; 
        $scope.jenkinsConfig = {url: ""};

        $scope.getBuildImgUrl = function(jobName) {
            return "http://mo-e7882d540.mo.sap.corp:49153/job/" + jobName + "/badge/icon";
        };

        var updateJenkins = function(url) {

            $scope.jenkinsConfig.url = url;

            $http({method: 'GET', url: url + "/api/json"}).
                success(function(data) {
                    $scope.jobs = data.jobs;
                }).
                error(function(data, status) {
                    console.log("Error retrieving " + url + ". Status: " + status);
                    $scope.jobs = [];
                });
        };

        var init = function() {
            updateJenkins("http://mo-e7882d540.mo.sap.corp:49153");

        };

        init();

        $scope.inputChanged = function() {
            updateJenkins($scope.jenkinsConfig.url);
        };

    }];

    return {
        restrict: 'E',
        templateUrl: 'app/jenkins/overview.html',
        controller: directiveController
    };
});
