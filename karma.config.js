// Karma configuration
// Generated on Tue Jan 28 2014 15:40:23 GMT+0100 (W. Europe Standard Time)
module.exports = function(config) {
  var stealthMode = false;
  if (typeof process.argv[4] != "undefined" && process.argv[4] == "-stealth") {
    console.log("Running in stealth mode");
    stealthMode = true;
  }

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser (*.spec.js is redundant)
    files: [
      './webui/lib/jQuery-2_1_0/jquery.min.js',
      './webui/lib/angular-1_2_13/angular.min.js',
      './webui/lib/**/*.js',

      './webui/loader_mock.js',

      './webui/bridge/bridgeController.js',
      './webui/bridge/bridgeDataService.js',

      './webui/bridge/**/*.js',

      './webui/app/meetings/*.js',

      './webui/app/lunchWalldorf/overview.js',

      './webui/app/githubMilestone/overview.js',
      './webui/app/githubMilestone/config.js',
      './webui/app/githubMilestone/settings.js',

      './webui/app/test/overview.js',

      './webui/app/jira/overview.js',
      './webui/app/jira/*.js',

      './webui/app/im/overview.js',
      './webui/app/im/*.js',

      './webui/app/employeeSearch/*.js',

      './webui/app/atc/overview.js',
      './webui/app/atc/*.js',

      './webui/app/cats/overview.js',
      './webui/app/cats/**/*.js',

      '**/*.spec.js',
    ],


    // list of files to exclude
    exclude: [
      "./webui/Test/**/*",
      "./server/**/*"
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


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

    //browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
