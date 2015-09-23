angular.module("app.cats").service('app.cats.configService', ["app.cats.catsUtils", function(catsUtils){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
	this.lastUsedDescriptions = [];
	this.selectedTask = null;
	this.colorScheme = "colorful";

	function getIndex (tasks, task) {
		var index = -1;
		var foundIndex = index;
		tasks.some(function(taskInTasks) {
			index++;
			if (catsUtils.isSameTask(taskInTasks, task)) {
				foundIndex = index;
				return true;
			}
		});
		return foundIndex;
	}

	this.copyConfigIfLoaded = function (catsConfigService) {
		var that = this;
		if (!this.loaded) {
			if (catsConfigService.favoriteItems) {
				this.recalculateTaskIDs(catsConfigService.favoriteItems);
				this.removeInvalidTasks(catsConfigService.favoriteItems);
				this.favoriteItems = catsConfigService.favoriteItems;
				this.favoriteItems.forEach(function(favoriteItem) {
					that.enhanceTask(favoriteItem);
				});
			}
			if (catsConfigService.lastUsedDescriptions) {
				this.lastUsedDescriptions = catsConfigService.lastUsedDescriptions;
			}
			if (catsConfigService.catsProfile) {
				this.catsProfile = undefined;
			}
			if (catsConfigService.colorScheme) {
				this.colorScheme = "colorful";
			}
		}
	};

	this.enhanceTask = function (task) {
		if (!task) {
			return task;
		}
		var enhancedTask = task;

		var taskTypeToDisplay = (task.TASKTYPE || "");
		if (task.ZZSUBTYPE) {
			taskTypeToDisplay = (task.TASKTYPE || "") + " " + task.ZZSUBTYPE;
		}

		enhancedTask.DESCR = task.DESCR || task.ZCPR_OBJGEXTID || task.RAUFNR || taskTypeToDisplay;

		enhancedTask.subDescription = "";

		if (task.ZCPR_EXTID) {
			enhancedTask.subDescription = task.ZCPR_EXTID;
		}

		if (task.RAUFNR) {
			var RAUFNRtoDisplay = task.RAUFNR;
			RAUFNRtoDisplay = RAUFNRtoDisplay.replace(/^0+/, '');
			enhancedTask.subDescription = enhancedTask.subDescription + " (" + RAUFNRtoDisplay + ")";
		}

		if (taskTypeToDisplay) {
			enhancedTask.subDescription = enhancedTask.subDescription + " " + taskTypeToDisplay;
		}

		if (!enhancedTask.id) {
			enhancedTask.id = catsUtils.getTaskID(task);
		}

		return enhancedTask;
	};

	this.recalculateTaskIDs = function (tasks) {
		tasks.forEach(function(task) {
			task.id = catsUtils.getTaskID(task);
		});
	};

	this.removeInvalidTasks = function (tasks) {
		var wrongItem =
			_.find(tasks, {
				"TASKTYPE": "BRIDGE_HEADER"
			});
		var index = tasks.indexOf(wrongItem);
		if (index >= 0) {
			tasks.splice( index, 1 );
		}
	};

	this.updateLastUsedDescriptions = function (task, onlyAddDoNotUpdate) {
		if (task.DESCR === "") {
			return;
		}
		var index = getIndex(this.lastUsedDescriptions, task);
		if (index >= 0) {
			if (onlyAddDoNotUpdate) {
				return;
			} else {
				this.lastUsedDescriptions.splice(index,1);
			}
		}
		if (task.id && !catsUtils.isCproTask(task)) {
			this.lastUsedDescriptions.push(task);
		}
	};

	this.updateDescription = function (task) {
		if (!catsUtils.isCproTask(task) &&
			task.TASKTYPE !== "BRIDGE_HEADER") {
			this.lastUsedDescriptions.some(function(lastUsedDescription){
				if (catsUtils.isSameTask(task, lastUsedDescription) &&
					lastUsedDescription.DESCR !== task.id &&
					lastUsedDescription.DESCR !== task.ZCPR_OBJGEXTID &&
					lastUsedDescription.DESCR !== task.RAUFNR) {
					task.DESCR = lastUsedDescription.DESCR;
					return true;
				}
			});
		}
		this.favoriteItems.some(function(favoriteItem){
			if (catsUtils.isSameTask(task, favoriteItem)) {
				task.DESCR = favoriteItem.DESCR;
				return true;
			}
		});
	};
}]);
