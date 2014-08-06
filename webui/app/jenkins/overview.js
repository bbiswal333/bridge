angular.module('app.jenkins', []);
angular.module('app.jenkins').directive('app.jenkins', function () {

    var directiveController = ['$scope', '$http', function ($scope, $http) {

        $scope.box.boxSize = '2'; 
        $scope.jenkinsConfig = {url: ""};
        $scope.jobResult = [];
        $scope.jobInfo = [];
        $scope.errormessage = "";

        var prefixZero = function(digit) {
            digit = (digit.toString().length === 1) ? "0" + digit : digit;
            return digit;
        };

        var formatTimestamp = function(timestamp) {

            var dt = new Date(timestamp);

            var day = prefixZero(dt.getDate());
            var month = prefixZero(dt.getMonth() + 1);
            var year = dt.getFullYear();
            var hours = prefixZero(dt.getHours());
            var minutes = prefixZero(dt.getMinutes());
            
            return day + "/" + month + "/" + year + " " + hours + ":" + minutes;

        };

        var getStatus = function() {

            for(var job in $scope.jobs) {
                console.log($scope.jobs[job].url);
                $http({ method: 'GET', url: $scope.jobs[job].url + "lastBuild/api/json", withCredentials: false }).
                success(function(data) {
                    data.timestamp = formatTimestamp(data.timestamp);
                    $scope.jobResult.push(data);
                }).
                error(function(data, status) {
                    $scope.jobResult.push({url: $scope.jobs[job].url, fullDisplayName: $scope.jobs[job].name, result: "UNKNOWN", timestamp: null});
                    console.log("Could not GET last build info for job" + $scope.jobs[job].name + ", status: " + status);
                });
            }
        };

        $scope.getStatusIconLink = function(statusAsText) {
            var link = "/app/jenkins/icons/";
            if(statusAsText === "FAILURE") {
                link += "red_16x16.png";
            } else if(statusAsText === "SUCCESS") {
                link += "blue_16x16.png";
            } else {
                link += "grey_16x16.png";
            }
            return link;
        };

        var updateJenkins = function(url) {

            $scope.jenkinsConfig.url = url;

            $http.get(url + "/api/json", {withCredentials: false})
                 .success(function (data) {
                    $scope.jobs = data.jobs;
                    $scope.errormessage = "";
                    getStatus();
                }).error(function(data, status) {
                    var msg = "Error retrieving data from " + url + ", got status: " + status;
                    $scope.errormessage = msg;
                    $scope.jobs = [];
                    $scope.jobResult = [];
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
