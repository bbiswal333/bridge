angular.module('bridge.service').service('bridgeBuildingSearch', ['$http', '$q', '$filter', '$window', function ($http, $q, $filter, $window)
{
	//data buffer
	var buffer_data = {};
	buffer_data.initialized = false;
	buffer_data.locations = [];
	buffer_data.buildings = [];


	function arrayObjectIndexOf(myArray, searchTerm, property)
	{
		for(var k = 0, len = myArray.length; k < len; k++)
		{
			if (myArray[k][property] === searchTerm){ return k; }
		}
		return -1;
	}


	function load_data()
	{
		var deferred = $q.defer();
		if(!buffer_data.initialized)
		{
			$http.get('/bridge/employeeSearch/buildings.xml').then(function (response)
			{
        		var data = new X2JS().xml_str2json(response.data);
	            for(var i = 0; i < data.items.item.length; i++)
	            {

	            	if(data.items.item[i].geolinkB !== undefined)
	            	{

	            		//add building
	            		var building = {};

	            		var parser = $window.document.createElement('a');
						parser.href = data.items.item[i].geolinkB;
						var query = parser.search.substring(1);
    					var vars = query.split('&');
    					for (var j = 0; j < vars.length; j++)
    					{
        					var pair = vars[j].split('=');
        					if (decodeURIComponent(pair[0]) === "q")
        					{
            					var latlong = decodeURIComponent(pair[1]);
            					var position = latlong.split(' ');
            					building.latitude = position[0].replace(/[^\d.-]/g, '');
            					building.longitude = position[1].replace(/[^\d.-]/g, '');
        					}
    					}

	            		building.name = data.items.item[i].city;
	            		building.id = data.items.item[i].objidshort;
	  					buffer_data.buildings.push(building);

	  					//add location
		            	if(arrayObjectIndexOf(buffer_data.locations, data.items.item[i].city, "name") === -1)
		            	{

		            		var location = {};
		            		location.latitude = building.latitude;
		            		location.longitude = building.longitude;
		            		location.name = building.name;
		            		buffer_data.locations.push(location);
						}
					}
				}
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

	return {
    	searchLocation: function(searchString, numberOfResults)
		{

			var deferred = $q.defer();
			var number_of_results = 10;

			if(numberOfResults !== undefined)
			{
				number_of_results = numberOfResults;
			}

			load_data().then(function()
			{
				deferred.resolve($filter('filter')(buffer_data.locations, searchString).slice(0,number_of_results));
			});

			return deferred.promise;
		},

		searchLocationbyBuilding: function(buildingSearch)
		{
			var deferred = $q.defer();

			load_data().then(function()
			{
				var building = _.find(buffer_data.buildings, { "id":  buildingSearch });
				if(building !== undefined)
				{
					deferred.resolve(_.find(buffer_data.locations, { "name":  building.name }));
				}
				else
				{
					deferred.resolve();
				}
			});

			return deferred.promise;
		}
    };
}]);
