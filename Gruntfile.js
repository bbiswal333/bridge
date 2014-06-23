module.exports = function (grunt) {

  grunt.config.init({
    eslint: {
      all: 
      [
      	'webui/**/*.js', 
      	'!webui/lib/**',
      	'!**/*.spec.js'
      	]
    }
  });

  grunt.loadNpmTasks('eslint-grunt');
  grunt.registerTask('check', ['eslint']);
};