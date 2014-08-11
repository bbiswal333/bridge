angular.module('app.jenkins', []);
angular.module('app.jenkins').directive('app.jenkins', ["app.jenkins.configservice", function (jenkinsConfigService) {

    var directiveController = ['$scope', '$http', "$q", function ($scope, $http) {

        $scope.box.boxSize = '2'; 
        $scope.jenkinsConfig = {url: ""};
        $scope.errormessage = "";
        $scope.jobResult = [];

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

        var hasJobWithThatName = function(arrayOfObjects, name) {
            for(var index in arrayOfObjects) {
                if(arrayOfObjects[index].name === name) {
                    return true;
                }
            }
            return false;
        };

        var retrieveAndSetJobsByView = function(views) {

            for(var viewIndex in views) {

                $http.get(views[viewIndex].url + "api/json", {withCredentials: false})
                .success(function (viewData) {
                    // for the primary view, there is no special "view" page, but the start page
                    if(views[viewIndex].url.indexOf("view") === -1) {
                        viewData.name = views[viewIndex].name;
                    }
                    if(!hasJobWithThatName(jenkinsConfigService.jobsByView, viewData.name)) {
                       jenkinsConfigService.jobsByView.push({"name": viewData.name, "jobs": viewData.jobs});
                       for(var job in viewData.jobs) {
                            jenkinsConfigService.configItem.checkboxJobs[viewData.jobs[job].name] = true; 
                       }
                       
                    }
                }).error(function(data, status) {
                    console.log("Could not retrieve view details from " + views[viewIndex].url + "api/json, status: " + status);
                }); // GET

            }

        };

        $scope.getStatusColor = function(statusAsText) {
            var statusColor;
            if(statusAsText === "FAILURE") {
                statusColor = "red";
            } else if(statusAsText === "SUCCESS") {
                statusColor = "blue";
            } else if(statusAsText === "UNSTABLE"){
                statusColor = "yellow";
            } else{
                statusColor = "grey";
            }
            return statusColor;
        };

        $scope.limitDisplayName = function(name, limit) {
            if(name.length > limit) {
                return name.substring(0,limit) + " ... ";
            }
            return name;
        };

        var pushToJobResults = function(jobData) {
            var isJobnamePresent = false;
            for(var jobIndex in $scope.jobResult) {
                if($scope.jobResult[jobIndex].fullDisplayName === jobData.fullDisplayName) {
                    isJobnamePresent = true;
                }
            }
            if(isJobnamePresent === false) {
                $scope.jobResult.push(jobData);
            }
        };

        var removeJobFromJobResults = function(jobname) {
            for(var jobIndex in $scope.jobResult) {
                if($scope.jobResult[jobIndex].name === jobname) {
                    $scope.jobResult.splice(jobIndex, 1);
                }
            }
        };

        $scope.updateJobsViewByCheckbox = function(checkbox) {
            for(var jobname in checkbox) {
                if(checkbox[jobname] === false) {
                   removeJobFromJobResults(jobname);
                }
            }
        };

         var getStatus = function(jobUrl) {
            $scope.jobHealthReport = [];
            $scope.jobResult = [];

            $http({ method: 'GET', url: jobUrl + "lastBuild/api/json", withCredentials: false }).
            success(function(data) {
                data.timestamp = formatTimestamp(data.timestamp);
                data.statusColor = $scope.getStatusColor(data.result);
                $http({ method: 'GET', url: jobUrl + "api/json", withCredentials: false }).
                    success(function(result) {
                        data.jobHealthReport = result.healthReport;
                        data.name = result.name;    
                    }).
                    error(function(result, status) {
                         console.log("Could not GET job " + data.name + ", status: " + status);

                    });

                data.statusColor = $scope.getStatusColor(data.result);
                pushToJobResults(data);

            }).
            error(function(data, status) {
                 console.log("Could not GET last build info for job" + data.fullDisplayName + ", status: " + status);

            });
            
        };

        var removeViewAll = function(views) {
            for(var viewIndex in views) {
                if ((views.length > 1) && (views[viewIndex].name === "All")) {
                    views.splice(viewIndex, 1);
                }
            }
            return views;
        };

        $scope.getWeatherIconLink = function(jobWeatherReport) {
            return ((jobWeatherReport === undefined) ? "" : "/app/jenkins/icons/" + jobWeatherReport[0].iconUrl);
        };

        $scope.updateJenkins = function(url) {

            $scope.jenkinsConfig.url = url;

            $http.get(url + "/api/json", {withCredentials: false})
                 .success(function (data) {
                    $scope.jobs = data.jobs;         
                    jenkinsConfigService.views = removeViewAll(data.views);
                    retrieveAndSetJobsByView(removeViewAll(data.views));
                    $scope.errormessage = "";

                    for(var job in $scope.jobs) {
                        if($scope.jobs[job].color !== "grey"){
                           getStatus($scope.jobs[job].url); 
                        }
                        
                    }
                }).error(function(data, status) {
                    var msg = "Error retrieving data from " + url + ", got status: " + status;
                    $scope.errormessage = msg;
                    $scope.jobs = [];
                    $scope.jobResult = [];
            });

        };

        $scope.box.returnConfig = function(){
            return angular.copy($scope.configService);
        }; 

    }]; // directiveController()

    return {
        restrict: 'E',
        templateUrl: 'app/jenkins/overview.html',
        controller: directiveController,
        link: function ($scope) {
                if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
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

                $scope.$watch("appConfig.configItem.checkboxJobs", function () {

                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        
                        $scope.updateJobsViewByCheckbox($scope.appConfig.configItem.checkboxJobs);

                    }
                }, true);

             }
        };
}]);
