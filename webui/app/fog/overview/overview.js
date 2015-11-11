(function() {
	'use strict';

	function OverviewDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/fog/overview/overview.html',
			controller: 'app.fog.controller',
			controllerAs: 'fog'
		};
	}

	angular.module('app.fog').directive('app.fog.overview', [
		OverviewDirective
	]);

}());
