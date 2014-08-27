angular.module('bridge.service').service('trafficLightService', [ '$http', '$window', function($http, $window){
	
	function isClientOn(){
		return $window.client.available;
	}
	
	this.red = function(){
		if( isClientOn() ){
			$http.get( $window.client.origin + '/api/trafficLight?color=r');
		}
	};
	
	this.yellow = function(){
		if( isClientOn() ){
			$http.get($window.client.origin + '/api/trafficLight?color=y');
		}
	};
	
	this.green = function(){
		if( isClientOn() ){
			$http.get($window.client.origin + '/api/trafficLight?color=g');
		}
	};
	
}]);
