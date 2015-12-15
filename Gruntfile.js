module.exports = function(grunt) {
	grunt.initConfig({
		copy: {
			main: {
				files: [
					{
						cwd: 'bower_components/',
						expand: true,
						flatten: true,
						src: [
							'backbone/backbone-min.js',
							'backbone.localStorage/backbone.localStorage-min.js',
							'backbone.obscura/backbone.obscura.js',
							'bootstrap/dist/js/bootstrap.min.js',
							'bootstrap-validator/dist/validator.min.js',
							'jquery/dist/jquery.min.js',
							'requirejs/require.js',
							'text/text.js',
							'underscore/underscore-min.js',
						],
						dest: 'js/lib/',
					},
					{
						cwd: 'bower_components/',
						expand: true,
						flatten: true,
						src: [
							'bootstrap/dist/css/bootstrap-theme.min.css',
							'bootstrap/dist/css/bootstrap.min.css',
						],
						dest: 'css/',
					},
					{
						cwd: 'bower_components/',
						expand: true,
						flatten: true,
						src: [
							'bootstrap/dist/fonts/**',
						],
						filter: 'isFile',
						dest: 'fonts/',
					},
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['copy']);
};