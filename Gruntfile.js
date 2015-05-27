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
                src: [
                    'webapp/scripts/_prototypes.js',
                    'webapp/scripts/Bootstrap.js',
                    'webapp/scripts/**/*.js'
                ],
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
        copy: {
            // creates a runnable build with a smaller footprint
            deployBuild: {
                expand: true,
                cwd: './',
                src: [
                    '**',
                    '!.sass-cache/**',
                    '!tmp/**',
                    '!webapp/libs/ace-builds/**',
                    'webapp/libs/ace-builds/src-min-noconflict/**',
                    '!node_modules/grunt*/**'
                ],
                dest: 'tmp/SlideTex'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('buildWebapp', ['compass', 'concat']);

    // Default task(s).
    grunt.registerTask('default', ['buildWebapp']);

};