/*eslint-env browser */
describe('Gunning Fog Index - Metric Directive', function () {

    var scope,
        element;

    beforeEach(module('app.fog'));

    beforeEach(inject(function($compile, $rootScope) {
        var template;
        template = '<app.fog.metric metric="metric" data="text"></app.fog.metric>';
        scope = $rootScope.$new();
        scope.metric = {
            abbreviation: 'TEST',
            name: 'Test',
            description: 'Test Test',
            display: {
                overview: false,
                detail: true
            },
            value: 'value',
            units: 'USD'
        };
        scope.text = {
            value: 1.23456789
        };
        element = $compile(template)(scope);
        document.querySelector('body').appendChild(element[0]);
        scope.$digest();
    }));

    afterEach(function() {
        document.querySelector('body').removeChild(element[0]);
    });

    it('should add metric abbreviation as text', function() {
        expect(element.find('span').text()).toContain(scope.metric.abbreviation);
    });

    it('should add formatted data value as text', function() {
        expect(element.find('span').text()).toContain(scope.text.value.toFixed(2));
    });

    it('should not add fraction part for integer values', function() {
        scope.text = {
            value: 8
        };
        scope.$digest();
        expect(element.find('span').text()).toContain('8');
        expect(element.find('span').text()).not.toContain('8.00');
    });

    it('should add metric units as text', function() {
        expect(element.find('span').text()).toContain(scope.metric.units);
    });

    it('should add metric description as title', function() {
        expect(element.find('span').attr('title')).toBe(scope.metric.description);
    });
});
