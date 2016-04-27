describe("Data", function() {
	var dataFactory, $httpBackend, config;
	beforeEach(function() {
		config = {
			programs: [
				{GUID: "GUID1", Name: "Program 2"},
				{GUID: "GUID2", Name: "Program 2", isSiriusProgram: true}
			]
		};

		module("bridge.service");
		module("app.programMilestones", function($provide) {
			$provide.value("bridgeDataService", {
				getAppConfigById: function() {
					return config;
				},
				getAppById: function() {
					return {};
				}
			});
		});

		inject(["app.programMilestones.dataFactory", '$httpBackend', function(_dataFactory, _$httpBackend) {
			dataFactory = _dataFactory;
			$httpBackend = _$httpBackend;
		}]);

		$httpBackend.whenGET('https://ifp.wdf.sap.corp/sap/bc/bridge/GET_PR_PROGRAM_MILESTONES?programGUID=GUID1').respond({"PHASES":[{"PHASE_ID":"AFBWti0+HuKC99apYTaahA==","PHASE_TXT":"Start of Development Phase","PHASE_START_DATE":"2515-03-01","PHASE_START_TIME":"12:00:00","PHASE_START_TIMZ":"CET","PHASE_END_DATE":"0000-00-00","PARENT_PHASE_TXT":"DEVELOPMENT","PHASE_TYPE_ID": "0714"},{"PHASE_ID":"AFBWti0+HuKDxHDzSEg6hA==","PHASE_TXT":"Start of Development Phase","PHASE_START_DATE":"0000-00-00","PHASE_START_TIME":"12:00:00","PHASE_START_TIMZ":"CET","PHASE_END_DATE":"0000-00-00","PARENT_PHASE_TXT":"DEVELOPMENT"}]});
		$httpBackend.whenGET('https://ifp.wdf.sap.corp/sap/bc/bridge/GET_PRS_PROGRAM_MILESTONES?programGUID=GUID2').respond({"PHASES":[{"MANDT":"001","PROGRAM_GUID":"SJSiaHol+EfAyDrfA9/Ngg==","DELIVERY_GUID":"RUAwsaU4i0weuHOUuTXZgg==","MILESTONE_GUID":"bK6LJ/zDHtWliuX48BLiKg==","MILESTONE_NAME":"Start of Standard Development (SSD)","MILESTONE_DATE":"2416-04-12","DELIVERY_NAME":"HANA SPS 12 Beta - Dynamic Tiering","PROGRAM_NAME":"HANA SPS 12","MILESTONE_TYPE":"1234","MILESTONE_TIME_RELEVANT":"","MILESTONE_TIME":"12:00:00","MILESTONE_TIME_ZONE":"UTC"},{"MANDT":"001","PROGRAM_GUID":"SJSiaHol+EfAyDrfA9/Ngg==","DELIVERY_GUID":"RUAwsaU4i0weuHOUuTXZgg==","MILESTONE_GUID":"bK6LJ/zDHtWliuX48BNiKg==","MILESTONE_NAME":"Beta Shipment","MILESTONE_DATE":"2016-08-13","DELIVERY_NAME":"HANA SPS 12 Beta - Dynamic Tiering","PROGRAM_NAME":"HANA SPS 12","MILESTONE_TYPE":"0714","MILESTONE_TIME_RELEVANT":"","MILESTONE_TIME":"12:00:00","MILESTONE_TIME_ZONE":"UTC"}]});
	});

	it("should be created", function() {
		expect(dataFactory.getDataForAppId("app-1")).toBeDefined();
	});

	it("should be a singleton", function() {
		expect(dataFactory.getDataForAppId("app-1")).toEqual(dataFactory.getDataForAppId("app-1"));
	});

	it("should do two backend calls for the respective programs", function() {
		var data = dataFactory.getDataForAppId("app-1");
		data.refreshMilestones();
		$httpBackend.flush();
		expect(data.getMilestones().length).toEqual(2);
	});

	it("should only take configured milestones", function() {
		config.milestoneTypes = ["0714"];
		var data = dataFactory.getDataForAppId("app-1");
		data.refreshMilestones();
		$httpBackend.flush();
		expect(data.getMilestones().length).toEqual(1);
	});
});
