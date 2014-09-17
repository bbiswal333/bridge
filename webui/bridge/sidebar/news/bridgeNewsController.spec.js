describe("The bridgeNewsController", function(){
    var $rootScope,
        newsInitializeCalled = false,
        newsServiceMock = {
            isInitialized: false,
            initialize: function(){
                newsInitializeCalled = true;
            }
        },
        modalOpenCalled = false,
        modalMock = {
            open: function(){
                modalOpenCalled = true;
            }
        };

    beforeEach(function(){
        module("bridge.app");

        inject(["$rootScope", "$controller", function(_$rootScope, _$controller){
            $rootScope = _$rootScope;
            _$controller("sidebarNewsController", {
                "$scope": $rootScope,
                "$modal": modalMock,
                "bridge.service.bridgeNews": newsServiceMock
            });
        }]);
    });

    it("should initialize the newsService", function(){
        expect(newsInitializeCalled).toBe(true);
    });

    it("should show the news modal", function(){
        $rootScope.show_news();
        expect(modalOpenCalled).toBe(true);
    });

    it("should update the selectedNews", function(){
        $rootScope.show_news("testDummy");
        expect(newsServiceMock.selectedNews).toBe("testDummy");
    });

    it("should change the tab selection", function(){
        $rootScope.selectTab("dummyTab");
        expect($rootScope.selectedTab).toBe("dummyTab");
    });
});
