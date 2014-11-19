describe("CAT2 config service", function () {
	var catsConfig;

	beforeEach(module("app.cats"));
	beforeEach(inject(["app.cats.configService", function (_catsConfig_) {
		catsConfig = _catsConfig_;
	}]));

	it("should calculate a unique ID for each task", function () {
		var tasks = [];
		var taskA = {};
		taskA.ZCPR_OBJGEXTID = 'UNIQUE_ID_01';
		tasks.push(taskA);
		var taskB = {};
		taskB.ZCPR_OBJGEXTID = 'UNIQUE_ID_02';
		tasks.push(taskB);
		catsConfig.recalculateTaskIDs(tasks);
		expect(taskA.id).toEqual(taskA.ZCPR_OBJGEXTID);
		expect(taskB.id).toEqual(taskB.ZCPR_OBJGEXTID);
	});

	it("should calculate TaskID on task enhancement", function () {
		var taskA = {};
		taskA.ZCPR_OBJGEXTID = 'UNIQUE_ID_01';
		expect(catsConfig.enhanceTask(taskA).id).toBeDefined();
	});

	it("should enahnce the task as reference", function () {
		var taskA = {};
		taskA.TASKTYPE = 'DEVL';
		catsConfig.enhanceTask(taskA);
		expect(taskA.id).toBeDefined();
		expect(taskA.DESCR).toBeDefined();
	});

	it("should fill in the right DESCR on task enhancement", function () {
		var taskA = {};
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('');
		taskA.TASKTYPE = 'DEVL';
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('DEVL');
		taskA.DESCR = '';
		taskA.ZZSUBTYPE = 'MGT';
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('DEVL MGT');
		taskA.DESCR = '';
		taskA.RAUFNR = 'RAUF';
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('RAUF');
		taskA.DESCR = '';
		taskA.ZCPR_OBJGEXTID = 'UNIQUE_ID_01';
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('UNIQUE_ID_01');
		taskA.DESCR = 'Beautiful Description';
		expect(catsConfig.enhanceTask(taskA).DESCR).toBe('Beautiful Description');
	});

	it("should fill in the right sub description on task enhancement", function () {
		var taskA = {};
		taskA.TASKTYPE = 'DEVL';
		expect(catsConfig.enhanceTask(taskA).subDescription).toBe('');
		taskA.DESCR = '';
		taskA.RAUFNR = 'RAUF';
		expect(catsConfig.enhanceTask(taskA).subDescription).toBe('DEVL');
		taskA.DESCR = '';
		taskA.ZCPR_EXTID = 'Software Eng';
		expect(catsConfig.enhanceTask(taskA).subDescription).toBe('Software Eng (RAUF)');
	});

	it("should be possible to add a last used description", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		catsConfig.enhanceTask(taskA);
		expect(catsConfig.lastUsedDescriptions.length).toBe(0);
		catsConfig.updateLastUsedDescriptions(taskA);
		expect(catsConfig.lastUsedDescriptions.length).toBe(1);
	});

	it("should be possible to update a last used description", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		catsConfig.enhanceTask(taskA);
		catsConfig.updateLastUsedDescriptions(taskA);
		expect(catsConfig.lastUsedDescriptions[0].DESCR).toEqual(taskA.TASKTYPE);
		var taskB = angular.copy(taskA);
		taskB.DESCR = 'new description';
		catsConfig.updateLastUsedDescriptions(taskB,true);
		expect(catsConfig.lastUsedDescriptions.length).toBe(1);
		expect(catsConfig.lastUsedDescriptions[0].DESCR).toEqual('MAIN');
		catsConfig.updateLastUsedDescriptions(taskB);
		expect(catsConfig.lastUsedDescriptions.length).toBe(1);
		expect(catsConfig.lastUsedDescriptions[0].DESCR).toEqual('new description');
	});

	it("should retrieve fancy description from last used descriptions", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		taskA.DESCR = 'Fancy description';
		catsConfig.enhanceTask(taskA);
		catsConfig.updateLastUsedDescriptions(taskA);
		var taskB = {};
		taskB.TASKTYPE = 'MAIN';
		expect(taskB.DESCR).toBeUndefined();
		catsConfig.updateDescription(taskB);
		expect(taskB.DESCR).toEqual('Fancy description');
	});

	it("should not be possible to have an empty description in the last used descritpions", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		catsConfig.enhanceTask(taskA);
		catsConfig.updateLastUsedDescriptions(taskA);
		var taskB = {};
		taskB.TASKTYPE = 'MAIN';
		taskB.DESCR = '';
		expect(taskB.DESCR).toEqual('');
		catsConfig.updateLastUsedDescriptions(taskB);
		catsConfig.updateDescription(taskB);
		expect(taskB.DESCR).toEqual('MAIN');
	});

});
