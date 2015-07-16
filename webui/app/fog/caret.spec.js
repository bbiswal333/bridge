/*eslint-env browser */
describe('Gunning Fog Index - Caret Service', function () {

    var caret;

    beforeEach(module('app.fog'));
    beforeEach(inject(['app.fog.caret', function (_caret_) {
        caret = _caret_;
    }]));

    it('should call callback function', function() {
        var callback = jasmine.createSpy('callback');
        caret.preserve(document.querySelector('body'), callback);
        expect(callback).toHaveBeenCalled();
    });

    it('should preserve caret position after modification of parent element DOM', function () {
        var div,
            selection,
            range,
            node,
            offset;

        div = document.createElement('div');
        document.querySelector('body').appendChild(div);
        div.innerHTML = 'Hello <p><span>world!</span> <!-- some comments /--> Some text</p>';

        node = div.childNodes[1].childNodes[3]; // ' Some text'
        offset = 3; // after ' So'

        selection = window.getSelection();
        selection.removeAllRanges();
        range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        selection.addRange(range);

        caret.preserve(div, function() {
            div.innerHTML = 'Hello world!  Some <span style="color:red">text</span>';
        });

        selection = window.getSelection();
        range = selection.getRangeAt(0);

        expect(range.collapsed).toBe(true);
        expect(range.startOffset).toBe(16);

        div.parentNode.removeChild(div);
    });

});
