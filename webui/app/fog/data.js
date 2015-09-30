(function() {
    'use strict';

    function DataServiceFactory(config) {

        var cache;

        function calculate(text) {
            var sentences,
                words,
                complexWords,
                index;

            text = text || '';

            // Sentences
            sentences = text.split(/[.;!?](\s|$)/gim).filter(function(sentence) {
                return sentence.trim().length > 0;
            });

            // Words
            words = text.split(/\s+/).filter(function(word) {
                return word.length > 0;
            });
            words.average = words.length / sentences.length;

            // Complex words
            complexWords = words.filter(function(word) {
                var syllables;

                // Remove punctuation
                word = word.replace(/[,.:;!?'")\]]*$/, '');

                // Exclude common suffixes
                if(config.suffixes.length) {
                    word = word.replace(new RegExp(config.suffixes.join('|') + '$'), '');
                }

                // Count syllables
                syllables = word.match(/[aeiouy]/gim) || [];

                return syllables.length >= 3 && config.exclude.indexOf(word) < 0;
            });
            complexWords.percentage = 100 * complexWords.length / words.length;

            /*
             * Calculate fog index according to the rules:
             * https://en.wikipedia.org/wiki/Gunning_fog_index
             */
            index = 0.4 * (words.average + complexWords.percentage);

            /*
             * Wrap string primitive to be able to assign
             * additional properties and read them afterwards
             */
            /*eslint-disable no-new-wrappers */
            cache = new String(text);
            /*eslint-enable no-new-wrappers */
            cache.sentences = sentences;
            cache.words = words;
            cache.complexWords = complexWords;
            cache.index = index;

            return cache;
        }

        function get() {
            /*
             * this.calculate() is used instead of calculate()
             * in order to enable mocking in tests
             */
            return cache || this.calculate();
        }

        function clear() {
            cache = null;
        }

        return {
            calculate: calculate,
            get: get,
            clear: clear
        };

    }

    angular.module('app.fog').factory('app.fog.data', [
        'app.fog.config',
        DataServiceFactory
    ]);

}());
