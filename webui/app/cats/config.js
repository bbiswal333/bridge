angular.module("app.cats").service('app.cats.configService', [function(){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
	this.selectedTask = null;
	this.sundayweekstart = false;

	this.createNewItem = function(task){
		if (!task) {
			return task;
		}
		var newItem   = task;
		newItem.DESCR = task.taskDesc || task.DESCR || task.ZCPR_OBJGEXTID || task.RAUFNR || task.TASKTYPE;
		if (!newItem.id){
			newItem.id = (task.ZCPR_OBJGEXTID || "") + (task.RAUFNR || "") + task.TASKTYPE;
		}
		return newItem;
	};
}]);