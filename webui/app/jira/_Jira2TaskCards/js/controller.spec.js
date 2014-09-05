  describe('The Jira2 task cards controller', function() {

    var scope, $window;

    beforeEach(function() {

		angular.mock.module('myApp');

		$window = {print: function() {} };

      	module(function($provide) {
        	$provide.value('$window', $window);
      	});

      	inject(function($controller) {
      		scope = {};
      		$controller('MyCtrl1', {$scope:scope});
    	});

	});

    it("should have the default config on startup", function(){
        expect(scope.statusMessage).toBe("Waiting for input");
		expect(scope.descriptionFlag).toBe(true);
		expect(scope.layouts.length).toBe(3);
		expect(scope.layout).toBeDefined();
    });
	
    it("should call window.print when clicking the print button", function(){
        spyOn($window, "print");
        scope.printButtonClicked();
		expect($window.print).toHaveBeenCalled();
    });

	it("should change the status message when clicking the fire button", function(){
		scope.fireButtonClicked();
		expect(scope.statusMessage).not.toBe("Waiting for input");
	});

});
