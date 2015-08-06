'use strict';

var gulp = require('gulp');
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;

gulp.task('compile-images', ['init-repo'], function()
{
	var version = xrxhelpers.getPackageVersion();

	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./compiled/' + argv.t + '/' + version + '/images'));
});
