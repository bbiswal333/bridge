angular.module('app.upportNotes').controller('app.upportNotes.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.upportNotes.configService', 'app.upportNotes.dataService',
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, configService, dataService) {
    	var appConfig = configService.getConfigForAppId("app.upportNotes-" + $routeParams.instanceNumber);
		appConfig.initialize();
		$scope.config = appConfig.getItems();
		$scope.tableSettings = appConfig.tableSettings;

		$scope.prio = $routeParams.prio;

		$scope.data = {upportNotes: []};

		var appData = dataService.getDataForAppId("app.upportNotes-" + $routeParams.instanceNumber);

		$scope.$watch('prio', function() {
			$scope.loadingPromise = appData.loadDetails().then(function() {
				$scope.data.upportNotes.length = 0;
				appData.details.map(function(item) {
					if(item.CM_PRIORITY === $scope.prio) {
						$scope.data.upportNotes.push(item);
					}
				});
			});
		});
    }
]);
