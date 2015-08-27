angular.module('bridge.service').service('trafficLightService',
  [ '$http', '$window', '$log', function($http, $window, $log) {

  var modulesState = [];

	function isClientOn(){
		return $window.client.available;
	}

	function setColor(colorCode, colorName) {
		$log.log('Traffic Light' + (isClientOn() ? ':' : ' (no client):')  + colorName);

		if( isClientOn() ){
			$http.get( $window.client.origin + '/api/trafficLight?color=' + colorCode );
		}
	}

	function red(){
		setColor('r', 'Red');
	}

	function yellow(){
		setColor('y', 'Yellow');
	}

	function green(){
		setColor('g', 'Green');
	}

  function off(){
    setColor('o', 'Off');
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
      else if(modulesState[key] === 'O') {
        colorFunction = off;
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

    this.off = function() {
      setModuleState(appId, 'O');
    };
  };

  this.forApp = function(appId) {
    return new TrafficLightServiceForApp(appId);
  };

}]);
