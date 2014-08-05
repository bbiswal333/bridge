angular.module('app.jenkins', []);
angular.module('app.jenkins').directive('app.jenkins', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {

        $scope.box.boxSize = '2'; 
        $scope.jenkinsConfig = {url: ""};
        $scope.jobStatus = [];
        $scope.errormessage = "";

        var addBuildStatusUrls = function() {
            for(var jobindex in $scope.jobs) {
                $scope.jobs[jobindex].buildstatusurl = $scope.jenkinsConfig.url + "/job/" + $scope.jobs[jobindex].name + "/badge/icon";
            }
        };

        var getStatus = function(){
            
            
            for(var job in $scope.jobs) {
                console.log($scope.jobs[job].url)
                $http({ method: 'GET', url: $scope.jobs[job].url + "lastBuild/api/json", withCredentials: false }).
                success(function(data) {      
                    $scope.jobStatus.push(data);
                }).
                error(function(data, status) {
                    console.log("GET could not be done on job" + data.jobName);
                });
            }
            
            
        }

        var updateJenkins = function(url) {

            $scope.jenkinsConfig.url = url;

            $http.get(url + "/api/json", {withCredentials: false})
                 .success(function (data) {
                    $scope.jobs = data.jobs;
                    $scope.errormessage = "";
                    addBuildStatusUrls();
                    getStatus();
                }).error(function(data, status) {
                    var msg = "Error retrieving data from " + url + ", got status: " + status;
                    $scope.errormessage = msg;
                    $scope.jobs = [];
            });

        };

        var init = function() {
            updateJenkins("http://mo-c97a0800b.mo.sap.corp:49153");
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
