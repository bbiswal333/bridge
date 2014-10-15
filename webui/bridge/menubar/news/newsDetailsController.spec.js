describe("The newsDetailsController", function() {
    var $rootScope,
        //closeCalled = false,
        newsServiceMock = {
            modalInstance: {
                close: function(){
                    //closeCalled = true;
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

});
