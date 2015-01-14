angular.module('app.mitosisHana').controller('app.mitosisHana.detailController',['$scope', '$location', '$routeParams' ,'app.mitosisHana.dataService', function ($scope,$location,$routeParams,dataService) {

$scope.detailForContent = $routeParams.content;
$scope.detailContent = dataService.contentDetails;
$scope.dataService = dataService;

	if (dataService.isInitialized.value === false) {
        var loadContentPromise = dataService.initialize($scope.module_name);
        loadContentPromise.then(function success() {
 			$scope.detailStatusView($scope.detailForContent);
        });
    }

	$scope.detailStatusView = function(content){
		dataService.getContentDetails(content);
		$location.path("/detail/Status/" + content);
	};

	$scope.formatDate = function(date) {
			if(date) {
				date = date.replace("/Date(", "");
                date = date.replace(")/", "");
				return new Date(parseInt(date,10)).toDateString();
			}
			return "";
		};

	$scope.formatTime = function(date) {
			if(date) {
				date = date.replace("/Date(", "");
                date = date.replace(")/", "");
				return new Date(parseInt(date,10)).toTimeString();
			}
			return "";
		};

	$scope.detailsLoading = function() {
			if(!$scope.dataService || $scope.dataService.contentDetails.length === 0) {
				return true;
			} else {
				return false;
			}
		};

}]);
