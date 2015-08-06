'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;

gulp.task('build-images', function()
{
	if (argv.t != "local")
		throw "Builds can only be performed locally"

	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./built/images'));
});
