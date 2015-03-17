angular.module('bridge.service').service('trafficLightService',
  [ '$http', '$window', '$log', function($http, $window, $log) {

	function isClientOn(){
		return $window.client.available;
	}

	this.red = function(){
		if( isClientOn() ){
			$log.log('Traffic Light: Red');
			$http.get( $window.client.origin + '/api/trafficLight?color=r');
		}
	};

	this.yellow = function(){
		if( isClientOn() ){
			$log.log('Traffic Light: Yellow');
			$http.get($window.client.origin + '/api/trafficLight?color=y');
		}
	};

	this.green = function(){
		if( isClientOn() ){
			$log.log('Traffic Light: Green');
			$http.get($window.client.origin + '/api/trafficLight?color=g');
		}
	};

}]);
