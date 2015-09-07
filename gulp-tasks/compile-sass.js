'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;

gulp.task('compile-sass', ['init-repo'], function () {
	var version = xrxhelpers.getPackageVersion();

	var hasComments = true;
	if (argv.t == "prod" || argv.t == "test")
	{
		hasComments = false;
	}

	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "compressed",
			sourceComments: hasComments
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled/' + argv.t + '/css/' + version));
});
