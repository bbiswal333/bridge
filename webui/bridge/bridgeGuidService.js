angular.module('bridge.service').service('bridge.service.guid', [function() {
	var mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!$&_#*+;";
	var guids = {};

	function generateRandomString(length) {
		var result = "";
		for(var i = 0, loopLength = length ? length : 20; i < loopLength; i++) {
			result += mask[Math.round(Math.random() * (mask.length - 1))];
		}
		return result;
	}

	this.get = function(length) {
		var guid;
		do {
			guid = generateRandomString(length);
		} while(this.isTaken(guid));
		guids[guid] = 0;
		return guid;
	};

	this.isTaken = function(guid) {
		if(guids[guid] === undefined){
			return false;
		}
		return true;
	};
}]);
