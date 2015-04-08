angular.module('bridge.service').service('trafficLightService',
  [ '$http', '$window', '$log', function($http, $window, $log) {

  var modulesState = [];

	function isClientOn(){
		return $window.client.available;
	}

	function red(){
		if( isClientOn() ){
			$log.log('Traffic Light: Red');
			$http.get( $window.client.origin + '/api/trafficLight?color=r');
		}
	}

	function yellow(){
		if( isClientOn() ){
			$log.log('Traffic Light: Yellow');
			$http.get($window.client.origin + '/api/trafficLight?color=y');
		}
	}

	function green(){
		if( isClientOn() ){
			$log.log('Traffic Light: Green');
			$http.get($window.client.origin + '/api/trafficLight?color=g');
		}
	}

  function updateTrafficLight() {

    var colorFunction = green;

    for(var key in modulesState)
    {
      if(modulesState[key] === 'R') {
        colorFunction = red;
        break;
      }
      else if(modulesState[key] === 'Y') {
        colorFunction = yellow;
      }
    }

    colorFunction();
  }

  function setModuleState(appId, state) {
    $log.log('Traffic Light for App ' + appId + ': ' + state );
    modulesState[appId] = state;
    updateTrafficLight( );
  }

  var TrafficLightServiceForApp = function(appId) {

    this.red = function() {
      setModuleState(appId, 'R');
    };

    this.green = function() {
      setModuleState(appId, 'G');
    };

    this.yellow = function() {
      setModuleState(appId, 'Y');
    };
  };

  this.forApp = function(appId) {
    return new TrafficLightServiceForApp(appId);
  };

}]);
