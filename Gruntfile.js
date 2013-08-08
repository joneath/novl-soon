'use strict';

var path = require('path');

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    watch: {
      handlebars: {
        files: 'templates/{,*/}*.hbs',
        tasks: ['handlebars']
      },
      trigger: {
        files: [
            'routes/*',
            'app'
        ],
        tasks: ['express']
      }
    },
    express: {
      server: {
        options: {
          port: 3000,
          hostname: "10.0.1.34",
          bases: [path.resolve('public')],
          monitor: {},
          debug: true,
          server: path.resolve('app')
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            return filename.replace("templates/", "");
          }
        },
        files: {
          "public/templates.js": "templates/*.hbs"
        }
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function (target) {
      grunt.task.run([
          'handlebars',
          'express',
          'watch'
      ]);
  });

  // Default task.
  grunt.registerTask('default', ['server']);
};
