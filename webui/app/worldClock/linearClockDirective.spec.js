describe("Linear Clock Directive", function() {
	var $scope;
	var calUtils;
	var interval;

	beforeEach(function() {
		module("templates");
		module("lib.utils");
		module("app.worldClock");

		inject(["lib.utils.calUtils", function (_calUtils_) {
			calUtils = _calUtils_;
			calUtils.now = function() {
				return new Date(2014, 11, 11, 11, 11, 11);
			};
		}]);

		inject(function($rootScope, $compile, $interval) {
			interval = $interval;
			$rootScope.timeOffset = 0;
			var element = angular.element("<app.world-clock.linear-clock time-offset-in-milliseconds='timeOffset'><div width='200'></div></app.world-clock.linear-clock>");
			var template = $compile(element)($rootScope.$new());
			$rootScope.$apply();
			$scope = template.isolateScope();
			$scope.$digest();
		});
	});

	it("should create the data array based on the current time", function() {
		expect($scope.timeArray.length).toEqual(49);
		expect($scope.timeArray[0].getDate()).toEqual(10);
		expect($scope.timeArray[0].getHours()).toEqual(11);
		expect($scope.timeArray[0].getMinutes()).toEqual(0);

		expect($scope.timeArray[11].getDate()).toEqual(10);
		expect($scope.timeArray[11].getHours()).toEqual(22);
		expect($scope.timeArray[11].getMinutes()).toEqual(0);

		expect($scope.timeArray[24].getDate()).toEqual(11);
		expect($scope.timeArray[24].getHours()).toEqual(11);
		expect($scope.timeArray[24].getMinutes()).toEqual(0);

		expect($scope.timeArray[48].getDate()).toEqual(12);
		expect($scope.timeArray[48].getHours()).toEqual(11);
		expect($scope.timeArray[48].getMinutes()).toEqual(0);
	});

	it("should calculate the correct clock and cursor offset", function() {
		expect($scope.clockOffset).toEqual(-1877);
		expect($scope.cursorOffset).toEqual(-1927);
		expect($scope.now.toISOString()).toEqual(calUtils.now().toISOString());
	});

	it("should align the offsets when the time is changed", function() {
		$scope.now = calUtils.utcNowWithOffset(7200000);
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(7200000);
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-1997);
		expect($scope.cursorOffset).toEqual(-2087);
	});

	it("should react on dragging the cursor", function() {
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 460});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-2471000);
		expect($scope.now.toISOString()).toEqual("2014-12-11T09:30:00.000Z");
		$scope.handleMouseMove({clientX: 420});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-4271000);
		expect($scope.now.toISOString()).toEqual("2014-12-11T09:00:00.000Z");
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseUp();
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 600});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(229000);
		expect($scope.now.toISOString()).toEqual("2014-12-11T10:15:00.000Z");
		expect($scope.clockOffset).toEqual(-1877);
	});

	it("should react on dragging the cursor from right to left and back", function() {
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 420});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-4271000);
		expect($scope.now.toISOString()).toEqual("2014-12-11T09:00:00.000Z");
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseMove({clientX: 600});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(4729000);
		expect($scope.now.toISOString()).toEqual("2014-12-11T11:30:00.000Z");
		expect($scope.clockOffset).toEqual(-1877);
	});

	it("should move the clock below when the cursor moves to far to the edge", function() {
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 700});
		$scope.$digest();
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-1997);
	});
});
