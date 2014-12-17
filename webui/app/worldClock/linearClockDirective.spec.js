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
				return new Date(Date.UTC(2014, 11, 11, 11, 11, 11));
			};
			calUtils.useNDigits = function() {
				return "";
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
		expect($scope.timeArray[0].getUTCDate()).toEqual(10);
		expect($scope.timeArray[0].getUTCHours()).toEqual(11);
		expect($scope.timeArray[0].getUTCMinutes()).toEqual(0);

		expect($scope.timeArray[11].getUTCDate()).toEqual(10);
		expect($scope.timeArray[11].getUTCHours()).toEqual(22);
		expect($scope.timeArray[11].getUTCMinutes()).toEqual(0);

		expect($scope.timeArray[24].getUTCDate()).toEqual(11);
		expect($scope.timeArray[24].getUTCHours()).toEqual(11);
		expect($scope.timeArray[24].getUTCMinutes()).toEqual(0);

		expect($scope.timeArray[48].getUTCDate()).toEqual(12);
		expect($scope.timeArray[48].getUTCHours()).toEqual(11);
		expect($scope.timeArray[48].getUTCMinutes()).toEqual(0);
	});

	it("should calculate the correct clock and cursor offset", function() {
		expect($scope.clockOffset).toEqual(-1877);
		expect($scope.cursorOffset).toEqual(-1927);
		expect($scope.now.toUTCString()).toEqual(calUtils.now().toUTCString());
	});

	it("should align the offsets when the time is changed", function() {
		$scope.now = calUtils.utcNowWithOffset(7200000);
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(7200000);
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-1997);
		expect($scope.cursorOffset).toEqual(-2087);
	});

	it("should check the time each 10 seconds and align the cursors", function() {
		spyOn(calUtils, "utcNowWithOffset");
		interval.flush(30000);
		expect(calUtils.utcNowWithOffset).toHaveBeenCalled();
		expect(calUtils.utcNowWithOffset.calls.count()).toEqual(3);
	});

	it("should react on dragging the cursor", function() {
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 460});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-2471000);
		expect($scope.now.toUTCString()).toEqual("Thu, 11 Dec 2014 10:30:00 GMT");
		$scope.handleMouseMove({clientX: 420});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-4271000);
		expect($scope.now.toUTCString()).toEqual("Thu, 11 Dec 2014 10:00:00 GMT");
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseUp();
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 600});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(229000);
		expect($scope.now.toUTCString()).toEqual("Thu, 11 Dec 2014 11:15:00 GMT");
		expect($scope.clockOffset).toEqual(-1877);
	});

	it("should react on dragging the cursor from right to left and back", function() {
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 420});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(-4271000);
		expect($scope.now.toUTCString()).toEqual("Thu, 11 Dec 2014 10:00:00 GMT");
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseMove({clientX: 600});
		$scope.$digest();
		expect($scope.timeOffsetInMilliseconds).toEqual(4729000);
		expect($scope.now.toUTCString()).toEqual("Thu, 11 Dec 2014 12:30:00 GMT");
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

	it("should continue to move the clock when the cursor stays at the edge and stop when cursor moves back", function() {
		expect($scope.clockOffset).toEqual(-1877);
		$scope.handleMouseDown({clientX: 500});
		$scope.handleMouseMove({clientX: 700});
		$scope.$digest();
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-1997);
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-2117);
		$scope.handleMouseMove({clientX: 100});
		$scope.$digest();
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-2237);
		$scope.handleMouseMove({clientX: -100});
		$scope.$digest();
		interval.flush(1000);
		expect($scope.clockOffset).toEqual(-2117);
	});
});
