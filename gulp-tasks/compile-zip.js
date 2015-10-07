'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-zip', ['compile'], function()
{
	var tier = xrxhelpers.getPassedArg("tier");

	return gulp.src('./compiled/' + tier + '/**/*')
		.pipe(zip(tier + '.zip'))
	    .pipe(gulp.dest('dist'));
});
