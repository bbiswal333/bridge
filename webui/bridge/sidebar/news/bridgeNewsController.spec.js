describe("The bridgeNewsController", function(){
    var $rootScope,
        $controller,
        newsInitializeCalled = false,
        newsServiceMock = {
            isInitialized: false,
            initialize: function(){
                newsInitializeCalled = true;
                this.news = {
                    data: [
                        {
                            "id":		1,
                            "header": 	"header0",
                            "preview": 	"preview0",
                            "snapURL": 	"bridge/sidebar/news/image/snap02.png",
                            "content": 	"content00fghjfgnusfgdfunfgunsfgnubsusnznuzub",
                            "img1": 	"bridge/sidebar/news/image/snap02.png",
                            "gitURL": 	"https://github.wdf.sap.corp/bridge/bridge/issues/438"
                        },
                        {
                            "id":       2,
                            "header":   "header1",
                            "preview":  "preview1",
                            "snapURL":  "bridge/sidebar/news/image/snap02.png",
                            "content":  "content01",
                            "img1":     "bridge/sidebar/news/image/snap02.png",
                            "gitURL": 	"https://github.wdf.sap.corp/bridge/bridge/issues/438"
                        }
                    ]
                };
            }
        },
        modalOpenCalled = false,
        modalMock = {
            open: function(){
                modalOpenCalled = true;
            }
        },
        dataServiceMock = {
            bridgeSettings: {
                readNews: []
            },
            getBridgeSettings: function(){
                return this.bridgeSettings;
            }
        };

    beforeEach(function(){
        module("bridge.app");
        dataServiceMock.getBridgeSettings().readNews.length = 0;

        inject(["$rootScope", "$controller", function(_$rootScope, _$controller){
            $rootScope = _$rootScope;
            $controller = _$controller;
        }]);
    });

    it("should initialize the newsService", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        expect(newsInitializeCalled).toBe(true);
    });

    it("should show the news modal", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.show_news();
        expect(modalOpenCalled).toBe(true);
    });

    it("should update the selectedNews", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.show_news("testDummy");
        expect(newsServiceMock.selectedNews).toBe("testDummy");
    });

    it("should change the tab selection", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.selectTab("dummyTab");
        expect($rootScope.selectedTab).toBe("dummyTab");
    });

    it("should remove items with the filter", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        var mockNewsItem = {
            id: 7
        };
        dataServiceMock.getBridgeSettings().readNews.push(7);

        $rootScope.selectTab("new");
        expect($rootScope.filterList(mockNewsItem)).toBe(false);
    });

    it("should keep items even after filtering", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        var mockNewsItem = {
            id: 7
        };

        $rootScope.selectTab("new");
        expect($rootScope.filterList(mockNewsItem)).toBe(true);
    });

    it("should add all newsItems to the list of read news", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.markAllNewsAsRead();
        expect(dataServiceMock.getBridgeSettings().readNews.length).toBe(2);
    });

    it("should be able to mark news as read even if the config property does not exist yet", function(){
        var bridgeSettings = dataServiceMock.getBridgeSettings();
        delete bridgeSettings.readNews;

        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.markAllNewsAsRead();
        expect(dataServiceMock.getBridgeSettings().readNews.length).toBe(2);
    });

    it("should mark the selected news item as read", function(){
        $controller("sidebarNewsController", {
            "$scope": $rootScope,
            "$modal": modalMock,
            "bridge.service.bridgeNews": newsServiceMock,
            "bridgeDataService": dataServiceMock
        });

        $rootScope.markItemAsRead($rootScope.news.data[0]);
        expect(dataServiceMock.getBridgeSettings().readNews.length).toBe(1);
        expect(dataServiceMock.getBridgeSettings().readNews[0]).toBe(1);
    });
});
