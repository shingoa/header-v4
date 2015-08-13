'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var jshint = require('gulp-jshint');

gulp.task('build-js', ['init-repo'], function ()
{
	if (argv.t != "local")
		throw "Builds can only be performed locally"

	return gulp.src('./js/**/*.js')
		.pipe(jshint())
		.pipe(gulp.dest('./built/js'));
});
