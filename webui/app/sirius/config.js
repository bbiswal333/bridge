angular.module('app.sirius').service("app.sirius.configservice", ["bridgeDataService", function (bridgeDataService) {

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

    var that = this;
    bridgeDataService.getAppsByType("app.sirius")[0].returnConfig = function() {
        return that;
    };
}]);
