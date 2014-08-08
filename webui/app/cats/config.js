angular.module("app.cats").service('app.cats.configService', [function(){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
	this.selectedTask = null;
	this.sundayweekstart = false;

	this.getTaskID = function(task) {
		if(task.ZCPR_OBJGEXTID) {
			return task.ZCPR_OBJGEXTID;
		} else {
			return (task.RAUFNR || "") + task.TASKTYPE;
		}
	};

	this.createNewItem = function(task){
		if (!task) {
			return task;
		}
		var newItem   = task;
		newItem.DESCR = task.taskDesc || task.DESCR || task.ZCPR_OBJGEXTID || task.RAUFNR || task.TASKTYPE;
		if (!newItem.id) {
			newItem.id = this.getTaskID(task);
		}
		return newItem;
	};

	this.recalculateTaskIDs = function(tasks) {
		var that = this;
		tasks.forEach(function(task) {
			task.id = that.getTaskID(task);
		});
	};
}]);