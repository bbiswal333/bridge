module.exports = function (grunt) {

  grunt.config.init({    
    eslint: {
      compact:
      {
        files: {
          src:[
          'webui/**/*.js', 
          '!webui/lib/**',
          '!**/*.spec.js'
          ]
        },        
        options: 
        {
          formatter: "compact"
        }
      },
      checkstyle:
      {
        files: {
          src:[
          'webui/**/*.js', 
          '!webui/lib/**',
          '!**/*.spec.js'
          ]
        },        
        options: 
        {
          formatter: "checkstyle"
        }
      }
    }
  });

  grunt.loadNpmTasks('eslint-grunt');

  grunt.registerTask('check', ['eslint:compact:all']);
  grunt.registerTask('check-style', ['eslint:checkstyle:all']);
};