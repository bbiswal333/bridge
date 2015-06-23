angular.module("app.dumps").service("app.dumps.dumpData",
	["$rootScope","$http", "$q", "$window", "$location", "bridgeDataService", "notifier", "bridge.converter","app.dumps.configservice", 
	function($rootScope, $http, $q, $window, $location, bridgeDataService, notifier, converter, oConfigService){
		var Data = function(appId) {
			var that = this;

			this.appId = appId;
			this.isInitialized = {value:false};
			this.mode = "day";
	
            this.dumps = [
            	{ key: "day"  , description: "24 hrs", count: 0 }, 
            	{ key: "week" , description: "7 days" , count: 0 },
            	{ key: "month", description: "30 days"   , count: 0 }]; 
            	//{ key: "others", description: "Unsolved 24 hrs",  count: 0 }];

            this.dumpList = { "day"		: [],
                              "week"	: [],
                              "month"	: []};

            this.currentDumpList = [];

			var fnUpdate = function() {
			 	that.currentDumpList.length = 0;
			 	var aList = that.dumpList[that.mode];
			 	for(var i=0; i<Math.min(aList.length,8);i++ ) {
			 		that.currentDumpList.push(aList[i]);
			 	}
			};

            this.loadOverview = function() {
           		var oConfig = oConfigService.getConfigForAppId(appId);
           		var sUrl = oConfig.getUrl();//(oConfig.configItem.system && oConfig.configItem.system === "VERILAB") ? 'https://vns.wdf.sap.corp/sap' : 'https://ace-cust002.dev.sapbydesign.com/sap/public';
           		var sComponents = oConfig.configItem.components || '';

			 	$http.get(sUrl + '/bc/mdrs/cdo?type=crp_dump_rep&mode=bridge&app_comp=' + sComponents + '&origin=' + window.location.origin).success(function(oData) {
			 		var oResult = oData.S_RESULT;
			 		that.dumps[0].count = oResult.LAST_DAY;
			 		that.dumps[1].count = oResult.LAST_SEVEN_DAYS;
			 		that.dumps[2].count = oResult.LAST_THIRTY_DAYS;

			 		that.dumpList.day 	= oResult.LAST_DAY_LIST 		|| [];
			 		that.dumpList.week  = oResult.LAST_SEVEN_DAYS_LIST 	|| [];
			 		that.dumpList.month = oResult.LAST_THIRTY_DAYS_LIST || [];

			 		fnUpdate();
			 	});
			}; 	

			this.updateDumpList = function(iIndex) {
				switch(iIndex) {
					case 1:
						this.mode = "week";
					break;
					case 2:
						this.mode = "month";
					break;
					default:
						this.mode = "day";
				}

				fnUpdate();
			};

            this.isInitialized.value = true;
		}

		var oInstances = {};
		this.getInstanceForAppId = function(appId) {
			if(oInstances[appId] === undefined) {
				oInstances[appId] = new Data(appId);
			}
			return oInstances[appId];
		};
}]);

