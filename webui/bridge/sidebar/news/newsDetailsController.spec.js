describe("The newsDetailsController", function() {
    var $rootScope,
        closeCalled = false,
        newsServiceMock = {
            selectedNews: "testDummy",
            modalInstance: {
                close: function(){
                    closeCalled = true;
                }
            }
        };

    beforeEach(function () {
        module("bridge.app");

        inject(["$rootScope", "$controller", function (_$rootScope, _$controller) {
            $rootScope = _$rootScope;
            _$controller("newsDetailController", {
                "$scope": $rootScope,
                "bridge.service.bridgeNews": newsServiceMock
            });
        }]);
    });

    it("should put the selectedNews from the service onto the scope", function () {
        expect($rootScope.selectedNews).toBe("testDummy");
    });

    it("should close the modal when clicking the close button", function(){
        $rootScope.closeModal();
        expect(closeCalled).toBe(true);
    });
});
