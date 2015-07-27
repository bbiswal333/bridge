/*eslint-env browser */
describe('Gunning Fog Index - Text Directive', function () {

    var documentMock,
        dataMock,
        highlightMock,
        caretMock,
        $rootScope,
        element;

    beforeEach(module('app.fog', function($provide) {

        documentMock = [{
            activeElement: null
        }];

        dataMock = {
            calculate: jasmine.createSpy('calculate')
        };

        highlightMock = {
            wrap: jasmine.createSpy('wrap').and.callFake(angular.identity)
        };

        caretMock = {
            preserve: jasmine.createSpy('preserve').and.callFake(function() {
                arguments[1]();
            })
        };

        $provide.value('$document', documentMock);
        $provide.value('app.fog.data', dataMock);
        $provide.value('app.fog.highlight', highlightMock);
        $provide.value('app.fog.caret', caretMock);
    }));

    describe('Defaults', function() {

        beforeEach(inject(function($compile, _$rootScope_) {
            var scope,
                template;
            $rootScope = _$rootScope_;
            template = '<app.fog.text ng-model="text"></app.fog.text>';
            scope = $rootScope.$new();
            element = $compile(template)(scope);
            scope.$digest();
        }));

        it('should add contenteditable attribute', function() {
            expect(element.attr('contenteditable')).toBe('true');
        });

        it('should add placeholder attribute', function() {
            expect(element.attr('placeholder')).toBeDefined();
        });

    });

    describe('Placeholder', function() {

        var placeholder = 'Test placeholder';

        beforeEach(inject(function($compile, _$rootScope_) {
            var scope,
                template;
            $rootScope = _$rootScope_;
            template = '<app.fog.text ng-model="text" placeholder="' + placeholder + '"></app.fog.text>';
            scope = $rootScope.$new();
            element = $compile(template)(scope);
            scope.$digest();
        }));

        it('should not override placeholder attribute', function() {
            expect(element.attr('placeholder')).toBe(placeholder);
        });

        it('should remove placeholder once focus is on element', function () {
            var body = document.querySelector('body');
            body.appendChild(element[0]);
            expect(element.text()).toBe(placeholder);
            element.focus();
            expect(element.text()).toBe('');
            element.blur();
            expect(element.text()).toBe(placeholder);
            body.removeChild(element[0]);
        });

    });

    describe('Text editing', function() {

        function MockString(str) {
            this.valueOf = function() {
                return str;
            };
            this.toString = this.valueOf;
            this.sentences = [];
            this.words = [];
            this.words.average = 0;
            this.complexWords = [];
            this.complexWords.percentage = 0;
            this.index = 0;
        }

        beforeEach(inject(function($compile, _$rootScope_) {
            var scope,
                template;
            $rootScope = _$rootScope_;
            template = '<app.fog.text ng-model="text"></app.fog.text>';
            scope = $rootScope.$new();
            element = $compile(template)(scope);
            scope.$digest();
        }));

        it('should calculate new value using data service', function () {
            var str = new MockString('<span>Test</span>');
            dataMock.calculate.and.returnValue(str);
            dataMock.calculate.calls.reset();
            element.html('<p>Test</p>');
            element.triggerHandler('keyup');
            expect(dataMock.calculate).toHaveBeenCalledWith('Test');
        });

        it('should wrap calculated value using highlight service', function () {
            var text = new MockString('Test');
            dataMock.calculate.and.returnValue(text);
            highlightMock.wrap.calls.reset();
            element.html('<p>Test</p>');
            element.triggerHandler('keyup');
            expect(highlightMock.wrap).toHaveBeenCalledWith(
                text,
                text.complexWords,
                {style:'color:red'}
            );
        });

        it('should preserve caret position using caret service', function () {
            var str = new MockString('Test');
            dataMock.calculate.and.returnValue(str);
            caretMock.preserve.calls.reset();
            element.html('<p>Test</p>');
            element.triggerHandler('keyup');
            expect(caretMock.preserve).toHaveBeenCalled();
        });

    });

});
