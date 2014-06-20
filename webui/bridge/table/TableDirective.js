angular.module('bridge.table', []);
angular.module('bridge.table').directive('bridge.table', ['$templateCache', '$http', '$q', function ($templateCache, $http, $q) {

	var directiveController = ['$scope', '$http', '$q', function ($scope, $http, $q) {
		var infinityLimitStep = 50;
		var infinityLimit = infinityLimitStep;
		var limitedData = {};

		// $scope.gridOptions.data = 'gridData';		
		$scope.gridOptions.data = 'limitedData';
		$scope.config = {};

		var defer = $q.defer();
	    var promises = [];

	    var getLimitedData = function(){
	    	if ($scope.gridData.length > infinityLimit)
	    		return $scope.gridData.slice(0,infinityLimit);
	    	else
	    		return $scope.gridData;
	    }

	    $scope.increaseInfinityLimit = function(){
	    	infinityLimit += infinityLimitStep;
	    	$scope.limitedData = getLimitedData();
	    }

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

        var unregister = $scope.$watch("gridData",function(){
        	console.log("watcher on gridData ");

        	if ($scope.gridData.length > 0) {
        		$scope.limitedData = getLimitedData();
        		unregister(); // stop watching after first update because of infinte scrolling
        	};
        });

        $scope.$on('ngGridEventScroll', function(){
        	console.log("Scroll event ");

        });

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

angular.module('bridge.table').directive("infinitescroll", ['$window', function($window){
	return function(scope, elm, attr) {
		var wind = angular.element( document.querySelector( '#detailContainer' ));
		var raw = wind[0];

	    wind.bind("scroll", function() {
	        if (raw.scrollTop + raw.offsetHeight >= elm[0].scrollHeight) {
	            scope.$apply(scope.increaseInfinityLimit());
	        } else if (raw.scrollTop === 0){
	            //should it be reset to the initial limit size?
	        }
	    });    
	}
}])



