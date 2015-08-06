'use strict';

var gulp = require('gulp');

gulp.task('init-repo', function()
{
	return gulp.src(['./hooks/**/*'])
		.pipe(gulp.dest('./.git/hooks/'));
});
