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

            var viewUrl;

            for(var viewIndex in views) {

                viewUrl = views[viewIndex].url;
                
                $http.get(viewUrl + "api/json", {withCredentials: false})
                .success(function (viewData) {
                    
                    // since the page for the primary view is the start page, there is no view name
                    if(viewData.name === undefined) {
                        viewData.name = $scope.primaryViewName;
                    }

                    if(!hasJobWithThatName(jenkinsConfigService.configItem.jobsByView, viewData.name)) {

                        jenkinsConfigService.configItem.jobsByView.push({"name": viewData.name, "jobs": viewData.jobs});

                        for(var job in viewData.jobs) {
                            jenkinsConfigService.configItem.checkboxJobs[viewData.jobs[job].name] = true; 
                        }
                       
                    }
                }).error(function(data, status) {
                    console.log("Could not retrieve view details from " + views[viewIndex].url + "api/json, status: " + status);
                }); // GET

            }

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

        $scope.updateJobsViewByCheckbox = function(checkbox) {
            var jobname;
            for(var jobIndex in $scope.jobResult) {
                jobname = $scope.jobResult[jobIndex].name;
                $scope.jobResult[jobIndex].isChecked = checkbox[jobname];
            }
        };

         var getStatus = function(job) {
            var jobUrl = job.url;
            $scope.jobHealthReport = [];
            $scope.jobResult = [];

            $http({ method: 'GET', url: jobUrl + "lastBuild/api/json", withCredentials: false }).
            success(function(data) {

                data.timestamp = formatTimestamp(data.timestamp);
                data.statusColor = job.color;

                $http({ method: 'GET', url: jobUrl + "api/json", withCredentials: false }).
                    success(function(result) {
                        data.jobHealthReport = result.healthReport;
                        data.name = result.name;
                        data.isChecked = true;
                    }).
                    error(function(result, status) {
                         console.log("Could not GET job " + data.name + ", status: " + status);

                    });

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
            jenkinsConfigService.configItem.checkboxJobs = {};

            $http.get(url + "/api/json", {withCredentials: false})
                 .success(function (data) {
                    $scope.jobs = data.jobs;
                    $scope.primaryViewName = data.primaryView.name;
                    jenkinsConfigService.configItem.views = removeViewAll(data.views);
                    retrieveAndSetJobsByView(removeViewAll(data.views));
                    $scope.errormessage = "";

                    for(var jobIndex in $scope.jobs) {
                        if($scope.jobs[jobIndex].color !== "grey"){
                           getStatus($scope.jobs[jobIndex]); 
                        }
                        
                    }
                }).error(function(data, status) {
                    var msg = "Error retrieving data from " + url + ", got status: " + status;
                    $scope.errormessage = msg;
                    $scope.jobs = [];
                    $scope.jobResult = [];
                    $scope.primaryViewName = "";
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
