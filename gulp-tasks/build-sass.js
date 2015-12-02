'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var xrxhelpers = require('./_helpers.js');

gulp.task('build-sass', ['init-repo'], function ()
{
	var tier = xrxhelpers.getPassedArg("tier");

	if (tier != "local")
		throw "Builds can only be performed locally"

	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "nested",
			indentType: "tab",
			indentWidth: 1,
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(gulp.dest('./built/css'));
});
