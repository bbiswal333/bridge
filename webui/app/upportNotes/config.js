angular.module('app.upportNotes').service("app.upportNotes.configService", ['$q', 'bridgeDataService', 'bridge.AKHResponsibleFactory', function ($q, bridgeDataService, AKHResponsibleFactory) {
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
			this.applicationComponents = [];
			this.processors = [];
			this.akhResponsibles = [];

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

			function getApplicationComponent(applicationComponent) {
				for(var i = 0, length = that.applicationComponents.length; i < length; i++) {
					if(that.applicationComponents[i].Component === applicationComponent) {
						return that.applicationComponents[i];
					}
				}
				return undefined;
			}

			function getProcessor(sProcessor) {
				for(var i = 0, length = that.processors.length; i < length; i++) {
					if(that.processors[i].UserID === sProcessor) {
						return that.processors[i];
					}
				}
				return undefined;
			}

			function getAKHResponsible(oAKHResponsible) {
				for(var i = 0, length = that.akhResponsibles.length; i < length; i++) {
					if(that.akhResponsibles[i].getUserId() === oAKHResponsible.getUserId()) {
						return that.akhResponsibles[i];
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

			this.getApplicationComponents = function() {
				return this.applicationComponents.map(function(applicationComponent) { return applicationComponent; });
			};

			this.addApplicationComponent = function(applicationComponent) {
				var component = getApplicationComponent(applicationComponent);
				if(component) {
					return component;
				}

				component = {Component: applicationComponent, exclude: false};
				this.applicationComponents.push(component);
				return component;
			};

			this.removeApplicationComponent = function(applicationComponent) {
				if(this.applicationComponents.indexOf(applicationComponent) >= 0) {
					this.applicationComponents.splice(this.applicationComponents.indexOf(applicationComponent), 1);
				}
			};

			this.getProcessors = function() {
				return this.processors.map(function(processor) { return processor; });
			};

			this.addProcessor = function(sProcessor) {
				var processor = getProcessor(sProcessor);
				if(processor) {
					return processor;
				}

				processor = {UserID: sProcessor, exclude: false};
				this.processors.push(processor);
				return processor;
			};

			this.removeProcessor = function(processor) {
				if(this.processors.indexOf(processor) >= 0) {
					this.processors.splice(this.processors.indexOf(processor), 1);
				}
			};

			this.getAKHResponsibles = function() {
				return this.akhResponsibles.map(function(responsible) { return responsible; });
			};

			this.addAKHResponsible = function(responsible) {
				var akhResponsible = getAKHResponsible(responsible);
				if(akhResponsible) {
					return akhResponsible;
				}
				this.akhResponsibles.push(responsible);
				return responsible;
			};

			this.removeAKHResponsible = function(responsible) {
				if(this.akhResponsibles.indexOf(responsible) >= 0) {
					this.akhResponsibles.splice(this.akhResponsibles.indexOf(responsible), 1);
				}
			};

			this.setCreationDate = function(dDate) {
				this.creationDate = dDate;
			};

			this.getCreationDate = function() {
				return this.creationDate;
			};

			this.clearCreationDate = function() {
				this.creationDate = undefined;
			};

			this.startEditing = function() {
				return new EditableConfigItem(this);
			};

			this.toJSON = function() {
				return JSON.parse(
					JSON.stringify({
						programs: this.programs,
						softwareComponents: this.softwareComponents,
						applicationComponents: this.applicationComponents,
						processors: this.processors,
						akhResponsibles: this.akhResponsibles,
						creationDate: this.creationDate
					})
				);
			};

			this.fromJSON = function(oJSON) {
				this.programs = oJSON.programs;
				this.softwareComponents = oJSON.softwareComponents;
				this.applicationComponents = oJSON.applicationComponents ? oJSON.applicationComponents : [];
				this.processors = oJSON.processors ? oJSON.processors : [];
				this.akhResponsibles = oJSON.akhResponsibles ? oJSON.akhResponsibles.map(function(responsible) { return AKHResponsibleFactory.createInstance(responsible.property, responsible.userId); }) : [];
				this.creationDate = oJSON.creationDate ? new Date(oJSON.creationDate) : undefined;
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
