'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('compile-zip', ['compile-html', 'compile-images', 'compile-sass'], function()
{
	return gulp.src('./compiled/**/*')
		.pipe(zip('release.zip'))
	    .pipe(gulp.dest('dist'));
});
