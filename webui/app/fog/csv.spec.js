/*eslint-env browser */
describe('Gunning Fog Index - CSV Directive', function () {

    var scope,
        element;

    beforeEach(module('app.fog'));

    beforeEach(inject(function($compile, $rootScope) {
        var template;
        template = '<form name="form"><input type="text" name="input" ng-model="text" app.fog.csv="" /></form>';
        scope = $rootScope.$new();
        element = $compile(template)(scope);
        document.querySelector('body').appendChild(element[0]);
        scope.$digest();
    }));

    afterEach(function() {
        document.querySelector('body').removeChild(element[0]);
    });

    it('should return empty array if viewValue is null', function() {
        scope.form.input.$setViewValue(null);
        scope.$digest();
        expect(scope.text).toEqual([]);
    });

    it('should return empty array for empty string', function() {
        scope.form.input.$setViewValue('');
        scope.$digest();
        expect(scope.text).toEqual([]);
    });

    it('should split comma separated values to array', function() {
        scope.form.input.$setViewValue('test1,test2');
        scope.$digest();
        expect(scope.text).toEqual(['test1', 'test2']);
    });

    it('should not add empty strings to array', function() {
        scope.form.input.$setViewValue('test1,,test2');
        scope.$digest();
        expect(scope.text).toEqual(['test1', 'test2']);
    });

});
