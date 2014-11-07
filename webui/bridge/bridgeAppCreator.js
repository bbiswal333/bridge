angular.module("bridge.service").service("bridge.service.appCreator", ["bridge.service.loader", "$route", function(loader, $route) {
	var apps = loader.apps;
	var instances = {};

	function findAppByModuleName(moduleName) {
		var result;
		apps.map(function(app) {
			if(app.module_name === moduleName) {
				result = app;
			}
		});
		if(result === undefined) {
			throw new Error("App not found: " + moduleName);
		}
		return result;
	}

	function splitIntoModuleNameAndInstanceNumber(guid) {
		var moduleName = guid.substring(0, guid.lastIndexOf("-"));
		var instanceNumber = parseInt(guid.substring(guid.lastIndexOf("-") + 1));
		return {moduleName: moduleName, instanceNumber: instanceNumber};
	}

	function findNextInstanceNumberForModule(moduleName) {
		var highest = 0;
		instances[moduleName].map(function(instance) {
			if(instance.metadata.instanceNumber > highest) {
				highest = instance.metadata.instanceNumber;
			}
		});
		return highest + 1;
	}

	function checkIfModuleIsMultiInstance(module) {
		if(instances[module.module_name].length > 0 && !module.multiInstance) {
			throw new Error("App is not a multi-instance widget and can not be instantiated more than once: " + module.module_name);
		}
	}

	function assignGuidToApp(app, metaData) {
		if(metaData.guid) {
			var existingApp;
			try {
				existingApp = this.getInstanceById(metaData.guid);
			} catch(e) {
				var parsedGuid = splitIntoModuleNameAndInstanceNumber(metaData.guid);
				app.metadata.instanceNumber = parsedGuid.instanceNumber;
			}
			if(existingApp !== undefined) {
				throw new Error("App id already in use: " + metaData.guid);
			}
		} else {
			app.metadata.instanceNumber = findNextInstanceNumberForModule(metaData.module_name);
		}
		app.metadata.guid = metaData.module_name + "-" + app.metadata.instanceNumber;
	}

	this.createInstance = function(metaData, config) {
		if(!metaData || !metaData.module_name) {
			throw new Error("Invalid input data");
		}

		var type = metaData.module_name;

		var module = findAppByModuleName(type);
		if(instances[type] === undefined) {
			instances[type] = [];
		}
		checkIfModuleIsMultiInstance(module);

		var app = {};
		app.metadata = angular.copy(module);
		app.appConfig = config;

		assignGuidToApp.call(this, app, metaData);

		if(metaData.title) {
			app.metadata.title = metaData.title;
		}

		instances[type].push(app);
		return app;
	};

	this.hasInstanceWithId = function(guid) {
		try {
			this.getInstanceById(guid);
			return true;
		} catch(e) {
			return false;
		}
	};

	this.getInstanceById = function(guid) {
		var parsedGuid = splitIntoModuleNameAndInstanceNumber(guid);
		var match;
		instances[parsedGuid.moduleName].map(function(instance) {
			if(instance.metadata.guid === guid) {
				match = instance;
			}
		});
		if(match === undefined) {
			throw new Error("App instance not found for given id: " + guid);
		}
		return match;
	};

	this.removeInstanceById = function(guid) {
		var parsedGuid = splitIntoModuleNameAndInstanceNumber(guid);
		var instance = this.getInstanceById(guid);
		instances[parsedGuid.moduleName].splice(instances[parsedGuid.moduleName].indexOf(instance) ,1);
	};

	this.getInstancesByType = function(type) {
		return instances[type];
	};
}]);
