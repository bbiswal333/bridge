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

            $scope.kpis = oCloudReportingData.kpis;
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

			$scope.box.returnConfig = function() {
           	    return angular.copy($scope.configService.configItem);
            };

            $scope.$watch("configService.configItem.boxSize", function() {
        	   $scope.box.boxSize = $scope.configService.configItem.boxSize;
            });

            $scope.$watch("configService.configItem.system", function() {
                $scope.systemName = $scope.configService.getSystemName();
            });

            $scope.$watch("configService.configItem.kpis", function() {
                oCloudReportingData.loadOverview();
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
