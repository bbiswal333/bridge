var $injector = angular.injector(['app.cats', 'ng']);
var $controller = angular.module('app.cats').catsSettings;
  // $scope = $injector.get('$rootScope');

describe("Settings view of cats app", function () {
	var config;
	var favoriteItemsMock = JSON.parse('[{"id": "objgextid1raufnr1DEVL", "RAUFNR": "raufnr1", "TASKTYPE": "DEVL", "ZCPR_EXTID": "extid1", "ZCPR_OBJGEXTID": "objgextid1", "UNIT": "", "DESCR": "task1"}]');
	// var fovoriteItemsMock = JSON.parse('{"id": "", "RAUFNR": "", "TASKTYPE": "", "ZCPR_EXTID": "", "ZCPR_OBJGEXTID": "", "UNIT": "", "DESCR": ""}');
	var $scope;

	beforeEach(angular.mock.module('app.cats'));
	beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
      // $controller('MyController', {$scope: $scope});
    }));
	beforeEach(inject(["app.cats.configService", function (_config_) {
		config = _config_;
		config.favoriteItems = angular.copy(favoriteItemsMock);
      	angular.module('app.cats').catsSettings[2]($scope, config);
	}]));

	it("should have favorite items", function () {
		expect(config.favoriteItems.length).toEqual(1);
	});

	it("should add new task to selectedItem", function(){
		expect(config.favoriteItems.length).toEqual(1);
		$scope.createTask();
		// expect(config.favoriteItems[1]).toEqual(config.selectedTask);
		expect(config.selectedTask.custom).toBe(true);
		expect(config.selectedTask.RAUFNR).toBeDefined();
		expect(config.selectedTask.ZCPR_EXTID).toBeDefined();
		expect(config.selectedTask.ZCPR_OBJGEXTID).toBeDefined();
		expect(config.selectedTask.TASKTYPE).toBeDefined();
		expect(config.selectedTask.DESCR).toBeDefined();
	});

	it("should add new task to favorites on save", function(){
		$scope.createTask();
		expect(config.favoriteItems.length).toEqual(1);
		$scope.saveNewTask();
		expect(config.favoriteItems.length).toEqual(2);
	});

	it("shouldn't add task if it's allready existing", function(){
		config.selectedTask = favoriteItemsMock[0];
		$scope.saveNewTask();
		expect(config.favoriteItems.length).toEqual(1);
	});

	it("should generate task id for created task on save", function(){
		$scope.createTask();
		$scope.saveNewTask();
		expect(config.selectedTask.id).toBeDefined();
	});

	it("should delete created task on cancel if it was not saved", function(){
		$scope.createTask();
		$scope.cancel();
		expect(config.selectedTask).toBe(null);
	});

	it("should reset changes on cancel, also multiple times", function(){	
		config.selectedTask = angular.copy(favoriteItemsMock[0]);
		config.selectedTask.DESCR = "changed title"; 
		$scope.cancel();
		expect(config.selectedTask.DESCR).not.toEqual("changed title");

		config.selectedTask.DESCR = "changed title 2"; 
		$scope.cancel();
		expect(config.selectedTask.DESCR).not.toEqual("changed title 2");
	});

	it("should reset changes on cancel also for newly created and changed tasks", function(){	
		$scope.createTask();
		// debugger;
		config.selectedTask.DESCR = "new title"; 
		config.selectedTask.TASKTYPE = "MAIN"; 
		$scope.saveNewTask();

		config.selectedTask.DESCR = "changed title"; 
		$scope.cancel();
		
		expect(config.selectedTask.DESCR).not.toEqual("changed title");
	});

	it("should detect changes on tasks", function(){	
		config.selectedTask = angular.copy(favoriteItemsMock[0]);

		config.selectedTask.DESCR = "changed title";
		expect($scope.isUnchanged(config.selectedTask)).toBe(false);

		config.selectedTask.DESCR = "task1";
		expect($scope.isUnchanged(config.selectedTask)).toBe(true);
	});

	it("should detect newly created task as changed", function(){	
		$scope.createTask();
		expect($scope.isUnchanged(config.selectedTask)).toBe(false);
	});

	// it("should validate new tasks", function(){	
	// 	$scope.createTask();
	// 	$scope.keyPressed(); 
	// 	config.selectedTask.DESCR = "new title"; 

	// 	expect(config.selectedTask.valid).not.toBe(true);
		
	// 	config.selectedTask.TASKTYPE = "DEVL";
	// 	$scope.keyPressed(); 
	// 	expect(config.selectedTask.valid).toBe(true);
	// });
});

