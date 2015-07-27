'use strict';

var gulp = require('gulp');

gulp.task('compile-images', function()
{
	gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./compiled/images'));
});
