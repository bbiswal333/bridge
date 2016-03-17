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

			this.addProgram = function(programGUID) {
				var program = {PRG_ID: programGUID, exclude: false};
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
				var component = {Component: softwareComponent, exclude: false};
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
			};
		};
	})();

	EditableConfigItem.prototype = new ConfigItem();

	var Config = (function() {
		return function() {
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
		};
	})();

	var instances = {};

	this.getConfigForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config();
		}
		return instances[appId];
	};
}]);
