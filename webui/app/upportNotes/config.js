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
			var that = this;
			this.programs = [];
			this.softwareComponents = [];

			this.getPrograms = function() {
				return this.programs.map(function(program) { return program; });
			};

			function getProgramByGUID(programGUID) {
				for(var i = 0, length = that.programs.length; i < length; i++) {
					if(that.programs[i].PRG_ID === programGUID) {
						return that.programs[i];
					}
				}
				return undefined;
			}

			function getSoftwareComponent(softwareComponent) {
				for(var i = 0, length = that.softwareComponents.length; i < length; i++) {
					if(that.softwareComponents[i].Component === softwareComponent) {
						return that.softwareComponents[i];
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
				this.programs.push(program);
				return program;
			};

			this.removeProgram = function(program) {
				if(this.programs.indexOf(program) >= 0) {
					this.programs.splice(this.programs.indexOf(program), 1);
				}
			};

			this.getSoftwareComponents = function() {
				return this.softwareComponents.map(function(softwareComponent) { return softwareComponent; });
			};

			this.addSoftwareComponent = function(softwareComponent) {
				var component = getSoftwareComponent(softwareComponent);
				if(component) {
					return component;
				}

				component = {Component: softwareComponent, exclude: false};
				this.softwareComponents.push(component);
				return component;
			};

			this.removeSoftwareComponent = function(softwareComponent) {
				if(this.softwareComponents.indexOf(softwareComponent) >= 0) {
					this.softwareComponents.splice(this.softwareComponents.indexOf(softwareComponent), 1);
				}
			};

			this.startEditing = function() {
				return new EditableConfigItem(this);
			};

			this.toJSON = function() {
				return JSON.parse(
					JSON.stringify({
						programs: this.programs,
						softwareComponents: this.softwareComponents
					})
				);
			};

			this.fromJSON = function(oJSON) {
				this.programs = oJSON.programs;
				this.softwareComponents = oJSON.softwareComponents;
				return this;
			};
		};
	})();

	EditableConfigItem.prototype = new ConfigItem();

	var Config = (function() {
		return function(appId) {
			var initialized = false;
			this.configItems = [];

			this.getItems = function() {
				return this.configItems;
			};

			this.getNewItem = function() {
				return new ConfigItem();
			};

			this.addItem = function(item) {
				this.configItems.push(item);
			};

			this.removeItem = function(item) {
				if(this.configItems.indexOf(item) >= 0) {
					this.configItems.splice(this.configItems.indexOf(item), 1);
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
				return JSON.parse(JSON.stringify({configItems: this.configItems}));
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
