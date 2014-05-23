angular.module('bridge.table', []);
angular.module('bridge.table').directive('bridge.table', ['$templateCache', '$http', '$q', function ($templateCache, $http, $q) {

	var directiveController = ['$scope', '$http', '$q', function ($scope, $http, $q) {
		$scope.gridOptions.data = 'gridData';		
		$scope.config = {};

		var defer = $q.defer();
	    var promises = [];

	    //replace templates if needed
	    promises.push(
			$http.get('/bridge/table/templates/aggregateTemplate.html').success(function (data)
			{      
				$templateCache.put('aggregateTemplate.html', data); 				
	        })
        );	

        promises.push(
			$http.get('/bridge/table/templates/cellEditTemplate.html').success(function (data)
			{      
				$templateCache.put('cellEditTemplate.html', data);				                  				
	        })
        );	

        promises.push(
			$http.get('/bridge/table/templates/gridTemplate.html').success(function (data)
			{      
				$templateCache.put('gridTemplate.html', data);                  				
	        })
        );	

        promises.push(
			$http.get('/bridge/table/templates/headerCellTemplate.html').success(function (data)
			{      
				$templateCache.put('headerCellTemplate.html', data);                  				
	        })
        );	

        $q.all(promises).then(function(){ $scope.config.loaded = true; });        
        return defer.promise;
			
	}];

    return {
        restrict: 'E',
        templateUrl: 'bridge/table/TableDirective.html',
        controller: directiveController,        
        scope: 
        {
        	gridOptions: '=',
        	gridData:'='      	
		}                       
    };
}]);



