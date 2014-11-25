describe("Timesheet tools", function () {
	var catsUtils;

	beforeEach(module("app.cats.utilsModule"));
	beforeEach(inject(["app.cats.catsUtils", function (_catsUtils_) {
		catsUtils = _catsUtils_;
	}]));

	it("should calculate a unique ID for a task", function () {
		var taskA = {};
		taskA.TASKTYPE = 'DEVL';
		expect(catsUtils.getTaskID(taskA)).toEqual('DEVL');
		taskA.RAUFNR = 'RAUF';
		expect(catsUtils.getTaskID(taskA)).toEqual('RAUFDEVL');
		taskA.ZZSUBTYPE = 'MGT';
		expect(catsUtils.getTaskID(taskA)).toEqual('RAUFDEVLMGT');
		taskA.ZCPR_OBJGEXTID = 'UNIQUE_ID_01';
		expect(catsUtils.getTaskID(taskA)).toEqual(taskA.ZCPR_OBJGEXTID);
	});

	it("should map the name to the state descriptor", function () {
		expect(catsUtils.getDescForState("")).toEqual("");
		expect(catsUtils.getDescForState("undefined")).toEqual("");
		expect(catsUtils.getDescForState("r")).toEqual("Not maintained");
		expect(catsUtils.getDescForState("y")).toEqual("Partially maintained");
		expect(catsUtils.getDescForState("g")).toEqual("Maintained");
		expect(catsUtils.getDescForState("n")).toEqual("No need for maintenance");
		expect(catsUtils.getDescForState("overbooked")).toEqual("Overbooked");
	});

	it("should identify equal tasks", function () {
		var taskA = {};
		taskA.ZCPR_OBJGEXTID = 'abc';
		var taskB = {};
		taskB.TASKTYPE = 'A';
		expect(catsUtils.isSameTask(taskA, taskA)).toEqual(true);
		expect(catsUtils.isSameTask(taskB, taskB)).toEqual(true);
		taskB.RAUFNR = '1';
		expect(catsUtils.isSameTask(taskB, taskB)).toEqual(true);
		taskB.ZCPR_OBJGEXTID = 'abc';
		expect(catsUtils.isSameTask(taskA, taskB)).toEqual(true);
	});

	it("should identify UNequal tasks", function () {
		var taskA = {};
		taskA.ZCPR_OBJGEXTID = 'abc';
		var taskB = {};
		taskB.TASKTYPE = 'A';
		taskB.RAUFNR = '1';
		expect(catsUtils.isSameTask(taskA, taskB)).toEqual(false);
		expect(catsUtils.isSameTask(taskB, taskA)).toEqual(false);
		expect(catsUtils.isSameTask(taskB, "")).toEqual(false);
		taskB.ZCPR_OBJGEXTID = 'efg';
		expect(catsUtils.isSameTask(taskA, taskB)).toEqual(false);
	});

	it("should identify fixed tasks", function () {
		var taskA = {};
		taskA.TASKTYPE = 'VACA';
		taskA.UNIT = "H";
		expect(catsUtils.isFixedTask(taskA)).toEqual(true);
		taskA.TASKTYPE = 'ABSE';
		taskA.UNIT = "H";
		expect(catsUtils.isFixedTask(taskA)).toEqual(true);
		taskA.TASKTYPE = 'COMP';
		expect(catsUtils.isFixedTask(taskA)).toEqual(true);
	});

	it("should identify NOT fixed tasks", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
		taskA.TASKTYPE = 'DEVL';
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
		taskA.TASKTYPE = 'MESS';
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
		taskA.TASKTYPE = 'ICON';
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
		taskA.TASKTYPE = 'ABSE';
		taskA.UNIT = "TA";
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
		taskA.TASKTYPE = 'VACA';
		taskA.UNIT = "TA";
		expect(catsUtils.isFixedTask(taskA)).toEqual(false);
	});

	it("should identify valid tasks", function () {
		var taskA = {};
		taskA.TASKTYPE = 'MAIN';
		expect(catsUtils.isValid(taskA)).toEqual(true);
		taskA.TASKTYPE = '';
		taskA.ZCPR_OBJGEXTID = 'abc';
		expect(catsUtils.isValid(taskA)).toEqual(true);
	});

	it("should identify invalid tasks", function () {
		var taskA = {};
		expect(catsUtils.isValid(taskA)).toEqual(false);
		taskA.RAUFNR = '1';
		expect(catsUtils.isValid(taskA)).toEqual(false);
		taskA.RAUFNR = '';
		taskA.ZCPR_EXTID = 'abc';
		expect(catsUtils.isValid(taskA)).toEqual(false);
	});
});
