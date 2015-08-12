'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');
var argv = require('yargs').argv;

gulp.task('compile-zip', ['clean', 'compile-html', 'compile-images', 'compile-sass'], function()
{
	return gulp.src('./compiled/' + argv.t + '/**/*')
		.pipe(zip(argv.t + '.zip'))
	    .pipe(gulp.dest('dist'));
});
