describe("The bridge news service", function () {
    var newsService,
        $httpBackend,
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
        module("bridge.service");

        inject(["bridge.service.bridgeNews", "$httpBackend", function(_newsService, _$httpBackend){
            newsService = _newsService;
            $httpBackend = _$httpBackend;
        }]);

        $httpBackend.whenGET("../bridge/sidebar/news/news.json").respond(newsDummyData);
    });

    it("should fill the its news object when created", function(){
        newsService.initialize();
        $httpBackend.flush();

        expect(newsService.news.data.length).toBe(2);
    });

});
