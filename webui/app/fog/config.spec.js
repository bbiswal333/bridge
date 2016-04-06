describe('Gunning Fog Index - Config Service', function () {

    var config, bridgeDataService;

    module("bridge.service");
    beforeEach(module('app.fog', function($provide){
        var app = {};
        var mockDataService = {
            getAppById: function() {
                return app;
            }
        };

        $provide.value("bridgeDataService", mockDataService);
    }));
    beforeEach(inject(['app.fog.config', 'bridgeDataService', function (_config_, _bridgeDataService_) {
        config = _config_;
        bridgeDataService = _bridgeDataService_;
    }]));

    it('should provide default configuration', function() {
        expect(angular.isArray(config.metrics)).toBeTruthy();
        expect(angular.isArray(config.suffixes)).toBeTruthy();
        expect(angular.isArray(config.exclude)).toBeTruthy();
        expect(angular.isObject(config.highlight)).toBeTruthy();
    });

    it('should append the return config function to it\'s app instance', function() {
        config.initialize('appId1');
        expect(typeof bridgeDataService.getAppById('appId1').returnConfig).toBe("function");
    });

});
