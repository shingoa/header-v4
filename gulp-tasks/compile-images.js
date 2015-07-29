'use strict';

var gulp = require('gulp');

gulp.task('compile-images', function()
{
	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./compiled/images'));
});
