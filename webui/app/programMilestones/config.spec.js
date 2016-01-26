describe("Config", function() {
	var configFactory, hasConfig;
	beforeEach(function() {
		module("bridge.service");
		module("app.programMilestones", function($provide) {
			$provide.value("bridgeDataService", {
				getAppConfigById: function() {
					if(hasConfig) {
						return {
							programs: [
								{GUID: "GUID1", Name: "Program 2"},
								{GUID: "GUID2", Name: "Program 2", isSiriusProgram: true}
							]
						};
					} else {
						return undefined;
					}
				}
			});
		});

		hasConfig = true;

		inject(["app.programMilestones.configFactory", function(_configFactory) {
			configFactory = _configFactory;
		}]);
	});

	it("should be created", function() {
		expect(configFactory.getConfigForAppId("app-1")).toBeDefined();
	});

	it("should be a singleton", function() {
		expect(configFactory.getConfigForAppId("app-1")).toEqual(configFactory.getConfigForAppId("app-1"));
	});

	it("should be initialized with existing config", function() {
		var config = configFactory.getConfigForAppId("app-1");
		expect(config.getPrograms().length).toEqual(2);
	});

	it("should be initialized with empty config if none is existing", function() {
		hasConfig = false;
		var config = configFactory.getConfigForAppId("app-1");
		expect(config.getPrograms().length).toEqual(0);
	});
});
