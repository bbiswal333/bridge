angular.module("app.bwPcStatus.data", [] ).service("app.bwPcStatus.dataService", [ "$http", "$q", "$window", function ($http, $q, $window) {
	this.data = {};
	this.data.chains = [];
	this.data.configContents = {};
	this.data.search = {};
	this.data.search.ANALYZED_STATUS = '';
	this.getChainStatus = function( configContents ) {

		var deferred = $q.defer();
		var that = this;
		that.data.statusObject = {};

		$http.get("https://ifp.wdf.sap.corp/sap/bc/devrep/MYPCSTATUS" + "?origin=" + $window.location.origin ) 
		.success(function(data) {			
			data = new X2JS().xml_str2json(data);	
			that.data.statusObject = data.abap.values.PCMON_NUM;
			that.data.chains       = data.abap.values.PCMON_RESULT.ZDRP_PCLOGRES_S;

			var NUM_NORUN = 0;

			for (var i = 0; i < that.data.chains.length; i++) {
				var lastRun = new Date(that.data.chains[i].STARTDATUM + ' ' +  that.data.chains[i].STARTZEIT);
				var currentTime = new Date();
				var timeDifference = ( currentTime - lastRun) / (1000*60*60);
				if (timeDifference >= 24) {
					that.data.chains[i].ANALYZED_STATUS = that.data.chains[i].ANALYZED_STATUS + 'N';
					NUM_NORUN++;
				};	
			};

			that.data.statusObject.NUM_NORUN = NUM_NORUN;

			deferred.resolve();
		});		
		return deferred.promise;
	};

	this.getContents = function(){

		var deferred = $q.defer();
		var that = this;

		$http.get("https://ifp.wdf.sap.corp/sap/bc/devrep/MYPCSTATUS?function=getAllContents" + "&origin=" + $window.location.origin ) 
		.success(function(data) {
			data = new X2JS().xml_str2json(data);	
			that.data.configContents = data.abap.values.CONTENTS.ZDEVDB_CONTENTS;
			deferred.resolve();
		});		
		return deferred.promise;
	};

	this.setAssignedContents = function(contents){

		var url = "https://ifp.wdf.sap.corp/sap/bc/devrep/MYPCSTATUS?function=setAssignedContents&amountOfContents=";
		var amountOfContents = 0;
		var contentsUrl = "";
		var that = this;
		var deferred = $q.defer();


		for (var i = 0; i < contents.length; i++) {
			if(contents[i].active){ 
				amountOfContents = amountOfContents + 1;
				contentsUrl = contentsUrl + "&" + amountOfContents + "="+ contents[i].CONTID; 
			}
		};

		url = url + amountOfContents + "&" + contentsUrl;

		$http.get(url + "&origin=" + $window.location.origin)
		.success(function(data) {
			console.log("Config saved in IFP for Process Chain Monitor");
			deferred.resolve();
		});	

		return deferred.promise;
	};

}]);
 