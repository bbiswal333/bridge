describe('Gunning Fog Index - Config Service', function () {

    var config;

    beforeEach(module('app.fog'));
    beforeEach(inject(['app.fog.config', function (_config_) {
        config = _config_;
    }]));

    it('should provide default configuration', function() {
        expect(angular.isArray(config.metrics)).toBeTruthy();
        expect(angular.isArray(config.suffixes)).toBeTruthy();
        expect(angular.isArray(config.exclude)).toBeTruthy();
        expect(angular.isObject(config.highlight)).toBeTruthy();
    });

});
