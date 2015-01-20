angular.module('bridge.service').service("bridge.service.maps.utils", [function () {
	var COORDINATE_REGEX = /^(\d+(\.\d+)?)(,)(\d+(\.\d+)?)$/;

	this.parseCoordinate = function(coordinate) {
		if(!COORDINATE_REGEX.test(coordinate)) {
			throw new Error("Invalid input parameter: \"" + coordinate + "\"");
		}

		var matches = COORDINATE_REGEX.exec(coordinate);
		switch(matches.length) {
			case 4:
				return new nokia.maps.geo.Coordinate(parseFloat(matches[1]), parseFloat(matches[3]));
			case 5:
				if(matches[1] === ",") {
					return new nokia.maps.geo.Coordinate(parseFloat(matches[1]), parseFloat(matches[3]));
				} else {
					return new nokia.maps.geo.Coordinate(parseFloat(matches[1]), parseFloat(matches[4]));
				}
				break;
			case 6:
				return new nokia.maps.geo.Coordinate(parseFloat(matches[1]), parseFloat(matches[4]));
		}
		throw new Error("Could not parse the coordinate correctly");
	};

	this.jsonCoordToGeoCoord = function(JSONCoord) {
		if(!JSONCoord) {
			throw new Error("Missing input parameter: JSONCoord");
		}

		if(!JSONCoord.latitude || !JSONCoord.longitude) {
			throw new Error("Invalid input parameter: " + JSON.stringify(JSONCoord));
		}

		return new nokia.maps.geo.Coordinate(JSONCoord.latitude, JSONCoord.longitude);
	};

	this.formatTime = function(iSeconds) {
		var sec_num = parseInt(iSeconds, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.round((sec_num - (hours * 3600)) / 60);
		// var seconds = sec_num - (hours * 3600) - (minutes * 60);

		var time = (hours > 0 ? hours + "h " : "") +
					(minutes > 0 ? minutes + "min" : "0min");
					// (seconds > 0 ? seconds + "sec " : "");
		return time;
	};

	this.formatDistance = function(distance) {
		if(!distance) {
			return "0km";
		}

		var distanceInt = parseInt(distance, 10);
		return (distanceInt / 1000).toFixed(1) + "km";
	};
}]);
