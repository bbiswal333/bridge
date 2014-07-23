angular.module("app.cats").service('app.cats.configService', ["app.cats.data.catsUtils", function(catsUtils){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
	this.selectedTask = null;

	this.updateTaskIfFavorite = function (task) {
		this.favoriteItems.some(function(favItem){
			if (catsUtils.isSameTask(task, favItem)) {
				task.DESCR = favItem.DESCR;
				task.TASKTYPE = favItem.TASKTYPE;
			}
		});
	};
}]);