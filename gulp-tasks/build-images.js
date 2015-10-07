'use strict';

var gulp = require('gulp');
var xrxhelpers = require('./_helpers.js');

gulp.task('build-images', ['init-repo'], function()
{
	var tier = xrxhelpers.getPassedArg("tier");

	if (tier != "local")
		throw "Builds can only be performed locally"

	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./built/css/images'));
});
