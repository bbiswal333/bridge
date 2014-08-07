angular.module('app.jenkins', []);
angular.module('app.jenkins').directive('app.jenkins', ["app.jenkins.configservice", function (jenkinsConfigService) {

    var directiveController = ['$scope', '$http', function ($scope, $http) {

        $scope.box.boxSize = '2'; 
        $scope.jenkinsConfig = {url: ""};
        $scope.jobResult = [];
        $scope.jobInfo = [];
        $scope.errormessage = "";

        // Settings Screen
        $scope.box.settingsTitle = "Configure Jenkins URL";
        $scope.box.settingScreenData = {
            templatePath: "/jenkins/settings.html",
            controller: angular.module('app.jenkins').appJenkinsSettings,
            id: $scope.boxId
        };

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

        $scope.getStatusColor = function(statusAsText) {
            var statusColor;
            if(statusAsText === "FAILURE") {
                statusColor = "red";
            } else if(statusAsText === "SUCCESS") {
                statusColor = "blue";
            } else {
                statusColor = "yellow";
            }
            return statusColor;
        };

        $scope.limitDisplayName = function(name, limit) {
            if(name.length > limit) {
                return name.substring(0,limit) + " ... ";
            }
            return name;
        };

        var getStatus = function() {
            $scope.jobHealthReport = [];
            $scope.jobResult = [];

            for(var job in $scope.jobs) {
                $http({ method: 'GET', url: $scope.jobs[job].url + "lastBuild/api/json", withCredentials: false }).
                success(function(data) {

                    data.timestamp = formatTimestamp(data.timestamp);

                    $http({ method: 'GET', url: $scope.jobs[job].url + "api/json", withCredentials: false }).
                        success(function(result) {
                            data.jobHealthReport = result.healthReport;
                            data.statusColor = $scope.getStatusColor(data.result);
                        });

                    $scope.jobResult.push(data);

                }).
                error(function(data, status) {

                    $scope.jobResult.push({url: $scope.jobs[job].url, fullDisplayName: $scope.jobs[job].name, result: "UNKNOWN", timestamp: null});
                    console.log("Could not GET last build info for job" + $scope.jobs[job].name + ", status: " + status);

                });
            }
        };


        $scope.getWeatherIconLink = function(jobWeatherReport) {
            if(jobWeatherReport === undefined) {
                return "";
            }

            var link = "/app/jenkins/icons/";
            if(jobWeatherReport[0].iconUrl === "health-40to59.png") {
                link += "health-40to59.png";
            } else if(jobWeatherReport[0].iconUrl === "health-20to39.png") {
                link += "health-20to39.png";
            }else if(jobWeatherReport[0].iconUrl === "health-80plus.png") {
                link += "health-80plus.png";
            }else if(jobWeatherReport[0].iconUrl === "health-00to19.png") {
                link += "health-00to19.png";
            }
            return link;
        };

        $scope.updateJenkins = function(url) {

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
            $scope.jenkinsConfig.url = jenkinsConfigService.configItem.jenkinsUrl;
        };

        init();

        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        }; 

    }]; // directiveController()

    return {
        restrict: 'E',
        templateUrl: 'app/jenkins/overview.html',
        controller: directiveController,
        link: function ($scope) 
             {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) 
                 {
                    jenkinsConfigService.configItem = $scope.appConfig.configItem;
                } else {
                    $scope.appConfig.configItem = jenkinsConfigService.configItem;
                }
                $scope.box.boxSize = jenkinsConfigService.configItem.boxSize;

                $scope.$watch("appConfig.configItem.boxSize", function () {
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.box.boxSize = $scope.appConfig.configItem.boxSize;
                    }
                }, true);

                $scope.$watch("appConfig.configItem.jenkinsUrl", function () {
                    $scope.appConfig.configItem.jenkinsUrl = $scope.appConfig.configItem.jenkinsUrl.replace(/\/$/, "");
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.updateJenkins($scope.appConfig.configItem.jenkinsUrl);
                    }
                }, true);

             }
        };
}]);
