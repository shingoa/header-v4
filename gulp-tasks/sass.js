'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('./sass/**/*.scss')
		.pipe(sass({
			outputStyle: "expanded",
			indentType: "tab",
			indentWidth: 1,
			sourceComments: true
		}).on('error', sass.logError))
		.pipe(gulp.dest('./built/css'));
});
