angular.module("app.cats").service('app.cats.configService', [function(){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
	this.selectedTask = null;

	this.createNewItem = function(task){
		var newItem   = task;
		newItem.id    = (task.ZCPR_OBJGEXTID || "") + (task.RAUFNR || "") + task.TASKTYPE;
		newItem.DESCR = task.taskDesc || task.DESCR || task.ZCPR_OBJGEXTID || task.RAUFNR || task.TASKTYPE;
		return newItem;
	};
}]);