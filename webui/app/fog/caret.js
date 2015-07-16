(function() {
    'use strict';

    function CaretServiceFactory($window, $document) {

        function preserve(rootElement, fn) {
            var selection,
                range,
                fragment,
                offset,
                isNotEmpty;

            function enrichRange(element) {
                var i,
                    node;
                for (i = 0; i < element.childNodes.length; i++) {
                    node = element.childNodes[i];
                    if (node.textContent.length > offset) {
                        if (node.nodeType === $window.Node.TEXT_NODE) {
                            range.setStart(node, offset);
                            range.setEnd(node, offset);
                        } else {
                            enrichRange(node);
                        }
                        break;
                    } if (node.textContent.length === offset) {
                        range = $document[0].createRange();
                        range.setStartAfter(node);
                        range.setEndAfter(node);
                        break;
                    } else {
                        offset -= node.textContent.length;
                    }
                }
            }

            // [PERF] Cache value to reduce number of DOM calls
            isNotEmpty = rootElement.hasChildNodes();

            // Capture caret
            if(isNotEmpty) {
                selection = $window.getSelection();
                if (selection.rangeCount === 1) {
                    range = selection.getRangeAt(0);
                    if (range.collapsed) {
                        range.setStartBefore(rootElement.childNodes[0]);
                        fragment = range.cloneContents();
                        offset = fragment.textContent.length;
                    }
                }
            }

            // Invoke function that manipulates the DOM
            // and possibly resets caret position
            fn();

            // Restore caret
            if(isNotEmpty && offset) {
                selection = $window.getSelection();
                selection.removeAllRanges();
                range = $document[0].createRange();
                enrichRange(rootElement);
                selection.addRange(range);
            }
        }

        return {
            preserve: preserve
        };
    }

    angular.module('app.fog').factory('app.fog.caret', [
        '$window',
        '$document',
        CaretServiceFactory
    ]);

}());
