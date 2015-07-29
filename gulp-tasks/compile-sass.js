'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('compile-sass', function () {
	return gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "compressed",
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(gulp.dest('./compiled/css'));
});
