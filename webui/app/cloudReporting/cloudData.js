angular.module("app.cloudReporting").service("app.cloudReporting.cloudData",
	["$rootScope", "$http", "$q", "$window", "$location", "bridgeDataService", "notifier", "bridge.converter", "app.cloudReporting.configservice",
	function($rootScope, $http, $q, $window, $location, bridgeDataService, notifier, converter, oConfigService){

        var Data = function(appId) {
            var that = this;

            this.appId = appId;
            this.isInitialized = {value: false};

            this.kpis = [
                                //{id: "KPI name 1", title:"Sample KPI", value: "10", url: "/"}
                              ];

            this.loadOverview = function() {
                var oConfig = oConfigService.getConfigForAppId(appId);
                var sURL = oConfig.getUrl();
                var sKpis = oConfig.configItem.kpis;

                $window.console.log(sKpis);

                if (sKpis.length >= 1) {
                    sKpis.forEach(function(thisKpi){
                        $http.get(sURL + '/bc/mdrs/cdo?type=crp_bdb&entity=view_data&id=' + thisKpi.ID + '&origin=' + $window.location.origin).success(function(response){
                            var result = response.DATA.VIEWS[0];

                            that.kpis.push({id: result.ID, title: result.TITLE, value: Math.round(result.KPI_VALUE) !== result.KPI_VALUE ? result.KPI_VALUE.toFixed(2) : result.KPI_VALUE, url: result.URL});
                        });
                    });
                }
            };

            this.refreshData = function() {
                var oConfig = oConfigService.getConfigForAppId(appId);
                var sURL = oConfig.getUrl();
                var sKpis = oConfig.configItem.kpis;

                sKpis.forEach(function(entry) {
                    $http.get(sURL + '/bc/mdrs/cdo?type=crp_bdb&entity=view_data&id=' + entry.ID + '&origin=' + $window.location.origin).success(function(response) {
                        var result = response.DATA.VIEWS[0];

                        entry.value = Math.round(result.KPI_VALUE) !== result.KPI_VALUE ? result.KPI_VALUE.toFixed(2) : result.KPI_VALUE;
                    });
                });
            };

            this.goToReport = function(kpi) {
                var oConfig = oConfigService.getConfigForAppId(appId);
                var sURL = oConfig.getUrl();
                $window.open(sURL + "/bc/mdrs/cdo" + that.kpis[kpi].url, "_blank");
            };
		};

		var oInstances = {};
		this.getInstanceForAppId = function(appId) {
			if(oInstances[appId] === undefined) {
				oInstances[appId] = new Data(appId);
			}
			return oInstances[appId];
		};
}]);
