angular.module('bridge.service').service('trafficLightService',
  [ '$http', '$window', '$log', function($http, $window, $log) {

  var modulesState = [];

	var states = {
		'r': {
			priority: 1,
			name: 'Red'
		},
		'y': {
			priority: 2,
			name: 'Yellow'
		},
		'g': {
			priority: 3,
			name: 'Green'
		},
		'o': {
			priority: 4,
			name: 'Off'
		}
	};

	function isClientOn(){
		return $window.client.available;
	}

	function setState(state) {
		$log.log('Traffic Light' + (isClientOn() ? ':' : ' (no client):')  + states[state].name);

		if( isClientOn() ){
			$http.get( $window.client.origin + '/api/trafficLight?color=' + state );
		}
	}

  function updateTrafficLight() {

		var state;

		state = 'o';

		for(var key in modulesState)
		{
			if(states[modulesState[key]].priority < states[state].priority) {
				state = modulesState[key];
			}
		}

		setState(state);
  }

  function setModuleState(appId, state) {
    $log.log('Traffic Light for App ' + appId + ': ' + states[state].name );
    modulesState[appId] = state;
    updateTrafficLight( );
  }

  var TrafficLightServiceForApp = function(appId) {

    this.red = function() {
      setModuleState(appId, 'r');
    };

    this.green = function() {
      setModuleState(appId, 'g');
    };

    this.yellow = function() {
      setModuleState(appId, 'y');
    };

    this.off = function() {
      setModuleState(appId, 'o');
    };
  };

  this.forApp = function(appId) {
    return new TrafficLightServiceForApp(appId);
  };

	// reset the TrafficLight at startup
	setState('o');
}]);
