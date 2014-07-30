angular.module('app.imtps').factory("app.imtps.configservice", [ 'bridgeDataService' , function (bridgeDataService) {
	var config = {  data 		 : { tcQuery: '' } , 
					isInitialized: false };
	
	config.initialize = function (sAppId) {
		console.log(sAppId);
	    this.isInitialized = true;
	    var persistedConfig = bridgeDataService.getAppConfigById(sAppId);

	    if ( persistedConfig.data ) {
	    	console.log( persistedConfig.data.tcQuery );
	    	this.data.tcQuery = persistedConfig.data.tcQuery;
	    } else {
	    	this.data.tcQuery = '';
	    }
	};
	
	return config;
}] );