//var $injector = angular.injector(['app.cats', 'ng']);
//var $controller = angular.module('app.cats').catsSettings;
  // $scope = $injector.get('$rootScope');

describe("Settings view of cats app", function () {
	var config;
	var favoriteItemsMock = JSON.parse('[{"id": "objgextid1raufnr1DEVL", "RAUFNR": "raufnr1", "TASKTYPE": "DEVL", "ZCPR_EXTID": "extid1", "ZCPR_OBJGEXTID": "objgextid1", "UNIT": "", "DESCR": "task1"}]');
	var catsItemsMock = JSON.parse('[{"id": "objgextid2raufnr2DEVL", "RAUFNR": "raufnr2", "TASKTYPE": "DEVL", "ZCPR_EXTID": "extid2", "ZCPR_OBJGEXTID": "objgextid2", "UNIT": "", "DESCR": "task2"}]');
	// var fovoriteItemsMock = JSON.parse('{"id": "", "RAUFNR": "", "TASKTYPE": "", "ZCPR_EXTID": "", "ZCPR_OBJGEXTID": "", "UNIT": "", "DESCR": ""}');
	var $scope;
	var bridgeInBrowserNotification;

	beforeEach(angular.mock.module('app.cats'));
	beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
      // $controller('MyController', {$scope: $scope});
    }));
 //    beforeEach(function(){
	//     module('moduleToMock');
	//     module(function ($provide) {
	//         $provide.value('yourService', serviceMock);
	//     });
	// });
	beforeEach(inject(["app.cats.configService", "app.cats.catsUtils", function (_config_, _catsUtils_) {
		config = _config_;
		config.favoriteItems = angular.copy(favoriteItemsMock);
		config.catsItems = angular.copy(catsItemsMock);
		bridgeInBrowserNotification = {
			allertCalled: false,
            addAlert: function () {
            	this.allertCalled = true;
            }
        };
      	angular.module('app.cats').catsSettings[4]($scope, config, _catsUtils_, bridgeInBrowserNotification);
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
		config.selectedTask.TASKTYPE = "something different";
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
		config.selectedTask.TASKTYPE = "something different";
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

	it("should notify user if he creates allready existing task", function(){
		$scope.createTask();
		config.selectedTask.TASKTYPE = "something different";
		$scope.saveNewTask();
		expect(bridgeInBrowserNotification.allertCalled).toBe(false);

		$scope.createTask();
		config.selectedTask = angular.copy(favoriteItemsMock[0]);
		config.selectedTask.TASKTYPE = "something different";
		$scope.saveNewTask();
		expect(bridgeInBrowserNotification.allertCalled).toBe(true);
	});

	it("should notify user if he creates task with the same key values as any in catsItems or favoriteItems", function(){
		expect(bridgeInBrowserNotification.allertCalled).toBe(false);

		$scope.createTask();
		config.selectedTask.ZCPR_OBJGEXTID = "objgextid2";
		$scope.saveNewTask();
		expect(bridgeInBrowserNotification.allertCalled).toBe(true);
	});

	it("should not generate task id for created task on save if it is allready exists", function(){
		$scope.createTask();
		config.selectedTask.ZCPR_OBJGEXTID = "objgextid2";
		$scope.saveNewTask();

		expect(config.selectedTask.id).not.toBeDefined();
	});

	it("should clear favoriteItems if there are invalid tasks", function(){
		config.favoriteItems.push(null);
		$scope.clearFavoriteItems();
		config.favoriteItems.forEach(function(favoriteItem){
			expect(favoriteItem).not.toBe(null);
		});
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
