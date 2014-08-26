angular.module('app.sirius').appSiriusSettings =
['$scope', "app.sirius.configservice","app.sirius.taskFilterConstants","$http", function ($scope, siriusConfigService,taskFilterConstants,$http) {

    $scope.siriusConfigService=siriusConfigService;
	$scope.currentConfigValues = siriusConfigService.configItem;
    $scope.showDelivery=false;
    $scope.programGUID="";
    $scope.deliveryID="";
    $scope.tasks="";
    $scope.assignedToUsers = [];
    $scope.selectedUserInAssignedToDropDown = [];
    $scope.selectedTasks = [];
    $scope.selectedStatus = [];
    $scope.user="";

    $scope.classMap = {
        "Open": "taskStatusOpen",
        "In Process": "taskStatusInProcess",
        "Not Applicable": "taskStatusNA",
        "Completed": "taskStatusCompleted",
        "Critical": "taskStatusCritical"
    };

    $scope.$watch('selectedStatus', function(newVals, oldVals) {
        $scope.selectedStatus;
    }, true);

    $scope.$watch('selectedUserInAssignedToDropDown', function(newVals, oldVals) {
        $scope.selectedUserInAssignedToDropDown;
    }, true);

    $scope.save_click = function () {
        $scope.siriusConfigService.tasks.selectedStatus=$scope.selectedStatus;
        $scope.siriusConfigService.tasks.selectedUserInAssignedToDropDown=$scope.selectedUserInAssignedToDropDown;
        $scope.$emit('closeSettingsScreen');
    };

    // Search as-you-type on type ahead
    $scope.startSearchAsYouType = function () {
        var searchString = $scope.searchString;
        return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program?maxHits=50&excludeOldPrograms=X&query=' + searchString + '&sap-language=en').then(function (response) {
            var programs = [];
            programs = response.data.data;
            return programs;
        });
    };

    //if searchString is empty, set showDelivery to false
    $scope.$watch('searchString', function (value) {
        if (value === '') {
            $scope.showDelivery = false;
        }
    });

    $scope.$watch('selectedStatus', function(newVals, oldVals) {
    }, true);

    //get Deliveries
    $scope.onSelect = function ($item) {
        _getOwnUser();
        _getDeliveries($item);
    };

    $scope.statusMap = {
        "Open": taskFilterConstants.OPEN_STATUS(),
        "In Process": taskFilterConstants.IN_PROCESS_STATUS(),
        "Not Applicable": taskFilterConstants.NOT_APPLICABLE_STATUS(),
        "Completed": taskFilterConstants.COMPLETED_STATUS(),
        "Critical": taskFilterConstants.CRITICAL_STATUS()
    };

    $scope.statusDropDown = [];
    for (var item in $scope.statusMap) {
        $scope.statusDropDown.push(item);
    }

    // set Delivery Name to show in the Dropbox
    $scope.getTasks = function(item) {
        _resetFilter();
        $scope.firstdelivery= item.WORKING_STATE;
        return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $scope.programGUID + '/delivery/'+item.WORKING_STATE.GUID+'/task?sap-language=en').
            then(function (response) {
            siriusConfigService.tasks.programGUID=$scope.programGUID;
            $scope.deliveryID=item.WORKING_STATE.GUID;
            siriusConfigService.tasks.deliveryID=$scope.deliveryID;
            siriusConfigService.tasks.content=response.data.data;
            $scope.tasks=response.data.data;
            $scope.tasks.forEach(function(task){
                if (task.WORKING_STATE.USER_ID != "") {
                    $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user/' + task.WORKING_STATE.USER_ID + '?sap-language=en').then(function (user) {
                            _updateUserInformation(task, user.data.data);
                        }
                    );
                }
            });
            return response.data;
        });
    };

    var _getOwnUser=function(){
        return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/user?sap-language=en').then(function(response){
            $scope.user=response.data.data;
            return response.data.data;

        });
    };

    var _updateUserInformation = function(task, user) {
        // Updates the user Information in the given task
        if (user && user.BNAME && user.BNAME !== '') {
            task.WORKING_STATE.USER_ID = user.BNAME
            task.WORKING_STATE.USER_ID_DISPLAY = user.VORNA + " " + user.NACHN + " (" + user.BNAME + ")";
            task.WORKING_STATE.USER_ID_DISPLAY_LAST = task.WORKING_STATE.USER_ID_DISPLAY;
            task.WORKING_STATE.VORNA = user.VORNA;
            task.WORKING_STATE.NACHN = user.NACHN;
            //ADD USER TO DROP DOWN LIST FOR ASSIGNED TO USERS
            _addUserToAssignedToUserDropDown(user.VORNA + " " + user.NACHN, user.BNAME);
        }  else {
            // No User is selected, set the attributes empty
            task.WORKING_STATE.USER_ID_DISPLAY = '';
            task.WORKING_STATE.USER_ID_DISPLAY_LAST = '';
            task.WORKING_STATE.VORNA = '';
            task.WORKING_STATE.NACHN = '';
            // For the filter to work correctly, the USER_ID column must contain something
            task.WORKING_STATE.USER_ID = taskFilterConstants.USER_ID_EMPTY();
        }
    };

    var _addUserToAssignedToUserDropDown = function (name, id) {

       if (_.findIndex($scope.assignedToUsers,{'id':id})===-1)
        {
            if (id.toUpperCase() == $scope.user.BNAME.toUpperCase()) {
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

    var _getDeliveries=function($item) {
        return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + $item.GUID + '/delivery?sap-language=en').then(function (response) {
            $scope.programGUID=$item.GUID;
            $scope.deliveries = response.data.data;
            $scope.firstdelivery= _dummyDelivery().WORKING_STATE;
            $scope.showDelivery=true;

            if($scope.deliveries.length==0){
                $scope.firstdelivery=_noDelivery().WORKING_STATE;
                };
        });
    };

    //create dummy Delivery for the first Entry
    var _dummyDelivery=function(){
        var dummyDeliveryResponse=
        {
            "WORKING_STATE":
            {
                "DELIVERY_NAME":"Choose a Delivery"
            }
        };
        return dummyDeliveryResponse;
    };

    //create entry for "no founding delivery"
    var _noDelivery=function(){
        var noDelivery=
        {
            "WORKING_STATE":
            {
                "DELIVERY_NAME":"No delivery maintained yet"
            }
        };
        return noDelivery;
    };

    //reset Filter ( reset selected user and selected status)
    var _resetFilter=function(){
        $scope.tasks="";
        $scope.deliveryID="";
        $scope.assignedToUsers = [];
        $scope.selectedUserInAssignedToDropDown = [];
        $scope.selectedStatus = [];

    };
}];
