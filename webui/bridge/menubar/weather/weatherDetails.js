angular.module('bridge.app').controller('bridge.menubar.weatherDetailsController', ['bridge.menubar.weather.weatherData', 'lib.utils.calUtils', '$scope', function (weatherData, calUtils, $scope) {
	$scope.weatherData = weatherData.getData();

    $scope.showPreferences = false;
    $scope.preferencesText = "Show Preferences";

    $scope.preferences_click = function(){
        $scope.showPreferences = !$scope.showPreferences;
        if ($scope.showPreferences){
            $scope.preferencesText = "Hide Preferences";
        } else {
            $scope.preferencesText = "Show Preferences";
        }
    };

    $scope.getCurrentDate = function (days)
    {
        var date = new Date();
        var dayInWeek = (date.getDay() - 1 + days);
        if (dayInWeek === -1) { // Sunday
            dayInWeek = 6;
        }
        return calUtils.getWeekdays()[dayInWeek % 7].medium;
    };
}]);
