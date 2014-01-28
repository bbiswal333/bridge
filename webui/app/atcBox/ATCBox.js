var IATCDataProvider = {
    getResultForConfig: function (config, scope) { throw "Not Implemented"; },
    getDetailsForConfig: function (config, scope) { throw "Not Implemented"; }
};

var ATCDataProvider = function(http){
	this.http = http;
};

ATCDataProvider.prototype = Object.create(IATCDataProvider);

ATCDataProvider.prototype.getResultForConfig = function (scope, config, dataService) {

    this.http.get('http://localhost:8000/api/get?url=' + encodeURIComponent('https://ifdmain.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RES_CN?query=' + config.getQueryString() + '&count_prios=X&format=json'))
        .success(function (data) {

            dataService.data = {
                prio1: data.PRIOS.PRIO1,
                prio2: data.PRIOS.PRIO2,
                prio3: data.PRIOS.PRIO3,
                prio4: data.PRIOS.PRIO4,
            };

            scope.$emit('appInitialized', { id: scope.boxId });
    });
};

ATCDataProvider.prototype.getDetailsForConfig = function (config, scope) {
    this.http.get('http://localhost:8000/api/get?url=' +
    	encodeURIComponent('https://ifdmain.wdf.sap.corp:443/sap/bc/devdb/STAT_CHK_RESULT?query=' + config.getQueryString() + '&format=json')).success(function (data) {

        scope.atcDetails = data.DATA;
    });
};

atcApp.factory('ATCDataProvider', ['$http',
   function ($http) {
       return new ATCDataProvider($http);
   }]);

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

atcApp.factory('Config', function(){   
      var config = new Config();
      
      return config;
});