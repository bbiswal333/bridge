/* global describe, beforeEach, it, expect, module, inject */
describe("The Jenkins config service", function() {

	"use strict";

	var configService;

	beforeEach(angular.mock.module("app.jenkins"));

	beforeEach(inject(["app.jenkins.configservice", function(_configService_) {

		configService = _configService_.getConfigForAppId("app.test");


	}]));

	it("can add a job config item", function () {

		expect(configService.configItems.length).toBe(0);
		configService.addConfigItem({"jenkinsUrl": "A"});
		configService.addConfigItem({"jenkinsUrl": "A"});
		expect(configService.configItems.length).toBe(1);

	});

	it("can check if a job has already been added", function () {

		var item1 = {"jenkinsUrl": "A", "selectedView": "B", "selectedJob": "C"};
		var item2 = {"jenkinsUrl": "X", "selectedView": "Y", "selectedJob": "Z"};

		configService.addConfigItem(item1);
		expect(configService.isItemInConfigItems(item1)).toBe(true);
		expect(configService.isItemInConfigItems(item2)).toBe(false);

	});

	it("can get all items from the config", function () {

		expect(configService.getConfigItems()).toEqual(configService.configItems);

	});

	it("can clear the view", function () {

		configService.clearView();
		expect(configService.configItem.selectedJob).toEqual("");

	});

	it("can check if the config is empty", function () {

		configService.jenkinsUrl = "";
		configService.selectedView = "";
		configService.selectedJob = "";
		expect(configService.isEmpty()).toBe(true);

		configService.jenkinsUrl = "A";
		expect(configService.isEmpty()).toBe(false);

	});

});
