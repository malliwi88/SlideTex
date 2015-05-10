module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        concat: {
            webapp: {
                options: {
                    separator: ';'
                },
                src: ['webapp/scripts/**/*.js'],
                dest: 'webapp/includes/app.js'
            }
        },
        watch: {
            webappScripts: {
                files: ['webapp/scripts/**/*.js'],
                tasks: ['concat:webapp'],
                options: {
                    interrupt: true
                }
            },
            webappSass: {
                files: ['webapp/sass/**/*.scss'],
                tasks: ['compass'],
                options: {
                    interrupt: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'webapp',
                    keepalive: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('buildWebapp', ['compass', 'concat']);

    // Default task(s).
    grunt.registerTask('default', ['buildWebapp']);

};