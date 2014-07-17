angular.module("app.cats").service('app.cats.configService', function(){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];

	this.updateTaskIfFavorite = function (task) {
		this.favoriteItems.some(function(favItem){
			if (task.ZCPR_OBJGEXTID === favItem.ZCPR_OBJGEXTID && task.RAUFNR === favItem.RAUFNR) {
				task.DESCR = favItem.DESCR;
				task.TASKTYPE = favItem.TASKTYPE;
			}
		});
	};
});