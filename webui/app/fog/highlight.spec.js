describe('Gunning Fog Index - Highlight Service', function () {

    var highlight;

    beforeEach(module('app.fog'));

    beforeEach(inject(['app.fog.highlight', function (_highlight_) {
        highlight = _highlight_;
    }]));

    it('should wrap words with spans with specified style', function() {
        var html = highlight.wrap(
            'This is a test',
            ['is', 'test'],
            {style: 'color:red'}
        );
        expect(html).toBe('This <span style="color:red">is</span> a <span style="color:red">test</span>');
    });

});
