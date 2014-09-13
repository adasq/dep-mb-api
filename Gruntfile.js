module.exports = function ( grunt ) {
  
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-coffee');
  // grunt.loadNpmTasks('grunt-contrib-less');
  // grunt.loadNpmTasks('grunt-conventional-changelog');
  // grunt.loadNpmTasks('grunt-bump');
  // grunt.loadNpmTasks('grunt-coffeelint');
     grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('grunt-ngmin');

  var userConfig = require('./config.js');

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),  
    karma: {
      options: {        
      },
      unit: {
        configFile: 'karma-unit.js',
        port: 9019,
        background: true
      },
      continuous: { 
       configFile: 'karma-unit.js',       
        singleRun: true
      }
    },
    jshint: {
      js: [ 
        '<%= app_files.js %>'
      ],
      jsunit: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    track: {    
      js: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:js', 'karma:unit:run']
      }   
    }
  };//taskConfig

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.renameTask( 'watch', 'track' );
  

  grunt.registerTask( 'test', ['karma:continuous']);
  grunt.registerTask( 'watch', [
   // 'karma:unit',
    'track' 
    ]);
 

};
