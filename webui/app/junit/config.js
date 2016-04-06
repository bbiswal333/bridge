angular.module('app.junit').service("app.junit.configService", ['bridgeDataService', function (bridgeDataService) {
  var ConfigItem = function () {
    this.clear = function () {
      this.url = "";
    };

    this.isEmpty = function () {
      if (this.url === "") {
        return true;
      }
      else {
        return false;
      }
    };

    this.clear();
  };

	var IConfig = {
		newItem : function() { throw "Not Implemented"; },
		addConfigItem : function() { throw "Not Implemented"; },
		getConfigItems: function () { throw "Not Implemented"; }
	};

	var Config = function() {
	  this.configItems = [];
	  this.isInitialized = false;
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

  Config.prototype.clear = function () {
	  this.configItems.length = 0;
	};

  Config.prototype.initialize = function (sAppId) {
    this.isInitialized = true;
    var persistedConfig = bridgeDataService.getAppConfigById(sAppId);
    var currentConfigItem;

    if (persistedConfig.configItems) {
      this.clear();

      for (var configItem in persistedConfig.configItems) {
        currentConfigItem = this.newItem();

        currentConfigItem.url = persistedConfig.configItems[configItem].url;

        this.addConfigItem(currentConfigItem);
      }
    } else {
      this.clear();
    }
	};

	var instances = {};

	this.getConfigForAppId = function(appId) {
		if(instances[appId] === undefined) {
			instances[appId] = new Config();
      bridgeDataService.getAppById(appId).returnConfig = function() {
        return instances[appId];
      };
		}
		return instances[appId];
	};
}]);
