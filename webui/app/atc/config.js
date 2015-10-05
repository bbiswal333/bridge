angular.module('app.atc').service("app.atc.configservice", ['bridgeDataService', function (bridgeDataService) {
    var ConfigItem = function () {
        this.clear = function () {
            this.srcSystem = "";
            this.devClass = "";
            this.tadirResponsible = "";
            this.component = "";
            this.softwareComponent = "";
            this.showSuppressed = false;
            this.displayPrio1 = true;
            this.displayPrio2 = true;
            this.displayPrio3 = false;
            this.displayPrio4 = false;
            this.onlyInProcess = false;
        };

        this.isEmpty = function () {
            if (this.srcSystem === "" && this.devClass === "" && this.tadirResponsible === "" && this.component === "" && this.softwareComponent === "") {
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

	ConfigItem.prototype = Object.create(IQueryString);
	ConfigItem.prototype.getQueryString = function() {
		var query = this.srcSystem + ';' + this.devClass + ';' + (this.tadirResponsible.SAPNA ? this.tadirResponsible.SAPNA : this.tadirResponsible) + ';' + this.component + ';';
		query += this.showSuppressed ? "X;" : ";";
		query += this.displayPrio1 ? "X;" : ";";
		query += this.displayPrio2 ? "X;" : ";";
		query += this.displayPrio3 ? "X;" : ";";
		query += this.displayPrio4 ? "X;" : ";";
		query += this.onlyInProcess ? "X;" : ";";
		query += this.softwareComponent;
		return query;
	};

	var Config = function() {
	    this.configItems = [];
	    this.isInitialized = false;
	    this.detailsColumnVisibility = [true, true, true, true, false, true, false, false];
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

	            currentConfigItem.component = persistedConfig.configItems[configItem].component;
	            currentConfigItem.devClass = persistedConfig.configItems[configItem].devClass;
	            currentConfigItem.displayPrio1 = persistedConfig.configItems[configItem].displayPrio1;
	            currentConfigItem.displayPrio2 = persistedConfig.configItems[configItem].displayPrio2;
	            currentConfigItem.displayPrio3 = persistedConfig.configItems[configItem].displayPrio3;
	            currentConfigItem.displayPrio4 = persistedConfig.configItems[configItem].displayPrio4;
	            currentConfigItem.onlyInProcess = persistedConfig.configItems[configItem].onlyInProcess;
	            currentConfigItem.showSuppressed = persistedConfig.configItems[configItem].showSuppressed;
              	currentConfigItem.softwareComponent = persistedConfig.configItems[configItem].softwareComponent ? persistedConfig.configItems[configItem].softwareComponent : "";
	            currentConfigItem.srcSystem = persistedConfig.configItems[configItem].srcSystem;
	            currentConfigItem.tadirResponsible = persistedConfig.configItems[configItem].tadirResponsible;

	            this.addConfigItem(currentConfigItem);
	        }
	    } else {
	        currentConfigItem = this.newItem();
	        currentConfigItem.tadirResponsible = bridgeDataService.getUserInfo();
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
