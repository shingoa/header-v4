'use strict';

var gulp = require('gulp');
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-images', function()
{
	var version = xrxhelpers.getPackageVersion();

	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./compiled/' + version + '/images'));
});
