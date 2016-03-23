angular.module('app.upportNotes').service("app.upportNotes.configService", ['$q', 'bridgeDataService', function ($q, bridgeDataService) {
	var EditableConfigItem = (function() {
		return function(configItem) {
			this.fromJSON(configItem.toJSON());

			this.applyChanges = function() {
				configItem.fromJSON(this.toJSON());
			};
		};
	})();

	var ConfigItem = (function() {
		return function() {
			var programs = [];
			var softwareComponents = [];

			this.getPrograms = function() {
				return programs;
			};

			function getProgramByGUID(programGUID) {
				for(var i = 0, length = programs.length; i < length; i++) {
					if(programs[i].PRG_ID === programGUID) {
						return programs[i];
					}
				}
				return undefined;
			}

			function getSoftwareComponent(softwareComponent) {
				for(var i = 0, length = softwareComponents.length; i < length; i++) {
					if(softwareComponents[i].Component === softwareComponent) {
						return softwareComponents[i];
					}
				}
				return undefined;
			}

			this.addProgram = function(programGUID, displayText) {
				var program = getProgramByGUID(programGUID);
				if(program) {
					return program;
				}

				program = {PRG_ID: programGUID, DisplayText: displayText, exclude: false};
				programs.push(program);
				return program;
			};

			this.removeProgram = function(program) {
				if(programs.indexOf(program) >= 0) {
					programs.splice(programs.indexOf(program), 1);
				}
			};

			this.getSoftwareComponents = function() {
				return softwareComponents;
			};

			this.addSoftwareComponent = function(softwareComponent) {
				var component = getSoftwareComponent(softwareComponent);
				if(component) {
					return component;
				}

				component = {Component: softwareComponent, exclude: false};
				softwareComponents.push(component);
				return component;
			};

			this.removeSoftwareComponent = function(softwareComponent) {
				if(softwareComponents.indexOf(softwareComponent) >= 0) {
					softwareComponents.splice(softwareComponents.indexOf(softwareComponent), 1);
				}
			};

			this.startEditing = function() {
				return new EditableConfigItem(this);
			};

			this.toJSON = function() {
				return JSON.parse(
					JSON.stringify({
						programs: programs,
						softwareComponents: softwareComponents
					})
				);
			};

			this.fromJSON = function(oJSON) {
				programs = oJSON.programs;
				softwareComponents = oJSON.softwareComponents;
				return this;
			};
		};
	})();

	EditableConfigItem.prototype = new ConfigItem();

	var Config = (function() {
		return function(appId) {
			var initialized = false;
			var configItems = [];

			this.getItems = function() {
				return configItems;
			};

			this.getNewItem = function() {
				return new ConfigItem();
			};

			this.addItem = function(item) {
				configItems.push(item);
			};

			this.removeItem = function(item) {
				if(configItems.indexOf(item) >= 0) {
					configItems.splice(configItems.indexOf(item), 1);
				}
			};

			this.initialize = function() {
				var that = this;
				var config = bridgeDataService.getAppConfigById(appId);
				if(!config.configItems || initialized === true) {
					return;
				}

				config.configItems.map(function(item) {
					that.addItem(that.getNewItem().fromJSON(item));
				});
				initialized = true;
			};

			this.toJSON = function() {
				return JSON.parse(JSON.stringify({configItems: configItems}));
			};
		};
	})();

	var instances = {};

	this.getConfigForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config(appId);
		}
		return instances[appId];
	};
}]);
