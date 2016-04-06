(function() {
    'use strict';

    var config = {
        metrics: [{
            abbreviation: 'S',
            name: 'Sentences',
            description: 'Number of sentences',
            display: {
                overview: false,
                detail: true
            },
            value: 'sentences.length',
            units: ''
        }, {
            abbreviation: 'W',
            name: 'Words',
            description: 'Number of words',
            display: {
                overview: false,
                detail: true
            },
            value: 'words.length',
            units: ''
        }, {
            abbreviation: 'WA',
            name: 'Words Average',
            description: 'Average number of words per sentence',
            display: {
                overview: false,
                detail: true
            },
            value: 'words.average',
            units: ''
        }, {
            abbreviation: 'CW',
            name: 'Complex Words',
            description: 'Number of complex words',
            display: {
                overview: false,
                detail: true
            },
            value: 'complexWords.length',
            units: ''
        }, {
            abbreviation: 'CWP',
            name: 'Complex Words Percentage',
            description: 'Percentage of complex words among the words',
            display: {
                overview: false,
                detail: true
            },
            value: 'complexWords.percentage',
            units: '%'
        }, {
            abbreviation: 'Index',
            name: 'Gunning Fog Index',
            description: 'Gunning fog index',
            display: {
                overview: true,
                detail: true
            },
            value: 'index',
            units: ''
        }],
        suffixes: ['ing', 'ed', 'es'],
        exclude: [],
        highlight: {
            complexWords: 'red'
        },
        welcome: true
    };

    function ConfigService(bridgeDataService) {
        // Apply default configuration
        angular.extend(this, config);
        var that = this;

        this.initialize = function(appId) {
            bridgeDataService.getAppById(appId).returnConfig = function() {
                return that;
            };
        };
    }

    angular.module('app.fog').service('app.fog.config', ['bridgeDataService',
        ConfigService
    ]);

}());
