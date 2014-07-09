angular.module('app.weather').appWeatherSettings = ['$scope', '$http','$filter','$q', 'app.weather.configservice', function ($scope, $http, $filter, $q, weatherConfigService) 
{
	$scope.currentConfigValues = weatherConfigService.configItem;

	function arrayObjectIndexOf(myArray, searchTerm, property) 
	{
		for(var k = 0, len = myArray.length; k < len; k++) 
		{
			if (myArray[k][property] === searchTerm){ return k; }
		}
		return -1;
	}

	$scope.searchLocation = function(searchString)
	{
		var load_buildings = $q.defer();

		if($scope.buildings === undefined)
		{
			$http.get('/bridge/employeeSearch/buildings.xml').then(function (response) 
			{
         		$scope.buildings = [];
        		var data = new X2JS().xml_str2json(response.data);            
	            for(var i = 0; i < data.items.item.length; i++)
	            {
	            		            	
	            	if(data.items.item[i].geolinkB !== undefined && arrayObjectIndexOf($scope.buildings, data.items.item[i].city, "name") === -1)
	            	{

	            		var building = {};

	            		var parser = document.createElement('a');
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
	  					$scope.buildings.push(building);
					}					
				}
				load_buildings.resolve($scope.buildings);
			});
		}	
		else
		{
			load_buildings.resolve($scope.buildings);
		}

		var filtered_results = $q.defer();

		load_buildings.promise.then(function()
		{
			filtered_results.resolve($filter('filter')($scope.buildings, searchString).slice(0,10));			
		});		

		return filtered_results.promise;		
	};

	$scope.save_click = function () 
	{
		weatherConfigService.configItem = $scope.currentConfigValues;
        $scope.$emit('closeSettingsScreen');
    };
}];