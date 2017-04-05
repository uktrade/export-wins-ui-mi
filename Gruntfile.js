
module.exports = function( grunt ){

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today( "yyyy-mm-dd" ) %> */\n'
			}
		},

		clean: {
			dist: [ 'dist' ]
		},

		copy: {

			main: {
				files: [
					{
						expand: true,
						src: [ 'server.js', 'package.json', 'npm-shrinkwrap.json' ],
						dest: 'dist/'
					},{
						expand: true,
						src: [ 'run/**/*', '!**/*.{log,pid}' ],
						dest: 'dist/'
					}
				]
			},

			app: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [ 'app/**/*', '!**/*.{js,es}hintrc' ],
						dest: 'dist/'
					}
				]
			},

			pub: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [ 'public/**/*', '!*/{sass,css,js}/**', '!**/*.{js,es}hintrc', '!**/*.map' ],
						dest: 'dist/'
					}
				]
			},

			stubs: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [ 'stubs/**/*' ],
						dest: 'dist/'
					}
				]
			}
		},

		useminPrepare: {
			html: 'dist/app/views/layout.html'
		},

		usemin: {
			html: 'dist/app/views/**/*.html',
			js: 'dist/**/*.js',
			css: 'dist/public/**/*.css',
			options: {
				assetsDirs: [ 'dist', 'dist/public' ],
				patterns: {
					js: [
						[ /(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images' ]
					]
				}
			}
		},

		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			pub: {
				src: [ 'dist/public/**/*', '!**/govuk-*/**' ]
			}
		},

		replace: {
			govuk: {
				options: {
					patterns: [
						{
							match: /(font-family: )"nta",/,
							replace: '$1'
						}
					]
				},
				files: [
					{
						expand: true,
						cwd: 'src/public/govuk-<%= pkg[ \'govuk-template-version\' ] %>',
						src: [ '**/*.css' ],
						dest: 'src/public/govuk-<%= pkg[ \'govuk-template-version\' ] %>/'
					}
				]
			}
		}
	});

	require( 'load-grunt-tasks' )( grunt );

	grunt.registerTask( 'dist', [ 'default:dev' ] );

	grunt.registerTask( 'default', 'Default prod build', function(){

		grunt.task.run([
			'clean',
			'copy',
			'useminPrepare',
			'concat:generated',
			'cssmin:generated',
			'uglify:generated',
			'filerev',
			'usemin'
		]);
	} );

	grunt.registerTask( 'template-font', 'Remove the govuk font from the template', [ 'replace:govuk'] );
};
