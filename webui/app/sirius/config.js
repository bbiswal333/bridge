angular.module('app.sirius').service("app.sirius.configservice", function () {

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
