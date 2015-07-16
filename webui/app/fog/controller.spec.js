describe('Gunning Fog Index - Controller', function () {

    var $controller,
        dataMock;

    dataMock = {
        get: jasmine.createSpy('get').and.returnValue('text'),
        calculate: angular.noop
    };

    beforeEach(module('app.fog', function ($provide) {
        $provide.value('app.fog.data', dataMock);
    }));

    beforeEach(inject(['$controller', function (_$controller_) {
        $controller = _$controller_;
    }]));

    describe('Overview', function () {

        var controller,
            scope;

        beforeEach(function() {
            dataMock.get.calls.reset();
            scope = {
                box: {},
                boxId: 'boxId'
            };
            controller = $controller('app.fog.controller', {$scope: scope});
        });

        it('should configure box', function () {
            expect(scope.box.boxSize).toBe(2);
            expect(scope.box.headerIcons && scope.box.headerIcons.length).toBeGreaterThan(0);
        });

        it('should have clear() method', function () {
            expect(typeof controller.clear).toBe('function');
        });

        it('should call data.get()', function () {
            expect(dataMock.get).toHaveBeenCalled();
        });

        it('should set $scope.text', function () {
            expect(scope.text).toBe('text');
        });

        describe('Settings', function () {

            it('should configure settings', function () {
                expect(scope.box.settingsTitle).toBeDefined();
                expect(scope.box.settingScreenData).toBeDefined();
                expect(scope.box.settingScreenData.templatePath).toBeDefined();
                expect(scope.box.settingScreenData.controller).toBeDefined();
                expect(scope.box.settingScreenData.id).toBe('boxId');
                expect(typeof scope.box.returnConfig).toBe('function');
            });

            it('should have save() method', function () {
                expect(typeof controller.save).toBe('function');
            });

        });

    });

    describe('Detail', function () {

        var controller,
            scope;

        beforeEach(function() {
            dataMock.get.calls.reset();
            scope = {};
            controller = $controller('app.fog.controller', {$scope: scope});
        });

        it('should not set box properties', function () {
            expect(scope.box).toBeUndefined();
        });

        it('should have clear() method', function () {
            expect(typeof controller.clear).toBe('function');
        });

        it('should call data.get()', function () {
            expect(dataMock.get).toHaveBeenCalled();
        });

        it('should set $scope.text', function () {
            expect(scope.text).toBe('text');
        });

    });

});
