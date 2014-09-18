describe("The bridge news service", function () {
    var newsService,
        $httpBackend,
        bridgeSettings = {
            readNews: [],
        },
        newsDummyData = {
            "news": [
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

        $httpBackend.whenGET("../bridge/menubar/news/news.json").respond(newsDummyData);
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
