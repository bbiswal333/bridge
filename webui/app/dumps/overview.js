/*jslint browser:true*/
angular.module('app.dumps', ['bridge.service']);
angular.module('app.dumps').directive('app.dumps',[function () {

	var directiveController = ['$scope', 'app.dumps.dumpData', 'app.dumps.avlData', 'app.dumps.configservice', '$window',
		function ($scope, oDumpDataService, oAvlDataService, oDumpsConfigService, $window) {
            $scope.configService = oDumpsConfigService.getConfigForAppId($scope.metadata.guid);

			var oDumpData = oDumpDataService.getInstanceForAppId($scope.metadata.guid);
			var oAvlData = oAvlDataService.getInstanceForAppId($scope.metadata.guid);

			$scope.dumps             = oDumpData.dumps;
			$scope.availability 	 = oAvlData.availability;
			$scope.appText           = "Dump app.";
			$scope.boxIcon           = '&#xe824;';
        	$scope.dataInitialized   = oDumpData.isInitialized;
			$scope.avlInitialized	 = oAvlData.isInitialized;
            $scope.dumpList          = oDumpData.currentDumpList;
            $scope.systemName        = $scope.configService.getSystemName();
			$scope.kpi 				 = $scope.configService.getKpi().toString().replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','').replace(',','');
			
        	$scope.box.settingsTitle = "Configure";
			
        	$scope.box.settingScreenData = {
            	templatePath: "dumps/settings.html",
                controller: angular.module('app.dumps').appDumpsSettings,
                id: $scope.boxId,
                scope: {
                    userInfo: "="
                }
            };
			
			$scope.box.headerIcons = [{
				iconCss: "fa-refresh",
				title: "Refresh data",
				callback: function(){
					 oDumpData.loadOverview();
					 oAvlData.loadOverview();
				}
			}];

            $scope.noDataString = "Data could not be loaded from webservice.";

     	    $scope.box.returnConfig = function(){
           	    return angular.copy($scope.configService.configItem);
            };

            $scope.$watch("configService.configItem.boxSize", function () {
        	   $scope.box.boxSize = $scope.configService.configItem.boxSize;
            });

            $scope.$watch("[configService.configItem.system,configService.configItem.components]", function() {
                oDumpData.loadOverview();
				oAvlData.loadOverview();
            });

            $scope.$watch("configService.configItem.system", function() {
                $scope.systemName = $scope.configService.getSystemName();
            });
			
			$scope.$watch("configService.configItem.kpi", function() {
				$scope.kpi = $scope.configService.getKpi();
			});

            var getDate = function(d) {
                var fill = function(i) {
                    return ( i <= 9) ? '0' + i : i;
                };

                return d.getUTCFullYear().toString() + fill(1 + d.getUTCMonth()) + fill(d.getUTCDate());
            };

            $scope.myClick = function(i) {
				if ($scope.kpi[0] === 'D')
					oDumpData.updateDumpList(i);

            };

            $scope.myDblClick = function(i) {
			
				if ($scope.kpi[0] === 'D') {
					var iOffset = 0;
					var dTo = new Date();
					var dFrom = new Date(dTo);

					switch(i) {
						case 0:
							iOffset = 1;
							break;
						case 1:
							iOffset = 7;
							break;
						case 2:
							iOffset = 30;
							break;
						default:
							return;
					}

					dFrom.setUTCDate(dFrom.getUTCDate() - iOffset );

					var sUrl = $scope.configService.getUrl();
					sUrl += "/bc/mdrs/cdo?d_view=dl&period_type=dp&type=crp_dump&date_from=" + getDate(dFrom) + "&date_to=" + getDate(dTo);

					if ($scope.configService.configItem.components) {
						sUrl += "&app_comp=" + $scope.configService.configItem.components;
					}

					$window.open(sUrl, "_blank"); 
				}
				else {
					var sUrl = $scope.configService.getUrl();
					sUrl += "/bc/mdrs/cdo" + $scope.availability[0].link_to.split("&start_date")[0]; //split added until link problem is fixed
					$window.open(sUrl, "_blank"); 
				}
            };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/dumps/overview.html',
		controller: directiveController
	};
}]);
