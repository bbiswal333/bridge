angular.module('app.agilecloud').service('app.agileCloud.dataService', ['$http', function ($http) {
	var promise;
	this.getData = function() {
		if (!promise) {
			promise = $http.get('app/agileCloud/AgileCloudQuotes.json').then(function(response) {
				return response.data;
			});
		}
		return promise;
	}
}]);