angular.module('app.jenkins', []);

angular.module('app.jenkins').directive('app.jenkins', ["app.jenkins.configservice", function (jenkinsConfigService) {

    var directiveController = ['$scope', '$http', "$log", function ($scope, $http, $log) {

        $scope.box.boxSize = '2';
        $scope.jobsToDisplay = [];
        $scope.jenkinsConfig = {};
        $scope.configService = jenkinsConfigService;
        $scope.dependancyGraph = [];

        // Settings Screen
        $scope.box.settingsTitle = "Configure Jenkins URL";
        $scope.box.settingScreenData = {
            templatePath: "/jenkins/settings.html",
            controller: angular.module('app.jenkins').appJenkinsSettings,
            id: $scope.boxId
        };

        $scope.box.returnConfig = function() {
            return angular.copy($scope.configService);
        };

        this.initialize = function () {
            $scope.box.reloadApp(this.jobsToDisplay, 60);
        };

        var formatTimestamp = function(timestamp) {
            return $.timeago(timestamp);
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

                $http.get('/api/get?url=' + encodeURIComponent(views[viewIndex].url + "api/json?depth=2&tree=name,jobs[color,name,url]"), {withCredentials: false})
                .success(function (viewData) {

                    // since the page for the primary view is the start page, there is no view name
                    if(viewData.name === undefined) {
                        viewData.name = $scope.primaryViewName;
                    }

                    if(!hasJobWithThatName(jenkinsConfigService.configItem.jobsByView, viewData.name)) {

                        jenkinsConfigService.configItem.jobsByView.push({"name": viewData.name, "jobs": viewData.jobs});

                    }
                }).error(function(data, status) {
                    $log.log("Could not retrieve view details from " + views[viewIndex].url + "api/json, status: " + status);
                }); // GET
            }
        };

        $scope.limitDisplayName = function(name, limit) {
            if(name.toString().length > limit) {
                return name.toString().substring(0,limit) + " ... ";
            }
            return name;
        };

        var getStatusInfo = function(status){
            if(status === "SUCCESS"){
                return "Success";
            }else if(status === "UNSTABLE"){
                return "Unstable";
            }else if(status === "FAILURE"){
                return "Failed";
            }
        };

        var setLastBuildInfoNA = function(job) {
            for(var jobIndex in $scope.jobsToDisplay) {
                        if($scope.jobsToDisplay[jobIndex].name === job.name) {
                            $scope.jobsToDisplay[jobIndex].timestamp = "unknown";
                            $scope.jobsToDisplay[jobIndex].lastbuildUrl = job.jenkinsUrl + "/job/" + job.name;
                            $scope.jobsToDisplay[jobIndex].statusInfo = "Unknown";
                            $scope.jobsToDisplay[jobIndex].lastBuild = "0000000000000";
                            $log.log($scope.jobsToDisplay[jobIndex].lastBuild);
                        }
                }
        };

        var getAndSetTimestampForLastBuild = function(job) {

            if(job.color === "grey" || job.color === undefined) {

                setLastBuildInfoNA(job);

            } else {

                $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(job.jenkinsUrl + "/job/" + job.name + "/lastBuild/api/json?depth=1&tree=timestamp,result"), withCredentials: false }).
                success(function(latestBuildData) {

                    for(var jobIndex in $scope.jobsToDisplay) {
                            if($scope.jobsToDisplay[jobIndex].name === job.name) {
                                $scope.jobsToDisplay[jobIndex].timestamp = formatTimestamp(latestBuildData.timestamp);
                                $scope.jobsToDisplay[jobIndex].lastBuild = latestBuildData.timestamp;
                                $scope.jobsToDisplay[jobIndex].lastbuildUrl = job.jenkinsUrl + "/job/" + job.name + "/lastBuild";

                                $scope.jobsToDisplay[jobIndex].statusInfo = getStatusInfo(latestBuildData.result);

                            }
                    }
                }).
                error(function(data, status) {
                     $log.log("Could not GET last build info for job" + data.fullDisplayName + ", status: " + status);
                });
            }
        };

        var getAndSetHealthReportAndColorToJob = function(job) {

            $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(job.url + "/api/json?depth=2&tree=color,healthReport[description,iconUrl,score]"), withCredentials: false }).
                success(function(result) {

                    for(var jobIndex in $scope.jobsToDisplay) {
                        if($scope.jobsToDisplay[jobIndex].name === job.name) {
                            $scope.jobsToDisplay[jobIndex].jobHealthReport = result.healthReport;
                            $scope.jobsToDisplay[jobIndex].color = (result.color === "notbuilt") ? "grey" : result.color;
                            $scope.jobsToDisplay[jobIndex].statusColor = "status" + result.color;
                            // $scope.jobsToDisplay[jobIndex].statusInfo = result.result;
                            if(result.color === "red"){
                                $scope.jobsToDisplay[jobIndex].statusIcon = "fa-times";
                                $scope.jobsToDisplay[jobIndex].statusInfo = "Failed";
                            }else if(result.color === "yellow"){
                                $scope.jobsToDisplay[jobIndex].statusIcon = "fa-circle";
                                $scope.jobsToDisplay[jobIndex].statusInfo = "Unstable";
                            }else if(result.color === "blue" || result.color === "green"){
                                $scope.jobsToDisplay[jobIndex].statusIcon = "fa-check";
                                $scope.jobsToDisplay[jobIndex].statusInfo = "Success";
                            }else if(result.color === "blue_anime" || result.color === "green_anime" || result.color === "red_anime" || result.color === "yellow_anime"){
                                $scope.jobsToDisplay[jobIndex].statusIcon = "fa-circle-o-notch fa-spin";
                                $scope.jobsToDisplay[jobIndex].statusInfo = "Running";
                            }else{
                                $scope.jobsToDisplay[jobIndex].statusIcon = "fa-question";
                            }
                        }
                    }
            }).
                error(function(result, status) {
                     $log.log("Could not GET job " + job.name + ", status: " + status);
            });
            getAndSetTimestampForLastBuild(job);
        };

        var getDependancyData = function(job){
            $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(job.url + "/api/json?depth=2&tree=downstreamProjects[color,name,url],upstreamProjects[color,name,url]"), withCredentials: false }).
                success(function(result) {

                    for(var jobIndex in $scope.jobsToDisplay) {
                        if($scope.jobsToDisplay[jobIndex].name === job.name) {
                            $scope.jobsToDisplay[jobIndex].downstreamProjects = result.downstreamProjects;
                            $scope.jobsToDisplay[jobIndex].upstreamProjects = result.upstreamProjects;
                        }
                    }

            }).
                error(function(result, status) {
                     $log.log("Could not GET job " + job.name + ", status: " + status);
            });
        };

        $scope.updateJobsView = function(configItems) {

            $scope.jobsToDisplay = configItems;

            for(var jobIndex in $scope.jobsToDisplay) {

                $scope.jobsToDisplay[jobIndex].name = $scope.jobsToDisplay[jobIndex].selectedJob;
                $scope.jobsToDisplay[jobIndex].url = $scope.jobsToDisplay[jobIndex].jenkinsUrl + "/job/" + $scope.jobsToDisplay[jobIndex].name;
                getDependancyData($scope.jobsToDisplay[jobIndex]);
                getAndSetHealthReportAndColorToJob($scope.jobsToDisplay[jobIndex]);
            }

        };

        $scope.noJobSelected = function() {

            if($scope.jobsToDisplay.length === 0) {
                    return true;
            } else {
                return false;
            }

        };

        var removeViewAll = function(views) {
            for(var viewIndex in views) {
                if ((views.length > 1) && (views[viewIndex].name === "All")) {
                    views.splice(viewIndex, 1);
                }
            }
            return views;
        };

        var clearJobsViewAndSetErrorMsg = function(msg) {
            $scope.primaryViewName = "";
            jenkinsConfigService.configItem.selectedJob = "";
            jenkinsConfigService.configItem.selectedView = "";
            jenkinsConfigService.couldReachJenkinsUrl = false;
            jenkinsConfigService.lastErrorMsg = msg;
        };

        $scope.updateJenkinsData = function(url) {

            if(url.length === 0) {
                return;
            }

            $scope.jenkinsConfig.url = url;
            jenkinsConfigService.configItem.jobsByView = [];

            $http.get('/api/get?url=' + encodeURIComponent(url + "/api/json"), {withCredentials: false})
                 .success(function (jobsOverviewData) {

                    $scope.primaryViewName = jobsOverviewData.primaryView.name;
                    $scope.downstreamProjects = jobsOverviewData.downstreamProjects;
                    $scope.upstreamProjects = jobsOverviewData.upstreamProjects;
                    jenkinsConfigService.configItem.views = removeViewAll(jobsOverviewData.views);
                    jenkinsConfigService.configItem.jobs = jobsOverviewData.jobs;
                    jenkinsConfigService.couldReachJenkinsUrl = true;
                    retrieveAndSetJobsByView(removeViewAll(jobsOverviewData.views));

                }).error(function(data, status) {
                    clearJobsViewAndSetErrorMsg("Error retrieving data, got status: " + status);
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
                    jenkinsConfigService.configItems = $scope.appConfig.configItems;
                    jenkinsConfigService.couldReachJenkinsUrl = $scope.appConfig.couldReachJenkinsUrl;
                    jenkinsConfigService.lastErrorMsg = $scope.appConfig.lastErrorMsg;
                } else {
                    $scope.appConfig.configItem = jenkinsConfigService.configItem;
                    $scope.appConfig.configItems = jenkinsConfigService.configItems;
                    $scope.appConfig.couldReachJenkinsUrl = jenkinsConfigService.couldReachJenkinsUrl;
                    $scope.appConfig.lastErrorMsg = jenkinsConfigService.lastErrorMsg;
                }

                $scope.box.boxSize = jenkinsConfigService.configItem.boxSize;

                $scope.$watch("appConfig.configItem.boxSize", function () {
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.box.boxSize = $scope.appConfig.configItem.boxSize;
                    }
                }, true);

                $scope.$watch("appConfig.configItem.jenkinsUrl", function () {
                    if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                        $scope.updateJenkinsData($scope.appConfig.configItem.jenkinsUrl);
                    }
                }, true);

                $scope.$watch("appConfig.configItems", function () {

                    $scope.updateJobsView($scope.appConfig.configItems);

                }, true);

             }
        };
}]);
