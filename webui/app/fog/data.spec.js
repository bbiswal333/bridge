describe('Gunning Fog Index - Data Service', function () {

    var data;

    beforeEach(module('app.fog'));
    beforeEach(inject(['app.fog.data', function (_data_) {
        data = _data_;
    }]));

    it('should calculate Gunning Fog Index', function() {
        var str = 'The fog index is commonly used to confirm that text ' +
            'can be read easily by the intended audience. Texts for a wide audience generally ' +
            'need a fog index less than 12. Texts requiring near-universal understanding ' +
            'generally need an index less than 8.',
            text = data.calculate(str);

        expect(text).toEqual(str);
        expect(text.sentences.length).toBe(3);
        expect(text.words.length).toBe(42);
        expect(text.words.average).toBe(14);
        expect(text.complexWords.length).toBe(9);
        expect(text.complexWords.percentage.toFixed(2)).toBe('21.43');
        expect(text.index.toFixed(2)).toBe('14.17');
    });

    it('should use cache', function() {
        var str = 'Test',
            text;

        spyOn(data, 'calculate').and.callThrough();
        text = data.calculate(str);

        // .toBe() uses strict type equality,
        // objects should be equal by reference
        expect(data.get()).toBe(text);

        // .get() should not call .calculate()
        expect(data.calculate.calls.count()).toBe(1);
    });

    it('should invalidate cache', function() {
        var str = 'Test',
            text;

        spyOn(data, 'calculate').and.callThrough();
        text = data.calculate(str);
        data.clear();

        // .toBe() uses strict type equality,
        // objects should not be equal by reference
        expect(data.get()).not.toBe(text);

        // .get() should call .calculate() twice
        expect(data.calculate.calls.count()).toBe(2);
    });
});
