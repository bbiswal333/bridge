/*jslint browser:true*/
angular.module('app.cloudReporting', ['bridge.service']);
angular.module('app.cloudReporting').directive('app.cloudReporting',[function () {

	var directiveController = ['$scope', 'app.cloudReporting.cloudData', 'app.cloudReporting.configservice', '$window',
		function ($scope, oCloudReportingDataService, oCloudReportingConfigService) {
			$scope.configService = oCloudReportingConfigService.getConfigForAppId($scope.metadata.guid);

            var oCloudReportingData = oCloudReportingDataService.getInstanceForAppId($scope.metadata.guid);

        	$scope.appText = "Cloud Reporting";
            $scope.boxIcon = '&#xe824';
            $scope.box.settingsTitle = "Select KPIs";

            $scope.kpis = [];//oCloudReportingData.loadOverview();
            $scope.dataInitialized = oCloudReportingData.isInitialized;
            $scope.systemName = $scope.configService.getSystemName();

			$scope.box.settingScreenData = {
            	templatePath: "cloudReporting/settings.html",
                controller: angular.module('app.cloudReporting').appCloudReportingSettings,
                id: $scope.boxId,
                scope: {
                    userInfo: "="
                }
            };

			$scope.box.headerIcons = [{
				iconCss: "fa-refresh",
				title: "Refresh data",
				callback: function(){
                    oCloudReportingData.refreshData();
				}
			}];

            $scope.$watch("configService.configItem.boxSize", function() {
        	   $scope.box.boxSize = $scope.configService.configItem.boxSize;
            });

            $scope.$watch("configService.configItem.system", function() {
                $scope.systemName = $scope.configService.getSystemName();
                if ($scope.kpis.length > 0) {
                    $scope.kpis = oCloudReportingData.loadOverview();
                }
            });

            $scope.$watchCollection("configService.configItem.kpis", function() {
               $scope.kpis = oCloudReportingData.loadOverview();
            });

            $scope.myDblClick = function (i) {
                oCloudReportingData.goToReport(i);
            };
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/cloudReporting/overview.html',
		controller: directiveController
	};
}]);
