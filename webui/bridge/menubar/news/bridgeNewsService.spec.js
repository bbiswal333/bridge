describe("The bridge news service", function () {
    var newsService,
        $httpBackend,
        bridgeSettings = {
            readNews: []
        },
        newsDummyData = {
            "NOTIFICATIONS": [
                {
                    "ID":		1,
                    "HEADER": 	"header0",
                    "PREVIEW": 	"preview0",
                    "SNAPURL": 	"bridge/sidebar/news/image/snap02.png",
                    "CONTENT": 	"content00fghjfgnusfgdfunfgunsfgnubsusnznuzub",
                    "img1": 	"bridge/sidebar/news/image/snap02.png",
                    "gitURL": 	"https://github.wdf.sap.corp/bridge/bridge/issues/438"
                },
                {
                    "ID":       2,
                    "HEADER":   "header1",
                    "PREVIEW":  "preview1",
                    "SNAPURL":  "bridge/sidebar/news/image/snap02.png",
                    "CONTENT":  "content01",
                    "img1":     "bridge/sidebar/news/image/snap02.png",
                    "gitURL": 	"https://github.wdf.sap.corp/bridge/bridge/issues/438"
                }
            ]
        };

    beforeEach(function(){
        bridgeSettings.readNews.length = 0;

        angular.module("mock.module", []).service("bridgeDataService", function(){
            this.getBridgeSettings = function(){
                return bridgeSettings;
            };
        });

        module("bridge.service");
        module("mock.module");

        inject(["bridge.service.bridgeNews", "$httpBackend", function(_newsService, _$httpBackend){
            newsService = _newsService;
            $httpBackend = _$httpBackend;
        }]);

        $httpBackend.whenGET("https://ifd.wdf.sap.corp/sap/bc/bridge/GET_NOTIFICATIONS").respond(newsDummyData);
    });

    it("should fill the its news object when created", function(){
        newsService.initialize();
        $httpBackend.flush();

        expect(newsService.news.data.length).toBe(2);
    });

    it("should tell me that there are unread news", function(){
        newsService.initialize();
        $httpBackend.flush();

        expect(newsService.existUnreadNews()).toBe(true);
    });

    it("should tell me that there are no unread news", function(){
        bridgeSettings.readNews.push(1);
        bridgeSettings.readNews.push(2);

        newsService.initialize();
        $httpBackend.flush();
        expect(newsService.existUnreadNews()).toBe(false);
    });

    it("should tell me that there are unread news if the readNews property does not exist", function(){
        delete bridgeSettings.readNews;
        newsService.initialize();
        $httpBackend.flush();

        expect(newsService.existUnreadNews()).toBe(true);
    });

});
