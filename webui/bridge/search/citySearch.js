/*http://nominatim.openstreetmap.org/search?city=Berlin&format=json&limit=2*/
angular.module('bridge.search').service('bridge.search.citySearch', ['$http', "bridge.menubar.weather.weatherData", 'bridgeBuildingSearch', '$window', function ($http, weatherData, bridgeBuildingSearch, $window) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-globe",
            name: "Cities",
            resultTemplate: "bridge/search/cityTemplate.html"
        };
    };
    this.findMatches = function(query, resultArray) {
		return $http({method: "GET", url: "https://nominatim.openstreetmap.org/search?format=json&limit=2&city=" + query, withCredentials: false}).then(
            function(response) {
            	response.data.map(function(result) {
            		$http.get('/api/get?proxy=true&url=' + encodeURIComponent("http://www.earthtools.org/timezone/" + result.lat + "/" + result.lon)).then(function(timezoneData) {
            			result.localTime = /<localtime>(.*)<\/localtime>/gi.exec(timezoneData.data)[1];
            		});
            		result.latitude = result.lat;
            		result.longitude = result.lon;
            		weatherData.getWeather(result);
            		bridgeBuildingSearch.searchLocation(query).then(function(sapLocations) {
            			sapLocations.map(function(location) {
            				if(Math.abs(parseFloat(location.latitude) - parseFloat(result.latitude)) < 0.1 && Math.abs(parseFloat(location.longitude) - parseFloat(result.longitude)) < 0.1) {
            					result.sapLocation = true;
            					result.longitude = location.longitude;
            					result.latitude = location.latitude;
            				}
            			});
            		});
            		resultArray.push(result);
            	});
            }
        );
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open("http://maps.google.com/?q=" + selectedItem.latitude + "," + selectedItem.longitude);
        };
    };
}]);
