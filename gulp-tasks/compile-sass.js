'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-sass', ['init-repo'], function ()
{
	var version = xrxhelpers.getPackageVersion();
	var tier = xrxhelpers.getPassedArg("tier");

	var hasComments = true;
	if (tier == "prod" || tier == "test")
	{
		hasComments = false;
	}

	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "compressed",
			sourceComments: hasComments
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled/' + tier + '/css/' + version));
});
