angular.module('app.atc').service("app.atc.configservice", ['bridgeDataService', function (bridgeDataService) {
	function fillLeadingZero(str) {
		if(str.toString().length === 1) {
			return "0" + str;
		} else {
			return str;
		}
	}
	function toABAPDate(date) {
		if(date && date.getFullYear) {
			return date.getFullYear().toString() + fillLeadingZero(date.getMonth() + 1) + fillLeadingZero(date.getDate()) + "000000";
		} else {
			return "";
		}
	}

    var ConfigItem = function () {
        this.clear = function () {
        	this.srcSystem = "";
            this.srcSystems = [];
            this.devClass = "";
            this.devClasses = [];
            this.tadirResponsible = "";
            this.tadirResponsibles = [];
            this.component = "";
            this.components = [];
            this.softwareComponent = "";
            this.softwareComponents = [];
            this.showSuppressed = false;
            this.displayPrio1 = true;
            this.displayPrio2 = true;
            this.displayPrio3 = false;
            this.displayPrio4 = false;
            this.onlyInProcess = false;
            this.firstOccurence = undefined;
            this.onlyProductionRelevant = false;
        };

        this.isEmpty = function () {
            if (this.srcSystems.length === 0 && this.devClasses.length === 0 && this.tadirResponsibles.length === 0 && this.components.length === 0 && this.softwareComponents.length === 0) {
                return true;
            }
            else {
                return false;
            }
        };

        this.clear();
    };

	var IQueryString = {
		getQueryString : function() { throw "Not Implemented"; }
	};

	var IConfig = {
		newItem : function() { throw "Not Implemented"; },
		addConfigItem : function() { throw "Not Implemented"; },
		getConfigItems: function () { throw "Not Implemented"; }
	};
	IConfig.prototype = Object.create(IQueryString);

	function arrayToQuery(aItems) {
		if(!aItems || aItems.length === 0) {
			return "";
		}
		return aItems.map(function(item) {
			if(item.exclude) {
				return "!" + item.value;
			} else {
				return item.value;
			}
		}).join(",");
	}

	ConfigItem.prototype = Object.create(IQueryString);
	ConfigItem.prototype.getQueryString = function() {
		var query = arrayToQuery(this.srcSystems) + ';' + arrayToQuery(this.devClasses) + ';' + this.tadirResponsibles.map(function(responsible) { return (responsible.exclude ? "!" : "") + (responsible.SAPNA ? responsible.SAPNA : responsible); }).join(",") + ';' + arrayToQuery(this.components) + ';';
		query += this.showSuppressed ? "X;" : ";";
		query += this.displayPrio1 ? "X;" : ";";
		query += this.displayPrio2 ? "X;" : ";";
		query += this.displayPrio3 ? "X;" : ";";
		query += this.displayPrio4 ? "X;" : ";";
		query += this.onlyInProcess ? "X;" : ";";
		query += arrayToQuery(this.softwareComponents) + ";";
		query += this.onlyProductionRelevant ? "*FA*;" : ";";
		query += this.firstOccurence ? toABAPDate(this.firstOccurence) : "";
		return query;
	};

	var Config = function() {
	    this.configItems = [];
	    this.isInitialized = false;
	    this.detailsColumnVisibility = [true, true, true, true, false, true, false, false, false, false, false, false, false];
	};

	Config.prototype = Object.create(IConfig);
	Config.prototype.newItem = function () {
	    return new ConfigItem();
	};

	Config.prototype.addConfigItem = function(item){
		this.configItems.push(item);
	};
	Config.prototype.getConfigItems = function() {
		return this.configItems;
	};
	Config.prototype.getQueryString = function() {
		var queryString = "";
		for(var i = 0; i < this.getConfigItems().length; i++) {
		    if (i === this.getConfigItems().length - 1) {
		        queryString += this.getConfigItems()[i].getQueryString();
		    }
		    else {
		        queryString += this.getConfigItems()[i].getQueryString() + "|";
		    }
		}
		return queryString;
	};
	Config.prototype.clear = function () {
	    this.configItems.length = 0;
	};

	function parseConfigItems(items) {
		return items.map(function(item) {
			if(item.value) {
				return item;
			} else {
				return {
					value: item
				};
			}
		});
	}

	Config.prototype.initialize = function (sAppId) {
	    this.isInitialized = true;
	    var persistedConfig = bridgeDataService.getAppConfigById(sAppId);

	    if(persistedConfig.detailsColumnVisibility) {
	    	this.detailsColumnVisibility = persistedConfig.detailsColumnVisibility;
	    }

	    var currentConfigItem;

	    if (persistedConfig.configItems) {
	        this.clear();

	        for (var configItem in persistedConfig.configItems) {
	            currentConfigItem = this.newItem();

	            currentConfigItem.components = persistedConfig.configItems[configItem].components ? parseConfigItems(persistedConfig.configItems[configItem].components) : (persistedConfig.configItems[configItem].component ? [{value: persistedConfig.configItems[configItem].component}] : []);
	            currentConfigItem.devClasses = persistedConfig.configItems[configItem].devClasses ? parseConfigItems(persistedConfig.configItems[configItem].devClasses) : (persistedConfig.configItems[configItem].devClass ? [{value: persistedConfig.configItems[configItem].devClass}] : []);
	            currentConfigItem.displayPrio1 = persistedConfig.configItems[configItem].displayPrio1;
	            currentConfigItem.displayPrio2 = persistedConfig.configItems[configItem].displayPrio2;
	            currentConfigItem.displayPrio3 = persistedConfig.configItems[configItem].displayPrio3;
	            currentConfigItem.displayPrio4 = persistedConfig.configItems[configItem].displayPrio4;
	            currentConfigItem.onlyInProcess = persistedConfig.configItems[configItem].onlyInProcess;
	            currentConfigItem.showSuppressed = persistedConfig.configItems[configItem].showSuppressed;
              	currentConfigItem.softwareComponents = persistedConfig.configItems[configItem].softwareComponents ? parseConfigItems(persistedConfig.configItems[configItem].softwareComponents) : (persistedConfig.configItems[configItem].softwareComponent ? [{value: persistedConfig.configItems[configItem].softwareComponent}] : []);
	            currentConfigItem.srcSystems = persistedConfig.configItems[configItem].srcSystems ? parseConfigItems(persistedConfig.configItems[configItem].srcSystems) : (persistedConfig.configItems[configItem].srcSystem ? [{value: persistedConfig.configItems[configItem].srcSystem}] : []);
	            currentConfigItem.tadirResponsibles = persistedConfig.configItems[configItem].tadirResponsibles ? persistedConfig.configItems[configItem].tadirResponsibles : (persistedConfig.configItems[configItem].tadirResponsible ? [persistedConfig.configItems[configItem].tadirResponsible] : []);
	            currentConfigItem.onlyProductionRelevant = persistedConfig.configItems[configItem].onlyProductionRelevant;
	            currentConfigItem.firstOccurence = persistedConfig.configItems[configItem].firstOccurence ? new Date(persistedConfig.configItems[configItem].firstOccurence) : undefined;

	            this.addConfigItem(currentConfigItem);
	        }
	    } else {
	        currentConfigItem = this.newItem();
	        currentConfigItem.tadirResponsibles = [bridgeDataService.getUserInfo()];
	        this.addConfigItem(currentConfigItem);
	    }
	};

	var instances = {};

	this.getConfigForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config();
		}
		return instances[appId];
	};
}]);
