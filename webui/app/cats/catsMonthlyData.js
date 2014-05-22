angular.module("app.cats.monthlyDataModule", [])

.service("app.cats.monthlyData", ["$http", "$q",  function($http, $q){
	this.getMonthlyData = function(){

	};

	this.getWeeklyData = function (year, week) {
	    var deferred = $q.defer();

	    $http.get('https://isp.wdf.sap.corp/sap/bc/zdevdb/GETCATSDATA?format=json&origin=' + location.origin + '&week=' + year + '.' + week)
	    .success(function (data) {
	        this.convertWeekData(data);
	        deferred.resolve(parsedData);
	    });

	    return deferred.promise;
	};

	this.convertWeekData = function (backendData) {

	};
}]);

