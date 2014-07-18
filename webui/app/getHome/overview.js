angular.module('app.getHome', []);
angular.module('app.getHome').directive('app.getHome', [ 'app.getHome.configservice', function (appGetHomeConfig) {

	var directiveController = ['$scope', function ($scope)
	{
		$scope.box.boxSize = "1";
		$scope.box.settingScreenData = {
			templatePath: "getHome/settings.html",
			controller: angular.module('app.getHome').appGetHomeSettings
		};        
		$scope.config = appGetHomeConfig;

		$scope.box.returnConfig = function () {
			var configCopy = angular.copy(appGetHomeConfig.data);
			 return configCopy;
		};

		//put some stuff in here
		$scope.locations = $scope.config.data.locations;

		$scope.from = $scope.locations[0];
		$scope.to = $scope.locations[1];

		$scope.delay_string = "40min (+16min)";
		nokia.Settings.set("app_id", "BGFtzY6olMoTQcTu9MGp");
		nokia.Settings.set("app_code", "pbI1l9jZBzUsw0pouKowHA");
		(document.location.protocol == "https:") && nokia.Settings.set("secureConnection", "force");

		// Hold a reference to our example's controls and container element
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
			startName = "Walldorf",
			destName = "Berlin",
			// Two routing managers are required since both route requests will 
			// be made concurrently
			trafficEnabledRoutingManager = new nokia.maps.routing.Manager(),
			noTrafficRoutingManager = new nokia.maps.routing.Manager();


		// Callback function for routing
		function routingCallback (observedRouter, key, value) {
			var routes,
				routeColor,
				routeTrafficMode;

			if (value == "finished") {
				routes = observedRouter.getRoutes();
				routeTrafficMode = routes[0].mode.trafficMode;


				if (routeTrafficMode == "enabled"){
					console.log("Traffic time " + startName +
						" to " + destName + ": " + formatTime(routes[0].summary.trafficTime)
					);
					calcTimeDiff();
				} else {
					console.log("Base time " + startName +
						" to " + destName + ": " + formatTime(routes[0].summary.baseTime)
					);
					calcTimeDiff();
				}
			} else if (value == "failed") {
				console.log("The routing request failed.");
				console.log(observedRouter.getErrorCause());
			}
		}

		function calcTimeDiff () {
			if (trafficEnabledRoutingManager.getRoutes().length > 0 &&
					noTrafficRoutingManager.getRoutes().length > 0) {
				console.log("Traffic causes: " + formatTime(trafficEnabledRoutingManager.getRoutes()[0].summary.trafficTime -
					noTrafficRoutingManager.getRoutes()[0].summary.baseTime));
			}
		}

		// Add observers to our routing managers
		trafficEnabledRoutingManager.addObserver("state", routingCallback);
		noTrafficRoutingManager.addObserver("state", routingCallback);

		fnSearch(startName);
		fnSearch(destName);

		var startCoords, destCoords;

		function calcRoutes () {
			var  waypoints = new nokia.maps.routing.WaypointParameterList();
			// Add start and destination
			waypoints.addCoordinate(startCoords);
			waypoints.addCoordinate(destCoords);

			// Make route requests
			trafficEnabledRoutingManager.calculateRoute(waypoints, [mode.enabled]);
			noTrafficRoutingManager.calculateRoute(waypoints, [mode.disabled]);
		}

		function fnSearch (sSearchText) {
			var searchManager, searchRequest;
			
			searchManager = new nokia.maps.advsearch.Manager();
			searchManager.addObserver("state", fnHandleSearchResponse);
			searchRequest = {//geocode
					searchText: sSearchText
				};
			searchManager.clear();
			searchManager.geocode(searchRequest);
		}

		function fnHandleSearchResponse (observedManager) {
			var locations;

			if (observedManager.state === "finished") {
				if (observedManager.getLocations().length > 0) {
					locations = observedManager.getLocations();
					console.log("Found locations:");
					for (i = 0, len = locations.length; i < len; i++) {
						console.log(locations[i]);
					}

					if (!startCoords) {
						startCoords = locations[0].displayPosition;
					} else {
						destCoords = locations[0].displayPosition;
						calcRoutes();
					}
					
				}
			} else if (observedManager.state === "failed") {
				console.log('Failed');
				console.log(observedManager);
			}
		}

		function formatTime (iSeconds) {
			var sec_num = parseInt(iSeconds, 10);
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			var time = (hours > 0 ? hours + "h " : "") +
						(minutes > 0 ? minutes + "min " : "") +
						(seconds > 0 ? seconds + "sec " : "");
			return time;
		}


	}];

	return {
		restrict: 'E',
		templateUrl: 'app/getHome/overview.html',
		controller: directiveController,
		link: function($scope) {
			console.log($scope.appConfig);
		}
	};
}]);
