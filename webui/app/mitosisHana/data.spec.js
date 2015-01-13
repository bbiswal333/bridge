describe("Manages the data retrieval", function () {

    var $httpBackend;
    var dataService;
    var configService;

    beforeEach(function () {

        module('bridge.service');
        module("app.mitosisHana");

        inject(["$httpBackend", "app.mitosisHana.configservice", "app.mitosisHana.dataservice", function (_$httpBackend, _configService_, _dataService_) {
            $httpBackend = _$httpBackend;
            configService = _configService_.getConfigForAppId("app.mitosisHana");
            dataService = _atcDataService.getInstanceForAppId("app.mitosisHana");
        }]);
        
    });

 

});
