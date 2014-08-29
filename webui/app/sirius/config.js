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

});
