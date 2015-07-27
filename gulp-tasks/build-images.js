'use strict';

var gulp = require('gulp');

gulp.task('build-images', function()
{
	gulp.src(['./images/**/*'])
		.pipe(gulp.dest('./built/images'));
});
