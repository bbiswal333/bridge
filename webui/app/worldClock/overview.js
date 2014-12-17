angular.module('app.worldClock', ["lib.utils", "ui.bootstrap.timepicker"]);
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

	var directiveController = ['$scope', function ($scope) {
		$scope.box.boxSize = "2";
		$scope.timeOffsetInMilliseconds = 0;

		/*$scope.now = new Date();
		$scope.timeOffsetInMilliseconds = 0;
		$scope.changed = function() {
			var offset = $scope.now - calUtils.now();
			$scope.timeOffsetInMilliseconds = Math.abs(offset) >= 500 ? offset : 0;
		};*/

		configService.initialize($scope.metadata.guid);
		$scope.locations = configService.locations;

		$scope.box.returnConfig = function(){
			return angular.copy(configService);
		};

		$scope.searchLocation = bridgeBuildingSearch.searchLocation;
		$scope.addLocation = function(location) {
			$scope.selectedLocation = null;
			$scope.editMode = false;
			$scope.showAddButton = false;
			configService.addLocation(location);
		};

		$scope.removeLocation = configService.removeLocation;
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/worldClock/overview.html',
		controller: directiveController
	};
}]);
