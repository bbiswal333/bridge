/*http://nominatim.openstreetmap.org/search?city=Berlin&format=json&limit=2*/
angular.module('bridge.search').service('bridge.search.locationSearch', ['$http', "bridge.menubar.weather.weatherData", 'bridgeBuildingSearch', '$window', 'bridge.service.maps', '$q', function ($http, weatherData, bridgeBuildingSearch, $window, mapsService, $q) {
    this.getSourceInfo = function() {
        return {
            icon: "fa fa-globe",
            name: "Locations",
            resultTemplate: "bridge/search/locationTemplate.html",
			defaultSelected: false
        };
    };

    function getTimeInfoForItem(location) {
        $http.get('/api/get?proxy=true&url=' + encodeURIComponent("http://www.earthtools.org/timezone/" + location.displayPosition.latitude + "/" + location.displayPosition.longitude)).then(function(timezoneData) {
            location.localTime = /<localtime>(.*)<\/localtime>/gi.exec(timezoneData.data)[1];
        });
    }

    this.findMatches = function(query, resultArray, omitTimeAndWeather) {
        var mapServiceDeferred = $q.defer();
        var buildingSearchDeferred = $q.defer();
        var generalDeferred = $q.defer();
        mapsService.search(query, function(locations) {
            locations.map(function(location) {
                resultArray.push(location);
                if(!omitTimeAndWeather) {
                    getTimeInfoForItem(location);
                    weatherData.getWeather(location);
                }
            });
            mapServiceDeferred.resolve(resultArray);
        });
        bridgeBuildingSearch.searchBuildingByCityAndId(query, 4).then(function(sapLocations) {
            sapLocations.map(function(location) {
                var item = {address: {label: location.id, city: location.city}, displayPosition: {latitude: location.latitude, longitude: location.longitude}, sapDetails: location.street + ", " + location.city, sapLocation: true, latitude: location.latitude, longitude: location.longitude};
                resultArray.push(item);
                if(!omitTimeAndWeather) {
                    getTimeInfoForItem(item);
                    weatherData.getWeather(item);
                }
            });
            buildingSearchDeferred.resolve(resultArray);
        });

        mapServiceDeferred.promise.finally(function() {
            buildingSearchDeferred.promise.finally(function() {
                generalDeferred.resolve(resultArray);
            });
        });
        return generalDeferred.promise;
    };
    this.getCallbackFn = function() {
        return function(selectedItem) {
        	$window.open("http://maps.google.com/?q=" + selectedItem.displayPosition.latitude + "," + selectedItem.displayPosition.longitude);
        };
    };
}]);
