angular.module('app.sirius').service("app.sirius.configservice", function ($http) {
var _this=this;
	this.configItem = {
		boxSize : '2',
        showProgramOverview: true
	};

    this.tasks = {
        programGUID : '',
        deliveryID: '',
        content:'',
        selectedStatus:'',
        selectedUserInAssignedToDropDown:''
    };

    this.getAllTasks=function(programGUID,deliveryID){
        return $http.get(siriusUtils.adjustURLForRunningEnvironment() + '/program/' + programGUID + '/delivery/'+deliveryID+'/task?sap-language=en').then(function (response) {
            _this.tasks.programGUID=programGUID;
            _this.tasks.deliveryID=deliveryID;
            _this.tasks.content=response.data;
            return response.data;
        })

    };


});
