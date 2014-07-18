angular.module('app.getHome').service("app.getHome.mapservice", function () {

	var mode = {
			enabled: {
				type: "fastestNow",
				transportModes: ["car"],
			},
			disabled: {
				type: "directDrive",
				transportModes: ["car"],
			}
		},
		// Two routing managers are required since both route requests will 
		// be made concurrently
		that = this;

	nokia.Settings.set("app_id", "BGFtzY6olMoTQcTu9MGp");
	nokia.Settings.set("app_code", "pbI1l9jZBzUsw0pouKowHA");
	(document.location.protocol == "https:") && nokia.Settings.set("secureConnection", "force");

	this.trafficEnabledRoutingManager = new nokia.maps.routing.Manager(),
	this.noTrafficRoutingManager = new nokia.maps.routing.Manager(),

	// Add observers to our routing managers
	this.trafficEnabledRoutingManager.addObserver("state", routingCallback);
	this.noTrafficRoutingManager.addObserver("state", routingCallback);

	// Callback function for routing
	function routingCallback (observedRouter, key, value) {
		var routes,
			routeColor,
			routeTrafficMode;

		if (value == "finished") {
			routes = observedRouter.getRoutes();
			routeTrafficMode = routes[0].mode.trafficMode;

			if (routeTrafficMode == "enabled"){
				console.log("Traffic time: " + formatTime(routes[0].summary.trafficTime)
				);
				that.trafficTimeCallback(formatTime(routes[0].summary.trafficTime));
				calcDelay();
			} else {
				console.log("Base time: " + formatTime(routes[0].summary.baseTime)
				);
				calcDelay();
			}
		} else if (value == "failed") {
			console.log("The routing request failed.");
			console.log(observedRouter.getErrorCause());
		}
	}

	function calcDelay () {
		if (that.trafficEnabledRoutingManager.getRoutes().length > 0 &&
				that.noTrafficRoutingManager.getRoutes().length > 0) {
			console.log("Traffic causes: " + formatTime(that.trafficEnabledRoutingManager.getRoutes()[0].summary.trafficTime -
				that.noTrafficRoutingManager.getRoutes()[0].summary.baseTime));
			that.delayCallback("(+" + formatTime(that.trafficEnabledRoutingManager.getRoutes()[0].summary.trafficTime -
				that.noTrafficRoutingManager.getRoutes()[0].summary.baseTime) + ")");
		}
	}

	this.calculateRoute = function (startCoords, destCoords, trafficTimeCallback, delayCallback) {
		var  waypoints = new nokia.maps.routing.WaypointParameterList();
		// Add start and destination
		waypoints.addCoordinate(startCoords);
		waypoints.addCoordinate(destCoords);

		this.trafficEnabledRoutingManager.clear();
		this.noTrafficRoutingManager.clear();

		this.trafficTimeCallback = trafficTimeCallback;
		this.delayCallback = delayCallback;

		// Make route requests
		this.trafficEnabledRoutingManager.calculateRoute(waypoints, [mode.enabled]);
		this.noTrafficRoutingManager.calculateRoute(waypoints, [mode.disabled]);
	};

	this.search = function (sSearchText, callback) {
		var searchManager, searchRequest;
		
		searchManager = new nokia.maps.advsearch.Manager();
		searchManager.addObserver("state", function (observedManager) {

			if (observedManager.state === "finished") {
				if (observedManager.getLocations().length > 0) {
					callback(observedManager.getLocations());
				}
			} else if (observedManager.state === "failed") {
				console.log('Failed');
				console.log(observedManager);
			}
		});
		searchRequest = {//geocode
				searchText: sSearchText
			};
		searchManager.clear();
		searchManager.geocode(searchRequest);
	};


	function formatTime (iSeconds) {
		var sec_num = parseInt(iSeconds, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		// var seconds = sec_num - (hours * 3600) - (minutes * 60);

		var time = (hours > 0 ? hours + "h " : "") +
					(minutes > 0 ? minutes + "min " : "");
					// (seconds > 0 ? seconds + "sec " : "");
		return time;
	}

});