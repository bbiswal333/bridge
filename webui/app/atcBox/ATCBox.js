var IQueryString = {
		getQueryString : function() { throw "Not Implemented"; }
};

var IConfig = {
		addConfigItem : function() { throw "Not Implemented"; },
		getConfigItems: function () { throw "Not Implemented"; }
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

atcApp.factory('atcConfig', function(){   
      var config = new Config();
      
      return config;
});