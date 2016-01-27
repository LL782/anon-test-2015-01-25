/*global module:true, require:true */
module.exports = function(grunt) {


  /********************
    LOAD DEPENDANCIES
  ********************/

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  /********************
    CONFIGURE TASKS
  ********************/

  grunt.initConfig({


    /****************************************
      JS TASKS
    ****************************************/

    jshint: {
      files: [
        'Gruntfile.js',
        'assets/src/js/controllers/*.js',
        'assets/src/js/mods/*.js',
        'tests/**/*.js'
      ],
      options: {
        // enforcers
        camelcase: true, // vars are camelCase or UPPER_UNDERSCORED
        curly: true, // use curly bracket syntax
        eqeqeq: true, // use precise comparison
        maxcomplexity: 7, // max cyclomatic complexity count of 7 per function
        maxparams: 4, // max of 4 arguments per function - if you need more, use an object!
        maxstatements: 15, // max of 15 statements per function - keep methods to the point!
        noempty: true, // no empty blocks in code
        nonbsp: true, // warns about hidden chars which can use UTF-8 problems
        quotmark: 'single', // use single quotes
        undef: true, // cannot use undefined variables

        // relaxers
        browser: true, // codebase intended to run in browser
        forin: false, // allow for in loops without property check wrappers
        newcap: false, // allow uppercase object names which are not constructors
        nomen: false, // allow _ preceeding a variable
        sub: true, // don't enforce dot notation (e.g. my['thing'] is acceptable as is my.thing)
        
        globals: {

          // Assume jQuery globals
          jQuery: true,
          $: true,

          // Assume Require globals
          define: true,

          // Assume jasmine globals
          describe: true,
          beforeEach: true,
          afterEach: true,
          it: true,
          xit: true,
          expect: true,
          jasmine: true

        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'assets/src/js',
          dir: 'assets/js',
          optimize: 'uglify',
          mainConfigFile:'assets/src/js/main.js',
          modules:[
            {
              name:'main'
            }
          ]
        }
      }
    },

    /****************************************
      TEST RUNNERS
    ****************************************/

    jasmine: {
      src: {
        options: {
          vendor: ['assets/src/js/libs/jquery.js'],
          specs: 'tests/jasmine/**/*Spec.js',
          template: require('grunt-template-jasmine-requirejs'),
          keepRunner: true,
          templateOptions: {
            requireConfig: {
              baseUrl: 'assets/src/js'
            }
          }
        }
      },
    },


    /****************************************
      CSS TASKS
    ****************************************/

    sass: {
      src: {
        options: {
          style: 'expanded',
          sourcemap: 'auto'
        },
        files: {
           'assets/src/css/main.css': 'assets/src/css/main.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'assets/css/main.css': 'assets/src/css/main.scss'
        }
      }
    },


    /********************
      MISC TASKS
    ********************/

    watch: {
      all: {
        files: [
          '<%= jshint.files %>',
          '<%= sass.files %>'
        ],
        tasks: [ 'default' ]
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: [ 'js' ]
      },
      css: {
        files: ['assets/src/css/*'],
        tasks: [ 'css' ]
      },
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: {
        tasks: ['watch:js', 'watch:css']
      }
    },
  });


  /********************
    CUSTOM TASKS
  ********************/
  grunt.registerTask('js', [
    'jshint',
    'jasmine',
    'requirejs'
  ]);

  grunt.registerTask('tests', [
    'jshint',
    'jasmine'
  ]);

  grunt.registerTask('css', ['sass']);

  grunt.registerTask('default', [
    'jshint',
    'requirejs',
    'sass'
  ]);

};