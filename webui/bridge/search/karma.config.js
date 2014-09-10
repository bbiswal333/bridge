// Karma configuration
// Generated on Tue Jan 28 2014 15:40:23 GMT+0100 (W. Europe Standard Time)
module.exports = function(config) {
  var stealthMode = false;
/*eslint-disable no-undef */
  if (typeof process.argv[4] !== "undefined" && process.argv[4] === "-stealth") {
/*eslint-disable no-console */
    console.log("Running in stealth mode");
/*eslint-enable no-console */
/*eslint-enable no-undef */
    stealthMode = true;
  }

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser (*.spec.js is redundant)
    files: [
        '../../lib/jQuery-2_1_0/jquery.min.js',
        '../../lib/angular-1_2_13/angular.min.js',
        '../../lib/**/*.js',
        './*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress','dots','junit'],

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
