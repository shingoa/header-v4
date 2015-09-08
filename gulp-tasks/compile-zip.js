'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');
var argv = require('yargs').argv;

gulp.task('compile-zip', ['compile'], function()
{
	return gulp.src('./compiled/' + argv.t + '/**/*')
		.pipe(zip(argv.t + '.zip'))
	    .pipe(gulp.dest('dist'));
});
