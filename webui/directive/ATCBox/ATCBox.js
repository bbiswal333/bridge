var IATCDataProvider = {
		getResultForConfig : function(config, scope) { throw "Not Implemented"; },
};

var ATCDataProvider = function(http){
	this.http = http;
};

ATCDataProvider.prototype = Object.create(IATCDataProvider);

ATCDataProvider.prototype.getResultForConfig = function (config, scope) {
	scope.atcData = {
		prio1: 10,
		prio2: 0,
		prio3: 0,
		prio4: 0
	};

	this.http.get('http://localhost:8000/api/atc?query=' + config.getQueryString() + '&count_prios=X&format=json').success(function(data) {

		scope.atcData = {
			prio1: data.PRIOS.PRIO1,
			prio2: data.PRIOS.PRIO2,
			prio3: data.PRIOS.PRIO3,
			prio4: data.PRIOS.PRIO4
		};

	});
};

bridgeServices.factory('ATCDataProvider', ['$http',
   function ($http) {
       return new ATCDataProvider($http);
   }]);

var IQueryString = {
		getQueryString : function() { throw "Not Implemented"; }
};

var IConfig = {
		addConfigItem : function() { throw "Not Implemented"; },
		getConfigItems : function() { throw "Not Implemented"; }
};
IConfig.prototype = Object.create(IQueryString);

var ConfigItem = function() {
	this.srcSystem = "";
	this.devClass = "";
	this.tadirResponsible = "";
	this.component = "";
	this.showSuppressed = false;
	this.displayPrio1 = false;
	this.displayPrio2 = false;
	this.displayPrio3 = false;
	this.displayPrio4 = false;
	this.onlyInProcess = false;
};

ConfigItem.prototype = Object.create(IQueryString);
ConfigItem.prototype.getQueryString = function() {
	var query = this.srcSystem + ';' + this.devClass + ';' + this.tadirResponsible + ';' + this.component + ';';
	query += this.showSuppressed ? "X;" : ";";
	query += this.displayPrio1 ? "X;" : ";";
	query += this.displayPrio2 ? "X;" : ";";
	query += this.displayPrio3 ? "X;" : ";";
	query += this.displayPrio4 ? "X;" : ";";
	query += this.onlyInProcess ? "X" : "";
	
	return query;
};


var Config = function() {
	this.configItems = [];
};

Config.prototype = Object.create(IConfig);
Config.prototype.addConfigItem = function(item){
	this.configItems.push(item);
};
Config.prototype.getConfigItems = function() {
	return this.configItems;
};
Config.prototype.getQueryString = function() {
	queryString = "";
	for(var i = 0; i < this.getConfigItems().length; i++) {
		if(i == this.getConfigItems().length - 1)
			queryString += this.getConfigItems()[i].getQueryString(); 
		else
			queryString += this.getConfigItems()[i].getQueryString() + "|"; 
	}
	return queryString;
};

bridgeServices.factory('Config', [
  function(){
      var configItem = new ConfigItem();
      configItem.srcSystem = "CI3";
      configItem.displayPrio1 = true;
      configItem.displayPrio2 = true;
      configItem.displayPrio3 = true;
      configItem.displayPrio4 = true;
      
      var config = new Config();
      config.addConfigItem(configItem);
      
      return config;
  }]);