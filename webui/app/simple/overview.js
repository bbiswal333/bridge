angular.module('app.simple', []);
angular.module('app.simple').directive('app.simple',['$http', function ($http) {

	var directiveController = ['$scope', function ($scope) {
		$scope.appText = "Pretty simple app.";
		$scope.msg = function()
		{
			$http({
            	url: 'https://sap-tools.slack.com/services/hooks/incoming-webhook?token=CN07Uckc1m4jfZThf5EmbhvM',
            	method: "POST",
            	data: {"channel": "#test", "username": "bridge-bot", "text": "This is posted to #test and comes from a bot named notification-bot.", "icon_url": "https://bridge.mo.sap.corp/img/bridge-icon.png"},
            	headers: {'Content-Type':'text/plain'},
            	withCredentials: false
/*eslint no-unused-vars:0*/
        	}).success(function (data, status, headers, config) {

            }).error(function (data, status, headers, config) {

            });
		};
	}];

	return {
		restrict: 'E',
		templateUrl: 'app/simple/overview.html',
		controller: directiveController
	};
}]);
