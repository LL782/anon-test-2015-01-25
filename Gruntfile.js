/*global module:true, require:true */
module.exports = function(grunt) {

  grunt.initConfig({

    // JS tasks
    jshint: {
      files: ['Gruntfile.js', 'assets/src/js/**/*.js', 'test/**/*.js'],
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
          jQuery: true,
          $: true,
          Modernizr: true
        }
      }
    },

    // CSS Preprocessor
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

    // Misc tasks
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

  // Load tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register tasks
  grunt.registerTask('js', ['jshint']);
  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', [
    'jshint','sass'
  ]);

};