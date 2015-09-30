describe('TrafficLight Multi App Support', function () {
	var trafficLightService;
	var buildUrl;
	var $mockHttp;

	var MockHttp = function () {
		this.url = '';
		this.get = function(url) {
			this.url = url;
		};
	};

	buildUrl = function(getParameterValueForColor) {
		return '/api/trafficLight?color=' + getParameterValueForColor;
	};

	beforeEach(module('bridge.service', function ($provide) {
		var $mockWindow;

		$mockHttp = new MockHttp();
		$mockWindow = {
			client: {
				available: true,
				origin: ''
			}
		};

		$provide.value('$http', $mockHttp);
		$provide.value('$window', $mockWindow);
	}));

  beforeEach(function() {
		inject(['trafficLightService', function(_trafficLightService) {
			trafficLightService = _trafficLightService;
		}]);
	});

	it('should show Red if there is one or move Red apps', function() {
		trafficLightService.forApp('app1').off();
		trafficLightService.forApp('app2').green();
		trafficLightService.forApp('app3').yellow();
		trafficLightService.forApp('app4').red();

		expect($mockHttp.url).toBe(buildUrl('r'));
	});

	it('should show Yellow if there is one or more Yellow apps and no Red app', function() {
		trafficLightService.forApp('app1').off();
		trafficLightService.forApp('app2').green();
		trafficLightService.forApp('app3').yellow();

		expect($mockHttp.url).toBe(buildUrl('y'));
	});

	it('should show be Green if there is one or more Green apps and no Red nor Yellow app(s)', function() {
		trafficLightService.forApp('app1').off();
		trafficLightService.forApp('app2').green();

		expect($mockHttp.url).toBe(buildUrl('g'));
	});

	it('should show be turned Off if all apps are off', function() {
		trafficLightService.forApp('app1').off();
		trafficLightService.forApp('app2').off();

		expect($mockHttp.url).toBe(buildUrl('o'));
	});

	it('should be turned Off if there is no app using it', function() {
		expect($mockHttp.url).toBe(buildUrl('o'));
	});
});
