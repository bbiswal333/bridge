angular.module('app.worldClock', ["lib.utils", "ui.bootstrap.modal"]);
angular.module('app.worldClock').directive('app.worldClock',["app.worldClock.config", "bridgeBuildingSearch", "lib.utils.calUtils", "$templateCache", function (configService, bridgeBuildingSearch, calUtils, $templateCache) {

	$templateCache.put("template/timepicker/timepicker.html",
    "<table style=\"position: absolute; left: 100px; width: 190px\">\n" +
    "	<tbody>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"incrementHours()\" class=\"btn btn-link\" style=\"height: 15px; margin-right: 2px; margin-left: 2px; padding: 0px 12px; font-size: 10px\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\" rowspan=\"2\">\n" +
    "				<input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td rowspan=\"2\">:</td>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\" rowspan=\"2\">\n" +
    "				<input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\" style=\"height: 15px; margin-right: 2px; margin-left: 2px; padding: 0px 12px; font-size: 10px\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "		</tr>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"decrementHours()\" class=\"btn btn-link\" style=\"height: 15px; margin-right: 2px; margin-left: 2px; padding: 0px 12px; font-size: 10px\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "			<td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\" style=\"height: 15px; margin-right: 2px; margin-left: 2px; padding: 0px 12px; font-size: 10px\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>\n" +
    "");

	var directiveController = ['$scope', '$http', function ($scope, $http) {
		$scope.box.boxSize = "2";
		$scope.timeOffsetInMilliseconds = 0;

		var config = configService.getInstanceForAppId($scope.metadata.guid);
		config.initialize();
		$scope.locations = config.locations;

		$scope.box.returnConfig = function(){
			return angular.copy(config);
		};

		$http.get('/api/worldClock/getTimeZones').then(function(response) {
			$scope.timeZones = response.data.timeZones;
		});

		$scope.searchLocation = bridgeBuildingSearch.searchLocation;
		$scope.addLocation = function(location) {
			$scope.selectedLocation = null;
			$scope.editMode = false;
			$scope.showAddButton = false;
			config.addLocation(location);
		};

		$scope.removeLocation = config.removeLocation;
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/worldClock/overview.html',
		controller: directiveController
	};
}]);
