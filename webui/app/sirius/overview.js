var app = angular.module("app.sirius", ["app.sirius.siriusDirectives"])
    .filter('oldProgramSign', [function () {
        return function (isOldProgram) {
            return (isOldProgram === 'X') ? "(from Program Repository)" : "";
        };
    }]);
app.directive("app.sirius", ["app.sirius.configservice", "app.sirius.taskFilterConstants", '$filter', '$window', function (siriusConfigService, taskFilterConstants, $filter, $window) {

    var directiveController = ['$scope', '$http', function ($scope, $http) {
        var _init = function () {
            $scope.tasks = [];
            $scope.showGrid = false;
            $scope.program = new siriusUtils.SiriusObject();
            $scope.programLeads = [];
            $scope.programLeadsString = "";
            _setConfigService($scope);
            $scope.configService = siriusConfigService;
            $scope.getTasks();
        };

        $scope.box.settingsTitle = "Configure Program and Delivery Detail";
        $scope.box.settingScreenData = {
            templatePath: "sirius/settings.html",
            controller: angular.module('app.sirius').appSiriusSettings,
            id: $scope.boxId
        };
        $scope.box.returnConfig = function () {
            return angular.copy($scope.configService);
        };
        $scope.$on('reloadTasks', function () {
            $scope.getTasks();
        });
        // Search as-you-type on type ahead
        $scope.startSearchAsYouType = function () {
            var searchString = $scope.searchString;
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program?maxHits=50&query=' + searchString + '&sap-language=en').then(function (response) {
                var programs = [];
                programs = response.data.data;
                programs.sort(_sortProgs);
                programs.forEach(function (program) {
                    program.DISPLAY_TEXT += ' ' + $filter('oldProgramSign')(program.IS_OLD_PROGRAM);
                });

                return programs;
            });
        };

        //if searchString is empty, set back the program details
        $scope.$watch('searchString', function (value) {
            if (value === '') {
                $scope.showGrid = false;
                $scope.programLeads = [];
                $scope.programLeadsString = "Program Leads: ";
            }
        });

        //get data for program details
        $scope.onSelect = function ($item) {
            _viewSettings($item)
            _loadProgramLeadData($item);
            _loadProgramDetailsData($item);
        };

        $scope.getTrafficLightStatusCssClass = function (className) {
            if (className === 'trafficLightStatusGreen')
                return 'fa fa-chevron-circle-up';
            else if (className === 'trafficLightStatusRed')
                return 'fa fa-chevron-circle-down';
            else if (className === 'trafficLightStatusYellow')
                return 'fa fa-chevron-circle-right';
            return "noCssClassFound";
        };

        //call the method for get Tasks from Backend
        //filter the task. If no filter set, get all tasks
        $scope.getTasks = function () {
            $scope.emptyTask = false;
            if ($scope.configService.tasks.programGUID && $scope.configService.tasks.deliveryID) {
                $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $scope.configService.tasks.programGUID + '/delivery/' + $scope.configService.tasks.deliveryID + '/task?sap-language=en').
                    then(function (response) {
                        if (response.data.data.length == 0) {
                            $scope.emptyTask = true;
                        }

                        $scope.filteredTask = [];
                        $scope.tasks = response.data.data;
                        $scope.tasks.forEach(function (task) {
                            _mapStatus(task);
                            _dateFormat(task);
                            if ($scope.configService.tasks.selectedStatus.length === 0 && $scope.configService.tasks.selectedUserInAssignedToDropDown.length === 0) {
                                $scope.filteredTask = $scope.tasks;
                            }
                            else {
                                _filterTasks(task);
                            }
                        });

                        //add URL to every filtered Task
                        $scope.filteredTask.forEach(function(filteredTask){
                            filteredTask.URL = _getURLForTask(filteredTask);
                        });
                    });
            };
        };

        var _getURLForTask = function(task){
             var url = _getURLForRunningEnvironment("protocol://host:port/prs/link.do");
             return url + "?id=" + task.WORKING_STATE.GUID;
        };

        var _getURLForRunningEnvironment = function(url){
            var result_url = url;
             if (window.location.host.match(/localhost/) || window.location.host.match(/mo-4a73692b1.mo.sap.corp/) || window.location.host.match(/^wdf/) || window.location.host.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):1133[7|8]$/)) {
                result_url = result_url.replace(/protocol:\/\/host:port/g, siriusUtils.DEV_SERVER_URL());
             }
             else{
                if (window.location.port == "") {
                    result_url = result_url.replace(/\:port/g, '');
                }
                else{
                    result_url = result_url.replace(/port/g, window.location.port);
                }
             }
            return result_url
                .replace(/protocol\:/g, window.location.protocol)
                .replace(/host/g, window.location.host);
        };

        //map the Task-status from Backend to display on Front end
        var _mapStatus = function (task) {
            switch (task.WORKING_STATE.TASK_STATUS) {
                case taskFilterConstants.OPEN_STATUS():
                    task.WORKING_STATE.TASK_STATUS = "Open"
                    break;
                case taskFilterConstants.IN_PROCESS_STATUS():
                    task.WORKING_STATE.TASK_STATUS = "In Process"
                    break;
                case taskFilterConstants.NOT_APPLICABLE_STATUS():
                    task.WORKING_STATE.TASK_STATUS = "Not Applicable"
                    break;
                case taskFilterConstants.COMPLETED_STATUS():
                    task.WORKING_STATE.TASK_STATUS = "Completed"
                    break;
                case taskFilterConstants.CRITICAL_STATUS():
                    task.WORKING_STATE.TASK_STATUS = "Critical"
                    break;
            }
        };

        //Date Format for show due date
        var _dateFormat = function (task) {
            task.WORKING_STATE.PLANFINISH = siriusUtils.createDate(task.WORKING_STATE.PLANFINISH);
        };

        //filter the tasks
        var _filterTasks = function (task) {
            var _statusFilter = false,
            _assignedToFilter = false;

            for (var i = 0; i < $scope.configService.tasks.selectedStatus.length; i++) {
                if ($scope.configService.tasks.selectedStatus[i] === task.WORKING_STATE.TASK_STATUS) {
                    _statusFilter = true;
                }
            }
            for (var i = 0; i < $scope.configService.tasks.selectedUserInAssignedToDropDown.length; i++){
                if($scope.configService.tasks.selectedUserInAssignedToDropDown[i].id === task.WORKING_STATE.USER_ID){
                    _assignedToFilter = true;
                }
            }

            if(_statusFilter && _assignedToFilter){
                $scope.filteredTask.push(task);
            }
        };

        // differentiate between old and new program.
        // If old program true,then show link
        // else show program lead and program details
        var _viewSettings = function ($item) {
            if ($item.IS_OLD_PROGRAM) {
                $window.open(siriusUtils.OLD_PR_URL() + $item.GUID, '_blank');
                $scope.showGrid = false;
            }
            else {
                $scope.showGrid = true;
            }
        };

        // get data of program lead
        var _loadProgramLeadData = function ($item) {
            $scope.ProgramGUIDSirius = $item.GUID;
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '/role?sap-language=en&roleType=PROGRAM_LEAD').then(function (response) {
                $scope.programLeads = [];

                response.data.data.forEach(function (programLead) {
                    _getUser4UI(programLead.WORKING_STATE.USER_ID);
                });
            });
        };

        var _getUser4UI = function (userID) {
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user/' + userID + '?sap-language=en').then(function (response) {
                $scope.programLeads.push(response.data.data);
                return response.data.data;
            }).then(function () {
                $scope.programLeadsString = $scope.programLeads[0].DISPLAY_TEXT;
                for (var i = 1; i < $scope.programLeads.length; i++) {
                    $scope.programLeadsString = $scope.programLeadsString + ";" + $scope.programLeads[i].DISPLAY_TEXT;
                }
                $scope.programLeadsString = "Program Lead:" + $scope.programLeadsString;
            });
        };

        // get data of program lead
        var _loadProgramDetailsData = function ($item) {
            if (!$item.IS_OLD_PROGRAM) {
                return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '?sap-language=en').then(function (response) {
                    $scope.program.WORKING_STATE = response.data.data.WORKING_STATE;
                    var a = $scope.program.WORKING_STATE.KEY_MESSAGE;
                }).then(function () {
                    switch ($scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS) {
                        case "":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Not Applicate";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusGrey';
                            break;
                        case "E":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusEmpty';
                            break;
                        case "G":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "on Track";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusGreen';
                            break;
                        case "Y":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Critical";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusYellow';
                            break;
                        case "R":
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "Very Critical";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusRed';
                            break;
                        default :
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS = "";
                            $scope.program.WORKING_STATE.TRAFFIC_LIGHT_STATUS_CSS_CLASS = 'trafficLightStatusEmpty';
                            break;
                    }
                })
            }
        };

        var _sortProgs = function (a, b) {
            if (a.DISPLAY_TEXT.toLowerCase() < b.DISPLAY_TEXT.toLowerCase()) {
                return -1;
            }
            if (a.DISPLAY_TEXT.toLowerCase() > b.DISPLAY_TEXT.toLowerCase()) {
                return 1;
            }
            return 0;
        };

        _init();
    }];

    //get the settings and set it in siriusConfigService
    var _setConfigService = function ($scope) {
        if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.tasks) {
            siriusConfigService.tasks = $scope.appConfig.tasks;

        } else {
            $scope.appConfig.tasks = siriusConfigService.tasks;
        }
    };

    return {
        restrict: 'E',
        templateUrl: 'app/sirius/overview.html',
        controller: directiveController,
        link: function ($scope) {
            if ($scope.appConfig !== undefined && $scope.appConfig !== {} && $scope.appConfig.configItem) {
                siriusConfigService.configItem = $scope.appConfig.configItem;

            } else {
                $scope.appConfig.configItem = siriusConfigService.configItem;
            }
            _setConfigService($scope);

            $scope.box.boxSize = siriusConfigService.configItem.boxSize;
        }
    };
}]);