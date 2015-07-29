'use strict';

var gulp = require('gulp');

gulp.task('build-images', function()
{
	return gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./built/images'));
});
