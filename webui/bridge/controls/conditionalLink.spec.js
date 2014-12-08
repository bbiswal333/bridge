describe("The bridge conditionalLink directive", function() {
    var $rootScope, $compile, $location;

    beforeEach(function () {
        module('templates');
        module('bridge.controls');

        inject(function (_$rootScope_, _$compile_, _$location_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $location = _$location_;
        });
    });

    it("should be clickable and navigate away", function () {
        var element = angular.element('' +
        '<bridge.conditional-link navigate-to="/testPage" navigate-if="1 + 1 === 2">' +
            '<span>My Test Link</span>' +
        '</bridge.conditional-link>');

        $compile(element)($rootScope);
        $rootScope.$digest();

        element.children().scope().navigate();
        expect($location.path()).toBe("/testPage");
    });

    it("should not be clickable and should not navigate", function(){
        var element = angular.element('' +
        '<bridge.conditional-link navigate-to="/testPage" navigate-if="1 + 1 === 0">' +
            '<span>My Test Link</span>' +
        '</bridge.conditional-link>');

        $compile(element)($rootScope);
        $rootScope.$digest();

        element.children().scope().navigate();
        expect($location.path()).toBe("");
    });
});
