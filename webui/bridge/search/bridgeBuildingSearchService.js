angular.module('bridge.service').service('bridgeBuildingSearch', ['$http', '$q', function ($http, $q)
{
	//data buffer
	var buffer_data = {};
	buffer_data.initialized = false;
	buffer_data.buildings = [];

    function load_data()
	{
		var deferred = $q.defer();
		if(!buffer_data.initialized)
		{
			$http.get('/bridge/search/buildings.xml').then(function (response)
			{
        		var data = new X2JS().xml_str2json(response.data);
        		buffer_data.buildings = data.items.item.map(function(item) {
        			item.id = item.objidshort;
        			if(item.geolinkB) {
        				var matches = /.*=([-\d\.]*)[,\s]+([-\d\.]*).*/.exec(item.geolinkB);
        				item.latitude = parseFloat(matches[1]);
        				item.longitude = parseFloat(matches[2]);
        			}
        			return item;
        		});
				buffer_data.initialized = true;
				deferred.resolve(buffer_data);
			});
		}
		else
		{
			deferred.resolve(buffer_data);
		}
		return deferred.promise;
	}

	this.searchLocation = function(query) {
		var deferred = $q.defer();
		var normalizedQuery = query.toUpperCase();

		load_data().then(function() {
			var result = _.uniq(
								_.filter(buffer_data.buildings, function(building) { return building.city.toUpperCase().indexOf(normalizedQuery) >= 0; }),
								function(location) { return location.city; }).map(function(item) {
									return {name: item.city, latitude: item.latitude, longitude: item.longitude};
								});
			deferred.resolve(result.length ? result : []);
		});

		return deferred.promise;
	};

    this.searchBuildingById = function(query, max) {
		var deferred = $q.defer();
		var normalizedQuery = query.toUpperCase();

		load_data().then(function()
		{
			var result = _.filter(buffer_data.buildings, function(building) { return building.id.toUpperCase().indexOf(normalizedQuery) === 0; });
			if(max > 0 && max < result.length) {
				result = result.slice(0, max);
			}
			deferred.resolve(result.length ? result : []);
		});

		return deferred.promise;
	};

	this.searchBuildingByCityAndId = function(query, max) {
		var deferred = $q.defer();
		var normalizedQuery = query.toUpperCase();

		load_data().then(function()
		{
			var result = _.filter(buffer_data.buildings, function(building) { return building.id.toUpperCase().indexOf(normalizedQuery) === 0 || building.city.toUpperCase().indexOf(normalizedQuery) >= 0; });
			if(max > 0 && max < result.length) {
				result = result.slice(0, max);
			}
			deferred.resolve(result.length ? result : []);
		});

		return deferred.promise;
	};
}]);
