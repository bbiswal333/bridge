angular.module("app.dumps").service("app.dumps.avlData",
	["$rootScope","$http", "$q", "$window", "$location", "bridgeDataService", "notifier", "bridge.converter","app.dumps.configservice",
	function($rootScope, $http, $q, $window, $location, bridgeDataService, notifier, converter, oConfigService){
		var Data = function(appId) {
			var that = this;

			this.appId = appId;
			this.isInitialized = {value:false};

            this.availability = [
            	{ key: "avl"  , description: "Availability %", count: 0, link_to: "" }];


            this.loadOverview = function() {
           		var oConfig = oConfigService.getConfigForAppId(appId);
           		var sUrl = oConfig.getUrl();//(oConfig.configItem.system && oConfig.configItem.system === "VERILAB") ? 'https://vns.wdf.sap.corp/sap' : 'https://ace-cust002.dev.sapbydesign.com/sap/public';

			 	$http.get(sUrl + '/bc/mdrs/cdo?type=crp_bdb&entity=view_data&id=c9-v04').success(function(oData) {
			 		var oResult = oData.DATA;
			 		that.availability[0].count = oResult.VIEWS[0].KPI_VALUE;
					that.availability[0].link_to = oResult.VIEWS[0].URL;
			 	});
			};

            this.isInitialized.value = true;
		};

		var oInstances = {};
		this.getInstanceForAppId = function(appId) {
			if(oInstances[appId] === undefined) {
				oInstances[appId] = new Data(appId);
			}
			return oInstances[appId];
		};
}]);
