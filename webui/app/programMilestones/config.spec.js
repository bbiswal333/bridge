describe("Config", function() {
	var configFactory, hasConfig, $timeout;
	beforeEach(function() {
		module("bridge.service");
		module("app.programMilestones", function($provide) {
			$provide.value("bridgeDataService", {
				getAppConfigById: function() {
					if(hasConfig) {
						return {
							milestoneTypes: [
								"DC",
								"RTC",
								"ECC",
								"CC"
							],
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

		inject(["app.programMilestones.configFactory", "$timeout", function(_configFactory, _$timeout) {
			configFactory = _configFactory;
			$timeout = _$timeout;
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
		expect(config.getMilestoneTypes().length).toEqual(4);
	});

	it("should be initialized with empty config if none is existing", function() {
		hasConfig = false;
		var config = configFactory.getConfigForAppId("app-1");
		expect(config.getPrograms().length).toEqual(0);
		expect(config.getMilestoneTypes()).toEqual(["ALL"]);
	});

	it("should notify if it was initialized", function(done) {
		var config = configFactory.getConfigForAppId("app-1");
		config.isInitialized().then(function() {
			done();
		});
		$timeout.flush();
	});

	it("should toggle milestone types", function() {
		hasConfig = false;
		var config = configFactory.getConfigForAppId("app-1");
		expect(config.getMilestoneTypes()).toEqual(["ALL"]);
		config.toggleMilestoneType(['0714','0928']);
		expect(config.getMilestoneTypes()).toEqual(['0714','0928']);
		config.toggleMilestoneType(['0108']);
		expect(config.getMilestoneTypes()).toEqual(['0714','0928','0108']);
		config.toggleMilestoneType(['0714','0928']);
		expect(config.getMilestoneTypes()).toEqual(['0108']);
		config.toggleMilestoneType(['0108']);
		expect(config.getMilestoneTypes()).toEqual(["ALL"]);
	});

	it("should activate all milestoneTypes", function() {
		var config = configFactory.getConfigForAppId("app-1");
		expect(config.getMilestoneTypes().length).toEqual(4);
		config.enableAllMilestoneTypes();
		expect(config.getMilestoneTypes()).toEqual(["ALL"]);
	});

	it("should know if a milestone type is active", function() {
		var config = configFactory.getConfigForAppId("app-1");
		config.enableAllMilestoneTypes();
		expect(config.isMilestoneTypeActive("RTC")).toEqual(true);
		expect(config.isMilestoneTypeActive("BasicallyEverythingWorks")).toEqual(true);
		config.toggleMilestoneType("ECC");
		expect(config.isMilestoneTypeActive("RTC")).toEqual(false);
		expect(config.isMilestoneTypeActive("ECC")).toEqual(true);
	});
});
