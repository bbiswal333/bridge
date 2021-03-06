angular.module('app.sirius').appSiriusSettings =
    /*eslint no-trailing-spaces:0*/
    ['$scope', '$rootScope', "app.sirius.configservice", "app.sirius.taskFilterConstants", "app.sirius.utils", "$http", function ($scope, $rootScope, siriusConfigService, taskFilterConstants, siriusUtils, $http) {

        var _loadTask = function () {
            for (var i = 0; i < $scope.deliveries.length; i++) {
                if ($scope.deliveries[i].WORKING_STATE.GUID === $scope.siriusConfigService.tasks.deliveryID) {
                    $scope.getTasks($scope.deliveries[i]);
                }
            }
        };

        //load Program with given Program ID
        var _loadProgram = function (programGUID, doAfterLoad) {
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + programGUID + '?sap-language=en&readonly=X').then(function (response) {
                var program = [];
                program.GUID = response.data.data.WORKING_STATE.GUID;
                $scope.SettingsProgramName = response.data.data.WORKING_STATE.PROGRAM_NAME;

                $scope.onSelect(program, doAfterLoad);
                return response.data.data;
            });
        };

        var _loadTaskSettings = function () {
            $scope.siriusConfigService = siriusConfigService;
            _loadProgram($scope.siriusConfigService.tasks.programGUID, _loadTask);
            $scope.selectedStatus = $scope.siriusConfigService.tasks.selectedStatus;
            $scope.selectedUserInAssignedToDropDown = $scope.siriusConfigService.tasks.selectedUserInAssignedToDropDown;
        };

        var _addUserToAssignedToUserDropDown = function (name, id) {

            if (_.findIndex($scope.assignedToUsers, {'id': id}) === -1) {
                if (id.toUpperCase() === $scope.user.BNAME.toUpperCase()) {
                    $scope.assignedToUsers.push({
                        'id': id,
                        'display': 'me'
                    });
                } else {
                    $scope.assignedToUsers.push({
                        'id': id,
                        'display': name + " (" + id + ")"
                    });
                }
            }
        };

        var _updateUserInformation = function (task, user) {
            // Updates the user Information in the given task
            if (user && user.BNAME && user.BNAME !== '') {
                task.WORKING_STATE.USER_ID = user.BNAME;
                task.WORKING_STATE.USER_ID_DISPLAY = user.VORNA + " " + user.NACHN + " (" + user.BNAME + ")";
                task.WORKING_STATE.USER_ID_DISPLAY_LAST = task.WORKING_STATE.USER_ID_DISPLAY;
                task.WORKING_STATE.VORNA = user.VORNA;
                task.WORKING_STATE.NACHN = user.NACHN;
                //ADD USER TO DROP DOWN LIST FOR ASSIGNED TO USERS
                _addUserToAssignedToUserDropDown(user.VORNA + " " + user.NACHN, user.BNAME);
            } else {
                // No User is selected, set the attributes empty
                task.WORKING_STATE.USER_ID_DISPLAY = '';
                task.WORKING_STATE.USER_ID_DISPLAY_LAST = '';
                task.WORKING_STATE.VORNA = '';
                task.WORKING_STATE.NACHN = '';
                // For the filter to work correctly, the USER_ID column must contain something
                task.WORKING_STATE.USER_ID = taskFilterConstants.user_id_empty();
            }
        };

        var _init = function () {
            $scope.currentConfigValues = siriusConfigService.configItem;
            $scope.showDelivery = false;
            $scope.programGUID = "";
            $scope.deliveryID = "";
            $scope.tasks = "";
            $scope.assignedToUsers = [];
            $scope.selectedUserInAssignedToDropDown = [];
            $scope.selectedTasks = [];
            $scope.selectedStatus = [];
            $scope.user = "";

            $scope.classMap = {
                "Open": "taskStatusOpen",
                "In Process": "taskStatusInProcess",
                "Not Applicable": "taskStatusNA",
                "Completed": "taskStatusCompleted",
                "Critical": "taskStatusCritical"
            };

            $scope.statusMap = {
                "Open": taskFilterConstants.open_status(),
                "In Process": taskFilterConstants.in_process_status(),
                "Not Applicable": taskFilterConstants.not_applicable_status(),
                "Completed": taskFilterConstants.completed_status(),
                "Critical": taskFilterConstants.critical_status()
            };

            $scope.statusDropDown = [];
            for (var item in $scope.statusMap) {
                $scope.statusDropDown.push(item);
            }

            _loadTaskSettings();
        };

        $scope.save_click = function () {
            $scope.siriusConfigService.tasks.selectedStatus = $scope.selectedStatus;
            $scope.siriusConfigService.tasks.selectedUserInAssignedToDropDown = $scope.selectedUserInAssignedToDropDown;

            $scope.$emit('closeSettingsScreen');
            if (!$scope.currentConfigValues.showProgramOverview) {
                $rootScope.$broadcast('reloadTasks');
            }
        };

        // Search as-you-type on type ahead
        $scope.startSearchAsYouType = function () {
            var searchString = $scope.searchString;
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program?maxHits=50&excludeOldPrograms=X&query=' + searchString + '&sap-language=en').then(function (response) {
                return response.data.data;
            });
        };

        //if searchString is empty, set showDelivery to false
        $scope.$watch('searchString', function (value) {
            if (value === '') {
                $scope.showDelivery = false;
            }
        });

        var _getOwnUser = function () {
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user?sap-language=en&readonly=X').then(function (response) {
                $scope.user = response.data.data;
                return response.data.data;

            });
        };

        //create dummy Delivery for the first Entry
        var _dummyDelivery = function () {
            return { "WORKING_STATE": { "DELIVERY_NAME": "Choose a Delivery" } };
        };

        //create entry for "no founding delivery"
        var _noDelivery = function () {
            return { "WORKING_STATE": { "DELIVERY_NAME": "No delivery maintained yet" } };
        };


        var _getDeliveries = function ($item, doAfterLoad) {
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '/delivery?sap-language=en&readonly=X').then(function (response) {
                $scope.programGUID = $item.GUID;
                $scope.deliveries = response.data.data;
                $scope.firstdelivery = _dummyDelivery().WORKING_STATE;
                $scope.showDelivery = true;

                if ($scope.deliveries.length === 0) {
                    $scope.firstdelivery = _noDelivery().WORKING_STATE;
                }

                if (doAfterLoad) {
                    doAfterLoad();
                }
            });
        };

        //get Deliveries
        $scope.onSelect = function ($item, doAfterLoad) {
            _getOwnUser();
            _getDeliveries($item, doAfterLoad);
        };

        //get the Taks for given delivery
        $scope.getTasks = function (item) {
            $scope.firstdelivery = item.WORKING_STATE;
            return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $scope.programGUID + '/delivery/' + item.WORKING_STATE.GUID + '/task?sap-language=en&readonly=X').
                then(function (response) {
                    siriusConfigService.tasks.programGUID = $scope.programGUID;
                    $scope.deliveryID = item.WORKING_STATE.GUID;
                    siriusConfigService.tasks.deliveryID = $scope.deliveryID;
                    siriusConfigService.tasks.content = response.data.data;
                    $scope.tasks = response.data.data;
                    $scope.tasks.forEach(function (task) {
                        if (task.WORKING_STATE.USER_ID !== "") {
                            $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user/' + task.WORKING_STATE.USER_ID + '?sap-language=en&readonly=X').then(function (user) {
                                    _updateUserInformation(task, user.data.data);
                                }
                            );
                        }
                    });
                    return response.data;
                });
        };

        //reset Filter ( reset selected user and selected status)
        $scope.resetFilter = function () {
            $scope.tasks = "";
            $scope.deliveryID = "";
            $scope.assignedToUsers = [];
            $scope.selectedUserInAssignedToDropDown = [];
            $scope.selectedStatus = [];
        };

        _init();
    }];
