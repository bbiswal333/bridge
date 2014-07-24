angular.module('bridge.service').service('trafficLightService', [ '$http', '$interval', function($http, $interval){
	
	
	this.red = function(){
		$http.get('/api/trafficLight?color=r');
	}
	
	this.yellow = function(){
		$http.get('/api/trafficLight?color=y');
	}
	
	this.green = function(){
		$http.get('/api/trafficLight?color=g');
	}
	
}]);