ddescribe("bridgeAppCreator", function() {
	var appCreator;
	var loader;
	var exampleConfig = {
		testData: "just a test"
	};
	var metaData1 = {
		module_name: "app.test"
	};
	var metaData2 = {
		module_name: "app.test2"
	};
	var metaData3 = {
		module_name: "app.test",
		guid: "app.test-3",
		title: "my overridden title"
	};

	beforeEach(function() {
		module("bridge.service");

		inject(["bridge.service.loader", function(_loader) {
			loader = _loader;
			loader.apps = [{
				module_name: "app.test",
				title: "Test App #1",
				multiInstance: true
			},
			{
				module_name: "app.test2",
				title: "Test App #2"
			}];
		}]);

		inject(["bridge.service.appCreator", function(_appCreator) {
			appCreator = _appCreator;
		}]);
	});

	it("should be instantiated", function() {
		expect(appCreator).toBeDefined();
	});

	it("should throw if input data is invalid", function() {
		expect(function() { appCreator.createInstance(); }).toThrow(new Error("Invalid input data"));
		expect(function() { appCreator.createInstance("moduleName"); }).toThrow(new Error("Invalid input data"));
	});

	it("should create a new instance of a specific type", function() {
		var app = appCreator.createInstance(metaData1, exampleConfig);
		expect(app).toBeDefined();
		expect(app.metadata).toBeDefined();
		expect(app.appConfig).toBeDefined();
		expect(app.metadata === loader.apps[0]).toBeFalsy();
		expect(app.metadata.title).toEqual(loader.apps[0].title);
		expect(app.appConfig === exampleConfig).toBeTruthy();
	});

	it("should create a new instance with an id", function() {
		var app = appCreator.createInstance(metaData1, exampleConfig);
		expect(app.metadata.guid).toEqual("app.test-1");
		expect(app.metadata.instanceNumber).toEqual(1);
	});

	it("should create multiple instances of multi instance apps", function() {
		var app1 = appCreator.createInstance(metaData1, exampleConfig);
		expect(app1.metadata.instanceNumber).toEqual(1);
		var app2 = appCreator.createInstance(metaData1, exampleConfig);
		expect(app2.metadata.instanceNumber).toEqual(2);
	});

	it("should fail if non multi instance widget is instantiated twice", function() {
		appCreator.createInstance(metaData2, exampleConfig);
		expect(function() { appCreator.createInstance(metaData2, exampleConfig); }).toThrow(new Error("App is not a multi-instance widget and can not be instantiated more than once: app.test2"));
	});

	it("should fail if we try to instantiate an unknown app", function() {
		expect(function() { appCreator.createInstance({module_name: "app.unknown"}); }).toThrow(new Error("App not found: app.unknown"));
	});

	it("should be possible to remove an app", function() {
		appCreator.createInstance(metaData1, exampleConfig);
		var instance2 = appCreator.createInstance(metaData1, exampleConfig);
		appCreator.createInstance(metaData1, exampleConfig);
		appCreator.removeInstanceById(instance2.metadata.guid);
		expect(function() { appCreator.getInstanceById(instance2.metadata.guid); }).toThrow(new Error("App instance not found for given id: " + instance2.metadata.guid));
	});

	it("should create consecutive id's even if an app was removed", function() {
		appCreator.createInstance(metaData1, exampleConfig);
		var instance2 = appCreator.createInstance(metaData1, exampleConfig);
		appCreator.createInstance(metaData1, exampleConfig);
		appCreator.removeInstanceById(instance2.metadata.guid);
		var instance4 = appCreator.createInstance(metaData1, exampleConfig);
		expect(instance4.metadata.guid).toEqual("app.test-4");
	});

	it("should take the given id and title specified in the metadata", function() {
		var instance = appCreator.createInstance(metaData3, exampleConfig);
		expect(instance.metadata.guid).toEqual(metaData3.guid);
		expect(instance.metadata.title).toEqual(metaData3.title);
		expect(typeof instance.metadata.instanceNumber).toBe("number");
	});

	it("should fail if the given id is already taken", function() {
		expect(function() {
			appCreator.createInstance(metaData3, exampleConfig);
			appCreator.createInstance(metaData3, exampleConfig);
		}).toThrow(new Error("App id already in use: app.test-3"));
	});

	it("should return all instances of a type", function() {
		var instance1 = appCreator.createInstance(metaData1, exampleConfig);
		var instance2 = appCreator.createInstance(metaData1, exampleConfig);
		var instances = appCreator.getInstancesByType("app.test");
		expect(instances.length).toEqual(2);
		expect(instances[0]).toEqual(instance1);
		expect(instances[1]).toEqual(instance2);
	});
});
