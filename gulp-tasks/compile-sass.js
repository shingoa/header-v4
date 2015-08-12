'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var xrxhelpers = require('./_helpers.js');
var argv = require('yargs').argv;

gulp.task('compile-sass', ['init-repo', 'clean'], function () {
	var version = xrxhelpers.getPackageVersion();

	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "compressed",
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled/' + argv.t + '/css/' + version));
});
