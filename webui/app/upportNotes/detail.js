angular.module('app.upportNotes').controller('app.upportNotes.detailController', ['$scope', '$http', '$filter', '$route', '$routeParams', 'ngTableParams', 'app.upportNotes.configService', 'app.upportNotes.dataService',
    function ($scope, $http, $filter, $route, $routeParams, ngTableParams, configService, dataService) {
    	var appConfig = configService.getConfigForAppId("app.upportNotes-" + $routeParams.instanceNumber);
		appConfig.initialize();
		$scope.config = appConfig.getItems();

		$scope.data = {};

		var appData = dataService.getDataForAppId("app.upportNotes-" + $routeParams.instanceNumber);

		$scope.loadingPromise = $scope.loadingPromise = appData.loadDetails().then(function() {
			$scope.data.upportNotes = appData.details;
		});
    }
]);
