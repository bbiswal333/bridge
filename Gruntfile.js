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

  grunt.log.header = function() {};  
  grunt.loadNpmTasks('eslint-grunt');

  grunt.registerTask('check-style', function(){
    var output = grunt.task.run('eslint:checkstyle');
    grunt.file.write('checkstyle.xml', output);
  });

  grunt.registerTask('check', ['eslint:compact:all']);
  //grunt.registerTask('check-style', ['eslint:checkstyle:all']);
};