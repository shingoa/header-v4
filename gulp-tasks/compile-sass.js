'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var xrxhelpers = require('./_helpers.js');

gulp.task('compile-sass', function () {
	var version = xrxhelpers.getPackageVersion();

	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "compressed",
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled/' + version + '/css'));
});
