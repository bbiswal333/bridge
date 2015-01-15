// Karma configuration
// Generated on Tue Jan 28 2014 15:40:23 GMT+0100 (W. Europe Standard Time)
module.exports = function(config) {
    var stealthMode = false;
    console.log("\nDon't worry about tests, Chuck Norris's test cases cover your code too.\n");
    if (typeof process.argv[4] != "undefined" && process.argv[4] == "-stealth") {
        console.log("Running in stealth mode");
        stealthMode = true;
    }

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],

        proxies: {
            '/web': 'http://proxy:8080'
        },

        // list of files / patterns to load in the browser (*.spec.js is redundant)
        files: [
            './webui/lib/jQuery-2_1_0/jquery.min.js',
            './webui/lib/angular-1_3_8/angular.min.js',
            './webui/lib/sigma-1_0_3/sigma.min.js',
            'http://js.api.here.com/se/2.5.4/jsl.js',
            './webui/lib/**/*.js',

            './webui/loader_mock.js',

            './webui/app/**/*.html',
            './webui/bridge/**/*.html',
            './webui/view/**/*.html',

            // note all files that create angular modules here. They need to be loaded first
            './webui/bridge/bridgeController.js',
            './webui/bridge/bridgeDataService.js',
            './webui/bridge/libUtils.js',
            './webui/bridge/diagnosis/logService.js',
            './webui/bridge/mobileSearch/bridgeMobileSearchResults.js',
            './webui/bridge/controls/bridgeTable/bridgeTable.js',

            './webui/app/**/overview.js',

            './webui/**/!(browser_redirect).js',
            './webui/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [
            "./webui/Test/**/*",
            "./server/**/*",
            "./client/**/*",
            "./webui/lib/angular-1_3_8/angular.js",
            "./webui/lib-bower/**/*",
            "https://js.api.here.com/**/*"
        ],

        preprocessors: {
            './webui/app/**/*.html': ['ng-html2js'],
            './webui/bridge/**/*.html': ['ng-html2js'],
            './webui/view/**/*.html': ['ng-html2js'],
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            './webui/!(*.spec).js': ['coverage'],
            './webui/!(lib)/**/!(*.spec).js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress','dots','junit','coverage'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'webui/',
            moduleName: 'templates'
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'text-summary',
            dir : 'coverage',
            subdir: 'results',
            file : 'coverage.txt'
        },

        junitReporter: {
          outputFile: 'test-results.xml'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: [(stealthMode) ? 'PhantomJS' : 'Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
