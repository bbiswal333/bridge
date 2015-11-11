(function() {
    'use strict';

    function HighlightServiceFactory() {

        function wrap(text, words, attr) {
            // assemble attributes
            attr = Object.keys(attr).reduce(function(prev, key) {
                return prev + ' ' + key + '="' + attr[key] + '"';
            }, '');
            // wrap each word from the list with span
            words.forEach(function(word) {
                var re = new RegExp(
                    '(^|\\s)(' +
                    word.replace(/([\(\)\[\]\{\}\.\!\?\:\;\$\^\*\+\-\\])/gm, '\\$1') +
                    ')(\\s|$)',
                'm');
                text = text.replace(re, '$1<span' + attr + '>$2</span>$3');
            });
            return text;
        }

        return {
            wrap: wrap
        };
    }

    angular.module('app.fog').factory('app.fog.highlight', [
        HighlightServiceFactory
    ]);

}());
